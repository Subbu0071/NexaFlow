import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Printer,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Filter,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

const PAGE_SIZE = 10;

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  status: "new",
};

const statuses = ["new", "contacted", "qualified", "converted", "lost"];

const statusStyles = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  qualified: "bg-violet-50 text-violet-700",
  converted: "bg-emerald-50 text-emerald-700",
  lost: "bg-rose-50 text-rose-700",
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/leads", {
        params: {
          page,
          limit: PAGE_SIZE,
          search: search.trim(),
          status,
          sortBy,
          sortOrder,
        },
      });

      const payload = response.data;

      const leadData = Array.isArray(payload)
        ? payload
        : (payload?.data?.leads ??
          payload?.data?.rows ??
          payload?.data ??
          payload?.leads ??
          payload?.rows ??
          []);

      if (!Array.isArray(leadData)) {
        throw new Error("Unexpected leads API response format.");
      }

      setLeads(leadData);

      const pagination =
        payload?.pagination ?? payload?.data?.pagination ?? payload?.meta ?? {};

      setTotalLeads(
        pagination.total ??
          pagination.totalItems ??
          payload?.total ??
          leadData.length,
      );

      setTotalPages(
        pagination.totalPages ??
          Math.max(
            1,
            Math.ceil(
              (pagination.total ??
                pagination.totalItems ??
                payload?.total ??
                leadData.length) / PAGE_SIZE,
            ),
          ),
      );
    } catch (err) {
      console.error("Fetch leads error:", err);
      setError(err.response?.data?.message || "Unable to load leads.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, sortBy, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 0);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const openAddModal = () => {
    setEditingLead(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name || "",
      email: lead.email || "",
      mobile: lead.mobile || "",
      status: lead.status || "new",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLead(null);
    setFormData(initialForm);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.mobile.trim()) {
      toast.error("Name and mobile number are required.");
      return;
    }

    try {
      setSubmitting(true);

      const details = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        mobile: formData.mobile.trim(),
      };

      if (editingLead) {
        await api.patch(`/leads/${editingLead.id}`, {
          ...details,
          status: formData.status,
        });
        toast.success("Lead updated successfully.");
      } else {
        await api.post("/leads", details);
        toast.success("Lead created successfully.");
      }

      closeModal();
      setPage(1);
      await fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to save lead.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (lead) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${lead.name}?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/leads/${lead.id}`);
      toast.success("Lead deleted successfully.");

      if (leads.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        await fetchLeads();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete lead.");
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/leads/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = "nexaflow-leads.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Leads exported successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Export failed.");
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select an Excel file first.");
      return;
    }

    try {
      setImporting(true);

      const data = new FormData();
      data.append("file", selectedFile);

      await api.post("/leads/import", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Leads imported successfully.");
      setSelectedFile(null);
      setPage(1);
      await fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || "Import failed.");
    } finally {
      setImporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-semibold text-indigo-600">
            BUSINESS MANAGEMENT
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Leads Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create, organize and track your business leads.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add New Lead
        </button>
      </section>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Total matching leads
            </p>
            <Users className="text-indigo-600" size={22} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {loading ? "—" : totalLeads}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Current page</p>
            <Filter className="text-violet-600" size={22} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {page}{" "}
            <span className="text-lg text-slate-400">/ {totalPages}</span>
          </h2>
        </div>
      </section>

      {/* Filters and actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name, email or mobile..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <select
              value={status}
              onChange={handleStatusChange}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="all">All statuses</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={handleSortChange}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="createdAt">Date created</option>
              <option value="name">Name</option>
            </select>

            <select
              value={sortOrder}
              onChange={handleSortOrderChange}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download size={15} />
              Export Excel
            </button>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Upload size={15} />
              Choose Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] || null)
                }
              />
            </label>

            {selectedFile && (
              <button
                onClick={handleImport}
                disabled={importing}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {importing ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <Upload size={15} />
                )}
                Import
              </button>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Printer size={15} />
              Print
            </button>

            {selectedFile && (
              <span className="max-w-full truncate text-xs text-slate-500">
                {selectedFile.name}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Leads table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">All Leads</h2>
            <p className="mt-1 text-xs text-slate-500">
              Showing {leads.length} records on this page
            </p>
          </div>
        </div>

        {error ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-rose-600">Unable to load leads</p>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              onClick={fetchLeads}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-sm text-slate-500">
            <LoaderCircle className="animate-spin" size={20} />
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={34} className="mx-auto text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-800">
              No leads found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or add a new lead.
            </p>
            <button
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={16} />
              Add your first lead
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Lead details</th>
                  <th className="px-5 py-4 font-semibold">Email</th>
                  <th className="px-5 py-4 font-semibold">Mobile</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Created</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {lead.name}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {lead.email || "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-500">{lead.mobile}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[lead.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(lead)}
                          title="Edit lead"
                          className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead)}
                          title="Delete lead"
                          className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && leads.length > 0 && (
          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages} · {totalLeads} matching leads
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Add/Edit modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingLead ? "Edit Lead" : "Add New Lead"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the lead's contact information.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full name *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  maxLength={100}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  maxLength={150}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Mobile number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFormChange}
                  required
                  maxLength={16}
                  placeholder="Enter mobile number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {editingLead && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Lead status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  >
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                  {editingLead ? "Save Changes" : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          table, table * {
            visibility: visible;
          }
          table {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default Leads;

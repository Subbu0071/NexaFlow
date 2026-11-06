import { useCallback, useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Activity,
  CalendarDays,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import api from "../services/api";

// --------------------------------------------------
// CONSTANTS
// --------------------------------------------------

const STATUS_COLORS = {
  new: "#3B82F6",
  contacted: "#F59E0B",
  qualified: "#8B5CF6",
  converted: "#10B981",
  lost: "#F43F5E",
};

const STATUS_STYLES = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  qualified: "bg-violet-50 text-violet-700",
  converted: "bg-emerald-50 text-emerald-700",
  lost: "bg-rose-50 text-rose-700",
};

const DATE_FILTERS = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7days" },
  { label: "Last 30 Days", value: "last30days" },
  { label: "This Month", value: "thisMonth" },
  { label: "Custom Range", value: "custom" },
];

// --------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------

// Format dates for display.
const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Format dates for the growth chart.
const formatChartDate = (date) => {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

// Reusable KPI card.
const StatCard = ({ title, value, description, icon: Icon, color }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </h3>

        <p className="mt-2 text-xs text-slate-500">{description}</p>
      </div>

      <div className={`shrink-0 rounded-xl p-3 ${color}`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

// Reusable section heading.
const SectionHeading = ({ icon: Icon, title, description }) => (
  <div className="mb-5 flex items-center gap-3">
    <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
      <Icon size={20} />
    </div>

    <div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  </div>
);

// --------------------------------------------------
// DASHBOARD COMPONENT
// --------------------------------------------------

function Dashboard() {
  const navigate = useNavigate();

  // Dashboard data from the backend.
  const [dashboardStats, setDashboardStats] = useState(null);

  // Loading and error states.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected date filter.
  const [dateRange, setDateRange] = useState("last30days");

  // Custom date filter values.
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // The currently applied custom date range.
  const [appliedDates, setAppliedDates] = useState(null);

  // ------------------------------------------------
  // FETCH DASHBOARD DATA
  // ------------------------------------------------

  const fetchDashboardData = useCallback(
    async (range = dateRange, customDates = appliedDates) => {
      try {
        setLoading(true);
        setError("");

        // Prepare query parameters for the backend.
        const params = { range };

        if (range === "custom") {
          if (!customDates?.startDate || !customDates?.endDate) {
            setLoading(false);
            return;
          }

          params.startDate = customDates.startDate;
          params.endDate = customDates.endDate;
        }

        // Fetch statistics from the protected API.
        const response = await api.get("/leads/stats", { params });

        const dashboardData = response.data?.data;

        if (!dashboardData) {
          throw new Error("Invalid dashboard response.");
        }

        setDashboardStats(dashboardData);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    },
    [dateRange, appliedDates],
  );

  // Load dashboard data when the page opens.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchDashboardData]);

  // ------------------------------------------------
  // DATE FILTER HANDLERS
  // ------------------------------------------------

  const handleDateRangeChange = (value) => {
    setDateRange(value);

    // Preset filters are applied immediately.
    if (value !== "custom") {
      setAppliedDates(null);
      fetchDashboardData(value, null);
    }
  };

  const handleCustomDateFilter = () => {
    if (!startDate || !endDate) {
      setError("Please select both start date and end date.");
      return;
    }

    if (startDate > endDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    const customDates = { startDate, endDate };

    setAppliedDates(customDates);
    fetchDashboardData("custom", customDates);
  };

  const handleRefresh = () => {
    fetchDashboardData(dateRange, appliedDates);
  };

  // ------------------------------------------------
  // DERIVED DASHBOARD DATA
  // ------------------------------------------------

  const totalLeads = dashboardStats?.totalLeads ?? 0;

  const statusCounts = dashboardStats?.statusCounts ?? {};

  const recentLeads = dashboardStats?.recentLeads ?? [];

  const growthData = dashboardStats?.growth ?? [];

  const conversionRate = dashboardStats?.conversionRate ?? 0;

  // Status distribution data for the donut chart.
  const statusData = [
    { name: "New", value: Number(statusCounts.new ?? 0), key: "new" },
    {
      name: "Contacted",
      value: Number(statusCounts.contacted ?? 0),
      key: "contacted",
    },
    {
      name: "Qualified",
      value: Number(statusCounts.qualified ?? 0),
      key: "qualified",
    },
    {
      name: "Converted",
      value: Number(statusCounts.converted ?? 0),
      key: "converted",
    },
    { name: "Lost", value: Number(statusCounts.lost ?? 0), key: "lost" },
  ];

  // ------------------------------------------------
  // KPI CARDS
  // ------------------------------------------------

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      description: "Leads created in selected period",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "New Leads",
      value: statusCounts.new ?? 0,
      description: "Awaiting initial follow-up",
      icon: UserPlus,
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Contacted Leads",
      value: statusCounts.contacted ?? 0,
      description: "Initial contact completed",
      icon: Activity,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Qualified Leads",
      value: statusCounts.qualified ?? 0,
      description: "Potential customers identified",
      icon: UserCheck,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Converted Leads",
      value: statusCounts.converted ?? 0,
      description: "Successfully converted",
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Lost Leads",
      value: statusCounts.lost ?? 0,
      description: "Leads not converted",
      icon: Users,
      color: "bg-rose-50 text-rose-600",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      description: "Converted / total leads",
      icon: TrendingUp,
      color: "bg-cyan-50 text-cyan-600",
    },
  ];

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------

  return (
    <div className="min-h-full space-y-7">
      {/* PAGE HEADING */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-600">
            BUSINESS OVERVIEW
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor your leads and business activity from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={() => navigate("/admin/leads")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={17} />
            Manage Leads
          </button>
        </div>
      </section>

      {/* WELCOME BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-indigo-800 p-6 text-white shadow-sm sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-medium text-indigo-200">
            NEXAFLOW BUSINESS MANAGEMENT SUITE
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            Manage smarter. Grow faster.
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-indigo-100">
            Keep track of enquiries, manage your leads and monitor business
            performance with a unified workspace.
          </p>

          <button
            onClick={() => navigate("/admin/leads")}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50"
          >
            Explore Leads
            <ArrowUpRight size={17} />
          </button>
        </div>

        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-32 right-28 h-64 w-64 rounded-full border-[35px] border-white/5" />
      </section>

      {/* DATE FILTER SECTION */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={19} className="text-indigo-600" />

          <h2 className="font-bold text-slate-900">Filter Dashboard Data</h2>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-xs">
            <label
              htmlFor="dateRange"
              className="mb-2 block text-sm font-medium text-slate-600"
            >
              Select Date Range
            </label>

            <select
              id="dateRange"
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {DATE_FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom date inputs */}
          {dateRange === "custom" && (
            <div className="grid w-full gap-3 sm:grid-cols-2 lg:flex lg:flex-1">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Start Date
                </label>

                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="min-w-0 flex-1">
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  End Date
                </label>

                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                onClick={handleCustomDateFilter}
                disabled={loading || !startDate || !endDate}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 lg:self-end"
              >
                <Search size={16} />
                Apply
              </button>
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Dashboard statistics and charts are based on the selected creation
          date range.
        </p>
      </section>

      {/* PERFORMANCE OVERVIEW */}
      <section>
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <h2 className="text-lg font-bold text-slate-900">
            Performance Overview
          </h2>

          <span className="text-xs text-slate-400">
            Based on selected date range
          </span>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
            <p className="text-sm font-semibold text-rose-700">
              Could not load dashboard statistics
            </p>

            <p className="mt-1 text-sm text-rose-600">{error}</p>

            <button
              onClick={handleRefresh}
              className="mt-3 text-sm font-semibold text-rose-700 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                {...stat}
                value={loading ? "—" : stat.value}
              />
            ))}
          </div>
        )}
      </section>

      {/* CHARTS SECTION */}
      {!error && (
        <section>
          <SectionHeading
            icon={BarChart3}
            title="Analytics & Insights"
            description="Understand your lead distribution and growth trends."
          />

          <div className="grid gap-5 xl:grid-cols-2">
            {/* STATUS DISTRIBUTION DONUT CHART */}
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <PieChartIcon size={19} className="text-indigo-600" />

                <h3 className="font-bold text-slate-900">
                  Lead Status Distribution
                </h3>
              </div>

              {loading ? (
                <div className="flex h-72 items-center justify-center text-sm text-slate-400">
                  Loading chart...
                </div>
              ) : totalLeads === 0 ? (
                <div className="flex h-72 flex-col items-center justify-center text-center">
                  <PieChartIcon size={35} className="text-slate-300" />

                  <p className="mt-3 font-semibold text-slate-700">
                    No lead data available
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Leads will appear here once created.
                  </p>
                </div>
              ) : (
                <div className="h-72 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={3}
                        cornerRadius={5}
                      >
                        {statusData.map((item) => (
                          <Cell key={item.key} fill={STATUS_COLORS[item.key]} />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value, name) => [`${value} leads`, name]}
                      />

                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{ fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* LEAD GROWTH LINE CHART */}
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={19} className="text-indigo-600" />

                <h3 className="font-bold text-slate-900">Lead Growth Trend</h3>
              </div>

              {loading ? (
                <div className="flex h-72 items-center justify-center text-sm text-slate-400">
                  Loading chart...
                </div>
              ) : growthData.length === 0 ? (
                <div className="flex h-72 flex-col items-center justify-center text-center">
                  <TrendingUp size={35} className="text-slate-300" />

                  <p className="mt-3 font-semibold text-slate-700">
                    No growth data available
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Lead activity will appear here.
                  </p>
                </div>
              ) : (
                <div className="h-72 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={growthData}
                      margin={{
                        top: 10,
                        right: 15,
                        left: -15,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />

                      <XAxis
                        dataKey="date"
                        tickFormatter={formatChartDate}
                        tick={{ fontSize: 11, fill: "#64748B" }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={20}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: "#64748B" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        labelFormatter={(label) =>
                          formatDate(`${label}T00:00:00`)
                        }
                        formatter={(value) => [`${value} leads`, "New Leads"]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #E2E8F0",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="count"
                        name="New Leads"
                        stroke="#6366F1"
                        strokeWidth={3}
                        dot={{
                          r: 3,
                          fill: "#6366F1",
                          strokeWidth: 2,
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* RECENT LEADS */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <Activity size={19} className="text-indigo-600" />

              <h2 className="text-lg font-bold text-slate-900">Recent Leads</h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Latest enquiries in the selected period.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/leads")}
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View all leads
            <ArrowUpRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading recent leads...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Recent leads are unavailable.
          </div>
        ) : recentLeads.length === 0 ? (
          <div className="p-10 text-center">
            <Users size={30} className="mx-auto text-slate-300" />

            <p className="mt-3 font-semibold text-slate-700">
              No leads available yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              New enquiries will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Lead</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Mobile</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Created</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {lead.name}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {lead.email || "—"}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {lead.mobile}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            STATUS_STYLES[lead.status] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {lead.status || "Unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile lead cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="space-y-2 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-800">{lead.name}</p>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        STATUS_STYLES[lead.status] ||
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {lead.status || "Unknown"}
                    </span>
                  </div>

                  <p className="break-all text-sm text-slate-500">
                    {lead.email || "No email"}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>{lead.mobile}</span>

                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={13} />
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* FOOTER */}
      <p className="pb-3 text-center text-xs text-slate-400">
        NexaFlow · Business Management Suite
      </p>
    </div>
  );
}

export default Dashboard;

const { Lead } = require("../models");
const { Op, fn, col } = require("sequelize");const ExcelJS = require("exceljs");

// Validate common lead fields
const validateLeadDetails = ({ name, mobile, email }) => {
  if (!name || typeof name !== "string" || !name.trim()) {
    return "Lead name is required.";
  }

  if (name.trim().length > 100) {
    return "Name cannot exceed 100 characters.";
  }

  if (!mobile || typeof mobile !== "string" || !mobile.trim()) {
    return "Mobile number is required.";
  }

  if (mobile.trim().length > 16) {
    return "Mobile number cannot exceed 16 characters.";
  }

  if (
    email &&
    (typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
  ) {
    return "Please provide a valid email address.";
  }

  return null;
};

// ADMIN: Create a lead manually
const createLead = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    const validationError = validateLeadDetails({
      name,
      email,
      mobile,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email?.trim().toLowerCase() || null,
      mobile: mobile.trim(),
      status: "new",
      ownerId: req.user.id,
      submittedById: null,
    });

    return res.status(201).json({
      success: true,
      message: "Lead created successfully.",
      data: lead,
    });
  } catch (error) {
    console.error("Create lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create lead.",
    });
  }
};

// USER: Submit a customer enquiry
const submitEnquiry = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    const validationError = validateLeadDetails({
      name,
      email,
      mobile,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email?.trim().toLowerCase() || null,
      mobile: mobile.trim(),
      status: "new",
      ownerId: null,
      submittedById: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted successfully.",
      data: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        mobile: lead.mobile,
        status: lead.status,
        createdAt: lead.createdAt,
      },
    });
  } catch (error) {
    console.error("Submit enquiry error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your enquiry.",
    });
  }
};

// GET: Retrieve leads with pagination, search, filtering and sorting
const getLeads = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      status = "all",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Validate pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid page or limit. Limit must be between 1 and 100.",
      });
    }

    // Validate status filter
    const allowedStatuses = [
      "new",
      "contacted",
      "qualified",
      "converted",
      "lost",
    ];

    if (status !== "all" && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead status.",
      });
    }

    // Validate sorting
    const allowedSortFields = ["createdAt", "name"];
    const sortFieldMap = {
      createdAt: "createdAt",
      name: "name",
    };

    if (
      !allowedSortFields.includes(sortBy) ||
      !["asc", "desc"].includes(order.toLowerCase())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid sorting parameters.",
      });
    }

    // Always scope results according to authenticated role
    const where = {};

    if (req.user.role === "admin") {
      // Admin can see all leads
    } else if (req.user.role === "user") {
      where.submittedById = req.user.id;
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    // Apply status filter
    if (status !== "all") {
      where.status = status;
    }

    // Apply search
    if (search.trim()) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search.trim()}%` } },
        { email: { [Op.iLike]: `%${search.trim()}%` } },
        { mobile: { [Op.iLike]: `%${search.trim()}%` } },
      ];
    }

    const offset = (pageNumber - 1) * limitNumber;

    const { count, rows } = await Lead.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
      order: [[sortFieldMap[sortBy], order.toUpperCase()]],
      attributes: [
        "id",
        "name",
        "email",
        "mobile",
        "status",
        "ownerId",
        "submittedById",
        "createdAt",
        "updatedAt",
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Leads retrieved successfully.",
      data: {
        leads: rows,
        pagination: {
          totalRecords: count,
          currentPage: pageNumber,
          totalPages: Math.ceil(count / limitNumber),
          pageSize: limitNumber,
          hasNextPage: pageNumber * limitNumber < count,
          hasPreviousPage: pageNumber > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get leads error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve leads.",
    });
  }
};


const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, status } = req.body;

    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    const allowedStatuses = [
      "new",
      "contacted",
      "qualified",
      "converted",
      "lost",
    ];

    if (status !== undefined && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead status.",
      });
    }

    const updatedDetails = {
      name: name === undefined ? lead.name : name,
      email: email === undefined ? lead.email : email,
      mobile: mobile === undefined ? lead.mobile : mobile,
    };

    const validationError = validateLeadDetails(updatedDetails);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    await lead.update({
      name: updatedDetails.name.trim(),
      email: updatedDetails.email?.trim().toLowerCase() || null,
      mobile: updatedDetails.mobile.trim(),
      ...(status !== undefined && { status }),
    });

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully.",
      data: lead,
    });
  } catch (error) {
    console.error("Update lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update lead.",
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    await lead.destroy();

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    console.error("Delete lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete lead.",
    });
  }
};

// ADMIN: Export leads to Excel
const exportLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "mobile",
        "status",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Leads");

    worksheet.columns = [
      { header: "ID", key: "id", width: 38 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Mobile", key: "mobile", width: 18 },
      { header: "Status", key: "status", width: 18 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    worksheet.addRows(
      leads.map((lead) => ({
        ...lead.toJSON(),
        createdAt: lead.createdAt,
      }))
    );

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="NexaFlow-Leads.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export leads error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to export leads.",
      });
    }
  }
};

// ADMIN: Import leads from Excel
const importLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an Excel file.",
      });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      return res.status(400).json({
        success: false,
        message: "Excel worksheet is empty.",
      });
    }

    const headers = worksheet.getRow(1).values
      .slice(1)
      .map((value) => String(value || "").trim().toLowerCase());

    const requiredHeaders = ["name", "email", "mobile"];

    if (!requiredHeaders.every((header) => headers.includes(header))) {
      return res.status(400).json({
        success: false,
        message: "Excel must contain Name, Email and Mobile columns.",
      });
    }

    if (worksheet.rowCount > 501) {
      return res.status(400).json({
        success: false,
        message: "Maximum 500 leads can be imported at once.",
      });
    }

    const columnIndex = (name) => headers.indexOf(name) + 1;
    const importedLeads = [];
    const errors = [];

    const allowedStatuses = [
      "new",
      "contacted",
      "qualified",
      "converted",
      "lost",
    ];

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      if (row.values.slice(1).every((value) => value == null || String(value).trim() === "")) {
        continue;
      }

      const name = String(row.getCell(columnIndex("name")).text || "").trim();
      const email = String(row.getCell(columnIndex("email")).text || "").trim();
      const mobile = String(row.getCell(columnIndex("mobile")).text || "").trim();

      const statusIndex = columnIndex("status");
      const status = statusIndex
        ? String(row.getCell(statusIndex).text || "new").trim().toLowerCase()
        : "new";

      const validationError = validateLeadDetails({
        name,
        email,
        mobile,
      });

      if (validationError) {
        errors.push({
          row: rowNumber,
          message: validationError,
        });
        continue;
      }

      if (!allowedStatuses.includes(status)) {
        errors.push({
          row: rowNumber,
          message: "Invalid lead status.",
        });
        continue;
      }

      importedLeads.push({
        name,
        email: email.toLowerCase() || null,
        mobile,
        status,
        ownerId: req.user.id,
        submittedById: null,
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Import contains invalid rows. No leads were imported.",
        errors,
      });
    }

    if (importedLeads.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid lead records found.",
      });
    }

    await Lead.bulkCreate(importedLeads, {
      validate: true,
    });

    return res.status(201).json({
      success: true,
      message: "Leads imported successfully.",
      data: {
        importedCount: importedLeads.length,
      },
    });
  } catch (error) {
    console.error("Import leads error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to import leads.",
    });
  }
};


// ADMIN: Get dashboard statistics across all leads
const getDashboardStats = async (req, res) => {
  try {
    const statuses = ["new", "contacted", "qualified", "converted", "lost"];
    const { range = "last30days", startDate, endDate } = req.query;

    // Date helpers use India Standard Time.
    const getISTDate = (date = new Date()) =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);

    const addDays = (dateString, days) => {
      const date = new Date(`${dateString}T00:00:00.000Z`);
      date.setUTCDate(date.getUTCDate() + days);
      return date.toISOString().slice(0, 10);
    };

    const today = getISTDate();
    let fromDate;
    let toDate = addDays(today, 1);

    switch (range) {
      case "today":
        fromDate = today;
        break;
      case "last7days":
        fromDate = addDays(today, -6);
        break;
      case "last30days":
        fromDate = addDays(today, -29);
        break;
      case "thisMonth":
        fromDate = `${today.slice(0, 7)}-01`;
        break;
      case "custom": {
        const validDate = (value) =>
          /^\d{4}-\d{2}-\d{2}$/.test(value || "") &&
          !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`));

        if (
          !validDate(startDate) ||
          !validDate(endDate) ||
          startDate > endDate
        ) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid custom date range.",
          });
        }

        const days =
          (Date.parse(`${endDate}T00:00:00.000Z`) -
            Date.parse(`${startDate}T00:00:00.000Z`)) /
          86400000;

        if (days > 365) {
          return res.status(400).json({
            success: false,
            message: "Custom date range cannot exceed 366 days.",
          });
        }

        fromDate = startDate;
        toDate = addDays(endDate, 1);
        break;
      }
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid dashboard date range.",
        });
    }

    // Convert IST calendar boundaries into timestamps.
    const where = {
      createdAt: {
        [Op.gte]: new Date(`${fromDate}T00:00:00+05:30`),
        [Op.lt]: new Date(`${toDate}T00:00:00+05:30`),
      },
    };

    const [totalLeads, groupedStatuses, recentLeads, datedLeads] =
      await Promise.all([
        Lead.count({ where }),

        Lead.findAll({
          where,
          attributes: ["status", [fn("COUNT", col("id")), "count"]],
          group: ["status"],
          raw: true,
        }),

        Lead.findAll({
          where,
          attributes: ["id", "name", "email", "mobile", "status", "createdAt"],
          order: [["createdAt", "DESC"]],
          limit: 5,
        }),

        Lead.findAll({
          where,
          attributes: ["createdAt"],
          raw: true,
        }),
      ]);

    const statusCounts = Object.fromEntries(
      statuses.map((status) => [status, 0]),
    );

    groupedStatuses.forEach((item) => {
      statusCounts[item.status] = Number(item.count);
    });

    const conversionRate =
      totalLeads > 0
        ? Number(((statusCounts.converted / totalLeads) * 100).toFixed(1))
        : 0;

    // Fill missing dates with zero so the chart remains continuous.
    const dailyCounts = {};

    datedLeads.forEach((lead) => {
      const date = getISTDate(new Date(lead.createdAt));
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    const growth = [];
    for (let date = fromDate; date < toDate; date = addDays(date, 1)) {
      growth.push({
        date,
        count: dailyCounts[date] || 0,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully.",
      data: {
        range,
        startDate: fromDate,
        endDate: addDays(toDate, -1),
        totalLeads,
        statusCounts,
        conversionRate,
        recentLeads,
        growth,
      },
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve dashboard statistics.",
    });
  }
};


module.exports = {
  createLead,
  submitEnquiry,
  getLeads,
    updateLead,
    deleteLead,
    exportLeads,
    importLeads,
    getDashboardStats,
};

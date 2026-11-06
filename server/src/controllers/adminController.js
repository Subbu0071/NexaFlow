const {
  User,
  ActiveSession,
  PasswordReset,
  AdminAuditLog,
} = require("../models");

const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
const { sendAccountCredentialsEmail } = require("../services/emailService");

const getUsers = async (req, res) => {
  try {
    const {
      search = "",
      role = "user",
      status = "all",
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Validate pagination
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNumber - 1) * pageSize;

    // Allow only supported roles
    const allowedRoles = ["user", "admin", "all"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role filter.",
      });
    }

    // Allow only supported account statuses
    const allowedStatuses = ["active", "inactive", "all"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status filter.",
      });
    }

    // Prevent arbitrary database column sorting
    const allowedSortFields = ["name", "email", "createdAt"];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sorting field.",
      });
    }

    const order = sortOrder.toLowerCase();

    if (!["asc", "desc"].includes(order)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sorting order.",
      });
    }

    // Build database filters
    const where = {};

    if (role !== "all") {
      where.role = role;
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    // Search by name, email or mobile number
    const searchTerm = search.trim();

    if (searchTerm) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${searchTerm}%` } },
        { email: { [Op.iLike]: `%${searchTerm}%` } },
        { mobile: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: [
        "id",
        "name",
        "email",
        "mobile",
        "role",
        "isActive",
        "createdAt",
      ],
      order: [[sortBy, order.toUpperCase()]],
      limit: pageSize,
      offset,
    });

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      data: rows,
      pagination: {
        totalRecords: count,
        currentPage: pageNumber,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
        hasNextPage: pageNumber < Math.ceil(count / pageSize),
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve users.",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: [
        "id",
        "name",
        "email",
        "mobile",
        "role",
        "isActive",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details retrieved successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Get user details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user details.",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile } = req.body;

    // Find the user
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !mobile?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email and mobile are required.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMobile = mobile.trim();

    // Validate name
    if (normalizedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 100 characters.",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Validate Indian mobile number
    const mobileRegex = /^(?:\+91[- ]?)?[6-9]\d{9}$/;

    if (!mobileRegex.test(normalizedMobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number.",
      });
    }

    // Check whether email or mobile belongs to another user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: normalizedEmail }, { mobile: normalizedMobile }],
        id: { [Op.ne]: id },
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or mobile number is already registered.",
      });
    }

    // Capture previous values for audit history
    const previousValues = {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    };

    // Update user details
    await user.update({
      name: normalizedName,
      email: normalizedEmail,
      mobile: normalizedMobile,
    });

    // Record the change
    await AdminAuditLog.create({
      actorId: req.user.id,
      actorName: req.user.name,
      actorEmail: req.user.email,
      action: "USER_UPDATED",
      targetUserId: user.id,
      targetUserName: user.name,
      targetUserEmail: user.email,
      details: {
        previousValues,
        updatedValues: {
          name: normalizedName,
          email: normalizedEmail,
          mobile: normalizedMobile,
        },
      },
    });

    // Return updated user without password
    return res.status(200).json({
      success: true,
      message: "User details updated successfully.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user details.",
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false.",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.id === req.user.id && !isActive) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account.",
      });
    }

    if (user.isActive === isActive) {
      return res.status(200).json({
        success: true,
        message: `User is already ${isActive ? "active" : "inactive"}.`,
      });
    }

    const { ActiveSession, AdminAuditLog } = require("../models");
    const sequelize = require("../config/database");

    await sequelize.transaction(async (transaction) => {
      await user.update({ isActive }, { transaction });

      // Revoke any existing session
      await ActiveSession.destroy({
        where: { userId: user.id },
        transaction,
      });

      await AdminAuditLog.create(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorEmail: req.user.email,
          action: isActive ? "USER_REACTIVATED" : "USER_DEACTIVATED",
          targetUserId: user.id,
          targetUserName: user.name,
          targetUserEmail: user.email,
          details: {
            previousStatus: !isActive,
            newStatus: isActive,
          },
        },
        { transaction },
      );
    });

    return res.status(200).json({
      success: true,
      message: `User ${isActive ? "reactivated" : "deactivated"} successfully.`,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user status.",
    });
  }
};

const updateUserRole = async (req, res) => {
  const sequelize = require("../config/database");
  const { ActiveSession, AdminAuditLog } = require("../models");

  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate the requested role
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either admin or user.",
      });
    }

    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role.",
      });
    }

    const result = await sequelize.transaction(async (transaction) => {
      const user = await User.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!user) {
        return {
          status: 404,
          body: {
            success: false,
            message: "User not found.",
          },
        };
      }

      const previousRole = user.role;

      if (previousRole === role) {
        return {
          status: 200,
          body: {
            success: true,
            message: `User already has the ${role} role.`,
          },
        };
      }

      // Prevent demotion of the last active Admin
      if (previousRole === "admin" && user.isActive && role === "user") {
        const activeAdmins = await User.findAll({
          where: {
            role: "admin",
            isActive: true,
          },
          attributes: ["id"],
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (activeAdmins.length <= 1) {
          return {
            status: 400,
            body: {
              success: false,
              message: "Cannot demote the last active Admin.",
            },
          };
        }
      }

      await user.update({ role }, { transaction });

      // Revoke the user's existing session
      await ActiveSession.destroy({
        where: { userId: user.id },
        transaction,
      });

      // Record the role change
      await AdminAuditLog.create(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorEmail: req.user.email,
          action: "ROLE_CHANGED",
          targetUserId: user.id,
          targetUserName: user.name,
          targetUserEmail: user.email,
          details: {
            previousRole,
            newRole: role,
          },
        },
        { transaction },
      );

      return {
        status: 200,
        body: {
          success: true,
          message:
            "User role updated successfully. The user must log in again.",
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            previousRole,
            role: user.role,
          },
        },
      };
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Update user role error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user role.",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent Admin from deleting their own account
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const result = await sequelize.transaction(async (transaction) => {
      // Lock the target user while checking deletion rules
      const user = await User.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!user) {
        return {
          status: 404,
          body: {
            success: false,
            message: "User not found.",
          },
        };
      }

      // Prevent deletion of the last active Admin
      if (user.role === "admin" && user.isActive) {
        const activeAdmins = await User.findAll({
          where: {
            role: "admin",
            isActive: true,
          },
          attributes: ["id"],
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (activeAdmins.length <= 1) {
          return {
            status: 400,
            body: {
              success: false,
              message: "Cannot delete the last active Admin.",
            },
          };
        }
      }

      // Preserve target details before permanent deletion
      const targetSnapshot = {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      };

      // Record the deletion before removing the user
      await AdminAuditLog.create(
        {
          actorId: req.user.id,
          actorName: req.user.name,
          actorEmail: req.user.email,
          action: "USER_DELETED",
          targetUserId: targetSnapshot.id,
          targetUserName: targetSnapshot.name,
          targetUserEmail: targetSnapshot.email,
          details: {
            deletedUser: targetSnapshot,
          },
        },
        { transaction },
      );

      // Revoke active session and remove password-reset records
      await ActiveSession.destroy({
        where: { userId: user.id },
        transaction,
      });

      await PasswordReset.destroy({
        where: { userId: user.id },
        transaction,
      });

      // Permanently delete the user
      await user.destroy({ transaction });

      return {
        status: 200,
        body: {
          success: true,
          message: "User permanently deleted successfully.",
          data: {
            id: targetSnapshot.id,
            name: targetSnapshot.name,
            email: targetSnapshot.email,
          },
        },
      };
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete user.",
    });
  }
};


const createUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof mobile !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    let normalizedMobile = mobile.replace(/[\s()-]/g, "");

    if (normalizedMobile.startsWith("+91")) {
      normalizedMobile = normalizedMobile.slice(3);
    } else if (
      normalizedMobile.startsWith("91") &&
      normalizedMobile.length === 12
    ) {
      normalizedMobile = normalizedMobile.slice(2);
    }

    if (normalizedName.length < 2 || normalizedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must contain 2–100 characters.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit Indian mobile number.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Default password must contain at least 8 characters.",
      });
    }

    const existingUser = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { email: normalizedEmail },
          { mobile: normalizedMobile },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === normalizedEmail
            ? "An account with this email already exists."
            : "An account with this mobile number already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      mobile: normalizedMobile,
      password: hashedPassword,
      role: "user",
    });

    try {
      await sendAccountCredentialsEmail({
        to: user.email,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        password,
      });

      return res.status(201).json({
        success: true,
        message: "User created and login credentials emailed successfully.",
        emailSent: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        },
      });
    } catch (emailError) {
      console.error("Account credentials email failed:", emailError.message);

      return res.status(201).json({
        success: true,
        message: "User created, but the credentials email could not be sent.",
        emailSent: false,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        },
      });
    }
  } catch (error) {
    console.error("Create user error:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Email or mobile number is already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create user.",
    });
  }
};


module.exports = {
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  updateUserRole,
    deleteUser,
    createUser,
};

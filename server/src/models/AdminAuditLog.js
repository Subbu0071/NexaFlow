const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AdminAuditLog = sequelize.define(
  "AdminAuditLog",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // Snapshot of the Admin who performed the action
    actorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    actorName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    actorEmail: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    // Action performed by the Admin
    action: {
      type: DataTypes.ENUM(
        "USER_UPDATED",
        "USER_DEACTIVATED",
        "USER_REACTIVATED",
        "ROLE_CHANGED",
        "USER_DELETED",
      ),
      allowNull: false,
    },

    // Target user snapshot — no foreign key intentionally
    targetUserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    targetUserName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    targetUserEmail: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    // Additional information about the action
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: "admin_audit_logs",
    timestamps: true,
    underscored: true,
  },
);

module.exports = AdminAuditLog;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActiveSession = sequelize.define(
  "ActiveSession",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    refreshTokenHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    deviceId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    lastHeartbeat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "active_sessions",
    timestamps: true,
    underscored: true,
  },
);

module.exports = ActiveSession;

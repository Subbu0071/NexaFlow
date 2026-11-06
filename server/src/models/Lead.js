const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    mobile: {
      type: DataTypes.STRING(16),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    status: {
      type: DataTypes.ENUM(
        "new",
        "contacted",
        "qualified",
        "converted",
        "lost",
      ),
      defaultValue: "new",
      allowNull: false,
    },

    ownerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
    },

    submittedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "leads",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["owner_id"] },
      { fields: ["submitted_by_id"] },
      { fields: ["status"] },
      { fields: ["created_at"] },
    ],
  },
);

module.exports = Lead;

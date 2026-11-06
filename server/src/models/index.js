const User = require("./User");
const ActiveSession = require("./ActiveSession");
const PasswordReset = require("./PasswordReset");
const AdminAuditLog = require("./AdminAuditLog");
const Lead = require("./Lead");
User.hasOne(ActiveSession, {
  foreignKey: "userId",
  as: "activeSession",
  onDelete: "CASCADE",
});


ActiveSession.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(PasswordReset, {
  foreignKey: "userId",
  as: "passwordResets",
  onDelete: "CASCADE",
});

PasswordReset.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Lead, {
  foreignKey: "ownerId",
  as: "ownedLeads",
});

Lead.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});

User.hasMany(Lead, {
  foreignKey: "submittedById",
  as: "submittedLeads",
});

Lead.belongsTo(User, {
  foreignKey: "submittedById",
  as: "submitter",
});

module.exports = {
  User,
  ActiveSession,
  PasswordReset,
  AdminAuditLog,
  Lead,
};

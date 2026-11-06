const readline = require("readline");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
const { User } = require("../models");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });

async function createAdmin() {
  try {
    console.log("\n================================");
    console.log("       NEXAFLOW ADMIN SETUP");
    console.log("================================\n");

    await sequelize.authenticate();
    console.log("Database connected successfully.\n");

    const name = await ask("Enter admin full name: ");
    const email = (await ask("Enter admin email: ")).toLowerCase();
    const mobile = await ask("Enter admin mobile number: ");
    const password = await ask("Enter admin password: ");

    if (!name || !email || !mobile || !password) {
      throw new Error("All fields are required.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      throw new Error("Enter a valid 10-digit Indian mobile number.");
    }

    if (password.length < 8) {
      throw new Error("Password must contain at least 8 characters.");
    }

    const existingUser = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [{ email }, { mobile }],
      },
    });

    if (existingUser) {
      throw new Error(
        "An account with this email or mobile number already exists.",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("\n================================");
    console.log("    ADMIN CREATED SUCCESSFULLY");
    console.log("================================");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Mobile: ${admin.mobile}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Active: ${admin.isActive}`);
    console.log("================================\n");
  } catch (error) {
    console.error("\nAdmin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    await sequelize.close();
  }
}

createAdmin();

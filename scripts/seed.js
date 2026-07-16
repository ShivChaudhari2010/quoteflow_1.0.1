// scripts/seed.js
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import mongoose from "mongoose";

dotenv.config();

const accounts = [
  { username: "admin", password: "admin", role: "admin" },
  { username: "user", password: "user", role: "user" }
];

async function seed() {
  await connectDB();

  for (const account of accounts) {
    const existing = await User.findOne({ username: account.username });

    if (existing) {
      console.log(`⏭️  "${account.username}" already exists, skipping.`);
      continue;
    }

    const passwordHash = await bcrypt.hash(account.password, 10);

    await User.create({
      username: account.username,
      password: passwordHash,
      role: account.role
    });

    console.log(`✅ Created ${account.role} account: ${account.username} / ${account.password}`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

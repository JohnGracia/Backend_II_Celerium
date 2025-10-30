import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/celerium";

const createAdminUser = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const email = "admin@celerium.com";
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("⚠️  Admin user already exists:");
            console.log(existingAdmin);
            return process.exit(0);
        }

        const hashedPassword = bcrypt.hashSync("admin123", 10);

        const adminUser = await User.create({
            first_name: "Admin",
            last_name: "Celerium",
            email,
            age: 30,
            password: hashedPassword,
            role: "admin",
        });

        console.log("🎉 Admin user created successfully!");
        console.log({
            email: adminUser.email,
            password: "admin123",
            role: adminUser.role,
        });

        process.exit(0);
    } catch (err) {
        console.error("❌ Error creating admin user:", err);
        process.exit(1);
    }
};

createAdminUser();


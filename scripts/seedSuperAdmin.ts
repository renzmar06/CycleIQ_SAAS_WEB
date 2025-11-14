// --------------------------------------------------------
// 1. Load .env FIRST before any other imports (ESM safe!)
// --------------------------------------------------------
import "dotenv/config";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// IMPORTANT: In ESM + ts-node/esm, import your TypeScript model using .js extension
import User from "../models/User.js";


// --------------------------------------------------------
// 2. Connect to MongoDB
// --------------------------------------------------------
async function connectDB() {
    console.log("MONGODB_URI loaded as:", process.env.NEXT_MONGODB_URI);

    const uri = process.env.NEXT_MONGODB_URI;
    if (!uri) {
        console.error("❌ ERROR: NEXT_MONGODB_URI missing in .env");
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
}


// --------------------------------------------------------
// 3. Seed Super Admin User
// --------------------------------------------------------
async function seed() {
    await connectDB();

    const email = "superadmin@cycleiq.com";
    const password = "123123123!";
    const name = "Super Admin";

    const existing = await User.findOne({ email });

    if (existing) {
        console.log("⚠️  Superadmin already exists");
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin: true,
    });

    console.log("🎉 Superadmin created:", email);
    process.exit(0);
}


// --------------------------------------------------------
// 4. Start seeding
// --------------------------------------------------------
seed().catch((err) => {
    console.error("❌ SEED ERROR:", err);
    process.exit(1);
});

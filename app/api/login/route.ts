import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import mongoose from "mongoose";

// ======================================================
// ⭐ 1. Load & Validate Environment Variables
// ======================================================
const MONGO_URI = process.env.NEXT_MONGODB_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || '';

if (!MONGO_URI) throw new Error("❌ Environment Error: NEXT_MONGODB_URI is missing");
if (!JWT_SECRET) throw new Error("❌ Environment Error: JWT_SECRET is missing");

// ======================================================
// ⭐ 2. Connect to MongoDB
// ======================================================
async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected");
    }
}

// ======================================================
// ⭐ 3. POST /api/login
// ======================================================
export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email & Password required" },
                { status: 400 }
            );
        }

        await connectDB();

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid Email or Password" },
                { status: 401 }
            );
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid Email or Password" },
                { status: 401 }
            );
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Login API Error:", error);

        return NextResponse.json(
            { success: false, message: error.message || "Server error" },
            { status: 500 }
        );
    }
}

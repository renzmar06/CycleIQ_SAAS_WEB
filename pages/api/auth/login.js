import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ success: false, message: "Method not allowed" });

    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ success: false, message: "Email and password required" });

    try {
        await connectDB();
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(401).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || "cycleiq_secret",
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user._id, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

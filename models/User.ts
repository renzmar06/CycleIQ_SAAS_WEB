// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string; // hashed
    role?: string;
    isAdmin?: boolean;
}

const userSchema = new Schema < IUser > (
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, default: "user" },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model < IUser > ("User", userSchema);
export default User;

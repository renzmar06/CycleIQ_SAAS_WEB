// app/api/roles/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Role from '@/models/Role';

const MONGO_URI = process.env.NEXT_MONGODB_URI!;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

// GET - List all roles
export async function GET() {
  try {
    await connectDB();
    const roles = await Role.find({}).sort({ createdAt: -1 });
    const rolesWithStringId = roles.map(role => ({
      ...role.toObject(),
      _id: role._id.toString()
    }));
    return NextResponse.json({ success: true, data: rolesWithStringId });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new role
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const role = await Role.create(body);
    const roleWithStringId = {
      ...role.toObject(),
      _id: role._id.toString()
    };
    return NextResponse.json({ success: true, data: roleWithStringId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
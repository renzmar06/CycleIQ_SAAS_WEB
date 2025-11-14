import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Permission from '../../../models/Permission';

const MONGO_URI = process.env.NEXT_MONGODB_URI || '';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

// GET - Fetch all permissions
export async function GET() {
  try {
    await connectDB();
    const permissions = await Permission.find().sort({ createdAt: -1 });
    const permissionsWithStringId = permissions.map(permission => ({
      ...permission.toObject(),
      _id: permission._id.toString()
    }));
    
    return NextResponse.json({
      success: true,
      data: permissionsWithStringId
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new permission
export async function POST(req: Request) {
  try {
    const { name, description, module } = await req.json();

    if (!name || !description || !module) {
      return NextResponse.json(
        { success: false, message: 'Name, description, and module are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const permission = await Permission.create({
      name,
      description,
      module
    });

    const permissionWithStringId = {
      ...permission.toObject(),
      _id: permission._id.toString()
    };

    return NextResponse.json({
      success: true,
      data: permissionWithStringId,
      message: 'Permission created successfully'
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Permission name already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
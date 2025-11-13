// app/api/roles/[id]/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Role from '@/models/Role';

const MONGO_URI = process.env.NEXT_MONGODB_URI!;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

// Required: at least one export
export async function GET() {
  return NextResponse.json({ message: 'Use /api/roles for list' }, { status: 400 });
}

// PUT - Update role
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;
    console.log('PUT ID:', id); // Debug

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: `Invalid ID: ${id}` },
        { status: 400 }
      );
    }

    const { name, description, isActive } = await req.json();

    const role = await Role.findByIdAndUpdate(
      id,
      { name, description, isActive },
      { new: true, runValidators: true }
    );

    if (!role) {
      return NextResponse.json(
        { success: false, message: 'Role not found' },
        { status: 404 }
      );
    }

    const roleWithStringId = {
      ...role.toObject(),
      _id: role._id.toString()
    };

    return NextResponse.json({
      success: true,
      data: roleWithStringId,
      message: 'Role updated',
    });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete role
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;
    
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      );
    }

    const role = await Role.findByIdAndDelete(id);
    if (!role) {
      return NextResponse.json(
        { success: false, message: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Role deleted' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
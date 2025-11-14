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



// GET - Get single role
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: `Invalid ID: ${id}` },
        { status: 400 }
      );
    }

    const role = await Role.findById(id);
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
      data: roleWithStringId
    });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update role
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    let { id } = params;
    if (!id) {
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      id = pathParts[pathParts.length - 1];
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
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

    let { id } = params;
    if (!id) {
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      id = pathParts[pathParts.length - 1];
    }
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'No ID provided', debug: { params, url: req.url } },
        { status: 400 }
      );
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: `Invalid ID format: "${id}" (length: ${id?.length})` },
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

    return NextResponse.json({ success: true, message: 'Role deleted successfully' });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
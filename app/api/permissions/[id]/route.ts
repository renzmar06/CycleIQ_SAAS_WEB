import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Permission from '../../../../models/Permission';

const MONGO_URI = process.env.NEXT_MONGODB_URI || '';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

// PUT - Update permission
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, description, module, isActive } = await req.json();
    
    await connectDB();
    
    let { id } = params;
    
    // Fallback: extract ID from URL if params is empty
    if (!id) {
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/');
      id = pathParts[pathParts.length - 1];
    }
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid permission ID format' },
        { status: 400 }
      );
    }
    
    const permission = await Permission.findByIdAndUpdate(
      id,
      { name, description, module, isActive },
      { new: true, runValidators: true }
    );

    if (!permission) {
      return NextResponse.json(
        { success: false, message: 'Permission not found' },
        { status: 404 }
      );
    }

    const permissionWithStringId = {
      ...permission.toObject(),
      _id: permission._id.toString()
    };

    return NextResponse.json({
      success: true,
      data: permissionWithStringId,
      message: 'Permission updated successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete permission
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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
        { success: false, message: 'Invalid permission ID format' },
        { status: 400 }
      );
    }
    
    const permission = await Permission.findByIdAndDelete(id);

    if (!permission) {
      return NextResponse.json(
        { success: false, message: 'Permission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Permission deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
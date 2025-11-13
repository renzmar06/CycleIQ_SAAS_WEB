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
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid permission ID format' },
        { status: 400 }
      );
    }
    
    const permission = await Permission.findByIdAndUpdate(
      params.id,
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
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid permission ID format' },
        { status: 400 }
      );
    }
    
    const permission = await Permission.findByIdAndDelete(params.id);

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
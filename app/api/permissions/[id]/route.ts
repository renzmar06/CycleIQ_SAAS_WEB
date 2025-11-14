import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Permission from '@/models/Permission';

const MONGO_URI = process.env.NEXT_MONGODB_URI!;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const permission = await Permission.findByIdAndUpdate(id, body, { new: true });
    if (!permission) {
      return NextResponse.json({ success: false, message: 'Permission not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: permission });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const permission = await Permission.findByIdAndDelete(id);
    if (!permission) {
      return NextResponse.json({ success: false, message: 'Permission not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Permission deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
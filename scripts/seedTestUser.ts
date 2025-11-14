import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Role from '../models/Role.js';

dotenv.config();

const MONGO_URI = process.env.NEXT_MONGODB_URI!;

async function seedTestUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find staff role
    const staffRole = await Role.findOne({ name: 'staff' });
    if (!staffRole) {
      console.error('Staff role not found. Run seedRolesPermissions first.');
      return;
    }

    const email = 'testuser@cycleiq.com';
    const password = '123123123!';
    const name = 'Test Staff User';

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      // Update existing user to staff role
      await User.updateOne(
        { _id: existing._id },
        { role: staffRole._id, isAdmin: false }
      );
      console.log('✅ Updated existing test user to staff role');
    } else {
      // Create new staff user
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: staffRole._id,
        isAdmin: false,
      });
      console.log('✅ Created test staff user:', email);
    }

  } catch (error) {
    console.error('❌ Error seeding test user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedTestUser();
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.NEXT_MONGODB_URI;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);

async function createTestUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the staff role (has limited permissions)
    const staffRole = await Role.findOne({ name: 'staff' });
    if (!staffRole) {
      console.error('Staff role not found. Please run seed:roles first.');
      process.exit(1);
    }

    const email = 'testuser@cycleiq.com';
    const password = '123456';
    const name = 'Test User';

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('⚠️  Test user already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: staffRole._id,
      isAdmin: false,
    });

    console.log('🎉 Test user created:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role: staff (limited permissions)');
    console.log('');
    console.log('This user will NOT have access to:');
    console.log('- Permissions page');
    console.log('- Role-Permission Matrix');
    console.log('- Delete operations');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestUser();
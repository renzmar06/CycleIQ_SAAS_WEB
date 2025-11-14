import 'dotenv/config';
import mongoose from 'mongoose';

const MONGO_URI = process.env.NEXT_MONGODB_URI;

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  module: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true, trim: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

const Permission = mongoose.models.Permission || mongoose.model('Permission', permissionSchema);
const Role = mongoose.models.Role || mongoose.model('Role', roleSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

const permissions = [
  { name: 'dashboard.view', description: 'View dashboard', module: 'Dashboard' },
  { name: 'users.view', description: 'View users', module: 'Users' },
  { name: 'users.create', description: 'Create users', module: 'Users' },
  { name: 'users.edit', description: 'Edit users', module: 'Users' },
  { name: 'users.delete', description: 'Delete users', module: 'Users' },
  { name: 'roles.view', description: 'View roles', module: 'Roles' },
  { name: 'roles.create', description: 'Create roles', module: 'Roles' },
  { name: 'roles.edit', description: 'Edit roles', module: 'Roles' },
  { name: 'roles.delete', description: 'Delete roles', module: 'Roles' },
  { name: 'permissions.view', description: 'View permissions', module: 'Permissions' },
  { name: 'permissions.create', description: 'Create permissions', module: 'Permissions' },
  { name: 'permissions.edit', description: 'Edit permissions', module: 'Permissions' },
  { name: 'permissions.delete', description: 'Delete permissions', module: 'Permissions' },
  { name: 'customers.view', description: 'View customers', module: 'Customers' },
  { name: 'customers.create', description: 'Create customers', module: 'Customers' },
  { name: 'customers.edit', description: 'Edit customers', module: 'Customers' },
  { name: 'customers.delete', description: 'Delete customers', module: 'Customers' },
  { name: 'tickets.view', description: 'View tickets', module: 'Tickets' },
  { name: 'tickets.create', description: 'Create tickets', module: 'Tickets' },
  { name: 'tickets.edit', description: 'Edit tickets', module: 'Tickets' },
  { name: 'tickets.delete', description: 'Delete tickets', module: 'Tickets' },
  { name: 'leads.view', description: 'View leads', module: 'Leads' },
  { name: 'leads.create', description: 'Create leads', module: 'Leads' },
  { name: 'leads.edit', description: 'Edit leads', module: 'Leads' },
  { name: 'leads.delete', description: 'Delete leads', module: 'Leads' },
];

const roles = [
  { name: 'superAdmin', description: 'Super Administrator with all permissions', permissions: [] },
  { name: 'admin', description: 'Administrator with most permissions', permissions: [
    'dashboard.view', 'users.view', 'users.create', 'users.edit',
    'customers.view', 'customers.create', 'customers.edit',
    'tickets.view', 'tickets.create', 'tickets.edit',
    'leads.view', 'leads.create', 'leads.edit'
  ]},
  { name: 'staff', description: 'Staff member with limited permissions', permissions: [
    'dashboard.view', 'customers.view', 'customers.create',
    'tickets.view', 'tickets.create', 'tickets.edit',
    'leads.view', 'leads.create'
  ]},
  { name: 'customer', description: 'Customer with minimal permissions', permissions: [
    'dashboard.view', 'tickets.view', 'tickets.create'
  ]}
];

async function seedRoles() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Permission.deleteMany({});
    await Role.deleteMany({});
    console.log('Cleared existing data');

    const createdPermissions = await Permission.insertMany(permissions);
    console.log(`Created ${createdPermissions.length} permissions`);

    const permissionMap = {};
    createdPermissions.forEach(perm => {
      permissionMap[perm.name] = perm._id;
    });

    for (const roleData of roles) {
      let rolePermissions;
      if (roleData.name === 'superAdmin') {
        rolePermissions = createdPermissions.map(p => p._id);
      } else {
        rolePermissions = roleData.permissions.map(permName => permissionMap[permName]).filter(Boolean);
      }

      await Role.create({
        name: roleData.name,
        description: roleData.description,
        permissions: rolePermissions
      });
    }

    console.log(`Created ${roles.length} roles`);

    const superAdminRole = await Role.findOne({ name: 'superAdmin' });
    if (superAdminRole) {
      await User.updateMany({ isAdmin: true }, { role: superAdminRole._id });
      console.log('Updated superadmin users');
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedRoles();
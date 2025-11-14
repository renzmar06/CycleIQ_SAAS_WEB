import 'dotenv/config';
import mongoose from 'mongoose';
import Role from '../models/Role.js';
import Permission from '../models/Permission.js';
import User from '../models/User.js';

const MONGO_URI = process.env.NEXT_MONGODB_URI!;

const permissions = [
  // Dashboard
  { name: 'dashboard.view', description: 'View dashboard', module: 'Dashboard' },
  
  // Users
  { name: 'users.view', description: 'View users', module: 'Users' },
  { name: 'users.create', description: 'Create users', module: 'Users' },
  { name: 'users.edit', description: 'Edit users', module: 'Users' },
  { name: 'users.delete', description: 'Delete users', module: 'Users' },
  
  // Roles
  { name: 'roles.view', description: 'View roles', module: 'Roles' },
  { name: 'roles.create', description: 'Create roles', module: 'Roles' },
  { name: 'roles.edit', description: 'Edit roles', module: 'Roles' },
  { name: 'roles.delete', description: 'Delete roles', module: 'Roles' },
  
  // Permissions
  { name: 'permissions.view', description: 'View permissions', module: 'Permissions' },
  { name: 'permissions.create', description: 'Create permissions', module: 'Permissions' },
  { name: 'permissions.edit', description: 'Edit permissions', module: 'Permissions' },
  { name: 'permissions.delete', description: 'Delete permissions', module: 'Permissions' },
  
  // Customers
  { name: 'customers.view', description: 'View customers', module: 'Customers' },
  { name: 'customers.create', description: 'Create customers', module: 'Customers' },
  { name: 'customers.edit', description: 'Edit customers', module: 'Customers' },
  { name: 'customers.delete', description: 'Delete customers', module: 'Customers' },
  
  // Tickets
  { name: 'tickets.view', description: 'View tickets', module: 'Tickets' },
  { name: 'tickets.create', description: 'Create tickets', module: 'Tickets' },
  { name: 'tickets.edit', description: 'Edit tickets', module: 'Tickets' },
  { name: 'tickets.delete', description: 'Delete tickets', module: 'Tickets' },
  
  // Leads
  { name: 'leads.view', description: 'View leads', module: 'Leads' },
  { name: 'leads.create', description: 'Create leads', module: 'Leads' },
  { name: 'leads.edit', description: 'Edit leads', module: 'Leads' },
  { name: 'leads.delete', description: 'Delete leads', module: 'Leads' },
];

const roles = [
  {
    name: 'superAdmin',
    description: 'Super Administrator with all permissions',
    permissions: [] // Will be populated with all permissions
  },
  {
    name: 'admin',
    description: 'Administrator with most permissions',
    permissions: [
      'dashboard.view', 'users.view', 'users.create', 'users.edit',
      'customers.view', 'customers.create', 'customers.edit',
      'tickets.view', 'tickets.create', 'tickets.edit',
      'leads.view', 'leads.create', 'leads.edit'
    ]
  },
  {
    name: 'staff',
    description: 'Staff member with limited permissions',
    permissions: [
      'dashboard.view', 'customers.view', 'customers.create',
      'tickets.view', 'tickets.create', 'tickets.edit',
      'leads.view', 'leads.create'
    ]
  },
  {
    name: 'customer',
    description: 'Customer with minimal permissions',
    permissions: ['dashboard.view', 'tickets.view', 'tickets.create']
  }
];

async function seedRolesPermissions() {
  try {
    console.log('MONGODB_URI:', MONGO_URI);
    if (!MONGO_URI) {
      throw new Error('NEXT_MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Permission.deleteMany({});
    await Role.deleteMany({});
    console.log('Cleared existing roles and permissions');

    // Create permissions
    const createdPermissions = await Permission.insertMany(permissions);
    console.log(`Created ${createdPermissions.length} permissions`);

    // Create permission map for easy lookup
    const permissionMap = createdPermissions.reduce((acc, perm) => {
      acc[perm.name] = perm._id;
      return acc;
    }, {} as { [key: string]: any });

    // Create roles with permissions
    for (const roleData of roles) {
      let rolePermissions;
      
      if (roleData.name === 'superAdmin') {
        // SuperAdmin gets all permissions
        rolePermissions = createdPermissions.map(p => p._id);
      } else {
        // Map permission names to IDs
        rolePermissions = roleData.permissions.map(permName => permissionMap[permName]).filter(Boolean);
      }

      await Role.create({
        name: roleData.name,
        description: roleData.description,
        permissions: rolePermissions
      });
    }

    console.log(`Created ${roles.length} roles`);

    // Update existing superadmin user to have superAdmin role
    const superAdminRole = await Role.findOne({ name: 'superAdmin' });
    if (superAdminRole) {
      await User.updateMany(
        { isAdmin: true },
        { role: superAdminRole._id }
      );
      console.log('Updated superadmin users with superAdmin role');
    }

    console.log('✅ Roles and permissions seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding roles and permissions:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedRolesPermissions();
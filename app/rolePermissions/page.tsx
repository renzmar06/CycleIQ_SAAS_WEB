'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '../components';
import { Save, RefreshCw } from 'lucide-react';

interface Permission {
  _id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
}

export default function RolePermissions() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [matrix, setMatrix] = useState<{ [roleId: string]: { [permissionId: string]: boolean } }>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        fetch('/api/roles'),
        fetch('/api/permissions')
      ]);

      const rolesData = await rolesRes.json();
      const permissionsData = await permissionsRes.json();

      if (rolesData.success && permissionsData.success) {
        setRoles(rolesData.data);
        setPermissions(permissionsData.data);
        
        // Initialize matrix
        const newMatrix: { [roleId: string]: { [permissionId: string]: boolean } } = {};
        rolesData.data.forEach((role: Role) => {
          newMatrix[role._id] = {};
          permissionsData.data.forEach((permission: Permission) => {
            newMatrix[role._id][permission._id] = role.permissions.includes(permission._id);
          });
        });
        setMatrix(newMatrix);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    setMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permissionId]: !prev[roleId][permissionId]
      }
    }));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(matrix).map(([roleId, rolePermissions]) => {
        const permissions = Object.entries(rolePermissions)
          .filter(([_, hasPermission]) => hasPermission)
          .map(([permissionId]) => permissionId);
        
        return fetch(`/api/roles/${roleId}/permissions`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permissions })
        });
      });

      await Promise.all(updates);
      alert('Permissions updated successfully!');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Error saving permissions');
    } finally {
      setSaving(false);
    }
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as { [module: string]: Permission[] });

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin" size={32} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Role-Permission Matrix</h2>
            <p className="text-gray-600 mt-1">Assign permissions to roles</p>
          </div>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">
                    Permission / Role
                  </th>
                  {roles.map((role) => (
                    <th key={role._id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase min-w-[120px]">
                      <div className="transform -rotate-45 origin-center whitespace-nowrap">
                        {role.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                  <React.Fragment key={module}>
                    <tr className="bg-blue-50">
                      <td colSpan={roles.length + 1} className="px-6 py-2 text-sm font-semibold text-blue-900">
                        {module}
                      </td>
                    </tr>
                    {modulePermissions.map((permission) => (
                      <tr key={permission._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 sticky left-0 bg-white border-r">
                          <div>
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-gray-500 text-xs">{permission.description}</div>
                          </div>
                        </td>
                        {roles.map((role) => (
                          <td key={role._id} className="px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={matrix[role._id]?.[permission._id] || false}
                              onChange={() => togglePermission(role._id, permission._id)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
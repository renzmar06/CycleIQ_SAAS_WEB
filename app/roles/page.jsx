'use client';

import { useState, useEffect } from 'react';
import { Layout } from '../components';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      if (data.success) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract ID from role object
  const extractRoleId = (role) => {
    if (!role) return '';
    
    // If _id is an object with $oid property (MongoDB extended JSON format)
    if (role._id && typeof role._id === 'object' && role._id.$oid) {
      return role._id.$oid;
    }
    // If _id is already a string
    else if (typeof role._id === 'string') {
      return role._id;
    }
    // Fallback - try to get the first value if it's an object
    else if (role._id && typeof role._id === 'object') {
      return Object.values(role._id)[0] || '';
    }
    
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let roleId = null;
      if (editingRole) {
        roleId = extractRoleId(editingRole);
        console.log('editingRole:', editingRole);
        console.log('extracted roleId:', roleId);
      }
      const url = editingRole ? `/api/roles/${roleId}` : '/api/roles';
      const method = editingRole ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        fetchRoles();
        setShowModal(false);
        resetForm();
      } else {
        setError(data.message || 'Failed to save role');
      }
    } catch (error) {
      console.error('Error saving role:', error);
      setError('Network error occurred');
    }
  };

  const handleDelete = async (role) => {
    const roleId = extractRoleId(role);
    console.log('delete role:', role);
    console.log('delete roleId:', roleId);
    
    if (!roleId) {
      alert('Invalid role ID');
      return;
    }

    if (confirm('Are you sure you want to delete this role?')) {
      try {
        const response = await fetch(`/api/roles/${roleId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
          fetchRoles();
        } else {
          alert(data.message || 'Failed to delete role');
        }
      } catch (error) {
        console.error('Error deleting role:', error);
        alert('Network error occurred');
      }
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      isActive: role.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', isActive: true });
    setEditingRole(null);
    setError('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Roles Management</h2>
            <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Role
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={extractRoleId(role)}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{role.name}</td>
                    <td className="px-6 py-4 text-gray-500">{role.description}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${role.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(role)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(role)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg text-gray-900 font-medium mb-4">
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {editingRole ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
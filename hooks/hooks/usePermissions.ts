import { useState, useEffect } from 'react';

interface UserPermissions {
  userId: string;
  role: string;
  permissions: string[];
  isAdmin: boolean;
}

export function usePermissions() {
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUserPermissions();
  }, []);

  const fetchUserPermissions = async () => {
    try {
      const response = await fetch('/api/user-permissions');
      const data = await response.json();
      if (data.success) {
        setUserPermissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!mounted || !userPermissions) return false;
    return userPermissions.isAdmin || userPermissions.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!mounted || !userPermissions) return false;
    if (userPermissions.isAdmin) return true;
    return permissions.some(permission => userPermissions.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!mounted || !userPermissions) return false;
    if (userPermissions.isAdmin) return true;
    return permissions.every(permission => userPermissions.permissions.includes(permission));
  };

  return {
    userPermissions,
    loading: loading || !mounted,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refetch: fetchUserPermissions
  };
}
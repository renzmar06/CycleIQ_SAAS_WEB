'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Ticket,
  Users,
  UserPlus,
  Shield,
  CheckSquare,
  Menu,
  ChevronLeft,
  ChevronDown,
  List,
  Plus,
  Settings,
} from 'lucide-react';

interface UserPermissions {
  role: string;
  permissions: string[];
  isAdmin: boolean;
}

interface SubMenuItem {
  icon: any;
  label: string;
  href: string;
  permission?: string;
}

interface MenuItem {
  icon: any;
  label: string;
  active?: boolean;
  hasDropdown?: boolean;
  subItems?: SubMenuItem[];
  href?: string;
  permission?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

export default function ProtectedSidebar({ isOpen, onToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  const fetchUserPermissions = async () => {
    try {
      const response = await fetch('/api/user-permissions');
      const data = await response.json();
      console.log('API Response:', data);
      if (data.success) {
        console.log('User Permissions:', data.data);
        setUserPermissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    }
  };

  const hasPermission = (permission?: string): boolean => {
    if (!permission) return true;
    if (!userPermissions) return false;
    const result = userPermissions.isAdmin || userPermissions.permissions.includes(permission);
    console.log(`Permission check: ${permission} = ${result}`, {
      isAdmin: userPermissions.isAdmin,
      permissions: userPermissions.permissions
    });
    return result;
  };

  const menuItems: MenuItem[] = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      active: true, 
      href: '/dashboard',
      permission: 'dashboard.view'
    },
    { 
      icon: Ticket, 
      label: 'Ticketing', 
      href: '/ticketing',
      permission: 'tickets.view'
    },
    {
      icon: Users,
      label: 'Customers',
      hasDropdown: true,
      permission: 'customers.view',
      subItems: [
        { icon: List, label: 'Customer List', href: '/customers/list', permission: 'customers.view' },
        { icon: Plus, label: 'Add Customer', href: '/customers/add', permission: 'customers.create' },
      ],
    },
    {
      icon: Shield,
      label: 'Role & Permissions',
      hasDropdown: true,
      permission: 'roles.view',
      subItems: [
        { icon: Users, label: 'Roles', href: '/roles', permission: 'roles.view' },
        { icon: CheckSquare, label: 'Permissions', href: '/permissions', permission: 'permissions.view' },
        { icon: Settings, label: 'Role-Permission Matrix', href: '/rolePermissions', permission: 'roles.edit' },
      ],
    },
    { 
      icon: UserPlus, 
      label: 'Leads', 
      href: '/leads',
      permission: 'leads.view'
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));
  console.log('Filtered menu items:', filteredMenuItems.length, 'out of', menuItems.length);

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full overflow-y-auto`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CIQ</span>
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">CycleIQ</h1>
              <p className="text-xs text-gray-500">Recycling Operations</p>
            </div>
          )}
        </div>

        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredMenuItems.map((item, idx) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.includes(idx);
          const filteredSubItems = item.subItems?.filter(subItem => hasPermission(subItem.permission)) || [];

          // Don't show dropdown items if no sub-items are accessible
          if (item.hasDropdown && filteredSubItems.length === 0) {
            return null;
          }

          const topButton = (
            <button
              onClick={(e) => {
                if (item.hasDropdown && isOpen) {
                  e.preventDefault();
                  toggleExpanded(idx);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                item.active
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon size={20} />
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </div>

              {item.hasDropdown && isOpen && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              )}
            </button>
          );

          return (
            <div key={idx}>
              {item.href && !item.hasDropdown ? (
                <Link href={item.href} className="block">
                  {topButton}
                </Link>
              ) : (
                topButton
              )}
              {item.hasDropdown && isOpen && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {filteredSubItems.map((sub, subIdx) => {
                    const SubIcon = sub.icon;
                    return (
                      <Link
                        key={subIdx}
                        href={sub.href}
                        className="flex w-full items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <SubIcon size={16} />
                        <span className="text-sm">{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Role Display */}
      {isOpen && userPermissions && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Role: <span className="font-medium text-gray-700">{userPermissions.role || 'No Role'}</span>
          </div>
          {userPermissions.isAdmin && (
            <div className="text-xs text-green-600 font-medium">Super Admin</div>
          )}
        </div>
      )}
    </aside>
  );
}
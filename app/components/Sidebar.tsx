'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Ticket,
  Users,
  UserPlus,
  DollarSign,
  Tags,
  FileText,
  BarChart3,
  Package,
  Truck,
  Box,
  Menu,
  ChevronLeft,
  ChevronDown,
  List,
  Plus,
} from 'lucide-react';

interface SubMenuItem {
  icon: any;
  label: string;
  href: string;
}

interface MenuItem {
  icon: any;
  label: string;
  active?: boolean;
  hasDropdown?: boolean;
  subItems?: SubMenuItem[];
  href?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true, href: '/dashboard' },
  { icon: Ticket, label: 'Ticketing', href: '/ticketing' },
  {
    icon: Users,
    label: 'Customers',
    hasDropdown: true,
    subItems: [
      { icon: List, label: 'Customer List', href: '/customers/list' },
      { icon: Plus, label: 'Add Customer', href: '/customers/add' },
    ],
  },
  { icon: UserPlus, label: 'Leads', href: '/leads' },
 
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full overflow-y-auto`}
    >
      {/* ---------- Logo & Toggle ---------- */}
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
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.includes(idx);

         
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
                  {item.subItems?.map((sub, subIdx) => {
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
    </aside>
  );
}
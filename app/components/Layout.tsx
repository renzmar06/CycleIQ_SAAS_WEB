'use client';

import { useState } from 'react';
import Header from './Header';
import ProtectedSidebar from './ProtectedSidebar';
import ClientOnly from './ClientOnly';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <ClientOnly
      fallback={
        <div className="flex h-screen bg-gray-50">
          <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full overflow-y-auto`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CIQ</span>
                </div>
                {sidebarOpen && (
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">CycleIQ</h1>
                    <p className="text-xs text-gray-500">Recycling Operations</p>
                  </div>
                )}
              </div>
            </div>
            <nav className="flex-1 p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </nav>
          </aside>
          <div className="flex flex-col flex-1">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="animate-pulse h-6 bg-gray-200 rounded w-32"></div>
            </div>
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-64"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </main>
          </div>
        </div>
      }
    >
      <div className="flex h-screen bg-gray-50">
        <ProtectedSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <div className="flex flex-col flex-1">
          <Header onSidebarToggle={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ClientOnly>
  );
}
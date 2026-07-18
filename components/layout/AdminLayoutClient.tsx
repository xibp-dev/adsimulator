"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import { X } from "lucide-react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userName: string;
  logoUrl: string;
}

export default function AdminLayoutClient({ children, userName, logoUrl }: AdminLayoutClientProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-[#f7f8fa] relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full flex-shrink-0">
        <AdminSidebar logoUrl={logoUrl} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileSidebarOpen(false)} 
          />
          {/* Sidebar container */}
          <div className="relative flex-1 flex flex-col max-w-[260px] w-full bg-[#0f1729] focus:outline-none transition-transform duration-300 ease-in-out z-50">
            <div className="absolute top-2 right-2">
              <button
                type="button"
                className="flex items-center justify-center h-10 w-10 rounded-xl focus:outline-none hover:bg-white/10 text-white/70 transition-colors"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-full pt-4">
              <AdminSidebar logoUrl={logoUrl} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <AdminTopBar 
          userName={userName} 
          onToggleSidebar={() => setMobileSidebarOpen(true)} 
        />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

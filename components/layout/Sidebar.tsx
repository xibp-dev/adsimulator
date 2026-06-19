"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Megaphone, LayoutGrid, ImagePlay, Users, CreditCard,
  BarChart3, ChevronLeft, ChevronRight, Home, Briefcase, Flag, Cpu, Globe, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const topItems = [
  { href: "/dashboard", label: "Portal Lab", icon: Home, exact: true },
];

const metaItems = [
  { href: "/dashboard/hub", label: "AdSimulator Home", icon: LayoutGrid },
  { href: "/dashboard/business-settings", label: "Pengaturan Bisnis", icon: Briefcase },
  { href: "/dashboard/pages", label: "Halaman Fanspage", icon: Flag },
  { href: "/dashboard/pixels", label: "Pixel Tracker", icon: Cpu },
  { href: "/dashboard/landing-pages", label: "Landing Pages", icon: Globe },
  { href: "/dashboard/ads-manager", label: "Kampanye", icon: Megaphone },
  { href: "/dashboard/adsets", label: "Set Iklan", icon: LayoutGrid },
  { href: "/dashboard/ads", label: "Iklan", icon: ImagePlay },
  { href: "/dashboard/audiences", label: "Pemirsa", icon: Users },
  { href: "/dashboard/billing", label: "Penagihan", icon: CreditCard },
  { href: "/dashboard/overview", label: "Ringkasan akun", icon: BarChart3 },
  { href: "/dashboard/panduan", label: "Panduan Beriklan", icon: BookOpen },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-full bg-white border-r border-[#dddfe2] flex flex-col transition-all duration-200",
        collapsed ? "w-14" : "w-56"
      )}
    >
      <nav className="flex-1 py-3 overflow-y-auto">
        {/* Portal top link */}
        {topItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-[#e7f0ff] text-[#0866FF]"
                  : "text-[#1c2b33] hover:bg-gray-100"
              )}
            >
              <Icon className={cn("flex-shrink-0 w-5 h-5", active ? "text-[#0866FF]" : "text-gray-500")} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}

        {/* AdSimulator section */}
        {!collapsed && (
          <div className="px-5 pt-4 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">AdSimulator</p>
          </div>
        )}
        {collapsed && <div className="my-2 mx-3 border-t border-gray-100" />}

        {metaItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-[#e7f0ff] text-[#0866FF]"
                  : "text-[#1c2b33] hover:bg-gray-100"
              )}
            >
              <Icon className={cn("flex-shrink-0 w-5 h-5", active ? "text-[#0866FF]" : "text-gray-500")} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-[#dddfe2] p-2">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}

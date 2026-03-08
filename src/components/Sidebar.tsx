"use client";

import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  Truck,
  FileText,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import { cn } from "@/lib/utils";
import ROUTES_PATH from "@/lib/Route_Paths";
import { useState } from "react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles?: UserRoles[];
}

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

export function Sidebar({ isMobileMenuOpen, onMobileMenuClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const allNavItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: ROUTES_PATH.DASHBOARD,
    },
    {
      label: "Calendar",
      icon: <CalendarDays className="h-5 w-5" />,
      href: ROUTES_PATH.CALENDAR,
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      label: "Company",
      icon: <Building2 className="h-5 w-5" />,
      href: ROUTES_PATH.COMPANIES.BASE,
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      label: "Client",
      icon: <Users className="h-5 w-5" />,
      href: ROUTES_PATH.CLIENTS.BASE,
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      label: "Product",
      icon: <Package className="h-5 w-5" />,
      href: ROUTES_PATH.PRODUCTS.BASE,
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      label: "Bookings",
      icon: <Calendar className="h-5 w-5" />,
      href: ROUTES_PATH.BOOKINGS.BASE,
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      label: "Driver",
      icon: <UserCheck className="h-5 w-5" />,
      href: ROUTES_PATH.DRIVERS.BASE,
      roles: [UserRoles.SUPER_ADMIN],
    },
    {
      label: "Vehicle",
      icon: <Truck className="h-5 w-5" />,
      href: ROUTES_PATH.VEHICLES.BASE,
      roles: [UserRoles.SUPER_ADMIN],
    },
    {
      label: "Invoices",
      icon: <FileText className="h-5 w-5" />,
      href: ROUTES_PATH.INVOICES.BASE,
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
  ];

  const navItems = allNavItems.filter(
    (item) =>
      !item.roles ||
      (user?.role && item.roles.includes(user.role as UserRoles)),
  );

  return (
    <div className="flex h-full">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onMobileMenuClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out border-r border-border/60 bg-white/95 md:bg-white/50 backdrop-blur-xl z-50",
          // Mobile classes
          "fixed inset-y-0 left-0 transform md:relative md:transform-none",
          isMobileMenuOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full md:translate-x-0",
          // Desktop classes
          !isMobileMenuOpen && (isCollapsed ? "md:w-20" : "md:w-72"),
        )}>
        {/* Toggle Button (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-4 top-10 z-50 h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-md hover:bg-slate-50 transition-all group">
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-primary" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-600 group-hover:text-primary" />
          )}
        </button>

        <div
          className={cn(
            "flex-1 py-8 custom-scrollbar",
            isCollapsed && !isMobileMenuOpen
              ? "overflow-visible scrollbar-hide"
              : "overflow-y-auto",
          )}>
          <div
            className={cn(
              "px-4 mb-8 transition-all",
              !isMobileMenuOpen && isCollapsed ? "md:px-3" : "px-6",
            )}>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === ROUTES_PATH.DASHBOARD
                    ? pathname === item.href
                    : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileMenuClose}
                    title={!isMobileMenuOpen && isCollapsed ? item.label : ""}
                    className={cn(
                      "flex items-center rounded-2xl transition-all group relative h-14",
                      !isMobileMenuOpen && isCollapsed
                        ? "md:justify-center px-0 w-full"
                        : "gap-3 px-5 py-4 w-full",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-slate-600 hover:bg-primary/5 hover:text-primary",
                    )}>
                    <div
                      className={cn(
                        "transition-transform duration-300 group-hover:scale-110 flex-shrink-0 relative",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-primary",
                      )}>
                      {item.icon}
                      {/* Tooltip for collapsed state (Desktop Only) */}
                      {!isMobileMenuOpen && isCollapsed && (
                        <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-[100] whitespace-nowrap shadow-2xl shadow-primary/40 border border-white/10 backdrop-blur-md">
                          {item.label}
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900" />
                        </div>
                      )}
                    </div>
                    {/* Label - visible on mobile or when desktop sidebar is expanded */}
                    <span
                      className={cn(
                        "tracking-tight text-sm font-bold truncate opacity-100 transition-opacity duration-300 block",
                        !isMobileMenuOpen && isCollapsed && "md:hidden",
                      )}>
                      {item.label}
                    </span>

                    {isActive && (!isCollapsed || isMobileMenuOpen) && (
                      <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                    {isActive && !isMobileMenuOpen && isCollapsed && (
                      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-l-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </div>
  );
}

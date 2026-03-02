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

export function Sidebar() {
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
      href: ROUTES_PATH.PRODUCTS,
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      label: "Bookings",
      icon: <Calendar className="h-5 w-5" />,
      href: ROUTES_PATH.BOOKINGS.BASE,
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      label: "Calendar",
      icon: <CalendarDays className="h-5 w-5" />,
      href: ROUTES_PATH.CALENDAR,
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
    {
      label: "Driver",
      icon: <Truck className="h-5 w-5" />,
      href: ROUTES_PATH.DRIVERS,
      roles: [UserRoles.SUPER_ADMIN],
    },
    {
      label: "Vehicle",
      icon: <Truck className="h-5 w-5" />,
      href: ROUTES_PATH.VEHICLES,
      roles: [UserRoles.SUPER_ADMIN],
    },
    {
      label: "Invoices & Payment",
      icon: <FileText className="h-5 w-5" />,
      href: ROUTES_PATH.INVOICES,
      roles: [UserRoles.SUPER_ADMIN, UserRoles.COMPANY_ADMIN],
    },
  ];

  const navItems = allNavItems.filter(
    (item) =>
      !item.roles ||
      (user?.role && item.roles.includes(user.role as UserRoles)),
  );

  return (
    <aside
      className={cn(
        "border-r border-border/60 bg-white/50 backdrop-blur-xl flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-24" : "w-72",
      )}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-10 z-50 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-md hover:bg-slate-50 transition-all group">
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-primary" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-slate-600 group-hover:text-primary" />
        )}
      </button>

      <div className="flex-1 overflow-y-auto py-8 custom-scrollbar">
        <div
          className={cn(
            "px-4 mb-8 transition-all",
            isCollapsed ? "px-3" : "px-6",
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
                  title={isCollapsed ? item.label : ""}
                  className={cn(
                    "flex items-center rounded-2xl transition-all group relative h-14",
                    isCollapsed
                      ? "justify-center px-0 w-full"
                      : "gap-3 px-5 py-4 w-full",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-slate-600 hover:bg-primary/5 hover:text-primary",
                  )}>
                  <div
                    className={cn(
                      "transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-primary",
                    )}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="tracking-tight text-sm font-bold truncate opacity-100 transition-opacity duration-300">
                      {item.label}
                    </span>
                  )}
                  {isActive && !isCollapsed && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  )}
                  {isActive && isCollapsed && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-l-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}

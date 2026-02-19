"use client";

import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  Truck,
  FileText,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export function Sidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      label: "Company",
      icon: <Building2 className="h-5 w-5" />,
      href: "/companies",
    },
    {
      label: "Customer",
      icon: <Users className="h-5 w-5" />,
      href: "/customers",
    },
    {
      label: "Product",
      icon: <Package className="h-5 w-5" />,
      href: "/products",
    },

    {
      label: "Bookings",
      icon: <Calendar className="h-5 w-5" />,
      href: "/bookings",
    },
    {
      label: "Driver",
      icon: <Truck className="h-5 w-5" />,
      href: "/drivers",
    },
    {
      label: "Invoices & Payment",
      icon: <FileText className="h-5 w-5" />,
      href: "/invoices",
    },
  ];

  return (
    <aside className="w-72 border-r border-border/60 bg-white/50 backdrop-blur-xl flex flex-col h-full flex-shrink-0">
      <div className="flex-1 overflow-y-auto py-8">
        <div className="px-6 mb-8">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition-all group relative",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-slate-600 hover:bg-primary/5 hover:text-primary",
                  )}>
                  <div
                    className={cn(
                      "transition-transform duration-300 group-hover:scale-110",
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-primary",
                    )}>
                    {item.icon}
                  </div>
                  <span className="tracking-tight">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
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

"use client";

import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUnreadCountQuery } from "../services/useNotificationQueries";
import ROUTES_PATH from "@/lib/Route_Paths";
import Image from "next/image";

interface HeaderProps {
  companyName?: string;
  userName?: string;
  onMenuClick?: () => void;
}

export function Header({
  companyName = "Super Admin",
  onMenuClick,
}: HeaderProps) {
  const { data: unreadCount } = useUnreadCountQuery();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex-shrink-0 h-[84px] sticky top-0">
      <div className="flex items-center justify-between px-4 sm:px-8 h-full gap-2">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden h-10 w-10 shrink-0 text-slate-600 hover:bg-slate-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>

          <Link
            href={ROUTES_PATH.DASHBOARD}
            className="flex items-center group">
            {/* <div className="relative h-12 w-28 sm:w-32 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden p-1 transition-transform group-hover:scale-105"> */}
            <div className="relative h-24 w-24">
              <Image
                src="/divineLogo.png"
                alt="Divine Logo"
                fill
                sizes="96px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              {companyName !== "Super Admin" ? (
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground leading-none group-hover:text-primary transition-colors line-clamp-1">
                    {companyName}
                  </h1>
                  <span className="hidden sm:inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 whitespace-nowrap">
                    Company Admin
                  </span>
                </div>
              ) : (
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground leading-none group-hover:text-primary transition-colors">
                  {companyName}
                </h1>
              )}
              <span className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-primary/60 mt-1">
                Divine Booking System
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Link */}
          <Link href={ROUTES_PATH.NOTIFICATIONS} className="relative group">
            <div className="h-12 w-12 rounded-2xl border border-border/50 flex items-center justify-center hover:bg-primary/5 hover:border-primary/20 transition-all group-hover:scale-110">
              <Bell className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              {unreadCount !== undefined && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground ring-4 ring-background">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          </Link>

          {/* Settings Link */}
          <Link href={ROUTES_PATH.SETTINGS}>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-2xl border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all text-muted-foreground hover:text-primary"
              title="Settings">
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

"use client";

import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/src/services/authManager";
import { useUnreadCountQuery } from "../services/useNotificationQueries";
import ROUTES_PATH from "@/lib/Route_Paths";
import Image from "next/image";

interface HeaderProps {
  companyName?: string;
  userName?: string;
}

export function Header({ companyName = "Super Admin" }: HeaderProps) {
  useAuth();
  const { data: unreadCount } = useUnreadCountQuery();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex-shrink-0 h-20 sticky top-0">
      <div className="flex items-center justify-between px-8 h-full">
        <div className="flex items-center gap-6">
          <Link
            href={ROUTES_PATH.DASHBOARD}
            className="flex items-center gap-4 group">
            <Image
              src="/logoRKB.png"
              alt="Logo"
              width={142}
              height={142}
              className="rounded-2xl object-contain"
            />
            {/* <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-all group-hover:scale-110 group-hover:rotate-3">
              <span className="text-primary-foreground font-black text-2xl tracking-tighter">
                L
              </span>
            </div> */}
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tight text-foreground leading-none group-hover:text-primary transition-colors">
                {companyName}
              </h1>
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary/60 mt-1">
                RKB Booking System
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

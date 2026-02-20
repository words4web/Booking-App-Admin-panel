"use client";

import { LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "../enums/roles.enum";

interface HeaderProps {
  companyName?: string;
  userName?: string;
}

export function Header({ companyName = "Super Admin" }: HeaderProps) {
  const { user, removeUserContext } = useAuth();
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex-shrink-0 h-20 sticky top-0">
      <div className="flex items-center justify-between px-8 h-full">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-4 group">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-all group-hover:scale-110 group-hover:rotate-3">
              <span className="text-primary-foreground font-black text-2xl tracking-tighter">
                L
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tight text-foreground leading-none group-hover:text-primary transition-colors">
                {companyName}
              </h1>
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary/60 mt-1">
                Logistics Portal
              </span>
            </div>
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-14 pl-2 pr-4 rounded-full border border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-all flex items-center gap-3 group">
              <Avatar className="h-10 w-10 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                <AvatarImage src="/placeholder-user.jpg" alt={user?.fullName} />
                <AvatarFallback className="bg-primary/5 text-primary font-black text-xs">
                  {user?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start pr-2">
                <span className="text-sm font-black text-foreground leading-none">
                  {user?.fullName}
                </span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">
                  {user?.role == UserRoles.SUPER_ADMIN
                    ? "Super Admin"
                    : "Company Admin"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-y-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 p-0 mt-3 shadow-2xl border border-primary/10 bg-card overflow-hidden rounded-2xl">
            <div className="p-6 bg-gradient-to-br from-primary/[0.03] to-transparent">
              <div className="flex flex-col items-center text-center gap-3">
                <Avatar className="h-16 w-16 ring-4 ring-primary/5 shadow-xl">
                  <AvatarFallback className="bg-background text-primary font-black text-lg">
                    {user?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg font-black tracking-tight">
                    {user?.fullName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-2 pb-2">
              <div className="p-2 pt-0">
                <DropdownMenuItem
                  onClick={removeUserContext}
                  className="flex items-center justify-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-destructive/20 group text-destructive bg-destructive/20">
                  <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-black">Sign Out</span>
                </DropdownMenuItem>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

"use client";

import { ReactNode } from "react";
import { Header } from "@/src/components/Header";
import { Sidebar } from "@/src/components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-screen min-h-0 overflow-hidden bg-slate-50/30">
      {/* 1. Fixed Header (Stationary) */}
      <Header companyName="Super Admin" userName="Admin User" />

      {/* 2. Main Body Area */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* 3. Fixed Sidebar (Stationary) */}
        <Sidebar />

        {/* 4. Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth bg-slate-50/20 shadow-inner custom-scrollbar">
          <div className="p-8 max-w-[1600px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

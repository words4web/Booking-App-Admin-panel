"use client";

import { ReactNode, useEffect } from "react";
import { Header } from "@/src/components/Header";
import { Sidebar } from "@/src/components/Sidebar";
import { useRouter } from "next/navigation";
import { CommonLoader } from "@/src/components/common/CommonLoader";
import { useAuth } from "@/src/services/authManager";
import { UserRoles } from "@/src/enums/roles.enum";
import ROUTES_PATH from "@/lib/Route_Paths";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Forbidden } from "@/src/components/common/Forbidden";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, token, isUserLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isForbidden, setIsForbidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !token) {
      router.replace(ROUTES_PATH.AUTH.LOGIN);
    }
  }, [isUserLoading, token, router]);

  useEffect(() => {
    const handleForbidden = () => setIsForbidden(true);
    window.addEventListener("forbidden-error", () => {
      handleForbidden();
    });
    return () => window.removeEventListener("forbidden-error", handleForbidden);
  }, []);

  useEffect(() => {
    setIsForbidden(false);
  }, [pathname]);

  if (isUserLoading) {
    return <CommonLoader message="Verifying session..." />;
  }

  if (!token) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen w-screen min-h-0 overflow-hidden bg-slate-50/30">
      {/* 1. Fixed Header (Stationary) */}
      <Header
        companyName={
          user?.role === UserRoles.SUPER_ADMIN ? "Super Admin" : user?.fullName
        }
        userName={user?.fullName}
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* 2. Main Body Area */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative">
        {/* 3. Fixed Sidebar (Stationary) */}
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
        />

        {/* 4. Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth bg-slate-50/20 shadow-inner custom-scrollbar">
          <div className="p-2 md:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-full">
            {isForbidden ? <Forbidden /> : children}
          </div>
        </main>
      </div>
    </div>
  );
}

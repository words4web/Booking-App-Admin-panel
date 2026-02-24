"use client";

import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ROUTES_PATH from "@/lib/Route_Paths";

export function Forbidden() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-destructive/10 rounded-full blur-3xl scale-150 animate-pulse" />
        <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-destructive/10 border border-destructive/5">
          <ShieldAlert className="h-20 w-20 text-destructive" />
        </div>
      </div>

      <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4 uppercase">
        Access <span className="text-destructive">Denied</span>
      </h1>

      <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed text-lg">
        Oops! You don&apos;t have the required permissions to access this
        restricted area. Please contact your administrator if you believe this
        is a mistake.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="h-12 px-8 rounded-xl font-bold gap-2 border-slate-200 hover:bg-slate-50 transition-all">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        <Button
          onClick={() => router.push(ROUTES_PATH.DASHBOARD)}
          className="h-12 px-8 rounded-xl font-bold gap-2 shadow-lg shadow-primary/10 transition-all">
          <Home className="h-4 w-4" />
          Dashboard Home
        </Button>
      </div>
    </div>
  );
}

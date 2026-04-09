"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ShieldAlert } from "lucide-react";
import ChatWindow from "@/src/components/chat/ChatWindow";

export default function PublicChatPage() {
  const params = useParams();
  const token = params?.token as string;

  // Pattern: {hex32}-{timestamp}
  const TOKEN_REGEX = /^[a-z0-9]{32}-\d+$/;
  const isFormatValid = token && TOKEN_REGEX.test(token);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Optimized Brand Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Image
            src="/divineLogo.png"
            alt="DivineGo Chat"
            width={120}
            height={40}
            className="object-contain"
            priority
          />
          <div className="hidden sm:block h-8 w-px bg-slate-200" />
          <div className="hidden sm:block">
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
              Client <span className="text-primary">Support</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
              Secure Booking Channel
            </p>
          </div>
        </div>

        <div className="text-right hidden xs:block">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            System Status
          </p>
          <div className="flex items-center gap-1.5 justify-end">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-600">
              ENCRYPTED
            </span>
          </div>
        </div>
      </header>

      {/* Full Page Chat Container */}
      <main className="flex-1 relative overflow-hidden flex justify-center bg-[#fcfdfe]">
        <div className="w-full max-w-5xl flex flex-col h-full shadow-2xl shadow-slate-200/50">
          {!isFormatValid ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white h-full text-center">
              <div className="bg-red-50 p-6 rounded-full mb-6">
                <ShieldAlert className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                Invalid Access Link
              </h3>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
                The chat link you've used is malformed or invalid. Please ensure
                you've copied the full URL from your confirmation email.
              </p>
              <div className="mt-8 pt-8 border-t border-slate-100 w-full max-w-xs">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Security Error Code: 0x401_TOKEN_MALFORMED
                </p>
              </div>
            </div>
          ) : (
            <ChatWindow
              token={token}
              isAdmin={false}
              fullHeight
              className="rounded-none border-x-0 sm:border-x border-y-0"
            />
          )}
        </div>
      </main>

      <footer className="py-2 px-6 bg-white border-t border-slate-100 text-[10px] text-slate-400 flex justify-between items-center shrink-0">
        <p>&copy; {new Date()?.getFullYear()} DivineGo Support Systems</p>
      </footer>
    </div>
  );
}

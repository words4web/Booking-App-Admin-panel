"use client";

import { useParams } from "next/navigation";
import ChatWindow from "@/src/components/chat/ChatWindow";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ROUTES_PATH from "@/lib/Route_Paths";

export default function AdminChatPage() {
  const params = useParams();
  const token = params?.token as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Booking Chat Support
          </h2>
          <p className="text-sm text-gray-500">
            Live communication channel with the customer.
          </p>
        </div>
        <Link
          href={ROUTES_PATH.BOOKINGS.BASE}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>
      </div>

      <div className="w-full h-[calc(100vh-180px)]">
        {/* We pass isAdmin={true} to ensure it hits the /admin/chat/messages Bearer Token endpoints */}
        <ChatWindow token={token} isAdmin={true} fullHeight />
      </div>
    </div>
  );
}

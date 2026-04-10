"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "../services/useNotificationQueries";
import {
  listenToForegroundMessages,
  requestNotificationPermission,
} from "@/lib/notifications";

export default function NotificationListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 1. Request Permission and handle token if needed
    requestNotificationPermission();

    // 2. Listen for messages
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      unsubscribe = await listenToForegroundMessages((payload) => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });

        const data = payload.data || payload.additionalData || {};
        const type = data.type;
        // List of booking related events
        const bookingEvents = [
          "booking_assigned",
          "booking_accepted",
          "booking_started",
          "booking_submitted",
          "booking_approved",
          "booking_rejected",
          "booking_resubmitted",
        ];

        if (type && bookingEvents.includes(type)) {
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
          queryClient.invalidateQueries({ queryKey: ["booking"] });
        }

        // List of driver related events
        const driverEvents = [
          "driver_signup",
          "admin_new_driver",
          "driver_verified",
          "driver_document_approved",
          "driver_document_rejected",
          "admin_document_upload",
          "admin_driver_account_deleted",
        ];

        if (type && driverEvents.includes(type)) {
          queryClient.invalidateQueries({ queryKey: ["drivers"] });
        }

        // List of invoice related events
        const invoiceEvents = ["invoice_email_sent", "invoice_email_failed"];

        if (type && invoiceEvents.includes(type)) {
          queryClient.invalidateQueries({ queryKey: ["invoices"] });
        }

        // Chat related events
        if (type === "chat_message") {
          queryClient.invalidateQueries({ queryKey: ["chat"] });
        }
      });
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [queryClient]);

  return null;
}

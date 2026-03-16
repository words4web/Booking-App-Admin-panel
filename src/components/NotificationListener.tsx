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
        console.log("Full FCM Payload:", JSON.stringify(payload, null, 2));

        // ALWAYS invalidate notifications list and unread count
        console.log("Invalidating notification queries...");
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });

        // Context-aware invalidation
        // FCM might put data in different places depending on how it's sent
        const data = payload.data || payload.additionalData || {};
        const type = data.type;
        console.log("Extracted Type:", type);

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
          console.log(`Event [${type}] received. Invalidating bookings...`);
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
          // Also invalidate specific booking if needed? Usually list is enough
        }

        // List of driver related events
        const driverEvents = [
          "driver_signup",
          "admin_new_driver",
          "driver_verified",
          "driver_updated",
          "driver_document_approved",
          "driver_document_rejected",
          "admin_document_upload",
        ];

        if (type && driverEvents.includes(type)) {
          console.log(`Event [${type}] received. Invalidating drivers...`);
          queryClient.invalidateQueries({ queryKey: ["drivers"] });
        }

        // List of invoice related events
        const invoiceEvents = ["invoice_email_sent", "invoice_email_failed"];

        if (type && invoiceEvents.includes(type)) {
          console.log(`Event [${type}] received. Invalidating invoices...`);
          queryClient.invalidateQueries({ queryKey: ["invoices"] });
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

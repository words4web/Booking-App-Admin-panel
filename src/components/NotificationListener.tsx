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
        // ALWAYS invalidate notifications list and unread count
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });

        // Context-aware invalidation based on notification type
        const type = payload.data?.type;
        console.log("Notification type received:", type);

        if (
          type &&
          [
            "booking_assigned",
            "booking_accepted",
            "booking_started",
            "booking_submitted",
            "booking_approved",
            "booking_rejected",
          ].includes(type)
        ) {
          console.log("Invalidating bookings query...");
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
        }

        if (type === "driver_signup" || type === "admin_new_driver") {
          console.log("Invalidating drivers query...");
          queryClient.invalidateQueries({ queryKey: ["drivers"] });
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

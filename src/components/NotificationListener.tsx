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
      unsubscribe = await listenToForegroundMessages(() => {
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
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

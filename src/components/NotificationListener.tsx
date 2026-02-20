"use client";

import { useEffect } from "react";
import {
  listenToForegroundMessages,
  requestNotificationPermission,
} from "@/lib/notifications";

export default function NotificationListener() {
  useEffect(() => {
    // 1. Request Permission and handle token if needed
    requestNotificationPermission();
    // 2. Listen for messages
    listenToForegroundMessages();
  }, []);

  return null;
}

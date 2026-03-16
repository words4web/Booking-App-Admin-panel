"use client";

import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { FCM_TOKEN } from "../constants/user.constants";
import {
  useRemoveDeviceMutation,
  useSyncDeviceMutation,
} from "../services/deviceManager/useDeviceMutations";
import { EPlatformType } from "../enums/device.enum";

/**
 * Hook that manages the full FCM token lifecycle for the Admin Panel.
 *
 * - Syncs the token immediately when the user is present (on mount or user change).
 * - Re-syncs when the user returns to the tab via the Page Visibility API,
 *   which catches Firebase token rotation that may have happened in the background.
 * - Listens for permission changes via the Permissions API, automatically syncing
 *   if the user grants permission manually in their browser settings.
 */
export const useFcmLifecycle = (user: any) => {
  const { mutate: syncDevice } = useSyncDeviceMutation();
  const { mutate: removeDevice } = useRemoveDeviceMutation();

  useEffect(() => {
    console.log("[FCM] User context active:", user?._id);
    if (!user) return;

    const performSync = async () => {
      try {
        if (typeof window === "undefined") return;

        if (Notification.permission !== "granted") {
          // Clear token locally and on backend if permission is denied or reset
          const localToken = localStorage.getItem(FCM_TOKEN);
          if (localToken) {
            console.log(
              "[FCM] Permission not granted. Removing from backend...",
            );
            removeDevice(localToken, {
              onSuccess: () => {
                localStorage.removeItem(FCM_TOKEN);
                console.log("[FCM] Local token cleared.");
              },
            });
          }
          return;
        }

        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        // Explicitly register the service worker to avoid race conditions
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );

        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!currentToken) return;

        const lastSyncedToken = localStorage.getItem(FCM_TOKEN);

        // Only hit the backend if the token is new or has rotated
        if (currentToken !== lastSyncedToken) {
          syncDevice(
            { fcmToken: currentToken, platform: EPlatformType.WEB },
            {
              onSuccess: () => {
                localStorage.setItem(FCM_TOKEN, currentToken);
                console.log("[FCM] Token synced with backend.");
              },
            },
          );
        }
      } catch (err) {
        console.error("[FCM] Token sync failed:", err);
      }
    };

    // 1. Sync immediately on mount
    performSync();

    // 2. Re-sync on tab focus (Visibility API)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        performSync();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 3. Listen for permission changes (Permissions API)
    let permissionStatus: PermissionStatus | undefined;
    const handlePermissionChange = () => {
      if (Notification.permission === "granted") {
        console.log("[FCM] Permission granted via settings. Syncing...");
        performSync();
      } else {
        const localToken = localStorage.getItem(FCM_TOKEN);
        if (localToken) {
          console.log(
            "[FCM] Permission denied/reset. Removing from backend...",
          );
          removeDevice(localToken, {
            onSuccess: () => {
              localStorage.removeItem(FCM_TOKEN);
              console.log("[FCM] Local token cleared.");
            },
          });
        }
      }
    };

    const setupPermissionListener = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          permissionStatus = await navigator.permissions.query({
            name: "notifications" as PermissionName,
          });
          permissionStatus.addEventListener("change", handlePermissionChange);
        }
      } catch (err) {
        console.warn("[FCM] Permissions API listener setup failed:", err);
      }
    };

    setupPermissionListener();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (permissionStatus) {
        permissionStatus.removeEventListener("change", handlePermissionChange);
      }
    };
  }, [user, syncDevice]);
};

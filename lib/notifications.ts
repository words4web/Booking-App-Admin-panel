import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";
import { toast } from "react-toastify";

let lastMessageId: string | null = null;

export const requestNotificationPermission = async () => {
  if (typeof window === "undefined" || !("Notification" in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Notification permission denied");
    return null;
  }

  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    return token;
  } catch (error) {
    console.error("Error getting notification token:", error);
    return null;
  }
};

export const listenToForegroundMessages = async (
  callback?: (payload: any) => void,
) => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  console.log("Setting up foreground message listener...");

  return onMessage(messaging, (payload) => {
    console.log("FCM Payload Received in lib/notifications.ts:", payload);

    // Deduplicate notifications based on messageId
    const messageId = (payload as any).messageId;
    if (messageId && messageId === lastMessageId) {
      console.log(
        "Duplicate notification detected via messageId, skipping UI.",
      );
      return;
    }
    if (messageId) {
      lastMessageId = messageId;
    }

    const title = payload.notification?.title || "New Notification";
    const body = payload.notification?.body || "";

    // 1. Show Toast
    toast.info(`${title}${body ? `: ${body}` : ""}`);

    // 2. Show System Notification
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/divineLogo.png",
      });
    }

    // 3. Execute callback
    if (callback) {
      console.log("Executing NotificationListener callback...");
      callback(payload);
    }
  });
};

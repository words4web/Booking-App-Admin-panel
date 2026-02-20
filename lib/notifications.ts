import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";
import { toast } from "react-toastify";

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
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    return token;
  } catch (error) {
    console.error("Error getting notification token:", error);
    return null;
  }
};

export const listenToForegroundMessages = async () => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);

    const title = payload.notification?.title || "New Notification";
    const body = payload.notification?.body || "";

    // 1. Show Toast
    toast.info(`${title}${body ? `: ${body}` : ""}`);

    // 2. Show System Notification (if permission granted and app is in foreground)
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/logo.png", // Ensure this exists or use a default
      });
    }
  });
};

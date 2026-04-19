importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

firebase.initializeApp({
  apiKey: "AIzaSyDk2_-DtwNn8vc2FSytJupT8LxFbvLJnw8",
  authDomain: "rkb-divine-app-145f5.firebaseapp.com",
  projectId: "rkb-divine-app-145f5",
  storageBucket: "rkb-divine-app-145f5.firebasestorage.app",
  messagingSenderId: "792293448126",
  appId: "1:792293448126:web:ee5c452dd64a3b7d3081ef",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/divineLogo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(url);
      }),
  );
});

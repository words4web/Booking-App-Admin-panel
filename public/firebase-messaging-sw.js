importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

// These values will be replaced by the build process or should match the .env
firebase.initializeApp({
  apiKey: "AIzaSyD-zal8OYg4JGhDaCYTYt_GnAH8C9LXBTc",
  authDomain: "bookingapp-46af6.firebaseapp.com",
  projectId: "bookingapp-46af6",
  storageBucket: "bookingapp-46af6.firebasestorage.app",
  messagingSenderId: "162541135258",
  appId: "1:162541135258:web:447ce84b2d4bcd37570623",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

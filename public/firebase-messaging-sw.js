importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

// These values will be replaced by the build process or should match the .env
firebase.initializeApp({
  apiKey: "AIzaSyC-Efw2S7oYNzDiMoZF_bHuFpQh7K4ys1k",
  authDomain: "divine-app-e0237.firebaseapp.com",
  projectId: "divine-app-e0237",
  storageBucket: "divine-app-e0237.firebasestorage.app",
  messagingSenderId: "788891445311",
  appId: "1:788891445311:web:9210fc6be503128814b08a",
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

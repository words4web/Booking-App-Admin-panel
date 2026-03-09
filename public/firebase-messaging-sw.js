importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyC-AIzaSyAAgFET5dX4_Mq_ZKkDhrsL_PwayZ3IdSA",
  authDomain: "rkb-divine-app.firebaseapp.com",
  projectId: "rkb-divine-app",
  storageBucket: "rkb-divine-app.firebasestorage.app",
  messagingSenderId: "20802354440",
  appId: "1:20802354440:web:3128e9c9edb5ec6f1580bd",
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

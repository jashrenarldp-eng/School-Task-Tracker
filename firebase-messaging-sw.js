importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDUSmond8b9lMprdHjnvnuRygaRdC9kbxo",
  authDomain: "takeitdoit-app.firebaseapp.com",
  projectId: "takeitdoit-app",
  storageBucket: "takeitdoit-app.firebasestorage.app",
  messagingSenderId: "1057165971311",
  appId: "1:1057165971311:web:801032e04ea0fb7d27e29a"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);

  const notificationTitle = payload.notification?.title || "New Class Task!";
  const notificationOptions = {
    body: payload.notification?.body || "A new assignment has been posted by an officer.",
    icon: "./icon-192.png", // Replace with your PWA icon path if available
    badge: "./badge.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

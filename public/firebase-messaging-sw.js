// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyC5sB_Gk-v4A1b2c3d4e5f6g7h8i9j0k",
  authDomain: "save-genie-video-downloader.firebaseapp.com",
  projectId: "save-genie-video-downloader",
  storageBucket: "save-genie-video-downloader.appspot.com",
  messagingSenderId: "713351902363",
  appId: "1:713351902363:web:8c5e49dcf9b605e400023e"
});


// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

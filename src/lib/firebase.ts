
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_Wjl-gchuuSc09toj1NXgZaY68gMZiNg",
  authDomain: "save-genie-video-downloader.firebaseapp.com",
  projectId: "save-genie-video-downloader",
  storageBucket: "save-genie-video-downloader.firebasestorage.app",
  messagingSenderId: "713351902363",
  appId: "1:713351902363:web:8c5e49dcf9b605e400023e"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);


const saveFCMToken = async (token: string) => {
  try {
    await addDoc(collection(db, "fcmTokens"), {
      token: token,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error saving FCM token to Firestore: ", error);
  }
};


export const requestNotificationPermission = async () => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const messaging = getMessaging(app);
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "YOUR_VAPID_KEY_FROM_FIREBASE_CONSOLE",
        });
        if (token) {
          console.log("FCM Token:", token);
          saveFCMToken(token);
        } else {
          console.log("No registration token available. Request permission to generate one.");
        }
      } else {
        console.log("Unable to get permission to notify.");
      }
    } catch(err) {
      console.error('An error occurred while retrieving token. ', err);
    }
  }
};

export const onMessageListener = () => {
    if (typeof window !== 'undefined') {
        const messaging = getMessaging(app);
        return new Promise((resolve) => {
            onMessage(messaging, (payload) => {
                resolve(payload);
            });
        });
    }
    return Promise.resolve(null);
}

export { app, db, auth };

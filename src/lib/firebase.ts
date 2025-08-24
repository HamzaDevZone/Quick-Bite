
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5sB_Gk-v4A1b2c3d4e5f6g7h8i9j0k",
  authDomain: "save-genie-video-downloader.firebaseapp.com",
  projectId: "save-genie-video-downloader",
  storageBucket: "save-genie-video-downloader.appspot.com",
  messagingSenderId: "713351902363",
  appId: "1:713351902363:web:8c5e49dcf9b605e400023e"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };

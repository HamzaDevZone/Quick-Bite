
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig: FirebaseOptions = {
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

export { app, db, auth };

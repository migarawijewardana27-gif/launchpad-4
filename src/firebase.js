// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArylCz_uVsaToyZlGwlg_MGatcLeuD5Zo",
  authDomain: "launchpad-67cec.firebaseapp.com",
  projectId: "launchpad-67cec",
  storageBucket: "launchpad-67cec.firebasestorage.app",
  messagingSenderId: "389045023693",
  appId: "1:389045023693:web:cf0e2fef18fd675ce4ca84",
  measurementId: "G-39MJR86RFK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage };

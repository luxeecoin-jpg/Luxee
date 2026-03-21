import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrnqjj4AGLS_Ls0AcEFxGu6eeKNnTeIKI",
  authDomain: "cashflow-pro-c80e2.firebaseapp.com",
  databaseURL: "https://cashflow-pro-c80e2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cashflow-pro-c80e2",
  storageBucket: "cashflow-pro-c80e2.firebasestorage.app",
  messagingSenderId: "735150207138",
  appId: "1:735150207138:web:688e68fa1f0fcce9bd67fb",
  measurementId: "G-8R2JNL3M3W"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

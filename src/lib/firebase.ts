import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzKkdc-DEC0zWJsel82uFlywFNoZNVC4A",
  authDomain: "luxee-231fe.firebaseapp.com",
  databaseURL: "https://luxee-231fe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "luxee-231fe",
  storageBucket: "luxee-231fe.firebasestorage.app",
  messagingSenderId: "927115446242",
  appId: "1:927115446242:web:23569d48f25032b8719bbb",
  measurementId: "G-06BXEHVLTZ"
};
// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

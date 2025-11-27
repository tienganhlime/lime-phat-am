// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2VOZ0A5im13MC6FNLa4bEupKedm5iiBo",
  authDomain: "lime-phat-am.firebaseapp.com",
  projectId: "lime-phat-am",
  storageBucket: "lime-phat-am.firebasestorage.app",
  messagingSenderId: "434295865710",
  appId: "1:434295865710:web:5f373900f5e8c1d679417f",
  measurementId: "G-K1PHBV3HMY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
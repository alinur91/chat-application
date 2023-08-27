import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC9m2j-rneDcxt_rcDcmWB55mlwS1TPo64",
  authDomain: "chat-app-4006c.firebaseapp.com",
  projectId: "chat-app-4006c",
  storageBucket: "chat-app-4006c.appspot.com",
  messagingSenderId: "711934902626",
  appId: "1:711934902626:web:0f5e545a2356b1b8afec3b",
  measurementId: "G-HBB3DS90TQ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account'})
export const auth = getAuth()

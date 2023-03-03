import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "zetafood-a0d87.firebaseapp.com",
  projectId: "zetafood-a0d87",
  storageBucket: "zetafood-a0d87.appspot.com",
  messagingSenderId: "290084228455",
  appId: "1:290084228455:web:bcceed22a43d776a50f3c2",
  measurementId: "G-9JDTC577KK"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

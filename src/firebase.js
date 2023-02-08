import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "zetafood-dev.firebaseapp.com",
  projectId: "zetafood-dev",
  storageBucket: "zetafood-dev.appspot.com",
  messagingSenderId: "504412099207",
  appId: "1:504412099207:web:b5f48bbfeefe91f5b29e22",
  measurementId: "G-88BH1CNGLG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

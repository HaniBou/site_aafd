import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {

  apiKey: "AIzaSyDiTJIqoZE3wncqZ-rV5z7RfRfcDFIKCCc",

  authDomain: "aafd-projet.firebaseapp.com",

  projectId: "aafd-projet",

  storageBucket: "aafd-projet.firebasestorage.app",

  messagingSenderId: "1017361904784",

  appId: "1:1017361904784:web:4c3dd9c956ac29d28a5415"

};
// éviter d’initialiser deux fois (Next.js fait du hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);export const auth = getAuth(app);
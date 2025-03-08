import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAgZROO-BQoWG6MNqqDBs8EsYRv3FQBc8A",
  authDomain: "finance-tracker-f9eac.firebaseapp.com",
  projectId: "finance-tracker-f9eac",
  storageBucket: "finance-tracker-f9eac.firebasestorage.app",
  messagingSenderId: "191473915191",
  appId: "1:191473915191:web:d4432f9eafe1e76e9476b2",
  measurementId: "G-4F9L1Y5FT4"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
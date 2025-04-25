import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASITXiDvsOsn-OBDBL42d35fAmigO-mYM",
  authDomain: "recipe-912c7.firebaseapp.com",
  projectId: "recipe-912c7",
  storageBucket: "recipe-912c7.firebasestorage.app",
  messagingSenderId: "107049671392",
  appId: "1:107049671392:web:67f8e91db594bbefad0e85",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };

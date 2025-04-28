import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyASITXiDvsOsn-OBDBL42d35fAmigO-mYM",
  authDomain: "recipe-912c7.firebaseapp.com",
  projectId: "recipe-912c7",
  storageBucket: "recipe-912c7.firebasestorage.app",
  messagingSenderId: "107049671392",
  appId: "1:107049671392:web:67f8e91db594bbefad0e85"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Export auth, firestore, storage
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, provider, db, storage };

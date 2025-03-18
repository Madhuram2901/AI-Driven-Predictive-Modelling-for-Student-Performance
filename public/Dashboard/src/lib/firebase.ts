import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDxJOJ3guXJuw2g4eragEt_y-Ywnbdy-I8",
  authDomain: "student-performance-ai.firebaseapp.com",
  projectId: "student-performance-ai",
  storageBucket: "student-performance-ai.firebasestorage.app",
  messagingSenderId: "680125122934",
  appId: "1:680125122934:web:a228bb8a4d230b729b9257",
  measurementId: "G-K33MXP82WC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 
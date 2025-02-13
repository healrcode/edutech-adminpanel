import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBSk4r5mVtDNUV9bPaAVnfaURZDhuokpM",
  authDomain: "edutech-001.firebaseapp.com",
  projectId: "edutech-001",
  storageBucket: "edutech-001.firebasestorage.app",
  messagingSenderId: "20947030371",
  appId: "1:20947030371:web:0492cfbcdd99a91f658356",
  measurementId: "G-T7Z5M2F0CS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;

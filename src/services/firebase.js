import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAzjh97SqnF7vN4zY2LVvMnvxZAH3Q5NU8",
  authDomain: "ai-portfolio-builder-7268f.firebaseapp.com",
  projectId: "ai-portfolio-builder-7268f",
  storageBucket: "ai-portfolio-builder-7268f.firebasestorage.app",
  messagingSenderId: "171093445811",
  appId: "1:171093445811:web:ab0bb01ce0bbc69207b4c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
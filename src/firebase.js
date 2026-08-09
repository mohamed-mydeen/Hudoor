import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCc2XkjTz8arrrISe5YyeuAo5QN9J8C9pM",
  authDomain: "hudoor-ef534.firebaseapp.com",
  projectId: "hudoor-ef534",
  storageBucket: "hudoor-ef534.firebasestorage.app",
  messagingSenderId: "710026550346",
  appId: "1:710026550346:web:f0da046eb8fa30cbb45ab3",
  measurementId: "G-40LD344XTL"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
} catch (e) {
  // Fallback for Vite HMR if already initialized
  dbInstance = getFirestore(app);
}
export const db = dbInstance;

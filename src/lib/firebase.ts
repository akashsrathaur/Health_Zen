
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

const firebaseConfigValues = Object.values(firebaseConfig);
const hasAllConfig = firebaseConfigValues.every(value => !!value);

if (hasAllConfig) {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e) {
      console.error("Failed to initialize Firebase", e);
      // Provide dummy objects to prevent app from crashing
      app = {} as FirebaseApp;
    }
  } else {
    app = getApp();
  }

  try {
    auth = getAuth(app);
    db = getFirestore(app);
  } catch(e) {
    console.error("Failed to get Firebase services", e);
    auth = {} as Auth;
    db = {} as Firestore;
  }
} else {
  console.warn("Firebase configuration is incomplete. Firebase services will be disabled.");
  // Provide dummy objects to prevent app from crashing if config is missing
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
}

export { app, auth, db };

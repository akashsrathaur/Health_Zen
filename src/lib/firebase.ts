
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

// This check is crucial for Next.js. It ensures that on the server,
// we don't try to re-initialize the app on every hot-reload.
// On the client, it will always initialize a new app.
if (getApps().length === 0) {
    if (!firebaseConfig.apiKey) {
        console.warn("Firebase configuration is missing or incomplete. Firebase services will be disabled. This is normal during the build process, but if you see this in the browser, your environment variables are not set correctly.");
        app = {} as FirebaseApp;
        auth = {} as Auth;
        db = {} as Firestore;
    } else {
        app = initializeApp(firebaseConfig);
    }
} else {
    app = getApp();
}

// We always get the auth and firestore instances from the initialized app.
// This ensures we don't have issues with missing config during server-side builds.
if (app.options) {
    auth = getAuth(app);
    db = getFirestore(app);
}

export { app, auth, db };

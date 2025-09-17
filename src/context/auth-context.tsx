
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserFromFirestore } from '@/actions/user';
import type { User } from '@/lib/user-store';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userProfile = await getUserFromFirestore(fbUser.uid);
          setUser(userProfile);
        } catch (e: any) {
          // This is the crucial fallback.
          // If Firestore is inaccessible due to IAM permissions,
          // we create a temporary local user object to prevent the app from crashing.
          if (e.message.includes('Could not retrieve user profile')) {
             console.warn(
              'WARNING: Failed to fetch user profile from Firestore. This is likely due to missing IAM permissions in your Google Cloud project. The app will use a temporary local profile. PLEASE FOLLOW THE INSTRUCTIONS IN README.md TO FIX THIS.'
            );
            setUser({
              uid: fbUser.uid,
              name: 'New User',
              age: 0,
              gender: 'Prefer not to say',
              avatarUrl: `https://picsum.photos/seed/${fbUser.uid}/100/100`,
              streak: 0,
            });
          } else {
             console.error("An unexpected error occurred while fetching user profile:", e);
             setUser(null); // Log out the user on other unexpected errors
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

    
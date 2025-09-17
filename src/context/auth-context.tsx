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
        } catch (e) {
          console.error(
            'Failed to fetch user profile, this is expected if IAM permissions are not set. See README.md',
            e
          );
          // When the profile fetch fails, create a temporary local profile
          setUser({
            uid: fbUser.uid,
            name: 'New User (Read-Only)',
            age: 0,
            gender: 'Prefer not to say',
            avatarUrl: `https://picsum.photos/seed/${fbUser.uid}/100/100`,
            streak: 0,
          });
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


'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserFromFirestore } from '@/actions/user';
import type { User } from '@/lib/user-store';
import { defaultUser } from '@/lib/user-store';

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

// A simple retry function
const retry = <T,>(fn: () => Promise<T>, retries = 3, delay = 500): Promise<T> => {
  return new Promise((resolve, reject) => {
    const attempt = (n: number) => {
      fn()
        .then(resolve)
        .catch(err => {
          if (n === 1) {
            reject(err);
          } else {
            setTimeout(() => attempt(n - 1), delay);
          }
        });
    };
    attempt(retries);
  });
};


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (uid: string) => {
      try {
        const userProfile = await retry(() => getUserFromFirestore(uid));
        
        if (userProfile) {
          setUser(userProfile);
        } else {
          // If profile doesn't exist, create a temporary one to avoid showing "Wellness Seeker"
          // This can happen if there's a delay in Firestore document creation after signup
          setUser({ ...defaultUser, uid: uid, name: 'New User' });
        }
      } catch (error) {
        console.error("Failed to fetch user profile from Firestore on client after retries:", error);
        // In case of error, set a default object to keep the app functional
        setUser({ ...defaultUser, uid: uid, name: 'Guest' });
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setLoading(true);
        await fetchUserData(fbUser.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

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

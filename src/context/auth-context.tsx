
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { getUserFromFirestore, createUserInFirestore } from '@/actions/user';
import type { User } from '@/lib/user-store';
import { defaultUser } from '@/lib/user-store';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initialChallenges, initialDailyVibes } from '@/lib/data';

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

const retry = <T,>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  return new Promise((resolve, reject) => {
    const attempt = (n: number) => {
      fn()
        .then(resolve)
        .catch(err => {
          if (n === 1) {
            reject(err);
          } else {
            console.log(`Retrying... attempts left: ${n - 1}`);
            setTimeout(() => attempt(n - 1), delay * (Math.pow(2, retries - n)));
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
          // Check if user has userData, if not, create it.
          const userDataRef = doc(db, 'userData', uid);
          const userDataSnap = await getDoc(userDataRef);
          if (!userDataSnap.exists()) {
              await setDoc(userDataRef, {
                  dailyVibes: initialDailyVibes,
                  challenges: initialChallenges,
                  posts: []
              });
          }

        } else {
          // This case might happen if Firestore is slow to create the user document after signup.
          console.warn(`User profile for ${uid} not found, using default. This can happen on first login.`);
          setUser({ ...defaultUser, uid: uid, name: 'New User' });
        }
      } catch (error) {
        console.error("Failed to fetch user profile from Firestore on client after retries:", error);
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

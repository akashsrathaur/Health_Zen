
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserFromFirestore } from '@/actions/user';
import type { User } from '@/lib/user-store';
import { usePathname, useRouter } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // User is logged in
        const userProfile = await getUserFromFirestore(fbUser.uid);
        setUser(userProfile);
        // If they are on a public auth page, redirect to dashboard
        if (pathname === '/login' || pathname === '/signup') {
          router.replace('/dashboard');
        }
      } else {
        // User is logged out
        setUser(null);
        // If they are on a protected app page, redirect to login
        if (pathname !== '/login' && pathname !== '/signup') {
          router.replace('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  // Using pathname in dependency array can cause loops if not handled carefully.
  // We only want this effect to run on initial load and when auth state changes.
  // The router object itself is stable.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading }}>
      {loading ? <div className='h-screen w-full flex items-center justify-center'>Loading...</div> : children}
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

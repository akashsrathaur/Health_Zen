
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

const publicRoutes = ['/login', '/signup'];

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
        try {
          // User is logged in
          const userProfile = await getUserFromFirestore(fbUser.uid);
          setUser(userProfile);
        } catch (e) {
            console.error("Failed to fetch user profile, this is expected if IAM permissions are not set. See README.md", e);
            // In case of error (e.g. permissions not set), we'll set a default user
            // to prevent the app from crashing. This is a temporary measure.
             setUser({
                uid: fbUser.uid,
                name: 'New User (Read-Only)',
                age: 0,
                gender: 'Prefer not to say',
                avatarUrl: `https://picsum.photos/seed/${fbUser.uid}/100/100`,
                streak: 0
            });
        }
      } else {
        // User is logged out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = publicRoutes.some(path => pathname.startsWith(path));

    if (firebaseUser && isPublicRoute) {
        // Logged-in user tries to access login/signup, redirect to dashboard
        router.replace('/dashboard');
    } else if (!firebaseUser && !isPublicRoute) {
        // Logged-out user tries to access a protected route, redirect to login
        router.replace('/login');
    }

  }, [loading, firebaseUser, pathname, router]);

  const showLoading = loading || (!user && !!firebaseUser);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading: showLoading }}>
      {showLoading ? <div className='h-screen w-full flex items-center justify-center bg-background'>
          <div className='flex flex-col items-center gap-4'>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className='text-muted-foreground'>Loading your wellness journey...</p>
          </div>
      </div> : children}
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


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
  const [serverLoading, setServerLoading] = useState(true);
  const [clientLoading, setClientLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

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
      setServerLoading(false);
      setClientLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (serverLoading) return;

    const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path));

    if (firebaseUser && isPublicRoute) {
      router.replace('/dashboard');
    } else if (!firebaseUser && !isPublicRoute) {
      router.replace('/login');
    }
  }, [serverLoading, firebaseUser, pathname, router]);

  useEffect(() => {
    setClientLoading(serverLoading || (!user && !!firebaseUser));
  },[serverLoading, user, firebaseUser])

  if (clientLoading) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading your wellness journey...</p>
            </div>
        </div>
      )
  }


  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading: serverLoading }}>
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

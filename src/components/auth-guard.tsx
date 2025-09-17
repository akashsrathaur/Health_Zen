'use client';

import { useAuth } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Icons } from './icons';

const publicRoutes = ['/login', '/signup'];

function LoadingScreen() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading your wellness journey...</p>
            </div>
        </div>
    );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Wait for the auth state to be determined.
    }

    const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path));

    // If user is not logged in and trying to access a protected route, redirect to login
    if (!firebaseUser && !isPublicRoute) {
      router.replace('/login');
    }
    
    // If user is logged in and tries to access a public route, redirect to dashboard
    if (firebaseUser && isPublicRoute) {
      router.replace('/dashboard');
    }

  }, [firebaseUser, loading, pathname, router]);

  // While loading the initial auth state, show a loading screen.
  if (loading) {
    return <LoadingScreen />;
  }

  const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path));

  // If user is logged in, they can see protected routes.
  if (firebaseUser && !isPublicRoute) {
    return <>{children}</>;
  }

  // If user is not logged in, they can see public routes.
  if (!firebaseUser && isPublicRoute) {
    return <>{children}</>;
  }
  
  // For any other case (like during a redirect), show a loading screen to prevent flicker.
  return <LoadingScreen />;
}

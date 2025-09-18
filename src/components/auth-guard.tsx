
'use client';

import { useAuth } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

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

  const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path));

  useEffect(() => {
    if (loading) {
      console.log('AuthGuard: Still loading auth state');
      return; // Wait for the auth state to be determined.
    }

    console.log('AuthGuard: Auth state loaded', { 
      firebaseUser: !!firebaseUser, 
      pathname, 
      isPublicRoute 
    });

    // If user is not logged in and trying to access a protected route, redirect to login
    if (!firebaseUser && !isPublicRoute) {
      console.log('AuthGuard: Redirecting to login - user not authenticated');
      router.replace('/login');
      return;
    }
    
    // If user is logged in and tries to access a public route, redirect to dashboard
    if (firebaseUser && isPublicRoute) {
      console.log('AuthGuard: Redirecting to dashboard - user already authenticated');
      router.replace('/dashboard');
      return;
    }

    console.log('AuthGuard: No redirect needed, staying on', pathname);
  }, [firebaseUser, loading, pathname, router, isPublicRoute]);

  // While loading the initial auth state, show a loading screen.
  if (loading) {
    return <LoadingScreen />;
  }
  
  // After loading, if we are on a public route or if user is authenticated for a private one
  if (isPublicRoute || firebaseUser) {
    return <>{children}</>;
  }

  // Fallback loading screen during redirection
  return <LoadingScreen />;
}

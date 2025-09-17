
'use client';

import { useAuth } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const publicRoutes = ['/login', '/signup'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }

    const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path));
    
    if (firebaseUser && isPublicRoute) {
      // If user is logged in and tries to access a public route, redirect to dashboard
      router.replace('/dashboard');
    } else if (!firebaseUser && !isPublicRoute) {
      // If user is not logged in and tries to access a protected route, redirect to login
      router.replace('/login');
    }

  }, [firebaseUser, loading, pathname, router]);

  // While loading, show a full-screen loading indicator
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  // If on a public route and not logged in OR on a private route and logged in, show the children
  const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path));
  if ((isPublicRoute && !firebaseUser) || (!isPublicRoute && firebaseUser)) {
      return <>{children}</>;
  }

  // In other cases (like redirecting), show a loading screen to prevent flicker
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading your wellness journey...</p>
      </div>
    </div>
  );
}

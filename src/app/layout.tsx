
import type { Metadata } from 'next';
import { Provider as BalancerProvider } from 'react-wrap-balancer';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { NotificationProvider } from '@/hooks/use-notifications';

export const metadata: Metadata = {
  title: 'HealthZen',
  description: 'Your wellness companion for a healthier, balanced life.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <BalancerProvider>
              <NotificationProvider>
                <AuthProvider>
                  <AuthGuard>
                    {children}
                  </AuthGuard>
                  <Toaster />
                </AuthProvider>
              </NotificationProvider>
            </BalancerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

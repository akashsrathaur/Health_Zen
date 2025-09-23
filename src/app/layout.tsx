
/**
 * Health Zen - AI-Powered Personalized Wellness Companion
 * Copyright © 2025 Akash Rathaur. All Rights Reserved.
 * 
 * This file is part of Health Zen, a comprehensive wellness platform
 * that combines traditional Ayurvedic wisdom with modern AI technology.
 * 
 * @author Akash Rathaur
 * @email akashsrathaur@gmail.com
 * @website https://github.com/akashsrathaur
 */

import type { Metadata } from 'next'
import { Provider as BalancerProvider } from 'react-wrap-balancer';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { NotificationProvider } from '@/hooks/use-notifications';
import { DynamicThemeColor } from '@/components/dynamic-theme-color';

export const metadata: Metadata = {
  title: 'HealthZen',
  description: 'Your wellness companion for a healthier, balanced life.',
  icons: {
    icon: [
      { url: '/favicon.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
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
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme colors for status bar - matches app background colors */}
        <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        
        {/* iOS specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HealthZen" />
        
        {/* Additional mobile optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className="font-body antialiased">
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <DynamicThemeColor />
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

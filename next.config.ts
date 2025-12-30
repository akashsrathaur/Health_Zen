import type { NextConfig } from 'next';

// Debug and Patch broken localStorage
if (typeof localStorage !== 'undefined') {
  console.log('DEBUG: localStorage exists');
  if (typeof localStorage.getItem !== 'function') {
    console.log('DEBUG: localStorage.getItem is undefined. Patching...');
    // Environment has localStorage but it's broken (Node.js experimental?). Patch it.
    const noopStorage = {
      getItem: () => null,
      setItem: () => { },
      removeItem: () => { },
      clear: () => { },
      length: 0,
      key: () => null,
    };

    try {
      // Try assigning directly first
      (global as any).localStorage = noopStorage;
    } catch (e) {
      // If read-only, try defineProperty
      try {
        Object.defineProperty(global, 'localStorage', {
          value: noopStorage,
          writable: true,
          configurable: true // Allow future changes
        });
      } catch (e2) {
        console.error('FAILED to patch localStorage:', e2);
      }
    }
  }
} else {
  console.log('DEBUG: localStorage is undefined');
}

import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const withPWAConfig = withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false, // Enable in development for testing, or set to process.env.NODE_ENV === "development"
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWAConfig(nextConfig);

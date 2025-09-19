'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function DynamicThemeColor() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    // Determine the actual theme (considering system preference)
    const actualTheme = theme === 'system' ? systemTheme : theme;
    
    // Define theme colors that match the app's background colors
    const lightThemeColor = '#FBF9F7'; // hsl(33, 15%, 98%) - Light background
    const darkThemeColor = '#0F172A';  // hsl(222, 47%, 11%) - Dark background
    
    // Update the theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const newColor = actualTheme === 'dark' ? darkThemeColor : lightThemeColor;
      metaThemeColor.setAttribute('content', newColor);
    }
    
    // Also update any existing theme-color meta tags with media queries
    const lightMetaTag = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
    const darkMetaTag = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
    
    if (lightMetaTag) {
      lightMetaTag.setAttribute('content', lightThemeColor);
    }
    
    if (darkMetaTag) {
      darkMetaTag.setAttribute('content', darkThemeColor);
    }
    
  }, [theme, systemTheme]);

  return null; // This component doesn't render anything
}
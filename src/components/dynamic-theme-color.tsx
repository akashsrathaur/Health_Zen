'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function DynamicThemeColor() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    // Determine the actual theme (considering system preference)
    const actualTheme = theme === 'system' ? systemTheme : theme;
    
    // Define theme colors that match the app's background colors
    const lightThemeColor = '#FFFFFF'; // Pure white (hsl(0, 0%, 100%)) - Light background
    const darkThemeColor = '#1a1d23';  // Dark charcoal (hsl(220, 13%, 9%)) - Dark background
    
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
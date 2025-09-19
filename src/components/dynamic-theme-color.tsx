'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function DynamicThemeColor() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    // Determine the actual theme (considering system preference)
    const actualTheme = theme === 'system' ? systemTheme : theme;
    
    // Define theme colors that match the app's CSS variables
    const lightThemeColor = '#E07935'; // hsl(15 75% 62%) converted to hex
    const darkThemeColor = '#F97316';  // hsl(25 95% 53%) converted to hex
    
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
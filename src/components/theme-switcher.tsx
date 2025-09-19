/**
 * Health Zen - AI-Powered Personalized Wellness Companion
 * Copyright © 2025 Akash Rathaur. All Rights Reserved.
 * 
 * Theme Switcher Component - Dark/Light mode toggle
 * Enhanced with gradient styling for consistent UI theme
 * 
 * @author Akash Rathaur
 * @email akashsrathaur@gmail.com
 * @website https://github.com/akashsrathaur
 */

'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DropdownMenuItem } from './ui/dropdown-menu';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <div className="flex items-center justify-between w-full">
            <Label 
              htmlFor="dark-mode-switch" 
              className="flex items-center gap-2 font-normal cursor-pointer hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-500 hover:bg-clip-text hover:text-transparent transition-colors"
            >
                {isDarkMode ? (
                  <Moon className="h-4 w-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent" />
                ) : (
                  <Sun className="h-4 w-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent" />
                )}
                <span className="text-foreground/80">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
            </Label>
            <Switch
                id="dark-mode-switch"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-400 data-[state=checked]:to-red-500"
            />
        </div>
    </DropdownMenuItem>
  );
}

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
        <div className="flex items-center justify-between w-full smooth-transition">
            <Label 
              htmlFor="dark-mode-switch" 
              className="flex items-center gap-2 font-normal cursor-pointer text-responsive-base hover:text-primary smooth-transition"
            >
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-primary animate-gentle-bounce" />
                ) : (
                  <Sun className="h-4 w-4 text-primary animate-gentle-bounce" />
                )}
                <span className="text-foreground/80">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
            </Label>
            <Switch
                id="dark-mode-switch"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary"
            />
        </div>
    </DropdownMenuItem>
  );
}

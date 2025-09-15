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
            <Label htmlFor="dark-mode-switch" className="flex items-center gap-2 font-normal cursor-pointer">
                {isDarkMode ? <Moon /> : <Sun />}
                <span>Dark Mode</span>
            </Label>
            <Switch
                id="dark-mode-switch"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
            />
        </div>
    </DropdownMenuItem>
  );
}

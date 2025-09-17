
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  HeartPulse,
  Bot,
  Users,
  BarChart,
  Settings,
  Target,
  Leaf,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/health-snap', label: 'HealthSnap', icon: HeartPulse },
  { href: '/symptom-check', label: 'Symptom Check', icon: Bot },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/progress-tracker', label: 'Tracker', icon: BarChart },
  { href: '/challenges', label: 'Challenges', icon: Target },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <SidebarMenu className={state === 'collapsed' ? 'p-2 items-center' : 'p-2'}>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
              data-state={state}
            >
              <item.icon className="h-5 w-5" />
              <span className={state === 'collapsed' ? 'hidden' : 'block'}>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  HeartPulse,
  Bot,
  Leaf,
  Users,
  BarChart,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/health-snap', label: 'HealthSnap', icon: HeartPulse },
  { href: '/symptom-check', label: 'Symptom Check', icon: Bot },
  { href: '/remedies', label: 'Remedies', icon: Leaf },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/progress-tracker', label: 'Tracker', icon: BarChart },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="p-2">
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}


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
  { href: '/symptom-check', label: 'Dr. Cure', icon: Bot },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/progress-tracker', label: 'Tracker', icon: BarChart },
  { href: '/diet', label: 'Diet Plan', icon: Leaf },
  { href: '/challenges', label: 'Challenges', icon: Target },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainNav() {
  const pathname = usePathname();
  const { state, isMobile, setOpen } = useSidebar();

  const handleNavItemClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <SidebarMenu className={state === 'collapsed' ? 'p-2 items-center' : 'p-2'}>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} onClick={handleNavItemClick}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={state === 'collapsed' ? item.label : undefined}
              data-state={state}
              className="data-[state=collapsed]:justify-center"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={`transition-all duration-300 ${state === 'collapsed' ? 'sr-only' : 'block'}`}>
                {item.label}
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

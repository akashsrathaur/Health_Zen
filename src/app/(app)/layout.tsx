'use client';
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  useSidebar,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { ChatBuddy } from '@/components/chat-buddy';
import { useAppServices } from '@/hooks/use-app-services';

function AppContent({ children }: { children: React.ReactNode }) {
  const { state, isMobile } = useSidebar();
  
  // Initialize app services (notifications, daily reset)
  useAppServices();
  
  const mainContentStyle: React.CSSProperties = !isMobile ? {
    marginLeft: state === 'collapsed' ? 'var(--sidebar-width-icon)' : 'var(--sidebar-width)',
    transition: 'margin-left 0.3s ease-in-out'
  } : {};

  return (
    <div style={mainContentStyle} className="min-h-screen">
      <header className="gradient-nav sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger />
          <div className="hidden items-center gap-2 sm:flex">
            <Link href="/dashboard" className='flex items-center gap-2'>
              <Icons.logo className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-semibold gradient-text text-sm sm:text-base">HealthZen</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <UserNav />
        </div>
      </header>
      <main className="flex-1 p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
        <div className="mx-auto w-full">
          {children}
        </div>
      </main>
      <ChatBuddy />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Sidebar className="gradient-sidebar border-r">
          <SidebarHeader className="h-14 sm:h-16 justify-center p-3 sm:p-4">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Icons.logo className="h-6 w-6 sm:h-8 sm:w-8" />
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-2">
            <MainNav />
          </SidebarContent>
        </Sidebar>
        <AppContent>{children}</AppContent>
      </div>
    </SidebarProvider>
  );
}

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

function AppContent({ children }: { children: React.ReactNode }) {
  const { state, isMobile } = useSidebar();
  
  const mainContentStyle: React.CSSProperties = !isMobile ? {
    marginLeft: state === 'collapsed' ? 'var(--sidebar-width-icon)' : 'var(--sidebar-width)',
    transition: 'margin-left 0.3s ease-in-out'
  } : {};

  return (
    <div style={mainContentStyle}>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/dashboard" className='flex items-center gap-2'>
              <Icons.logo className="h-6 w-6" />
              <span className="font-semibold">HealthZen</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        {children}
      </main>
      <ChatBuddy />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Sidebar className="border-r">
          <SidebarHeader className="h-16 justify-center p-4">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Icons.logo className="h-8 w-8" />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
        </Sidebar>
        <AppContent>{children}</AppContent>
      </div>
    </SidebarProvider>
  );
}

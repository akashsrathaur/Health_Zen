
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { defaultUser } from '@/lib/user-store';
import { Flame, Bell, User, LogOut, Settings } from 'lucide-react';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { ThemeSwitcher } from './theme-switcher';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';

export function UserNav() {
  const { user, loading } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const router = useRouter();
  
  const userData = user || { ...defaultUser, uid: ''};

  const handleNotificationToggle = (open: boolean) => {
    if (open) {
      markAsRead();
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
       <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
        <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-yellow-500" />
        <span className="font-semibold text-yellow-500">{userData.streak}</span>
      </div>
      <DropdownMenu onOpenChange={handleNotificationToggle}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative rounded-full notification-bell">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-[10px] font-bold shadow-lg notification-badge border-2 border-background"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel>
            <p className="font-semibold">Notifications</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
           <ScrollArea className='h-[300px]'>
             <DropdownMenuGroup>
                {notifications.length === 0 ? (
                    <div className='px-2 py-4 text-center text-sm text-muted-foreground'>
                        No new notifications.
                    </div>
                ) : (
                    notifications.map(notif => (
                        <DropdownMenuItem key={notif.id} className="flex-col items-start gap-1">
                            <p className="font-medium">{notif.title}</p>
                            <p className="text-xs text-muted-foreground">
                                {notif.description}
                            </p>
                            <p className='text-xs text-muted-foreground/80 mt-1'>
                                {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                            </p>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuGroup>
           </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={userData.avatarUrl} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userData.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userData.age} years old
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <Link href="/settings">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <ThemeSwitcher />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

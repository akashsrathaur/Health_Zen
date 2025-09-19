import { Icons } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import { Button } from '@/components/ui/button';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#ff7f7f]/20 via-[#20b2aa]/10 to-background dark:from-[#ff6b6b]/30 dark:via-[#4ecdc4]/20 dark:to-background">
       <div className="w-full bg-background/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-foreground">
                <Icons.logo className="h-6 w-auto" />
            </Link>
             <Button asChild variant="ghost" className="rounded-full">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2" />
                    Back to app
                </Link>
            </Button>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
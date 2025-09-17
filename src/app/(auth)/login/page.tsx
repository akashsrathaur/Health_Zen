'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User, KeyRound, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Checkbox } from '@/components/ui/checkbox';

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/dashboard');
    }
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Icons.logo className="h-8 w-auto" />
      </div>

      <Card className="rounded-t-3xl border-t-4 border-primary bg-card/80 p-8 backdrop-blur-md">
        <form onSubmit={handleLogin} className="animate-pop-in space-y-6">
          <div className="grid gap-2 text-left">
              <Label htmlFor="username">User Name</Label>
              <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="username" type="text" placeholder="Your username" required className="pl-10" />
              </div>
          </div>
          <div className="grid gap-2 text-left">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" required className="pl-10" />
              </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
                <Checkbox id="remember"/>
                <Label htmlFor="remember" className="font-normal text-muted-foreground">Remember Password</Label>
            </div>
          </div>

          <Button size="lg" className="w-full bg-gradient-to-r from-primary to-red-400 text-lg font-bold" type="submit">
            Sign In
          </Button>
        </form>
      </Card>
      <div className="flex justify-between items-center text-sm">
         <Button variant="ghost" asChild>
            <Link href="/signup"><ArrowLeft className='mr-2 h-4 w-4' />Back</Link>
         </Button>
        <p className="text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link
            href="/signup"
            className="font-semibold text-primary hover:underline"
            >
            Sign up
            </Link>
        </p>
      </div>
    </div>
  );
}

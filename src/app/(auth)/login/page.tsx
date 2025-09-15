'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/dashboard');
    }
  return (
    <>
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-lg text-muted-foreground">
          Sign in to continue your wellness journey.
        </p>
      </div>

      <form onSubmit={handleLogin} className="animate-pop-in space-y-6" style={{ animationDelay: '0.2s' }}>
        <div className="grid gap-2">
            <Label htmlFor="email-mobile">Email or Mobile Number</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email-mobile" type="text" placeholder="e.g., name@example.com" required className="pl-10" />
            </div>
        </div>
        <div className="grid gap-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">Forgot Password?</Link>
            </div>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" required className="pl-10" />
            </div>
        </div>

        <Button size="lg" className="w-full" type="submit">
          Sign In
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground animate-pop-in" style={{ animationDelay: '0.4s' }}>
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </>
  );
}

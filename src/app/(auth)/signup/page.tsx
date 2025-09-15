'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail, KeyRound, User, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/dashboard');
    }

  return (
    <>
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">
          Create an Account
        </h1>
        <p className="text-lg text-muted-foreground">
          Start your journey to a healthier you.
        </p>
      </div>

      <form onSubmit={handleSignup} className="animate-pop-in space-y-4" style={{ animationDelay: '0.2s' }}>
        <div className="grid gap-2">
            <Label htmlFor="fullname">Full Name</Label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translatey-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="fullname" type="text" placeholder="e.g., Akash Rathaur" required className="pl-10" />
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="e.g., name@example.com" required className="pl-10" />
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="mobile" type="tel" placeholder="e.g., 1234567890" maxLength={10} required className="pl-10" />
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" required className="pl-10" />
            </div>
        </div>

        <Button size="lg" className="w-full" type="submit">
          Create Account
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground animate-pop-in" style={{ animationDelay: '0.4s' }}>
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </>
  );
}

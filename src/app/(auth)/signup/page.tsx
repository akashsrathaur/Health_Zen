'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User, KeyRound, Mail, Smartphone, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

export default function SignupPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');


    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // If validation passes
        router.push('/dashboard');
    }

  return (
    <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <Icons.logo className="h-8 w-auto" />
        </div>
      <Card className="rounded-t-3xl border-t-4 border-primary bg-card/80 p-8 backdrop-blur-md">
        <form onSubmit={handleSignup} className="animate-pop-in space-y-4" style={{ animationDelay: '0.2s' }}>
            <div className="grid gap-2 text-left">
                <Label htmlFor="username">User Name</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="username" type="text" placeholder="Akash Rathaur" required className="pl-10" />
                </div>
            </div>
            <div className="grid gap-2 text-left">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        className="pl-10" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className="grid gap-2 text-left">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="akash.r@example.com" required className="pl-10" />
                </div>
            </div>
            <div className="grid gap-2 text-left">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="123-456-7890" required className="pl-10" />
                </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                    Allow Terms & Conditions
                </Label>
            </div>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <Button size="lg" className="w-full bg-gradient-to-r from-primary to-red-400 text-lg font-bold" type="submit">
                Sign Up
            </Button>
        </form>
      </Card>
        <div className="flex justify-between items-center text-sm">
         <Button variant="ghost" asChild>
            <Link href="/login"><ArrowLeft className='mr-2 h-4 w-4' />Back</Link>
         </Button>
        <p className="text-center text-muted-foreground">
            Already have an account?{' '}
            <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
            >
            Sign In
            </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail, KeyRound, User, Smartphone, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (password: string) => {
        const hasNumber = /\d/;
        const hasLetter = /[a-zA-Z]/;
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!hasLetter.test(password) || !hasNumber.test(password)) {
            return "Password must contain at least one letter and one number.";
        }
        return "";
    };

    const passwordValidationError = useMemo(() => validatePassword(password), [password]);
    
    const isFullNameValid = fullName.trim().length > 0;
    const isMobileValid = /^\d{10}$/.test(mobile);
    const isPasswordValid = password.length > 0 && !passwordValidationError;
    const isConfirmPasswordValid = confirmPassword.length > 0 && password === confirmPassword;


    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (passwordValidationError) {
            setError(passwordValidationError);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        
        if (!isMobileValid) {
            setError("Please enter a valid 10-digit mobile number.");
            return;
        }

        // If validation passes
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
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="fullname" 
                    type="text" 
                    placeholder="e.g., Akash Rathaur" 
                    required 
                    className="pl-10 pr-10" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                {isFullNameValid && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />}
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="email">Email Address (Optional)</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="e.g., name@example.com" className="pl-10" />
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="mobile" 
                    type="tel" 
                    placeholder="e.g., 1234567890" 
                    maxLength={10} 
                    required 
                    className="pl-10 pr-10" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                />
                {isMobileValid && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />}
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="pl-10 pr-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {isPasswordValid && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />}
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="pl-10 pr-10" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {isConfirmPasswordValid && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />}
            </div>
        </div>

        {error && <p className="text-sm text-destructive text-center">{error}</p>}

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

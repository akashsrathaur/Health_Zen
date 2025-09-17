
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User, KeyRound, Mail, Smartphone, ArrowLeft, VenetianMask, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserInFirestore } from '@/actions/user';
import { nanoid } from 'nanoid';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say' | ''>('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // Since Firebase phone auth is complex, we'll use email/password for now
            // but still collect the phone number.
            if (!email) {
                setError("Email is required for account creation at this time.");
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            await createUserInFirestore(firebaseUser.uid, {
                uid: firebaseUser.uid,
                name: fullName,
                age: parseInt(age, 10) || 0,
                gender: gender || 'Prefer not to say',
                avatarUrl: `https://picsum.photos/seed/${nanoid()}/100/100`,
                streak: 0,
            });

            // The AuthProvider will handle redirecting to the dashboard
            // router.push('/dashboard');

        } catch (error: any) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('This email address is already in use.');
                    break;
                case 'auth/weak-password':
                    setError('The password is too weak. It must be at least 6 characters long.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
                    console.error(error);
            }
        }
    }

  return (
    <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <Icons.logo className="h-8 w-auto" />
        </div>
      <Card className="rounded-t-3xl border-t-4 border-primary bg-card/80 p-8 backdrop-blur-md">
        <form onSubmit={handleSignup} className="animate-pop-in space-y-4" style={{ animationDelay: '0.2s' }}>
            <div className="grid gap-2 text-left">
                <Label htmlFor="fullname">Full Name</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="fullname" type="text" placeholder="Akash Rathaur" required className="pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2 text-left">
                    <Label htmlFor="age">Age</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="age" type="number" placeholder="20" required className="pl-10" value={age} onChange={(e) => setAge(e.target.value)} />
                    </div>
                </div>
                <div className="grid gap-2 text-left">
                    <Label htmlFor="gender">Gender</Label>
                     <Select required onValueChange={(v) => setGender(v as any)} value={gender}>
                        <SelectTrigger className="pl-10">
                             <VenetianMask className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid gap-2 text-left">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="123-456-7890" required className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
            </div>
            <div className="grid gap-2 text-left">
                <Label htmlFor="email">E-mail (Optional)</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="akash.r@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        className="pl-10" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
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

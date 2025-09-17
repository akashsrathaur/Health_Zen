
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
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserInFirestore, getUserFromFirestore } from '@/actions/user';
import { nanoid } from 'nanoid';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.657-3.657-11.303-8H6.394c3.163,10.133,12.591,16,21.914,16H24z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.998,36.56,44,30.823,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);

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
            const finalEmail = email || `${phone}@example.com`;
            if (!email && !phone) {
                 setError("Please provide either an email or a phone number.");
                 return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, finalEmail, password);
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
                    setError('This email is already associated with an account.');
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
    
    const handleGoogleSignIn = async () => {
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            // Check if user exists in Firestore
            const existingUser = await getUserFromFirestore(firebaseUser.uid);
            
            if (!existingUser) {
                await createUserInFirestore(firebaseUser.uid, {
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || 'New User',
                    age: 0,
                    gender: 'Prefer not to say',
                    avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${nanoid()}/100/100`,
                    streak: 0,
                });
            }
            // AuthProvider will redirect to dashboard
        } catch(error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
                setError('Failed to sign in with Google. Please try again.');
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
                <Label htmlFor="phone">Phone Number</Label>
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
         <div className="relative my-6">
            <Separator />
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <GoogleIcon className="mr-2 h-5 w-5" />
            Sign up with Google
        </Button>
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

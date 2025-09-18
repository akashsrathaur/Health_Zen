
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
import { createUserInFirestore } from '@/lib/user-utils';
import { nanoid } from 'nanoid';
import DoshaQuiz from '@/components/dosha-quiz';
import type { DoshaResult } from '@/lib/dosha-quiz';

type SignupStep = 'basic-info' | 'dosha-quiz' | 'completing';

export default function SignupPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<SignupStep>('basic-info');
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say' | ''>('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [doshaResult, setDoshaResult] = useState<DoshaResult | null>(null);
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [error, setError] = useState('');

    const handleBasicInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Move to dosha quiz step
        setCurrentStep('dosha-quiz');
    };

    const handleDoshaComplete = (result: DoshaResult) => {
        setDoshaResult(result);
        handleCreateAccount(result);
    };

    const handleCreateAccount = async (dosha: DoshaResult) => {
        setCurrentStep('completing');
        setIsCreatingAccount(true);
        setError('');

        // Email needs to be constructed for Firebase Auth, but can be based on phone
        const firebaseEmail = email || `${phone}@healthzen.app`;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, firebaseEmail, password);
            const firebaseUser = userCredential.user;

            await createUserInFirestore(firebaseUser.uid, {
                name: fullName,
                age: parseInt(age, 10) || 0,
                gender: gender || 'Prefer not to say',
                avatarUrl: `https://picsum.photos/seed/${nanoid()}/100/100`,
                streak: 0,
                points: 0,
                dailyPoints: 0,
                lastActivityDate: new Date().toISOString().split('T')[0],
                totalTasksCompleted: 0,
                phone: phone,
                bio: 'New to the wellness journey!',
                emailNotifications: true,
                pushNotifications: false,
                dosha: dosha.primary,
                doshaIsBalanced: dosha.isBalanced,
            });

            // Explicitly redirect to the dashboard after successful signup.
            router.push('/dashboard');

        } catch (error: any) {
            setIsCreatingAccount(false);
            setCurrentStep('basic-info'); // Go back to basic info on error
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('This phone number or email is already associated with an account.');
                    break;
                case 'auth/weak-password':
                    setError('The password is too weak. It must be at least 6 characters long.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid phone number.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
                    console.error(error);
            }
        }
    };

    const handleBackToBasicInfo = () => {
        setCurrentStep('basic-info');
    };

  // Render dosha quiz step
  if (currentStep === 'dosha-quiz') {
    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-6">
          <Icons.logo className="h-8 w-auto" />
          <h1 className="text-2xl font-bold">Complete Your Wellness Profile</h1>
        </div>
        <DoshaQuiz onComplete={handleDoshaComplete} onBack={handleBackToBasicInfo} />
      </div>
    );
  }

  // Render completing step
  if (currentStep === 'completing') {
    return (
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Icons.logo className="h-8 w-auto" />
          <h2 className="text-xl font-semibold">Creating Your Account...</h2>
          {doshaResult && (
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Your Dosha: <span className="font-semibold text-primary">{doshaResult.primary}</span></p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render basic info step (default)
  return (
    <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-4 text-center">
            <Icons.logo className="h-8 w-auto" />
            <h1 className="text-xl font-bold">Create Your HealthZen Account</h1>
            <p className="text-sm text-muted-foreground">Step 1 of 2: Basic Information</p>
        </div>
      <Card className="rounded-t-3xl border-t-4 border-primary bg-card/80 p-8 backdrop-blur-md">
        <form onSubmit={handleBasicInfoSubmit} className="animate-pop-in space-y-4" style={{ animationDelay: '0.2s' }}>
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
                Next: Discover Your Dosha 🕉️
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

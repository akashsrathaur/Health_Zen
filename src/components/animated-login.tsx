
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Icons } from './icons';
import { createUserInFirestore, getUserFromFirestore } from '@/actions/user';
import { Separator } from './ui/separator';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { nanoid } from 'nanoid';

type RobotState = 'idle' | 'peeking' | 'wrong' | 'correct';

const Robot = ({ state }: { state: RobotState }) => {
    let eyeColor = "#546E7A";
    if (state === 'wrong') eyeColor = '#F44336';
    if (state === 'correct') eyeColor = '#4CAF50';

    return (
        <motion.div 
            className="w-48 h-48 relative mx-auto mb-4"
            animate={state === 'correct' ? { y: [0, -10, 0, -5, 0], scale: [1, 1.05, 1, 1.02, 1] } : {}}
            transition={state === 'correct' ? { duration: 0.8, ease: "easeInOut" } : {}}
        >
            <motion.svg 
                viewBox="0 0 120 120" 
                className="w-full h-full"
                animate={state === 'wrong' ? { x: [-2, 2, -2, 2, 0] } : {}}
                transition={state === 'wrong' ? { duration: 0.3, type: 'spring', stiffness: 500, damping: 15 } : {}}
            >
                <defs>
                    <radialGradient id="robot-body-gradient" cx="50%" cy="40%" r="70%" fx="50%" fy="40%">
                        <stop offset="0%" style={{stopColor: '#B6D0E2'}} />
                        <stop offset="100%" style={{stopColor: '#7B9BBD'}} />
                    </radialGradient>
                     <radialGradient id="robot-eye-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="white" />
                        <stop offset="100%" stopColor={eyeColor} />
                    </radialGradient>
                </defs>

                <motion.g animate={{ y: [0, -1, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
                    {/* Shadow */}
                    <ellipse cx="60" cy="115" rx="35" ry="4" fill="rgba(0,0,0,0.1)" />

                    {/* Body */}
                    <rect x="25" y="40" width="70" height="70" rx="15" fill="url(#robot-body-gradient)" stroke="#465A65" strokeWidth="1"/>
                    
                    {/* Head */}
                    <rect x="35" y="15" width="50" height="40" rx="10" fill="url(#robot-body-gradient)" stroke="#465A65" strokeWidth="1"/>
                    
                    {/* Antenna */}
                    <line x1="60" y1="15" x2="60" y2="5" stroke="#465A65" strokeWidth="2" />
                     <motion.circle 
                        cx="60" cy="5" r="3" 
                        fill={state === 'correct' ? '#FFD700' : '#B0BEC5'}
                        animate={state === 'correct' ? { scale: [1, 1.5, 1], filter: ['brightness(1)', 'brightness(2)', 'brightness(1)'] } : {}}
                        transition={state === 'correct' ? { duration: 0.5, repeat: 2 } : {}}
                     />
                </motion.g>
                
                {/* Eye */}
                <circle cx="60" cy="35" r="10" fill="url(#robot-eye-gradient)" stroke="#37474F" strokeWidth="1"/>
                <motion.circle 
                    cx="60" cy="35" r="3"
                    fill={eyeColor}
                    animate={state === 'correct' ? { scale: 1.5 } : {}}
                />

                {/* Visor */}
                <AnimatePresence>
                    {state === 'peeking' && (
                        <motion.rect
                            key="visor"
                            x="35"
                            width="50"
                            height="25"
                            rx="5"
                            fill="#3E5363"
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 22, opacity: 1 }}
                            exit={{ y: -30, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                    )}
                </AnimatePresence>
            </motion.svg>
        </motion.div>
    );
};

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.657-3.657-11.303-8H6.394c3.163,10.133,12.591,16,21.914,16H24z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.998,36.56,44,30.823,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);


export function AnimatedLogin() {
  const router = useRouter();
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (robotState === 'wrong' || robotState === 'correct') {
      const timer = setTimeout(() => {
        setRobotState(password.length > 0 ? 'peeking' : 'idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [robotState, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        await signInWithEmailAndPassword(auth, email, password);
        setRobotState('correct');
        // The AuthProvider will handle the redirect
    } catch (error: any) {
        setRobotState('wrong');
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                setError("Invalid email or password.");
                break;
            default:
                setError("An unexpected error occurred. Please try again.");
                break;
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
        setRobotState('correct');
        // AuthProvider will redirect to dashboard
    } catch(error: any) {
        setRobotState('wrong');
        if (error.code !== 'auth/popup-closed-by-user') {
            setError('Failed to sign in with Google. Please try again.');
        }
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
    if (e.target.value.length > 0) {
      if (robotState !== 'peeking') {
        setRobotState('peeking');
      }
    } else {
      setRobotState('idle');
    }
  };

  const handleEmailFocus = () => {
    if (password.length === 0) {
      setRobotState('idle');
    }
  }


  return (
    <div className="w-full max-w-sm mx-auto">
        <Robot state={robotState} />
        <Card className="rounded-2xl shadow-lg bg-card/90 backdrop-blur-sm">
            <CardContent className="p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="you@example.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={handleEmailFocus}
                            onBlur={() => setRobotState(password.length > 0 ? 'peeking' : 'idle')}
                        />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            required
                            value={password}
                            onChange={handlePasswordChange}
                         />
                    </div>
                    {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember-me" />
                            <Label htmlFor="remember-me" className="text-sm font-normal text-muted-foreground">Remember me</Label>
                        </div>
                        <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
                    </div>
                    <Button type="submit" className="w-full !mt-6" size="lg" disabled={robotState === 'correct'}>
                      {robotState === 'correct' ? 'Success!' : 'Sign In'}
                    </Button>
                </form>
                <div className="relative my-6">
                    <Separator />
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                        </span>
                    </div>
                </div>
                 <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Sign in with Google
                </Button>
            </CardContent>
        </Card>
         <div className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" asChild className="p-0">
                <Link href="/signup">
                    Sign Up <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
            </Button>
        </div>
    </div>
  );
}

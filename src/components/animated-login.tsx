
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { useRouter } from 'next/navigation';

type BearState = 'idle' | 'peeking' | 'wrong' | 'correct';

const Bear = ({ state }: { state: BearState }) => {
    return (
        <motion.div 
            className="w-48 h-48 relative mx-auto mb-4"
            animate={state === 'correct' ? { y: [0, -10, 0, -5, 0], scale: [1, 1.05, 1, 1.02, 1] } : {}}
            transition={state === 'correct' ? { duration: 0.8, ease: "easeInOut" } : {}}
        >
            <motion.svg 
                viewBox="0 0 120 120" 
                className="w-full h-full"
                animate={state === 'wrong' ? { x: [-1, 1, -1, 1, 0] } : {}}
                transition={state === 'wrong' ? { duration: 0.3, type: 'spring', stiffness: 500, damping: 15 } : {}}
            >
                <defs>
                    <radialGradient id="bear-body-gradient" cx="50%" cy="40%" r="70%" fx="50%" fy="40%">
                        <stop offset="0%" style={{stopColor: '#FFFFFF'}} />
                        <stop offset="100%" style={{stopColor: '#ECEFF1'}} />
                    </radialGradient>
                    <linearGradient id="scarf-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#F44336'}} />
                        <stop offset="100%" style={{stopColor: '#D32F2F'}} />
                    </linearGradient>
                </defs>

                <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
                    {/* Shadow */}
                    <ellipse cx="60" cy="110" rx="30" ry="5" fill="rgba(0,0,0,0.1)" />

                    {/* Scarf */}
                    <path d="M15 80 Q30 70 60 80 T105 80 L100 95 Q60 105 20 95 Z" fill="url(#scarf-gradient)" />
                    <path d="M15 80 L20 95 L25 80 L30 95 L35 80" fill="none" stroke="#C62828" strokeWidth="1" />
                    
                    {/* Body */}
                    <path d="M20 90 Q10 50 60 20 T100 90 Z" fill="url(#bear-body-gradient)" />

                    {/* Ears */}
                    <circle cx="30" cy="35" r="10" fill="url(#bear-body-gradient)" />
                    <circle cx="90" cy="35" r="10" fill="url(#bear-body-gradient)" />
                    <circle cx="32" cy="37" r="5" fill="#FFCDD2" />
                    <circle cx="88" cy="37" r="5" fill="#FFCDD2" />
                </motion.g>
                
                {/* Face */}
                <AnimatePresence mode="wait">
                {(state === 'idle' || state === 'peeking' || state === 'correct') && (
                    <motion.g 
                        key="default-face"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Eyebrows */}
                        <path d="M40 45 C45 40 55 40 60 45" fill="none" stroke="#546E7A" strokeWidth="3" strokeLinecap="round" />
                        <path d="M80 45 C75 40 65 40 60 45" fill="none" stroke="#546E7A" strokeWidth="3" strokeLinecap="round" />
                        {/* Eyes */}
                        <motion.circle 
                            cx="50" cy="55" r="3" fill="#546E7A" 
                            animate={state === 'correct' ? { scale: 1.5, fill: '#FFD700' } : {}}
                        />
                        <motion.circle 
                            cx="70" cy="55" r="3" fill="#546E7A" 
                            animate={state === 'correct' ? { scale: 1.5, fill: '#FFD700' } : {}}
                        />
                        {/* Mouth */}
                        <motion.path 
                            d="M55 70 Q60 75 65 70" 
                            fill="none" 
                            stroke="#546E7A" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            animate={state === 'correct' ? { d: 'M50 68 Q60 80 70 68' } : {}}
                        />
                    </motion.g>
                )}
                 {state === 'wrong' && (
                    <motion.g 
                        key="wrong-face"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Worried Eyebrows */}
                        <path d="M40 42 Q50 35 60 42" stroke="#455A64" strokeWidth="4" fill="none" strokeLinecap='round' />
                        <path d="M80 42 Q70 35 60 42" stroke="#455A64" strokeWidth="4" fill="none" strokeLinecap='round' />
                        {/* Worried Eyes */}
                        <circle cx="50" cy="55" r="4" fill="white" stroke="#455A64" strokeWidth="1"/>
                        <circle cx="70" cy="55" r="4" fill="white" stroke="#455A64" strokeWidth="1"/>
                        <circle cx="52" cy="55" r="1.5" fill="#455A64" />
                        <circle cx="68" cy="55" r="1.5" fill="#455A64" />
                        {/* Worried Mouth */}
                        <path d="M55 75 Q60 70 65 75" fill="none" stroke="#546E7A" strokeWidth="2" strokeLinecap="round" />
                    </motion.g>
                 )}
                </AnimatePresence>

                 {/* Hands */}
                <AnimatePresence>
                    {state === 'peeking' && (
                        <motion.g
                            key="hands"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 30, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <path d="M30 100 C 10 80, 25 40, 48 50 L 52 50 C 60 40, 90 40, 70 50 L68 50 C 95 40, 110 80, 90 100 Z" fill="#B0BEC5" />
                        </motion.g>
                    )}
                </AnimatePresence>
            </motion.svg>
        </motion.div>
    );
};


export function AnimatedLogin() {
  const router = useRouter();
  const [bearState, setBearState] = useState<BearState>('idle');
  const [email, setEmail] = useState('amani@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (bearState === 'wrong' || bearState === 'correct') {
      const timer = setTimeout(() => {
        setBearState(password.length > 0 ? 'peeking' : 'idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [bearState, password]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Simulate API call
    if (password !== 'password') {
        setBearState('wrong');
        setError('Wrong password. Please try again.');
    } else {
        setBearState('correct');
        setError('');
        // Handle successful login
        setTimeout(() => {
             router.push('/dashboard');
        }, 1200);
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
    if (e.target.value.length > 0) {
      if (bearState !== 'peeking') {
        setBearState('peeking');
      }
    } else {
      setBearState('idle');
    }
  };

  const handleEmailFocus = () => {
    if (password.length === 0) {
      setBearState('idle');
    }
  }


  return (
    <div className="w-full max-w-sm mx-auto">
        <Bear state={bearState} />
        <Card className="rounded-2xl shadow-lg bg-card/90 backdrop-blur-sm">
            <CardContent className="p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="amani@gmail.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={handleEmailFocus}
                            onBlur={() => setBearState(password.length > 0 ? 'peeking' : 'idle')}
                        />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            placeholder="•••••• (Hint: password)" 
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
                    <Button type="submit" className="w-full !mt-6" size="lg" disabled={bearState === 'correct'}>
                      {bearState === 'correct' ? 'Success!' : 'Sign In'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}

    

'use client';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';

type BearState = 'idle' | 'peeking' | 'wrong' | 'correct';

const Bear = ({ state }: { state: BearState }) => {
    return (
        <div className="w-48 h-48 relative mx-auto mb-4">
            <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* Scarf */}
                <path d="M15 80 Q30 70 60 80 T105 80 L100 95 Q60 105 20 95 Z" fill="#E53935" />
                <path d="M15 80 L20 95 L25 80 L30 95 L35 80" fill="none" stroke="#C62828" strokeWidth="1" />
                
                {/* Body */}
                <path d="M20 90 Q10 50 60 20 T100 90 Z" fill="#ECEFF1" />

                {/* Ears */}
                <circle cx="30" cy="35" r="10" fill="#ECEFF1" />
                <circle cx="90" cy="35" r="10" fill="#ECEFF1" />
                <circle cx="32" cy="37" r="5" fill="#FFCDD2" />
                <circle cx="88" cy="37" r="5" fill="#FFCDD2" />
                
                {/* Face */}
                <AnimatePresence mode="wait">
                {state !== 'wrong' && (
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
                        <circle cx="50" cy="55" r="3" fill="#546E7A" />
                        <circle cx="70" cy="55" r="3" fill="#546E7A" />
                        {/* Mouth */}
                        <path d="M55 70 Q60 75 65 70" fill="none" stroke="#546E7A" strokeWidth="2" strokeLinecap="round" />
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
                        <ellipse cx="60" cy="75" rx="15" ry="8" fill="#455A64" />
                         <ellipse cx="60" cy="73" rx="12" ry="5" fill="#FFCDD2" />
                    </motion.g>
                 )}
                </AnimatePresence>

                 {/* Hands */}
                <AnimatePresence>
                    {state === 'peeking' && (
                        <motion.g
                            key="hands"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        >
                            <path d="M30 100 C 0 80, 20 40, 45 50 L 55 50 C 70 40, 90 40, 70 50 Z" fill="#B0BEC5" />
                             <path d="M90 100 C 120 80, 100 40, 75 50 L 65 50 C 50 40, 30 40, 50 50 Z" fill="#B0BEC5" />
                        </motion.g>
                    )}
                </AnimatePresence>
            </svg>
        </div>
    );
};


export function AnimatedLogin() {
  const [bearState, setBearState] = useState<BearState>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (password.length > 0) {
      setBearState('peeking');
    } else {
      setBearState('idle');
    }
  }, [password]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    if (password !== 'password') {
        setBearState('wrong');
        setTimeout(() => setBearState(password.length > 0 ? 'peeking' : 'idle'), 2000);
    } else {
        setBearState('correct');
        // Handle successful login
        alert('Login Successful!');
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
                            onFocus={() => setBearState('idle')}
                        />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            placeholder="••••••" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                         />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember-me" />
                            <Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Sign In</Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}


'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { useRouter } from 'next/navigation';

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
                        <stop offset="0%" style={{stopColor: '#CFD8DC'}} />
                        <stop offset="100%" style={{stopColor: '#90A4AE'}} />
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
                    <rect x="25" y="40" width="70" height="70" rx="15" fill="url(#robot-body-gradient)" stroke="#546E7A" strokeWidth="1"/>
                    
                    {/* Head */}
                    <rect x="35" y="15" width="50" height="40" rx="10" fill="url(#robot-body-gradient)" stroke="#546E7A" strokeWidth="1"/>
                    
                    {/* Antenna */}
                    <line x1="60" y1="15" x2="60" y2="5" stroke="#546E7A" strokeWidth="2" />
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
                            fill="#455A64"
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


export function AnimatedLogin() {
  const router = useRouter();
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [email, setEmail] = useState('amani@gmail.com');
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Simulate API call
    if (password !== 'password') {
        setRobotState('wrong');
        setError('Wrong password. Please try again.');
    } else {
        setRobotState('correct');
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
                            placeholder="amani@gmail.com" 
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
                    <Button type="submit" className="w-full !mt-6" size="lg" disabled={robotState === 'correct'}>
                      {robotState === 'correct' ? 'Success!' : 'Sign In'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}


'use client';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dailyVibes as initialDailyVibes, userData, challenges, type Challenge, type DailyVibe } from '@/lib/data';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Edit, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const progress = (challenge.currentDay / challenge.goalDays) * 100;

  return (
    <motion.div variants={itemVariants} className="h-full">
        <Card className="flex flex-col h-full transition-all duration-200 hover:bg-secondary/10">
          <Link href={`/challenges`} className='flex flex-col flex-grow'>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                <challenge.icon className="h-8 w-8 text-primary" />
                <div className="flex-1 space-y-1">
                    <CardTitle className="text-base font-semibold">{challenge.title}</CardTitle>
                    <CardDescription className='text-xs line-clamp-2'>{challenge.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Day {challenge.currentDay} of {challenge.goalDays}</span>
                    {challenge.isCompletedToday && (
                    <div className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle className="h-3 w-3" />
                        <span>Done!</span>
                    </div>
                    )}
                </div>
                <Progress value={progress} />
            </CardContent>
          </Link>
        </Card>
    </motion.div>
  );
}

function EditVibesDialog({ isOpen, onClose, dailyVibes, onSave }: { isOpen: boolean, onClose: () => void, dailyVibes: DailyVibe[], onSave: (vibes: DailyVibe[]) => void}) {
    const [vibes, setVibes] = useState(dailyVibes);

    const handleWaterChange = (amount: number) => {
        setVibes(prevVibes => prevVibes.map(vibe => {
            if (vibe.id === 'water') {
                const current = vibe.value.split('/')[0];
                const goal = vibe.value.split('/')[1];
                const newValue = Math.max(0, parseInt(current) + amount);
                return { ...vibe, value: `${newValue}/${goal}`, progress: (newValue / parseInt(goal.match(/\d+/)?.[0] || '1')) * 100 };
            }
            return vibe;
        }));
    }

    const handleSleepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hours = parseFloat(e.target.value) || 0;
        setVibes(prevVibes => prevVibes.map(vibe => {
             if (vibe.id === 'sleep') {
                const goal = 8; // Assuming 8 hours goal
                return { ...vibe, value: `${hours}h`, progress: (hours / goal) * 100 }
            }
            return vibe;
        }))
    }

    const waterVibe = vibes.find(v => v.id === 'water');
    const sleepVibe = vibes.find(v => v.id === 'sleep');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Daily Vibe</DialogTitle>
                    <DialogDescription>Update your daily stats. Consistency is key!</DialogDescription>
                </DialogHeader>
                <div className='space-y-6 py-4'>
                    {waterVibe && (
                        <div className="space-y-2">
                            <Label>Water Intake</Label>
                            <div className="flex items-center gap-4">
                                <Button size="icon" variant="outline" onClick={() => handleWaterChange(-1)}><Minus /></Button>
                                <span className="text-lg font-bold w-20 text-center">{waterVibe.value}</span>
                                <Button size="icon" variant="outline" onClick={() => handleWaterChange(1)}><Plus /></Button>
                            </div>
                        </div>
                    )}
                     {sleepVibe && (
                        <div className="space-y-2">
                            <Label htmlFor="sleep-hours">Sleep Duration (hours)</Label>
                            <Input 
                                id="sleep-hours" 
                                type="number" 
                                step="0.5" 
                                value={parseFloat(sleepVibe.value)} 
                                onChange={handleSleepChange} 
                                className="w-40"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={() => onSave(vibes)}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

export default function DashboardPage() {
  const acceptedChallenges = challenges.slice(0, 3); // Show first 3 for brevity
  const [dailyVibes, setDailyVibes] = useState<DailyVibe[]>(initialDailyVibes);
  const [isEditVibesOpen, setIsEditVibesOpen] = useState(false);

  const handleSaveVibes = (updatedVibes: DailyVibe[]) => {
    setDailyVibes(updatedVibes);
    setIsEditVibesOpen(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground text-glow-purple">
          Welcome back, <span>{userData.name.split(' ')[0]}!</span>
        </h1>
        <p className="text-muted-foreground">
          <Balancer>Here's your wellness summary for today. Keep up the great work!</Balancer>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
         <div className='lg:col-span-1'>
            <section>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className="text-xl font-semibold">Daily Vibe</h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditVibesOpen(true)}>
                        <Edit className='mr-2 h-4 w-4' /> Edit
                    </Button>
                </div>
                <motion.div 
                  className="grid grid-cols-1 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                    {dailyVibes.map((vibe) => (
                      <motion.div key={vibe.title} variants={itemVariants}>
                        <Card className="flex items-center p-4 transition-all duration-200 hover:bg-secondary/10">
                            <vibe.icon className="mr-4 h-8 w-8 text-primary" />
                            <div className="flex-1">
                            <p className="font-medium">{vibe.title}</p>
                            <p className="text-sm text-muted-foreground">{vibe.value}</p>
                            </div>
                            {vibe.progress !== undefined && <Progress value={vibe.progress} className="w-20" />}
                        </Card>
                      </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
        <div className="lg:col-span-2">
            <section>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className="text-xl font-semibold">Your Challenges</h2>
                    <Button variant="ghost" asChild>
                        <Link href="/challenges">View All <ArrowRight className='ml-2 h-4 w-4'/></Link>
                    </Button>
                </div>
                <motion.div 
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                    {acceptedChallenges.map((challenge) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </motion.div>
            </section>
        </div>
      </div>
      <EditVibesDialog 
        isOpen={isEditVibesOpen}
        onClose={() => setIsEditVibesOpen(false)}
        dailyVibes={dailyVibes}
        onSave={handleSaveVibes}
      />
    </div>
  );
}

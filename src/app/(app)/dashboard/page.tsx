
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
import { initialDailyVibes, userData, challenges as initialChallenges, type Challenge, type DailyVibe } from '@/lib/data';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Edit, Minus, Plus, Camera, RefreshCcw, XCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

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

function ChallengeCard({ challenge, onMarkAsDone }: { challenge: Challenge, onMarkAsDone: (challengeId: string) => void }) {
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
           <CardFooter className="p-2 pt-0">
                <Button 
                    className="w-full"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent link navigation
                        onMarkAsDone(challenge.id);
                    }}
                    disabled={challenge.isCompletedToday}
                >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {challenge.isCompletedToday ? 'Completed' : 'Done for today'}
                </Button>
            </CardFooter>
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
                                value={sleepVibe.value ? parseFloat(sleepVibe.value) : 0} 
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

function CameraDialog({ isOpen, onClose, onImageCaptured }: { isOpen: boolean, onClose: () => void, onImageCaptured: (imageDataUrl: string) => void}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const getCameraPermission = async () => {
            if (!isOpen) return;

            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                setHasCameraPermission(true);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                    variant: 'destructive',
                    title: 'Camera Access Denied',
                    description: 'Please enable camera permissions in your browser settings.',
                });
            }
        };

        getCameraPermission();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
             if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setCapturedImage(null);
        }
    }, [isOpen, toast]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                setCapturedImage(canvas.toDataURL('image/jpeg'));
            }
        }
    }

    const handleRetake = () => {
        setCapturedImage(null);
    }
    
    const handleUsePhoto = () => {
        if (capturedImage) {
            onImageCaptured(capturedImage);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Upload Proof</DialogTitle>
                </DialogHeader>
                <div className="relative aspect-video w-full bg-black rounded-md overflow-hidden flex items-center justify-center">
                    {hasCameraPermission === null && <p className='text-white'>Requesting camera...</p>}
                    {hasCameraPermission === false && (
                        <Alert variant="destructive" className="m-4">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser to use this feature.
                            </AlertDescription>
                        </Alert>
                    )}

                    {capturedImage ? (
                        <Image src={capturedImage} alt="Captured photo" layout="fill" objectFit="contain" />
                    ) : (
                        <video ref={videoRef} className={cn("w-full h-full object-cover", hasCameraPermission === false && 'hidden')} autoPlay playsInline muted />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                <DialogFooter>
                    {capturedImage ? (
                        <div className="w-full flex justify-between">
                            <Button variant="outline" onClick={handleRetake}>
                                <RefreshCcw className="mr-2 h-4 w-4" /> Retake
                            </Button>
                            <Button onClick={handleUsePhoto}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Continue Streak
                            </Button>
                        </div>
                    ) : (
                        <Button className="w-full" onClick={handleCapture} disabled={!hasCameraPermission}>
                            <Camera className="mr-2 h-4 w-4" /> Capture Photo
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function DashboardPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [dailyVibes, setDailyVibes] = useState<DailyVibe[]>(initialDailyVibes);
  const [isEditVibesOpen, setIsEditVibesOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveVibes = (updatedVibes: DailyVibe[]) => {
    setDailyVibes(updatedVibes);
    setIsEditVibesOpen(false);
  }

  const handleMarkAsDone = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.isCompletedToday) {
      setActiveChallengeId(challengeId);
      setIsCameraOpen(true);
    }
  };

  const handleImageCaptured = (imageDataUrl: string) => {
    if (activeChallengeId) {
      const challenge = challenges.find(c => c.id === activeChallengeId);
      if (challenge) {
        setChallenges(prevChallenges => 
          prevChallenges.map(c => 
            c.id === activeChallengeId 
              ? { ...c, isCompletedToday: true, currentDay: c.currentDay + 1 } 
              : c
          )
        );
        toast({
          title: "Streak Continued!",
          description: `You've completed '${challenge.title}' for today. Keep it up!`
        });
      }
    }
    setIsCameraOpen(false);
    setActiveChallengeId(null);
  };

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
                    {challenges.slice(0, 2).map((challenge) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} onMarkAsDone={handleMarkAsDone} />
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
      <CameraDialog
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onImageCaptured={handleImageCaptured}
      />
    </div>
  );
}

    
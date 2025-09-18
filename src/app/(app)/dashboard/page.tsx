
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
import { initialDailyVibes, type Challenge, type DailyVibe, allVibeIcons, getAchievements, type Achievement } from '@/lib/data';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Edit, Minus, Plus, Camera, RefreshCcw, XCircle, Pill, PlusCircle, Trash2, Clock, Info } from 'lucide-react';
import { Icon } from '@/lib/icon-resolver';
import { useState, useRef, useEffect, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { Switch } from '@/components/ui/switch';
import { nanoid } from 'nanoid';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { format } from 'date-fns';
import { useAuth } from '@/context/auth-context';
import { defaultUser } from '@/lib/user-store';
import { useNotifications } from '@/hooks/use-notifications';
import { updateDailyVibes as updateDailyVibesAction, updateChallenge as updateChallengeAction } from '@/lib/user-utils';
import { updateWaterIntake } from '@/actions/daily-activities';

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
                <Icon name={challenge.icon} className="h-8 w-8 text-primary" />
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

function EditVibeDialog({ isOpen, onClose, vibe, onSave, onDelete }: { isOpen: boolean, onClose: () => void, vibe: DailyVibe | null, onSave: (vibe: DailyVibe) => void, onDelete: (vibeId: string) => void}) {
    const [currentVibe, setCurrentVibe] = useState<DailyVibe | null>(vibe);

    useEffect(() => {
        setCurrentVibe(vibe);
    }, [vibe, isOpen])

    if (!currentVibe) return null;

    const handleWaterChange = async (amount: number) => {
        if (!user) return;
        setCurrentVibe(prev => {
            if (!prev || prev.id !== 'water') return prev;
            const current = parseInt(prev.value.split('/')[0]);
            const goal = parseInt(prev.value.split('/')[1]?.match(/\d+/)?.[0] || '8');
            const newValue = Math.max(0, current + amount);
            const newProgress = Math.min((newValue / goal) * 100, 100);
            
            // Update the backend immediately
            updateWaterIntake(user.uid, newValue);
            
            return { 
                ...prev, 
                value: `${newValue}/${goal} glasses`, 
                progress: newProgress
            };
        });
    }

    const handleSleepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hours = parseFloat(e.target.value) || 0;
        setCurrentVibe(prev => {
             if (!prev || prev.id !== 'sleep') return prev;
             const goal = 8;
             return { ...prev, value: `${hours.toFixed(1)}h`, progress: (hours / goal) * 100 }
        })
    }
    
    const handleMedicationToggle = (checked: boolean) => {
      setCurrentVibe(prev => {
        if (!prev || prev.id !== 'medication') return prev;
        const now = new Date().toISOString();
        const progress = checked ? 100 : 0;
        const value = checked ? 'Taken' : 'Pending'
        return { ...prev, value, progress, completedAt: checked ? now : undefined };
      });
    }

    const handleCustomVibeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentVibe(prev => prev ? { ...prev, [name]: value } as DailyVibe : null);
    }
    
    const handleSaveChanges = () => {
        if (currentVibe) onSave(currentVibe);
    }

    const handleDelete = () => {
        if (currentVibe) onDelete(currentVibe.id);
    }

    const isStreakVibe = currentVibe.id === 'streak';
    const isCompleted = currentVibe.id === 'medication' ? currentVibe.progress === 100 : !!currentVibe.completedAt;
    const isEditable = !isCompleted && !isStreakVibe;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Daily Vibe</DialogTitle>
                    <DialogDescription>Update or remove this daily task.</DialogDescription>
                </DialogHeader>
                <div className='space-y-6 py-4'>
                    {isCompleted && currentVibe.id !== 'medication' && (
                         <Alert variant="default" className='border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300'>
                            <Info className="h-4 w-4 !text-green-600 dark:!text-green-400" />
                            <AlertTitle>Task Completed</AlertTitle>
                            <AlertDescription>
                                Completed on {format(new Date(currentVibe.completedAt!), "MMMM d, yyyy 'at' hh:mm a")}. This can't be edited.
                            </AlertDescription>
                        </Alert>
                    )}
                    {currentVibe.id === 'water' && isEditable && (
                        <div className="space-y-2">
                            <Label>Water Intake</Label>
                            <div className="flex items-center gap-4">
                                <Button size="icon" variant="outline" onClick={() => handleWaterChange(-1)}><Minus /></Button>
                                <span className="text-lg font-bold w-20 text-center">{currentVibe.value}</span>
                                <Button size="icon" variant="outline" onClick={() => handleWaterChange(1)}><Plus /></Button>
                            </div>
                        </div>
                    )}
                    {currentVibe.id === 'sleep' && isEditable && (
                        <div className="space-y-2">
                            <Label htmlFor="sleep-hours">Sleep Duration (hours)</Label>
                            <Input 
                                id="sleep-hours" 
                                type="number" 
                                step="0.5" 
                                value={currentVibe.value ? parseFloat(currentVibe.value) : 0} 
                                onChange={handleSleepChange} 
                                className="w-40"
                            />
                        </div>
                    )}
                    {currentVibe.id === 'medication' && !isCompleted && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Daily Doses Required</Label>
                                <Select 
                                    value={currentVibe.medicationConfig?.dailyDoses?.toString() || '1'} 
                                    onValueChange={(value) => {
                                        setCurrentVibe(prev => {
                                            if (!prev) return prev;
                                            return {
                                                ...prev,
                                                medicationConfig: {
                                                    ...prev.medicationConfig!,
                                                    dailyDoses: parseInt(value),
                                                    dosesTaken: 0
                                                }
                                            };
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 dose per day</SelectItem>
                                        <SelectItem value="2">2 doses per day</SelectItem>
                                        <SelectItem value="3">3 doses per day</SelectItem>
                                        <SelectItem value="4">4 doses per day</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Hours Between Doses</Label>
                                <Select 
                                    value={currentVibe.medicationConfig?.intervalHours?.toString() || '4'} 
                                    onValueChange={(value) => {
                                        setCurrentVibe(prev => {
                                            if (!prev) return prev;
                                            return {
                                                ...prev,
                                                medicationConfig: {
                                                    ...prev.medicationConfig!,
                                                    intervalHours: parseInt(value)
                                                }
                                            };
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="4">4 hours</SelectItem>
                                        <SelectItem value="6">6 hours</SelectItem>
                                        <SelectItem value="8">8 hours</SelectItem>
                                        <SelectItem value="12">12 hours</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    {currentVibe.id === 'medication' && isCompleted && (
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className='space-y-0.5'>
                          <Label htmlFor='medication-taken'>Medication</Label>
                           <p className="text-sm text-muted-foreground">
                                Mark if you've taken your daily medication.
                            </p>
                        </div>
                        <Switch
                          id='medication-taken'
                          checked={isCompleted}
                          onCheckedChange={handleMedicationToggle}
                        />
                      </div>
                    )}
                    {currentVibe.isCustom && isEditable && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="custom-title">Title</Label>
                                <Input id="custom-title" name="title" value={currentVibe.title} onChange={handleCustomVibeChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="custom-value">Value / Target</Label>
                                <Input id="custom-value" name="value" value={currentVibe.value} onChange={handleCustomVibeChange} />
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter className='justify-between'>
                    { !isStreakVibe ? (
                        <Button variant="destructive" onClick={handleDelete} className="mr-auto" disabled={isCompleted && currentVibe.id !== 'medication'}><Trash2 /> Delete</Button>
                    ) : <div /> }
                    <div className='flex gap-2'>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSaveChanges} disabled={isCompleted && currentVibe.id !== 'medication'}>Save Changes</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function AddVibeDialog({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (vibe: DailyVibe) => void }) {
    const [title, setTitle] = useState('');
    const [iconName, setIconName] = useState<keyof typeof allVibeIcons>('Activity');
    
    const handleAdd = () => {
        if (!title) return;
        const newVibe: DailyVibe = {
            id: nanoid(),
            title,
            value: 'Not set',
            icon: iconName,
            isCustom: true,
            progress: 0,
        };
        onAdd(newVibe);
        setTitle('');
        onClose();
    }
    
    const SelectedIcon = allVibeIcons[iconName];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Daily Vibe</DialogTitle>
                    <DialogDescription>Create a new custom task to track daily.</DialogDescription>
                </DialogHeader>
                 <div className='space-y-4 py-4'>
                    <div className="space-y-2">
                        <Label htmlFor="new-vibe-title">Title</Label>
                        <Input id="new-vibe-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Morning Walk"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-vibe-icon">Icon</Label>
                        <Select value={iconName} onValueChange={(value) => setIconName(value as keyof typeof allVibeIcons)}>
                            <SelectTrigger id="new-vibe-icon">
                                <SelectValue asChild>
                                    <div className="flex items-center gap-2">
                                        <SelectedIcon className="h-4 w-4" />
                                        <span>{iconName}</span>
                                    </div>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(allVibeIcons).map(iconKey => {
                                    const IconComponent = allVibeIcons[iconKey as keyof typeof allVibeIcons];
                                    return (
                                        <SelectItem key={iconKey} value={iconKey}>
                                            <div className='flex items-center gap-2'>
                                                <IconComponent className="h-4 w-4" />
                                                <span>{iconKey}</span>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                 </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAdd} disabled={!title}>Add Vibe</Button>
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Proof</DialogTitle>
                </DialogHeader>
                 <div className="relative aspect-[9/16] w-full bg-black rounded-md overflow-hidden flex items-center justify-center">
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

const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function DashboardPage() {
  const { user, challenges, setChallenges, dailyVibes, setDailyVibes, loading, userProgress, setUserProgress } = useAuth();
  const userData = user || defaultUser;

  const [isAddVibeOpen, setIsAddVibeOpen] = useState(false);
  const [isEditVibeOpen, setIsEditVibeOpen] = useState(false);
  const [vibeToEdit, setVibeToEdit] = useState<DailyVibe | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [activeVibeId, setActiveVibeId] = useState<string | null>(null);
  const [isSleepLoggingActive, setIsSleepLoggingActive] = useState(false);
  const [timeToUnlockSleep, setTimeToUnlockSleep] = useState(0);
  const [timeToUnlockWater, setTimeToUnlockWater] = useState(0);
  
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Achievement Check Logic
  const checkAchievements = (newProgress: { streak: number, completedTasks: number }) => {
    if (!userProgress) return;
    const oldAchievements = getAchievements(userProgress);
    const newAchievements = getAchievements(newProgress);

    const newlyUnlocked = newAchievements.filter(
        (newAch: Achievement) => newAch.unlocked && !oldAchievements.find((oldAch: Achievement) => oldAch.id === newAch.id && oldAch.unlocked)
    );

    newlyUnlocked.forEach((ach: Achievement) => {
        toast({
            title: "Badge Unlocked! 🎉",
            description: `You've earned the "${ach.name}" badge. Keep it up!`,
        });
        addNotification({
            title: `You've unlocked the ${ach.name} badge!`,
            description: 'Check your progress on the Tracker page.',
        });
    });

    setUserProgress(newProgress);
  };


   useEffect(() => {
        const sleepCheckInterval = setInterval(() => {
            const now = new Date();
            const currentHour = now.getHours();
            
            const startHour = 5;
            const endHour = 7;

            if (currentHour >= startHour && currentHour < endHour) {
                setIsSleepLoggingActive(true);
                setTimeToUnlockSleep(0);
            } else {
                setIsSleepLoggingActive(false);
                let unlockTime = new Date();
                unlockTime.setHours(startHour, 0, 0, 0);

                if (currentHour >= endHour) {
                    unlockTime.setDate(unlockTime.getDate() + 1);
                }
                
                setTimeToUnlockSleep(unlockTime.getTime() - now.getTime());
            }
        }, 1000);

        return () => clearInterval(sleepCheckInterval);
    }, []);

    useEffect(() => {
        const waterVibe = dailyVibes.find(vibe => vibe.id === 'water');
        if (waterVibe && waterVibe.completedAt) {
            const waterCheckInterval = setInterval(() => {
                const now = new Date().getTime();
                const completedTime = new Date(waterVibe.completedAt!).getTime();
                const unlockTime = completedTime + (90 * 60 * 1000); // 1.5 hours in ms
                const remainingTime = unlockTime - now;
                setTimeToUnlockWater(remainingTime);

                if (remainingTime <= 0) {
                     setDailyVibes(prev => prev.map(v => v.id === 'water' ? {...v, completedAt: undefined } : v));
                     clearInterval(waterCheckInterval);
                }
            }, 1000);
            return () => clearInterval(waterCheckInterval);
        } else {
            setTimeToUnlockWater(0);
        }
    }, [dailyVibes, setDailyVibes]);


  const handleEditVibe = (vibe: DailyVibe) => {
    if (vibe.id === 'sleep' && !isSleepLoggingActive) {
      toast({
        title: "Sleep Logging Locked",
        description: "You can only log your sleep between 5 AM and 7 AM.",
        variant: "destructive"
      });
      return;
    }
    setVibeToEdit(vibe);
    setIsEditVibeOpen(true);
  }

  const handleSaveVibe = (updatedVibe: DailyVibe) => {
    startTransition(async () => {
        if (!user) return;
        const updatedVibes = dailyVibes.map(v => v.id === updatedVibe.id ? updatedVibe : v);
        // We only set the state optimistically for UI responsiveness,
        // but the canonical data will come from the Firestore listener.
        setDailyVibes(updatedVibes); 
        await updateDailyVibesAction(user.uid, updatedVibes);
        
        setIsEditVibeOpen(false);
        setVibeToEdit(null);
        toast({
            title: "Daily Vibe Updated",
            description: "Your changes have been saved."
        });
    });
  }

  const handleDeleteVibe = (vibeId: string) => {
    startTransition(async () => {
        if (!user) return;
        const updatedVibes = dailyVibes.filter(v => v.id !== vibeId);
        setDailyVibes(updatedVibes);
        await updateDailyVibesAction(user.uid, updatedVibes);
        
        setIsEditVibeOpen(false);
        setVibeToEdit(null);
        toast({
            title: "Daily Vibe Removed",
            variant: "destructive"
        });
    });
  }

  const handleAddVibe = (newVibe: DailyVibe) => {
    startTransition(async () => {
        if (!user) return;
        const updatedVibes = [...dailyVibes, newVibe];
        setDailyVibes(updatedVibes);
        await updateDailyVibesAction(user.uid, updatedVibes);

        toast({
            title: "New Vibe Added!",
            description: `'${newVibe.title}' has been added to your daily tasks.`
        });
    });
  }

  const handleMarkChallengeAsDone = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.isCompletedToday) {
      setActiveChallengeId(challengeId);
      setActiveVibeId(null);
      setIsCameraOpen(true);
    }
  };

  const handleMarkVibeAsDone = (vibeId: string) => {
    const vibe = dailyVibes.find(v => v.id === vibeId);
    
    // Special handling for water intake
    if (vibe && vibe.id === 'water') {
      startTransition(async () => {
        if (!user) return;
        const current = parseInt(vibe.value.split('/')[0]);
        const newValue = Math.min(current + 1, 8); // Add 1 glass, max 8
        const newProgress = Math.min((newValue / 8) * 100, 100);
        
        const updatedVibe = { 
          ...vibe, 
          value: `${newValue}/8 glasses`,
          progress: newProgress,
          completedAt: newValue >= 8 ? new Date().toISOString() : undefined
        };
        
        const updatedVibes = dailyVibes.map(v => v.id === vibeId ? updatedVibe : v);
        setDailyVibes(updatedVibes);
        
        try {
          await updateWaterIntake(user.uid, newValue);
          await updateDailyVibesAction(user.uid, updatedVibes);
          
          toast({
            title: `Water logged! 💧`,
            description: `You've had ${newValue} glasses today. ${newValue >= 8 ? 'Daily goal achieved!' : `${8 - newValue} more to go!`}`
          });
        } catch (error) {
          console.error('Error updating water intake:', error);
          toast({
            title: 'Update failed',
            description: 'Could not update water intake. Please try again.',
            variant: 'destructive'
          });
        }
      });
      return;
    }
    
    if (vibe && !vibe.completedAt && vibe.id !== 'medication' && vibe.id !== 'water') {
      setActiveVibeId(vibeId);
      setActiveChallengeId(null);
      setIsCameraOpen(true);
    } else if (vibe && vibe.id === 'medication' && vibe.medicationConfig) {
        const config = vibe.medicationConfig;
        const now = new Date();
        const canTakeDose = !config.lastDoseTime || 
          (now.getTime() - new Date(config.lastDoseTime).getTime()) >= (config.intervalHours * 60 * 60 * 1000);
        
        if (!canTakeDose) {
          const nextDoseTime = new Date(new Date(config.lastDoseTime!).getTime() + (config.intervalHours * 60 * 60 * 1000));
          const timeUntilNext = Math.ceil((nextDoseTime.getTime() - now.getTime()) / (60 * 1000));
          toast({
            title: "Too early for next dose",
            description: `Please wait ${timeUntilNext} minutes before taking the next dose.`,
            variant: "destructive"
          });
          return;
        }

        startTransition(async () => {
            if (!user || !userProgress) return;
            const newDosesTaken = config.dosesTaken + 1;
            const isFullyCompleted = newDosesTaken >= config.dailyDoses;
            const newProgress = Math.min((newDosesTaken / config.dailyDoses) * 100, 100);
            
            const updatedVibe = { 
              ...vibe, 
              progress: newProgress,
              value: isFullyCompleted ? 'All doses taken' : `${newDosesTaken}/${config.dailyDoses} doses`,
              completedAt: isFullyCompleted ? new Date().toISOString() : undefined,
              medicationConfig: {
                ...config,
                dosesTaken: newDosesTaken,
                lastDoseTime: now.toISOString()
              }
            };

            const updatedVibes = dailyVibes.map(v => v.id === vibeId ? updatedVibe : v);
            setDailyVibes(updatedVibes);
            await updateDailyVibesAction(user.uid, updatedVibes);

            toast({
                title: 'Dose taken!',
                description: isFullyCompleted ? 
                  'All daily doses completed.' : 
                  `${newDosesTaken} of ${config.dailyDoses} doses taken today.`
            });
            
            const newUserProgress = { ...userProgress, completedTasks: userProgress.completedTasks + 1 };
            checkAchievements(newUserProgress);
        });
    }
  };

  const handleImageCaptured = (imageDataUrl: string) => {
    startTransition(async () => {
        if (!user || !userProgress) return;
        let completedSomething = false;

        if (activeChallengeId) {
          const challenge = challenges.find(c => c.id === activeChallengeId);
          if (challenge) {
            completedSomething = true;
            const updatedChallenge = { ...challenge, isCompletedToday: true, currentDay: challenge.currentDay + 1 };
            setChallenges(prev => prev.map(c => c.id === activeChallengeId ? updatedChallenge : c));
            await updateChallengeAction(user.uid, updatedChallenge);
            
            toast({
              title: "Streak Continued!",
              description: `You've completed '${challenge.title}' for today. Keep it up!`
            });
          }
        } else if (activeVibeId) {
            const vibe = dailyVibes.find(v => v.id === activeVibeId);
            if (vibe) {
                completedSomething = true;
                const updatedVibe = { ...vibe, completedAt: new Date().toISOString() };
                const updatedVibes = dailyVibes.map(v => v.id === activeVibeId ? updatedVibe : v);
                setDailyVibes(updatedVibes);
                await updateDailyVibesAction(user.uid, updatedVibes);

                toast({
                    title: 'Task Completed!',
                    description: `You've successfully completed '${vibe.title}'.`
                });
            }
        }

        if (completedSomething) {
          const newProgress = { ...userProgress, completedTasks: userProgress.completedTasks + 1 };
          checkAchievements(newProgress);
        }

        setIsCameraOpen(false);
        setActiveChallengeId(null);
        setActiveVibeId(null);
    });
  };

  const nonSnapVibeIds = ['sleep', 'streak'];

  if (loading) {
      return <div>Loading dashboard...</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Welcome back, <span>{(user && user.name) ? user.name.split(' ')[0] : 'friend'}!</span>
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
                    <Button variant="ghost" size="sm" onClick={() => setIsAddVibeOpen(true)}>
                        <PlusCircle className='mr-2 h-4 w-4' /> Add Vibe
                    </Button>
                </div>
                <motion.div 
                  className="grid grid-cols-1 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                    {dailyVibes.map((vibe) => {
                      const isTask = !nonSnapVibeIds.includes(vibe.id);
                      const isSleepCard = vibe.id === 'sleep';
                      const isWaterCard = vibe.id === 'water';
                      const isMedicationCard = vibe.id === 'medication';
                      const isCompleted = isMedicationCard ? vibe.progress === 100 : !!vibe.completedAt;
                      
                      const isWaterLocked = isWaterCard && timeToUnlockWater > 0;
                      let isVibeDisabled = (isSleepCard && !isSleepLoggingActive) || (isWaterCard && isWaterLocked);
                      if (isWaterCard && isCompleted && !isWaterLocked) isVibeDisabled = false;
                      
                      let isMedicationDisabled = false;
                      if (isMedicationCard && vibe.medicationConfig) {
                        const config = vibe.medicationConfig;
                        if (config.lastDoseTime) {
                          const now = new Date();
                          const timeSinceLastDose = now.getTime() - new Date(config.lastDoseTime).getTime();
                          const intervalMs = config.intervalHours * 60 * 60 * 1000;
                          isMedicationDisabled = timeSinceLastDose < intervalMs && config.dosesTaken < config.dailyDoses;
                        }
                      }

                      let vibeValue = vibe.value;
                      if (!isMedicationCard && isTask && isCompleted && vibe.completedAt) {
                          vibeValue = `Completed at ${format(new Date(vibe.completedAt), 'p')}`;
                      }

                      return (
                        <motion.div key={vibe.id} variants={itemVariants}>
                          <Card 
                            className={cn("p-4 transition-all duration-300 hover:shadow-md", 
                                isVibeDisabled || isMedicationDisabled ? 'cursor-not-allowed bg-muted/50' : 'hover:bg-card/50 cursor-pointer',
                                isCompleted && !isWaterLocked && 'bg-primary/5 border-primary/20 shadow-sm'
                            )}
                            onClick={() => !isVibeDisabled && !isMedicationDisabled && handleEditVibe(vibe)}
                          >
                              <div className='flex items-center'>
                                  <Icon name={vibe.icon} className={cn("mr-4 h-8 w-8", 
                                    isCompleted && !isWaterLocked ? 'text-primary' : 'text-primary'
                                  )} />
                                  <div className="flex-1">
                                      <p className={cn("font-medium", 
                                        isCompleted && !isWaterLocked && 'text-primary'
                                      )}>{vibe.title}</p>
                                      {isSleepCard && !isSleepLoggingActive ? (
                                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                          <Clock className="h-3 w-3" />
                                          <span>Unlocks in {formatTime(timeToUnlockSleep)}</span>
                                        </div>
                                      ) : isWaterLocked ? (
                                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                          <Clock className="h-3 w-3" />
                                          <span>Next intake in {formatTime(timeToUnlockWater)}</span>
                                        </div>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">{vibeValue}</p>
                                      )}
                                  </div>
                                  {isTask && (
                                    <Button 
                                        size="sm" 
                                        variant={isCompleted && !isWaterLocked ? 'secondary' : 'default'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkVibeAsDone(vibe.id)
                                        }}
                                        disabled={(isCompleted && !isMedicationCard && vibe.id !== 'water') || isWaterLocked || isPending || isMedicationDisabled}
                                        className="ml-2"
                                    >
                                        {isWaterCard ? (
                                          <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            {isCompleted ? 'Add More' : 'Add Glass'}
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            {isMedicationCard && vibe.medicationConfig ? 
                                              (vibe.medicationConfig.dosesTaken >= vibe.medicationConfig.dailyDoses ? 'Complete' : 'Take Dose') :
                                              (isCompleted ? 'Done' : 'Mark Done')
                                            }
                                          </>
                                        )}
                                    </Button>
                                  )}
                              </div>
                              {vibe.progress !== undefined && vibe.id !== 'streak' && (
                                <Progress 
                                  value={vibe.progress} 
                                  className={cn("w-full mt-3", 
                                    isCompleted && !isWaterLocked && '[&>div]:bg-primary',
                                    // Always show progress bar, just change color when completed
                                    vibe.progress > 0 ? 'opacity-100' : 'opacity-100'
                                  )} 
                                />
                              )}
                          </Card>
                        </motion.div>
                      )
                    })}
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
                      <ChallengeCard key={challenge.id} challenge={challenge} onMarkAsDone={handleMarkChallengeAsDone} />
                    ))}
                </motion.div>
            </section>
        </div>
      </div>
      <AddVibeDialog
        isOpen={isAddVibeOpen}
        onClose={() => setIsAddVibeOpen(false)}
        onAdd={handleAddVibe}
      />
      <EditVibeDialog 
        isOpen={isEditVibeOpen}
        onClose={() => setIsEditVibeOpen(false)}
        vibe={vibeToEdit}
        onSave={handleSaveVibe}
        onDelete={handleDeleteVibe}
      />
      <CameraDialog
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onImageCaptured={handleImageCaptured}
      />
    </div>
  );
}

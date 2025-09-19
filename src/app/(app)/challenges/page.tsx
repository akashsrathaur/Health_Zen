
'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Balancer } from 'react-wrap-balancer';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { publicChallenges, type Challenge, type PublicChallenge } from '@/lib/data';
import { Upload, Camera, RefreshCcw, CheckCircle, Video, XCircle, PlusCircle, Share2, Copy, Target, Users, TrendingUp, Calendar, Shield, MoreVertical, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { nanoid } from 'nanoid';
import { addChallenge as addChallengeAction, updateChallenge as updateChallengeAction, removeChallenge as removeChallengeAction } from '@/lib/user-utils';
import { useAuth } from '@/context/auth-context';
import { useNotifications } from '@/hooks/use-notifications';


function ChallengeCard({ challenge, onUploadProof, onShare, onQuit }: { 
  challenge: Challenge, 
  onUploadProof: (challengeId: string) => void, 
  onShare: (challenge: Challenge) => void,
  onQuit: (challenge: Challenge) => void
}) {
  const progress = (challenge.currentDay / challenge.goalDays) * 100;

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-40 sm:h-48 w-full">
        <Image
          src={challenge.imageUrl}
          alt={challenge.title}
          fill
          className="object-cover"
          data-ai-hint={challenge.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Options Menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {challenge.isCustom && (
                <DropdownMenuItem onClick={() => onShare(challenge)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Challenge
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onQuit(challenge)}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Quit Challenge
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="absolute bottom-0 left-0 p-3 sm:p-4">
          <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-1">{challenge.title}</h3>
          <p className="text-xs sm:text-sm text-white/80 line-clamp-2">{challenge.description}</p>
        </div>
      </div>
      <CardContent className="p-3 sm:p-4 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Day {challenge.currentDay} of {challenge.goalDays}</span>
           {challenge.isCompletedToday && (
              <div className="flex items-center gap-1 text-xs sm:text-sm text-green-500">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Done for today!</span>
                <span className="xs:hidden">Done!</span>
              </div>
            )}
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button 
          className="w-full text-xs sm:text-sm"
          size="sm"
          onClick={() => onUploadProof(challenge.id)}
          disabled={challenge.isCompletedToday}
        >
          <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          {challenge.isCompletedToday ? 'Completed' : 'Upload Proof'}
        </Button>
      </CardFooter>
    </Card>
  );
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

function CreateChallengeDialog({ isOpen, onClose, onChallengeCreate, userStreak }: { 
    isOpen: boolean, 
    onClose: () => void, 
    onChallengeCreate: (challenge: Challenge) => void,
    userStreak: number
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [goalDays, setGoalDays] = useState(30);
    const [category, setCategory] = useState('wellness');
    
    const canCreate = userStreak >= 7;
    const categories = ['fitness', 'wellness', 'mindfulness', 'nutrition', 'lifestyle'];

    const handleCreate = () => {
        if (!canCreate || !title || !description || !goalDays) return;

        const newChallenge: Challenge = {
            id: `custom-${nanoid()}`,
            challengeId: `public-${nanoid()}`,
            title,
            description,
            icon: 'Target',
            currentDay: 0,
            goalDays: Number(goalDays),
            imageUrl: `https://picsum.photos/seed/${nanoid()}/800/600`,
            imageHint: 'custom challenge',
            isCompletedToday: false,
            isCustom: true,
            completedDays: [],
            totalTasksCompleted: 0
        };
        onChallengeCreate(newChallenge);
        setTitle('');
        setDescription('');
        setGoalDays(30);
        setCategory('wellness');
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Create Public Challenge
                    </DialogTitle>
                    <DialogDescription>
                        {canCreate ? (
                            "Design your own wellness challenge and share it with the community!"
                        ) : (
                            <div className="flex items-center gap-2 text-amber-600">
                                <TrendingUp className="h-4 w-4" />
                                You need a 7+ day streak to create challenges. Current streak: {userStreak} days
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                
                {!canCreate ? (
                    <div className="py-8 text-center">
                        <div className="mb-4">
                            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Build Your Streak First!</h3>
                            <p className="text-muted-foreground mb-4">
                                Complete daily tasks for 7 consecutive days to unlock challenge creation.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm">
                                <TrendingUp className="h-4 w-4" />
                                <span>Current streak: <strong>{userStreak} days</strong></span>
                                <span className="text-muted-foreground">• Need: <strong>7 days</strong></span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='space-y-4 py-4'>
                        <div className='space-y-2'>
                            <Label htmlFor="challenge-title">Challenge Title</Label>
                            <Input 
                                id="challenge-title" 
                                placeholder="e.g., 30-Day Morning Meditation" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="challenge-description">Description</Label>
                            <Textarea 
                                id="challenge-description" 
                                placeholder="Describe your challenge and what participants will accomplish" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className='space-y-2'>
                                <Label htmlFor="challenge-goal">Duration (days)</Label>
                                <Input 
                                    id="challenge-goal" 
                                    type="number" 
                                    min={7}
                                    max={365}
                                    value={goalDays} 
                                    onChange={(e) => setGoalDays(parseInt(e.target.value, 10))} 
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="challenge-category">Category</Label>
                                <select 
                                    id="challenge-category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="capitalize">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
                
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    {canCreate && (
                        <Button 
                            onClick={handleCreate} 
                            disabled={!title || !description || !goalDays || goalDays < 7}
                        >
                            Create Challenge
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ShareDialog({ isOpen, onClose, challenge }: { isOpen: boolean, onClose: () => void, challenge: Challenge | null }) {
    const { toast } = useToast();
    const shareUrl = challenge && typeof window !== 'undefined' ? `${window.location.origin}/challenges/join?id=${challenge.id}` : '';

    const handleCopy = () => {
        if (shareUrl) {
            navigator.clipboard.writeText(shareUrl);
            toast({ title: "Link Copied!", description: "Challenge link has been copied to your clipboard." });
        }
    }

    if (!challenge) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Challenge</DialogTitle>
                    <DialogDescription>
                        Share this link with your friends and family to invite them.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-4">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                        Link
                        </Label>
                        <Input
                        id="link"
                        defaultValue={shareUrl}
                        readOnly
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function PublicChallengeCard({ challenge, onJoin, userChallenges }: { challenge: PublicChallenge, onJoin: (challenge: PublicChallenge) => void, userChallenges: Challenge[] }) {
  const isAlreadyJoined = userChallenges.some(uc => uc.challengeId === challenge.id);
  
  return (
    <Card key={challenge.id} className="overflow-hidden">
      <div className="relative h-40 w-full">
        <Image
          src={challenge.imageUrl}
          alt={challenge.title}
          fill
          className="object-cover"
          data-ai-hint={challenge.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute top-2 right-2">
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center gap-1">
            <Users className="h-3 w-3" />
            {challenge.participantCount.toLocaleString()}
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <h4 className="text-white font-semibold text-lg mb-1">{challenge.title}</h4>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Calendar className="h-3 w-3" />
            <span>{challenge.goalDays} days</span>
            <span>•</span>
            <span className="capitalize">{challenge.category}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{challenge.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted-foreground">
            Created by <span className="font-medium text-foreground">{challenge.createdBy.name}</span>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>{challenge.createdBy.streak} day streak</span>
            </div>
          </div>
        </div>
        
        <Button 
          size="sm" 
          className="w-full"
          onClick={() => onJoin(challenge)}
          disabled={isAlreadyJoined}
          variant={isAlreadyJoined ? "secondary" : "default"}
        >
          {isAlreadyJoined ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Already Joined
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              Join Challenge
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function JoinChallengeDialog({ isOpen, onClose, onJoinChallenge, userChallenges }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onJoinChallenge: (challenge: PublicChallenge) => void,
  userChallenges: Challenge[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', 'fitness', 'wellness', 'mindfulness', 'nutrition', 'lifestyle'];
  
  const filteredChallenges = selectedCategory === 'all' 
    ? publicChallenges 
    : publicChallenges.filter(c => c.category === selectedCategory);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Public Wellness Challenges
          </DialogTitle>
          <DialogDescription>
            Join thousands of people in these popular wellness challenges!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
        
        <div className="overflow-y-auto max-h-[500px] pr-2">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredChallenges.map((challenge) => (
              <PublicChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                onJoin={onJoinChallenge}
                userChallenges={userChallenges}
              />
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ChallengesPage() {
  const { user, challenges, setChallenges, loading, streak } = useAuth();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isJoinChallengeOpen, setIsJoinChallengeOpen] = useState(false);
  const [isQuitDialogOpen, setIsQuitDialogOpen] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [challengeToShare, setChallengeToShare] = useState<Challenge | null>(null);
  const [challengeToQuit, setChallengeToQuit] = useState<Challenge | null>(null);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const handleOpenUpload = (challengeId: string) => {
    setActiveChallengeId(challengeId);
    setIsCameraOpen(true);
  };
  
  const handleImageCaptured = async (imageDataUrl: string) => {
    if (activeChallengeId && user) {
        const challengeToUpdate = challenges.find(c => c.id === activeChallengeId);
        if (challengeToUpdate) {
            const updatedChallenge = { ...challengeToUpdate, isCompletedToday: true, currentDay: challengeToUpdate.currentDay + 1 };
            
            // Optimistic update
            setChallenges(prevChallenges => 
                prevChallenges.map(c => c.id === activeChallengeId ? updatedChallenge : c)
            );

            await updateChallengeAction(user.uid, updatedChallenge);

            toast({
                title: "Streak Continued!",
                description: `You've completed your goal for today. Great job!`
            });
            
            addNotification({
                title: `Challenge Progress! 🎯`,
                description: `You've completed day ${updatedChallenge.currentDay} of ${challengeToUpdate.title}.`
            });
        }
    }
    setIsCameraOpen(false);
    setActiveChallengeId(null);
  };

  const handleChallengeCreate = async (newChallenge: Challenge) => {
    if (user) {
        // Optimistic update
        setChallenges(prev => [newChallenge, ...prev]);
        
        await addChallengeAction(user.uid, newChallenge);
        
        setIsCreateOpen(false);
        setChallengeToShare(newChallenge);
        setIsShareOpen(true);
    }
  }

  const handleShare = (challenge: Challenge) => {
    setChallengeToShare(challenge);
    setIsShareOpen(true);
  }

  const handleQuit = (challenge: Challenge) => {
    setChallengeToQuit(challenge);
    setIsQuitDialogOpen(true);
  }

  const handleConfirmQuit = async () => {
    if (user && challengeToQuit) {
      // Remove from local state
      setChallenges(prev => prev.filter(c => c.id !== challengeToQuit.id));
      
      // Remove from Firebase
      await removeChallengeAction(user.uid, challengeToQuit.id);
      
      setIsQuitDialogOpen(false);
      setChallengeToQuit(null);
      
      toast({
        title: "Challenge Left",
        description: `You've left ${challengeToQuit.title}. You can always join again later!`
      });
    }
  };

  const handleJoinPublicChallenge = async (publicChallenge: PublicChallenge) => {
    if (user) {
      // Create user challenge from public challenge
      const joinedChallenge: Challenge = {
        id: `user-${nanoid()}`,
        challengeId: publicChallenge.id,
        title: publicChallenge.title,
        description: publicChallenge.description,
        icon: 'Target',
        currentDay: 0,
        goalDays: publicChallenge.goalDays,
        imageUrl: publicChallenge.imageUrl,
        imageHint: publicChallenge.imageHint,
        isCompletedToday: false,
        isCustom: false,
        completedDays: [],
        totalTasksCompleted: 0
      };
      
      // Add to user's challenges
      setChallenges(prev => [joinedChallenge, ...prev]);
      
      await addChallengeAction(user.uid, joinedChallenge);
      
      setIsJoinChallengeOpen(false);
      
      toast({
        title: `Welcome to ${publicChallenge.title}! 🎯`,
        description: `You've joined the challenge. Start today and build your streak!`
      });
      
      addNotification({
        title: `New Challenge Joined! 🎯`,
        description: `You've joined ${publicChallenge.title}. Ready to start your journey?`
      });
    }
  };

  const handleJoinChallenge = async (challenge: Challenge) => {
    if (user) {
      // Reset challenge to start from day 0 for new participant
      const joinedChallenge = { ...challenge, currentDay: 0, isCompletedToday: false };
      
      // Add to user's challenges
      setChallenges(prev => [joinedChallenge, ...prev]);
      
      await addChallengeAction(user.uid, joinedChallenge);
      
      setIsJoinChallengeOpen(false);
      
      toast({
        title: `Welcome to ${challenge.title}! 🎯`,
        description: `You've joined the challenge. Start today and build your streak!`
      });
    }
  };

  if (loading) {
      return <div>Loading challenges...</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight">
            Wellness Challenges
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
            <Balancer>
                Commit to a challenge, track your progress, and build healthy habits.
            </Balancer>
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsJoinChallengeOpen(true)}
            className="w-full sm:w-auto justify-center sm:justify-start"
          >
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Browse & Join Challenges</span>
            <span className="xs:hidden">Browse Challenges</span>
          </Button>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto justify-center sm:justify-start"
          >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Create New Challenge</span>
              <span className="xs:hidden">Create Challenge</span>
          </Button>
        </div>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Target className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Challenges Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Get started on your wellness journey by joining a challenge or creating your own!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button 
              onClick={() => setIsJoinChallengeOpen(true)}
              className="w-full sm:w-auto"
            >
              <Target className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Browse & Join Challenges</span>
              <span className="xs:hidden">Browse Challenges</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateOpen(true)}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Create New Challenge</span>
              <span className="xs:hidden">Create Challenge</span>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {challenges.map((challenge, index) => (
                 <motion.div
                    key={challenge.id}
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ChallengeCard 
                    challenge={challenge}
                    onUploadProof={handleOpenUpload}
                    onShare={handleShare}
                    onQuit={handleQuit}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Discover More Challenges Section */}
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <div className="max-w-md mx-auto">
              <Users className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Discover More Challenges</h3>
              <p className="text-muted-foreground mb-4">
                Join thousands of people in popular wellness challenges created by experienced community members!
              </p>
              <Button onClick={() => setIsJoinChallengeOpen(true)} size="lg">
                <Users className="mr-2 h-4 w-4" />
                Browse Public Challenges
              </Button>
            </div>
          </div>
        </>
      )}

      <CameraDialog 
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onImageCaptured={handleImageCaptured}
      />
      <CreateChallengeDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onChallengeCreate={handleChallengeCreate}
        userStreak={streak || 0}
      />
       <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        challenge={challengeToShare}
      />
      <JoinChallengeDialog
        isOpen={isJoinChallengeOpen}
        onClose={() => setIsJoinChallengeOpen(false)}
        onJoinChallenge={handleJoinPublicChallenge}
        userChallenges={challenges}
      />
      
      {/* Quit Challenge Confirmation Dialog */}
      <Dialog open={isQuitDialogOpen} onOpenChange={setIsQuitDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-500" />
              Quit Challenge?
            </DialogTitle>
            <DialogDescription>
              {challengeToQuit && (
                <>
                  Are you sure you want to quit <strong>{challengeToQuit.title}</strong>? 
                  <br />
                  <br />
                  Your progress will be lost, but you can always join this challenge again later.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsQuitDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmQuit}>
              <LogOut className="mr-2 h-4 w-4" />
              Yes, Quit Challenge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

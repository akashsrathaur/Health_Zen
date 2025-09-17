
'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Balancer } from 'react-wrap-balancer';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { initialChallenges, type Challenge } from '@/lib/data';
import { Upload, Camera, RefreshCcw, CheckCircle, Video, XCircle, PlusCircle, Share2, Copy, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { nanoid } from 'nanoid';
import { useData } from '@/context/data-context';
import { addChallenge as addChallengeAction, updateChallenge as updateChallengeAction } from '@/actions/challenges';
import { useAuth } from '@/context/auth-context';


function ChallengeCard({ challenge, onUploadProof, onShare }: { challenge: Challenge, onUploadProof: (challengeId: string) => void, onShare: (challenge: Challenge) => void }) {
  const progress = (challenge.currentDay / challenge.goalDays) * 100;

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={challenge.imageUrl}
          alt={challenge.title}
          fill
          className="object-cover"
          data-ai-hint={challenge.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
          <p className="text-sm text-white/80">{challenge.description}</p>
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Day {challenge.currentDay} of {challenge.goalDays}</span>
           {challenge.isCompletedToday && (
              <div className="flex items-center gap-1 text-sm text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span>Done for today!</span>
              </div>
            )}
        </div>
        <Progress value={progress} />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          className="w-full"
          onClick={() => onUploadProof(challenge.id)}
          disabled={challenge.isCompletedToday}
        >
          <Upload className="mr-2 h-4 w-4" />
          {challenge.isCompletedToday ? 'Completed' : 'Upload Proof'}
        </Button>
        {challenge.isCustom && (
          <Button variant="outline" size="icon" onClick={() => onShare(challenge)}>
            <Share2 className="h-4 w-4" />
          </Button>
        )}
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

function CreateChallengeDialog({ isOpen, onClose, onChallengeCreate }: { isOpen: boolean, onClose: () => void, onChallengeCreate: (challenge: Challenge) => void}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [goalDays, setGoalDays] = useState(30);

    const handleCreate = () => {
        if (!title || !description || !goalDays) return;

        const newChallenge: Challenge = {
            id: `custom-${nanoid()}`,
            title,
            description,
            icon: Target,
            currentDay: 0,
            goalDays: Number(goalDays),
            imageUrl: `https://picsum.photos/seed/${nanoid()}/800/600`,
            imageHint: 'custom challenge',
            isCompletedToday: false,
            isCustom: true,
        };
        onChallengeCreate(newChallenge);
        setTitle('');
        setDescription('');
        setGoalDays(30);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Challenge</DialogTitle>
                    <DialogDescription>
                        Define your own wellness challenge and invite your friends to join.
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                    <div className='space-y-2'>
                        <Label htmlFor="challenge-title">Title</Label>
                        <Input id="challenge-title" placeholder="e.g., Daily Morning Yoga" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="challenge-description">Description</Label>
                        <Textarea id="challenge-description" placeholder="A brief description of your challenge" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="challenge-goal">Goal (in days)</Label>
                        <Input id="challenge-goal" type="number" value={goalDays} onChange={(e) => setGoalDays(parseInt(e.target.value, 10))} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate} disabled={!title || !description || !goalDays}>Create and Share</Button>
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

export default function ChallengesPage() {
  const { user } = useAuth();
  const { challenges, setChallenges, loading } = useData();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [challengeToShare, setChallengeToShare] = useState<Challenge | null>(null);
  const { toast } = useToast();

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

  if (loading) {
      return <div>Loading challenges...</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
            Wellness Challenges
            </h1>
            <p className="text-muted-foreground">
            <Balancer>
                Commit to a challenge, track your progress, and build healthy habits.
            </Balancer>
            </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Challenge
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CameraDialog 
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onImageCaptured={handleImageCaptured}
      />
      <CreateChallengeDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onChallengeCreate={handleChallengeCreate}
      />
       <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        challenge={challengeToShare}
      />
    </div>
  );
}

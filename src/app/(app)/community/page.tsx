
'use client';
import Image from 'next/image';
import { Balancer } from 'react-wrap-balancer';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { communityPosts as initialCommunityPosts, type CommunityPost } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Send, CircleUser, Video, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { defaultUser } from '@/lib/user-store';
import { addCommunityPost as addPostAction } from '@/actions/community';
import { formatDistanceToNow } from 'date-fns';


function PostCard({ post }: { post: CommunityPost }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar>
          <AvatarImage src={post.user.avatarUrl} alt={post.user.name} />
          <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <p className="font-semibold">{post.user.name}</p>
          <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{post.content}</p>
        {post.imageUrl && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image
              src={post.imageUrl}
              alt="Post image"
              fill
              className="object-cover"
              data-ai-hint={post.imageHint}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        {Object.entries(post.reactions).map(([emoji, count]) => (
          <Button key={emoji} variant="outline" size="sm" className="rounded-full">
            {emoji} <span className="ml-2 text-xs text-muted-foreground">{count}</span>
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}

function CreatePost({ onAddPost, userData }: { onAddPost: (content: string, imageUrl?: string, imageHint?: string) => void, userData: NonNullable<ReturnType<typeof useAuth>['user']> }) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const handlePost = () => {
        if (content.trim() || image) {
            onAddPost(content, image || undefined, 'custom post');
            setContent('');
            setImage(null);
        }
    };

    const handleImageCaptured = (imageDataUrl: string) => {
        setImage(imageDataUrl);
        setIsCameraOpen(false);
    }

    return (
        <>
            <Card>
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <Avatar>
                            <AvatarImage src={userData.avatarUrl} />
                            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="w-full space-y-2">
                            <Textarea 
                                placeholder="Share a wellness tip or a story..." 
                                className="border-none focus-visible:ring-0 shadow-none px-0" 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            {image && (
                                <div className='relative w-32 h-24'>
                                    <Image src={image} alt="Preview" layout='fill' className='rounded-lg object-cover' />
                                    <Button variant='destructive' size='icon' className='absolute -top-2 -right-2 h-6 w-6 rounded-full' onClick={() => setImage(null)}>
                                        <XCircle className='h-4 w-4' />
                                    </Button>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <Button variant="ghost" size="icon" onClick={() => setIsCameraOpen(true)}>
                                    <Camera className="h-5 w-5 text-muted-foreground" />
                                </Button>
                                <Button size="sm" onClick={handlePost} disabled={!content.trim() && !image}>
                                    Post <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <CameraDialog 
                isOpen={isCameraOpen} 
                onClose={() => setIsCameraOpen(false)} 
                onImageCaptured={handleImageCaptured}
            />
        </>
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
                    <DialogTitle>Take a Photo</DialogTitle>
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
                                <CheckCircle className="mr-2 h-4 w-4" /> Use this photo
                            </Button>
                        </div>
                    ) : (
                        <Button className="w-full" onClick={handleCapture} disabled={!hasCameraPermission}>
                            <Camera className="mr-2 h-4 w-4" /> Capture
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function CommunityPage() {
  const { user, posts, setPosts, loading } = useAuth();
  const userData = user || { ...defaultUser, uid: '' };
  
  const handleAddPost = async (content: string, imageUrl?: string, imageHint?: string) => {
    if (!user) return;
    const newPost: CommunityPost = {
      id: nanoid(),
      user: {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      timestamp: new Date().toISOString(),
      content: content,
      imageUrl: imageUrl,
      imageHint: imageHint,
      reactions: {},
    };

    // Optimistic update
    setPosts(prevPosts => [newPost, ...prevPosts]);

    await addPostAction(user.uid, newPost);
  };

  if (loading) {
      return <div>Loading community posts...</div>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Community Feed
        </h1>
        <p className="text-muted-foreground">
          <Balancer>
            Share your journey and get inspired by others in the HealthZen community.
          </Balancer>
        </p>
      </div>

      <div className="space-y-6">
        {user && <CreatePost onAddPost={handleAddPost} userData={userData} />}
        <Separator />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

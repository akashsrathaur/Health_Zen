
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
import { Camera, Send, CircleUser, Video, RefreshCcw, CheckCircle, XCircle, MessageCircle, Heart, ThumbsUp, RotateCcw, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { defaultUser, type User } from '@/lib/user-store';
import { addCommunityPost as addPostAction, togglePostReaction, addCommentToPost } from '@/actions/community';
import { formatDistanceToNow } from 'date-fns';


function PostCard({ post, currentUser }: { post: CommunityPost; currentUser: User | null }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const handleReaction = async (emoji: string) => {
    if (!currentUser) return;
    try {
      await togglePostReaction(post.id, currentUser.uid, emoji);
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const handleAddComment = async () => {
    if (!currentUser || !newComment.trim()) return;
    
    setIsAddingComment(true);
    try {
      await addCommentToPost(post.id, {
        user: {
          uid: currentUser.uid,
          name: currentUser.name,
          avatarUrl: currentUser.avatarUrl
        },
        content: newComment.trim()
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const commonReactions = ['❤️', '👍', '😊', '🔥', '💪', '🌿'];
  const userReaction = currentUser ? post.userReactions?.[currentUser.uid] : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar>
          <AvatarImage src={post.user.avatarUrl} alt={post.user.name} />
          <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <p className="font-semibold">{post.user.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
          </p>
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
      
      {/* Reaction Bar */}
      <div className="px-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {commonReactions.map((emoji) => {
              const count = post.reactions[emoji] || 0;
              const isActive = userReaction === emoji;
              return (
                <Button
                  key={emoji}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn("rounded-full h-8 px-2", isActive && "bg-primary text-primary-foreground")}
                  onClick={() => {}} // Disabled - readonly mode
                  disabled={true} // Always disabled
                >
                  {emoji}
                  {count > 0 && <span className="ml-1 text-xs">{count}</span>}
                </Button>
              );
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}} // Disabled - readonly mode
            disabled={true} // Always disabled
            className="flex items-center gap-1"
          >
            <MessageCircle className="h-4 w-4" />
            {post.comments?.length || 0}
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CardFooter className="flex-col space-y-4">
          <Separator />
          
          {/* Existing Comments */}
          <div className="w-full space-y-3">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="font-semibold text-sm">{comment.user.name}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          {currentUser && (
            <div className="w-full flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isAddingComment}
                >
                  {isAddingComment ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      )}
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
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  
  const testFirebaseConnection = async () => {
    try {
      console.log('Testing Firebase connection...');
      console.log('Environment variables:', {
        hasApiKey: typeof window !== 'undefined' ? !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY : 'server-side',
        hasAuthDomain: typeof window !== 'undefined' ? !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN : 'server-side',
        hasProjectId: typeof window !== 'undefined' ? !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID : 'server-side',
        hasStorageBucket: typeof window !== 'undefined' ? !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET : 'server-side',
        hasMessagingSenderId: typeof window !== 'undefined' ? !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : 'server-side',
        hasAppId: typeof window !== 'undefined' ? !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID : 'server-side'
      });
      
      console.log('Firebase Auth user:', user);
      console.log('Current posts:', posts.length);
      
      // Test if we can read from Firestore by trying to get existing posts
      const { getAllCommunityPosts } = await import('@/actions/community');
      const testPosts = await getAllCommunityPosts();
      console.log('Test read from Firestore:', testPosts.length, 'posts');
      
      toast({
        title: 'Firebase Test Complete',
        description: `Connection test done. Check console for details. Found ${testPosts.length} posts.`,
      });
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      toast({
        variant: 'destructive',
        title: 'Firebase Test Failed',
        description: 'Check console for error details.',
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      console.log('Manual refresh triggered');
      console.log('Current posts count:', posts.length);
      console.log('Current user:', user);
      
      // Test Firebase connection when refreshing
      await testFirebaseConnection();
      
      // Instead of full page reload, just force re-fetch
      // The listener should automatically get new data
      setTimeout(() => {
        setRefreshing(false);
        toast({
          title: 'Refreshed',
          description: 'Community feed has been refreshed.',
        });
      }, 1000);
    } catch (error) {
      console.error('Error refreshing posts:', error);
      toast({
        variant: 'destructive',
        title: 'Refresh Failed',
        description: 'Unable to refresh posts. Please try again.',
      });
      setRefreshing(false);
    }
  };

  const handleAddPost = async (content: string, imageUrl?: string, imageHint?: string) => {
    if (!user) {
      console.log('Post creation failed: User not logged in');
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'Please log in to create posts.',
      });
      return;
    }

    console.log('Starting post creation...', {
      user: {
        uid: user.uid,
        name: user.name,
        authenticated: !!user.uid
      },
      content: content.slice(0, 50) + '...',
      hasImage: !!imageUrl
    });

    try {
      const newPost: Omit<CommunityPost, 'id'> = {
        user: {
          uid: user.uid,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        timestamp: new Date().toISOString(),
        content: content,
        imageUrl: imageUrl,
        imageHint: imageHint,
        reactions: {},
        userReactions: {},
        comments: []
      };

      console.log('Attempting to save post:', newPost);
      const result = await addPostAction(newPost);
      console.log('Post creation result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create post');
      }
      
      toast({
        title: 'Post Created!',
        description: 'Your post has been shared with the community.',
      });
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error details:', {
        name: (error as any)?.name,
        message: (error as any)?.message,
        code: (error as any)?.code,
        stack: (error as any)?.stack,
        cause: (error as any)?.cause
      });
      
      // Provide specific error messages based on error type
      let errorMessage = 'Unable to create post. Please try again.';
      let errorTitle = 'Post Failed';
      
      if ((error as any)?.code === 'permission-denied') {
        errorMessage = 'You don\'t have permission to create posts. Please check your authentication.';
        errorTitle = 'Permission Denied';
      } else if ((error as any)?.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
        errorTitle = 'Service Unavailable';
      } else if ((error as any)?.message?.includes('Firebase')) {
        errorMessage = `Firebase error: ${(error as any).message}`;
        errorTitle = 'Database Error';
      }
      
      toast({
        variant: 'destructive',
        title: errorTitle,
        description: errorMessage,
      });
    }
  };

  if (loading) {
      return (
        <div className="mx-auto max-w-2xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading community posts...</p>
          </div>
        </div>
      )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Community Feed
            </h1>
            <p className="text-muted-foreground">
              <Balancer>
                Share your journey and get inspired by others in the HealthZen community.
              </Balancer>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RotateCcw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* CreatePost component disabled - readonly mode */}
        <Separator />
        {posts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Users className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to share something with the community!
                  </p>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Check for posts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} currentUser={user} />
          ))
        )}
      </div>
    </div>
  );
}

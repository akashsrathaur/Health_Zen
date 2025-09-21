
/**
 * Health Zen - AI-Powered Personalized Wellness Companion
 * Copyright © 2025 Akash Rathaur. All Rights Reserved.
 * 
 * Community Page - Social wellness platform
 * Features community sharing, challenges, and peer support for wellness journeys
 * 
 * @author Akash Rathaur
 * @email akashsrathaur@gmail.com
 * @website https://github.com/akashsrathaur
 */

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
import { CameraDialog } from '@/components/ui/camera-dialog';


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
    <div className="gradient-border-card">
      <Card className="gradient-border-card-inner overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-2 sm:gap-3 pb-3 sm:pb-4">
        <Avatar variant="gradient" className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarImage src={post.user.avatarUrl} alt={post.user.name} />
          <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base truncate">{post.user.name}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 pt-0">
        <p className="text-sm sm:text-base break-words">{post.content}</p>
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
      <div className="px-4 sm:px-6 pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {commonReactions.map((emoji) => {
              const count = post.reactions[emoji] || 0;
              const isActive = userReaction === emoji;
              return (
                <Button
                  key={emoji}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "rounded-full h-6 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm", 
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => {}} // Disabled - readonly mode
                  disabled={true} // Always disabled
                >
                  {emoji}
                  {count > 0 && <span className="ml-0.5 sm:ml-1 text-xs">{count}</span>}
                </Button>
              );
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {}} // Disabled - readonly mode
            disabled={true} // Always disabled
            className="flex items-center gap-1 text-xs sm:text-sm px-2"
          >
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">{post.comments?.length || 0} comments</span>
            <span className="xs:hidden">{post.comments?.length || 0}</span>
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
                <Avatar variant="gradient" className="h-8 w-8">
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
              <Avatar variant="gradient" className="h-8 w-8">
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
    </div>
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
            <div className="gradient-border-card">
                <Card className="gradient-border-card-inner">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <Avatar variant="gradient">
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
            </div>
            <CameraDialog 
                isOpen={isCameraOpen} 
                onClose={() => setIsCameraOpen(false)} 
                onImageCaptured={handleImageCaptured}
            />
        </>
    )
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
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading community posts...</p>
          </div>
        </div>
      )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="font-headline text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              Community Feed
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-2">
              <Balancer>
                Share your journey and get inspired by others in the HealthZen community.
              </Balancer>
            </p>
          </div>
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <RotateCcw className={cn("h-3 w-3 sm:h-4 sm:w-4", refreshing && "animate-spin")} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* CreatePost component disabled - readonly mode */}
        <Separator className="my-4 sm:my-6" />
        {posts.length === 0 ? (
          <div className="gradient-border-card">
            <Card className="gradient-border-card-inner text-center py-8 sm:py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <Users className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-sm sm:text-base">No posts yet</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Be the first to share something with the community!
                  </p>
                  <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-2 sm:mt-4">
                    <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Check for posts
                  </Button>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} currentUser={user} />
          ))
        )}
      </div>
    </div>
  );
}

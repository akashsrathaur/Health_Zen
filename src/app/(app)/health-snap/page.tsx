'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  Camera,
  Share2,
  X,
  Users,
  ImageIcon,
  Download,
  Facebook,
  Twitter,
  Instagram,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { addCommunityPost } from '@/actions/community';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

function HealthSnapUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file.',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      // Wait for the video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please check permissions or use file upload instead.',
        variant: 'destructive',
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const dataURL = canvas.toDataURL('image/jpeg');
        setPreview(dataURL);
        stopCamera();
      }
    }
  };

  const handleShareToCommunity = async () => {
    if (!user) {
      toast({
        title: 'Not Logged In',
        description: 'Please log in to share to community.',
        variant: 'destructive',
      });
      return;
    }

    if (!preview) {
      toast({
        title: 'No Photo to Share',
        description: 'Please take or select a photo first.',
        variant: 'destructive',
      });
      return;
    }

    setIsSharing(true);
    try {
      const shareContent = caption.trim() || '📸 Sharing a moment from my wellness journey! #HealthZen #Wellness';
      
      console.log('About to create community post with data:', {
        user: {
          uid: user.uid,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        content: shareContent,
        hasImage: !!preview
      });
      
      const result = await addCommunityPost({
        user: {
          uid: user.uid,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        timestamp: new Date().toISOString(),
        content: shareContent,
        imageUrl: preview,
        imageHint: 'HealthSnap photo',
        reactions: {},
        userReactions: {},
        comments: []
      });
      
      console.log('Community post result:', result);
      
      // Check if the result indicates success
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          toast({
            title: 'Shared to Community!',
            description: 'Your photo has been shared with the community.',
          });
          setShowShareDialog(false);
        } else {
          throw new Error(result.error || 'Failed to create post');
        }
      } else {
        // Assume success if no error was thrown
        toast({
          title: 'Shared to Community!',
          description: 'Your photo has been shared with the community.',
        });
        setShowShareDialog(false);
      }
    } catch (error: any) {
      console.error('Error sharing to community:', error);
      let errorMessage = 'Unable to share to community. Please try again.';
      
      if (error.message) {
        if (error.message.includes('permission')) {
          errorMessage = 'Permission denied. Please make sure you are logged in.';
        } else if (error.message.includes('network') || error.message.includes('offline')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Share Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };
  
  const handleSocialShare = (platform: string) => {
    if (!preview) {
      toast({
        title: 'No Photo to Share',
        description: 'Please take or select a photo first.',
        variant: 'destructive',
      });
      return;
    }

    const shareText = caption.trim() || 'Check out my wellness moment! #HealthZen #Wellness';
    const appUrl = window.location.origin;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'download':
        // Create download link
        const link = document.createElement('a');
        link.download = `healthzen-snap-${Date.now()}.jpg`;
        link.href = preview;
        link.click();
        toast({
          title: 'Photo Downloaded',
          description: 'Your photo has been saved to your device.',
        });
        break;
    }
  };

  const handleReset = () => {
    setPreview(null);
    setCaption('');
    if(fileInputRef.current) fileInputRef.current.value = "";
    stopCamera();
    setShowShareDialog(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera /> HealthSnap
        </CardTitle>
        <CardDescription>
          Take a photo and share your wellness moment with the community or on social media.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {preview ? (
          <div className="relative group">
            <Image
              src={preview}
              alt="Image preview"
              width={800}
              height={600}
              className="rounded-lg object-contain w-full"
            />
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              onClick={handleReset} 
              className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <Label htmlFor="picture" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or GIF (max 5MB)</p>
                </div>
                <Input 
                  id="picture" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  ref={fileInputRef} 
                  accept="image/*" 
                />
              </Label>
            </div>
            <div className="flex justify-center">
              <Button type="button" variant="outline" onClick={startCamera} className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Use Camera
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="caption">Caption</Label>
          <Textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write something about your wellness moment... (optional)"
            className="min-h-[80px]"
            maxLength={300}
          />
          <p className="text-xs text-muted-foreground text-right">{caption.length}/300</p>
        </div>
      </CardContent>
      
      {preview && (
        <CardFooter className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button 
              onClick={() => setShowShareDialog(true)}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Share to Community
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setShowShareDialog(true);
              }}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share Socially
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleReset} 
            className="w-full"
          >
            Take Another Photo
          </Button>
        </CardFooter>
      )}
      
      {/* Camera Dialog */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Capture Photo</DialogTitle>
            <DialogDescription>
              Position yourself in the camera view and click capture when ready.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="h-full w-full object-cover"
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={stopCamera}>
              Cancel
            </Button>
            <Button onClick={capturePhoto}>
              <Camera className="mr-2 h-4 w-4" />
              Capture Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Photo</DialogTitle>
            <DialogDescription>
              Share your wellness moment with the community or on social media.
            </DialogDescription>
          </DialogHeader>
          
          {preview && (
            <div className="space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden border">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              
              {caption && (
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="text-sm">{caption}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleShareToCommunity}
                  disabled={isSharing}
                  className="flex items-center gap-2"
                >
                  {isSharing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Users className="h-4 w-4" />
                  )}
                  Community
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handleSocialShare('download')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline"
                  onClick={() => handleSocialShare('twitter')}
                  className="flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handleSocialShare('facebook')}
                  className="flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function HealthSnapPage() {
    return (
        <div className="flex flex-col gap-8">
             <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">
                HealthSnap
                </h1>
                <p className="text-muted-foreground">
                    Capture and share your wellness moments with the community and social media.
                </p>
            </div>
            <HealthSnapUploader />
        </div>
    )
}

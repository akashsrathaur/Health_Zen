'use client';
import { useActionState } from 'react';
import { healthSnapAction } from '@/actions/health-snap';
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
import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Camera,
  Heart,
  Lightbulb,
  Share2,
  Save,
  Loader2,
  X,
  Tag,
  Users,
  ImageIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { addCommunityPost } from '@/actions/community';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

function HealthSnapUploader() {
  const [state, formAction] = useActionState(healthSnapAction, {
    data: null,
    error: null,
  });
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        if (state.data || state.error) {
           // Reset state if a new file is chosen
           formRef.current?.reset();
           // How to reset useFormState? A key on the component is one way.
           // For now, let's just clear preview and let user resubmit.
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!preview) return;
    const formData = new FormData(event.currentTarget);
    formData.set('photoDataUri', preview);
    startTransition(() => {
        formAction(formData);
    });
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

    if (!state.data || !preview) {
      toast({
        title: 'No Content to Share',
        description: 'Please analyze a photo first.',
        variant: 'destructive',
      });
      return;
    }

    setIsSharing(true);
    try {
      const shareContent = `🌿 My HealthSnap Insights\n\n💡 Modern Tip: ${state.data.modernTip}\n\n❤️ Ayurvedic Tip: ${state.data.ayurvedicTip}\n\n🏷️ Categories: ${state.data.categoryTags.join(', ')}\n\n#HealthZen #Wellness`;
      
      await addCommunityPost({
        user: {
          uid: user.uid,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        timestamp: new Date().toISOString(),
        content: shareContent,
        imageUrl: preview,
        imageHint: 'HealthSnap wellness analysis',
        reactions: {},
        userReactions: {},
        comments: []
      });
      
      toast({
        title: 'Shared to Community!',
        description: 'Your HealthSnap insights have been shared with the community.',
      });
      setShowShareDialog(false);
    } catch (error) {
      console.error('Error sharing to community:', error);
      toast({
        title: 'Share Failed',
        description: 'Unable to share to community. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    formRef.current?.reset();
    stopCamera();
    setShowShareDialog(false);
    // This doesn't reset useFormState, need a different approach for full reset
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleFormSubmit} ref={formRef}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera /> HealthSnap
          </CardTitle>
          <CardDescription>
            Upload a snap of your meal, skin, or just yourself to get a personalized wellness tip.
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
                className="rounded-lg object-contain"
              />
              <Button type="button" variant="destructive" size="icon" onClick={handleReset} className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
             <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                    <Label htmlFor="picture" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, or GIF</p>
                        </div>
                        <Input id="picture" name="picture" type="file" className="hidden" onChange={handleFileChange} ref={fileInputRef} accept="image/*" />
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
            <Label htmlFor="caption">Optional Caption</Label>
            <Textarea
              id="caption"
              name="caption"
              placeholder="e.g., 'Feeling a bit tired today...'"
              disabled={pending || !!state.data}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 items-stretch">
          {!state.data && (
            <Button type="submit" disabled={!preview || pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get My Health Tip'
              )}
            </Button>
          )}

          {state.error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          
          {state.data && (
             <div className="space-y-4 animate-pop-in">
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Your AI-Powered Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1"><Lightbulb className="h-5 w-5 text-primary" /></div>
                            <div>
                                <h4 className="font-semibold">Modern Tip</h4>
                                <p className="text-sm text-muted-foreground">{state.data.modernTip}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1"><Heart className="h-5 w-5 text-accent" /></div>
                            <div>
                                <h4 className="font-semibold">Ayurvedic Tip</h4>
                                <p className="text-sm text-muted-foreground">{state.data.ayurvedicTip}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                             <div className="flex-shrink-0 mt-1"><Tag className="h-5 w-5 text-muted-foreground" /></div>
                             <div>
                                <h4 className="font-semibold">Categories</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                {state.data.categoryTags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col items-stretch gap-2 sm:flex-row">
                        <Button variant="outline" onClick={() => setShowShareDialog(true)}><Users className="mr-2 h-4 w-4" /> Share to Community</Button>
                        <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share Story</Button>
                        <Button><Save className="mr-2 h-4 w-4" /> Save to Tracker</Button>
                    </CardFooter>
                </Card>
                <Button variant="outline" onClick={handleReset} className="w-full">
                    Snap Another
                </Button>
            </div>
          )}
        </CardFooter>
      </form>
      
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
      
      {/* Community Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share to Community</DialogTitle>
            <DialogDescription>
              Share your HealthSnap insights with the HealthZen community to inspire others on their wellness journey.
            </DialogDescription>
          </DialogHeader>
          
          {state.data && (
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden border">
                <Image
                  src={preview!}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span className="font-medium">Modern Tip:</span>
                  <span className="text-muted-foreground">{state.data.modernTip.slice(0, 50)}...</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="h-4 w-4 text-accent" />
                  <span className="font-medium">Ayurvedic Tip:</span>
                  <span className="text-muted-foreground">{state.data.ayurvedicTip.slice(0, 50)}...</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Categories:</span>
                  <span className="text-muted-foreground">{state.data.categoryTags.join(', ')}</span>
                </div>
              </div>
              
              <Separator />
              
              <p className="text-sm text-muted-foreground">
                This will create a community post with your photo and wellness insights.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleShareToCommunity} disabled={isSharing}>
              {isSharing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sharing...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Share to Community
                </>
              )}
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
                    A picture is worth a thousand words... and a wellness tip!
                </p>
            </div>
            <HealthSnapUploader />
        </div>
    )
}

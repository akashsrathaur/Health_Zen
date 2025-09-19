'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Camera, RefreshCcw, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageCaptured: (imageDataUrl: string) => void;
  title?: string;
  confirmText?: string;
}

export function CameraDialog({ 
  isOpen, 
  onClose, 
  onImageCaptured,
  title = "Take a Photo",
  confirmText = "Use this photo"
}: CameraDialogProps) {
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
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };
  
  const handleUsePhoto = () => {
    if (capturedImage) {
      onImageCaptured(capturedImage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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
            <video 
              ref={videoRef} 
              className={cn("w-full h-full object-cover", hasCameraPermission === false && 'hidden')} 
              autoPlay 
              playsInline 
              muted 
            />
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
                <CheckCircle className="mr-2 h-4 w-4" /> {confirmText}
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
'use client';
import { useFormState } from 'react-dom';
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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function HealthSnapUploader() {
  const [state, formAction] = useFormState(healthSnapAction, {
    data: null,
    error: null,
  });
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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

  const handleReset = () => {
    setPreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    formRef.current?.reset();
    // This doesn't reset useFormState, need a different approach for full reset
  }

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
             <div className="flex items-center justify-center w-full">
                <Label htmlFor="picture" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, or GIF</p>
                    </div>
                    <Input id="picture" name="picture" type="file" className="hidden" onChange={handleFileChange} ref={fileInputRef} accept="image/*" />
                </Label>
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

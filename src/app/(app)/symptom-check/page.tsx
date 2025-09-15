'use client';
import { useActionState } from 'react';
import { symptomCheckAction } from '@/actions/symptom-check';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Lightbulb, Heart, Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting advice...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Check Symptoms
        </>
      )}
    </Button>
  );
}

function LoadingState() {
    const { pending } = useFormStatus();
  
    if (!pending) return null;
  
    return (
      <div className="mt-8 space-y-4">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-1/2 rounded-md bg-muted"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-full rounded-md bg-muted"></div>
            <div className="h-4 w-4/5 rounded-md bg-muted"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-1/2 rounded-md bg-muted"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-full rounded-md bg-muted"></div>
            <div className="h-4 w-4/5 rounded-md bg-muted"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

function AdvicePoints({ text }: { text: string }) {
    const points = text.split('\n').map(p => p.trim()).filter(p => p.startsWith('-')).map(p => p.substring(1).trim());
    
    if (points.length === 0 && text) {
        return <p className="text-muted-foreground">{text}</p>
    }
  
    return (
      <ul className="list-none space-y-2 text-muted-foreground">
        {points.map((point, index) => (
          <li key={index} className="flex items-start">
             <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    );
  }

export default function SymptomCheckPage() {
  const [state, formAction] = useActionState(symptomCheckAction, {
    data: null,
    error: null,
    form: { symptoms: '' }
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if(!state.error && state.data){
        // formRef.current?.reset(); // This clears the form on success
    }
  }, [state])

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="text-center mb-8">
        <Bot className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 font-headline text-3xl font-bold tracking-tight">
          Dr. Cure
        </h1>
        <p className="mt-2 text-muted-foreground">
          Describe your symptoms to receive Homeopathy and Ayurvedic advice.
        </p>
      </div>

      <Card>
        <form action={formAction} ref={formRef}>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="symptoms">Your Symptoms</Label>
                <Textarea
                id="symptoms"
                name="symptoms"
                placeholder="e.g., 'I have a headache and feel tired' or use emojis 🤕😴"
                rows={4}
                defaultValue={state.form.symptoms}
                />
            </div>
            {state.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
          {!state.data && <LoadingState />}
        </form>
      </Card>
      
      {state.data && (
        <div className="mt-8 space-y-4 animate-pop-in">
          <Alert>
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              This advice is for informational purposes only and is not a substitute for professional medical advice.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-primary" /> Homeopathy Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdvicePoints text={state.data.homeopathyAdvice} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="text-accent" /> Ayurvedic Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdvicePoints text={state.data.ayurvedicAdvice} />
            </CardContent>
          </Card>

           <Button variant="outline" className="w-full">
            Add to My Streak
          </Button>
        </div>
      )}
    </div>
  );
}

'use client';
import { useFormState, useFormStatus } from 'react-dom';
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

export default function SymptomCheckPage() {
  const [state, formAction] = useFormState(symptomCheckAction, {
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
          AI Symptom Check
        </h1>
        <p className="mt-2 text-muted-foreground">
          Describe your symptoms to receive modern and Ayurvedic advice.
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
        </form>
      </Card>
      
      {useFormStatus().pending && (
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
      )}

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
                <Lightbulb className="text-primary" /> Modern Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{state.data.modernAdvice}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="text-accent" /> Ayurvedic Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{state.data.ayurvedicAdvice}</p>
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

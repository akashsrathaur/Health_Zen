
'use server';

import { healthSnapAISuggestion, type HealthSnapAISuggestionInput, type HealthSnapAISuggestionOutput } from "@/ai/flows/health-snap-ai-suggestion";

type State = {
    data: HealthSnapAISuggestionOutput | null;
    error: string | null;
};

export async function healthSnapAction(
    prevState: State,
    formData: FormData
): Promise<State> {
    const photoDataUri = formData.get('photoDataUri') as string | null;
    const caption = formData.get('caption') as string | null;

    if (!photoDataUri) {
        return { data: null, error: 'No photo provided.' };
    }

    const input: HealthSnapAISuggestionInput = {
        photoDataUri,
        caption: caption || '',
        userId: 'anonymous', // Replace with actual user ID in a real app
    };

    try {
        const result = await healthSnapAISuggestion(input);
        return { data: result, error: null };
    } catch (error) {
        console.error(error);
        return { data: null, error: 'Failed to get AI suggestion. Please try again.' };
    }
}

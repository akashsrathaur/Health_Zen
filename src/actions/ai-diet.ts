'use server';

import { dietPlannerFlow } from '@/ai/flows/diet-planner';

export async function generateDietPlanAction(input: any) {
    try {
        // Invoke the Genkit flow directly
        const result = await dietPlannerFlow(input);
        return result;
    } catch (error) {
        console.error('Error generating diet plan:', error);
        throw new Error('Failed to generate diet plan');
    }
}

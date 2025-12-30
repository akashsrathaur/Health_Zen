import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { gemini15Flash } from '@genkit-ai/googleai';

export const DietPlanSchema = z.object({
    dailyCalories: z.number(),
    macros: z.object({
        protein: z.string(),
        carbs: z.string(),
        fats: z.string(),
    }),
    meals: z.array(z.object({
        type: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack']),
        name: z.string(),
        calories: z.number(),
        protein: z.string(),
        description: z.string(),
        ingredients: z.array(z.string()),
    }))
});

export const dietPlannerFlow = ai.defineFlow(
    {
        name: 'dietPlannerFlow',
        inputSchema: z.object({
            age: z.number(),
            weight: z.number(), // in kg
            height: z.number(), // in cm
            gender: z.string(),
            goal: z.enum(['weight_loss', 'gain_muscle', 'maintain', 'healthy_living']),
            dietaryRestrictions: z.string().optional(),
            cuisinePreferences: z.string().optional(),
            activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
        }),
        outputSchema: DietPlanSchema,
    },
    async (input) => {
        const prompt = `
      Generate a 1-day diet plan for a user with the following stats:
      - Age: ${input.age}
      - Weight: ${input.weight}kg
      - Height: ${input.height}cm
      - Gender: ${input.gender}
      - Goal: ${input.goal}
      - Activity Level: ${input.activityLevel}
      - Dietary Restrictions: ${input.dietaryRestrictions || 'None'}
      - Cuisine Preferences: ${input.cuisinePreferences || 'Varied'}

      The plan must be scientifically accurate for their TDEE and goal.
      Provide specific macros and caloric breakdown.
      Format the output as JSON matching the schema:
      {
        "dailyCalories": number,
        "macros": { "protein": "xg", "carbs": "xg", "fats": "xg" },
        "meals": [
          { "type": "Breakfast", "name": "...", "calories": 0, "protein": "0g", "description": "...", "ingredients": [...] },
          ... and so on for Lunch, Dinner, Snack
        ]
      }
    `;

        const { output } = await ai.generate({
            model: gemini15Flash,
            prompt: prompt,
            output: { schema: DietPlanSchema }
        });

        if (!output) {
            throw new Error("Failed to generate diet plan");
        }

        return output;
    }
);

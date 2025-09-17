
'use server';

import { symptomCheck, type SymptomCheckInput, type SymptomCheckOutput } from "@/ai/flows/symptom-check-with-ai";
import { z } from "zod";

const SymptomCheckActionInputSchema = z.object({
  symptoms: z.string().min(3, "Please describe your symptoms in a bit more detail."),
});

type State = {
  data: SymptomCheckOutput | null;
  error: string | null;
  form: {
    symptoms: string;
  }
}

export async function symptomCheckAction(prevState: State, formData: FormData): Promise<State> {
  if (!process.env.GEMINI_API_KEY) {
    return {
        data: null,
        error: "The GEMINI_API_KEY environment variable is not set. Please add it to your hosting provider's environment variables and redeploy.",
        form: {
            symptoms: formData.get('symptoms')?.toString() ?? ''
        }
    };
  }

  const validatedFields = SymptomCheckActionInputSchema.safeParse({
    symptoms: formData.get('symptoms'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: validatedFields.error.flatten().fieldErrors.symptoms?.[0] ?? "Invalid input.",
      form: {
        symptoms: formData.get('symptoms')?.toString() ?? ''
      }
    };
  }

  try {
    const input: SymptomCheckInput = {
        symptoms: validatedFields.data.symptoms,
    };
    const result = await symptomCheck(input);

    // Standardize bullet points for consistent display
    const formatAdvice = (text: string) => text.replace(/[•*]/g, '-');

    const formattedResult: SymptomCheckOutput = {
      homeopathyAdvice: formatAdvice(result.homeopathyAdvice),
      ayurvedicAdvice: formatAdvice(result.ayurvedicAdvice),
      remedies: formatAdvice(result.remedies),
    }

    return {
      data: formattedResult,
      error: null,
      form: {
        symptoms: validatedFields.data.symptoms
      }
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: "An unexpected error occurred. Please check your API key and try again.",
      form: {
        symptoms: validatedFields.data.symptoms
      }
    };
  }
}


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
    const result = await symptomCheck(validatedFields.data);
    return {
      data: result,
      error: null,
      form: {
        symptoms: validatedFields.data.symptoms
      }
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: "An unexpected error occurred. Please try again.",
      form: {
        symptoms: validatedFields.data.symptoms
      }
    };
  }
}

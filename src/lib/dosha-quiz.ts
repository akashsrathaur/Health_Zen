export type DoshaType = 'Vata' | 'Pitta' | 'Kapha';

export interface QuizOption {
  text: string;
  dosha: DoshaType;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface DoshaScores {
  Vata: number;
  Pitta: number;
  Kapha: number;
}

export interface DoshaResult {
  primary: DoshaType;
  scores: DoshaScores;
  isBalanced: boolean; // true if scores are very close
  description: string;
}

export const doshaQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Your body type is usually:",
    options: [
      { text: "Slim, hard to gain weight", dosha: "Vata" },
      { text: "Medium, muscular build", dosha: "Pitta" },
      { text: "Broad, stocky, gain weight easily", dosha: "Kapha" },
    ],
  },
  {
    id: 2,
    question: "Your skin type is generally:",
    options: [
      { text: "Dry, rough, cool", dosha: "Vata" },
      { text: "Warm, sensitive, acne-prone", dosha: "Pitta" },
      { text: "Oily, thick, smooth", dosha: "Kapha" },
    ],
  },
  {
    id: 3,
    question: "Your digestion pattern is:",
    options: [
      { text: "Irregular, sometimes constipated", dosha: "Vata" },
      { text: "Strong appetite, feel hungry often", dosha: "Pitta" },
      { text: "Slow digestion, feel heavy after meals", dosha: "Kapha" },
    ],
  },
  {
    id: 4,
    question: "Your energy pattern is:",
    options: [
      { text: "Bursts of energy, then exhaustion", dosha: "Vata" },
      { text: "Consistent, strong, but can burn out", dosha: "Pitta" },
      { text: "Stable, calm, but slow-moving", dosha: "Kapha" },
    ],
  },
  {
    id: 5,
    question: "Your sleep pattern is:",
    options: [
      { text: "Light, broken, hard to fall asleep", dosha: "Vata" },
      { text: "Medium, 6-8 hours, moderate quality", dosha: "Pitta" },
      { text: "Deep, long, hard to wake up", dosha: "Kapha" },
    ],
  },
  {
    id: 6,
    question: "Your mental characteristics are:",
    options: [
      { text: "Creative, quick, easily distracted", dosha: "Vata" },
      { text: "Sharp, focused, competitive", dosha: "Pitta" },
      { text: "Calm, steady, loyal", dosha: "Kapha" },
    ],
  },
];

export const doshaDescriptions = {
  Vata: {
    name: "Vata (Air + Ether)",
    characteristics: "Energetic, creative, restless",
    physical: "Dry skin, slim body, irregular digestion",
    mental: "Quick thinking, but distracted easily",
    color: "bg-blue-500",
    bgColor: "#3B82F6", // blue-500
    tips: "Focus on grounding activities, warm foods, and regular routines."
  },
  Pitta: {
    name: "Pitta (Fire + Water)",
    characteristics: "Focused, ambitious, irritable",
    physical: "Sensitive, warm skin, medium build, strong appetite",
    mental: "Sharp, competitive",
    color: "bg-orange-600",
    bgColor: "#EA580C", // orange-600
    tips: "Practice cooling activities, avoid spicy foods, and manage stress."
  },
  Kapha: {
    name: "Kapha (Earth + Water)",
    characteristics: "Calm, loyal, patient",
    physical: "Oily skin, broad/stocky body, slow metabolism",
    mental: "Steady, slow to anger",
    color: "bg-green-500",
    bgColor: "#22C55E", // green-500
    tips: "Engage in energizing activities, light foods, and regular exercise."
  }
};

export function calculateDoshaResult(answers: DoshaType[]): DoshaResult {
  const scores: DoshaScores = {
    Vata: 0,
    Pitta: 0,
    Kapha: 0,
  };

  // Count answers for each dosha
  answers.forEach(answer => {
    scores[answer]++;
  });

  // Find the highest scoring dosha(s)
  const maxScore = Math.max(scores.Vata, scores.Pitta, scores.Kapha);
  const primaryDoshas = (Object.keys(scores) as DoshaType[]).filter(
    dosha => scores[dosha] === maxScore
  );

  // Determine if balanced (scores within 1 point of each other)
  const minScore = Math.min(scores.Vata, scores.Pitta, scores.Kapha);
  const isBalanced = (maxScore - minScore) <= 1;

  // Get primary dosha (first one if tied)
  const primary = primaryDoshas[0];

  // Generate description
  const description = isBalanced 
    ? "You have a balanced constitution with traits from multiple doshas. This is actually quite harmonious!"
    : `You are primarily ${primary} dosha. ${doshaDescriptions[primary].tips}`;

  return {
    primary,
    scores,
    isBalanced,
    description,
  };
}
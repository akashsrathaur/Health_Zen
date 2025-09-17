
import {
  Flame,
  Droplets,
  Bed,
  HeartPulse,
  Bot,
  Leaf,
  Users,
  BarChart,
  ShieldCheck,
  Brain,
  Smile,
  Zap,
  Dumbbell,
  BookOpen,
  Target,
  Pill,
  Activity,
  Footprints,
  Salad,
  GlassWater,
  Sunrise,
  Sprout,
  HeartHandshake,
  BrainCircuit,
  Bookmark,
  UserPlus,
  ThumbsUp,
  Award,
  Trophy,
  Medal,
  Star,
  Map,
  ShieldPlus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const allVibeIcons = {
    Activity,
    Footprints,
    Salad,
    GlassWater,
    Sunrise,
    Flame,
    Droplets,
    Bed,
    HeartPulse,
    Bot,
    Leaf,
    Users,
    BarChart,
    ShieldCheck,
    Brain,
    Smile,
    Zap,
    Dumbbell,
    BookOpen,
    Target,
    Pill
};

export const quickActions = [
  {
    title: 'HealthSnap',
    description: 'Snap a pic, get a tip',
    href: '/health-snap',
    icon: HeartPulse,
  },
  {
    title: 'Symptom Check',
    description: 'AI-powered advice',
    href: '/symptom-check',
    icon: Bot,
  },
  {
    title: 'Remedies',
    description: 'Explore wellness tips',
    href: '/remedies',
    icon: Leaf,
  },
  {
    title: 'Community',
    description: 'Share your journey',
    href: '/community',
    icon: Users,
  },
  {
    title: 'Tracker',
    description: 'Monitor your progress',
    href: '/progress-tracker',
    icon: BarChart,
  },
  {
    title: 'Challenges',
    description: 'Start a new habit',
    href: '/challenges',
    icon: Target,
  },
];

export const initialDailyVibes: DailyVibe[] = [
  {
    id: 'water',
    title: 'Water Intake',
    value: '0/8 glasses',
    icon: Droplets,
    progress: 0,
  },
  {
    id: 'sleep',
    title: 'Sleep',
    value: '0h',
    icon: Bed,
    progress: 0,
  },
  {
    id: 'medication',
    title: 'Medication',
    value: 'Pending',
    icon: Pill,
    progress: 0,
  },
  {
    id: 'streak',
    title: 'Streak',
    value: '0 days',
    icon: Flame,
  },
];

export const remedyCategories = [
  { id: 'immunity', name: 'Immunity' },
  { id: 'digestion', name: 'Digestion' },
  { id: 'stress', name: 'Stress' },
  { id: 'sleep', name: 'Sleep' },
  { id: 'skin', name: 'Skin' },
];

export const remedies = [
  {
    id: 'turmeric-milk',
    title: 'Golden Turmeric Milk',
    category: 'immunity',
    imageUrl: 'https://picsum.photos/seed/remedy1/600/400',
    imageHint: 'turmeric milk',
    benefits: 'Anti-inflammatory, boosts immunity.',
    ingredients: ['1 cup milk (any kind)', '1 tsp turmeric', 'Pinch of black pepper', 'Honey to taste'],
    steps: [
      'Warm the milk in a small saucepan.',
      'Whisk in turmeric and black pepper.',
      'Simmer for 5 minutes.',
      'Sweeten with honey and serve warm.',
    ],
  },
  {
    id: 'ginger-tea',
    title: 'Soothing Ginger Tea',
    category: 'digestion',
    imageUrl: 'https://picsum.photos/seed/remedy2/600/400',
    imageHint: 'ginger tea',
    benefits: 'Aids digestion, reduces nausea.',
    ingredients: ['1 inch ginger, sliced', '1 cup hot water', '1 tsp lemon juice', 'Honey to taste'],
    steps: [
      'Steep sliced ginger in hot water for 10 minutes.',
      'Strain the tea.',
      'Stir in lemon juice and honey.',
      'Enjoy this calming beverage.',
    ],
  },
  {
    id: 'ashwagandha-latte',
    title: 'Calming Ashwagandha Latte',
    category: 'stress',
    imageUrl: 'https://picsum.photos/seed/remedy3/600/400',
    imageHint: 'ashwagandha root',
    benefits: 'Reduces stress and anxiety.',
    ingredients: ['1 cup milk', '1/2 tsp ashwagandha powder', '1/4 tsp cinnamon', '1 tsp maple syrup'],
    steps: [
      'Gently heat milk in a saucepan.',
      'Whisk in ashwagandha and cinnamon.',
      'Once warm, pour into a mug and stir in maple syrup.',
      'Perfect for a relaxing evening.',
    ],
  },
  {
    id: 'chamomile-infusion',
    title: 'Peaceful Chamomile Infusion',
    category: 'sleep',
    imageUrl: 'https://picsum.photos/seed/remedy5/600/400',
    imageHint: 'chamomile tea',
    benefits: 'Promotes sleep and relaxation.',
    ingredients: ['1 tbsp dried chamomile flowers', '1 cup boiling water', 'Honey (optional)'],
    steps: [
      'Place chamomile flowers in a teapot or mug.',
      'Pour boiling water over the flowers.',
      'Let it steep for 5-7 minutes.',
      'Strain and sweeten if desired.',
    ],
  },
  {
    id: 'aloe-vera-gel',
    title: 'Cooling Aloe Vera Gel',
    category: 'skin',
    imageUrl: 'https://picsum.photos/seed/remedy4/600/400',
    imageHint: 'aloe vera',
    benefits: 'Soothes sunburn and skin irritation.',
    ingredients: ['1 large aloe vera leaf'],
    steps: [
      'Cut a leaf from an aloe vera plant.',
      'Slice it open and scoop out the gel.',
      'Apply the fresh gel directly to the affected skin area.',
      'Store any extra gel in the refrigerator.',
    ],
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    user: {
      name: 'Community Member',
      avatarUrl: 'https://picsum.photos/seed/avatar2/100/100',
    },
    timestamp: '2h ago',
    content: 'Started my day with some sunrise yoga! Feeling so energized and ready to take on the day. What are your favorite morning rituals? ☀️',
    imageUrl: 'https://picsum.photos/seed/comm1/800/600',
    imageHint: 'yoga sunrise',
    reactions: { '💪': 25, '🔥': 18, '🌿': 12 },
  },
  {
    id: 'post-2',
    user: {
      name: 'Wellness Guru',
      avatarUrl: 'https://picsum.photos/seed/avatar3/100/100',
    },
    timestamp: '5h ago',
    content: 'My go-to lunch for a productivity boost! A colorful salad packed with nutrients. Healthy eating doesn\'t have to be boring. #healthyeating #wellness',
    imageUrl: 'https://picsum.photos/seed/comm2/800/600',
    imageHint: 'salad bowl',
    reactions: { '🌿': 42, '👍': 30 },
  },
  {
    id: 'post-3',
    user: {
      name: 'Zen Master',
      avatarUrl: 'https://picsum.photos/seed/avatar4/100/100',
    },
    timestamp: '1d ago',
    content: 'Found the perfect spot to meditate today. Taking even 10 minutes to connect with nature and quiet the mind makes a huge difference.',
    imageUrl: 'https://picsum.photos/seed/comm3/800/600',
    imageHint: 'meditation nature',
    reactions: { '🧘': 55, '❤️': 40, '🌿': 25 },
  },
];

export const progressData = {
  streak: 12,
  water: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [6, 7, 8, 6, 7, 8, 5],
    goal: 8,
  },
  sleep: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [7, 6.5, 8, 7.5, 6, 8.5, 7],
    goal: 8,
  },
};

const allAchievements: Omit<Achievement, 'unlocked'>[] = [
    { id: 'first-snap', name: 'First Snap', icon: HeartPulse, description: "Use the HealthSnap feature for the first time.", condition: (progress) => progress.completedTasks >= 1, },
    { id: 'streak-1', name: '1-Day Streak', icon: Star, description: "Complete your daily tasks for 1 day in a row.", condition: (progress) => progress.streak >= 1, },
    { id: 'streak-3', name: '3-Day Streak', icon: Medal, description: "Keep the momentum going for 3 consecutive days.", condition: (progress) => progress.streak >= 3, },
    { id: 'streak-7', name: '7-Day Streak', icon: Award, description: "You've made it a full week! That's commitment.", condition: (progress) => progress.streak >= 7, },
    { id: 'streak-15', name: '15-Day Streak', icon: Flame, description: "You're on fire! Half a month of consistency.", condition: (progress) => progress.streak >= 15, },
    { id: 'streak-30', name: '30-Day Streak', icon: Trophy, description: "A full month of healthy habits. Incredible!", condition: (progress) => progress.streak >= 30, },
];

// This function calculates which achievements are unlocked based on user progress.
export const getAchievements = (progress: { streak: number, completedTasks: number }): Achievement[] => {
    return allAchievements.map(ach => ({
        ...ach,
        unlocked: ach.condition(progress),
    }));
};


export const initialChallenges: Challenge[] = [
    {
      id: 'challenge-1',
      title: '7-Day Meditation',
      description: 'Commit to 7 days of mindfulness meditation for at least 10 minutes a day.',
      icon: Brain,
      currentDay: 0,
      goalDays: 7,
      imageUrl: 'https://picsum.photos/seed/challenge1/800/600',
      imageHint: 'meditation calm',
      isCompletedToday: false,
    },
    {
      id: 'challenge-2',
      title: '30-Day Yoga Journey',
      description: 'Practice yoga every day for 30 days to improve flexibility and reduce stress.',
      icon: Dumbbell,
      currentDay: 0,
      goalDays: 30,
      imageUrl: 'https://picsum.photos/seed/challenge2/800/600',
      imageHint: 'yoga pose',
      isCompletedToday: false,
    },
    {
      id: 'challenge-3',
      title: 'Hydration Challenge',
      description: 'Drink 8 glasses of water every day for 21 days for better skin and energy.',
      icon: Droplets,
      currentDay: 0,
      goalDays: 21,
      imageUrl: 'https://picsum.photos/seed/challenge3/800/600',
      imageHint: 'glass water',
      isCompletedToday: false,
    },
];

export type CommunityPost = {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  reactions: { [key: string]: number };
};

export type Achievement = {
  id: string;
  name: string;
  icon: LucideIcon;
  unlocked: boolean;
  description: string;
  condition: (progress: { streak: number; completedTasks: number }) => boolean;
};

export type Remedy = (typeof remedies)[0];
export type Challenge = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  currentDay: number;
  goalDays: number;
  imageUrl: string;
  imageHint: string;
  isCompletedToday: boolean;
  isCustom?: boolean;
};

export type DailyVibe = {
    id: string;
    title: string;
    value: string;
    icon: LucideIcon | keyof typeof allVibeIcons;
    progress?: number;
    isCustom?: boolean;
    completedAt?: string;
};

    
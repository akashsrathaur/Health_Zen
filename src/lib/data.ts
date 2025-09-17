
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
    title: 'Dr. Cure',
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
    value: '4/8 glasses',
    icon: Droplets,
    progress: 50,
  },
  {
    id: 'sleep',
    title: 'Sleep',
    value: '7.5h',
    icon: Bed,
    progress: 94,
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

export const achievements: Achievement[] = [
  { id: 'streak-1', name: '1-Day Streak', icon: Star, unlocked: true, description: "Complete your daily tasks for 1 day in a row." },
  { id: 'streak-3', name: '3-Day Streak', icon: Medal, unlocked: true, description: "Keep the momentum going for 3 consecutive days." },
  { id: 'streak-7', name: '7-Day Streak', icon: Award, unlocked: true, description: "You've made it a full week! That's commitment." },
  { id: 'streak-15', name: '15-Day Streak', icon: Flame, unlocked: false, description: "You're on fire! Half a month of consistency." },
  { id: 'streak-30', name: '30-Day Streak', icon: Trophy, unlocked: false, description: "A full month of healthy habits. Incredible!" },
  { id: 'streak-75', name: '75-Day Hard', icon: ShieldCheck, unlocked: false, description: "You have the discipline of a warrior. Keep pushing." },
  { id: 'streak-100', name: '100-Day Club', icon: Zap, unlocked: false, description: "Triple digits! You are a true wellness champion." },
  { id: 'streak-150', name: '150-Day Milestone', icon: Flame, unlocked: false, description: "150 days of dedication. You are an inspiration." },
  { id: 'streak-225', name: '225-Day Legend', icon: Flame, unlocked: false, description: "Your consistency is legendary. Keep shining." },
  { id: 'streak-365', name: '365-Day Master', icon: Trophy, unlocked: false, description: "A full year of wellness! You've mastered the art of self-care." },
  { id: 'first-snap', name: 'First Snap', icon: HeartPulse, unlocked: true, description: "Use the HealthSnap feature for the first time." },
  { id: 'remedy-master', name: 'Remedy Master', icon: Leaf, unlocked: true, description: "Explore and save 5 remedies from the library." },
  { id: 'community-star', name: 'Community Star', icon: Users, unlocked: true, description: "Make your first post in the community feed." },
  { id: 'hydration-hero', name: 'Hydration Hero', icon: Droplets, unlocked: true, description: "Log your water intake for 3 consecutive days." },
  { id: 'sleep-champ', name: 'Sleep Champion', icon: Bed, unlocked: false, description: "Achieve your sleep goal for 7 consecutive nights." },
  { id: 'ayurveda-apprentice', name: 'Ayurveda Apprentice', icon: BookOpen, unlocked: false, description: 'Log 5 different Ayurvedic remedies within a month.' },
  { id: 'wellness-voyager', name: 'Wellness Voyager', icon: Map, unlocked: false, description: 'Complete 3 "Symptom Check" journeys successfully.' },
  { id: 'green-thumb', name: 'Green Thumb', icon: Sprout, unlocked: false, description: 'Identify 10 different plants or herbs using "HealthSnap".' },
  { id: 'social-healer', name: 'Social Healer', icon: HeartHandshake, unlocked: false, description: 'Get 25 emoji reactions on your shared posts.' },
  { id: 'mindful-master', name: 'Mindful Master', icon: BrainCircuit, unlocked: false, description: 'Log 7 consecutive days of a "Mindful Moment".' },
  { id: 'workout-warrior', name: 'Workout Warrior', icon: Dumbbell, unlocked: false, description: 'Log 10 gym sessions or workouts within a 15-day period.' },
  { id: 'homeopathy-herald', name: 'Homeopathy Herald', icon: ShieldPlus, unlocked: false, description: 'Follow a homeopathic remedy for 3 days.' },
  { id: 'recipe-explorer', name: 'Recipe Explorer', icon: Bookmark, unlocked: false, description: 'Save 5 different healthy recipes or remedies.' },
  { id: 'connect-conquer', name: 'Connect & Conquer', icon: UserPlus, unlocked: false, description: 'Add 5 new friends and view 10 of their stories.' },
  { id: 'feedback-fanatic', name: 'Feedback Fanatic', icon: ThumbsUp, unlocked: false, description: 'Provide feedback or upvote 15 community posts.' },
];

export const initialChallenges: Challenge[] = [
    {
      id: 'challenge-1',
      title: '7-Day Meditation',
      description: 'Commit to 7 days of mindfulness meditation for at least 10 minutes a day.',
      icon: Brain,
      currentDay: 3,
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
      currentDay: 12,
      goalDays: 30,
      imageUrl: 'https://picsum.photos/seed/challenge2/800/600',
      imageHint: 'yoga pose',
      isCompletedToday: true,
    },
    {
      id: 'challenge-3',
      title: 'Hydration Challenge',
      description: 'Drink 8 glasses of water every day for 21 days for better skin and energy.',
      icon: Droplets,
      currentDay: 18,
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

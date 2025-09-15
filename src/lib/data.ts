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
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const userData = {
  name: 'Akash Rathaur',
  age: 20,
  avatarUrl: 'https://picsum.photos/seed/avatar1/100/100',
  streak: 12,
  level: 5,
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
];

export const dailyVibes = [
  {
    title: 'Water Intake',
    value: '4/8 glasses',
    icon: Droplets,
    progress: 50,
  },
  {
    title: 'Sleep',
    value: '7h 30m',
    icon: Bed,
    progress: 94,
  },
  {
    title: 'Streak',
    value: '12 days',
    icon: Flame,
    progress: 100,
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

export const communityPosts = [
  {
    id: 'post-1',
    user: {
      name: 'Akash Singh Rathaur',
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
      name: 'Saumyaa SHree',
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
      name: 'Jaanvi',
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

export const achievements = [
  { id: 'streak-7', name: '7-Day Streak', icon: Flame, unlocked: true },
  { id: 'first-snap', name: 'First Snap', icon: HeartPulse, unlocked: true },
  { id: 'remedy-master', name: 'Remedy Master', icon: Leaf, unlocked: true },
  { id: 'community-star', name: 'Community Star', icon: Users, unlocked: true },
  { id: 'hydration-hero', name: 'Hydration Hero', icon: Droplets, unlocked: true },
  { id: 'sleep-champ', name: 'Sleep Champion', icon: Bed, unlocked: false },
  { id: 'mindful-moment', name: 'Mindful Moment', icon: Brain, unlocked: false },
  { id: 'immunity-boost', name: 'Immunity Boost', icon: ShieldCheck, unlocked: false },
  { id: 'happy-gut', name: 'Happy Gut', icon: Smile, unlocked: false },
  { id: 'energy-surge', name: 'Energy Surge', icon: Zap, unlocked: false },
];

export type Achievement = (typeof achievements)[0];
export type Remedy = (typeof remedies)[0];

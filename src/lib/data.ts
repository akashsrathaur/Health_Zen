
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

// Avatar options moved to src/lib/avatars.ts for better organization

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
    description: 'AI-powered diagnosis',
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
    icon: 'Droplets',
    progress: 0,
  },
  {
    id: 'sleep',
    title: 'Sleep',
    value: '0h',
    icon: 'Bed',
    progress: 0,
  },
  {
    id: 'gym',
    title: 'Gym Workout',
    value: '0/20 minutes',
    icon: 'Dumbbell' as const,
    progress: 0,
  },
  {
    id: 'streak',
    title: 'Streak',
    value: '0 days',
    icon: 'Flame',
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
      uid: 'akash-001',
      name: 'Akash',
      avatarUrl: 'https://picsum.photos/seed/akash/100/100',
    },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    content: '🌅 Started my day with sunrise yoga! There\'s something magical about connecting with your body as the sun rises. 30 minutes of flow and I\'m ready to conquer anything today! Who else loves morning yoga? #morningyoga #wellness #mindfulness',
    imageUrl: 'https://picsum.photos/seed/yoga-sunrise/800/600',
    imageHint: 'yoga sunrise peaceful',
    reactions: { '🔥': 45, '💪': 32, '🧘': 28, '❤️': 15 },
    userReactions: {},
    comments: [
      {
        id: 'comment-1',
        user: {
          uid: 'saumyaa-002',
          name: 'Saumyaa',
          avatarUrl: 'https://picsum.photos/seed/saumyaa/100/100'
        },
        content: 'This is so inspiring! I usually do evening yoga but maybe I should try morning sessions too 🌅',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ],
  },
  {
    id: 'post-2',
    user: {
      uid: 'saumyaa-002',
      name: 'Saumyaa',
      avatarUrl: 'https://picsum.photos/seed/saumyaa/100/100',
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    content: '🥗 Meal prep Sunday is here! Spent the afternoon preparing colorful Buddha bowls for the week. Quinoa, roasted veggies, chickpeas, and tahini dressing. Eating healthy doesn\'t have to be boring when you make it colorful! #mealprep #healthyfood #nutrition',
    imageUrl: 'https://picsum.photos/seed/buddha-bowl/800/600',
    imageHint: 'colorful healthy meal prep bowls',
    reactions: { '🌿': 52, '😍': 38, '👏': 25, '💚': 18 },
    userReactions: {},
    comments: [
      {
        id: 'comment-2',
        user: {
          uid: 'jaanvi-003',
          name: 'Jaanvi',
          avatarUrl: 'https://picsum.photos/seed/jaanvi/100/100'
        },
        content: 'These look amazing! Can you share the tahini dressing recipe? 🤤',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString()
      }
    ],
  },
  {
    id: 'post-3',
    user: {
      uid: 'jaanvi-003',
      name: 'Jaanvi',
      avatarUrl: 'https://picsum.photos/seed/jaanvi/100/100',
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    content: '🏃‍♀️ Just completed my first 10K run! Six months ago I could barely run 1K without stopping. Consistency is everything. Small steps every day lead to big achievements. To anyone starting their fitness journey - you\'ve got this! 💪 #10k #running #progress #nevergiveup',
    imageUrl: 'https://picsum.photos/seed/running-finish/800/600',
    imageHint: 'running achievement fitness milestone',
    reactions: { '🔥': 67, '💪': 58, '👏': 45, '🏃‍♀️': 32 },
    userReactions: {},
    comments: [
      {
        id: 'comment-3',
        user: {
          uid: 'deepanjana-004',
          name: 'Deepanjana',
          avatarUrl: 'https://picsum.photos/seed/deepanjana/100/100'
        },
        content: 'Wow! That\'s incredible progress! You\'re such an inspiration 🌟',
        timestamp: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-4',
        user: {
          uid: 'sarthak-005',
          name: 'Sarthak',
          avatarUrl: 'https://picsum.photos/seed/sarthak/100/100'
        },
        content: 'Amazing! What training plan did you follow? I\'m currently at the 3K mark 🏃‍♂️',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ],
  },
  {
    id: 'post-4',
    user: {
      uid: 'deepanjana-004',
      name: 'Deepanjana',
      avatarUrl: 'https://picsum.photos/seed/deepanjana/100/100',
    },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    content: '🧘‍♀️ Found my zen today with a 30-minute meditation session in the park. Sometimes we get so caught up in the hustle that we forget to pause and breathe. Mindfulness isn\'t just sitting in silence - it\'s about being present in every moment. How do you practice mindfulness? #meditation #mindfulness #innerpeace #wellness',
    imageUrl: 'https://picsum.photos/seed/meditation-park/800/600',
    imageHint: 'peaceful meditation in nature',
    reactions: { '🧘': 41, '❤️': 33, '🌿': 27, '✨': 19 },
    userReactions: {},
    comments: [],
  },
  {
    id: 'post-5',
    user: {
      uid: 'sarthak-005',
      name: 'Sarthak',
      avatarUrl: 'https://picsum.photos/seed/sarthak/100/100',
    },
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    content: '💪 Leg day = best day! Just finished an intense lower body workout. Squats, deadlifts, lunges - my legs are jelly but my spirit is strong! Remember, the only workout you regret is the one you didn\'t do. What\'s your favorite muscle group to train? #legday #strength #fitness #workout',
    imageUrl: 'https://picsum.photos/seed/gym-workout/800/600',
    imageHint: 'intense gym workout session',
    reactions: { '💪': 54, '🔥': 42, '😤': 31, '👏': 28 },
    userReactions: {},
    comments: [
      {
        id: 'comment-5',
        user: {
          uid: 'divyansh-006',
          name: 'Divyansh',
          avatarUrl: 'https://picsum.photos/seed/divyansh/100/100'
        },
        content: 'Leg day is brutal but so rewarding! What\'s your squat PR? 🏋️‍♂️',
        timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString()
      }
    ],
  },
  {
    id: 'post-6',
    user: {
      uid: 'divyansh-006',
      name: 'Divyansh',
      avatarUrl: 'https://picsum.photos/seed/divyansh/100/100',
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    content: '🌱 Week 3 of my plant-based journey and I\'m feeling incredible! More energy, better sleep, clearer skin. Made this amazing lentil curry with fresh turmeric and ginger. Nature really provides everything we need for optimal health. Anyone else on a plant-based path? #plantbased #wholefood #vegan #healthyeating #naturalhealing',
    imageUrl: 'https://picsum.photos/seed/plant-based-meal/800/600',
    imageHint: 'colorful plant based healthy meal',
    reactions: { '🌱': 48, '🌿': 35, '😍': 29, '💚': 22 },
    userReactions: {},
    comments: [
      {
        id: 'comment-6',
        user: {
          uid: 'akash-001',
          name: 'Akash',
          avatarUrl: 'https://picsum.photos/seed/akash/100/100'
        },
        content: 'That curry looks delicious! I\'ve been thinking about reducing meat in my diet. Any beginner tips?',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-7',
        user: {
          uid: 'saumyaa-002',
          name: 'Saumyaa',
          avatarUrl: 'https://picsum.photos/seed/saumyaa/100/100'
        },
        content: 'Love seeing this transformation! Plant-based eating has changed my life too 🌱✨',
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
      }
    ],
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
    { id: 'first-snap', name: 'First Snap', icon: 'HeartPulse', description: "Use the HealthSnap feature for the first time.", condition: (progress) => progress.completedTasks >= 1, },
    { id: 'streak-1', name: '1-Day Streak', icon: 'Star', description: "Complete your daily tasks for 1 day in a row.", condition: (progress) => progress.streak >= 1, },
    { id: 'streak-3', name: '3-Day Streak', icon: 'Medal', description: "Keep the momentum going for 3 consecutive days.", condition: (progress) => progress.streak >= 3, },
    { id: 'streak-7', name: '7-Day Streak', icon: 'Award', description: "You've made it a full week! That's commitment.", condition: (progress) => progress.streak >= 7, },
    { id: 'streak-15', name: '15-Day Streak', icon: 'Flame', description: "You're on fire! Half a month of consistency.", condition: (progress) => progress.streak >= 15, },
    { id: 'streak-30', name: '30-Day Streak', icon: 'Trophy', description: "A full month of healthy habits. Incredible!", condition: (progress) => progress.streak >= 30, },
];

// This function calculates which achievements are unlocked based on user progress.
export const getAchievements = (progress: { streak: number, completedTasks: number }): Achievement[] => {
    return allAchievements.map(ach => ({
        ...ach,
        unlocked: ach.condition(progress),
    }));
};


export const publicChallenges: PublicChallenge[] = [
    {
      id: 'public-challenge-1',
      title: '7-Day Mindfulness Meditation',
      description: 'Join thousands in practicing mindfulness meditation for 10 minutes daily to reduce stress and improve focus.',
      icon: 'Brain',
      goalDays: 7,
      imageUrl: 'https://picsum.photos/seed/meditation-public/800/600',
      imageHint: 'meditation calm peaceful',
      createdBy: {
        uid: 'wellness-master-1',
        name: 'HealthZen Team',
        streak: 365
      },
      createdAt: new Date('2024-01-01').toISOString(),
      participantCount: 12840,
      category: 'mindfulness',
      isPublic: true
    },
    {
      id: 'public-challenge-2',
      title: '30-Day Yoga Transformation',
      description: 'Transform your body and mind with daily yoga practice. Perfect for all skill levels!',
      icon: 'Dumbbell',
      goalDays: 30,
      imageUrl: 'https://picsum.photos/seed/yoga-public/800/600',
      imageHint: 'yoga pose flexibility',
      createdBy: {
        uid: 'yoga-instructor-1',
        name: 'Maya Wellness',
        streak: 180
      },
      createdAt: new Date('2024-02-01').toISOString(),
      participantCount: 8965,
      category: 'fitness',
      isPublic: true
    },
    {
      id: 'public-challenge-3',
      title: 'Ultimate Hydration Challenge',
      description: 'Achieve glowing skin and boost energy with proper hydration. 8 glasses daily for 21 days!',
      icon: 'Droplets',
      goalDays: 21,
      imageUrl: 'https://picsum.photos/seed/hydration-public/800/600',
      imageHint: 'water glass hydration',
      createdBy: {
        uid: 'nutrition-expert-1',
        name: 'Dr. Sarah Chen',
        streak: 95
      },
      createdAt: new Date('2024-02-15').toISOString(),
      participantCount: 15230,
      category: 'wellness',
      isPublic: true
    },
    {
      id: 'public-challenge-4',
      title: '14-Day Digital Detox',
      description: 'Reclaim your life from screens. Limit social media and focus on real connections.',
      icon: 'Brain',
      goalDays: 14,
      imageUrl: 'https://picsum.photos/seed/digital-detox/800/600',
      imageHint: 'peaceful no phone nature',
      createdBy: {
        uid: 'mindfulness-coach-1',
        name: 'Alex Mindful',
        streak: 45
      },
      createdAt: new Date('2024-03-01').toISOString(),
      participantCount: 7824,
      category: 'mindfulness',
      isPublic: true
    },
    {
      id: 'public-challenge-5',
      title: '21-Day Plant-Based Power',
      description: 'Discover the energy of plant-based eating. Boost health while helping the planet!',
      icon: 'Leaf',
      goalDays: 21,
      imageUrl: 'https://picsum.photos/seed/plant-based/800/600',
      imageHint: 'healthy vegetables plant food',
      createdBy: {
        uid: 'nutrition-coach-1',
        name: 'Green Health Co',
        streak: 120
      },
      createdAt: new Date('2024-03-10').toISOString(),
      participantCount: 6543,
      category: 'nutrition',
      isPublic: true
    },
    {
      id: 'public-challenge-6',
      title: '10,000 Steps Daily',
      description: 'Walk your way to better health! Achieve 10,000 steps every day for 30 days.',
      icon: 'Footprints',
      goalDays: 30,
      imageUrl: 'https://picsum.photos/seed/walking-steps/800/600',
      imageHint: 'walking steps outdoor fitness',
      createdBy: {
        uid: 'fitness-walker-1',
        name: 'Step Master John',
        streak: 78
      },
      createdAt: new Date('2024-03-15').toISOString(),
      participantCount: 11456,
      category: 'fitness',
      isPublic: true
    }
];

// Legacy export for backward compatibility
export const initialChallenges: Challenge[] = [];

export type CommunityPost = {
  id: string;
  user: {
    uid: string;
    name: string;
    avatarUrl: string;
  };
  timestamp: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  reactions: { [key: string]: number };
  userReactions: { [userId: string]: string }; // userId -> emoji
  comments: PostComment[];
};

export type PostComment = {
  id: string;
  user: {
    uid: string;
    name: string;
    avatarUrl: string;
  };
  content: string;
  timestamp: string;
};

export type Achievement = {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  description: string;
  condition: (progress: { streak: number; completedTasks: number }) => boolean;
};

export type Remedy = (typeof remedies)[0];
export type PublicChallenge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  goalDays: number;
  imageUrl: string;
  imageHint: string;
  createdBy: {
    uid: string;
    name: string;
    streak: number;
  };
  createdAt: string;
  participantCount: number;
  category: 'fitness' | 'wellness' | 'mindfulness' | 'nutrition' | 'lifestyle';
  isPublic: true;
};

export type UserChallenge = {
  id: string;
  challengeId: string; // References PublicChallenge.id
  title: string;
  description: string;
  icon: string;
  currentDay: number;
  goalDays: number;
  imageUrl: string;
  imageHint: string;
  isCompletedToday: boolean;
  joinedAt: string;
  category: 'fitness' | 'wellness' | 'mindfulness' | 'nutrition' | 'lifestyle';
};

// Legacy type for backward compatibility
export type Challenge = {
  id: string;
  challengeId?: string; // References PublicChallenge.id for joined public challenges
  title: string;
  description: string;
  icon: string;
  currentDay: number;
  goalDays: number;
  imageUrl: string;
  imageHint: string;
  isCompletedToday: boolean;
  joinedAt?: string;
  category?: 'fitness' | 'wellness' | 'mindfulness' | 'nutrition' | 'lifestyle';
  isCustom?: boolean;
  completedDays?: string[];
  totalTasksCompleted?: number;
};

export type DailyVibe = {
    id: string;
    title: string;
    value: string;
    icon: string | keyof typeof allVibeIcons;
    progress?: number;
    isCustom?: boolean;
    completedAt?: string;
    medicationConfig?: {
        dailyDoses: number;
        dosesTaken: number;
        lastDoseTime?: string;
        intervalHours: number;
    };
};

    
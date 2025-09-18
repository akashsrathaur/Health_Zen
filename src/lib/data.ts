
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
    value: '0/60 minutes',
    icon: 'Dumbbell',
    progress: 0,
  },
  {
    id: 'medication',
    title: 'Medication',
    value: 'Pending',
    icon: 'Pill',
    progress: 0,
    medicationConfig: {
      dailyDoses: 2,
      dosesTaken: 0,
      intervalHours: 4,
    },
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
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=akash-fitness&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=ffd93d&clothingColor=65c9ff&clothingGraphic=skullOutline',
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    content: 'Just completed my 30-day fitness transformation challenge! 💪 The journey wasn\'t easy, but consistency and dedication paid off. Lost 8kg and gained so much confidence. Health Fact: Regular strength training increases your metabolic rate for up to 24 hours post-workout! To anyone starting their fitness journey - you\'ve got this! #FitnessTransformation #HealthyLiving #HealthFacts',
    imageUrl: 'https://picsum.photos/seed/fitness1/800/600',
    imageHint: 'fitness transformation before after',
    reactions: { '💪': 45, '🔥': 32, '❤️': 28, '🙏': 15 },
    userReactions: {},
    comments: [
      {
        id: 'comment-akash-1',
        user: {
          uid: 'saumyaa-002',
          name: 'Saumyaa',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=saumyaa-yoga&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d4edda&clothingColor=721c24&clothingGraphic=skull'
        },
        content: 'Wow Akash! This is so inspiring. What was your workout routine? I\'m just starting my fitness journey.',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
      }
    ],
  },
  {
    id: 'post-2',
    user: {
      uid: 'saumyaa-002',
      name: 'Saumyaa',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=saumyaa-yoga&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d4edda&clothingColor=721c24&clothingGraphic=skull',
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    content: 'Morning yoga session by the lake 🌅 Starting my day with gratitude and mindfulness. This peaceful routine has completely transformed my mental health and energy levels. Wellness Tip: Just 10 minutes of morning yoga can reduce cortisol levels by 23%! Nature truly is the best therapy! #YogaLife #MentalWellness #MorningRituals #WellnessTips',
    imageUrl: 'https://picsum.photos/seed/yoga-lake/800/600',
    imageHint: 'yoga by lake sunrise',
    reactions: { '🧘': 38, '🌿': 25, '❤️': 22, '😊': 18 },
    userReactions: {},
    comments: [],
  },
  {
    id: 'post-3',
    user: {
      uid: 'divyansh-003',
      name: 'Divyansh',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=divyansh-nutrition&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=bae1ff&clothingColor=25262b&clothingGraphic=selena',
    },
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    content: 'Meal prep Sunday! 🥗 Preparing nutritious meals for the entire week. This colorful buddha bowl has quinoa, roasted vegetables, chickpeas, and homemade tahini dressing. Nutrition Fact: Eating a rainbow of colors ensures you get diverse antioxidants and phytonutrients! Meal prep saves 4 hours per week on average. Nutrition doesn\'t have to be boring when you add colors and flavors! #MealPrep #HealthyEating #Nutrition #HealthFacts',
    imageUrl: 'https://picsum.photos/seed/mealprep/800/600',
    imageHint: 'colorful buddha bowl meal prep',
    reactions: { '🌿': 35, '😋': 28, '👍': 24, '🍎': 12 },
    userReactions: {},
    comments: [
      {
        id: 'comment-divyansh-1',
        user: {
          uid: 'jaanvi-005',
          name: 'Jaanvi',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jaanvi-wellness&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=d0f0c0&clothingColor=2d5016&clothingGraphic=pizza'
        },
        content: 'This looks amazing! Can you share the tahini dressing recipe? I\'ve been looking for healthy dressing options.',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
      }
    ],
  },
  {
    id: 'post-4',
    user: {
      uid: 'sarthak-004',
      name: 'Sarthak',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarthak-running&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e2e3e5&clothingColor=0c5460&clothingGraphic=skull',
    },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    content: 'Hit a new personal record today! 🏃‍♂️ Ran my first 10K in under 45 minutes. Six months ago, I couldn\'t even run 1K without stopping. Fitness Tip: The 80/20 rule - 80% of your runs should be at an easy, conversational pace for optimal improvement. The key was gradual progression and never giving up. Every step counts, no matter how small! #Running #PersonalRecord #NeverGiveUp #FitnessTips',
    imageUrl: 'https://picsum.photos/seed/running/800/600',
    imageHint: 'running track sunrise achievement',
    reactions: { '🏃': 42, '💪': 38, '🔥': 31, '🏆': 19 },
    userReactions: {},
    comments: [
      {
        id: 'comment-sarthak-1',
        user: {
          uid: 'akash-001',
          name: 'Akash',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=akash-fitness&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=ffd93d&clothingColor=65c9ff&clothingGraphic=skullOutline'
        },
        content: 'Incredible progress Sarthak! Your dedication is truly inspiring. What training plan did you follow?',
        timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-sarthak-2',
        user: {
          uid: 'deepanjana-006',
          name: 'Deepanjana',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepanjana-holistic&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e8f4fd&clothingColor=0a58ca&clothingGraphic=bear'
        },
        content: 'Congratulations! This motivates me to start my running journey. Any tips for beginners?',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
      }
    ],
  },
  {
    id: 'post-5',
    user: {
      uid: 'jaanvi-005',
      name: 'Jaanvi',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jaanvi-wellness&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=d0f0c0&clothingColor=2d5016&clothingGraphic=pizza',
    },
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    content: 'Self-care Sunday ritual 🛌 Created my own spa day at home - face mask, meditation, journaling, and herbal tea. Mental Health Tip: Regular self-care practices can reduce anxiety by up to 68% and improve sleep quality by 42%. Taking time to recharge and reconnect with yourself is not selfish, it\'s necessary. How do you practice self-care? #SelfCare #MentalHealth #SelfLove #MentalHealthTips',
    imageUrl: 'https://picsum.photos/seed/selfcare/800/600',
    imageHint: 'home spa relaxation self care',
    reactions: { '❤️': 48, '🧘': 35, '🌿': 29, '😌': 22 },
    userReactions: {},
    comments: [
      {
        id: 'comment-jaanvi-1',
        user: {
          uid: 'saumyaa-002',
          name: 'Saumyaa',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=saumyaa-yoga&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d4edda&clothingColor=721c24&clothingGraphic=skull'
        },
        content: 'Love this! I do something similar every Sunday. It\'s amazing how much better we feel after taking care of ourselves.',
        timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString()
      }
    ],
  },
  {
    id: 'post-6',
    user: {
      uid: 'deepanjana-006',
      name: 'Deepanjana',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepanjana-holistic&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e8f4fd&clothingColor=0a58ca&clothingGraphic=bear',
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    content: 'Growth mindset in action! 🌱 Started learning about holistic nutrition and it\'s fascinating how food can be medicine. Currently reading about Ayurvedic principles and how they can complement modern wellness practices. Health Education Tip: Studies show that turmeric (curcumin) has anti-inflammatory properties equivalent to ibuprofen, but without side effects! Never too late to expand your knowledge! #HolisticHealth #LifelongLearning #Ayurveda #HealthEducation',
    imageUrl: 'https://picsum.photos/seed/holistic/800/600',
    imageHint: 'books herbs holistic health learning',
    reactions: { '🌱': 33, '📚': 28, '🌿': 25, '🧘': 20 },
    userReactions: {},
    comments: [
      {
        id: 'comment-deepanjana-1',
        user: {
          uid: 'divyansh-003',
          name: 'Divyansh',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=divyansh-nutrition&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=bae1ff&clothingColor=25262b&clothingGraphic=selena'
        },
        content: 'This is so interesting! I\'ve been exploring the connection between nutrition and mental health. Would love to hear more about what you\'re learning.',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
      }
    ],
  },
  {
    id: 'post-7',
    user: {
      uid: 'divyansh-007',
      name: 'Divyansh',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=divyansh-hydration&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=bae1ff&clothingColor=25262b&clothingGraphic=selena',
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    content: 'Hydration game strong today! 💧 Did you know your brain is 73% water? Even 2% dehydration can affect concentration, memory, and mood. I\'ve been tracking my water intake and the difference in energy levels is incredible! Hydration Hack: Add a pinch of sea salt and lemon to your water for better absorption. Stay hydrated, stay sharp! #Hydration #BrainHealth #WellnessTips #HealthFacts',
    imageUrl: 'https://picsum.photos/seed/hydration/800/600',
    imageHint: 'water bottle fresh fruits hydration',
    reactions: { '💧': 41, '🧠': 28, '😊': 22, '👍': 18 },
    userReactions: {},
    comments: [
      {
        id: 'comment-divyansh-water-1',
        user: {
          uid: 'akash-001',
          name: 'Akash',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=akash-fitness&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=ffd93d&clothingColor=65c9ff&clothingGraphic=skullOutline'
        },
        content: 'Great tip about the sea salt and lemon! I never knew about the brain being 73% water. Thanks for sharing!',
        timestamp: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString()
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


export const initialChallenges: Challenge[] = [
    {
      id: 'challenge-1',
      title: '7-Day Meditation',
      description: 'Commit to 7 days of mindfulness meditation for at least 10 minutes a day.',
      icon: 'Brain',
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
      icon: 'Dumbbell',
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
      icon: 'Droplets',
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
export type Challenge = {
  id: string;
  title: string;
  description: string;
  icon: string;
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

    
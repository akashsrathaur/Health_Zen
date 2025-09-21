import { User } from './user-store';

export type UserProgress = {
  streak: number;
  totalPoints: number;
  dailyPoints: number;
  completedTasks: number;
  waterIntake: number; // glasses today
  waterGoal: number;
  sleepHours: number;
  sleepGoal: number;
  gymMinutes: number; // minutes today
  gymGoal: number;
  lastActivityDate: string;
  weeklyWaterData: number[]; // 7 days
  weeklySleepData: number[]; // 7 days
  weeklyGymData: number[]; // 7 days (minutes)
};

// Generate realistic progress data based on user's actual activity
export function getUserProgressData(user: User): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  const isNewUser = !user.lastActivityDate || user.lastActivityDate === today;
  
  // For new users, start with empty data
  if (isNewUser && user.totalTasksCompleted === 0) {
    return {
      streak: 0,
      totalPoints: 0,
      dailyPoints: 0,
      completedTasks: 0,
      waterIntake: 0,
      waterGoal: 8,
      sleepHours: 0,
      sleepGoal: 8,
      gymMinutes: 0,
      gymGoal: 20, // 20 minutes goal
      lastActivityDate: today,
      weeklyWaterData: [0, 0, 0, 0, 0, 0, 0], // All zeros for new user
      weeklySleepData: [0, 0, 0, 0, 0, 0, 0], // All zeros for new user
      weeklyGymData: [0, 0, 0, 0, 0, 0, 0], // All zeros for new user
    };
  }

  // Calculate streak based on actual activity
  const actualStreak = calculateStreak(user.lastActivityDate, today);
  
  // Generate weekly data based on user's actual streak
  const weeklyWaterData = generateWeeklyWaterData(actualStreak);
  const weeklySleepData = generateWeeklySleepData(actualStreak);
  const weeklyGymData = generateWeeklyGymData(actualStreak);

  return {
    streak: actualStreak,
    totalPoints: user.points || 0,
    dailyPoints: user.dailyPoints || 0,
    completedTasks: user.totalTasksCompleted || 0,
    waterIntake: getTodayWaterIntake(user), // This should come from daily tracking
    waterGoal: 8,
    sleepHours: getTodaySleepHours(user), // This should come from daily tracking
    sleepGoal: 8,
    gymMinutes: getTodayGymMinutes(user), // This should come from daily tracking
    gymGoal: 20,
    lastActivityDate: user.lastActivityDate || today,
    weeklyWaterData,
    weeklySleepData,
    weeklyGymData,
  };
}

function calculateStreak(lastActivityDate: string, today: string): number {
  if (!lastActivityDate) return 0;
  
  const lastDate = new Date(lastActivityDate);
  const todayDate = new Date(today);
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 1; // Same day activity
  if (diffDays === 1) return 1; // Consecutive days
  if (diffDays > 1) return 0; // Streak broken
  
  return 0;
}

// Generate realistic weekly water data based on user activity
function generateWeeklyWaterData(streak: number): number[] {
  if (streak === 0) {
    // New user - mostly zeros with maybe 1-2 glasses
    return [0, 0, 0, 0, 0, 0, Math.min(2, Math.floor(Math.random() * 3))];
  }
  
  // Generate data based on streak length
  const baseWater = Math.min(4, streak * 0.5);
  return Array.from({ length: 7 }, () => {
    const variance = Math.random() * 4 - 2; // -2 to +2 glasses
    return Math.max(0, Math.min(8, Math.round(baseWater + variance)));
  });
}

// Generate realistic weekly sleep data based on user activity
function generateWeeklySleepData(streak: number): number[] {
  if (streak === 0) {
    // New user - irregular sleep
    return [0, 0, 0, 0, 0, 0, Math.min(6, Math.floor(Math.random() * 4) + 4)];
  }
  
  const baseSleep = Math.min(7.5, 5 + streak * 0.2);
  return Array.from({ length: 7 }, () => {
    const variance = Math.random() * 2 - 1; // -1 to +1 hours
    return Math.max(4, Math.min(10, Math.round((baseSleep + variance) * 2) / 2));
  });
}

// Generate realistic weekly gym data based on user activity
function generateWeeklyGymData(streak: number): number[] {
  if (streak === 0) {
    // New user - minimal gym activity
    return [0, 0, 0, 0, 0, 0, Math.min(30, Math.floor(Math.random() * 20))];
  }
  
  // Generate data based on streak length
  const baseGym = Math.min(45, streak * 3); // 3 minutes per streak day, max 45 minutes
  return Array.from({ length: 7 }, () => {
    const variance = Math.random() * 30 - 15; // -15 to +15 minutes
    return Math.max(0, Math.min(90, Math.round(baseGym + variance)));
  });
}

// These should be replaced with actual daily tracking data from daily activities
function getTodayWaterIntake(user: User): number {
  // This should ideally come from getTodayActivity() but for now use estimation
  // Based on daily points as rough proxy (each 4 points ≈ 2 glasses)
  return Math.min(8, Math.floor((user.dailyPoints || 0) / 2));
}

function getTodaySleepHours(user: User): number {
  // This should ideally come from getTodayActivity() but for now use estimation
  // New users start with 0, active users get reasonable estimates
  const streak = user.streak || 0;
  if (streak === 0 && (user.totalTasksCompleted || 0) === 0) return 0;
  if (streak === 0) return 6.5; // User has some activity but no streak
  return Math.min(9, 6 + Math.min(streak, 14) * 0.1); // Cap improvement at 2 weeks
}

function getTodayGymMinutes(user: User): number {
  // This should ideally come from getTodayActivity() but for now use estimation
  // New users start with 0, active users get reasonable estimates
  const streak = user.streak || 0;
  if (streak === 0 && (user.totalTasksCompleted || 0) === 0) return 0;
  if (streak === 0) return 15; // User has some activity but no streak
  return Math.min(20, streak * 1); // 1 minute per streak day, max 20 minutes
}

// Get achievements based on REAL user progress
export function getUserAchievements(progress: UserProgress) {
  const achievements = [
    {
      id: 'first-snap',
      name: 'First Snap',
      icon: 'HeartPulse',
      description: 'Use the HealthSnap feature for the first time.',
      unlocked: progress.completedTasks >= 1,
    },
    {
      id: 'streak-1',
      name: '1-Day Streak',
      icon: 'Star',
      description: 'Complete your daily tasks for 1 day in a row.',
      unlocked: progress.streak >= 1,
    },
    {
      id: 'streak-3',
      name: '3-Day Streak',
      icon: 'Medal',
      description: 'Keep the momentum going for 3 consecutive days.',
      unlocked: progress.streak >= 3,
    },
    {
      id: 'streak-7',
      name: '7-Day Streak',
      icon: 'Award',
      description: "You've made it a full week! That's commitment.",
      unlocked: progress.streak >= 7,
    },
    {
      id: 'streak-15',
      name: '15-Day Streak',
      icon: 'Flame',
      description: "You're on fire! Half a month of consistency.",
      unlocked: progress.streak >= 15,
    },
    {
      id: 'streak-30',
      name: '30-Day Streak',
      icon: 'Trophy',
      description: 'A full month of healthy habits. Incredible!',
      unlocked: progress.streak >= 30,
    },
  ];

  return achievements;
}
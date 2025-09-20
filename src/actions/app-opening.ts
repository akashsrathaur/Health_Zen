'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const USERS_COLLECTION = 'users';

// Helper function to recalculate streak for existing users
async function shouldRecalculateUserStreak(userData: any): Promise<{ recalculate: boolean; calculatedStreak: number }> {
  const today = new Date();
  const accountCreated = userData.createdAt ? new Date(userData.createdAt) : today;
  const daysSinceCreation = Math.floor((today.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceCreation >= 2 && (userData.streak || 0) === 0) {
    const estimatedStreak = Math.min(daysSinceCreation, 7);
    return { recalculate: true, calculatedStreak: estimatedStreak };
  }
  
  return { recalculate: false, calculatedStreak: 0 };
}

export type AppOpeningResult = {
  success: boolean;
  streakUpdated: boolean;
  newStreak: number;
  dailyResetTriggered: boolean;
  error?: string;
};

/**
 * Handle daily app opening - increment streak if it's a new day
 * This should be called when the user opens the app each day
 */
export async function handleDailyAppOpening(userId: string): Promise<AppOpeningResult> {
  try {
    if (!db || !db.app) {
      return {
        success: false,
        streakUpdated: false,
        newStreak: 0,
        dailyResetTriggered: false,
        error: 'Firebase not configured'
      };
    }

    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return {
        success: false,
        streakUpdated: false,
        newStreak: 0,
        dailyResetTriggered: false,
        error: 'User not found'
      };
    }

    const userData = userDoc.data();
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    const lastAppOpenDate = userData.lastAppOpenDate || '';
    const lastActivityDate = userData.lastActivityDate || '';
    const currentStreak = userData.streak || 0;

    // Check if this is the first time opening the app today
    if (lastAppOpenDate === today) {
      // User already opened the app today, no streak update needed
      return {
        success: true,
        streakUpdated: false,
        newStreak: currentStreak,
        dailyResetTriggered: false,
      };
    }

    // This is the first app opening today
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-CA');

    let newStreak = currentStreak;
    let streakUpdated = false;

    // Determine new streak value based on previous app opening pattern
    if (currentStreak === 0 || (lastAppOpenDate === '' && lastActivityDate === '')) {
      // New user or first time opening app - start streak at 1
      newStreak = 1;
      streakUpdated = true;
    } else if (lastAppOpenDate === yesterdayStr || lastActivityDate === yesterdayStr) {
      // User opened app yesterday OR was active yesterday - increment streak
      newStreak = currentStreak + 1;
      streakUpdated = true;
    } else {
      // Check if this is a user who has been away for multiple days but should have a higher streak
      const shouldRecalculateStreak = await shouldRecalculateUserStreak(userData);
      if (shouldRecalculateStreak.recalculate) {
        newStreak = shouldRecalculateStreak.calculatedStreak;
        streakUpdated = true;
      } else {
        // User missed a day - reset streak to 1 (opening today counts as new streak start)
        newStreak = 1;
        streakUpdated = true;
      }
    }

    // Update user document
    const updates: any = {
      lastAppOpenDate: today,
    };

    if (streakUpdated) {
      updates.streak = newStreak;
      updates.lastStreakUpdate = new Date().toISOString();
    }

    // Also update lastActivityDate if this is the first activity of any kind today
    if (lastActivityDate !== today) {
      updates.lastActivityDate = today;
    }

    await updateDoc(userRef, updates);

    // Revalidate relevant paths
    revalidatePath('/dashboard');
    revalidatePath('/progress-tracker');

    return {
      success: true,
      streakUpdated,
      newStreak,
      dailyResetTriggered: false, // Daily reset is handled separately
    };
  } catch (error) {
    console.error('Error handling daily app opening:', error);
    return {
      success: false,
      streakUpdated: false,
      newStreak: 0,
      dailyResetTriggered: false,
      error: 'Failed to handle app opening'
    };
  }
}

/**
 * Check if user needs daily reset and app opening handling
 * This is a convenience function that combines both operations
 */
export async function handleAppInitialization(userId: string): Promise<{
  appOpeningResult: AppOpeningResult;
  resetCheckNeeded: boolean;
}> {
  try {
    // First handle the daily app opening (streak increment)
    const appOpeningResult = await handleDailyAppOpening(userId);
    
    // Check if daily reset might be needed
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return {
        appOpeningResult,
        resetCheckNeeded: false
      };
    }

    const userData = userDoc.data();
    const today = new Date().toLocaleDateString('en-CA');
    const lastResetDate = userData.lastResetDate ? new Date(userData.lastResetDate).toLocaleDateString('en-CA') : '';
    
    const resetCheckNeeded = lastResetDate !== today;

    return {
      appOpeningResult,
      resetCheckNeeded
    };
  } catch (error) {
    console.error('Error during app initialization:', error);
    return {
      appOpeningResult: {
        success: false,
        streakUpdated: false,
        newStreak: 0,
        dailyResetTriggered: false,
        error: 'App initialization failed'
      },
      resetCheckNeeded: false
    };
  }
}
'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const USERS_COLLECTION = 'users';
const MAX_DAILY_POINTS = 30;

export type TaskCompletionResult = {
  success: boolean;
  pointsEarned: number;
  streakUpdated: boolean;
  dailyPointsRemaining: number;
  error?: string;
};

// Complete a task and update points/streak
export async function completeTask(userId: string): Promise<TaskCompletionResult> {
  try {
    if (!db || !db.app) {
      return {
        success: false,
        pointsEarned: 0,
        streakUpdated: false,
        dailyPointsRemaining: 0,
        error: 'Firebase not configured'
      };
    }

    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return {
        success: false,
        pointsEarned: 0,
        streakUpdated: false,
        dailyPointsRemaining: 0,
        error: 'User not found'
      };
    }

    const userData = userDoc.data();
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    const lastActivityDate = userData.lastActivityDate || '';
    const currentDailyPoints = userData.dailyPoints || 0;
    const currentStreak = userData.streak || 0;

    // Check if it's a new day
    const isNewDay = lastActivityDate !== today;
    const canEarnPoints = isNewDay || currentDailyPoints < MAX_DAILY_POINTS;

    if (!canEarnPoints) {
      return {
        success: false,
        pointsEarned: 0,
        streakUpdated: false,
        dailyPointsRemaining: 0,
        error: 'Daily points limit reached'
      };
    }

    // Calculate points and streak
    const pointsEarned = 1;
    let newDailyPoints = isNewDay ? 1 : currentDailyPoints + 1;
    let newStreak = currentStreak;
    let streakUpdated = false;

    // Update streak logic
    if (isNewDay) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
      
      if (lastActivityDate === yesterdayStr) {
        // Consecutive day - increment streak
        newStreak = currentStreak + 1;
        streakUpdated = true;
      } else if (lastActivityDate === '') {
        // First activity ever - start streak
        newStreak = 1;
        streakUpdated = true;
      } else if (lastActivityDate !== yesterdayStr) {
        // Broke streak - reset to 1
        newStreak = 1;
        streakUpdated = true;
      }
    }

    // Update user document
    const updates: any = {
      points: increment(pointsEarned),
      dailyPoints: newDailyPoints,
      lastActivityDate: today,
      totalTasksCompleted: increment(1)
    };

    if (streakUpdated) {
      updates.streak = newStreak;
    }

    await updateDoc(userRef, updates);

    revalidatePath('/dashboard');
    revalidatePath('/progress-tracker');

    return {
      success: true,
      pointsEarned,
      streakUpdated,
      dailyPointsRemaining: MAX_DAILY_POINTS - newDailyPoints,
    };
  } catch (error) {
    console.error('Error completing task:', error);
    return {
      success: false,
      pointsEarned: 0,
      streakUpdated: false,
      dailyPointsRemaining: 0,
      error: 'Failed to update points and streak'
    };
  }
}

// Check if user has any activity today, if not reset streak to 0
export async function checkAndResetStreak(userId: string): Promise<{ success: boolean; streakReset: boolean; error?: string }> {
  try {
    if (!db || !db.app) {
      return { success: false, streakReset: false, error: 'Firebase not configured' };
    }

    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return { success: false, streakReset: false, error: 'User not found' };
    }

    const userData = userDoc.data();
    const today = new Date().toISOString().split('T')[0];
    const lastActivityDate = userData.lastActivityDate || '';
    const currentStreak = userData.streak || 0;

    // If no activity today and streak > 0, reset streak
    if (lastActivityDate !== today && currentStreak > 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // Only reset if they missed yesterday (broke the streak)
      if (lastActivityDate !== yesterdayStr) {
        await updateDoc(userRef, {
          streak: 0
        });
        return { success: true, streakReset: true };
      }
    }

    return { success: true, streakReset: false };
  } catch (error) {
    console.error('Error checking streak:', error);
    return { success: false, streakReset: false, error: 'Failed to check streak' };
  }
}

// Reset daily points (called by system at midnight)
export async function resetDailyPoints(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db || !db.app) {
      return { success: false, error: 'Firebase not configured' };
    }

    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      dailyPoints: 0
    });

    return { success: true };
  } catch (error) {
    console.error('Error resetting daily points:', error);
    return { success: false, error: 'Failed to reset daily points' };
  }
}
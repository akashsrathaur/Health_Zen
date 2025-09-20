'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { dailyResetService } from '@/lib/daily-reset-service';
import { handleDailyAppOpening } from './app-opening';
import { revalidatePath } from 'next/cache';

/**
 * Manual fix for current user issues
 * This function can be called to immediately fix the problems users are experiencing
 */
export async function fixCurrentUserIssues(userId: string): Promise<{
  success: boolean;
  fixesApplied: string[];
  error?: string;
}> {
  if (!db) {
    return {
      success: false,
      fixesApplied: [],
      error: 'Firebase not configured'
    };
  }

  const fixesApplied: string[] = [];
  
  try {
    console.log(`🔧 Starting manual fixes for user ${userId}`);
    
    // 1. Trigger daily reset to clear yesterday's data
    console.log('📅 Triggering daily reset...');
    await dailyResetService.manualReset(userId);
    fixesApplied.push('Daily reset triggered');
    
    // 2. Handle app opening to fix streak
    console.log('🔥 Fixing streak calculation...');
    const appOpeningResult = await handleDailyAppOpening(userId);
    if (appOpeningResult.success) {
      fixesApplied.push(`Streak updated to ${appOpeningResult.newStreak}`);
    }
    
    // 3. Ensure daily activities document is properly reset
    const today = new Date().toLocaleDateString('en-CA');
    const dailyActivitiesRef = doc(db, 'dailyActivities', `${userId}-${today}`);
    await setDoc(dailyActivitiesRef, {
      userId,
      date: today,
      waterIntake: 0,
      waterGoal: 8,
      sleepHours: 0,
      gymMinutes: 0,
      medicationTaken: false,
      customActivities: {},
      tasksCompleted: 0,
      pointsEarned: 0,
      createdAt: new Date().toISOString(),
      resetAt: new Date().toISOString(),
      manuallyFixed: true,
    });
    fixesApplied.push('Daily activities reset to zero');
    
    // 4. Ensure user daily points are reset
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await updateDoc(userRef, {
        dailyPoints: 0,
        lastResetDay: today,
        lastResetDate: new Date().toISOString(),
        manuallyFixed: true,
        manualFixDate: new Date().toISOString(),
      });
      fixesApplied.push('User daily points reset');
    }
    
    // 5. Revalidate all relevant pages
    revalidatePath('/dashboard');
    revalidatePath('/progress-tracker');
    fixesApplied.push('Pages revalidated');
    
    console.log(`✅ Manual fixes completed for user ${userId}:`, fixesApplied);
    
    return {
      success: true,
      fixesApplied
    };
    
  } catch (error) {
    console.error('❌ Error applying manual fixes:', error);
    return {
      success: false,
      fixesApplied,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fix all users who are experiencing the streak issue
 * This can be called to batch fix multiple users
 */
export async function batchFixAllUsers(): Promise<{
  success: boolean;
  usersFixed: number;
  errors: string[];
}> {
  // This would require querying all users from Firebase
  // For now, returning a placeholder
  console.log('🔧 Batch fix would need to query all users from Firebase');
  
  return {
    success: true,
    usersFixed: 0,
    errors: ['Batch fix not implemented - use individual user fix']
  };
}

/**
 * Quick reset for testing - resets everything for a user to day 1 state
 */
export async function quickResetUser(userId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const today = new Date().toLocaleDateString('en-CA');
    
    // Reset user document
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      dailyPoints: 0,
      streak: 1, // Start with streak 1 for new day
      lastAppOpenDate: today,
      lastActivityDate: '',
      lastResetDay: today,
      lastResetDate: new Date().toISOString(),
      quickReset: true,
      quickResetDate: new Date().toISOString(),
    });
    
    // Reset daily activities
    const dailyActivitiesRef = doc(db, 'dailyActivities', `${userId}-${today}`);
    await setDoc(dailyActivitiesRef, {
      userId,
      date: today,
      waterIntake: 0,
      waterGoal: 8,
      sleepHours: 0,
      gymMinutes: 0,
      medicationTaken: false,
      customActivities: {},
      tasksCompleted: 0,
      pointsEarned: 0,
      createdAt: new Date().toISOString(),
      quickReset: true,
    });
    
    // Trigger daily reset to ensure UI updates
    await dailyResetService.manualReset(userId);
    
    revalidatePath('/dashboard');
    revalidatePath('/progress-tracker');
    
    return {
      success: true,
      message: `User ${userId} has been reset to fresh daily state with streak 1`
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Failed to reset user: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
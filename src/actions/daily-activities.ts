'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { completeTask } from './points-streak';
import { revalidatePath } from 'next/cache';

const DAILY_ACTIVITIES_COLLECTION = 'dailyActivities';
const USERS_COLLECTION = 'users';

export type DailyActivity = {
  userId: string;
  date: string; // YYYY-MM-DD format
  waterIntake: number; // glasses consumed
  waterGoal: number;
  sleepHours: number;
  gymMinutes: number; // workout minutes
  medicationTaken: boolean;
  customActivities: { [key: string]: any };
  tasksCompleted: number;
  pointsEarned: number;
};

// Update water intake and award points
export async function updateWaterIntake(userId: string, glasses: number): Promise<{ success: boolean; pointsEarned?: number; error?: string }> {
  try {
    // Check if Firebase is properly configured
    if (!db || !db.app) {
      console.log('Firebase not configured, skipping database update');
      return { success: false, error: 'Firebase not configured' };
    }

    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    const activityRef = doc(db, DAILY_ACTIVITIES_COLLECTION, `${userId}-${today}`);
    
    const currentActivity = await getDoc(activityRef);
    const existingData = currentActivity.exists() ? currentActivity.data() : {};
    
    // Update water intake
    await setDoc(activityRef, {
      ...existingData,
      userId,
      date: today,
      waterIntake: Math.max(0, glasses),
      waterGoal: 8,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Award points if reaching certain milestones (2, 4, 6, 8 glasses)
    let pointsEarned = 0;
    const milestones = [2, 4, 6, 8];
    const previousGlasses = existingData.waterIntake || 0;
    
    for (const milestone of milestones) {
      if (glasses >= milestone && previousGlasses < milestone) {
        const taskResult = await completeTask(userId);
        if (taskResult.success) {
          pointsEarned += taskResult.pointsEarned;
        }
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/progress-tracker');
    
    return { success: true, pointsEarned };
  } catch (error) {
    console.error('Error updating water intake:', error);
    return { success: false, error: 'Failed to update water intake' };
  }
}

// Update sleep hours and award points
export async function updateSleepHours(userId: string, hours: number): Promise<{ success: boolean; pointsEarned?: number; error?: string }> {
  try {
    if (!db || !db.app) {
      return { success: false, error: 'Firebase not configured' };
    }

    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    const activityRef = doc(db, DAILY_ACTIVITIES_COLLECTION, `${userId}-${today}`);
    
    const currentActivity = await getDoc(activityRef);
    const existingData = currentActivity.exists() ? currentActivity.data() : {};
    
    await setDoc(activityRef, {
      ...existingData,
      userId,
      date: today,
      sleepHours: Math.max(0, hours),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Award points if getting good sleep (7+ hours)
    let pointsEarned = 0;
    if (hours >= 7 && (existingData.sleepHours || 0) < 7) {
      const taskResult = await completeTask(userId);
      if (taskResult.success) {
        pointsEarned = taskResult.pointsEarned;
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/progress-tracker');
    
    return { success: true, pointsEarned };
  } catch (error) {
    console.error('Error updating sleep hours:', error);
    return { success: false, error: 'Failed to update sleep hours' };
  }
}

// Update gym minutes and award points
export async function updateGymMinutes(userId: string, minutes: number): Promise<{ success: boolean; pointsEarned?: number; error?: string }> {
  try {
    if (!db || !db.app) {
      return { success: false, error: 'Firebase not configured' };
    }

    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    const activityRef = doc(db, DAILY_ACTIVITIES_COLLECTION, `${userId}-${today}`);
    
    const currentActivity = await getDoc(activityRef);
    const existingData = currentActivity.exists() ? currentActivity.data() : {};
    
    await setDoc(activityRef, {
      ...existingData,
      userId,
      date: today,
      gymMinutes: Math.max(0, minutes),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Award points for workout milestones (5, 10, 15, 20 minutes)
    let pointsEarned = 0;
    const milestones = [5, 10, 15, 20];
    const previousMinutes = existingData.gymMinutes || 0;
    
    for (const milestone of milestones) {
      if (minutes >= milestone && previousMinutes < milestone) {
        const taskResult = await completeTask(userId);
        if (taskResult.success) {
          pointsEarned += taskResult.pointsEarned;
        }
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/progress-tracker');
    
    return { success: true, pointsEarned };
  } catch (error) {
    console.error('Error updating gym minutes:', error);
    return { success: false, error: 'Failed to update gym minutes' };
  }
}

// Mark medication as taken and award points
export async function updateMedicationStatus(userId: string, taken: boolean): Promise<{ success: boolean; pointsEarned?: number; error?: string }> {
  try {
    if (!db || !db.app) {
      return { success: false, error: 'Firebase not configured' };
    }

    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    const activityRef = doc(db, DAILY_ACTIVITIES_COLLECTION, `${userId}-${today}`);
    
    const currentActivity = await getDoc(activityRef);
    const existingData = currentActivity.exists() ? currentActivity.data() : {};
    
    await setDoc(activityRef, {
      ...existingData,
      userId,
      date: today,
      medicationTaken: taken,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Award points when medication is taken (and wasn't taken before)
    let pointsEarned = 0;
    if (taken && !existingData.medicationTaken) {
      const taskResult = await completeTask(userId);
      if (taskResult.success) {
        pointsEarned = taskResult.pointsEarned;
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/progress-tracker');
    
    return { success: true, pointsEarned };
  } catch (error) {
    console.error('Error updating medication status:', error);
    return { success: false, error: 'Failed to update medication status' };
  }
}

// Complete any custom task and award points
export async function completeCustomTask(userId: string, taskName: string): Promise<{ success: boolean; pointsEarned?: number; error?: string }> {
  try {
    if (!db || !db.app) {
      return { success: false, error: 'Firebase not configured' };
    }

    const taskResult = await completeTask(userId);
    if (!taskResult.success) {
      return { success: false, error: taskResult.error };
    }

    // Track the custom task completion
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    const activityRef = doc(db, DAILY_ACTIVITIES_COLLECTION, `${userId}-${today}`);
    
    const currentActivity = await getDoc(activityRef);
    const existingData = currentActivity.exists() ? currentActivity.data() : {};
    const customActivities = existingData.customActivities || {};
    
    await setDoc(activityRef, {
      ...existingData,
      userId,
      date: today,
      customActivities: {
        ...customActivities,
        [taskName]: {
          completed: true,
          completedAt: new Date().toISOString(),
        }
      },
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    revalidatePath('/dashboard');
    revalidatePath('/progress-tracker');
    
    return { 
      success: true, 
      pointsEarned: taskResult.pointsEarned,
    };
  } catch (error) {
    console.error('Error completing custom task:', error);
    return { success: false, error: 'Failed to complete custom task' };
  }
}

// Get today's activity data for display
export async function getTodayActivity(userId: string): Promise<DailyActivity | null> {
  try {
    if (!db || !db.app) {
      return null;
    }

    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    const activityRef = doc(db, DAILY_ACTIVITIES_COLLECTION, `${userId}-${today}`);
    const activityDoc = await getDoc(activityRef);
    
    if (!activityDoc.exists()) {
      return {
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
      };
    }
    
    return activityDoc.data() as DailyActivity;
  } catch (error) {
    console.error('Error getting today activity:', error);
    return null;
  }
}
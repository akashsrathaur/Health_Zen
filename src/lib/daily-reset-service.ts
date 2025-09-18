'use client';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export interface DailyResetService {
  scheduleDaily: () => void;
  performDailyReset: (userId: string) => Promise<void>;
  incrementDailyStreak: (userId: string) => Promise<void>;
  saveDailyData: (userId: string) => Promise<void>;
  resetDailyMetrics: (userId: string) => Promise<void>;
}

class DailyResetServiceImpl implements DailyResetService {
  private resetTimeout: NodeJS.Timeout | null = null;
  private currentUserId: string | null = null;

  constructor() {
    this.scheduleDaily();
  }

  setUserId(userId: string) {
    this.currentUserId = userId;
  }

  scheduleDaily() {
    // Clear existing timeout
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    const now = new Date();
    const resetTime = new Date();
    resetTime.setHours(23, 59, 0, 0); // 11:59 PM

    // If it's already past 11:59 PM today, schedule for tomorrow
    if (now.getTime() > resetTime.getTime()) {
      resetTime.setDate(resetTime.getDate() + 1);
    }

    const timeUntilReset = resetTime.getTime() - now.getTime();

    this.resetTimeout = setTimeout(() => {
      this.performDailyResetForAllUsers();
      // Schedule the next reset (24 hours later)
      this.resetTimeout = setInterval(() => {
        this.performDailyResetForAllUsers();
      }, 24 * 60 * 60 * 1000);
    }, timeUntilReset);

    console.log(`Daily reset scheduled for: ${resetTime.toLocaleString()}`);
  }

  private async performDailyResetForAllUsers() {
    if (!db) return;

    try {
      // If we have a current user, reset for them
      if (this.currentUserId) {
        await this.performDailyReset(this.currentUserId);
      }
    } catch (error) {
      console.error('Error performing daily reset for all users:', error);
    }
  }

  async performDailyReset(userId: string): Promise<void> {
    if (!db) return;

    console.log(`Performing daily reset for user: ${userId}`);
    
    try {
      // 1. Save today's data before reset
      await this.saveDailyData(userId);
      
      // 2. Increment streak if user was active today
      await this.incrementDailyStreak(userId);
      
      // 3. Reset daily metrics for tomorrow
      await this.resetDailyMetrics(userId);
      
      console.log(`Daily reset completed for user: ${userId}`);
    } catch (error) {
      console.error(`Error performing daily reset for user ${userId}:`, error);
    }
  }

  async saveDailyData(userId: string): Promise<void> {
    if (!db) return;

    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    
    try {
      // Get current daily activities
      const dailyActivitiesRef = doc(db, 'dailyActivities', `${userId}-${today}`);
      const dailyActivitiesDoc = await getDoc(dailyActivitiesRef);
      
      // Get current user data
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Save daily summary to history
        const historicalData = {
          userId,
          date: today,
          points: userData.points || 0,
          dailyPoints: userData.dailyPoints || 0,
          streak: userData.streak || 0,
          totalTasksCompleted: userData.totalTasksCompleted || 0,
          activities: dailyActivitiesDoc.exists() ? dailyActivitiesDoc.data() : {},
          savedAt: new Date().toISOString(),
        };
        
        const historyRef = doc(db, 'dailyHistory', `${userId}-${today}`);
        await setDoc(historyRef, historicalData);
        
        console.log(`Saved daily data for ${userId} on ${today}`);
      }
    } catch (error) {
      console.error(`Error saving daily data for user ${userId}:`, error);
    }
  }

  async incrementDailyStreak(userId: string): Promise<void> {
    if (!db) return;

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log(`User ${userId} not found for streak increment`);
        return;
      }

      const userData = userDoc.data();
      const today = new Date().toLocaleDateString('en-CA');
      const lastActivityDate = userData.lastActivityDate || '';
      const currentStreak = userData.streak || 0;

      // Check if user was active today
      const wasActiveToday = lastActivityDate === today;
      
      if (wasActiveToday) {
        // Increment streak
        const newStreak = currentStreak + 1;
        
        await updateDoc(userRef, {
          streak: newStreak,
          lastStreakUpdate: new Date().toISOString(),
        });
        
        console.log(`Incremented streak for user ${userId}: ${currentStreak} -> ${newStreak}`);
      } else {
        // User wasn't active today, but don't reset streak yet
        // This will be handled by existing streak logic
        console.log(`User ${userId} was not active today, streak remains at ${currentStreak}`);
      }
    } catch (error) {
      console.error(`Error incrementing daily streak for user ${userId}:`, error);
    }
  }

  async resetDailyMetrics(userId: string): Promise<void> {
    if (!db) return;

    try {
      const userRef = doc(db, 'users', userId);
      
      // Reset daily points to 0 for the new day
      await updateDoc(userRef, {
        dailyPoints: 0,
      });
      
      // Reset daily activities for the new day
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toLocaleDateString('en-CA');
      
      const newDailyActivitiesRef = doc(db, 'dailyActivities', `${userId}-${tomorrowStr}`);
      await setDoc(newDailyActivitiesRef, {
        userId,
        date: tomorrowStr,
        waterIntake: 0,
        waterGoal: 8,
        sleepHours: 0,
        gymMinutes: 0,
        medicationTaken: false,
        customActivities: {},
        tasksCompleted: 0,
        pointsEarned: 0,
        createdAt: new Date().toISOString(),
      });
      
      console.log(`Reset daily metrics for user ${userId}`);
    } catch (error) {
      console.error(`Error resetting daily metrics for user ${userId}:`, error);
    }
  }

  // Method to manually trigger reset for testing
  async manualReset(userId: string): Promise<void> {
    await this.performDailyReset(userId);
  }
}

// Singleton instance
const dailyResetService = new DailyResetServiceImpl();

export { dailyResetService };
export default dailyResetService;
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
    // Clear existing timeout and interval
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }

    const scheduleNextReset = () => {
      const now = new Date();
      const resetTime = new Date();
      resetTime.setHours(23, 59, 0, 0); // 11:59 PM

      // If it's already past 11:59 PM today, schedule for tomorrow
      if (now.getTime() > resetTime.getTime()) {
        resetTime.setDate(resetTime.getDate() + 1);
      }

      const timeUntilReset = resetTime.getTime() - now.getTime();
      console.log(`Next daily reset scheduled for: ${resetTime.toLocaleString()} (in ${Math.round(timeUntilReset / (1000 * 60))} minutes)`);

      this.resetTimeout = setTimeout(() => {
        this.performDailyResetForAllUsers();
        // Schedule the next reset recursively to ensure accuracy
        scheduleNextReset();
      }, timeUntilReset);
    };

    scheduleNextReset();
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
    if (!db) {
      console.warn('Firebase not configured, skipping daily reset');
      return;
    }

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Starting daily reset for user: ${userId}`);
    
    try {
      // 1. Save today's data before reset
      console.log(`[${timestamp}] Step 1: Saving daily data...`);
      await this.saveDailyData(userId);
      
      // 2. Increment streak if user was active today
      console.log(`[${timestamp}] Step 2: Checking and updating streak...`);
      await this.incrementDailyStreak(userId);
      
      // 3. Reset daily metrics for tomorrow
      console.log(`[${timestamp}] Step 3: Resetting daily metrics...`);
      await this.resetDailyMetrics(userId);
      
      console.log(`[${timestamp}] Daily reset completed successfully for user: ${userId}`);
    } catch (error) {
      console.error(`[${timestamp}] Error performing daily reset for user ${userId}:`, error);
      throw error;
    }
  }

  async saveDailyData(userId: string): Promise<void> {
    if (!db) {
      console.warn('Firebase not configured, skipping save daily data');
      return;
    }

    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const timestamp = new Date().toISOString();
    
    try {
      // Get current daily activities
      const dailyActivitiesRef = doc(db, 'dailyActivities', `${userId}-${today}`);
      const dailyActivitiesDoc = await getDoc(dailyActivitiesRef);
      
      // Get current user data
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.warn(`User ${userId} not found, skipping daily data save`);
        return;
      }

      const userData = userDoc.data();
      const activitiesData = dailyActivitiesDoc.exists() ? dailyActivitiesDoc.data() : {};
      
      // Save comprehensive daily summary to history
      const historicalData = {
        userId,
        date: today,
        points: userData.points || 0,
        dailyPoints: userData.dailyPoints || 0,
        streak: userData.streak || 0,
        totalTasksCompleted: userData.totalTasksCompleted || 0,
        
        // Daily activities data
        activities: {
          waterIntake: activitiesData.waterIntake || 0,
          waterGoal: activitiesData.waterGoal || 8,
          sleepHours: activitiesData.sleepHours || 0,
          gymMinutes: activitiesData.gymMinutes || 0,
          medicationTaken: activitiesData.medicationTaken || false,
          tasksCompleted: activitiesData.tasksCompleted || 0,
          pointsEarned: activitiesData.pointsEarned || 0,
          customActivities: activitiesData.customActivities || {},
        },
        
        // Daily vibes data from user document
        dailyVibes: userData.dailyVibes || [],
        challenges: userData.challenges || [],
        
        savedAt: timestamp,
        resetAt: timestamp
      };
      
      const historyRef = doc(db, 'dailyHistory', `${userId}-${today}`);
      await setDoc(historyRef, historicalData);
      
      console.log(`Successfully saved daily data for ${userId} on ${today}`);
      console.log(`Data includes: ${activitiesData.waterIntake || 0} glasses water, ${activitiesData.sleepHours || 0}h sleep, ${activitiesData.gymMinutes || 0}min gym`);
    } catch (error) {
      console.error(`Error saving daily data for user ${userId}:`, error);
      throw error;
    }
  }

  async incrementDailyStreak(userId: string): Promise<void> {
    if (!db) {
      console.warn('Firebase not configured, skipping streak increment');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.warn(`User ${userId} not found for streak increment`);
        return;
      }

      const userData = userDoc.data();
      const today = new Date().toLocaleDateString('en-CA');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString('en-CA');
      
      const lastActivityDate = userData.lastActivityDate || '';
      const currentStreak = userData.streak || 0;
      const lastStreakUpdate = userData.lastStreakUpdate || '';

      console.log(`Checking streak for user ${userId}: lastActivity=${lastActivityDate}, today=${today}, currentStreak=${currentStreak}`);

      // Check if user was active today or yesterday (to maintain streak)
      const wasActiveToday = lastActivityDate === today;
      const wasActiveYesterday = lastActivityDate === yesterdayStr;
      const hasTasksToday = userData.dailyVibes?.some((vibe: any) => vibe.completedAt) || false;

      if (wasActiveToday || hasTasksToday) {
        // User was active today
        let newStreak = currentStreak;
        
        if (currentStreak === 0) {
          // Starting first streak
          newStreak = 1;
        } else if (wasActiveYesterday) {
          // Consecutive activity - increment streak
          newStreak = currentStreak + 1;
        } else {
          // Active today but not yesterday - reset to 1
          newStreak = 1;
        }
        
        await updateDoc(userRef, {
          streak: newStreak,
          lastStreakUpdate: new Date().toISOString(),
          lastActivityDate: today,
        });
        
        console.log(`✅ Updated streak for user ${userId}: ${currentStreak} -> ${newStreak}`);
      } else if (wasActiveYesterday) {
        // User was active yesterday but not today, maintain streak for one day
        console.log(`⚠️ User ${userId} was active yesterday but not today, maintaining streak at ${currentStreak} for now`);
      } else {
        // User hasn't been active, reset streak
        if (currentStreak > 0) {
          await updateDoc(userRef, {
            streak: 0,
            lastStreakUpdate: new Date().toISOString(),
            lastStreakReset: new Date().toISOString(),
            previousStreak: currentStreak, // Save previous streak for analytics
          });
          console.log(`❌ Reset streak for user ${userId}: ${currentStreak} -> 0 (no recent activity)`);
        }
      }
    } catch (error) {
      console.error(`Error updating streak for user ${userId}:`, error);
      throw error;
    }
  }

  async resetDailyMetrics(userId: string): Promise<void> {
    if (!db) {
      console.warn('Firebase not configured, skipping daily metrics reset');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.warn(`User ${userId} not found for daily metrics reset`);
        return;
      }

      const userData = userDoc.data();
      const today = new Date().toLocaleDateString('en-CA');
      
      console.log(`Resetting daily metrics for user ${userId} for date: ${today}`);
      
      // Reset user daily metrics
      const resetData: any = {
        dailyPoints: 0,
        lastResetDate: new Date().toISOString(),
      };

      // Reset daily vibes (keep custom ones but reset progress)
      if (userData.dailyVibes && Array.isArray(userData.dailyVibes)) {
        const resetDailyVibes = userData.dailyVibes.map((vibe: any) => {
          // Reset all vibes except streak (which should maintain its value)
          if (vibe.id === 'streak') {
            return vibe; // Keep streak as is
          }
          
          // Reset other vibes
          const resetVibe = {
            ...vibe,
            progress: 0,
            completedAt: undefined
          };
          
          // Reset specific vibe types to their default values
          switch (vibe.id) {
            case 'water':
              resetVibe.value = '0/8 glasses';
              break;
            case 'sleep':
              resetVibe.value = '0h';
              break;
            case 'gym':
              resetVibe.value = '0/60 minutes';
              break;
            case 'medication':
              resetVibe.value = 'Pending';
              if (resetVibe.medicationConfig) {
                resetVibe.medicationConfig.dosesTaken = 0;
                resetVibe.medicationConfig.lastDoseTime = undefined;
              }
              break;
            default:
              if (vibe.isCustom) {
                resetVibe.value = 'Not set';
              }
              break;
          }
          
          return resetVibe;
        });
        
        resetData.dailyVibes = resetDailyVibes;
      }

      // Reset challenges completion status
      if (userData.challenges && Array.isArray(userData.challenges)) {
        const resetChallenges = userData.challenges.map((challenge: any) => ({
          ...challenge,
          isCompletedToday: false
        }));
        resetData.challenges = resetChallenges;
      }
      
      await updateDoc(userRef, resetData);
      
      // Ensure fresh daily activities document exists for today
      const newDailyActivitiesRef = doc(db, 'dailyActivities', `${userId}-${today}`);
      await setDoc(newDailyActivitiesRef, {
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
      }, { merge: true }); // Use merge to avoid overwriting existing data
      
      console.log(`✅ Successfully reset daily metrics for user ${userId}`);
      console.log(`📅 Ensured fresh activities document for: ${today}`);
    } catch (error) {
      console.error(`❌ Error resetting daily metrics for user ${userId}:`, error);
      throw error;
    }
  }

  // Method to manually trigger reset for testing
  async manualReset(userId: string): Promise<void> {
    await this.performDailyReset(userId);
  }
  
  // Check if daily reset is needed for user and trigger it
  async checkAndTriggerResetIfNeeded(userId: string): Promise<void> {
    if (!db) {
      console.warn('Firebase not configured, skipping reset check');
      return;
    }
    
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.warn(`User ${userId} not found for reset check`);
        return;
      }
      
      const userData = userDoc.data();
      const today = new Date().toLocaleDateString('en-CA');
      const lastResetDate = userData.lastResetDate ? new Date(userData.lastResetDate).toLocaleDateString('en-CA') : '';
      
      // Check if we need to reset for today
      if (lastResetDate !== today) {
        console.log(`Daily reset needed for user ${userId}. Last reset: ${lastResetDate}, Today: ${today}`);
        await this.performDailyReset(userId);
      } else {
        console.log(`Daily reset already done today for user ${userId}`);
      }
    } catch (error) {
      console.error(`Error checking reset for user ${userId}:`, error);
    }
  }
}

// Singleton instance
const dailyResetService = new DailyResetServiceImpl();

export { dailyResetService };
export default dailyResetService;
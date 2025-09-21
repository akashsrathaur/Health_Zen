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
      resetTime.setHours(23, 59, 0, 0); // 11:59 PM - save data before day ends

      // If it's already past 11:59 PM today, schedule for tomorrow
      if (now.getTime() > resetTime.getTime()) {
        resetTime.setDate(resetTime.getDate() + 1);
      }

      const timeUntilReset = resetTime.getTime() - now.getTime();

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

    try {
      await this.saveDailyData(userId);
      await this.incrementDailyStreak(userId);
      await this.resetDailyMetrics(userId);
    } catch (error) {
      console.error(`Error performing daily reset for user ${userId}:`, error);
      throw error;
    }
  }

  async saveDailyData(userId: string): Promise<void> {
    if (!db) {
      console.warn('Firebase not configured, skipping save daily data');
      return;
    }

    // Get current date (today) since reset runs at end of day at 11:59 PM
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
      
      // Save comprehensive daily summary to history for today
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

      // Check if user was active today (has completed tasks)
      const hasTasksToday = userData.dailyVibes?.some((vibe: any) => 
        vibe.completedAt || 
        (vibe.id === 'medication' && vibe.progress === 100) ||
        (vibe.id === 'water' && parseInt(vibe.value?.split('/')[0] || '0') > 0) ||
        (vibe.id === 'gym' && parseInt(vibe.value?.split('/')[0] || '0') > 0) ||
        (vibe.id === 'sleep' && parseFloat(vibe.value?.match(/^([\d.]+)/)?.[1] || '0') > 0)
      ) || false;
      
      const wasActiveToday = lastActivityDate === today || hasTasksToday;
      const wasActiveYesterday = lastActivityDate === yesterdayStr;

      if (wasActiveToday) {
        // User was active today - calculate new streak
        let newStreak = currentStreak;
        
        if (currentStreak === 0) {
          // Starting first streak
          newStreak = 1;
        } else if (wasActiveYesterday || lastActivityDate === yesterdayStr) {
          // Consecutive activity - increment streak
          newStreak = currentStreak + 1;
        } else {
          // Gap in activity - reset to 1
          newStreak = 1;
        }
        
        await updateDoc(userRef, {
          streak: newStreak,
          lastStreakUpdate: new Date().toISOString(),
          lastActivityDate: today,
        });
        
        console.log(`✅ Updated streak for user ${userId}: ${currentStreak} -> ${newStreak}`);
      } else if (wasActiveYesterday && currentStreak > 0) {
        // User was active yesterday but not today, reset streak after grace period
        await updateDoc(userRef, {
          streak: 0,
          lastStreakUpdate: new Date().toISOString(),
          lastStreakReset: new Date().toISOString(),
          previousStreak: currentStreak,
        });
        console.log(`❌ Reset streak for user ${userId}: ${currentStreak} -> 0 (missed day)`);
      } else if (currentStreak > 0) {
        // User hasn't been active, reset streak
        await updateDoc(userRef, {
          streak: 0,
          lastStreakUpdate: new Date().toISOString(),
          lastStreakReset: new Date().toISOString(),
          previousStreak: currentStreak,
        });
        console.log(`❌ Reset streak for user ${userId}: ${currentStreak} -> 0 (no recent activity)`);
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
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toLocaleDateString('en-CA');
      
      // Reset user daily metrics for tomorrow
      const resetData: any = {
        dailyPoints: 0,
        lastResetDate: new Date().toISOString(),
        lastResetDay: tomorrowStr, // Track which day we last reset for (YYYY-MM-DD format)
      };

      // Refresh daily vibes for new day - preserve all user's tasks and custom vibes
      if (userData.dailyVibes && Array.isArray(userData.dailyVibes)) {
        const refreshedDailyVibes = userData.dailyVibes.map((vibe: any) => {
          // Preserve streak value - it should maintain its current value
          if (vibe.id === 'streak') {
            return vibe; // Keep streak exactly as is
          }
          
          // Refresh daily progress for new day
          const refreshedVibe = {
            ...vibe, // Keep all existing properties (title, icon, isCustom, etc.)
            progress: 0, // Reset daily progress to 0
            completedAt: undefined // Clear completion timestamp for new day
          };
          
          // Reset specific daily metrics to starting values for new day
          switch (vibe.id) {
            case 'water':
              refreshedVibe.value = '0/8 glasses'; // Reset to 0 glasses for new day
              break;
            case 'sleep':
              refreshedVibe.value = '0h'; // Reset sleep hours for new day
              break;
            case 'gym':
              refreshedVibe.value = '0/20 minutes'; // Reset gym minutes for new day
              break;
            case 'medication':
              refreshedVibe.value = 'Pending'; // Reset medication status for new day
              if (refreshedVibe.medicationConfig) {
                refreshedVibe.medicationConfig.dosesTaken = 0; // Reset doses taken for new day
                refreshedVibe.medicationConfig.lastDoseTime = undefined; // Clear last dose time
              }
              break;
            default:
              // For custom tasks, only reset progress, keep the user's custom values
              if (vibe.isCustom) {
                // Don't reset custom task values - user may want to keep them
                // Only reset completion status for new day
              }
              break;
          }
          
          return refreshedVibe;
        });
        
        resetData.dailyVibes = refreshedDailyVibes;
      }

      // Reset challenges completion status for today only - preserve challenge enrollment
      if (userData.challenges && Array.isArray(userData.challenges)) {
        const refreshedChallenges = userData.challenges.map((challenge: any) => ({
          ...challenge,
          // Only reset today's completion status, preserve all other progress
          isCompletedToday: false,
          // If challenge was completed today, increment the currentDay
          currentDay: challenge.isCompletedToday ? (challenge.currentDay || 0) + 1 : challenge.currentDay || 0
        }));
        resetData.challenges = refreshedChallenges;
      }
      
      await updateDoc(userRef, resetData);
      
      // Also update userData collection if it exists (where daily vibes are stored for UI)
      try {
        const userDataRef = doc(db, 'userData', userId);
        const userDataDoc = await getDoc(userDataRef);
        if (userDataDoc.exists()) {
          await updateDoc(userDataRef, {
            dailyVibes: resetData.dailyVibes || [],
            challenges: resetData.challenges || [],
            lastResetDay: tomorrowStr,
          });
        }
      } catch (error) {
        console.warn(`Failed to update userData collection for user ${userId}:`, error);
      }
      
      // Create fresh daily activities document for the new day
      const newDailyActivitiesRef = doc(db, 'dailyActivities', `${userId}-${tomorrowStr}`);
      const existingTomorrowDoc = await getDoc(newDailyActivitiesRef);
      
      // Only create new document if it doesn't exist for tomorrow
      if (!existingTomorrowDoc.exists()) {
        await setDoc(newDailyActivitiesRef, {
          userId,
          date: tomorrowStr,
          waterIntake: 0, // Start fresh for new day
          waterGoal: 8,
          sleepHours: 0, // Start fresh for new day
          gymMinutes: 0, // Start fresh for new day
          medicationTaken: false, // Start fresh for new day
          customActivities: {},
          tasksCompleted: 0,
          pointsEarned: 0,
          createdAt: new Date().toISOString(),
          resetAt: new Date().toISOString(),
        });
        console.log(`📅 Created fresh daily activities document for: ${tomorrowStr}`);
      } else {
        console.log(`📅 Daily activities document already exists for: ${tomorrowStr}`);
      }
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
  async checkAndTriggerResetIfNeeded(userId: string): Promise<boolean> {
    if (!db) {
      console.warn('Firebase not configured, skipping reset check');
      return false;
    }
    
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.warn(`User ${userId} not found for reset check`);
        return false;
      }
      
      const userData = userDoc.data();
      const today = new Date().toLocaleDateString('en-CA');
      const lastResetDay = userData.lastResetDay || '';
      
      console.log(`Checking daily reset for user ${userId}: lastResetDay=${lastResetDay}, today=${today}`);
      
      // Check if we need to reset for today
      if (lastResetDay !== today) {
        console.log(`Triggering daily reset for user ${userId}`);
        await this.performDailyReset(userId);
        return true; // Reset was performed
      } else {
        console.log(`Daily reset already completed today for user ${userId}`);
        return false; // No reset needed
      }
    } catch (error) {
      console.error(`Error checking reset for user ${userId}:`, error);
      return false;
    }
  }
}

// Singleton instance
const dailyResetService = new DailyResetServiceImpl();

export { dailyResetService };
export default dailyResetService;
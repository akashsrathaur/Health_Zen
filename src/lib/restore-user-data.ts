'use client';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { initialChallenges, initialDailyVibes } from '@/lib/data';

/**
 * Restore user's challenges and daily vibes if they were accidentally deleted
 */
export async function restoreUserData(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db || !db.app) {
      return { success: false, error: 'Firebase not configured' };
    }

    console.log(`Restoring user data for user: ${userId}`);

    // Check userData document
    const userDataRef = doc(db, 'userData', userId);
    const userDataDoc = await getDoc(userDataRef);

    if (!userDataDoc.exists()) {
      // Create userData document with default challenges and daily vibes
      await setDoc(userDataRef, {
        challenges: initialChallenges,
        dailyVibes: initialDailyVibes,
        restoredAt: new Date().toISOString(),
      });
      console.log('✅ Created new userData document with default challenges and daily vibes');
    } else {
      const userData = userDataDoc.data();
      let needsUpdate = false;
      const updates: any = {};

      // Restore challenges if missing or empty
      if (!userData.challenges || userData.challenges.length === 0) {
        updates.challenges = initialChallenges;
        needsUpdate = true;
        console.log('🔄 Restoring missing challenges');
      }

      // Restore daily vibes if missing or empty
      if (!userData.dailyVibes || userData.dailyVibes.length === 0) {
        updates.dailyVibes = initialDailyVibes;
        needsUpdate = true;
        console.log('🔄 Restoring missing daily vibes');
      }

      if (needsUpdate) {
        updates.restoredAt = new Date().toISOString();
        await updateDoc(userDataRef, updates);
        console.log('✅ Successfully restored missing user data');
      } else {
        console.log('ℹ️ User data is already complete, no restoration needed');
      }
    }

    // Also ensure user document exists with proper structure
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create basic user profile if missing
      await setDoc(userRef, {
        uid: userId,
        name: 'User',
        email: '',
        streak: 0,
        points: 0,
        dailyPoints: 0,
        totalTasksCompleted: 0,
        createdAt: new Date().toISOString(),
        lastResetDay: new Date().toLocaleDateString('en-CA'),
      });
      console.log('✅ Created basic user profile document');
    }

    return { success: true };
  } catch (error) {
    console.error('Error restoring user data:', error);
    return { success: false, error: 'Failed to restore user data' };
  }
}

/**
 * Reset daily progress while preserving user's enrolled challenges and custom tasks
 */
export async function safeRefreshDailyTasks(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db || !db.app) {
      return { success: false, error: 'Firebase not configured' };
    }

    console.log(`Safely refreshing daily tasks for user: ${userId}`);

    const userDataRef = doc(db, 'userData', userId);
    const userDataDoc = await getDoc(userDataRef);

    if (!userDataDoc.exists()) {
      return { success: false, error: 'User data not found' };
    }

    const userData = userDataDoc.data();
    const today = new Date().toLocaleDateString('en-CA');

    // Refresh daily vibes - preserve all user customizations
    const refreshedDailyVibes = (userData.dailyVibes || initialDailyVibes).map((vibe: any) => {
      if (vibe.id === 'streak') {
        return vibe; // Keep streak unchanged
      }

      const refreshedVibe = {
        ...vibe, // Keep all properties including custom titles, icons, etc.
        progress: 0,
        completedAt: undefined,
      };

      // Reset only daily values
      switch (vibe.id) {
        case 'water':
          refreshedVibe.value = '0/8 glasses';
          break;
        case 'sleep':
          refreshedVibe.value = '0h';
          break;
        case 'gym':
          refreshedVibe.value = '0/20 minutes';
          break;
        case 'medication':
          refreshedVibe.value = 'Pending';
          if (refreshedVibe.medicationConfig) {
            refreshedVibe.medicationConfig.dosesTaken = 0;
            refreshedVibe.medicationConfig.lastDoseTime = undefined;
          }
          break;
      }

      return refreshedVibe;
    });

    // Refresh challenges - preserve enrollment and progress, only reset daily completion
    const refreshedChallenges = (userData.challenges || initialChallenges).map((challenge: any) => ({
      ...challenge,
      isCompletedToday: false, // Only reset today's completion status
      // Keep currentDay, goalDays, title, description, etc. unchanged
    }));

    // Update userData
    await updateDoc(userDataRef, {
      dailyVibes: refreshedDailyVibes,
      challenges: refreshedChallenges,
      lastRefreshed: new Date().toISOString(),
      lastRefreshDay: today,
    });

    // Update user document
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await updateDoc(userRef, {
        dailyPoints: 0, // Reset daily points
        lastResetDay: today,
        dailyVibes: refreshedDailyVibes,
        challenges: refreshedChallenges,
      });
    }

    console.log('✅ Successfully refreshed daily tasks while preserving user progress');
    return { success: true };
  } catch (error) {
    console.error('Error safely refreshing daily tasks:', error);
    return { success: false, error: 'Failed to refresh daily tasks' };
  }
}
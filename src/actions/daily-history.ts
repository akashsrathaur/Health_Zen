'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export type DailyHistoricalData = {
  userId: string;
  date: string; // YYYY-MM-DD format
  points: number;
  dailyPoints: number;
  streak: number;
  totalTasksCompleted: number;
  activities: {
    waterIntake: number;
    waterGoal: number;
    sleepHours: number;
    gymMinutes: number;
    medicationTaken: boolean;
    tasksCompleted: number;
    pointsEarned: number;
    customActivities: { [key: string]: any };
  };
  dailyVibes: any[];
  challenges: any[];
  savedAt: string;
  resetAt: string;
};

/**
 * Get historical daily data for a specific date
 */
export async function getDailyHistoricalData(userId: string, date: string): Promise<DailyHistoricalData | null> {
  if (!db) {
    return null;
  }

  try {
    const historyRef = doc(db, 'dailyHistory', `${userId}-${date}`);
    const historyDoc = await getDoc(historyRef);
    
    if (historyDoc.exists()) {
      return historyDoc.data() as DailyHistoricalData;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching daily historical data for ${userId} on ${date}:`, error);
    return null;
  }
}

/**
 * Get historical data for multiple dates (for charts)
 */
export async function getWeeklyHistoricalData(userId: string, dates: string[]): Promise<{
  [date: string]: DailyHistoricalData | null;
}> {
  if (!db) {
    return {};
  }

  const results: { [date: string]: DailyHistoricalData | null } = {};
  
  try {
    // Fetch all dates in parallel
    const promises = dates.map(async (date) => {
      const data = await getDailyHistoricalData(userId, date);
      return { date, data };
    });
    
    const resolved = await Promise.all(promises);
    
    // Build results object
    resolved.forEach(({ date, data }) => {
      results[date] = data;
    });
    
    return results;
  } catch (error) {
    console.error('Error fetching weekly historical data:', error);
    return {};
  }
}
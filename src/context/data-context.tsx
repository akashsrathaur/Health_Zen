
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Challenge, DailyVibe, CommunityPost } from '@/lib/data';
import { initialChallenges, initialDailyVibes } from '@/lib/data';
import { useAuth } from './auth-context';
import { getChallenges } from '@/actions/challenges';
import { getDailyVibes } from '@/actions/dashboard';
import { getCommunityPosts } from '@/actions/community';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type ProgressState = {
    streak: number;
    completedTasks: number;
};

interface DataContextType {
  challenges: Challenge[];
  setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
  dailyVibes: DailyVibe[];
  setDailyVibes: React.Dispatch<React.SetStateAction<DailyVibe[]>>;
  posts: CommunityPost[];
  setPosts: React.Dispatch<React.SetStateAction<CommunityPost[]>>;
  userProgress: ProgressState | null;
  setUserProgress: React.Dispatch<React.SetStateAction<ProgressState | null>>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [dailyVibes, setDailyVibes] = useState<DailyVibe[]>(initialDailyVibes);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [userProgress, setUserProgress] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
        setLoading(false);
        // Reset to initial state when user logs out
        setChallenges(initialChallenges);
        setDailyVibes(initialDailyVibes);
        setPosts([]);
        setUserProgress(null);
        return;
    }

    setLoading(true);

    const userDataRef = doc(db, 'userData', user.uid);
    const unsubscribe = onSnapshot(userDataRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setChallenges(data.challenges || initialChallenges);
            setDailyVibes(data.dailyVibes || initialDailyVibes);
            setPosts(data.posts || []);
            
            const completedTasks = (data.dailyVibes || []).filter((v: DailyVibe) => v.completedAt || v.progress === 100).length + 
                                   (data.challenges || []).filter((c: Challenge) => c.isCompletedToday).length;
            
            setUserProgress({
                streak: user.streak, // Assuming streak is on the main user object
                completedTasks: completedTasks,
            });

        } else {
            // Set default data if no userData document exists yet
            setChallenges(initialChallenges);
            setDailyVibes(initialDailyVibes);
            setPosts([]);
             setUserProgress({
                streak: user.streak,
                completedTasks: 0,
            });
        }
         setLoading(false);
    }, (error) => {
        console.error("Error listening to user data:", error);
        setLoading(false);
    });

    return () => unsubscribe();

  }, [user, authLoading]);

  return (
    <DataContext.Provider value={{ challenges, setChallenges, dailyVibes, setDailyVibes, posts, setPosts, userProgress, setUserProgress, loading: authLoading || loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};


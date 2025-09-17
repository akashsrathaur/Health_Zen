
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Challenge, DailyVibe, CommunityPost } from '@/lib/data';
import { initialChallenges, initialDailyVibes } from '@/lib/data';
import { useAuth } from './auth-context';
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
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [dailyVibes, setDailyVibes] = useState<DailyVibe[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [userProgress, setUserProgress] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (!user) {
        setLoading(false);
        // Reset to initial state when user logs out
        setChallenges([]);
        setDailyVibes([]);
        setPosts([]);
        setUserProgress(null);
        return;
    }

    setLoading(true);

    const userDataRef = doc(db, 'userData', user.uid);
    const unsubscribe = onSnapshot(userDataRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const serverChallenges = data.challenges || [];
            const serverDailyVibes = data.dailyVibes || [];

            setChallenges(serverChallenges);
            setDailyVibes(serverDailyVibes);
            setPosts(data.posts?.sort((a: CommunityPost, b: CommunityPost) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) || []);
            
            const completedTasks = serverDailyVibes.filter((v: DailyVibe) => {
              if (v.id === 'medication') return v.progress === 100;
              return !!v.completedAt;
            }).length;
            
            const completedChallenges = serverChallenges.filter((c: Challenge) => c.isCompletedToday).length;

            setUserProgress({
                streak: user.streak, 
                completedTasks: completedTasks + completedChallenges,
            });

        } else {
            // This case might happen for a brand new user before the doc is created.
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

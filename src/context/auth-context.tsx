
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { getUserFromFirestore } from '@/actions/user';
import type { User } from '@/lib/user-store';
import { defaultUser } from '@/lib/user-store';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { initialChallenges, initialDailyVibes, type Challenge, type DailyVibe, type CommunityPost } from '@/lib/data';

type ProgressState = {
    streak: number;
    completedTasks: number;
};

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  challenges: Challenge[];
  setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
  dailyVibes: DailyVibe[];
  setDailyVibes: React.Dispatch<React.SetStateAction<DailyVibe[]>>;
  posts: CommunityPost[];
  setPosts: React.Dispatch<React.SetStateAction<CommunityPost[]>>;
  userProgress: ProgressState | null;
  setUserProgress: React.Dispatch<React.SetStateAction<ProgressState | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  challenges: [],
  setChallenges: () => {},
  dailyVibes: [],
  setDailyVibes: () => {},
  posts: [],
  setPosts: () => {},
  userProgress: null,
  setUserProgress: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State from old DataContext
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [dailyVibes, setDailyVibes] = useState<DailyVibe[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [userProgress, setUserProgress] = useState<ProgressState | null>(null);
  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userProfile = await getUserFromFirestore(fbUser.uid);
        setUser(userProfile || { ...defaultUser, uid: fbUser.uid, name: "New User" });
      } else {
        setFirebaseUser(null);
        setUser(null);
        // Reset all data states on logout
        setChallenges([]);
        setDailyVibes([]);
        setPosts([]);
        setUserProgress(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
        if (!firebaseUser) { // Only stop loading if we know there is no logged in user
            setLoading(false);
        }
        return;
    }

    const userDataRef = doc(db, 'userData', user.uid);
    const unsubscribeData = onSnapshot(userDataRef, async (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const serverChallenges: Challenge[] = data.challenges || initialChallenges;
            const serverDailyVibes: DailyVibe[] = data.dailyVibes || initialDailyVibes;

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
            // Document doesn't exist, create it for the new user
            await setDoc(userDataRef, {
                dailyVibes: initialDailyVibes,
                challenges: initialChallenges,
                posts: []
            });
            // State will be updated by the next snapshot trigger after creation
        }
        setLoading(false);
    }, (error) => {
        console.error("Error listening to user data:", error);
        setLoading(false);
    });

    return () => unsubscribeData();

  }, [user, firebaseUser]);


  const contextValue = {
    user,
    firebaseUser,
    loading,
    challenges,
    setChallenges,
    dailyVibes,
    setDailyVibes,
    posts,
    setPosts,
    userProgress,
    setUserProgress
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

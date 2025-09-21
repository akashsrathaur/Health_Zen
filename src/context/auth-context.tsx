
/**
 * Health Zen - AI-Powered Personalized Wellness Companion
 * Copyright © 2025 Akash Rathaur. All Rights Reserved.
 * 
 * Authentication Context - Firebase Auth integration
 * Manages user authentication state and profile data
 * 
 * @author Akash Rathaur
 * @email akashsrathaur@gmail.com
 * @website https://github.com/akashsrathaur
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { getUserFromFirestore, updateUserProfile, uploadProfileImage, updateBuddyPersona } from '@/lib/user-utils';
import type { User, BuddyPersona } from '@/lib/user-store';
import { defaultUser } from '@/lib/user-store';
import { doc, onSnapshot, setDoc, collection, query, orderBy } from 'firebase/firestore';
import { initialChallenges, initialDailyVibes, type Challenge, type DailyVibe, type CommunityPost } from '@/lib/data';
import { dailyResetService } from '@/lib/daily-reset-service';
import { handleAppInitialization } from '@/actions/app-opening';

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
  streak: number;
  updateProfile: (updates: Partial<Omit<User, 'uid'>>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  updateBuddy: (buddyPersona: BuddyPersona) => Promise<void>;
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
  streak: 0,
  updateProfile: async () => {},
  uploadAvatar: async () => '',
  updateBuddy: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for user data collections
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [dailyVibes, setDailyVibes] = useState<DailyVibe[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [userProgress, setUserProgress] = useState<ProgressState | null>(null);
  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true); // Always start loading when auth state changes
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userProfile = await getUserFromFirestore(fbUser.uid);
        setUser(userProfile || { ...defaultUser, uid: fbUser.uid, name: "New User" });
        // Initialize daily reset service for this user
        dailyResetService.setUserId(fbUser.uid);
        
        // Handle daily app opening and check for resets
        handleAppInitialization(fbUser.uid).then(async ({ appOpeningResult, resetCheckNeeded }) => {
          if (appOpeningResult.streakUpdated) {
            const updatedUserProfile = await getUserFromFirestore(fbUser.uid);
            if (updatedUserProfile) {
              setUser(updatedUserProfile);
            }
          }
          if (resetCheckNeeded) {
            await dailyResetService.checkAndTriggerResetIfNeeded(fbUser.uid);
            const updatedUserProfile = await getUserFromFirestore(fbUser.uid);
            if (updatedUserProfile) {
              setUser(updatedUserProfile);
            }
          }
        }).catch(error => {
          console.warn('Failed to handle app initialization:', error);
        });
        
        // The data snapshot listener will handle the rest
      } else {
        setFirebaseUser(null);
        setUser(null);
        // Reset all data states on logout
        setChallenges([]);
        setDailyVibes([]);
        setPosts([]);
        setUserProgress(null);
        setLoading(false); // Stop loading on logout
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // If there's no user, we don't need a data listener.
    // The loading state is handled by the auth listener.
    if (!user) {
      if (!firebaseUser) { // Only stop loading if we know for sure there is no logged in user
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
            
            const completedTasks = serverDailyVibes.filter((v: DailyVibe) => {
              if (v.id === 'medication') return v.progress === 100;
              return !!v.completedAt;
            }).length;
            
            const completedChallenges = serverChallenges.filter((c: Challenge) => c.isCompletedToday).length;

            // Use the most up-to-date user data for streak (user state might have been updated by app initialization)
            setUserProgress({
                streak: user.streak || 0, 
                completedTasks: completedTasks + completedChallenges,
            });
        } else {
            // Document doesn't exist, create it for the new user
            try {
              await setDoc(userDataRef, {
                  dailyVibes: initialDailyVibes,
                  challenges: initialChallenges
              });
              // The state will be updated by the next snapshot trigger automatically after creation
            } catch (error) {
              console.error("Failed to create initial user data:", error);
            }
        }
        // We've successfully loaded or created the data. Stop loading.
        setLoading(false);
    }, (error) => {
        console.error("Error listening to user data, possibly due to Firestore rules:", error);
        setLoading(false); // Stop loading even if there's an error
    });

    return () => unsubscribeData();

  }, [user, firebaseUser]);

  // Separate effect for listening to global community posts
  useEffect(() => {
    console.log('Setting up community posts listener');
    const communityPostsRef = collection(db, 'communityPosts');
    const q = query(communityPostsRef, orderBy('timestamp', 'desc'));
    
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      console.log('Community posts snapshot received:', snapshot.size, 'documents');
      const postsData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Post data:', { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data
        };
      }) as CommunityPost[];
      console.log('Setting posts in state:', postsData);
      setPosts(postsData);
    }, (error) => {
      console.error('Error listening to community posts:', error);
      console.error('Error details:', {
        code: (error as any)?.code,
        message: (error as any)?.message
      });
    });

    return () => {
      console.log('Cleaning up community posts listener');
      unsubscribePosts();
    };
  }, []); // No dependencies - this should always be listening

  // Profile update functions
  const handleUpdateProfile = useCallback(async (updates: Partial<Omit<User, 'uid'>>) => {
    if (!user) throw new Error('No user logged in');
    
    await updateUserProfile(user.uid, updates);
    // Update local user state
    setUser(current => current ? { ...current, ...updates } : null);
  }, [user]);

  const handleUploadAvatar = useCallback(async (file: File): Promise<string> => {
    if (!user) throw new Error('No user logged in');
    
    const avatarUrl = await uploadProfileImage(user.uid, file);
    // Update local user state
    setUser(current => current ? { ...current, avatarUrl } : null);
    return avatarUrl;
  }, [user]);

  const handleUpdateBuddy = useCallback(async (buddyPersona: BuddyPersona) => {
    if (!user) throw new Error('No user logged in');
    
    await updateBuddyPersona(user.uid, buddyPersona);
    // Update local user state
    setUser(current => current ? { ...current, buddyPersona } : null);
  }, [user]);

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
    setUserProgress,
    streak: user?.streak || 0,
    updateProfile: handleUpdateProfile,
    uploadAvatar: handleUploadAvatar,
    updateBuddy: handleUpdateBuddy
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

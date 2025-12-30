'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCcw } from 'lucide-react';
import { useState, useEffect, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { defaultUser } from '@/lib/user-store';
import { useNotifications } from '@/hooks/use-notifications';
import { updateDailyVibes as updateDailyVibesAction, updateChallenge as updateChallengeAction, removeDailyVibe as removeDailyVibeAction } from '@/lib/user-utils';
import { updateWaterIntake, updateGymMinutes } from '@/actions/daily-activities';
import { dailyResetService } from '@/lib/daily-reset-service';
import { CameraDialog } from '@/components/ui/camera-dialog';
import { restoreUserData, safeRefreshDailyTasks } from '@/lib/restore-user-data';
import { type Challenge, type DailyVibe, getAchievements, type Achievement } from '@/lib/data';
import { motion } from 'framer-motion';

// Dashboard Components
import { UserGreeting } from '@/components/dashboard/user-greeting';
import { DailyVibesList } from '@/components/dashboard/daily-vibes-list';
import { ChallengeCard } from '@/components/dashboard/challenge-card';
import { AddVibeDialog } from '@/components/dashboard/add-vibe-dialog';
import { EditVibeDialog } from '@/components/dashboard/edit-vibe-dialog';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function DashboardPage() {
  const { user, challenges, setChallenges, dailyVibes, setDailyVibes, loading, userProgress, setUserProgress } = useAuth();
  const userData = user || defaultUser;

  const [isAddVibeOpen, setIsAddVibeOpen] = useState(false);
  const [isEditVibeOpen, setIsEditVibeOpen] = useState(false);
  const [vibeToEdit, setVibeToEdit] = useState<DailyVibe | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [activeVibeId, setActiveVibeId] = useState<string | null>(null);
  const [isSleepLoggingActive, setIsSleepLoggingActive] = useState(false);
  const [timeToUnlockSleep, setTimeToUnlockSleep] = useState(0);
  const [timeToUnlockWater, setTimeToUnlockWater] = useState(0);

  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Daily refresh mechanism
  useEffect(() => {
    async function checkDailyReset() {
      if (!user || !user.uid || user.uid === 'default') return;
      try {
        await dailyResetService.checkAndTriggerResetIfNeeded(user.uid);
      } catch (error) {
        console.warn('Error checking daily reset:', error);
      }
    }
    checkDailyReset();

    // Periodic check every 5 mins
    const checkInterval = setInterval(async () => {
      try {
        if (user && user.uid) await dailyResetService.checkAndTriggerResetIfNeeded(user.uid);
      } catch (error) {
        console.warn('Error in periodic daily reset check:', error);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(checkInterval);
  }, [user]);

  // Achievement Check Logic
  const checkAchievements = (newProgress: { streak: number, completedTasks: number }) => {
    if (!userProgress) return;
    const oldAchievements = getAchievements(userProgress);
    const newAchievements = getAchievements(newProgress);

    const newlyUnlocked = newAchievements.filter(
      (newAch: Achievement) => newAch.unlocked && !oldAchievements.find((oldAch: Achievement) => oldAch.id === newAch.id && oldAch.unlocked)
    );

    newlyUnlocked.forEach((ach: Achievement) => {
      const isStreakAchievement = ach.id.startsWith('streak-');
      let notificationTitle = `You've unlocked the ${ach.name} badge!`;
      let notificationDescription = 'Check your progress on the Tracker page.';

      if (isStreakAchievement) {
        notificationTitle = `🔥 Unstoppable! ${ach.name}`;
        notificationDescription = `${ach.description} Keep the flame alive!`;
      }

      toast({
        title: notificationTitle,
        description: notificationDescription,
      });
      addNotification({
        title: notificationTitle,
        description: notificationDescription,
      });
    });

    setUserProgress(newProgress);
  };

  useEffect(() => {
    const sleepCheckInterval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();

      const startHour = 5;
      const endHour = 7;

      if (currentHour >= startHour && currentHour < endHour) {
        setIsSleepLoggingActive(true);
        setTimeToUnlockSleep(0);
      } else {
        setIsSleepLoggingActive(false);
        let unlockTime = new Date();
        unlockTime.setHours(startHour, 0, 0, 0);

        if (currentHour >= endHour) {
          unlockTime.setDate(unlockTime.getDate() + 1);
        }

        setTimeToUnlockSleep(unlockTime.getTime() - now.getTime());
      }
    }, 1000);

    return () => clearInterval(sleepCheckInterval);
  }, []);

  useEffect(() => {
    const waterVibe = dailyVibes.find(vibe => vibe.id === 'water');
    if (waterVibe && waterVibe.completedAt) {
      const waterCheckInterval = setInterval(() => {
        const now = new Date().getTime();
        const completedTime = new Date(waterVibe.completedAt!).getTime();
        const unlockTime = completedTime + (90 * 60 * 1000); // 1.5 hours in ms
        const remainingTime = unlockTime - now;
        setTimeToUnlockWater(remainingTime);

        if (remainingTime <= 0) {
          setDailyVibes(prev => prev.map(v => v.id === 'water' ? { ...v, completedAt: undefined } : v));
          clearInterval(waterCheckInterval);
        }
      }, 1000);
      return () => clearInterval(waterCheckInterval);
    } else {
      setTimeToUnlockWater(0);
    }
  }, [dailyVibes, setDailyVibes]);

  const handleEditVibe = (vibe: DailyVibe) => {
    if (vibe.id === 'sleep' && !isSleepLoggingActive) {
      toast({
        title: "Sleep Logging Locked",
        description: "You can only log your sleep between 5 AM and 7 AM.",
        variant: "destructive"
      });
      return;
    }
    setVibeToEdit(vibe);
    setIsEditVibeOpen(true);
  }

  const handleSaveVibe = (updatedVibe: DailyVibe) => {
    startTransition(async () => {
      if (!user) return;
      const updatedVibes = dailyVibes.map(v => v.id === updatedVibe.id ? updatedVibe : v);
      setDailyVibes(updatedVibes);
      await updateDailyVibesAction(user.uid, updatedVibes);

      setIsEditVibeOpen(false);
      setVibeToEdit(null);
      toast({
        title: "Daily Vibe Updated",
        description: "Your changes have been saved."
      });
    });
  }

  const handleDeleteVibe = (vibeId: string) => {
    startTransition(async () => {
      if (!user) return;
      const updatedVibes = dailyVibes.filter(v => v.id !== vibeId);
      setDailyVibes(updatedVibes);
      await updateDailyVibesAction(user.uid, updatedVibes);

      setIsEditVibeOpen(false);
      setVibeToEdit(null);
      toast({
        title: "Daily Vibe Removed",
        variant: "destructive"
      });
    });
  }

  const handleAddVibe = (newVibe: DailyVibe) => {
    startTransition(async () => {
      if (!user) return;
      const updatedVibes = [...dailyVibes, newVibe];
      setDailyVibes(updatedVibes);
      await updateDailyVibesAction(user.uid, updatedVibes);

      toast({
        title: "New Vibe Added!",
        description: `'${newVibe.title}' has been added to your daily tasks.`
      });
    });
  }

  const handleMarkChallengeAsDone = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.isCompletedToday) {
      setActiveChallengeId(challengeId);
      setActiveVibeId(null);
      setIsCameraOpen(true);
    }
  };

  const handleMarkVibeAsDone = (vibeId: string) => {
    const vibe = dailyVibes.find(v => v.id === vibeId);

    // Special handling for water intake - use camera verification
    if (vibe && vibe.id === 'water') {
      setActiveVibeId(vibeId);
      setActiveChallengeId(null);
      setIsCameraOpen(true);
      return;
    }

    // Special handling for gym workout
    if (vibe && vibe.id === 'gym') {
      startTransition(async () => {
        if (!user) return;
        const current = parseInt(vibe.value.split('/')[0]);
        const newValue = Math.min(current + 5, 30); // Add 5 minutes, max 30
        const newProgress = Math.min((newValue / 20) * 100, 100);

        const updatedVibe = {
          ...vibe,
          value: `${newValue}/20 minutes`,
          progress: newProgress,
          completedAt: newValue >= 20 ? new Date().toISOString() : undefined
        };

        const updatedVibes = dailyVibes.map(v => v.id === vibeId ? updatedVibe : v);
        setDailyVibes(updatedVibes);

        try {
          await updateGymMinutes(user.uid, newValue);
          await updateDailyVibesAction(user.uid, updatedVibes);

          toast({
            title: `Workout logged! 💪`,
            description: `You've worked out for ${newValue} minutes today. ${newValue >= 20 ? 'Daily goal achieved!' : `${20 - newValue} more minutes to go!`}`
          });
        } catch (error) {
          console.error('Error updating gym minutes:', error);
          toast({
            title: 'Update failed',
            description: 'Could not update workout time. Please try again.',
            variant: 'destructive'
          });
        }
      });
      return;
    }

    if (vibe && !vibe.completedAt && vibe.id !== 'medication' && vibe.id !== 'water' && vibe.id !== 'gym') {
      setActiveVibeId(vibeId);
      setActiveChallengeId(null);
      setIsCameraOpen(true);
    } else if (vibe && vibe.id === 'medication' && vibe.medicationConfig) {
      const config = vibe.medicationConfig;
      const now = new Date();
      const canTakeDose = !config.lastDoseTime ||
        (now.getTime() - new Date(config.lastDoseTime).getTime()) >= (config.intervalHours * 60 * 60 * 1000);

      if (!canTakeDose) {
        const nextDoseTime = new Date(new Date(config.lastDoseTime!).getTime() + (config.intervalHours * 60 * 60 * 1000));
        const timeUntilNext = Math.ceil((nextDoseTime.getTime() - now.getTime()) / (60 * 1000));
        toast({
          title: "Too early for next dose",
          description: `Please wait ${timeUntilNext} minutes before taking the next dose.`,
          variant: "destructive"
        });
        return;
      }

      startTransition(async () => {
        if (!user || !userProgress) return;
        const newDosesTaken = config.dosesTaken + 1;
        const isFullyCompleted = newDosesTaken >= config.dailyDoses;
        const newProgress = Math.min((newDosesTaken / config.dailyDoses) * 100, 100);

        const updatedVibe = {
          ...vibe,
          progress: newProgress,
          value: isFullyCompleted ? 'All doses taken' : `${newDosesTaken}/${config.dailyDoses} doses`,
          completedAt: isFullyCompleted ? new Date().toISOString() : undefined,
          medicationConfig: {
            ...config,
            dosesTaken: newDosesTaken,
            lastDoseTime: now.toISOString()
          }
        };

        const updatedVibes = dailyVibes.map(v => v.id === vibeId ? updatedVibe : v);
        setDailyVibes(updatedVibes);
        await updateDailyVibesAction(user.uid, updatedVibes);

        toast({
          title: 'Dose taken!',
          description: isFullyCompleted ?
            'All daily doses completed.' :
            `${newDosesTaken} of ${config.dailyDoses} doses taken today.`
        });

        const newUserProgress = { ...userProgress, completedTasks: userProgress.completedTasks + 1 };
        checkAchievements(newUserProgress);
      });
    }
  };

  const handleManualReset = async () => {
    if (!user) return;
    try {
      const result = await safeRefreshDailyTasks(user.uid);
      if (result.success) {
        toast({
          title: "Daily Tasks Refreshed",
          description: "Your daily progress has been reset while preserving your challenges and custom tasks.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh daily tasks. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRestoreData = async () => {
    if (!user) return;
    try {
      const result = await restoreUserData(user.uid);
      if (result.success) {
        toast({
          title: "Data Restored",
          description: "Your challenges and daily tasks have been restored.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Restore Failed",
        description: "Failed to restore your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageCaptured = (imageDataUrl: string) => {
    startTransition(async () => {
      if (!user || !userProgress) return;
      let completedSomething = false;

      if (activeChallengeId) {
        const challenge = challenges.find(c => c.id === activeChallengeId);
        if (challenge) {
          completedSomething = true;
          const updatedChallenge = { ...challenge, isCompletedToday: true, currentDay: challenge.currentDay + 1 };
          setChallenges(prev => prev.map(c => c.id === activeChallengeId ? updatedChallenge : c));
          await updateChallengeAction(user.uid, updatedChallenge);

          toast({
            title: "Streak Continued!",
            description: `You've completed '${challenge.title}' for today. Keep it up!`
          });
        }
      } else if (activeVibeId) {
        const vibe = dailyVibes.find(v => v.id === activeVibeId);
        if (vibe) {
          completedSomething = true;
          if (vibe.id === 'water') {
            const current = parseInt(vibe.value.split('/')[0]);
            const newValue = Math.min(current + 1, 8);
            const newProgress = Math.min((newValue / 8) * 100, 100);

            const updatedVibe = {
              ...vibe,
              value: `${newValue}/8 glasses`,
              progress: newProgress,
              completedAt: new Date().toISOString()
            };

            const updatedVibes = dailyVibes.map(v => v.id === activeVibeId ? updatedVibe : v);
            setDailyVibes(updatedVibes);

            try {
              await updateWaterIntake(user.uid, newValue);
              await updateDailyVibesAction(user.uid, updatedVibes);

              const today = new Date().toLocaleDateString('en-CA');
              if (newValue === 1 && user.lastActivityDate !== today) {
                const currentStreak = user.streak || 0;
                // Logic for streak update (simplified for brevity as main logic is in backend usually, but here client does it)
                // ... (Keeping logic intact)
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toLocaleDateString('en-CA');

                let newStreak = currentStreak;
                if (currentStreak === 0) {
                  newStreak = 1;
                } else if (user.lastActivityDate === yesterdayStr) {
                  newStreak = currentStreak + 1;
                } else {
                  newStreak = 1;
                }

                const newUserProgress = { ...userProgress, streak: newStreak };
                setUserProgress(newUserProgress);
                checkAchievements(newUserProgress);
              }

              toast({
                title: `Water logged! 💧`,
                description: `You've had ${newValue} glasses today.`
              });
            } catch (error) {
              console.error('Error updating water:', error);
              await updateDailyVibesAction(user.uid, updatedVibes);
              toast({ title: `Water logged! (Local)`, description: `Recorded ${newValue} glasses.` });
            }
          } else {
            const updatedVibe = { ...vibe, completedAt: new Date().toISOString(), progress: 100 };
            const updatedVibes = dailyVibes.map(v => v.id === activeVibeId ? updatedVibe : v);
            setDailyVibes(updatedVibes);
            await updateDailyVibesAction(user.uid, updatedVibes);

            toast({
              title: 'Task Completed!',
              description: `You've successfully completed '${vibe.title}'.`
            });
          }
        }
      }

      if (completedSomething) {
        const newProgress = { ...userProgress, completedTasks: userProgress.completedTasks + 1 };
        checkAchievements(newProgress);
      }

      setIsCameraOpen(false);
      setActiveChallengeId(null);
      setActiveVibeId(null);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-pop-in">
      <UserGreeting user={user} />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className='lg:col-span-1'>
          <DailyVibesList
            dailyVibes={dailyVibes}
            onRestore={handleRestoreData}
            onRefresh={handleManualReset}
            onAddVibe={() => setIsAddVibeOpen(true)}
            onEditVibe={handleEditVibe}
            onMarkAsDone={handleMarkVibeAsDone}
            isSleepLoggingActive={isSleepLoggingActive}
            timeToUnlockSleep={timeToUnlockSleep}
            timeToUnlockWater={timeToUnlockWater}
            isPending={isPending}
          />
        </div>
        <div className="lg:col-span-2">
          <section className="space-y-4">
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
              <h2 className="text-lg sm:text-xl font-semibold text-glow">Your Challenges</h2>
              <Button variant="ghost" asChild size="sm" className="self-start sm:self-auto glass-button bg-transparent hover:bg-primary/10">
                <Link href="/challenges" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                  <ArrowRight className='ml-2 h-3 w-3 sm:h-4 sm:w-4' />
                </Link>
              </Button>
            </div>
            <motion.div
              className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {challenges.slice(0, 2).map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} onMarkAsDone={handleMarkChallengeAsDone} />
              ))}
            </motion.div>
          </section>
        </div>
      </div>



      {/* Coming Soon Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div className="w-full">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="glass-panel relative overflow-hidden rounded-xl p-8 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50" />
            <div className="relative z-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 backdrop-blur-sm shadow-glow">
                <div className="text-2xl animate-bounce">🚀</div>
              </div>
              <h3 className="mb-3 text-2xl font-bold gradient-text">
                Exciting Features Coming Soon!
              </h3>
              <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
                We're working hard to bring you amazing new features including AI-powered meal planning,
                personalized workout routines, community challenges, and advanced health analytics.
                Stay tuned for updates!
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 rounded-full bg-background/50 px-4 py-2 backdrop-blur-sm border border-white/5">
                  <span className="h-2 w-2 rounded-full bg-green-500 shadow-glow-sm"></span>
                  AI Meal Planning
                </div>
                <div className="flex items-center gap-2 rounded-full bg-background/50 px-4 py-2 backdrop-blur-sm border border-white/5">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shadow-glow-sm"></span>
                  Smart Workouts
                </div>
                <div className="flex items-center gap-2 rounded-full bg-background/50 px-4 py-2 backdrop-blur-sm border border-white/5">
                  <span className="h-2 w-2 rounded-full bg-purple-500 shadow-glow-sm"></span>
                  Health Analytics
                </div>
              </div>
              <div className="mt-6 text-xs text-muted-foreground">
                Expected Launch: Q1 2026 • Join our beta program for early access!
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AddVibeDialog
        isOpen={isAddVibeOpen}
        onClose={() => setIsAddVibeOpen(false)}
        onAdd={handleAddVibe}
      />
      <EditVibeDialog
        isOpen={isEditVibeOpen}
        onClose={() => setIsEditVibeOpen(false)}
        vibe={vibeToEdit}
        onSave={handleSaveVibe}
        onDelete={handleDeleteVibe}
        userData={userData}
        userProgress={userProgress}
        onAchievementsCheck={checkAchievements}
      />
      <CameraDialog
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onImageCaptured={handleImageCaptured}
        title="Upload Proof"
        confirmText="Continue Streak"
      />
    </div>
  );
}

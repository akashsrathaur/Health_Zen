
/**
 * Health Zen - AI-Powered Personalized Wellness Companion
 * Copyright © 2025 Akash Rathaur. All Rights Reserved.
 * 
 * Progress Tracker Page - Visual analytics and wellness metrics
 * Features comprehensive wellness tracking with charts and progress visualization
 * 
 * @author Akash Rathaur
 * @email akashsrathaur@gmail.com
 * @website https://github.com/akashsrathaur
 */

'use client';
import { Balancer } from 'react-wrap-balancer';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getAchievements, type Achievement } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, Flame, Share2, Loader2, CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Icon } from '@/lib/icon-resolver';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { exportReportAsImage, shareReport } from '@/lib/export-report';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Icons } from '@/components/icons';
import { useAuth } from '@/context/auth-context';
import { defaultUser } from '@/lib/user-store';
import { getUserProgressData, type UserProgress } from '@/lib/user-progress';
import { format } from 'date-fns';
import { getTodayActivity, type DailyActivity } from '@/actions/daily-activities';
import { getWeeklyHistoricalData, type DailyHistoricalData } from '@/actions/daily-history';

const waterChartConfig = {
  glasses: {
    label: 'Glasses',
    color: 'hsl(var(--chart-1))',
  },
  goal: {
    label: 'Goal',
    color: 'hsl(var(--foreground))'
  }
} satisfies ChartConfig;

const sleepChartConfig = {
  hours: {
    label: 'Hours',
    color: 'hsl(var(--chart-2))',
  },
  goal: {
    label: 'Goal',
    color: 'hsl(var(--foreground))'
  }
} satisfies ChartConfig;

const gymChartConfig = {
  minutes: {
    label: 'Minutes',
    color: 'hsl(var(--chart-3))',
  },
  goal: {
    label: 'Goal',
    color: 'hsl(var(--foreground))'
  }
} satisfies ChartConfig;

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

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const iconColor = achievement.unlocked ? 'text-yellow-400' : 'text-muted-foreground';
  const iconGlow = achievement.unlocked ? 'drop-shadow-[0_2px_4px_rgba(250,204,21,0.5)]' : '';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {achievement.unlocked ? (
            <div className="gradient-border-card h-full">
              <Card className={cn(
                "gradient-border-card-inner flex flex-col items-center justify-center p-4 text-center transition-all duration-300 h-full cursor-pointer",
                'hover:shadow-lg'
              )}>
                <Icon name={achievement.icon} className={cn("h-8 w-8 mb-2 transition-all duration-300", iconColor, iconGlow)} />
                <p className="text-sm font-semibold">{achievement.name}</p>
                {!achievement.unlocked && <p className="text-xs text-muted-foreground">Locked</p>}
              </Card>
            </div>
          ) : (
            <Card className={cn(
              "flex flex-col items-center justify-center p-4 text-center transition-all duration-300 h-full cursor-pointer",
              'opacity-60 grayscale hover:opacity-80 hover:grayscale-0'
            )}>
              <Icon name={achievement.icon} className={cn("h-8 w-8 mb-2 transition-all duration-300", iconColor, iconGlow)} />
              <p className="text-sm font-semibold">{achievement.name}</p>
              {!achievement.unlocked && <p className="text-xs text-muted-foreground">Locked</p>}
            </Card>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p className='max-w-xs'>{achievement.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function ProgressTrackerPage() {
  const { toast } = useToast();
  const { user, dailyVibes, userProgress: liveUserProgress } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [todayActivity, setTodayActivity] = useState<DailyActivity | null>(null);
  const [weeklyHistoricalData, setWeeklyHistoricalData] = useState<{ [date: string]: DailyHistoricalData | null }>({});

  // Use live user data from auth context instead of static data
  const userData = user || { ...defaultUser, uid: 'default' };
  const userProgress = liveUserProgress || { streak: userData.streak || 0, completedTasks: 0 };

  // Fetch real activity data from Firebase on component mount and when user changes
  useEffect(() => {
    async function fetchTodayActivity() {
      if (userData.uid && userData.uid !== 'default') {
        try {
          const activity = await getTodayActivity(userData.uid);
          setTodayActivity(activity);
        } catch (error) {
          console.error('Error fetching today activity:', error);
        }
      }
    }

    fetchTodayActivity();
  }, [userData.uid]);

  // Fetch historical data for the selected week
  useEffect(() => {
    async function fetchWeeklyHistoricalData() {
      if (userData.uid && userData.uid !== 'default') {
        try {
          // Generate dates for the last 7 days from selected date
          const dates = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString('en-CA')); // YYYY-MM-DD format
          }

          const historicalData = await getWeeklyHistoricalData(userData.uid, dates);
          setWeeklyHistoricalData(historicalData);
        } catch (error) {
          console.error('Error fetching weekly historical data:', error);
        }
      }
    }

    fetchWeeklyHistoricalData();
  }, [userData.uid, selectedDate]);

  // Generate date labels for the last 7 days from selected date
  const generateLast7Days = (fromDate: Date = selectedDate) => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(fromDate);
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
  };

  // Get real historical data for the selected week using saved data from dailyHistory
  const getRealHistoricalData = (fromDate: Date) => {
    const today = new Date();
    const todayDateStr = today.toLocaleDateString('en-CA');

    // Initialize arrays with zeros
    const waterData = [0, 0, 0, 0, 0, 0, 0];
    const sleepData = [0, 0, 0, 0, 0, 0, 0];
    const gymData = [0, 0, 0, 0, 0, 0, 0];

    // Generate dates for the last 7 days from selected date
    for (let i = 6; i >= 0; i--) {
      const date = new Date(fromDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-CA');
      const dayIndex = 6 - i;

      if (dateStr === todayDateStr) {
        // For today, use live data (current activities)
        if (todayActivity) {
          waterData[dayIndex] = Math.max(0, Math.min(todayActivity.waterIntake || 0, 8));
          sleepData[dayIndex] = Math.max(0, Math.min(todayActivity.sleepHours || 0, 12));
          gymData[dayIndex] = Math.max(0, Math.min(todayActivity.gymMinutes || 0, 120));
        } else {
          // Fallback to parsing from daily vibes data for today
          const liveWaterVibe = dailyVibes.find(vibe => vibe.id === 'water');
          const liveSleepVibe = dailyVibes.find(vibe => vibe.id === 'sleep');
          const liveGymVibe = dailyVibes.find(vibe => vibe.id === 'gym');

          if (liveWaterVibe?.value) {
            const waterMatch = liveWaterVibe.value.match(/^(\d+)/);
            waterData[dayIndex] = Math.max(0, Math.min(parseInt(waterMatch?.[1] || '0'), 8));
          }

          if (liveSleepVibe?.value) {
            const sleepMatch = liveSleepVibe.value.match(/^([\d.]+)/);
            sleepData[dayIndex] = Math.max(0, Math.min(parseFloat(sleepMatch?.[1] || '0'), 12));
          }

          if (liveGymVibe?.value) {
            const gymMatch = liveGymVibe.value.match(/^(\d+)/);
            gymData[dayIndex] = Math.max(0, Math.min(parseInt(gymMatch?.[1] || '0'), 120));
          }
        }
      } else {
        // For past days, use historical data from dailyHistory collection
        const historicalData = weeklyHistoricalData[dateStr];
        if (historicalData) {
          waterData[dayIndex] = Math.max(0, Math.min(historicalData.activities.waterIntake || 0, 8));
          sleepData[dayIndex] = Math.max(0, Math.min(historicalData.activities.sleepHours || 0, 12));
          gymData[dayIndex] = Math.max(0, Math.min(historicalData.activities.gymMinutes || 0, 120));
        }
        // If no historical data exists for this date, it remains 0 (which is correct)
      }
    }

    return {
      water: waterData,
      sleep: sleepData,
      gym: gymData
    };
  };

  const days = generateLast7Days(selectedDate);
  const dateData = getRealHistoricalData(selectedDate);

  // Get current values from live daily vibes data
  const waterVibe = dailyVibes.find(vibe => vibe.id === 'water');
  const sleepVibe = dailyVibes.find(vibe => vibe.id === 'sleep');
  const gymVibe = dailyVibes.find(vibe => vibe.id === 'gym');

  // Parse current values from live data - prioritize Firebase data over daily vibes
  const currentWater = todayActivity?.waterIntake ? todayActivity.waterIntake :
    (waterVibe?.value ? parseInt(waterVibe.value.match(/^(\d+)/)?.[1] || '0') : 0);
  const currentSleep = todayActivity?.sleepHours ? todayActivity.sleepHours :
    (sleepVibe?.value ? parseFloat(sleepVibe.value.match(/^([\d.]+)/)?.[1] || '0') : 0);
  const currentGym = todayActivity?.gymMinutes ? todayActivity.gymMinutes :
    (gymVibe?.value ? parseInt(gymVibe.value.match(/^(\d+)/)?.[1] || '0') : 0);

  // Calculate daily points from completed vibes (real-time sync)
  const completedVibes = dailyVibes.filter(vibe => {
    if (vibe.id === 'medication') return vibe.progress === 100;
    return !!vibe.completedAt;
  });
  const dailyPoints = Math.min(completedVibes.length * 5, 30); // 5 points per completed vibe, max 30
  const totalPoints = (userProgress.streak * 10) + dailyPoints;

  const waterChartData = days.map((day, i) => ({
    day,
    glasses: dateData.water[i] || 0
  }));
  const sleepChartData = days.map((day, i) => ({
    day,
    hours: dateData.sleep[i] || 0
  }));
  const gymChartData = days.map((day, i) => ({
    day,
    minutes: dateData.gym[i] || 0
  }));

  // Get achievements based on live progress data
  const achievements = getAchievements({ streak: userProgress.streak, completedTasks: userProgress.completedTasks });
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      await exportReportAsImage('progress-report', 'health-zen-progress-report');
      toast({
        title: 'Report Exported!',
        description: 'Your progress report has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Unable to export report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareReport = async () => {
    setIsExporting(true);
    try {
      await shareReport('progress-report', `Check out my wellness progress! 🌟 ${totalPoints} points earned and ${userProgress.streak} day streak! #HealthZen`);
    } catch (error) {
      toast({
        title: 'Share Failed',
        description: 'Unable to share report. It has been downloaded instead.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8" id="progress-report">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="font-headline text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-glow">Progress Tracker</h1>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mt-1">
                  <Balancer>Visualize your wellness journey and celebrate your milestones.</Balancer>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="gradient"
                  onClick={handleShareReport}
                  disabled={isExporting}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                  size="sm"
                >
                  {isExporting ? (
                    <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Share2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  <span className="hidden xs:inline">Share Report</span>
                  <span className="xs:hidden">Share</span>
                </Button>
                <Button
                  variant="gradient"
                  onClick={handleExportReport}
                  disabled={isExporting}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                  size="sm"
                >
                  {isExporting ? (
                    <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  <span className="hidden xs:inline">Export Report</span>
                  <span className="xs:hidden">Export</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(selectedDate.getDate() - 7);
                    setSelectedDate(newDate);
                  }}
                  className="flex-shrink-0"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] sm:w-[200px] justify-start text-left font-normal text-xs sm:text-sm flex-shrink-0",
                        !selectedDate && "text-muted-foreground"
                      )}
                      size="sm"
                    >
                      <CalendarIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">
                        {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Pick a date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setIsDatePickerOpen(false);
                        }
                      }}
                      disabled={(date) => date > new Date() || date < new Date("2024-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(selectedDate.getDate() + 7);
                    if (newDate <= new Date()) {
                      setSelectedDate(newDate);
                    }
                  }}
                  disabled={(() => {
                    const nextWeek = new Date(selectedDate);
                    nextWeek.setDate(selectedDate.getDate() + 7);
                    return nextWeek > new Date();
                  })()}
                  className="flex-shrink-0"
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground">
                Week ending: {format(selectedDate, "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <Icons.points className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-300">{totalPoints} pts</p>
                <p className="text-xs text-amber-600 dark:text-amber-500">({dailyPoints}/30)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
              <Icons.streak className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-orange-700 dark:text-orange-300">{userProgress.streak}</p>
                <p className="text-xs text-orange-600 dark:text-orange-500">streak</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <Icons.points className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">{userProgress.completedTasks}</p>
                <p className="text-xs text-blue-600 dark:text-blue-500">tasks</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <Icon name="Dumbbell" className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">{currentGym}</p>
                <p className="text-xs text-green-600 dark:text-green-500">min</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-border h-full">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg lg:text-xl">Water Intake</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Last 7 days (Goal: 8 glasses) | Today: {currentWater}/8</span>
                <span className="sm:hidden">7 days | {currentWater}/8</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={waterChartConfig} className="h-40 sm:h-48 lg:h-64 w-full">
                <BarChart accessibilityLayer data={waterChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} fontSize={10} />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="glasses" fill="var(--color-glasses)" radius={4} maxBarSize={20} />
                  <ReferenceLine y={8} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-sm border-border h-full flex flex-col items-center justify-center min-h-[180px] sm:min-h-[200px] lg:min-h-[250px] relative overflow-hidden bg-primary/5 dark:bg-primary/10">
            <CardHeader className="items-center text-center pb-2 relative z-10">
              <CardTitle className='text-primary text-base sm:text-lg lg:text-xl font-semibold'>Current Streak</CardTitle>
              <Flame className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-primary" />
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <p className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground">{userProgress.streak}</p>
              <p className="text-center font-medium text-muted-foreground text-xs sm:text-sm lg:text-base">days</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Sleep Duration</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Last 7 days (Goal: 8 hours) | Today: {currentSleep}h</span>
              <span className="sm:hidden">7 days | Today: {currentSleep}h</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sleepChartConfig} className="h-48 sm:h-64 w-full">
              <LineChart accessibilityLayer data={sleepChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} fontSize={12} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="hours" stroke="var(--color-hours)" strokeWidth={2} dot={false} />
                <ReferenceLine y={8} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Gym Workouts</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Last 7 days (Goal: 20 minutes) | Today: {currentGym} min</span>
              <span className="sm:hidden">7 days | Today: {currentGym} min</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={gymChartConfig} className="h-48 sm:h-64 w-full">
              <BarChart accessibilityLayer data={gymChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} fontSize={12} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="minutes" fill="var(--color-minutes)" radius={4} maxBarSize={20} />
                <ReferenceLine y={20} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Badges Unlocked</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            You've unlocked {unlockedAchievements} of {totalAchievements} badges. Keep going!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {achievements.map((ach) => (
              <motion.div key={ach.id} variants={itemVariants}>
                <AchievementCard achievement={ach} />
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}



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
import { Download, Flame, Share2, Loader2 } from 'lucide-react';
import { Icon } from '@/lib/icon-resolver';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { exportReportAsImage, shareReport } from '@/lib/export-report';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Icons } from '@/components/icons';
import { useAuth } from '@/context/auth-context';
import { defaultUser } from '@/lib/user-store';
import { getUserProgressData, type UserProgress } from '@/lib/user-progress';

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
            <Card className={cn(
              "flex flex-col items-center justify-center p-4 text-center transition-all duration-300 h-full cursor-pointer",
              achievement.unlocked
                ? 'bg-gradient-to-br from-secondary to-background/50 border-primary/20'
                : 'opacity-60 grayscale hover:opacity-80 hover:grayscale-0'
            )}>
              <Icon name={achievement.icon} className={cn("h-8 w-8 mb-2 transition-all duration-300", iconColor, iconGlow)} />
              <p className="text-sm font-semibold">{achievement.name}</p>
              {!achievement.unlocked && <p className="text-xs text-muted-foreground">Locked</p>}
            </Card>
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
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  
  // Get real user data instead of fake data - handle missing uid for defaultUser
  const userData = user || { ...defaultUser, uid: 'default' };
  const userProgress = getUserProgressData(userData);
  
  // Generate proper date labels for the last 7 days
  const generateLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
  };
  
  const days = generateLast7Days();
  const waterChartData = days.map((day, i) => ({ 
    day, 
    glasses: userProgress.weeklyWaterData[i] 
  }));
  const sleepChartData = days.map((day, i) => ({ 
    day, 
    hours: userProgress.weeklySleepData[i] 
  }));
  const gymChartData = days.map((day, i) => ({ 
    day, 
    minutes: userProgress.weeklyGymData[i] 
  }));
  
  // Get achievements based on real progress
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
      await shareReport('progress-report', `Check out my wellness progress! 🌟 ${userProgress.totalPoints} points earned and ${userProgress.streak} day streak! #HealthZen`);
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
    <div className="flex flex-col gap-8" id="progress-report">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-glow">Progress Tracker</h1>
          <p className="text-muted-foreground">
            <Balancer>Visualize your wellness journey and celebrate your milestones.</Balancer>
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <Icons.points className="h-4 w-4" />
              <span className="font-semibold">{userProgress.totalPoints} points</span>
              <span className="text-muted-foreground">({userProgress.dailyPoints}/30 today)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
              <Icons.streak className="h-4 w-4" />
              <span className="font-semibold">{userProgress.streak} day streak</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <Icons.points className="h-4 w-4" />
              <span className="font-semibold">{userProgress.completedTasks} tasks completed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Icon name="Dumbbell" className="h-4 w-4" />
              <span className="font-semibold">{userProgress.gymMinutes} min gym today</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            onClick={handleShareReport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Share2 className="mr-2 h-4 w-4" />
            )}
            Share Report
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExportReport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Water Intake</CardTitle>
            <CardDescription>Last 7 days (Goal: {userProgress.waterGoal} glasses) | Today: {userProgress.waterIntake}/{userProgress.waterGoal}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={waterChartConfig} className="h-64 w-full">
              <BarChart accessibilityLayer data={waterChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="glasses" fill="var(--color-glasses)" radius={4} maxBarSize={24} />
                <ReferenceLine y={userProgress.waterGoal} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-accent to-yellow-400 dark:from-[#F15BB5] dark:to-[#FEE440]">
          <CardHeader className="items-center text-center">
            <CardTitle className='text-card-foreground dark:text-black'>Current Streak</CardTitle>
            <Flame className="h-16 w-16 text-white" />
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold text-white animate-bounce-in">{userProgress.streak}</p>
            <p className="text-center font-medium text-white/80">days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sleep Duration</CardTitle>
            <CardDescription>Last 7 days (Goal: {userProgress.sleepGoal} hours) | Today: {userProgress.sleepHours}h</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sleepChartConfig} className="h-64 w-full">
              <LineChart accessibilityLayer data={sleepChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="hours" stroke="var(--color-hours)" strokeWidth={2} dot={false} />
                <ReferenceLine y={userProgress.sleepGoal} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gym Workouts</CardTitle>
            <CardDescription>Last 7 days (Goal: {userProgress.gymGoal} minutes) | Today: {userProgress.gymMinutes} min</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={gymChartConfig} className="h-64 w-full">
              <BarChart accessibilityLayer data={gymChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="minutes" fill="var(--color-minutes)" radius={4} maxBarSize={24} />
                <ReferenceLine y={userProgress.gymGoal} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badges Unlocked</CardTitle>
          <CardDescription>
            You've unlocked {unlockedAchievements} of {totalAchievements} badges. Keep going!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5"
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

    
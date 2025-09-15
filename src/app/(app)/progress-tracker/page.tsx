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
import { achievements, progressData, type Achievement } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Download, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
  return (
    <Card className={`flex flex-col items-center justify-center p-4 text-center transition-all duration-300 ${!achievement.unlocked ? 'opacity-50 grayscale' : 'hover:bg-secondary/80'}`}>
      <achievement.icon className={`h-8 w-8 mb-2 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
      <p className="text-sm font-semibold">{achievement.name}</p>
      {!achievement.unlocked && <p className="text-xs text-muted-foreground">Locked</p>}
    </Card>
  )
}

export default function ProgressTrackerPage() {
  const waterChartData = progressData.water.labels.map((label, i) => ({ day: label, glasses: progressData.water.data[i] }));
  const sleepChartData = progressData.sleep.labels.map((label, i) => ({ day: label, hours: progressData.sleep.data[i] }));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Progress Tracker</h1>
          <p className="text-muted-foreground">
            <Balancer>Visualize your wellness journey and celebrate your milestones.</Balancer>
          </p>
        </div>
        <Button variant="outline" className="mt-4 sm:mt-0">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Water Intake</CardTitle>
            <CardDescription>Last 7 days (Goal: {progressData.water.goal} glasses)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={waterChartConfig} className="h-64 w-full">
              <BarChart accessibilityLayer data={waterChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="glasses" fill="var(--color-glasses)" radius={4} />
                <ReferenceLine y={progressData.water.goal} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center bg-gradient-to-br from-[#F15BB5] to-[#FEE440] dark:from-[#F15BB5] dark:to-[#FEE440]">
          <CardHeader className="items-center text-center">
            <CardTitle className='text-card'>Current Streak</CardTitle>
            <Flame className="h-16 w-16 text-white" />
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold text-white animate-bounce-in">{progressData.streak}</p>
            <p className="text-center font-medium text-white/80">days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Sleep Duration</CardTitle>
            <CardDescription>Last 7 days (Goal: {progressData.sleep.goal} hours)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sleepChartConfig} className="h-64 w-full">
              <LineChart accessibilityLayer data={sleepChartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="hours" stroke="var(--color-hours)" strokeWidth={2} dot={false} />
                <ReferenceLine y={progressData.sleep.goal} stroke="hsl(var(--foreground))" strokeDasharray="3 3" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges Unlocked</CardTitle>
          <CardDescription>Celebrate your achievements!</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
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

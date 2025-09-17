
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Balancer } from 'react-wrap-balancer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dailyVibes, userData, challenges, type Challenge } from '@/lib/data';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

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

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const progress = (challenge.currentDay / challenge.goalDays) * 100;

  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden flex flex-col h-full">
        <div className="relative h-40 w-full">
          <Image
            src={challenge.imageUrl}
            alt={challenge.title}
            fill
            className="object-cover"
            data-ai-hint={challenge.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
          </div>
        </div>
        <CardContent className="p-4 flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Day {challenge.currentDay} of {challenge.goalDays}</span>
            {challenge.isCompletedToday && (
              <div className="flex items-center gap-1 text-sm text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span>Done!</span>
              </div>
            )}
          </div>
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{challenge.description}</p>
        </CardContent>
         <CardFooter className='p-4 pt-0'>
            <Link href={`/challenges`} className='w-full'>
                <Button variant='secondary' className='w-full'>
                    View Challenge
                </Button>
            </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}


export default function DashboardPage() {
  const acceptedChallenges = challenges.slice(0, 3); // Show first 3 for brevity

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground text-glow-purple">
          Welcome back, <span>{userData.name.split(' ')[0]}!</span>
        </h1>
        <p className="text-muted-foreground">
          <Balancer>Here's your wellness summary for today. Keep up the great work!</Balancer>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <section>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className="text-xl font-semibold">Accepted Challenges</h2>
                    <Button variant="ghost" asChild>
                        <Link href="/challenges">View All <ArrowRight className='ml-2 h-4 w-4'/></Link>
                    </Button>
                </div>
                <motion.div 
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                    {acceptedChallenges.map((challenge) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </motion.div>
            </section>
        </div>
        <div className='lg:col-span-1'>
            <section>
                <h2 className="mb-4 text-xl font-semibold">Daily Vibe</h2>
                <motion.div 
                  className="grid grid-cols-1 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                    {dailyVibes.map((vibe) => (
                      <motion.div key={vibe.title} variants={itemVariants}>
                        <Card className="flex items-center p-4 transition-all duration-200 hover:bg-secondary/10">
                            <vibe.icon className="mr-4 h-8 w-8 text-primary" />
                            <div className="flex-1">
                            <p className="font-medium">{vibe.title}</p>
                            <p className="text-sm text-muted-foreground">{vibe.value}</p>
                            </div>
                            {vibe.progress !== undefined && <Progress value={vibe.progress} className="w-20" />}
                        </Card>
                      </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
      </div>
    </div>
  );
}

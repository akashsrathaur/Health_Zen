'use client';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dailyVibes, quickActions, userData } from '@/lib/data';
import { motion } from 'framer-motion';

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <section>
                <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
                <motion.div 
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                    {quickActions.map((action) => (
                    <motion.div key={action.title} variants={itemVariants}>
                      <Link href={action.href} className="group block h-full">
                          <div className="h-full rounded-lg p-px bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 transition-all duration-300 group-hover:from-primary/50 group-hover:via-secondary/50 group-hover:to-accent/50 group-hover:shadow-xl">
                            <Card className="h-full transform transition-all duration-300 group-hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-none">
                              <CardHeader>
                                  <div className="mb-2 flex items-center gap-3">
                                  <div className="rounded-lg bg-white/5 p-3 transition-colors">
                                      <action.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary/80" />
                                  </div>
                                  <CardTitle className="text-lg text-foreground/90 transition-colors group-hover:text-foreground">{action.title}</CardTitle>
                                  </div>
                                  <CardDescription>{action.description}</CardDescription>
                              </CardHeader>
                            </Card>
                          </div>
                      </Link>
                    </motion.div>
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

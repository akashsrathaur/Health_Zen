import Link from 'next/link';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Icon } from '@/lib/icon-resolver';
import { motion } from 'framer-motion';
import { type Challenge } from '@/lib/data';

interface ChallengeCardProps {
    challenge: Challenge;
    onMarkAsDone: (challengeId: string) => void;
}

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

export function ChallengeCard({ challenge, onMarkAsDone }: ChallengeCardProps) {
    const progress = (challenge.currentDay / challenge.goalDays) * 100;

    return (
        <motion.div variants={itemVariants} className="h-full">
            <div className="gradient-border-card h-full">
                <Card className="gradient-border-card-inner flex flex-col h-full transition-all duration-200 hover:bg-secondary/10">
                    <Link href={`/challenges`} className='flex flex-col flex-grow'>
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                            <Icon name={challenge.icon} className="h-8 w-8 text-primary" />
                            <div className="flex-1 space-y-1">
                                <CardTitle className="text-base font-semibold">{challenge.title}</CardTitle>
                                <CardDescription className='text-xs line-clamp-2'>{challenge.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Day {challenge.currentDay} of {challenge.goalDays}</span>
                                {challenge.isCompletedToday && (
                                    <div className="flex items-center gap-1 text-xs text-green-500">
                                        <CheckCircle className="h-3 w-3" />
                                        <span>Done!</span>
                                    </div>
                                )}
                            </div>
                            <Progress variant="gradient" value={progress} />
                        </CardContent>
                    </Link>
                    <CardFooter className="p-2 pt-0">
                        <Button
                            className="w-full"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent link navigation
                                onMarkAsDone(challenge.id);
                            }}
                            disabled={challenge.isCompletedToday}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {challenge.isCompletedToday ? 'Completed' : 'Done for today'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </motion.div>
    );
}

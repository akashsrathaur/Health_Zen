import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCcw, PlusCircle, Clock, Plus, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Icon } from '@/lib/icon-resolver';
import { type DailyVibe } from '@/lib/data';

interface DailyVibesListProps {
    dailyVibes: DailyVibe[];
    onRestore: () => void;
    onRefresh: () => void;
    onAddVibe: () => void;
    onEditVibe: (vibe: DailyVibe) => void;
    onMarkAsDone: (id: string) => void;
    isSleepLoggingActive: boolean;
    timeToUnlockSleep: number;
    timeToUnlockWater: number;
    isPending: boolean;
}

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

const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export function DailyVibesList({
    dailyVibes,
    onRestore,
    onRefresh,
    onAddVibe,
    onEditVibe,
    onMarkAsDone,
    isSleepLoggingActive,
    timeToUnlockSleep,
    timeToUnlockWater,
    isPending,
}: DailyVibesListProps) {
    const nonSnapVibeIds = ['sleep', 'streak'];

    return (
        <section className="space-y-4">
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
                <h2 className="text-lg sm:text-xl font-semibold text-glow">Daily Vibe</h2>
                <div className='flex flex-wrap gap-2'>
                    <Button variant="ghost" size="sm" onClick={onRestore} className="text-xs hover:bg-primary/10 hover:text-primary transition-colors">
                        <RefreshCcw className='mr-2 h-3 w-3 sm:h-4 sm:w-4' />
                        <span className="hidden sm:inline">Restore Tasks</span>
                        <span className="sm:hidden">Restore</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onRefresh} className="text-xs hover:bg-primary/10 hover:text-primary transition-colors">
                        <RefreshCcw className='mr-2 h-3 w-3 sm:h-4 sm:w-4' />
                        <span className="hidden sm:inline">Refresh Day</span>
                        <span className="sm:hidden">Refresh</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onAddVibe} className="text-xs hover:bg-primary/10 hover:text-primary transition-colors">
                        <PlusCircle className='mr-2 h-3 w-3 sm:h-4 sm:w-4' />
                        <span className="hidden sm:inline">Add Vibe</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </div>
            </div>
            <motion.div
                className="grid grid-cols-1 gap-3 sm:gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {dailyVibes.map((vibe) => {
                    const isTask = !nonSnapVibeIds.includes(vibe.id);
                    const isSleepCard = vibe.id === 'sleep';
                    const isWaterCard = vibe.id === 'water';
                    const isGymCard = vibe.id === 'gym';
                    const isMedicationCard = vibe.id === 'medication';
                    const isCompleted = isMedicationCard ? vibe.progress === 100 : !!vibe.completedAt;

                    const isWaterLocked = isWaterCard && timeToUnlockWater > 0;
                    let isVibeDisabled = (isSleepCard && !isSleepLoggingActive) || (isWaterCard && isWaterLocked);
                    if (isWaterCard && isCompleted && !isWaterLocked) isVibeDisabled = false;

                    let isMedicationDisabled = false;
                    if (isMedicationCard && vibe.medicationConfig) {
                        const config = vibe.medicationConfig;
                        if (config.lastDoseTime) {
                            const now = new Date();
                            const timeSinceLastDose = now.getTime() - new Date(config.lastDoseTime).getTime();
                            const intervalMs = config.intervalHours * 60 * 60 * 1000;
                            isMedicationDisabled = timeSinceLastDose < intervalMs && config.dosesTaken < config.dailyDoses;
                        }
                    }

                    let vibeValue = vibe.value;
                    if (!isMedicationCard && isTask && isCompleted && vibe.completedAt) {
                        vibeValue = `Completed at ${format(new Date(vibe.completedAt), 'p')}`;
                    }

                    return (
                        <motion.div key={vibe.id} variants={itemVariants}>
                            <div className="gradient-border-card">
                                <Card
                                    className={cn("gradient-border-card-inner p-4 transition-all duration-300 hover:shadow-xl border-none backdrop-blur-md bg-white/50 dark:bg-black/40",
                                        isVibeDisabled || isMedicationDisabled ? 'cursor-not-allowed bg-muted/50 dark:bg-muted/20' : 'hover:bg-primary/5 cursor-pointer',
                                        isCompleted && !isWaterLocked && 'bg-primary/5 shadow-inner border-primary/20'
                                    )}
                                    onClick={() => !isVibeDisabled && !isMedicationDisabled && onEditVibe(vibe)}
                                >
                                    <div className='flex items-center'>
                                        <Icon name={vibe.icon} className={cn("mr-4 h-8 w-8 transition-transform group-hover:scale-110",
                                            isCompleted && !isWaterLocked ? 'text-primary' : 'text-primary/70'
                                        )} />
                                        <div className="flex-1">
                                            <p className={cn("font-medium text-lg",
                                                isCompleted && !isWaterLocked && 'text-primary'
                                            )}>{vibe.title}</p>
                                            {isSleepCard && !isSleepLoggingActive ? (
                                                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                                    <Clock className="h-3 w-3" />
                                                    <span>Unlocks in {formatTime(timeToUnlockSleep)}</span>
                                                </div>
                                            ) : isWaterLocked ? (
                                                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                                    <Clock className="h-3 w-3" />
                                                    <span>Next intake in {formatTime(timeToUnlockWater)}</span>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground/80">{vibeValue}</p>
                                            )}
                                        </div>
                                        {isTask && (
                                            <Button
                                                size="sm"
                                                variant={isCompleted && !isWaterLocked ? 'secondary' : 'default'}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onMarkAsDone(vibe.id)
                                                }}
                                                disabled={(isCompleted && !isMedicationCard && vibe.id !== 'water' && vibe.id !== 'gym') || isWaterLocked || isPending || isMedicationDisabled}
                                                className={cn("ml-2 glass-button", isCompleted && !isWaterLocked && "bg-secondary/50")}
                                            >
                                                {isWaterCard ? (
                                                    <>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        {isCompleted ? 'Add More' : 'Add Glass'}
                                                    </>
                                                ) : isGymCard ? (
                                                    <>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        {isCompleted ? 'Add More' : 'Add 5min'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        {isMedicationCard && vibe.medicationConfig ?
                                                            (vibe.medicationConfig.dosesTaken >= vibe.medicationConfig.dailyDoses ? 'Complete' : 'Take Dose') :
                                                            (isCompleted ? 'Done' : 'Mark Done')
                                                        }
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    {vibe.progress !== undefined && vibe.id !== 'streak' && (
                                        <Progress
                                            variant="gradient"
                                            value={vibe.progress}
                                            className={cn("w-full mt-3 h-2",
                                                // Always show progress bar for water intake, regardless of completion status
                                                (vibe.id === 'water' || vibe.progress > 0) ? 'opacity-100' : 'opacity-100'
                                            )}
                                        />
                                    )}
                                </Card>
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>
        </section>
    );
}

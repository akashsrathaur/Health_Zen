import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, Minus, Plus, Trash2 } from 'lucide-react';
import { type DailyVibe } from '@/lib/data';
import { updateWaterIntake } from '@/actions/daily-activities';
import { format } from 'date-fns';

interface EditVibeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    vibe: DailyVibe | null;
    onSave: (vibe: DailyVibe) => void;
    onDelete: (vibeId: string) => void;
    userData: any;
    userProgress?: { streak: number; completedTasks: number } | null;
    onAchievementsCheck?: (newProgress: { streak: number; completedTasks: number }) => void;
}

export function EditVibeDialog({
    isOpen,
    onClose,
    vibe,
    onSave,
    onDelete,
    userData,
    userProgress,
    onAchievementsCheck
}: EditVibeDialogProps) {
    const [currentVibe, setCurrentVibe] = useState<DailyVibe | null>(vibe);

    useEffect(() => {
        setCurrentVibe(vibe);
    }, [vibe, isOpen])

    if (!currentVibe) return null;

    const handleWaterChange = async (amount: number) => {
        if (!userData) return;
        setCurrentVibe(prev => {
            if (!prev || prev.id !== 'water') return prev;
            const current = parseInt(prev.value.split('/')[0]);
            const goal = parseInt(prev.value.split('/')[1]?.match(/\d+/)?.[0] || '8');
            const newValue = Math.max(0, current + amount);
            const newProgress = Math.min((newValue / goal) * 100, 100);

            // Update the backend immediately and update streak logic
            updateWaterIntake(userData.uid, newValue).then(result => {
                if (result.success && newValue > current) {
                    // Update user progress and potentially streak via callback from parent
                    if (userProgress && onAchievementsCheck) {
                        const newUserProgress = { ...userProgress, completedTasks: userProgress.completedTasks + 1 };
                        onAchievementsCheck(newUserProgress);
                    }
                }
            }).catch(error => {
                console.warn('Firebase water update failed in dialog, continuing with local update:', error);
            });

            return {
                ...prev,
                value: `${newValue}/${goal} glasses`,
                progress: newProgress,
                // Update completedAt if this is progress (not regression)
                completedAt: amount > 0 && newValue > current ? new Date().toISOString() : prev.completedAt
            };
        });
    }

    const handleSleepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hours = parseFloat(e.target.value) || 0;
        setCurrentVibe(prev => {
            if (!prev || prev.id !== 'sleep') return prev;
            const goal = 8;
            return { ...prev, value: `${hours.toFixed(1)}h`, progress: (hours / goal) * 100 }
        })
    }

    const handleGymChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const minutes = parseInt(e.target.value) || 0;
        setCurrentVibe(prev => {
            if (!prev || prev.id !== 'gym') return prev;
            const goal = 20;
            return { ...prev, value: `${minutes}/20 minutes`, progress: (minutes / goal) * 100 }
        })
    }

    const handleMedicationToggle = (checked: boolean) => {
        setCurrentVibe(prev => {
            if (!prev || prev.id !== 'medication') return prev;
            const now = new Date().toISOString();
            const progress = checked ? 100 : 0;
            const value = checked ? 'Taken' : 'Pending'
            return { ...prev, value, progress, completedAt: checked ? now : undefined };
        });
    }

    const handleCustomVibeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentVibe(prev => prev ? { ...prev, [name]: value } as DailyVibe : null);
    }

    const handleSaveChanges = () => {
        if (currentVibe) onSave(currentVibe);
    }

    const handleDelete = () => {
        if (currentVibe) onDelete(currentVibe.id);
    }

    // Protected vibes that cannot be deleted
    const protectedVibes = ['water', 'sleep', 'gym', 'streak'];
    const isProtectedVibe = protectedVibes.includes(currentVibe.id);
    const isCompleted = currentVibe.id === 'medication' ? currentVibe.progress === 100 : !!currentVibe.completedAt;
    const isEditable = !isCompleted && !isProtectedVibe;
    const canDelete = !isProtectedVibe && (currentVibe.isCustom || currentVibe.id === 'medication');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass-panel">
                <DialogHeader>
                    <DialogTitle>Edit Daily Vibe</DialogTitle>
                    <DialogDescription>Update or remove this daily task.</DialogDescription>
                </DialogHeader>
                <div className='space-y-6 py-4'>
                    {isCompleted && currentVibe.id !== 'medication' && (
                        <Alert variant="default" className='border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300'>
                            <Info className="h-4 w-4 !text-green-600 dark:!text-green-400" />
                            <AlertTitle>Task Completed</AlertTitle>
                            <AlertDescription>
                                Completed on {format(new Date(currentVibe.completedAt!), "MMMM d, yyyy 'at' hh:mm a")}. This can't be edited.
                            </AlertDescription>
                        </Alert>
                    )}
                    {currentVibe.id === 'water' && isEditable && (
                        <div className="space-y-2">
                            <Label>Water Intake</Label>
                            <div className="flex items-center gap-4">
                                <Button size="icon" variant="outline" onClick={() => handleWaterChange(-1)}><Minus /></Button>
                                <span className="text-lg font-bold w-20 text-center">{currentVibe.value}</span>
                                <Button size="icon" variant="outline" onClick={() => handleWaterChange(1)}><Plus /></Button>
                            </div>
                        </div>
                    )}
                    {currentVibe.id === 'sleep' && isEditable && (
                        <div className="space-y-2">
                            <Label htmlFor="sleep-hours">Sleep Duration (hours)</Label>
                            <Input
                                id="sleep-hours"
                                type="number"
                                step="0.5"
                                value={currentVibe.value ? parseFloat(currentVibe.value) : 0}
                                onChange={handleSleepChange}
                                className="w-40"
                            />
                        </div>
                    )}
                    {currentVibe.id === 'gym' && isEditable && (
                        <div className="space-y-2">
                            <Label htmlFor="gym-minutes">Workout Duration (minutes)</Label>
                            <Input
                                id="gym-minutes"
                                type="number"
                                step="5"
                                value={currentVibe.value ? parseInt(currentVibe.value.split('/')[0]) : 0}
                                onChange={handleGymChange}
                                className="w-40"
                            />
                        </div>
                    )}
                    {currentVibe.id === 'medication' && !isCompleted && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Daily Doses Required</Label>
                                <Select
                                    value={currentVibe.medicationConfig?.dailyDoses?.toString() || '1'}
                                    onValueChange={(value) => {
                                        setCurrentVibe(prev => {
                                            if (!prev) return prev;
                                            return {
                                                ...prev,
                                                medicationConfig: {
                                                    ...prev.medicationConfig!,
                                                    dailyDoses: parseInt(value),
                                                    dosesTaken: 0
                                                }
                                            };
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 dose per day</SelectItem>
                                        <SelectItem value="2">2 doses per day</SelectItem>
                                        <SelectItem value="3">3 doses per day</SelectItem>
                                        <SelectItem value="4">4 doses per day</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Hours Between Doses</Label>
                                <Select
                                    value={currentVibe.medicationConfig?.intervalHours?.toString() || '4'}
                                    onValueChange={(value) => {
                                        setCurrentVibe(prev => {
                                            if (!prev) return prev;
                                            return {
                                                ...prev,
                                                medicationConfig: {
                                                    ...prev.medicationConfig!,
                                                    intervalHours: parseInt(value)
                                                }
                                            };
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="4">4 hours</SelectItem>
                                        <SelectItem value="6">6 hours</SelectItem>
                                        <SelectItem value="8">8 hours</SelectItem>
                                        <SelectItem value="12">12 hours</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    {currentVibe.id === 'medication' && isCompleted && (
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className='space-y-0.5'>
                                <Label htmlFor='medication-taken'>Medication</Label>
                                <p className="text-sm text-muted-foreground">
                                    Mark if you've taken your daily medication.
                                </p>
                            </div>
                            <Switch
                                id='medication-taken'
                                checked={isCompleted}
                                onCheckedChange={handleMedicationToggle}
                            />
                        </div>
                    )}
                    {currentVibe.isCustom && isEditable && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="custom-title">Title</Label>
                                <Input id="custom-title" name="title" value={currentVibe.title} onChange={handleCustomVibeChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="custom-value">Value / Target</Label>
                                <Input id="custom-value" name="value" value={currentVibe.value} onChange={handleCustomVibeChange} />
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter className='justify-between'>
                    {canDelete ? (
                        <Button variant="destructive" onClick={handleDelete} className="mr-auto">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    ) : (
                        <div className="text-xs text-muted-foreground mr-auto">
                            {isProtectedVibe ? 'Core daily vibes cannot be deleted' : ''}
                        </div>
                    )}
                    <div className='flex gap-2'>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSaveChanges} disabled={isCompleted && currentVibe.id !== 'medication'} className="glass-button">Save Changes</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

import { useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { allVibeIcons, type DailyVibe } from '@/lib/data';
import { nanoid } from 'nanoid';

interface AddVibeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (vibe: DailyVibe) => void;
}

export function AddVibeDialog({ isOpen, onClose, onAdd }: AddVibeDialogProps) {
    const [title, setTitle] = useState('');
    const [iconName, setIconName] = useState<keyof typeof allVibeIcons>('Activity');

    const handleAdd = () => {
        if (!title) return;
        const newVibe: DailyVibe = {
            id: nanoid(),
            title,
            value: 'Not set',
            icon: iconName,
            isCustom: true,
            progress: 0,
        };
        onAdd(newVibe);
        setTitle('');
        onClose();
    }

    const SelectedIcon = allVibeIcons[iconName];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass-panel">
                <DialogHeader>
                    <DialogTitle>Add Daily Vibe</DialogTitle>
                    <DialogDescription>Create a new custom task to track daily.</DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                    <div className="space-y-2">
                        <Label htmlFor="new-vibe-title">Title</Label>
                        <Input id="new-vibe-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Morning Walk" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-vibe-icon">Icon</Label>
                        <Select value={iconName} onValueChange={(value) => setIconName(value as keyof typeof allVibeIcons)}>
                            <SelectTrigger id="new-vibe-icon">
                                <SelectValue asChild>
                                    <div className="flex items-center gap-2">
                                        <SelectedIcon className="h-4 w-4" />
                                        <span>{iconName}</span>
                                    </div>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(allVibeIcons).map(iconKey => {
                                    const IconComponent = allVibeIcons[iconKey as keyof typeof allVibeIcons];
                                    return (
                                        <SelectItem key={iconKey} value={iconKey}>
                                            <div className='flex items-center gap-2'>
                                                <IconComponent className="h-4 w-4" />
                                                <span>{iconKey}</span>
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAdd} disabled={!title} className="glass-button">Add Vibe</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

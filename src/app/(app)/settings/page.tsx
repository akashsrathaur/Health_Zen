
'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/auth-context";
import { defaultUser } from "@/lib/user-store";
import { useToast } from "@/hooks/use-toast";
import { Flame, Upload, Loader2, User, Bot } from "lucide-react";
import type { BuddyPersona } from "@/lib/user-store";

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
});

const buddyFormSchema = z.object({
  name: z.string().min(1, 'Buddy name is required').max(30, 'Name must be less than 30 characters'),
  age: z.number().min(1, 'Age must be at least 1').max(150, 'Age must be less than 150'),
  gender: z.string().min(1, 'Gender is required'),
  relationship: z.string().min(1, 'Relationship is required'),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;
type BuddyFormData = z.infer<typeof buddyFormSchema>;

export default function SettingsPage() {
    const { user, firebaseUser, updateProfile, uploadAvatar, updateBuddy } = useAuth();
    const userData = user || defaultUser;
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Profile form
    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: userData.name,
            bio: userData.bio || '',
            emailNotifications: true,
            pushNotifications: false,
        },
    });

    // Buddy form
    const buddyForm = useForm<BuddyFormData>({
        resolver: zodResolver(buddyFormSchema),
        defaultValues: {
            name: userData.buddyPersona?.name || 'Zen',
            age: userData.buddyPersona?.age || 25,
            gender: userData.buddyPersona?.gender || 'Non-binary',
            relationship: userData.buddyPersona?.relationship || 'Friend',
        },
    });

    const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Invalid file type',
                description: 'Please select an image file.',
                variant: 'destructive',
            });
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'File too large',
                description: 'Please select an image smaller than 5MB.',
                variant: 'destructive',
            });
            return;
        }

        setIsUploading(true);
        try {
            await uploadAvatar(file);
            toast({
                title: 'Profile photo updated',
                description: 'Your profile photo has been successfully updated.',
            });
        } catch (error: any) {
            toast({
                title: 'Upload failed',
                description: error.message || 'Failed to upload profile photo.',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const onProfileSubmit = async (data: ProfileFormData) => {
        setIsSaving(true);
        try {
            await updateProfile({
                name: data.name,
                bio: data.bio,
            });
            toast({
                title: 'Profile updated',
                description: 'Your profile has been successfully updated.',
            });
        } catch (error: any) {
            toast({
                title: 'Update failed',
                description: error.message || 'Failed to update profile.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const onBuddySubmit = async (data: BuddyFormData) => {
        setIsSaving(true);
        try {
            await updateBuddy(data as BuddyPersona);
            toast({
                title: 'Buddy updated',
                description: 'Your wellness buddy has been successfully updated.',
            });
        } catch (error: any) {
            toast({
                title: 'Update failed',
                description: error.message || 'Failed to update buddy settings.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account details and preferences.
                </p>
            </div>
            
            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile
                    </CardTitle>
                    <CardDescription>This is how others will see you on the site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={userData.avatarUrl} />
                            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <h3 className="font-semibold">{userData.name}</h3>
                            <p className="text-sm text-muted-foreground">{userData.age} years old</p>
                            <div className="flex items-center gap-1.5 text-sm text-yellow-500">
                                <Flame className="h-4 w-4"/>
                                <span className="font-semibold">{userData.streak} Day Streak</span>
                            </div>
                        </div>
                        <div className="ml-auto">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Upload className="h-4 w-4 mr-2" />
                                )}
                                Change Photo
                            </Button>
                        </div>
                    </div>
                    
                    <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                            <FormField
                                control={profileForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={profileForm.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                {...field} 
                                                placeholder="Tell us a little bit about yourself" 
                                                className="min-h-[100px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Save Profile
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Buddy Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        Wellness Buddy
                    </CardTitle>
                    <CardDescription>Configure your AI wellness companion's personality and relationship.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...buddyForm}>
                        <form onSubmit={buddyForm.handleSubmit(onBuddySubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={buddyForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Buddy Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="e.g., Zen, Alex, Sam" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={buddyForm.control}
                                    name="age"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Buddy Age</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    type="number" 
                                                    min={1} 
                                                    max={150}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={buddyForm.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Buddy Gender</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={buddyForm.control}
                                    name="relationship"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Relationship</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select relationship" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Friend">Friend</SelectItem>
                                                    <SelectItem value="Mentor">Mentor</SelectItem>
                                                    <SelectItem value="Coach">Coach</SelectItem>
                                                    <SelectItem value="Sibling">Sibling</SelectItem>
                                                    <SelectItem value="Parent">Parent</SelectItem>
                                                    <SelectItem value="Partner">Partner</SelectItem>
                                                    <SelectItem value="Companion">Companion</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Save Buddy Settings
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Your email and mobile number (read-only).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" readOnly value={firebaseUser?.email || "No email provided"} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input id="mobile" type="tel" readOnly value={firebaseUser?.phoneNumber || "No phone provided"} />
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Choose how you want to be notified.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50">
                        <div className="space-y-0.5">
                            <Label htmlFor="email-notifications" className="text-base font-normal cursor-pointer">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive challenge updates and motivational quotes in your inbox.
                            </p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50">
                        <div className="space-y-0.5">
                            <Label htmlFor="push-notifications" className="text-base font-normal cursor-pointer">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Get real-time alerts for tasks and motivation on your device.
                            </p>
                        </div>
                        <Switch id="push-notifications" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    
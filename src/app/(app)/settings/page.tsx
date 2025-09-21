
/**
 * Health Zen - AI-Powered Personalized Wellness Companion
 * Copyright © 2025 Akash Rathaur. All Rights Reserved.
 * 
 * Settings Page - User profile and app configuration
 * Features Ayurvedic dosha profiling, notification settings, and personalization
 * 
 * @author Akash Rathaur
 * @email akashsrathaur@gmail.com
 * @website https://github.com/akashsrathaur
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import { Flame, Upload, Loader2, User, Bot, Check, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BuddyPersona } from "@/lib/user-store";
import { updateNotificationSettings } from "@/actions/notifications";
import { AvatarSelector } from "@/components/ui/avatar-selector";
import { notificationClient } from "@/lib/notification-client";
import DoshaDisplay from "@/components/dosha-display";

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
    const { user, firebaseUser, updateProfile, updateBuddy } = useAuth();
    const userData = user || defaultUser;
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Notification settings state
    const [emailNotifications, setEmailNotifications] = useState(userData.emailNotifications ?? true);
    const [pushNotifications, setPushNotifications] = useState(userData.pushNotifications ?? false);
    const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

    // Profile form
    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: userData.name,
            bio: userData.bio || '',
            emailNotifications: userData.emailNotifications ?? true,
            pushNotifications: userData.pushNotifications ?? false,
        },
        mode: 'onChange',
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
        mode: 'onChange',
    });

    // Track form changes
    const profileFormState = profileForm.watch();
    const buddyFormState = buddyForm.watch();

    // Initialize notification client and load settings from localStorage
    useEffect(() => {
        const initializeNotifications = async () => {
            await notificationClient.initialize();
            setHasNotificationPermission(notificationClient.hasPermission());
            
            // Load settings from localStorage (client-side)
            const clientSettings = notificationClient.getSettings();
            setEmailNotifications(clientSettings.emailNotifications);
            setPushNotifications(clientSettings.pushNotifications);
        };
        
        initializeNotifications();
    }, []);

    // Check if there are unsaved changes
    React.useEffect(() => {
        const profileChanged = 
            profileFormState.name !== userData.name ||
            (profileFormState.bio || '') !== (userData.bio || '');
        
        const buddyChanged = 
            buddyFormState.name !== (userData.buddyPersona?.name || 'Zen') ||
            buddyFormState.age !== (userData.buddyPersona?.age || 25) ||
            buddyFormState.gender !== (userData.buddyPersona?.gender || 'Non-binary') ||
            buddyFormState.relationship !== (userData.buddyPersona?.relationship || 'Friend');
        
        const notificationsChanged = 
            emailNotifications !== (userData.emailNotifications ?? true) ||
            pushNotifications !== (userData.pushNotifications ?? false);
        
        setHasUnsavedChanges(profileChanged || buddyChanged || notificationsChanged);
    }, [profileFormState, buddyFormState, userData, emailNotifications, pushNotifications]);

    const handleNotificationPermissionRequest = async () => {
        try {
            const granted = await notificationClient.requestPermission();
            setHasNotificationPermission(granted);
            
            if (granted) {
                toast({
                    title: 'Permission Granted!',
                    description: 'You can now receive push notifications.',
                });
                // Send a test notification
                notificationClient.sendNotification('HealthZen Notifications Enabled!', {
                    body: 'You will now receive wellness reminders and updates.',
                });
            } else {
                toast({
                    title: 'Permission Denied',
                    description: 'Push notifications will not work without permission.',
                    variant: 'destructive',
                });
                setPushNotifications(false);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to request notification permission.',
                variant: 'destructive',
            });
        }
    };

    const handleAvatarSelect = async (avatarUrl: string, avatarId: string) => {
        setIsUploading(true);
        try {
            await updateProfile({ avatarUrl });
            toast({
                title: 'Avatar updated!',
                description: 'Your profile avatar has been successfully updated.',
            });
        } catch (error: any) {
            toast({
                title: 'Update failed',
                description: error.message || 'Failed to update avatar.',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Unified save function for all settings
    const handleSaveAllChanges = async () => {
        setIsSaving(true);
        const errors: string[] = [];
        
        try {
            // Validate all forms first
            const isProfileValid = await profileForm.trigger();
            const isBuddyValid = await buddyForm.trigger();
            
            if (!isProfileValid || !isBuddyValid) {
                toast({
                    title: 'Validation Error',
                    description: 'Please fix the errors in the form before saving.',
                    variant: 'destructive',
                });
                return;
            }
            
            const profileData = profileForm.getValues();
            const buddyData = buddyForm.getValues();
            
            // Save profile changes
            try {
                await updateProfile({
                    name: profileData.name,
                    bio: profileData.bio,
                });
            } catch (error: any) {
                errors.push(`Profile: ${error.message}`);
            }
            
            // Save buddy changes
            try {
                await updateBuddy(buddyData as BuddyPersona);
            } catch (error: any) {
                errors.push(`Buddy: ${error.message}`);
            }
            
            // Save notification settings to localStorage (client-side)
            try {
                notificationClient.saveSettings({
                    emailNotifications,
                    pushNotifications
                });
                
                // Also try to save to Firebase (optional, can fail without breaking the UI)
                try {
                    await updateNotificationSettings(user?.uid || '', {
                        emailNotifications,
                        pushNotifications
                    });
                } catch (firebaseError) {
                    console.warn('Firebase notification settings save failed (continuing with localStorage):', firebaseError);
                }
            } catch (error: any) {
                errors.push(`Notifications: ${error.message}`);
            }
            
            if (errors.length === 0) {
                toast({
                    title: 'Settings Saved!',
                    description: 'All your settings have been successfully updated.',
                });
                setHasUnsavedChanges(false);
            } else {
                toast({
                    title: 'Partial Save',
                    description: `Some settings couldn't be saved: ${errors.join(', ')}`,
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            toast({
                title: 'Save Failed',
                description: error.message || 'Failed to save settings.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    // Reset forms to original values
    const handleDiscardChanges = () => {
        profileForm.reset({
            name: userData.name,
            bio: userData.bio || '',
            emailNotifications: true,
            pushNotifications: false,
        });
        
        buddyForm.reset({
            name: userData.buddyPersona?.name || 'Zen',
            age: userData.buddyPersona?.age || 25,
            gender: userData.buddyPersona?.gender || 'Non-binary',
            relationship: userData.buddyPersona?.relationship || 'Friend',
        });
        
        setHasUnsavedChanges(false);
        
        toast({
            title: 'Changes Discarded',
            description: 'All unsaved changes have been reverted.',
        });
    };

    return (
        <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="space-y-2">
                <h1 className="font-headline text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                    Manage your account details and preferences.
                </p>
            </div>
            
            {/* Profile Settings */}
            <Card>
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        Profile
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">This is how others will see you on the site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col gap-4 sm:gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                                <AvatarImage src={userData.avatarUrl} />
                                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2 text-center sm:text-left">
                                <h3 className="font-semibold text-base sm:text-lg">{userData.name}</h3>
                                <p className="text-sm text-muted-foreground">{userData.age} years old</p>
                                <div className="flex items-center gap-1.5 text-sm text-yellow-500 justify-center sm:justify-start">
                                    <Flame className="h-4 w-4"/>
                                    <span className="font-semibold">{userData.streak} Day Streak</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <AvatarSelector
                                    currentAvatarUrl={userData.avatarUrl}
                                    onAvatarSelect={handleAvatarSelect}
                                    disabled={isUploading}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <Form {...profileForm}>
                        <div className="space-y-4">
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
                        </div>
                    </Form>
                </CardContent>
            </Card>

            {/* Buddy Settings */}
            <Card>
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                        <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                        Wellness Buddy
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Configure your AI wellness companion's personality and relationship.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...buddyForm}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </div>
                    </Form>
                </CardContent>
            </Card>

            {/* Dosha Profile */}
            {userData.dosha && (
                <DoshaDisplay user={{...userData, uid: user?.uid || ''}} className="" />
            )}

            {/* Contact Information */}
            <Card>
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg lg:text-xl">Contact Information</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Your email and mobile number (read-only).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email</Label>
                        <Input id="email" type="email" readOnly value={firebaseUser?.email || "No email provided"} className="text-xs sm:text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile" className="text-xs sm:text-sm font-medium">Mobile Number</Label>
                        <Input id="mobile" type="tel" readOnly value={userData.phone || "No phone provided"} className="text-xs sm:text-sm" />
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg lg:text-xl">Notifications</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Choose how you want to be notified.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-lg border p-3 sm:p-4 transition-colors hover:bg-secondary/50">
                        <div className="space-y-0.5 flex-1">
                            <Label htmlFor="email-notifications" className="text-xs sm:text-sm font-normal cursor-pointer">Email Notifications</Label>
                            <p className="text-xs text-muted-foreground">
                                Receive challenge updates and motivational quotes in your inbox.
                            </p>
                        </div>
                        <div className="flex justify-end sm:justify-center">
                            <Switch 
                                id="email-notifications" 
                                checked={emailNotifications}
                                onCheckedChange={setEmailNotifications}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 rounded-lg border p-4 transition-colors hover:bg-secondary/50">
                        <div className="space-y-0.5 flex-1">
                            <Label htmlFor="push-notifications" className="text-sm sm:text-base font-normal cursor-pointer">Push Notifications</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Get real-time alerts for tasks and motivation on your device.
                            </p>
                            {!hasNotificationPermission && (
                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                    <Bell className="h-3 w-3" />
                                    Browser permission required
                                </p>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            {!hasNotificationPermission && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleNotificationPermissionRequest}
                                    className="text-xs px-3"
                                >
                                    <Bell className="h-3 w-3 mr-1" />
                                    Allow
                                </Button>
                            )}
                            <Switch 
                                id="push-notifications" 
                                checked={pushNotifications && hasNotificationPermission}
                                onCheckedChange={(checked) => {
                                    if (checked && !hasNotificationPermission) {
                                        handleNotificationPermissionRequest();
                                        return;
                                    }
                                    setPushNotifications(checked);
                                }}
                                disabled={!hasNotificationPermission}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Unified Save Section */}
            <Card className={cn(
                "sticky bottom-4 transition-all duration-200",
                hasUnsavedChanges ? "ring-2 ring-primary/20 shadow-lg" : "shadow-sm"
            )}>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between">
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                            {hasUnsavedChanges && (
                                <div className="flex items-center gap-2 text-amber-600">
                                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-xs sm:text-sm font-medium">You have unsaved changes</span>
                                </div>
                            )}
                            {!hasUnsavedChanges && (
                                <div className="flex items-center gap-2 text-green-600">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-xs sm:text-sm font-medium">All changes saved</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            {hasUnsavedChanges && (
                                <Button 
                                    variant="outline" 
                                    onClick={handleDiscardChanges}
                                    disabled={isSaving}
                                    className="flex-1 sm:flex-none text-xs sm:text-sm px-3 sm:px-4"
                                    size="sm"
                                >
                                    <span className="hidden xs:inline">Discard Changes</span>
                                    <span className="xs:hidden">Discard</span>
                                </Button>
                            )}
                            <Button 
                                onClick={handleSaveAllChanges}
                                disabled={!hasUnsavedChanges || isSaving}
                                className="flex-1 sm:flex-none min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm px-3 sm:px-4"
                                size="sm"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="hidden xs:inline">Save All Changes</span>
                                        <span className="xs:hidden">Save All</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    
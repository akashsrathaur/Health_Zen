
'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { userData } from "@/lib/data";
import { Flame } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account details and preferences.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
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
                         <Button variant="outline" size="sm" className="ml-auto self-start">Change Photo</Button>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={userData.name} />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Tell us a little bit about yourself" defaultValue="Passionate about holistic wellness and mindful living." />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Update your email and mobile number.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="akash.r@example.com" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input id="mobile" type="tel" defaultValue="1234567890" maxLength={10} />
                    </div>
                </CardContent>
            </Card>

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

             <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
            </div>
        </div>
    )
}

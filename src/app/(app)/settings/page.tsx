
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { userData } from "@/lib/data";

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
                            <Button variant="outline" size="sm">Change Photo</Button>
                        </div>
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
                        <Input id="mobile" type="tel" defaultValue="(123) 456-7890" />
                    </div>
                </CardContent>
            </Card>

             <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </div>
    )
}

import { Balancer } from 'react-wrap-balancer';
import { type User } from '@/lib/user-store';

interface UserGreetingProps {
    user: User | null;
}

export function UserGreeting({ user }: UserGreetingProps) {
    return (
        <div className="space-y-2">
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Welcome back, <span className="gradient-text">{(user && user.name) ? user.name.split(' ')[0] : 'friend'}!</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
                <Balancer>Here's your wellness summary for today. Keep up the great work!</Balancer>
            </p>
        </div>
    );
}

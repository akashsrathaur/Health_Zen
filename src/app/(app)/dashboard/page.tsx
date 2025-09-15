import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dailyVibes, quickActions, userData } from '@/lib/data';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Welcome back, {userData.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          <Balancer>Here's your wellness summary for today. Keep up the great work!</Balancer>
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Daily Vibe</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dailyVibes.map((vibe) => (
            <Card key={vibe.title} className="flex items-center p-4">
              <vibe.icon className="mr-4 h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{vibe.title}</p>
                <p className="text-sm text-muted-foreground">{vibe.value}</p>
              </div>
              <Progress value={vibe.progress} className="w-20" />
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link href={action.href} key={action.title}>
              <Card className="group transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-secondary p-3">
                      <action.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

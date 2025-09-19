'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getRandomMotivationalMessage, getMotivationalNotification } from '@/data/motivational-messages';
import { useNotifications } from '@/hooks/use-notifications';
import { Bell, Zap } from 'lucide-react';

export function MotivationalNotificationTest() {
  const { addNotification } = useNotifications();

  const handleTestNotification = () => {
    const notification = getMotivationalNotification();
    addNotification({
      title: notification.title,
      description: notification.description,
    });
  };

  const handleRandomMessage = () => {
    const message = getRandomMotivationalMessage();
    addNotification({
      title: "Test Random Message 🧪",
      description: message,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Motivational Notification Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={handleTestNotification} 
          className="w-full"
          variant="default"
        >
          <Zap className="mr-2 h-4 w-4" />
          Test Motivational Notification
        </Button>
        <Button 
          onClick={handleRandomMessage} 
          className="w-full"
          variant="outline"
        >
          <Bell className="mr-2 h-4 w-4" />
          Test Random Message
        </Button>
        <p className="text-xs text-muted-foreground">
          Click the buttons above to test notifications. They should appear in the bell icon in the top-right corner.
        </p>
      </CardContent>
    </Card>
  );
}
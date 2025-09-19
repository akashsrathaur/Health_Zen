'use client';

import { useEffect } from 'react';
import { useNotifications } from './use-notifications';
import { motivationalNotificationService } from '@/lib/motivational-notification-service';

export function useMotivationalNotifications() {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Set up the callback for motivational notifications
    motivationalNotificationService.setNotificationCallback((notification) => {
      addNotification({
        title: notification.title,
        description: notification.description,
      });
    });

    // Initialize the motivational notification service
    motivationalNotificationService.initialize();

    // Cleanup on component unmount
    return () => {
      motivationalNotificationService.cleanup();
    };
  }, [addNotification]);

  return {
    showVisitNotification: () => motivationalNotificationService.showVisitNotification(),
    startHourlyNotifications: () => motivationalNotificationService.startHourlyNotifications(),
    stopHourlyNotifications: () => motivationalNotificationService.stopHourlyNotifications(),
  };
}
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { notificationClient } from '@/lib/notification-client';
import { dailyResetService } from '@/lib/daily-reset-service';

export function useAppServices() {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize notification client when app loads
    const initializeNotifications = async () => {
      await notificationClient.initialize(true); // Auto-request permission if needed
    };

    initializeNotifications();

    // Initialize daily reset service
    dailyResetService.scheduleDaily();

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    // Set user ID for daily reset service when user changes
    if (user) {
      dailyResetService.setUserId(user.uid);
    }
  }, [user]);

  return {
    // Expose service methods if needed
    sendNotification: notificationClient.sendNotification.bind(notificationClient),
    requestNotificationPermission: notificationClient.requestPermission.bind(notificationClient),
    manualDailyReset: dailyResetService.manualReset.bind(dailyResetService),
  };
}
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { notificationClient } from '@/lib/notification-client';
import { dailyResetService } from '@/lib/daily-reset-service';
import { useMotivationalNotifications } from './use-motivational-notifications';

export function useAppServices() {
  const { user } = useAuth();
  
  // Initialize motivational notifications
  const motivationalNotifications = useMotivationalNotifications();

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
    if (user) {
      dailyResetService.setUserId(user.uid);
    }
  }, [user]);

  return {
    // Expose service methods if needed
    sendNotification: notificationClient.sendNotification.bind(notificationClient),
    requestNotificationPermission: notificationClient.requestPermission.bind(notificationClient),
    manualDailyReset: dailyResetService.manualReset.bind(dailyResetService),
    // Motivational notification methods
    showMotivationalNotification: motivationalNotifications.showVisitNotification,
    startHourlyMotivationalNotifications: motivationalNotifications.startHourlyNotifications,
    stopHourlyMotivationalNotifications: motivationalNotifications.stopHourlyNotifications,
    // Daily reset methods
    checkAndTriggerDailyReset: dailyResetService.checkAndTriggerResetIfNeeded.bind(dailyResetService),
  };
}
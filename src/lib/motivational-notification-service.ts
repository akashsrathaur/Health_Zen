'use client';

import { getMotivationalNotification } from '@/data/motivational-messages';

export interface MotivationalNotificationService {
  startHourlyNotifications: () => void;
  stopHourlyNotifications: () => void;
  showVisitNotification: () => void;
  setNotificationCallback: (callback: (notification: { title: string; description: string }) => void) => void;
}

class MotivationalNotificationServiceImpl implements MotivationalNotificationService {
  private intervalId: NodeJS.Timeout | null = null;
  private notificationCallback: ((notification: { title: string; description: string }) => void) | null = null;
  private readonly STORAGE_KEY = 'healthzen_motivational_notifications';
  private readonly VISIT_NOTIFICATION_KEY = 'healthzen_last_visit_notification';

  setNotificationCallback(callback: (notification: { title: string; description: string }) => void) {
    this.notificationCallback = callback;
  }

  private sendNotification(notification: { title: string; description: string }) {
    if (this.notificationCallback) {
      this.notificationCallback(notification);
    }
  }

  startHourlyNotifications() {
    // Clear any existing interval
    this.stopHourlyNotifications();

    // Set up hourly notifications (every hour)
    this.intervalId = setInterval(() => {
      const notification = getMotivationalNotification();
      this.sendNotification(notification);
      this.saveLastNotificationTime();
    }, 60 * 60 * 1000); // 1 hour in milliseconds

    console.log('🕐 Hourly motivational notifications started');
  }

  stopHourlyNotifications() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️ Hourly motivational notifications stopped');
    }
  }

  showVisitNotification() {
    const lastVisitNotification = this.getLastVisitNotificationTime();
    const currentTime = Date.now();
    const oneHourAgo = currentTime - (60 * 60 * 1000); // 1 hour in milliseconds

    // Show visit notification if:
    // 1. No previous visit notification recorded, or
    // 2. Last visit notification was more than 1 hour ago
    if (!lastVisitNotification || lastVisitNotification < oneHourAgo) {
      const notification = getMotivationalNotification();
      this.sendNotification(notification);
      this.saveLastVisitNotificationTime();
      console.log('👋 Visit-based motivational notification sent');
    } else {
      console.log('⏭️ Visit notification skipped (too recent)');
    }
  }

  private saveLastNotificationTime() {
    if (typeof window === 'undefined') return;
    try {
      const data = {
        lastHourlyNotification: Date.now(),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving last notification time:', error);
    }
  }

  private saveLastVisitNotificationTime() {
    if (typeof window === 'undefined') return;
    try {
      const data = {
        lastVisitNotification: Date.now(),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.VISIT_NOTIFICATION_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving last visit notification time:', error);
    }
  }

  private getLastVisitNotificationTime(): number | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(this.VISIT_NOTIFICATION_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data.lastVisitNotification || null;
      }
      return null;
    } catch (error) {
      console.error('Error reading last visit notification time:', error);
      return null;
    }
  }

  // Helper method to check if hourly notifications should resume
  shouldResumeHourlyNotifications(): boolean {
    if (typeof window === 'undefined') return true;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        const lastNotification = data.lastHourlyNotification;
        const currentTime = Date.now();
        const oneHourAgo = currentTime - (60 * 60 * 1000);

        // Resume if last notification was more than an hour ago
        return !lastNotification || lastNotification < oneHourAgo;
      }
      return true; // No previous data, start fresh
    } catch (error) {
      console.error('Error checking if should resume notifications:', error);
      return true;
    }
  }

  // Initialize the service
  initialize() {
    if (typeof window === 'undefined') return;
    console.log('🌿 Initializing motivational notification service...');

    // Show a visit notification when the service initializes
    setTimeout(() => {
      this.showVisitNotification();
    }, 2000); // Delay by 2 seconds to allow UI to load

    // Start hourly notifications
    this.startHourlyNotifications();
  }

  // Cleanup method
  cleanup() {
    this.stopHourlyNotifications();
    this.notificationCallback = null;
  }
}

// Singleton instance
const motivationalNotificationService = new MotivationalNotificationServiceImpl();

export { motivationalNotificationService };
export default motivationalNotificationService;
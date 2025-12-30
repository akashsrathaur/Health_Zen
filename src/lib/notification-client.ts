'use client';

export interface NotificationClientService {
  requestPermission: () => Promise<boolean>;
  hasPermission: () => boolean;
  saveSettings: (settings: { emailNotifications: boolean; pushNotifications: boolean }) => void;
  getSettings: () => { emailNotifications: boolean; pushNotifications: boolean };
  sendNotification: (title: string, options?: NotificationOptions) => void;
}

class NotificationClientImpl implements NotificationClientService {
  private readonly STORAGE_KEY = 'healthzen_notification_settings';

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';

      // Save the permission result to localStorage
      this.savePermissionStatus(granted);

      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  hasPermission(): boolean {
    if (!('Notification' in window)) {
      return false;
    }

    return Notification.permission === 'granted';
  }

  private savePermissionStatus(granted: boolean) {
    if (typeof window === 'undefined') return;
    try {
      const settings = this.getSettings();
      const updatedSettings = {
        ...settings,
        browserPermissionGranted: granted,
        lastPermissionRequest: Date.now(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving permission status:', error);
    }
  }

  saveSettings(settings: { emailNotifications: boolean; pushNotifications: boolean }) {
    if (typeof window === 'undefined') return;
    try {
      const currentSettings = this.getStoredSettings();
      const updatedSettings = {
        ...currentSettings,
        ...settings,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));
      console.log('Notification settings saved to localStorage:', updatedSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  getSettings(): { emailNotifications: boolean; pushNotifications: boolean } {
    const stored = this.getStoredSettings();
    return {
      emailNotifications: stored.emailNotifications ?? true,
      pushNotifications: stored.pushNotifications ?? false,
    };
  }

  private getStoredSettings(): any {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading notification settings from localStorage:', error);
      return {};
    }
  }

  sendNotification(title: string, options?: NotificationOptions) {
    if (!this.hasPermission()) {
      console.warn('Notification permission not granted');
      return;
    }

    const settings = this.getSettings();
    if (!settings.pushNotifications) {
      console.log('Push notifications disabled by user');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  // Helper method to check if we should ask for permission
  shouldRequestPermission(): boolean {
    if (Notification.permission === 'granted') {
      return false; // Already granted
    }

    if (Notification.permission === 'denied') {
      return false; // User explicitly denied, don't ask again
    }

    const stored = this.getStoredSettings();
    const lastRequest = stored.lastPermissionRequest;
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000); // Reduced from 1 week to 1 day

    // Ask if we haven't asked before, or if it's been more than a day since last request
    return !stored.browserPermissionGranted && (!lastRequest || lastRequest < oneDayAgo);
  }

  // Initialize service and optionally request permission
  async initialize(autoRequestPermission: boolean = true): Promise<void> {
    console.log('🔔 Initializing notification service...');

    if (!('Notification' in window)) {
      console.warn('⚠️ This browser does not support notifications');
      return;
    }

    // Check current permission status
    console.log(`📋 Current notification permission: ${Notification.permission}`);

    if (autoRequestPermission && this.shouldRequestPermission()) {
      console.log('🔔 Requesting notification permission...');
      const granted = await this.requestPermission();

      if (granted) {
        console.log('✅ Notification permission granted!');
        // Send a test notification to confirm it's working
        setTimeout(() => {
          this.sendNotification('Health Zen Notifications', {
            body: 'Notifications are now enabled! We\'ll help you stay on track with your wellness goals.',
            icon: '/favicon.ico',
            tag: 'welcome'
          });
        }, 1000);
      } else {
        console.log('❌ Notification permission denied');
      }
    } else if (Notification.permission === 'granted') {
      console.log('✅ Notifications already enabled');
    }
  }
}

// Singleton instance
const notificationClient = new NotificationClientImpl();

export { notificationClient };
export default notificationClient;
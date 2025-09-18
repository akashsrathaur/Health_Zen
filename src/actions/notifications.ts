'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const USERS_COLLECTION = 'users';

export type NotificationSettings = {
  emailNotifications: boolean;
  pushNotifications: boolean;
};

export async function updateNotificationSettings(
  userId: string, 
  settings: NotificationSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!db || !db.app) {
      return { success: false, error: 'Firebase not configured' };
    }

    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      emailNotifications: settings.emailNotifications,
      pushNotifications: settings.pushNotifications,
    });

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return { 
      success: false, 
      error: 'Failed to update notification settings' 
    };
  }
}
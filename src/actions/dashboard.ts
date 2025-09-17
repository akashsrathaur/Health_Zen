
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { DailyVibe } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const USER_DATA_COLLECTION = 'userData';

// This function can be used to get all vibes for a user.
export async function getDailyVibes(userId: string): Promise<DailyVibe[]> {
    const userDocRef = doc(db, USER_DATA_COLLECTION, userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().dailyVibes) {
        return userDoc.data().dailyVibes;
    }
    return [];
}

export async function updateDailyVibes(userId: string, vibes: DailyVibe[]) {
    const userDocRef = doc(db, USER_DATA_COLLECTION, userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        await setDoc(userDocRef, { dailyVibes: vibes });
    } else {
        await setDoc(userDocRef, { ...userDoc.data(), dailyVibes: vibes });
    }
    revalidatePath('/dashboard');
}

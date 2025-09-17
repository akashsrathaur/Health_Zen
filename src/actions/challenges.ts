
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import type { Challenge } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const USER_DATA_COLLECTION = 'userData';

// This function can be used to get all challenges for a user.
export async function getChallenges(userId: string): Promise<Challenge[]> {
    const userDocRef = doc(db, USER_DATA_COLLECTION, userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().challenges) {
        return userDoc.data().challenges;
    }
    return [];
}

export async function addChallenge(userId: string, newChallenge: Challenge) {
    const userDocRef = doc(db, USER_DATA_COLLECTION, userId);
    await updateDoc(userDocRef, {
        challenges: arrayUnion(newChallenge)
    });
    revalidatePath('/challenges');
    revalidatePath('/dashboard');
}

export async function updateChallenge(userId: string, updatedChallenge: Challenge) {
    const userDocRef = doc(db, USER_DATA_COLLECTION, userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const challenges = userDoc.data().challenges || [];
        const challengeIndex = challenges.findIndex((c: Challenge) => c.id === updatedChallenge.id);
        if (challengeIndex > -1) {
            challenges[challengeIndex] = updatedChallenge;
            await setDoc(userDocRef, { ...userDoc.data(), challenges });
            revalidatePath('/challenges');
            revalidatePath('/dashboard');
        }
    }
}

'use client';

import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { User } from '@/lib/user-store';

export async function createUserInFirestore(uid: string, data: Omit<User, 'uid'>) {
    try {
        await setDoc(doc(db, 'users', uid), {
            ...data,
            uid,
        });
        console.log(`Successfully created user profile for UID: ${uid}`);
    } catch (error: any) {
        console.error('Error creating user in Firestore: ', error);
        console.error('Error code:', error?.code);
        console.error('Error message:', error?.message);
        
        // For permission issues, provide more helpful context
        if (error?.code === 'permission-denied') {
            throw new Error('Permission denied: Please check Firestore security rules.');
        }
        
        // For other errors, provide the original error for debugging
        throw new Error(`Failed to create user profile: ${error?.message || 'Unknown error'}`);
    }
}

export async function getUserFromFirestore(uid: string): Promise<User | null> {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as User;
        } else {
            console.log(`No user document found for UID: ${uid}`);
            return null;
        }
    } catch (error: any) {
        console.error('Error getting user from Firestore: ', error);
        console.error('Error code:', error?.code);
        
        console.warn('Returning null due to Firestore error - will create default user');
        return null;
    }
}
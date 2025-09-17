
'use server';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { User } from '@/lib/user-store';

export async function createUserInFirestore(uid: string, data: Omit<User, 'uid'>) {
    try {
        await setDoc(doc(db, 'users', uid), {
            ...data,
            uid,
        });
    } catch (error) {
        console.error('Error creating user in Firestore: ', error);
        // We throw a more specific error to be handled by the caller
        throw new Error('Failed to create user profile in database.');
    }
}

export async function getUserFromFirestore(uid: string): Promise<User | null> {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Return the user data if the document is found
            return docSnap.data() as User;
        } else {
            // This is not an error, it's a valid state (user document not created yet)
            console.log(`No user document found for UID: ${uid}`);
            return null;
        }
    } catch (error) {
        console.error('Error getting user from Firestore: ', error);
        // This is a genuine error (e.g., network issue, permissions)
        // We re-throw it to be handled by the application's error boundaries.
        throw new Error('Could not retrieve user profile due to a server error.');
    }
}

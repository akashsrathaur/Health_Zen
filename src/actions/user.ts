
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
        throw new Error('Could not create user profile.');
    }
}

export async function getUserFromFirestore(uid: string): Promise<User | null> {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as User;
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting user from Firestore: ', error);
        throw new Error('Could not retrieve user profile.');
    }
}

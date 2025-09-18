'use client';

import { db, storage } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { User, BuddyPersona } from '@/lib/user-store';

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

// Dashboard functions
export async function updateDailyVibes(userId: string, vibes: any[]) {
    try {
        const userDocRef = doc(db, 'userData', userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await setDoc(userDocRef, { dailyVibes: vibes });
        } else {
            await setDoc(userDocRef, { ...userDoc.data(), dailyVibes: vibes });
        }
        console.log('Successfully updated daily vibes for user:', userId);
    } catch (error: any) {
        console.error('Error updating daily vibes:', error);
        throw new Error(`Failed to update daily vibes: ${error?.message || 'Unknown error'}`);
    }
}

export async function removeDailyVibe(userId: string, vibeId: string) {
    try {
        const userDocRef = doc(db, 'userData', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const data = userDoc.data();
            const dailyVibes = data.dailyVibes || [];
            const filteredVibes = dailyVibes.filter((vibe: any) => vibe.id !== vibeId);
            await setDoc(userDocRef, { ...data, dailyVibes: filteredVibes });
        }
        console.log('Successfully removed daily vibe for user:', userId);
    } catch (error: any) {
        console.error('Error removing daily vibe:', error);
        throw new Error(`Failed to remove daily vibe: ${error?.message || 'Unknown error'}`);
    }
}

export async function updateChallenge(userId: string, challenge: any) {
    try {
        const userDocRef = doc(db, 'userData', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const data = userDoc.data();
            const challenges = data.challenges || [];
            const updatedChallenges = challenges.map((c: any) => 
                c.id === challenge.id ? challenge : c
            );
            await setDoc(userDocRef, { ...data, challenges: updatedChallenges });
        }
        console.log('Successfully updated challenge for user:', userId);
    } catch (error: any) {
        console.error('Error updating challenge:', error);
        throw new Error(`Failed to update challenge: ${error?.message || 'Unknown error'}`);
    }
}

export async function addChallenge(userId: string, newChallenge: any) {
    try {
        const userDocRef = doc(db, 'userData', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const data = userDoc.data();
            const challenges = data.challenges || [];
            challenges.push(newChallenge);
            await setDoc(userDocRef, { ...data, challenges });
        } else {
            await setDoc(userDocRef, { challenges: [newChallenge] });
        }
        console.log('Successfully added challenge for user:', userId);
    } catch (error: any) {
        console.error('Error adding challenge:', error);
        throw new Error(`Failed to add challenge: ${error?.message || 'Unknown error'}`);
    }
}

export async function removeChallenge(userId: string, challengeId: string) {
    try {
        const userDocRef = doc(db, 'userData', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const data = userDoc.data();
            const challenges = data.challenges || [];
            const filteredChallenges = challenges.filter((c: any) => c.id !== challengeId);
            await setDoc(userDocRef, { ...data, challenges: filteredChallenges });
        }
        console.log('Successfully removed challenge for user:', userId);
    } catch (error: any) {
        console.error('Error removing challenge:', error);
        throw new Error(`Failed to remove challenge: ${error?.message || 'Unknown error'}`);
    }
}

// Profile management functions
export async function updateUserProfile(uid: string, updates: Partial<Omit<User, 'uid'>>) {
    try {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, updates);
        console.log(`Successfully updated user profile for UID: ${uid}`);
    } catch (error: any) {
        console.error('Error updating user profile:', error);
        
        if (error?.code === 'permission-denied') {
            throw new Error('Permission denied: Please check Firestore security rules.');
        }
        
        throw new Error(`Failed to update user profile: ${error?.message || 'Unknown error'}`);
    }
}

export async function uploadProfileImage(uid: string, file: File): Promise<string> {
    try {
        console.log('Starting profile image upload for UID:', uid);
        console.log('File details:', { name: file.name, size: file.size, type: file.type });
        
        // Check if storage is properly initialized
        if (!storage || typeof storage !== 'object') {
            throw new Error('Firebase Storage is not properly initialized');
        }
        
        // Create a reference to the storage location
        const imageRef = ref(storage, `profile-images/${uid}/${Date.now()}-${file.name}`);
        console.log('Created storage reference:', imageRef.fullPath);
        
        // Upload the file
        console.log('Uploading file to Firebase Storage...');
        const snapshot = await uploadBytes(imageRef, file);
        console.log('Upload complete, snapshot:', snapshot.ref.fullPath);
        
        // Get the download URL
        console.log('Getting download URL...');
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Download URL obtained:', downloadURL);
        
        // Update user profile with new avatar URL
        console.log('Updating user profile with new avatar URL...');
        await updateUserProfile(uid, { avatarUrl: downloadURL });
        
        console.log('Successfully uploaded profile image for UID:', uid);
        return downloadURL;
    } catch (error: any) {
        console.error('Error uploading profile image:', error);
        console.error('Error details:', {
            code: error?.code,
            message: error?.message,
            name: error?.name,
            stack: error?.stack
        });
        
        if (error?.code === 'storage/unauthorized') {
            throw new Error('Permission denied: Unable to upload to Firebase Storage. Check storage security rules.');
        }
        
        if (error?.code === 'storage/unknown') {
            throw new Error('Storage service unavailable. Please try again later.');
        }
        
        throw new Error(`Failed to upload profile image: ${error?.message || 'Unknown error'}`);
    }
}

export async function updateBuddyPersona(uid: string, buddyPersona: BuddyPersona) {
    try {
        await updateUserProfile(uid, { buddyPersona });
        console.log('Successfully updated buddy persona for UID:', uid);
    } catch (error: any) {
        console.error('Error updating buddy persona:', error);
        throw new Error(`Failed to update buddy persona: ${error?.message || 'Unknown error'}`);
    }
}

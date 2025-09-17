
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import type { CommunityPost } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const USER_DATA_COLLECTION = 'userData';

// This function can be used to get all posts for a user.
export async function getCommunityPosts(userId: string): Promise<CommunityPost[]> {
    const userDocRef = doc(db, USER_DATA_COLLECTION, userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().posts) {
        return userDoc.data().posts;
    }
    return [];
}

export async function addCommunityPost(userId: string, newPost: CommunityPost) {
    const userDocRef = doc(db, USER_DATA_COLLECTION, userId);
     const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
        await setDoc(userDocRef, { posts: [newPost] });
    } else {
        await updateDoc(userDocRef, {
            posts: arrayUnion(newPost)
        });
    }
    revalidatePath('/community');
}

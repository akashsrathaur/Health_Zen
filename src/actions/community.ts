
'use server';

import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  increment, 
  arrayUnion, 
  query, 
  orderBy, 
  getDocs, 
  getDoc 
} from 'firebase/firestore';
import type { CommunityPost, PostComment } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';

const COMMUNITY_POSTS_COLLECTION = 'communityPosts';

// Get all community posts (public)
export async function getAllCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const postsCollection = collection(db, COMMUNITY_POSTS_COLLECTION);
    const q = query(postsCollection, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CommunityPost[];
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return [];
  }
}

// Add a new community post (public)
export async function addCommunityPost(newPost: Omit<CommunityPost, 'id'>): Promise<{ success: boolean; id?: string; error?: string; details?: any }> {
  try {
    // Check if Firebase is properly configured
    if (!db || !db.app) {
      console.error('Firebase not properly configured');
      return {
        success: false,
        error: 'Firebase is not properly configured. Please set up your environment variables.',
        details: { code: 'FIREBASE_NOT_CONFIGURED' }
      };
    }

    console.log('Adding community post:', newPost);
    const postsCollection = collection(db, COMMUNITY_POSTS_COLLECTION);
    console.log('Posts collection reference:', postsCollection);
    
    const postData = {
      ...newPost,
      timestamp: new Date().toISOString(),
      reactions: newPost.reactions || {},
      userReactions: newPost.userReactions || {},
      comments: newPost.comments || []
    };
    
    console.log('Post data to be saved:', postData);
    const docRef = await addDoc(postsCollection, postData);
    console.log('Post saved with ID:', docRef.id);
    
    revalidatePath('/community');
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding community post:', error);
    console.error('Error details:', {
      code: (error as any)?.code,
      message: (error as any)?.message,
      stack: (error as any)?.stack,
      name: (error as any)?.name
    });
    
    // Check if it's a Firestore-specific error
    if ((error as any)?.code?.includes('permission-denied')) {
      console.error('Permission denied - check Firestore security rules');
      throw new Error('Permission denied: Unable to write to communityPosts collection. Check Firestore security rules.');
    }
    
    if ((error as any)?.code?.includes('not-found')) {
      console.error('Collection not found - communityPosts collection may not exist');
      throw new Error('Collection not found: communityPosts collection does not exist in Firestore.');
    }
    
    // Return error information instead of throwing in some cases
    return { 
      success: false, 
      error: (error as any)?.message || 'An unexpected error occurred while creating the post',
      details: {
        code: (error as any)?.code,
        name: (error as any)?.name,
        message: (error as any)?.message
      }
    };
  }
}

// Toggle reaction on a post
export async function togglePostReaction(postId: string, userId: string, emoji: string) {
  try {
    const postRef = doc(db, COMMUNITY_POSTS_COLLECTION, postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    const postData = postDoc.data() as CommunityPost;
    const currentUserReaction = postData.userReactions?.[userId];
    
    const updates: any = {};
    
    if (currentUserReaction === emoji) {
      // Remove reaction
      updates[`reactions.${emoji}`] = increment(-1);
      updates[`userReactions.${userId}`] = null;
    } else if (currentUserReaction) {
      // Change reaction
      updates[`reactions.${currentUserReaction}`] = increment(-1);
      updates[`reactions.${emoji}`] = increment(1);
      updates[`userReactions.${userId}`] = emoji;
    } else {
      // Add new reaction
      updates[`reactions.${emoji}`] = increment(1);
      updates[`userReactions.${userId}`] = emoji;
    }
    
    await updateDoc(postRef, updates);
    revalidatePath('/community');
  } catch (error) {
    console.error('Error toggling post reaction:', error);
    throw error;
  }
}

// Add comment to a post
export async function addCommentToPost(postId: string, comment: Omit<PostComment, 'id' | 'timestamp'>) {
  try {
    const newComment: PostComment = {
      id: nanoid(),
      ...comment,
      timestamp: new Date().toISOString()
    };
    
    const postRef = doc(db, COMMUNITY_POSTS_COLLECTION, postId);
    await updateDoc(postRef, {
      comments: arrayUnion(newComment)
    });
    
    revalidatePath('/community');
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

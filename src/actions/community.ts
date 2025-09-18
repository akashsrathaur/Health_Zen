
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
import type { CommunityPost, Comment } from '@/lib/data';
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
export async function addCommunityPost(newPost: Omit<CommunityPost, 'id'>) {
  try {
    const postsCollection = collection(db, COMMUNITY_POSTS_COLLECTION);
    await addDoc(postsCollection, {
      ...newPost,
      timestamp: new Date().toISOString(),
      reactions: {},
      userReactions: {},
      comments: []
    });
    revalidatePath('/community');
  } catch (error) {
    console.error('Error adding community post:', error);
    throw error;
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
export async function addCommentToPost(postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) {
  try {
    const newComment: Comment = {
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

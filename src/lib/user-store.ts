
// This store now defines the User data structure.
// The actual user data will be managed by AuthContext and fetched from Firestore.

export type BuddyPersona = {
    name: string;
    age: number;
    gender: string;
    relationship: string;
};

export type User = {
    uid: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    avatarUrl: string;
    streak: number;
    points: number;
    dailyPoints: number;
    lastActivityDate: string;
    totalTasksCompleted: number;
    bio?: string;
    phone?: string;
    buddyPersona?: BuddyPersona;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    dosha?: 'Vata' | 'Pitta' | 'Kapha';
    doshaIsBalanced?: boolean;
};

// Default user data for a logged-out or new user state.
export const defaultUser: Omit<User, 'uid'> = {
    name: 'Wellness Seeker',
    age: 0,
    gender: 'Prefer not to say',
    avatarUrl: 'https://picsum.photos/seed/default-avatar/100/100',
    streak: 1,
    points: 0,
    dailyPoints: 0,
    lastActivityDate: new Date().toISOString().split('T')[0],
    totalTasksCompleted: 0,
    bio: 'Passionate about holistic wellness and mindful living.',
    emailNotifications: true,
    pushNotifications: false,
    dosha: undefined,
    doshaIsBalanced: false,
    buddyPersona: {
        name: 'Zen',
        age: 25,
        gender: 'Non-binary',
        relationship: 'Friend',
    },
}

// A simple in-memory store to simulate a logged-in user's data.
// In a real application, this would be replaced with a proper state management solution
// like React Context, Redux, or data fetched from a server-side session.

type User = {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    avatarUrl: string;
    streak: number;
}

// Default user data for when no one has "signed up" yet.
const defaultUser: User = {
    name: 'Wellness Seeker',
    age: 0,
    gender: 'Prefer not to say',
    avatarUrl: 'https://picsum.photos/seed/default-avatar/100/100',
    streak: 0,
}

// This will hold the current user's data in memory.
let currentUser: User = defaultUser;

export const getUser = (): User => {
    return currentUser;
}

export const setUser = (newUser: Partial<User>) => {
    currentUser = { ...defaultUser, ...currentUser, ...newUser };
}

export type AvatarOption = {
  id: string;
  name: string;
  url: string;
  gender: 'male' | 'female';
  style: string;
};

export const avatarOptions: AvatarOption[] = [
  // Male Avatars
  {
    id: 'male-1',
    name: 'Alex Professional',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex-pro&gender=male&backgroundColor=b6e3f4&clothingColor=262e33',
    gender: 'male',
    style: 'Professional'
  },
  {
    id: 'male-2',
    name: 'Ryan Casual',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ryan-casual&gender=male&backgroundColor=c0aede&clothingColor=3c4f5c',
    gender: 'male',
    style: 'Casual'
  },
  {
    id: 'male-3',
    name: 'Jake Sporty',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jake-sporty&gender=male&backgroundColor=ffd93d&clothingColor=65c9ff',
    gender: 'male',
    style: 'Sporty'
  },
  {
    id: 'male-4',
    name: 'Marcus Cool',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus-cool&gender=male&backgroundColor=ffb3ba&clothingColor=2c1b18',
    gender: 'male',
    style: 'Cool'
  },
  {
    id: 'male-5',
    name: 'David Smart',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david-smart&gender=male&backgroundColor=bae1ff&clothingColor=25262b',
    gender: 'male',
    style: 'Smart'
  },
  {
    id: 'male-6',
    name: 'Lucas Friendly',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas-friendly&gender=male&backgroundColor=d4edda&clothingColor=721c24',
    gender: 'male',
    style: 'Friendly'
  },
  {
    id: 'male-7',
    name: 'Sam Trendy',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sam-trendy&gender=male&backgroundColor=fff3cd&clothingColor=495057',
    gender: 'male',
    style: 'Trendy'
  },
  {
    id: 'male-8',
    name: 'Ben Active',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ben-active&gender=male&backgroundColor=e2e3e5&clothingColor=0c5460',
    gender: 'male',
    style: 'Active'
  },
  {
    id: 'male-9',
    name: 'Chris Modern',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris-modern&gender=male&backgroundColor=f8d7da&clothingColor=155724',
    gender: 'male',
    style: 'Modern'
  },
  {
    id: 'male-10',
    name: 'Tyler Creative',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tyler-creative&gender=male&backgroundColor=d1ecf1&clothingColor=842029',
    gender: 'male',
    style: 'Creative'
  },
  {
    id: 'male-11',
    name: 'Noah Zen',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=noah-zen&gender=male&backgroundColor=e7e8ea&clothingColor=0f5132',
    gender: 'male',
    style: 'Zen'
  },
  {
    id: 'male-12',
    name: 'Ethan Bold',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ethan-bold&gender=male&backgroundColor=fff2cc&clothingColor=664d03',
    gender: 'male',
    style: 'Bold'
  },

  // Female Avatars
  {
    id: 'female-1',
    name: 'Emma Professional',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma-pro&gender=female&backgroundColor=b6e3f4&clothingColor=262e33',
    gender: 'female',
    style: 'Professional'
  },
  {
    id: 'female-2',
    name: 'Sophia Elegant',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia-elegant&gender=female&backgroundColor=c0aede&clothingColor=3c4f5c',
    gender: 'female',
    style: 'Elegant'
  },
  {
    id: 'female-3',
    name: 'Mia Sporty',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mia-sporty&gender=female&backgroundColor=ffd93d&clothingColor=65c9ff',
    gender: 'female',
    style: 'Sporty'
  },
  {
    id: 'female-4',
    name: 'Olivia Chic',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia-chic&gender=female&backgroundColor=ffb3ba&clothingColor=2c1b18',
    gender: 'female',
    style: 'Chic'
  },
  {
    id: 'female-5',
    name: 'Isabella Smart',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=isabella-smart&gender=female&backgroundColor=bae1ff&clothingColor=25262b',
    gender: 'female',
    style: 'Smart'
  },
  {
    id: 'female-6',
    name: 'Charlotte Friendly',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlotte-friendly&gender=female&backgroundColor=d4edda&clothingColor=721c24',
    gender: 'female',
    style: 'Friendly'
  },
  {
    id: 'female-7',
    name: 'Amelia Trendy',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amelia-trendy&gender=female&backgroundColor=fff3cd&clothingColor=495057',
    gender: 'female',
    style: 'Trendy'
  },
  {
    id: 'female-8',
    name: 'Harper Active',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=harper-active&gender=female&backgroundColor=e2e3e5&clothingColor=0c5460',
    gender: 'female',
    style: 'Active'
  },
  {
    id: 'female-9',
    name: 'Evelyn Modern',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=evelyn-modern&gender=female&backgroundColor=f8d7da&clothingColor=155724',
    gender: 'female',
    style: 'Modern'
  },
  {
    id: 'female-10',
    name: 'Luna Creative',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna-creative&gender=female&backgroundColor=d1ecf1&clothingColor=842029',
    gender: 'female',
    style: 'Creative'
  },
  {
    id: 'female-11',
    name: 'Grace Zen',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace-zen&gender=female&backgroundColor=e7e8ea&clothingColor=0f5132',
    gender: 'female',
    style: 'Zen'
  },
  {
    id: 'female-12',
    name: 'Zoe Bold',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zoe-bold&gender=female&backgroundColor=fff2cc&clothingColor=664d03',
    gender: 'female',
    style: 'Bold'
  },
  {
    id: 'female-13',
    name: 'Aria Wellness',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aria-wellness&gender=female&backgroundColor=d0f0c0&clothingColor=2d5016',
    gender: 'female',
    style: 'Wellness'
  },
  {
    id: 'female-14',
    name: 'Maya Calm',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya-calm&gender=female&backgroundColor=e8f4fd&clothingColor=0a58ca',
    gender: 'female',
    style: 'Calm'
  },
];

export const getMaleAvatars = (): AvatarOption[] => {
  return avatarOptions.filter(avatar => avatar.gender === 'male');
};

export const getFemaleAvatars = (): AvatarOption[] => {
  return avatarOptions.filter(avatar => avatar.gender === 'female');
};

export const getAvatarById = (id: string): AvatarOption | undefined => {
  return avatarOptions.find(avatar => avatar.id === id);
};
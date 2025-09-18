export type AvatarOption = {
  id: string;
  name: string;
  url: string;
  gender: 'male' | 'female';
  style: string;
};

export const avatarOptions: AvatarOption[] = [
  // Male Avatars - Smiling & Friendly
  {
    id: 'male-1',
    name: 'Alex Happy',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex-smile&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=b6e3f4&clothingColor=262e33&clothingGraphic=bear',
    gender: 'male',
    style: 'Happy'
  },
  {
    id: 'male-2',
    name: 'Ryan Joyful',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ryan-joy&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=c0aede&clothingColor=3c4f5c&clothingGraphic=pizza',
    gender: 'male',
    style: 'Joyful'
  },
  {
    id: 'male-3',
    name: 'Jake Cheerful',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jake-cheer&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=ffd93d&clothingColor=65c9ff&clothingGraphic=skullOutline',
    gender: 'male',
    style: 'Cheerful'
  },
  {
    id: 'male-4',
    name: 'Marcus Bright',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus-bright&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=ffb3ba&clothingColor=2c1b18&clothingGraphic=diamond',
    gender: 'male',
    style: 'Bright'
  },
  {
    id: 'male-5',
    name: 'David Warm',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david-warm&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=bae1ff&clothingColor=25262b&clothingGraphic=selena',
    gender: 'male',
    style: 'Warm'
  },
  {
    id: 'male-6',
    name: 'Lucas Friendly',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas-friend&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d4edda&clothingColor=721c24&clothingGraphic=bear',
    gender: 'male',
    style: 'Friendly'
  },
  {
    id: 'male-7',
    name: 'Sam Radiant',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sam-radiant&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=fff3cd&clothingColor=495057&clothingGraphic=resist',
    gender: 'male',
    style: 'Radiant'
  },
  {
    id: 'male-8',
    name: 'Ben Energetic',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ben-energy&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e2e3e5&clothingColor=0c5460&clothingGraphic=skull',
    gender: 'male',
    style: 'Energetic'
  },
  {
    id: 'male-9',
    name: 'Chris Positive',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris-positive&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=f8d7da&clothingColor=155724&clothingGraphic=pizza',
    gender: 'male',
    style: 'Positive'
  },
  {
    id: 'male-10',
    name: 'Tyler Vibrant',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tyler-vibrant&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d1ecf1&clothingColor=842029&clothingGraphic=diamond',
    gender: 'male',
    style: 'Vibrant'
  },
  {
    id: 'male-11',
    name: 'Noah Peaceful',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=noah-peace&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e7e8ea&clothingColor=0f5132&clothingGraphic=selena',
    gender: 'male',
    style: 'Peaceful'
  },
  {
    id: 'male-12',
    name: 'Ethan Confident',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ethan-confident&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=fff2cc&clothingColor=664d03&clothingGraphic=bear',
    gender: 'male',
    style: 'Confident'
  },
  {
    id: 'male-13',
    name: 'Liam Optimistic',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liam-optimist&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d0f0c0&clothingColor=2d5016&clothingGraphic=resist',
    gender: 'male',
    style: 'Optimistic'
  },
  {
    id: 'male-14',
    name: 'Oliver Sunny',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=oliver-sunny&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=ffe4e1&clothingColor=6c757d&clothingGraphic=skull',
    gender: 'male',
    style: 'Sunny'
  },
  {
    id: 'male-15',
    name: 'Mason Gentle',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mason-gentle&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e8f5e8&clothingColor=2d5a27&clothingGraphic=bear',
    gender: 'male',
    style: 'Gentle'
  },
  {
    id: 'male-16',
    name: 'Leo Serene',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leo-serene&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e7f3ff&clothingColor=0c5460&clothingGraphic=selena',
    gender: 'male',
    style: 'Serene'
  },
  {
    id: 'male-17',
    name: 'Felix Balanced',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=felix-balanced&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=f8d7da&clothingColor=721c24&clothingGraphic=pizza',
    gender: 'male',
    style: 'Balanced'
  },
  {
    id: 'male-18',
    name: 'Miles Pleasant',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=miles-pleasant&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=fff2cc&clothingColor=664d03&clothingGraphic=resist',
    gender: 'male',
    style: 'Pleasant'
  },
  {
    id: 'male-19',
    name: 'Kai Mellow',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kai-mellow&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e2e3e5&clothingColor=495057&clothingGraphic=diamond',
    gender: 'male',
    style: 'Mellow'
  },
  {
    id: 'male-20',
    name: 'River Tranquil',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=river-tranquil&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=d1ecf1&clothingColor=0c5460&clothingGraphic=skull',
    gender: 'male',
    style: 'Tranquil'
  },

  // Female Avatars - Smiling & Friendly
  {
    id: 'female-1',
    name: 'Emma Radiant',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma-radiant&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=b6e3f4&clothingColor=262e33&clothingGraphic=pizza',
    gender: 'female',
    style: 'Radiant'
  },
  {
    id: 'female-2',
    name: 'Sophia Bright',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia-bright&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=c0aede&clothingColor=3c4f5c&clothingGraphic=bear',
    gender: 'female',
    style: 'Bright'
  },
  {
    id: 'female-3',
    name: 'Mia Cheerful',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mia-cheerful&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=ffd93d&clothingColor=65c9ff&clothingGraphic=selena',
    gender: 'female',
    style: 'Cheerful'
  },
  {
    id: 'female-4',
    name: 'Olivia Joyful',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia-joyful&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=ffb3ba&clothingColor=2c1b18&clothingGraphic=diamond',
    gender: 'female',
    style: 'Joyful'
  },
  {
    id: 'female-5',
    name: 'Isabella Happy',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=isabella-happy&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=bae1ff&clothingColor=25262b&clothingGraphic=resist',
    gender: 'female',
    style: 'Happy'
  },
  {
    id: 'female-6',
    name: 'Charlotte Warm',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlotte-warm&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d4edda&clothingColor=721c24&clothingGraphic=skull',
    gender: 'female',
    style: 'Warm'
  },
  {
    id: 'female-7',
    name: 'Amelia Sunny',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amelia-sunny&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=fff3cd&clothingColor=495057&clothingGraphic=pizza',
    gender: 'female',
    style: 'Sunny'
  },
  {
    id: 'female-8',
    name: 'Harper Vibrant',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=harper-vibrant&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e2e3e5&clothingColor=0c5460&clothingGraphic=bear',
    gender: 'female',
    style: 'Vibrant'
  },
  {
    id: 'female-9',
    name: 'Evelyn Positive',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=evelyn-positive&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=f8d7da&clothingColor=155724&clothingGraphic=selena',
    gender: 'female',
    style: 'Positive'
  },
  {
    id: 'female-10',
    name: 'Luna Glowing',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna-glowing&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d1ecf1&clothingColor=842029&clothingGraphic=diamond',
    gender: 'female',
    style: 'Glowing'
  },
  {
    id: 'female-11',
    name: 'Grace Peaceful',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace-peaceful&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e7e8ea&clothingColor=0f5132&clothingGraphic=resist',
    gender: 'female',
    style: 'Peaceful'
  },
  {
    id: 'female-12',
    name: 'Zoe Confident',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zoe-confident&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=fff2cc&clothingColor=664d03&clothingGraphic=skull',
    gender: 'female',
    style: 'Confident'
  },
  {
    id: 'female-13',
    name: 'Aria Serene',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aria-serene&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d0f0c0&clothingColor=2d5016&clothingGraphic=pizza',
    gender: 'female',
    style: 'Serene'
  },
  {
    id: 'female-14',
    name: 'Maya Gentle',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya-gentle&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e8f4fd&clothingColor=0a58ca&clothingGraphic=bear',
    gender: 'female',
    style: 'Gentle'
  },
  {
    id: 'female-15',
    name: 'Lily Optimistic',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lily-optimist&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=fce4ec&clothingColor=880e4f&clothingGraphic=selena',
    gender: 'female',
    style: 'Optimistic'
  },
  {
    id: 'female-16',
    name: 'Chloe Energetic',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chloe-energy&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=f3e5f5&clothingColor=4a148c&clothingGraphic=diamond',
    gender: 'female',
    style: 'Energetic'
  },
  {
    id: 'female-17',
    name: 'Ruby Sweet',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ruby-sweet&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=ffe0e6&clothingColor=6f42c1&clothingGraphic=resist',
    gender: 'female',
    style: 'Sweet'
  },
  {
    id: 'female-18',
    name: 'Willow Calm',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=willow-calm&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=e9ecef&clothingColor=495057&clothingGraphic=selena',
    gender: 'female',
    style: 'Calm'
  },
  {
    id: 'female-19',
    name: 'Sage Balanced',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sage-balanced&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d4edda&clothingColor=155724&clothingGraphic=bear',
    gender: 'female',
    style: 'Balanced'
  },
  {
    id: 'female-20',
    name: 'Nova Bright',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nova-bright&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=fff3cd&clothingColor=856404&clothingGraphic=pizza',
    gender: 'female',
    style: 'Bright'
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
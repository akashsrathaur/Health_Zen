export type AvatarOption = {
  id: string;
  name: string;
  url: string;
  gender: 'male' | 'female';
  style: string;
};

export const avatarOptions: AvatarOption[] = [
  // 15 Male Avatars - Popular & Smiling
  {
    id: 'male-1',
    name: 'James',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james-cool&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=ffd93d&clothingColor=262e33&clothingGraphic=bear',
    gender: 'male',
    style: 'Cool'
  },
  {
    id: 'male-2', 
    name: 'Michael',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael-smile&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=b6e3f4&clothingColor=3c4f5c&clothingGraphic=pizza',
    gender: 'male',
    style: 'Friendly'
  },
  {
    id: 'male-3',
    name: 'William',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=william-happy&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=c0aede&clothingColor=65c9ff&clothingGraphic=skull',
    gender: 'male',
    style: 'Happy'
  },
  {
    id: 'male-4',
    name: 'David',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david-joy&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=ffb3ba&clothingColor=2c1b18&clothingGraphic=diamond',
    gender: 'male',
    style: 'Joyful'
  },
  {
    id: 'male-5',
    name: 'Richard',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=richard-warm&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=bae1ff&clothingColor=25262b&clothingGraphic=selena',
    gender: 'male',
    style: 'Warm'
  },
  {
    id: 'male-6',
    name: 'Joseph',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joseph-bright&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d4edda&clothingColor=721c24&clothingGraphic=resist',
    gender: 'male',
    style: 'Bright'
  },
  {
    id: 'male-7',
    name: 'Thomas',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thomas-radiant&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=fff3cd&clothingColor=495057&clothingGraphic=bear',
    gender: 'male',
    style: 'Radiant'
  },
  {
    id: 'male-8',
    name: 'Robert',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert-energy&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e2e3e5&clothingColor=0c5460&clothingGraphic=pizza',
    gender: 'male',
    style: 'Energetic'
  },
  {
    id: 'male-9',
    name: 'Christopher',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=christopher-positive&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=f8d7da&clothingColor=155724&clothingGraphic=skull',
    gender: 'male',
    style: 'Positive'
  },
  {
    id: 'male-10',
    name: 'Matthew',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=matthew-vibrant&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d1ecf1&clothingColor=842029&clothingGraphic=diamond',
    gender: 'male',
    style: 'Vibrant'
  },
  {
    id: 'male-11',
    name: 'Anthony',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anthony-calm&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e7e8ea&clothingColor=0f5132&clothingGraphic=selena',
    gender: 'male',
    style: 'Calm'
  },
  {
    id: 'male-12',
    name: 'Daniel',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=daniel-confident&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=fff2cc&clothingColor=664d03&clothingGraphic=resist',
    gender: 'male',
    style: 'Confident'
  },
  {
    id: 'male-13',
    name: 'Mark',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mark-optimistic&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d0f0c0&clothingColor=2d5016&clothingGraphic=bear',
    gender: 'male',
    style: 'Optimistic'
  },
  {
    id: 'male-14',
    name: 'Paul',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=paul-sunny&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=ffe4e1&clothingColor=6c757d&clothingGraphic=pizza',
    gender: 'male',
    style: 'Sunny'
  },
  {
    id: 'male-15',
    name: 'Steven',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=steven-gentle&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e8f5e8&clothingColor=2d5a27&clothingGraphic=skull',
    gender: 'male',
    style: 'Gentle'
  },

  // 15 Female Avatars - Popular & Smiling
  {
    id: 'female-1',
    name: 'Mary',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mary-radiant&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=b6e3f4&clothingColor=262e33&clothingGraphic=pizza',
    gender: 'female',
    style: 'Radiant'
  },
  {
    id: 'female-2',
    name: 'Patricia',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=patricia-bright&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=c0aede&clothingColor=3c4f5c&clothingGraphic=bear',
    gender: 'female',
    style: 'Bright'
  },
  {
    id: 'female-3',
    name: 'Jennifer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer-cheerful&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=ffd93d&clothingColor=65c9ff&clothingGraphic=selena',
    gender: 'female',
    style: 'Cheerful'
  },
  {
    id: 'female-4',
    name: 'Linda',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linda-joyful&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=ffb3ba&clothingColor=2c1b18&clothingGraphic=diamond',
    gender: 'female',
    style: 'Joyful'
  },
  {
    id: 'female-5',
    name: 'Elizabeth',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elizabeth-happy&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=bae1ff&clothingColor=25262b&clothingGraphic=resist',
    gender: 'female',
    style: 'Happy'
  },
  {
    id: 'female-6',
    name: 'Barbara',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=barbara-warm&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d4edda&clothingColor=721c24&clothingGraphic=skull',
    gender: 'female',
    style: 'Warm'
  },
  {
    id: 'female-7',
    name: 'Susan',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=susan-sunny&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=fff3cd&clothingColor=495057&clothingGraphic=pizza',
    gender: 'female',
    style: 'Sunny'
  },
  {
    id: 'female-8',
    name: 'Jessica',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica-vibrant&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e2e3e5&clothingColor=0c5460&clothingGraphic=bear',
    gender: 'female',
    style: 'Vibrant'
  },
  {
    id: 'female-9',
    name: 'Sarah',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-positive&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=f8d7da&clothingColor=155724&clothingGraphic=selena',
    gender: 'female',
    style: 'Positive'
  },
  {
    id: 'female-10',
    name: 'Karen',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karen-glowing&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d1ecf1&clothingColor=842029&clothingGraphic=diamond',
    gender: 'female',
    style: 'Glowing'
  },
  {
    id: 'female-11',
    name: 'Nancy',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nancy-peaceful&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e7e8ea&clothingColor=0f5132&clothingGraphic=resist',
    gender: 'female',
    style: 'Peaceful'
  },
  {
    id: 'female-12',
    name: 'Lisa',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa-confident&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=fff2cc&clothingColor=664d03&clothingGraphic=skull',
    gender: 'female',
    style: 'Confident'
  },
  {
    id: 'female-13',
    name: 'Betty',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=betty-serene&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=d0f0c0&clothingColor=2d5016&clothingGraphic=pizza',
    gender: 'female',
    style: 'Serene'
  },
  {
    id: 'female-14',
    name: 'Dorothy',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dorothy-gentle&mouth=smile&eyes=happy&eyebrows=default&backgroundColor=e8f4fd&clothingColor=0a58ca&clothingGraphic=bear',
    gender: 'female',
    style: 'Gentle'
  },
  {
    id: 'female-15',
    name: 'Helen',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=helen-optimistic&mouth=smile&eyes=happy&eyebrows=raisedExcited&backgroundColor=fce4ec&clothingColor=880e4f&clothingGraphic=selena',
    gender: 'female',
    style: 'Optimistic'
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
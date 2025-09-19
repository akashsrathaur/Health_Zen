'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Story {
  id: string;
  user: {
    uid: string;
    name: string;
    avatarUrl: string;
  };
  viewed?: boolean;
}

interface StoriesProps {
  stories?: Story[];
  currentUser?: {
    uid: string;
    name: string;
    avatarUrl: string;
  } | null;
  onAddStory?: () => void;
  onViewStory?: (storyId: string) => void;
}

export function Stories({ 
  stories = [], 
  currentUser, 
  onAddStory, 
  onViewStory 
}: StoriesProps) {
  // Default stories for demo
  const defaultStories: Story[] = [
    {
      id: 'lisa-story',
      user: {
        uid: 'lisa-h',
        name: 'lisa_h',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa-h&mouth=smile&eyes=happy&backgroundColor=b6e3f4'
      }
    },
    {
      id: 'alex-story', 
      user: {
        uid: 'alex-j',
        name: 'alex.j',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex-j&mouth=smile&eyes=happy&backgroundColor=c0aede'
      }
    },
    {
      id: 'sarah-story',
      user: {
        uid: 'sarah-d',
        name: 'sarah_d',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah-d&mouth=smile&eyes=happy&backgroundColor=ffd93d'
      }
    },
    {
      id: 'chris-story',
      user: {
        uid: 'chris-p',
        name: 'chris.p',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris-p&mouth=smile&eyes=happy&backgroundColor=ffb3ba'
      }
    }
  ];

  const displayStories = stories.length > 0 ? stories : defaultStories;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 mb-6 scrollbar-hide">
      {/* Add Story */}
      {currentUser && (
        <div className="flex flex-col items-center gap-2 min-w-[80px]">
          <div className="relative">
            <Avatar 
              variant="gradient" 
              className="h-16 w-16 cursor-pointer hover:scale-105 transition-all"
              onClick={onAddStory}
            >
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                {currentUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="gradient"
              size="sm"
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 shadow-lg hover:scale-110 transition-all"
              onClick={onAddStory}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-xs font-medium text-center">Add Story</span>
        </div>
      )}

      {/* Stories */}
      {displayStories.map((story) => (
        <div 
          key={story.id} 
          className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer"
          onClick={() => onViewStory?.(story.id)}
        >
          <Avatar 
            variant="story"
            className={cn(
              "h-16 w-16 transition-all hover:scale-105",
              story.viewed && "opacity-60"
            )}
          >
            <AvatarImage src={story.user.avatarUrl} alt={story.user.name} />
            <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-center truncate w-20">
            {story.user.name}
          </span>
        </div>
      ))}
    </div>
  );
}

'use client';
import Image from 'next/image';
import { Balancer } from 'react-wrap-balancer';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { communityPosts as initialCommunityPosts, userData } from '@/lib/data';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { nanoid } from 'nanoid';

type CommunityPost = (typeof initialCommunityPosts)[0];

function PostCard({ post }: { post: CommunityPost }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar>
          <AvatarImage src={post.user.avatarUrl} alt={post.user.name} />
          <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <p className="font-semibold">{post.user.name}</p>
          <p className="text-sm text-muted-foreground">{post.timestamp}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{post.content}</p>
        {post.imageUrl && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image
              src={post.imageUrl}
              alt="Post image"
              fill
              className="object-cover"
              data-ai-hint={post.imageHint}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        {Object.entries(post.reactions).map(([emoji, count]) => (
          <Button key={emoji} variant="outline" size="sm" className="rounded-full">
            {emoji} <span className="ml-2 text-xs text-muted-foreground">{count}</span>
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}

function CreatePost({ onAddPost }: { onAddPost: (content: string) => void }) {
    const [content, setContent] = useState('');

    const handlePost = () => {
        if (content.trim()) {
            onAddPost(content);
            setContent('');
        }
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarImage src={userData.avatarUrl} />
                        <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="w-full space-y-2">
                        <Textarea 
                            placeholder="Share a wellness tip or a story..." 
                            className="border-none focus-visible:ring-0 shadow-none px-0" 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="flex justify-between items-center">
                            <Button variant="ghost" size="icon">
                                <Camera className="h-5 w-5 text-muted-foreground" />
                            </Button>
                            <Button size="sm" onClick={handlePost} disabled={!content.trim()}>
                                Post <Send className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(initialCommunityPosts);
  
  const handleAddPost = (content: string) => {
    const newPost: CommunityPost = {
      id: nanoid(),
      user: {
        name: userData.name,
        avatarUrl: userData.avatarUrl,
      },
      timestamp: 'Just now',
      content: content,
      reactions: {},
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Community Feed
        </h1>
        <p className="text-muted-foreground">
          <Balancer>
            Share your journey and get inspired by others in the HealthZen community.
          </Balancer>
        </p>
      </div>

      <div className="space-y-6">
        <CreatePost onAddPost={handleAddPost} />
        <Separator />
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

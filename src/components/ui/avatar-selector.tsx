'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { avatarOptions, getMaleAvatars, getFemaleAvatars, type AvatarOption } from '@/lib/avatars';

interface AvatarSelectorProps {
  currentAvatarUrl?: string;
  onAvatarSelect: (avatarUrl: string, avatarId: string) => void;
  disabled?: boolean;
}

export function AvatarSelector({ currentAvatarUrl, onAvatarSelect, disabled = false }: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption | null>(null);

  const handleAvatarClick = (avatar: AvatarOption) => {
    setSelectedAvatar(avatar);
  };

  const handleConfirmSelection = () => {
    if (selectedAvatar) {
      onAvatarSelect(selectedAvatar.url, selectedAvatar.id);
      setIsOpen(false);
      setSelectedAvatar(null);
    }
  };

  const AvatarGrid = ({ avatars }: { avatars: AvatarOption[] }) => (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
      {avatars.map((avatar) => (
        <div key={avatar.id} className="flex flex-col items-center gap-2">
          <div
            className={cn(
              "relative p-1 rounded-full border-2 cursor-pointer transition-all hover:scale-105",
              selectedAvatar?.id === avatar.id
                ? "border-primary shadow-lg"
                : "border-transparent hover:border-primary/50",
              currentAvatarUrl === avatar.url && !selectedAvatar
                ? "border-primary/70"
                : ""
            )}
            onClick={() => handleAvatarClick(avatar)}
          >
            <Avatar className="h-16 w-16 md:h-20 md:w-20">
              <AvatarImage src={avatar.url} alt={avatar.name} />
              <AvatarFallback>{avatar.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {selectedAvatar?.id === avatar.id && (
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-xs font-medium truncate w-20">{avatar.name.split(' ')[0]}</p>
            <Badge variant="secondary" className="text-xs px-1 py-0">
              {avatar.style}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Palette className="h-4 w-4" />
          Choose Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 overflow-hidden">
          <Tabs defaultValue="male" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="male">Male ({getMaleAvatars().length})</TabsTrigger>
              <TabsTrigger value="female">Female ({getFemaleAvatars().length})</TabsTrigger>
            </TabsList>
            <div className="mt-4 overflow-y-auto max-h-[400px] pr-2">
              <TabsContent value="male" className="mt-0">
                <AvatarGrid avatars={getMaleAvatars()} />
              </TabsContent>
              <TabsContent value="female" className="mt-0">
                <AvatarGrid avatars={getFemaleAvatars()} />
              </TabsContent>
            </div>
          </Tabs>
          
          {selectedAvatar && (
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedAvatar.url} alt={selectedAvatar.name} />
                    <AvatarFallback>{selectedAvatar.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{selectedAvatar.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedAvatar.gender} • {selectedAvatar.style}
                    </p>
                  </div>
                  <Button onClick={handleConfirmSelection} size="sm">
                    <Check className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between items-center pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              {avatarOptions.length} avatars available
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsOpen(false);
                setSelectedAvatar(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { doshaDescriptions } from '@/lib/dosha-quiz';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/user-store';

interface DoshaDisplayProps {
  user: User;
  className?: string;
}

export default function DoshaDisplay({ user, className }: DoshaDisplayProps) {
  if (!user.dosha) {
    return null;
  }

  const doshaInfo = doshaDescriptions[user.dosha];

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">🕉️ Your Dosha</CardTitle>
          {user.doshaIsBalanced && (
            <Badge variant="secondary" className="text-xs">
              ✨ Balanced
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dosha Name and Color */}
        <div className={cn("rounded-lg p-4 text-white", doshaInfo.color)}>
          <h3 className="font-bold text-lg">{doshaInfo.name}</h3>
          <p className="text-sm opacity-90">{doshaInfo.characteristics}</p>
        </div>

        {/* Traits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-muted rounded-lg p-3">
            <h4 className="font-semibold mb-1">Physical</h4>
            <p className="text-muted-foreground text-xs">{doshaInfo.physical}</p>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <h4 className="font-semibold mb-1">Mental</h4>
            <p className="text-muted-foreground text-xs">{doshaInfo.mental}</p>
          </div>
        </div>

        {/* Wellness Tips */}
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
          <h4 className="font-semibold text-sm mb-1 text-primary">Wellness Tips</h4>
          <p className="text-xs text-muted-foreground">{doshaInfo.tips}</p>
        </div>
      </CardContent>
    </Card>
  );
}
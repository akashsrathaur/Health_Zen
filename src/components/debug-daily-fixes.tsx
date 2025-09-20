'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { fixCurrentUserIssues, quickResetUser } from '@/actions/manual-fixes';
import { useToast } from '@/hooks/use-toast';

export function DebugDailyFixes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFixing, setIsFixing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleFixIssues = async () => {
    if (!user) return;
    
    setIsFixing(true);
    try {
      const result = await fixCurrentUserIssues(user.uid);
      
      if (result.success) {
        toast({
          title: "Issues Fixed Successfully!",
          description: `Applied fixes: ${result.fixesApplied.join(', ')}`,
        });
      } else {
        toast({
          title: "Fix Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fix Failed",
        description: "An error occurred while applying fixes",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
      // Refresh the page to see changes
      window.location.reload();
    }
  };

  const handleQuickReset = async () => {
    if (!user) return;
    
    setIsResetting(true);
    try {
      const result = await quickResetUser(user.uid);
      
      if (result.success) {
        toast({
          title: "User Reset Successfully!",
          description: result.message,
        });
      } else {
        toast({
          title: "Reset Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "An error occurred during reset",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
      // Refresh the page to see changes
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
      <CardHeader>
        <CardTitle className="text-yellow-800 dark:text-yellow-200">
          🔧 Daily Reset & Streak Debug Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-yellow-700 dark:text-yellow-300">
          <p><strong>Current User:</strong> {user.uid}</p>
          <p><strong>Current Streak:</strong> {user.streak || 0}</p>
          <p><strong>Daily Points:</strong> {user.dailyPoints || 0}</p>
          <p><strong>Last Activity:</strong> {user.lastActivityDate || 'Never'}</p>
          <p><strong>Last App Open:</strong> {user.lastAppOpenDate || 'Never'}</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleFixIssues}
            disabled={isFixing}
            variant="outline"
            className="border-yellow-400 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-600 dark:text-yellow-200 dark:hover:bg-yellow-900"
          >
            {isFixing ? 'Applying Fixes...' : '🔧 Fix Current Issues'}
          </Button>
          
          <Button 
            onClick={handleQuickReset}
            disabled={isResetting}
            variant="outline"
            className="border-orange-400 text-orange-800 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-200 dark:hover:bg-orange-900"
          >
            {isResetting ? 'Resetting...' : '🚀 Quick Reset (Start Fresh)'}
          </Button>
        </div>
        
        <div className="text-xs text-yellow-600 dark:text-yellow-400">
          <p><strong>Fix Issues:</strong> Triggers daily reset, fixes streak calculation, resets points and activities</p>
          <p><strong>Quick Reset:</strong> Resets everything to day 1 state with streak 1</p>
        </div>
      </CardContent>
    </Card>
  );
}
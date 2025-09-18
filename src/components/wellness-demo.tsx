'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Heart, Leaf, Sun, Moon } from 'lucide-react';

export function WellnessDemo() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 animate-gentle-bounce">
          <Leaf className="h-8 w-8 text-primary" />
          <h1 className="text-responsive-xl font-bold text-foreground">
            Health<span className="text-primary">Zen</span>
          </h1>
        </div>
        <p className="text-responsive-base text-muted-foreground max-w-2xl mx-auto">
          Let the threads of life get connected with yoga. Find inner peace and wellness through our calm, soothing interface.
        </p>
      </div>

      {/* Theme Switcher Demo */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Theme Settings
          </CardTitle>
          <CardDescription>
            Switch between light and dark themes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Current theme</span>
            <ThemeSwitcher />
          </div>
        </CardContent>
      </Card>

      {/* Wellness Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Meditation Card */}
        <Card className="group hover:scale-[1.02] transition-all duration-300 animate-scale-in">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:animate-breathe">
                <Heart className="h-6 w-6" />
              </div>
              <CardTitle className="text-responsive-lg">Meditation</CardTitle>
            </div>
            <CardDescription>
              Find your inner peace with guided meditation sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full w-3/4 bg-primary rounded-full animate-gentle-bounce"></div>
            </div>
            <p className="text-sm text-muted-foreground">75% of daily goal completed</p>
          </CardContent>
        </Card>

        {/* Yoga Classes Card */}
        <Card className="group hover:scale-[1.02] transition-all duration-300 animate-scale-in [animation-delay:0.1s]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-secondary/20 text-secondary group-hover:animate-breathe">
                <Leaf className="h-6 w-6" />
              </div>
              <CardTitle className="text-responsive-lg">Yoga Classes</CardTitle>
            </div>
            <CardDescription>
              Join our calming yoga sessions for mind-body wellness
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="wellness" size="sm" className="flex-1">
                Start Session
              </Button>
              <Button variant="earth" size="sm" className="flex-1">
                Browse All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wellness Input Card */}
        <Card className="group hover:scale-[1.02] transition-all duration-300 animate-scale-in [animation-delay:0.2s]">
          <CardHeader>
            <CardTitle className="text-responsive-lg">Daily Reflection</CardTitle>
            <CardDescription>
              Share how you're feeling today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="How are you feeling today?" 
              className="placeholder:text-muted-foreground/60"
            />
            <Button className="w-full" variant="default">
              Save Reflection
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Color Palette Demo */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Wellness Color Palette</CardTitle>
          <CardDescription>
            Our carefully chosen colors create a calming, therapeutic environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl" style={{ backgroundColor: '#CC6A4C' }}></div>
              <div className="text-xs">
                <div className="font-medium">Coral</div>
                <div className="text-muted-foreground">#CC6A4C</div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl" style={{ backgroundColor: '#93784E' }}></div>
              <div className="text-xs">
                <div className="font-medium">Earth</div>
                <div className="text-muted-foreground">#93784E</div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl border" style={{ backgroundColor: '#F7E4D2' }}></div>
              <div className="text-xs">
                <div className="font-medium">Cream</div>
                <div className="text-muted-foreground">#F7E4D2</div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl" style={{ backgroundColor: '#161614' }}></div>
              <div className="text-xs">
                <div className="font-medium">Dark</div>
                <div className="text-muted-foreground">#161614</div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl border" style={{ backgroundColor: '#FFFBF4' }}></div>
              <div className="text-xs">
                <div className="font-medium">Light</div>
                <div className="text-muted-foreground">#FFFBF4</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center animate-fade-in-up">
        <p className="text-muted-foreground text-sm">
          Designed for wellness • Built for serenity • Crafted with care
        </p>
      </div>
    </div>
  );
}
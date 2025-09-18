import {
  Flame,
  Droplets,
  Bed,
  HeartPulse,
  Bot,
  Leaf,
  Users,
  BarChart,
  ShieldCheck,
  Brain,
  Smile,
  Zap,
  Dumbbell,
  BookOpen,
  Target,
  Pill,
  Activity,
  Footprints,
  Salad,
  GlassWater,
  Sunrise,
  Sprout,
  HeartHandshake,
  BrainCircuit,
  Bookmark,
  UserPlus,
  ThumbsUp,
  Award,
  Trophy,
  Medal,
  Star,
  Map,
  ShieldPlus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Flame,
  Droplets,
  Bed,
  HeartPulse,
  Bot,
  Leaf,
  Users,
  BarChart,
  ShieldCheck,
  Brain,
  Smile,
  Zap,
  Dumbbell,
  BookOpen,
  Target,
  Pill,
  Activity,
  Footprints,
  Salad,
  GlassWater,
  Sunrise,
  Sprout,
  HeartHandshake,
  BrainCircuit,
  Bookmark,
  UserPlus,
  ThumbsUp,
  Award,
  Trophy,
  Medal,
  Star,
  Map,
  ShieldPlus,
};

export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Target; // Default to Target icon if not found
}

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const IconComponent = getIconComponent(name);
  return <IconComponent className={className} />;
}
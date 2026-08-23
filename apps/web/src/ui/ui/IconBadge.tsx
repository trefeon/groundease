import { cn } from '@/logic/formatters';
import type { ComponentType } from 'react';

type IconBadgeColor = 'primary' | 'earth' | 'calm' | 'neutral';
type IconBadgeSize = 'sm' | 'md' | 'lg';

interface IconBadgeProps {
  icon: ComponentType<Record<string, unknown>>;
  color?: IconBadgeColor;
  size?: IconBadgeSize;
}

const colorClasses: Record<IconBadgeColor, string> = {
  primary: 'bg-primary-surface text-primary',
  earth: 'bg-earth-surface text-earth',
  calm: 'bg-calm-surface text-calm',
  neutral: 'bg-surface-dim text-muted-foreground',
};

const sizeClasses: Record<IconBadgeSize, string> = {
  sm: 'h-8 w-8 rounded-xl',
  md: 'h-11 w-11 rounded-2xl',
  lg: 'h-14 w-14 rounded-2xl',
};

const iconSizes: Record<IconBadgeSize, number> = {
  sm: 16,
  md: 22,
  lg: 28,
};

export default function IconBadge({ icon: Icon, color = 'primary', size = 'md' }: IconBadgeProps) {
  return (
    <div className={cn('flex items-center justify-center', colorClasses[color], sizeClasses[size])}>
      <Icon size={iconSizes[size]} />
    </div>
  );
}


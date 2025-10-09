import React from 'react';
import { cn } from '@/lib/utils';

export interface AmountProps {
  value?: number | null;
  currency?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showFallback?: boolean;
  fallbackText?: string;
}

export const Amount: React.FC<AmountProps> = ({ 
  value, 
  currency = '원',
  className,
  size = 'default',
  showFallback = true,
  fallbackText = '—'
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg font-semibold'
  };

  if (value === null || value === undefined) {
    return showFallback ? (
      <span className={cn('text-muted-foreground', sizeClasses[size], className)}>
        {fallbackText}
      </span>
    ) : null;
  }

  return (
    <span className={cn('font-medium text-foreground', sizeClasses[size], className)}>
      {value.toLocaleString()}{currency}
    </span>
  );
};
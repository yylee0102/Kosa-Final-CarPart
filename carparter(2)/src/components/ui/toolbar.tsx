import React from 'react';
import { cn } from '@/lib/utils';

export interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  children, 
  className,
  sticky = false 
}) => {
  return (
    <div 
      className={cn(
        'flex items-center justify-between gap-4 p-4 bg-surface border-b border-border',
        sticky && 'sticky top-0 z-10 backdrop-blur-sm bg-surface/95',
        className
      )}
    >
      {children}
    </div>
  );
};
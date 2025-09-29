import React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface DateTimeProps {
  date: string | Date;
  format?: 'date' | 'datetime' | 'relative' | 'short';
  className?: string;
  prefix?: string;
}

export const DateTime: React.FC<DateTimeProps> = ({ 
  date, 
  format: formatType = 'date',
  className,
  prefix 
}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!dateObj || isNaN(dateObj.getTime())) {
    return <span className={cn('text-muted-foreground', className)}>—</span>;
  }

  const getFormattedDate = () => {
    switch (formatType) {
      case 'datetime':
        return format(dateObj, 'yyyy.MM.dd HH:mm', { locale: ko });
      case 'short':
        return format(dateObj, 'MM.dd', { locale: ko });
      case 'relative': {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
        if (diffInDays === 0) return '오늘';
        if (diffInDays === 1) return '어제';
        if (diffInDays < 7) return `${diffInDays}일 전`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
        return format(dateObj, 'yyyy.MM.dd', { locale: ko });
      }
      default:
        return format(dateObj, 'yyyy.MM.dd', { locale: ko });
      
    }
  };

  return (
    <span className={cn('text-muted-foreground', className)}>
      {prefix && `${prefix} `}{getFormattedDate()}
    </span>
  );
};
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'default' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          variant: 'secondary',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: '대기중'
        };
      case 'IN_PROGRESS':
        return {
          variant: 'secondary',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          text: '진행중'
        };
      case 'COMPLETED':
        return {
          variant: 'secondary',
          className: 'bg-green-100 text-green-800 border-green-200',
          text: '완료'
        };
      case 'APPROVED':
        return {
          variant: 'secondary',
          className: 'bg-green-100 text-green-800 border-green-200',
          text: '승인'
        };
      case 'REJECTED':
        return {
          variant: 'secondary',
          className: 'bg-red-100 text-red-800 border-red-200',
          text: '거절'
        };
      case 'CANCELLED':
        return {
          variant: 'secondary',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          text: '취소'
        };
      default:
        return {
          variant: 'secondary',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          text: status
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <Badge
      variant={config.variant as any}
      className={cn(
        config.className,
        sizeClasses[size],
        'font-medium',
        className
      )}
    >
      {config.text}
    </Badge>
  );
};
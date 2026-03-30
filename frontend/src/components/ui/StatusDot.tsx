import { cn } from '@/lib/utils';

interface StatusDotProps {
  status: 'online' | 'offline' | 'busy' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
};

const colorMap = {
  online: 'bg-success',
  offline: 'bg-accent-dim',
  busy: 'bg-warning',
  warning: 'bg-warning',
  error: 'bg-error',
};

export default function StatusDot({ status, size = 'md', pulse = false, className }: StatusDotProps) {
  return (
    <span className={cn('relative flex', className)}>
      {pulse && status === 'online' && (
        <span className={cn(
          'absolute inline-flex rounded-full opacity-75 animate-ping',
          colorMap[status],
          sizeMap[size],
        )} />
      )}
      <span className={cn(
        'relative inline-flex rounded-full',
        colorMap[status],
        sizeMap[size],
      )} />
    </span>
  );
}

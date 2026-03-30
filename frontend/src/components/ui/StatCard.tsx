import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-accent',
  className,
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('card-hover', className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-accent-dim">{title}</p>
          <p className="stat-value mt-1">{value}</p>
          {change !== undefined && (
            <p className={cn(
              'text-xs mt-2',
              isPositive ? 'text-success' : isNegative ? 'text-error' : 'text-accent-dim',
            )}>
              {isPositive ? '+' : ''}{change}%{' '}
              <span className="text-accent-dim">{changeLabel || 'vs last period'}</span>
            </p>
          )}
        </div>
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          'bg-surface-light',
        )}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
    </motion.div>
  );
}

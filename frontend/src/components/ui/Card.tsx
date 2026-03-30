import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hover = false, onClick }: CardProps) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { scale: 1.01, y: -2 },
    transition: { duration: 0.2 },
  } : {};

  return (
    <Component
      className={cn(
        'bg-surface rounded-xl border border-surface-lighter p-6',
        hover && 'cursor-pointer transition-shadow hover:shadow-lg hover:shadow-black/20 hover:border-accent-dim',
        className,
      )}
      onClick={onClick}
      {...hoverProps}
    >
      {children}
    </Component>
  );
}

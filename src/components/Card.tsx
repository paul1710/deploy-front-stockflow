import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
}

export default function Card({ children, className, hover = true, clickable = false }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-border bg-card shadow-md transition-smooth',
        hover && 'hover:shadow-lg',
        clickable && 'cursor-pointer hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
}

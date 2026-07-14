import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-smooth',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        destructive: 'bg-destructive/10 text-destructive',
        warning: 'bg-warning/10 text-warning',
        success: 'bg-secondary/10 text-secondary',
        outline: 'border border-current',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant, children, className }: BadgeProps) {
  return <span className={clsx(badgeVariants({ variant, className }))}>{children}</span>;
}

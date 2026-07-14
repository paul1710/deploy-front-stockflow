import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  success?: string;
  helperText?: string;
  children: ReactNode;
  className?: string;
}

export default function FormField({
  label,
  required,
  error,
  success,
  helperText,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {children}

      <div className="mt-1.5 flex flex-col gap-1">
        {error && <span className="text-xs text-destructive font-medium">{error}</span>}
        {success && !error && <span className="text-xs text-secondary font-medium">{success}</span>}
        {helperText && !error && !success && <span className="text-xs text-muted-foreground">{helperText}</span>}
      </div>
    </div>
  );
}

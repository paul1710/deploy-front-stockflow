import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, success, helperText, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const displayType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={displayType}
            className={clsx(
              'flex h-11 w-full rounded-lg border bg-background px-3 py-2.5 text-sm transition-smooth placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
              !error && !success && 'border-input hover:border-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20',
              error && 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20',
              success && 'border-secondary focus:border-secondary focus:ring-2 focus:ring-secondary/20',
              showPasswordToggle && isPassword && 'pr-10',
              className
            )}
            ref={ref}
            onChange={(e) => {
              props.onChange?.(e);
            }}
            {...props}
          />

          {/* Password toggle */}
          {showPasswordToggle && isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Success icon */}
          {success && !error && (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          )}

          {/* Error icon */}
          {error && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
          )}
        </div>

        {/* Helper text and error message */}
        <div className="mt-1.5 flex items-start gap-1">
          {error && (
            <span className="text-xs text-destructive flex items-center gap-1">
              {error}
            </span>
          )}
          {success && !error && (
            <span className="text-xs text-secondary">{success}</span>
          )}
          {helperText && !error && !success && (
            <span className="text-xs text-muted-foreground">{helperText}</span>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;
import { cn } from '@/logic/formatters';
import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
}

export default function Input({ label, helperText, error, icon, className, id: propId, ...props }: InputProps) {
  const generatedId = useId();
  const id = propId ?? generatedId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  const describedBy = error ? errorId : (helperText ? helperId : undefined);

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <label htmlFor={id} className="text-label-lg text-muted-foreground">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        )}
        <input
          id={id}
          className={cn(
            'h-12 w-full rounded-lg border bg-card px-3 py-2',
            icon && 'pl-9',
            'text-body-lg text-foreground',
            'placeholder:text-outline-variant',
            'border-border',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
            error && 'border-red-400 focus:ring-red-300',
          )}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...props}
        />
      </div>
      {helperText && !error && <p id={helperId} className="text-body-sm text-muted-foreground">{helperText}</p>}
      {error && <p id={errorId} className="text-body-sm text-red-500">{error}</p>}
    </div>
  );
}


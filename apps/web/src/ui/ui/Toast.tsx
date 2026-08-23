import { cn } from '@/logic/formatters';

type ToastType = 'default' | 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  action?: string;
  onAction?: () => void;
}

const typeClasses: Record<ToastType, string> = {
  default: 'bg-text text-primary-foreground',
  success: 'bg-primary text-primary-foreground',
  warning: 'bg-earth text-primary-foreground',
  error: 'bg-red-600 text-primary-foreground',
};

export default function Toast({ message, type = 'default', action, onAction }: ToastProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4',
        'min-w-[280px] max-w-sm rounded-2xl px-5 py-3 shadow-level-3',
        'animate-slide-up',
        typeClasses[type],
      )}
    >
      <p className="text-body-md">{message}</p>
      {action && (
        <button onClick={onAction} className="text-label-lg shrink-0 opacity-90 hover:opacity-100">
          {action}
        </button>
      )}
    </div>
  );
}


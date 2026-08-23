import { cn } from '@/logic/formatters';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'narrow';
  padding?: 'none' | 'compact' | 'default';
  centered?: boolean;
}

const maxWidthClasses: Record<string, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-[1180px]',
  full: 'max-w-none',
  narrow: 'max-w-3xl',
};

const paddingClasses: Record<string, string> = {
  none: 'px-0',
  compact: 'px-4',
  default: 'px-[var(--space-page-px)]',
};

export function Container({
  children,
  className,
  maxWidth = 'xl',
  padding = 'default',
  centered = false,
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        centered && 'flex flex-col items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  );
}

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'narrow';
  centered?: boolean;
}

/**
 * Standardized Page Wrapper
 * Applies global page padding (top, bottom, horizontal) and max-width.
 * Use this for all page-level components.
 */
export function PageWrapper({
  children,
  className,
  contentClassName,
  maxWidth = 'xl',
  centered = false,
}: PageWrapperProps) {
  return (
    <div className={cn('min-h-screen w-full bg-background', className)}>
      <Container
        maxWidth={maxWidth}
        className={cn('page-shell flex flex-col', centered && 'page-shell--centered', contentClassName)}
      >
        {children}
      </Container>
    </div>
  );
}

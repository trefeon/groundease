import { cn } from '@/logic/formatters';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && <span className="text-label-lg text-primary">{eyebrow}</span>}
      <h2 className="text-headline-md text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h2>
      {description && <p className="text-body-lg max-w-xl text-muted-foreground">{description}</p>}
    </div>
  );
}


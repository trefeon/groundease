import { cn } from '@/logic/formatters';
import type { ReactNode } from 'react';

type GridCols = 2 | 3 | 4 | 'auto';

interface GridProps {
  children: ReactNode;
  cols?: GridCols;
  className?: string;
}

const colMap: Record<GridCols, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
  auto: 'grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]',
};

export default function Grid({ children, cols = 'auto', className }: GridProps) {
  return <div className={cn('grid gap-4 sm:gap-6', colMap[cols], className)}>{children}</div>;
}


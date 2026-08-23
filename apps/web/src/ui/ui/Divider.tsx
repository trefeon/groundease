interface DividerProps {
  label?: string;
}

export default function Divider({ label }: DividerProps) {
  return (
    <div className="my-4 flex items-center gap-4">
      <div className="h-px flex-1 bg-outline-variant" />
      {label && <span className="text-label-md whitespace-nowrap text-muted-foreground">{label}</span>}
      <div className="h-px flex-1 bg-outline-variant" />
    </div>
  );
}


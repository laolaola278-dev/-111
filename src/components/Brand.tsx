import { cn } from "../lib/utils";

export function Brand({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-cinnabar text-paper shadow-sm">
        <span className="font-serif text-lg font-bold leading-none">剪</span>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-lg font-bold tracking-wide">
            非遗工坊
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-faint">
            Heritage Atelier
          </span>
        </span>
      )}
    </span>
  );
}

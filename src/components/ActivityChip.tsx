import { ACTIVITY } from "../lib/activity";
import { cn } from "../lib/utils";

export function ActivityChip({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border border-cinnabar/30 bg-cinnabar-soft/60 px-3 py-1 text-left text-xs font-medium leading-snug text-cinnabar-deep",
        onClick && "transition-colors hover:bg-cinnabar-soft",
        className,
      )}
    >
      {ACTIVITY.tagline}
    </Comp>
  );
}

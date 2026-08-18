import { cn } from "../lib/utils";

export function PatternView({
  svg,
  imageUrl,
  className,
}: {
  svg?: string | null;
  imageUrl?: string | null;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className={cn("h-full w-full object-contain", className)}
      />
    );
  }
  if (svg) {
    return (
      <div
        className={cn("svg-preview h-full w-full", className)}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  return null;
}

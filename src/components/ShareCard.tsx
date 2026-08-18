import { ACTIVITY } from "../lib/activity";
import { type Craft } from "../lib/crafts";
import { Brand } from "./Brand";
import { PatternView } from "./PatternView";

export function ShareCard({
  svg,
  imageUrl,
  prompt,
  craft,
}: {
  svg: string;
  imageUrl?: string | null;
  prompt: string;
  craft: Craft;
}) {
  return (
    <figure className="share-card mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-md">
      <div className="flex items-center justify-between px-4 pt-4">
        <Brand compact={false} />
        <span className="rounded-full bg-cinnabar px-2 py-0.5 text-[10px] font-medium text-paper">
          AI 再创作
        </span>
      </div>
      <div className="px-4 pt-3">
        <div className="overflow-hidden rounded-2xl bg-white p-3 shadow-sm">
          <PatternView svg={svg} imageUrl={imageUrl} />
        </div>
      </div>
      <figcaption className="space-y-2 px-5 pb-5 pt-4">
        <p className="font-serif text-lg font-bold leading-snug">「{prompt}」</p>
        <p className="text-xs text-ink-soft">
          {craft.hierarchyLabel} · {craft.visualHint}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-paper-deep px-2 py-0.5 text-[10px] text-ink-soft">
            传统文化灵感
          </span>
          <span className="rounded-full bg-paper-deep px-2 py-0.5 text-[10px] text-ink-soft">
            数字化演绎
          </span>
          <span className="rounded-full bg-paper-deep px-2 py-0.5 text-[10px] text-ink-soft">
            {ACTIVITY.hashtag}
          </span>
        </div>
        <p className="text-[10px] leading-relaxed text-ink-faint">
          {ACTIVITY.disclaimer}
        </p>
      </figcaption>
    </figure>
  );
}

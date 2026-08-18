import { ACTIVITY } from "../lib/activity";
import { Brand } from "./Brand";
import { useCulture } from "./CultureProvider";

export function SiteFooter() {
  const { openCulture, openAbout, openCampaign } = useCulture();

  return (
    <footer className="border-t border-ink/10 bg-paper-deep/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Brand />
          <nav className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => openCulture()}
              className="min-h-10 rounded-full border border-ink/10 bg-paper px-3 py-2 text-ink-soft hover:border-cinnabar/30 hover:text-cinnabar"
            >
              文化资料
            </button>
            <button
              type="button"
              onClick={openAbout}
              className="min-h-10 rounded-full border border-ink/10 bg-paper px-3 py-2 text-ink-soft hover:border-cinnabar/30 hover:text-cinnabar"
            >
              作品说明
            </button>
            <button
              type="button"
              onClick={openCampaign}
              className="min-h-10 rounded-full border border-ink/10 bg-paper px-3 py-2 text-ink-soft hover:border-cinnabar/30 hover:text-cinnabar"
            >
              参与活动
            </button>
          </nav>
        </div>
        <div className="space-y-1 text-xs leading-relaxed text-ink-faint">
          <p>
            {ACTIVITY.tagline} · {ACTIVITY.oneLiner}
          </p>
          <p>
            {ACTIVITY.disclaimer} {ACTIVITY.sourceNote}
          </p>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useRef } from "react";
import { BookOpen, ExternalLink, X } from "lucide-react";
import { ACTIVITY } from "../lib/activity";
import {
  CRAFTS,
  craftById,
  heritageKindClass,
  type Craft,
} from "../lib/crafts";
import { cn } from "../lib/utils";
import { useCulture, type CulturePanel } from "./CultureProvider";
import { Button } from "./ui/button";

const TABS: { id: CulturePanel; label: string }[] = [
  { id: "culture", label: "文化资料" },
  { id: "about", label: "作品说明" },
  { id: "campaign", label: "参与活动" },
];

function CraftArticle({ craft }: { craft: Craft }) {
  return (
    <article className="rounded-2xl border border-ink/10 bg-paper p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-serif text-xl font-bold">{craft.name}</h3>
          <p className="mt-1 text-xs text-ink-faint">{craft.hierarchyLabel}</p>
        </div>
        <span className="rounded-full bg-paper-deep px-2.5 py-1 text-xs text-ink-soft">
          {craft.short}
        </span>
      </div>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs font-semibold tracking-wide text-cinnabar">
            文化类别
          </dt>
          <dd className="mt-1 text-ink-soft">{craft.category}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-cinnabar">
            地域
          </dt>
          <dd className="mt-1 text-ink-soft">{craft.region}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-cinnabar">
            文化背景
          </dt>
          <dd className="mt-1 leading-relaxed text-ink-soft">
            {craft.historical_context}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {craft.statusTags.map((tag) => (
          <span
            key={tag.label}
            className={cn(
              "rounded-full border px-2 py-0.5 text-[11px] leading-5",
              heritageKindClass(tag.kind),
            )}
          >
            {tag.label}
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-faint">{craft.note}</p>

      <div className="mt-4">
        <p className="text-xs font-semibold tracking-wide text-cinnabar">
          参考资料
        </p>
        <ul className="mt-2 space-y-2">
          {craft.source.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2 rounded-xl border border-ink/10 bg-paper-deep/50 px-3 py-2 text-xs leading-relaxed text-ink-soft transition-colors hover:border-cinnabar/30 hover:text-cinnabar"
              >
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  <span className="block font-medium text-ink group-hover:text-cinnabar">
                    {item.title}
                  </span>
                  <span className="text-ink-faint">{item.publisher}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function CultureDrawer() {
  const { open, panel, craftId, close, openCulture, openAbout, openCampaign } =
    useCulture();
  const closeRef = useRef<HTMLButtonElement>(null);
  const selected = craftById(craftId ?? undefined);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="关闭资料面板"
        className="absolute inset-0 bg-ink/40"
        onClick={close}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="culture-drawer-title"
        className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-3xl border border-ink/10 bg-paper shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:w-[min(100%,32rem)] sm:max-h-none sm:rounded-none sm:rounded-l-3xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-ink/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cinnabar">
              文化依据
            </p>
            <h2
              id="culture-drawer-title"
              className="mt-1 font-serif text-2xl font-bold"
            >
              {panel === "culture"
                ? "文化资料"
                : panel === "about"
                  ? "作品说明"
                  : "参与活动"}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="grid h-11 w-11 place-items-center rounded-xl border border-ink/10 text-ink-soft hover:bg-paper-deep"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto px-5 py-3">
          {TABS.map((tab) => {
            const active = panel === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === "culture") openCulture(craftId ?? undefined);
                  if (tab.id === "about") openAbout();
                  if (tab.id === "campaign") openCampaign();
                }}
                className={cn(
                  "shrink-0 rounded-full px-3 py-2 text-sm",
                  active
                    ? "bg-cinnabar text-paper"
                    : "bg-paper-deep text-ink-soft",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {panel === "culture" ? (
            <div className="space-y-4 pb-6">
              <p className="text-sm leading-relaxed text-ink-soft">
                下列信息只说明本站参考的传统视觉语言。名录认定属于对应传统实践，不适用于本站生成的
                AI 纹样。
              </p>
              <div className="flex flex-wrap gap-2">
                {CRAFTS.map((craft) => (
                  <button
                    key={craft.id}
                    type="button"
                    onClick={() => openCulture(craft.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs",
                      selected.id === craft.id
                        ? "bg-ink text-paper"
                        : "bg-paper-deep text-ink-soft",
                    )}
                  >
                    {craft.name}
                  </button>
                ))}
              </div>
              <CraftArticle craft={selected} />
            </div>
          ) : null}

          {panel === "about" ? (
            <div className="space-y-4 pb-6 text-sm leading-relaxed text-ink-soft">
              <p>
                非遗工坊是一个{ACTIVITY.tagline}
                。选择一种传统视觉语言，输入一句灵感，由 AI
                生成可下载的矢量纹样。
              </p>
              <p>{ACTIVITY.disclaimer}</p>
              <p>{ACTIVITY.sourceNote}</p>
              <p>
                窗花从属于剪纸的应用形式；青花是瓷器装饰语言；云锦是织造技艺。本站只借用其视觉特征，不把不同工艺混为一谈。
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => openCulture("jianzhi")}
              >
                <BookOpen className="h-4 w-4" />
                查看文化资料
              </Button>
            </div>
          ) : null}

          {panel === "campaign" ? (
            <div className="space-y-4 pb-6 text-sm leading-relaxed text-ink-soft">
              <p className="font-medium text-ink">
                {ACTIVITY.hashtag} · {ACTIVITY.host}「{ACTIVITY.name}」活动
              </p>
              <p>
                本站是面向该活动方向的公开体验作品，不会自动报名，也无法验证是否已成功参赛。
              </p>
              <div className="rounded-2xl border border-ink/10 bg-paper-deep/70 p-4">
                <p className="text-xs font-semibold tracking-wide text-cinnabar">
                  发布笔记时请自行完成
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>添加话题 {ACTIVITY.hashtag}</li>
                  <li>正文 @科技薯</li>
                  <li>挂载小红书 Vibe Coding 小工具</li>
                </ul>
              </div>
              <p className="text-xs text-ink-faint">
                以上是发布提示，不代表本站或任何官方机构已确认参赛。话题请写「国风vibecoding」，不要写成其他错字。
              </p>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

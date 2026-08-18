import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAction, useMutation, useQuery } from "convex/react";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  Download,
  Info,
  Loader2,
  LogOut,
  Sparkles,
  Trash2,
} from "lucide-react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { ACTIVITY } from "../lib/activity";
import {
  buildAgnesPrompt,
  generateViaLocalApi,
  requestAgnesImage,
  type AgnesResult,
} from "../lib/agnes";
import { CRAFTS, craftById } from "../lib/crafts";
import {
  loadGuestWorks,
  removeGuestWork,
  saveGuestWork,
  type GuestWork,
} from "../lib/guestWorks";
import { Brand } from "../components/Brand";
import { CutFlower } from "../components/CutFlower";
import { PatternView } from "../components/PatternView";
import { ShareCard } from "../components/ShareCard";
import { SiteFooter } from "../components/SiteFooter";
import { useCulture } from "../components/CultureProvider";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { cn } from "../lib/utils";

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadSvg(svg: string, filename: string) {
  downloadFile(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
    `${filename}.svg`,
  );
}

async function downloadImage(imageUrl: string, filename: string) {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const ext = blob.type.includes("jpeg") ? "jpg" : "png";
    downloadFile(blob, `${filename}.${ext}`);
  } catch {
    window.open(imageUrl, "_blank", "noopener,noreferrer");
  }
}

type GalleryItem = {
  _id: string;
  craft: string;
  prompt: string;
  svg: string;
  imageUrl?: string;
};

export function WorkshopPage() {
  const { signOut } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const { openCulture, openCampaign } = useCulture();
  const generate = useAction(api.generateSvg.generate);
  const createGeneration = useMutation(api.generations.create);
  const removeGeneration = useMutation(api.generations.remove);
  const savedGenerations = useQuery(api.generations.list);

  const [craft, setCraft] = useState("jianzhi");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [guestWorks, setGuestWorks] = useState<GuestWork[]>([]);

  const activeCraft = craftById(craft);

  useEffect(() => {
    setGuestWorks(loadGuestWorks());
  }, []);

  const history: GalleryItem[] = isAuthenticated
    ? (savedGenerations ?? []).map((item) => ({
        _id: item._id,
        craft: item.craft,
        prompt: item.prompt,
        svg: item.svg,
        imageUrl: undefined,
      }))
    : guestWorks.map((item) => ({
        _id: item.id,
        craft: item.craft,
        prompt: item.prompt,
        svg: item.svg,
        imageUrl: item.imageUrl,
      }));

  async function createArtwork(craftId: string, trimmed: string) {
    try {
      return await generateViaLocalApi(craftId, trimmed);
    } catch {
      // Preview sandbox may not be able to call Agnes from the server.
    }

    const browserKey = import.meta.env.VITE_AGNES_API_KEY;
    if (browserKey) {
      return await requestAgnesImage(
        browserKey,
        buildAgnesPrompt(craftId, trimmed),
      );
    }

    const convexResult = (await generate({
      craft: craftId,
      prompt: trimmed,
    })) as AgnesResult;
    return convexResult;
  }

  async function handleGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed || generating) return;
    setGenerating(true);
    setError(null);
    try {
      const artwork = await createArtwork(craft, trimmed);
      setResult(artwork.svg);
      setImageUrl(artwork.imageUrl ?? null);
      if (isAuthenticated) {
        await createGeneration({ craft, prompt: trimmed, svg: artwork.svg });
      } else {
        const saved = saveGuestWork({
          craft,
          prompt: trimmed,
          svg: artwork.svg,
          imageUrl: artwork.imageUrl,
        });
        setGuestWorks((prev) => [saved, ...prev].slice(0, 12));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "生成失败，请重试";
      if (/Failed to fetch|NetworkError|CORS|Load failed/i.test(message)) {
        setError(
          "当前预览环境无法连上 Agnes。请确认密钥有效，或在可访问外网的环境打开。",
        );
      } else {
        setError(message);
      }
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy(svg: string) {
    try {
      await navigator.clipboard.writeText(svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  async function handleRemove(id: string) {
    if (isAuthenticated) {
      await removeGeneration({ id: id as Id<"generations"> });
      return;
    }
    removeGuestWork(id);
    setGuestWorks((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="paper-fiber min-h-screen">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-5">
          <Link to="/" aria-label="返回首页">
            <Brand />
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => openCulture(craft)}
              className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-paper-deep"
              aria-label="文化资料"
            >
              <BookOpen className="h-4 w-4" />
            </button>
            <Link
              to="/"
              className="hidden items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-cinnabar sm:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" />
              首页
            </Link>
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={() => void signOut()}>
                <LogOut className="h-4 w-4" />
                退出
              </Button>
            ) : (
              <Link
                to={`/auth?returnTo=${encodeURIComponent("/workshop")}`}
                className="inline-flex min-h-10 items-center rounded-xl border border-ink/20 px-3 text-sm text-ink hover:bg-paper-deep"
              >
                登录保存
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
        {!isAuthenticated ? (
          <div className="mb-6 rounded-2xl border border-cinnabar/20 bg-cinnabar-soft/50 px-4 py-3 text-sm text-cinnabar-deep">
            游客体验中：可直接生成、下载与截图。登录后才能把作品同步到云端纹样库。
          </div>
        ) : null}

        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cinnabar">
            纹样工坊
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
            选一种风格，生成你的国风作品
          </h1>
          <p className="mt-3 text-ink-soft">
            输入一句灵感，Agnes Image 会参考对应传统视觉语言生成一张国风纹样图。
          </p>
          <button
            type="button"
            onClick={openCampaign}
            className="mt-3 text-xs text-ink-faint underline-offset-2 hover:text-cinnabar hover:underline"
          >
            {ACTIVITY.tagline}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CRAFTS.map((item) => {
            const active = item.id === craft;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCraft(item.id);
                  setResult(null);
                  setImageUrl(null);
                  setError(null);
                }}
                className={cn(
                  "min-h-[4.5rem] rounded-2xl border p-3 text-left transition-all sm:p-4",
                  active
                    ? "border-cinnabar bg-cinnabar text-paper shadow-md"
                    : "border-ink/10 bg-paper hover:-translate-y-0.5 hover:border-cinnabar/40",
                )}
              >
                <div className="font-serif text-lg font-bold sm:text-xl">
                  {item.name}
                </div>
                <div
                  className={cn(
                    "mt-1 text-xs",
                    active ? "text-paper/80" : "text-ink-faint",
                  )}
                >
                  {item.short}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-faint">
          <span>{activeCraft.hierarchyLabel}</span>
          <button
            type="button"
            onClick={() => openCulture(craft)}
            className="inline-flex min-h-9 items-center gap-1 text-cinnabar"
          >
            <Info className="h-3.5 w-3.5" />
            文化出处
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-ink/10 bg-paper p-5 shadow-sm sm:p-6">
            <label
              htmlFor="prompt"
              className="text-sm font-medium leading-none text-ink"
            >
              你的灵感
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`例如：「${activeCraft.example}」`}
              className="mt-3 min-h-28 flex-1 text-base"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {[activeCraft.example, "生肖蛇", "锦鲤戏莲"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setPrompt(suggestion)}
                  className="min-h-9 rounded-full border border-ink/15 px-3 py-1 text-xs text-ink-soft transition-colors hover:border-cinnabar/40 hover:text-cinnabar"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <Button
              className="mt-5 min-h-12 w-full"
              size="lg"
              onClick={() => void handleGenerate()}
              disabled={!prompt.trim() || generating}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generating ? "正在生成纹样…" : "生成你的国风作品"}
            </Button>

            {error ? (
              <p className="mt-4 rounded-xl bg-cinnabar-soft px-3 py-2 text-sm text-cinnabar-deep">
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex min-h-[380px] flex-col rounded-2xl border border-ink/10 bg-paper shadow-sm">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
              <span className="text-sm font-medium text-ink-soft">纹样预览</span>
              {result ? (
                <span className="rounded-full bg-paper-deep px-2 py-0.5 text-[11px] text-ink-faint">
                  AI 再创作 · {activeCraft.name}
                </span>
              ) : null}
            </div>

            <div className="svg-preview relative grid flex-1 place-items-center overflow-hidden bg-paper-deep/50 p-5">
              {generating ? (
                <div className="flex flex-col items-center gap-3 text-ink-soft">
                  <CutFlower className="h-20 w-20 animate-spin [animation-duration:4s]" />
                  <p className="text-sm">正在生成纹样，稍候片刻…</p>
                </div>
              ) : result || imageUrl ? (
                <div className="max-h-full w-full max-w-md rounded-xl bg-white p-3 shadow-md">
                  <PatternView svg={result} imageUrl={imageUrl} />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center text-ink-faint">
                  <CutFlower className="h-24 w-24 opacity-40" />
                  <p className="max-w-xs text-sm">
                    你的纹样将在这里出现。打开即可体验，不必先注册。
                  </p>
                </div>
              )}
            </div>

            {result || imageUrl ? (
              <div className="flex flex-col gap-2 border-t border-ink/10 p-4 sm:flex-row">
                <Button
                  className="min-h-11 flex-1"
                  onClick={() => {
                    const name = `${activeCraft.name}-${prompt.slice(0, 12) || "纹样"}-${Date.now()}`;
                    if (imageUrl) {
                      void downloadImage(imageUrl, name);
                      return;
                    }
                    if (result) downloadSvg(result, name);
                  }}
                >
                  <Download className="h-4 w-4" />
                  {imageUrl ? "下载图片" : "下载 SVG"}
                </Button>
                <Button
                  variant="outline"
                  className="min-h-11"
                  onClick={() => void handleCopy(imageUrl || result || "")}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-jade" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "已复制" : "复制"}
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {result ? (
          <section className="mt-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-serif text-2xl font-bold">作品卡片</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  可直接截图发小红书。卡片已带 AI 再创作与活动标签。
                </p>
              </div>
              <span className="rounded-full bg-cinnabar-soft px-2.5 py-1 text-[11px] text-cinnabar-deep">
                AI 辅助生成 · 国风元素参考
              </span>
            </div>
            <ShareCard
              svg={result || ""}
              imageUrl={imageUrl}
              prompt={prompt || "未命名纹样"}
              craft={activeCraft}
            />
          </section>
        ) : null}

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold">
              {isAuthenticated ? "我的纹样库" : "本次体验"}
            </h2>
            <span className="text-sm text-ink-faint">{history.length} 件作品</span>
          </div>

          {history.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-ink/15 bg-paper/60 p-8 text-center text-sm text-ink-faint">
              还没有作品，生成第一张纹样吧。
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((item) => {
                const itemCraft = craftById(item.craft);
                return (
                  <div
                    key={item._id}
                    className="group overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-sm"
                  >
                    <button
                      type="button"
                      className="svg-preview block h-44 w-full overflow-hidden bg-paper-deep/50 p-4"
                      onClick={() => {
                        setCraft(item.craft);
                        setPrompt(item.prompt);
                        setResult(item.svg);
                        setError(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <div
                        className="mx-auto h-full max-w-[180px] rounded-lg bg-white p-1.5 shadow-sm"
                        dangerouslySetInnerHTML={{ __html: item.svg }}
                      />
                    </button>
                    <div className="flex items-center justify-between gap-2 p-3">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-cinnabar">
                          {itemCraft.name} · AI 再创作
                        </span>
                        <p className="truncate text-sm text-ink-soft">
                          {item.prompt}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="下载"
                          onClick={() => {
                            const name = `${itemCraft.name}-${item.prompt.slice(0, 12)}-${item._id.slice(-6)}`;
                            if (item.imageUrl) {
                              void downloadImage(item.imageUrl, name);
                              return;
                            }
                            downloadSvg(item.svg, name);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="删除"
                          className="hover:text-cinnabar"
                          onClick={() => void handleRemove(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

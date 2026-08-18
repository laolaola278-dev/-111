import { useState } from "react";
import { Link } from "react-router-dom";
import { useAction, useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Loader2,
  LogOut,
  Sparkles,
  Trash2,
} from "lucide-react";
import { api } from "../convex/_generated/api";
import { CRAFTS, craftById } from "../lib/crafts";
import { Brand } from "../components/Brand";
import { CutFlower } from "../components/CutFlower";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { cn } from "../lib/utils";

function downloadSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function WorkshopPage() {
  const { signOut } = useAuthActions();
  const generate = useAction(api.generateSvg.generate);
  const createGeneration = useMutation(api.generations.create);
  const removeGeneration = useMutation(api.generations.remove);
  const generations = useQuery(api.generations.list);

  const [craft, setCraft] = useState("jianzhi");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeCraft = craftById(craft);
  const history = generations ?? [];

  async function handleGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed || generating) return;
    setGenerating(true);
    setError(null);
    try {
      const { svg } = await generate({ craft, prompt: trimmed });
      setResult(svg);
      await createGeneration({ craft, prompt: trimmed, svg });
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
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

  return (
    <div className="paper-fiber min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" aria-label="返回首页">
            <Brand />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-cinnabar sm:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" />
              首页
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void signOut()}
            >
              <LogOut className="h-4 w-4" />
              退出
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cinnabar">
            纹样工坊
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
            选一门技艺，剪一个故事
          </h1>
          <p className="mt-3 text-ink-soft">
            输入一句灵感，AI 会以传统非遗风格生成一张可下载、可剪裁的矢量纹样。
          </p>
        </div>

        {/* Craft selector */}
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
                  setError(null);
                }}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all",
                  active
                    ? "border-cinnabar bg-cinnabar text-paper shadow-md"
                    : "border-ink/10 bg-paper hover:-translate-y-0.5 hover:border-cinnabar/40",
                )}
              >
                <div className="font-serif text-xl font-bold">{item.name}</div>
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

        {/* Prompt + result */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Left: input */}
          <div className="flex flex-col rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm">
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
              className="mt-3 flex-1 text-base"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {[activeCraft.example, "生肖蛇", "锦鲤戏莲"].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setPrompt(suggestion)}
                  className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink-soft transition-colors hover:border-cinnabar/40 hover:text-cinnabar"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <Button
              className="mt-5 w-full"
              size="lg"
              onClick={() => void handleGenerate()}
              disabled={!prompt.trim() || generating}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generating ? "正在剪刻纹样…" : "生成纹样"}
            </Button>

            {error ? (
              <p className="mt-4 rounded-xl bg-cinnabar-soft px-3 py-2 text-sm text-cinnabar-deep">
                {error}
              </p>
            ) : null}
          </div>

          {/* Right: preview */}
          <div className="flex min-h-[380px] flex-col rounded-2xl border border-ink/10 bg-paper shadow-sm">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
              <span className="text-sm font-medium text-ink-soft">
                纹样预览
              </span>
              {result ? (
                <span className="text-xs text-ink-faint">
                  {activeCraft.name} · SVG 矢量
                </span>
              ) : null}
            </div>

            <div className="svg-preview relative grid flex-1 place-items-center overflow-hidden bg-paper-deep/50 p-5">
              {generating ? (
                <div className="flex flex-col items-center gap-3 text-ink-soft">
                  <CutFlower className="h-20 w-20 animate-spin [animation-duration:4s]" />
                  <p className="text-sm">正在雕琢纹样，稍候片刻…</p>
                </div>
              ) : result ? (
                <div
                  className="max-h-full w-full max-w-md rounded-xl bg-white p-3 shadow-md"
                  dangerouslySetInnerHTML={{ __html: result }}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-center text-ink-faint">
                  <CutFlower className="h-24 w-24 opacity-40" />
                  <p className="max-w-xs text-sm">
                    你的纹样将在这里出现，输入灵感并点击「生成纹样」。
                  </p>
                </div>
              )}
            </div>

            {result ? (
              <div className="flex gap-2 border-t border-ink/10 p-4">
                <Button
                  className="flex-1"
                  onClick={() =>
                    downloadSvg(
                      result,
                      `${activeCraft.name}-${prompt.slice(0, 12) || "纹样"}-${Date.now()}`,
                    )
                  }
                >
                  <Download className="h-4 w-4" />
                  下载 SVG
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void handleCopy(result)}
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

        {/* Gallery */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold">我的纹样库</h2>
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
                          {itemCraft.name}
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
                          onClick={() =>
                            downloadSvg(
                              item.svg,
                              `${itemCraft.name}-${item.prompt.slice(0, 12)}-${item._id.slice(-6)}`,
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="删除"
                          className="hover:text-cinnabar"
                          onClick={() => void removeGeneration({ id: item._id })}
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
    </div>
  );
}

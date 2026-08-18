import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useConvexAuth } from "@convex-dev/auth/react";
import {
  ArrowRight,
  Download,
  Feather,
  Layers,
  PenTool,
  Scissors,
  Sparkles,
} from "lucide-react";
import { CRAFTS } from "../lib/crafts";
import { Brand } from "./Brand";
import { Button } from "./ui/button";
import { CutFlower } from "./CutFlower";

const STEPS = [
  {
    icon: Feather,
    title: "选一门技艺",
    text: "从剪纸、窗花、皮影、年画、青花、云锦中，挑一种你想致敬的非遗。",
  },
  {
    icon: Sparkles,
    title: "说一句灵感",
    text: "输入「赛博朋克龙」「福建土楼窗花」——任何想象都可以成为纹样。",
  },
  {
    icon: Download,
    title: "下载可剪纹样",
    text: "AI 生成矢量 SVG，导出即用，可手工剪刻，也可进激光雕刻机。",
  },
];

const FEATURES = [
  {
    icon: PenTool,
    title: "矢量 SVG 输出",
    text: "放大不失真，线条连贯可镂空，直接用于剪裁、雕刻与再创作。",
  },
  {
    icon: Layers,
    title: "专属纹样语法",
    text: "每种技艺都有一套风格引擎，忠实还原阴刻阳刻与配色传统。",
  },
  {
    icon: Scissors,
    title: "作品自动留档",
    text: "登录后每次生成都会保存到你的作品库，随时回看、导出、继续打磨。",
  },
];

const SHOWCASES = [
  { craft: "剪纸", prompt: "赛博朋克龙", color: "#C03A2B" },
  { craft: "窗花", prompt: "福建土楼与海浪", color: "#C03A2B" },
  { craft: "皮影", prompt: "敦煌飞天", color: "#4A3D34" },
];

function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function LandingPage() {
  const { isAuthenticated } = useConvexAuth();
  const ctaHref = isAuthenticated
    ? "/workshop"
    : `/auth?returnTo=${encodeURIComponent("/workshop")}`;

  return (
    <div className="paper-fiber min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" aria-label="非遗工坊首页">
            <Brand />
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-ink-soft md:flex">
            <a href="#how" className="transition-colors hover:text-cinnabar">
              创作流程
            </a>
            <a href="#crafts" className="transition-colors hover:text-cinnabar">
              非遗技艺
            </a>
            <a href="#examples" className="transition-colors hover:text-cinnabar">
              灵感示例
            </a>
          </nav>
          <Link
            to={ctaHref}
            className="hidden items-center gap-1.5 rounded-xl bg-cinnabar px-4 py-2 text-sm font-medium text-paper shadow-sm transition-colors hover:bg-cinnabar-deep sm:inline-flex"
          >
            {isAuthenticated ? "进入工坊" : "开始创作"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
        <div className="relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-cinnabar/30 bg-cinnabar-soft/60 px-3 py-1 text-xs font-medium text-cinnabar-deep"
          >
            <Sparkles className="h-3.5 w-3.5" />
            传统文化 × AI 生成
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-balance mt-5 font-serif text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl"
          >
            把灵感，
            <br />
            剪成<span className="text-cinnabar">千年纹样</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            选择一项非遗技艺，输入一句话，AI
            即刻生成一张可下载、可剪裁的传统纹样 SVG——剪纸、窗花、皮影、年画，皆可成稿。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link to={ctaHref}>
              <Button size="lg">
                开始创作
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how">
              <Button size="lg" variant="outline">
                看看怎么做
              </Button>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-xs text-ink-faint"
          >
            无需设计基础 · SVG 矢量可剪 · 灵感即所得
          </motion.p>
        </div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto grid aspect-square w-full max-w-md place-items-center"
        >
          <div className="absolute inset-0 rounded-full bg-cinnabar/5" />
          <CutFlower className="animate-float-slow h-[78%] w-[78%] drop-shadow-xl" />

          {["剪纸", "窗花", "皮影", "年画", "青花", "云锦"].map(
            (label, i) => {
              const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + Math.cos(angle) * 46;
              const y = 50 + Math.sin(angle) * 46;
              return (
                <span
                  key={label}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cinnabar/25 bg-paper px-3 py-1 font-serif text-sm font-semibold text-cinnabar-deep shadow-sm"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {label}
                </span>
              );
            },
          )}
        </motion.div>
      </section>

      {/* Steps */}
      <section id="how" className="border-y border-ink/10 bg-paper-deep/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-cinnabar">
              三步成稿
            </p>
            <h2 className="text-balance mt-3 text-center font-serif text-3xl font-bold sm:text-4xl">
              从一句话，到一张可剪的纹样
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-cinnabar text-paper">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-cinnabar">
                      0{i + 1}
                    </span>
                    <h3 className="font-serif text-lg font-bold">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Crafts */}
      <section id="crafts" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-cinnabar">
              非遗技艺
            </p>
            <h2 className="text-balance mt-3 text-center font-serif text-3xl font-bold sm:text-4xl">
              六种传统，一种新的打开方式
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CRAFTS.map((craft, i) => (
              <Reveal key={craft.id} delay={i * 0.05}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${craft.accent}`}
                  />
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-2xl font-bold">{craft.name}</h3>
                    <span className="rounded-full bg-paper-deep px-2.5 py-1 text-xs text-ink-soft">
                      {craft.short}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {craft.description}
                  </p>
                  <p className="mt-4 text-xs text-ink-faint">
                    试试：「{craft.example}」
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="bg-ink py-20 text-paper">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold-light">
              灵感示例
            </p>
            <h2 className="text-balance mt-3 text-center font-serif text-3xl font-bold sm:text-4xl">
              传统之外，也可以很「赛博」
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {SHOWCASES.map((item, i) => (
              <Reveal key={item.prompt} delay={i * 0.1}>
                <div className="flex h-full flex-col items-center rounded-2xl border border-paper/10 bg-paper/5 p-7 text-center">
                  <CutFlower
                    className="h-24 w-24"
                    color={item.color}
                    petals={10}
                  />
                  <p className="mt-5 font-serif text-xl font-bold">
                    「{item.prompt}」
                  </p>
                  <p className="mt-1 text-sm text-paper/60">{item.craft}风格</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
                  <feature.icon className="h-6 w-6 text-cinnabar" />
                  <h3 className="mt-4 font-serif text-lg font-bold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {feature.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24">
        <Reveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-cinnabar px-8 py-16 text-center text-paper shadow-xl">
            <CutFlower
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-15"
              color="#FAF4E6"
            />
            <CutFlower
              className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 opacity-10"
              color="#FAF4E6"
            />
            <h2 className="relative text-balance font-serif text-3xl font-black sm:text-4xl">
              准备好了吗？把你的灵感剪出来。
            </h2>
            <p className="relative mt-4 text-paper/85">
              登录即可开始，作品自动保存到你的纹样库。
            </p>
            <Link to={ctaHref} className="relative mt-8 inline-block">
              <Button size="lg" variant="secondary">
                免费开始创作
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/10 bg-paper-deep/40 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
          <Brand />
          <p className="text-xs text-ink-faint">
            AI 非遗工坊 · 让传统纹样由你生成 · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

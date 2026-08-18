import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useConvexAuth } from "@convex-dev/auth/react";
import {
  ArrowRight,
  BookOpen,
  Download,
  Feather,
  Info,
  Layers,
  PenTool,
  Scissors,
  Sparkles,
} from "lucide-react";
import { ACTIVITY } from "../lib/activity";
import { CRAFTS } from "../lib/crafts";
import { ActivityChip } from "./ActivityChip";
import { Brand } from "./Brand";
import { CutFlower } from "./CutFlower";
import { useCulture } from "./CultureProvider";
import { SiteFooter } from "./SiteFooter";
import { Button } from "./ui/button";

const STEPS = [
  {
    icon: Feather,
    title: "选一种视觉语言",
    text: "从剪纸、皮影、木版年画、青花纹样、云锦纹样中挑一种灵感来源。窗花是剪纸的常见应用，不是独立门类。",
  },
  {
    icon: Sparkles,
    title: "说一句灵感",
    text: "输入「赛博朋克龙」「土楼窗花」——当代想象也可以长成传统纹样的样子。",
  },
  {
    icon: Download,
    title: "下载矢量纹样",
    text: "AI 生成可下载的 SVG，便于继续剪刻、雕刻或再创作。它是数字化演绎，不是工艺原作。",
  },
];

const FEATURES = [
  {
    icon: PenTool,
    title: "矢量 SVG 输出",
    text: "放大不失真，线条尽量连贯可镂空，方便剪裁、雕刻与二次创作。",
  },
  {
    icon: Layers,
    title: "分风格的视觉参考",
    text: "每种风格借鉴对应传统艺术的构图、镂空或配色习惯，进行数字化再创作。",
  },
  {
    icon: Scissors,
    title: "游客可玩，登录可存",
    text: "打开即可体验。若要长期保存作品库，再登录即可。",
  },
];

const SHOWCASES = [
  { craft: "剪纸", prompt: "赛博朋克龙", color: "#C03A2B" },
  { craft: "剪纸 · 窗花", prompt: "土楼轮廓与海浪", color: "#C03A2B" },
  { craft: "皮影造型", prompt: "飞天姿态剪影", color: "#4A3D34" },
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
  const { openCulture, openCampaign } = useCulture();

  return (
    <div className="paper-fiber min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <Link to="/" aria-label="非遗工坊首页">
            <Brand />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-ink-soft md:flex">
            <a href="#how" className="transition-colors hover:text-cinnabar">
              创作流程
            </a>
            <a href="#crafts" className="transition-colors hover:text-cinnabar">
              风格参考
            </a>
            <button
              type="button"
              onClick={() => openCulture()}
              className="transition-colors hover:text-cinnabar"
            >
              文化资料
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openCulture()}
              className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft hover:bg-paper-deep md:hidden"
              aria-label="文化资料"
            >
              <BookOpen className="h-5 w-5" />
            </button>
            <Link
              to="/workshop"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-cinnabar px-3 py-2 text-sm font-medium text-paper shadow-sm transition-colors hover:bg-cinnabar-deep sm:px-4"
            >
              {isAuthenticated ? "进入工坊" : "开始体验"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 lg:grid-cols-2 lg:pt-20">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2"
          >
            <ActivityChip onClick={openCampaign} />
            <span className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-paper px-3 py-1 text-xs text-ink-soft">
              <Sparkles className="h-3.5 w-3.5 text-cinnabar" />
              无需登录即可体验
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-balance mt-5 font-serif text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl"
          >
            把灵感，
            <br />
            剪成<span className="text-cinnabar">国风纹样</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            选择一种传统视觉语言，输入一句话，AI
            即刻生成可下载的矢量纹样。这是以剪纸、皮影、年画、青花与云锦为灵感的数字化再创作。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link to="/workshop">
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
            className="mt-6 max-w-xl text-xs leading-relaxed text-ink-faint"
          >
            {ACTIVITY.disclaimer}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto grid aspect-square w-full max-w-md place-items-center"
        >
          <div className="absolute inset-0 rounded-full bg-cinnabar/5" />
          <CutFlower className="animate-float-slow h-[78%] w-[78%] drop-shadow-xl" />

          {["剪纸", "窗花", "皮影", "年画", "青花", "云锦"].map((label, i) => {
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
          })}
        </motion.div>
      </section>

      <section id="how" className="border-y border-ink/10 bg-paper-deep/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-cinnabar">
              三步成稿
            </p>
            <h2 className="text-balance mt-3 text-center font-serif text-3xl font-bold sm:text-4xl">
              从一句话，到一张可下载的纹样
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

      <section id="crafts" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-cinnabar">
              风格参考
            </p>
            <h2 className="text-balance mt-3 text-center font-serif text-3xl font-bold sm:text-4xl">
              五种传统脉络，六种视觉语言
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-soft">
              窗花从属于剪纸；青花是瓷器装饰语言；云锦是织造纹样。它们不是同一类工艺，只是本站可选用的灵感入口。
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CRAFTS.map((craft, i) => (
              <Reveal key={craft.id} delay={i * 0.05}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${craft.accent}`}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-2xl font-bold">
                        {craft.name}
                      </h3>
                      <p className="mt-1 text-xs text-ink-faint">
                        {craft.hierarchyLabel}
                      </p>
                    </div>
                    <span className="rounded-full bg-paper-deep px-2.5 py-1 text-xs text-ink-soft">
                      {craft.short}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {craft.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <p className="text-xs text-ink-faint">
                      试试：「{craft.example}」
                    </p>
                    <button
                      type="button"
                      onClick={() => openCulture(craft.id)}
                      className="inline-flex min-h-10 items-center gap-1 text-xs text-cinnabar hover:underline"
                    >
                      <Info className="h-3.5 w-3.5" />
                      出处
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="examples" className="bg-ink py-20 text-paper">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold-light">
              灵感示例
            </p>
            <h2 className="text-balance mt-3 text-center font-serif text-3xl font-bold sm:text-4xl">
              传统之外，也可以很当代
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
                  <p className="mt-1 text-sm text-paper/60">
                    {item.craft} · AI 再创作
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
              打开就能剪。登录只为把作品留下来。
            </h2>
            <p className="relative mt-4 text-paper/85">
              游客可直接生成与下载。想保存纹样库，再创建账号即可。
            </p>
            <Link to="/workshop" className="relative mt-8 inline-block">
              <Button size="lg" variant="secondary">
                免费开始创作
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

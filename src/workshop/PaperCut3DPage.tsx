import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Box,
  Brush,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  SprayCan,
} from "lucide-react";
import { Brand } from "../components/Brand";
import { PaperCut3D } from "../components/PaperCut3D";
import { SiteFooter } from "../components/SiteFooter";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

const STEPS = [
  {
    icon: Box,
    title: "3D 模型：程序化纸灯笼",
    text: "无需外部模型文件。用 LatheGeometry 旋转体勾勒灯笼轮廓，再叠上金骨、提环与流苏，就是一个可环绕观察的立体剪纸造型。",
  },
  {
    icon: Brush,
    title: "镂空贴图：Canvas 手绘红纸",
    text: "在 Canvas 上画出红纸渐变、金色竹骨，再用 destination-out 把圆孔挖成透明 —— 镂空透光的效果由此而来，内部再点一盏「灯火」发光体。",
  },
  {
    icon: SprayCan,
    title: "粒子特效：星火 + 纸屑",
    text: "金色星火用 THREE.Points 加色混合，上升环绕；剪纸纸屑用 InstancedMesh 的小纸片，飘落并自转，像剪落的花屑在空中飞舞。",
  },
  {
    icon: MousePointer2,
    title: "前端展示：可拖拽可缩放",
    text: "OrbitControls 提供拖拽旋转、滚轮缩放与惯性阻尼；进入视口才渲染、离开即暂停，兼顾动画质感与性能。",
  },
];

export function PaperCut3DPage() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="paper-fiber min-h-screen">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-5">
          <Link to="/" aria-label="返回首页">
            <Brand />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-cinnabar"
            >
              <ArrowLeft className="h-4 w-4" />
              首页
            </Link>
            <Link to="/workshop">
              <Button size="sm">进入纹样工坊</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cinnabar">
            立体剪纸 · 粒子特效
          </p>
          <h1 className="mt-2 text-balance font-serif text-3xl font-black leading-tight sm:text-4xl">
            一盏会发光的<span className="text-cinnabar"> 3D 剪纸灯笼</span>
          </h1>
          <p className="mt-3 text-ink-soft">
            拖拽旋转、滚轮缩放。红纸镂空透出暖光，金色星火与纸屑围绕飞舞 ——
            这是对剪纸镂空语言的数字化演绎，不是工艺原作。
          </p>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-b from-paper-deep/70 to-paper shadow-inner">
          <div className="aspect-[4/3] w-full sm:aspect-[16/9]">
            <PaperCut3D
              key={resetKey}
              className="h-full w-full"
              autoRotate={autoRotate}
              interactive
              showParticles={showParticles}
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
            <span className="rounded-full border border-cinnabar/25 bg-paper/80 px-3 py-1 text-xs font-medium text-cinnabar-deep shadow-sm backdrop-blur">
              鼠标拖拽旋转 · 滚轮缩放
            </span>
            <span className="rounded-full bg-gold/90 px-3 py-1 text-xs font-medium text-ink shadow-sm">
              AI 辅助再创作 · 非工艺原作
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRotate((v) => !v)}
            className={cn(autoRotate && "border-cinnabar/40 text-cinnabar")}
          >
            {autoRotate ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {autoRotate ? "暂停自转" : "开启自转"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowParticles((v) => !v)}
            className={cn(showParticles && "border-cinnabar/40 text-cinnabar")}
          >
            <Sparkles className="h-4 w-4" />
            {showParticles ? "关闭粒子" : "开启粒子"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResetKey((k) => k + 1)}
          >
            <RotateCcw className="h-4 w-4" />
            重置视角
          </Button>
        </div>

        <section className="mt-16">
          <h2 className="text-balance font-serif text-2xl font-bold sm:text-3xl">
            它是怎么做出来的？
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            这一整幕都在浏览器里实时渲染 —— 用 Three.js 拼出模型与粒子，没有加载任何外部 3D
            文件。四步拆解如下。
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="h-full rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-cinnabar text-paper">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="font-serif text-sm font-bold text-cinnabar">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-cinnabar/20 bg-cinnabar-soft/50 px-6 py-5 text-sm text-cinnabar-deep">
          传统剪纸以「剪刀 / 刻刀在纸上镂空」为特征；本站的 3D 灯笼与粒子只是对这一视觉语言的
          AI 辅助再创作，不模拟真实剪刻工艺，也不对应某一产地或某位传承人的样式。
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

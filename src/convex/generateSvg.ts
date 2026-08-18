import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { action } from "./_generated/server";

const CRAFTS: Record<
  string,
  { name: string; style: string; palette: string }
> = {
  jianzhi: {
    name: "剪纸",
    style: "北方民间剪纸，线条流畅，阳刻阴刻结合，图案对称，正负形清晰",
    palette: "朱红 #C03A2B 与深红 #96281B，纸白背景",
  },
  chuanghua: {
    name: "窗花",
    style: "团花窗花，圆形辐射对称构图，纹样密集镂空，喜庆吉祥",
    palette: "朱红 #C03A2B 单色，纸白背景",
  },
  piying: {
    name: "皮影",
    style: "皮影戏侧面剪影，镂空雕刻，线条分明，轮廓动感",
    palette: "深褐 #4A2F1B 与暖金 #C89B3C，浅米背景",
  },
  nianhua: {
    name: "年画",
    style: "木版年画，构图饱满，色彩鲜明，民俗吉祥纹样",
    palette: "朱红 #C03A2B、金 #C89B3C、藏蓝 #2E4A6B，纸白背景",
  },
  qinghua: {
    name: "青花",
    style: "青花瓷纹样，缠枝莲与云纹，蓝白配色，清雅流畅",
    palette: "青花蓝 #2E5E8C 单色，瓷白背景",
  },
  yunjin: {
    name: "云锦",
    style: "云锦织锦纹样，繁复华贵，云纹与缠枝，金线点缀",
    palette: "朱红 #C03A2B、金 #C89B3C、藏青 #2E3A5C，纸白背景",
  },
};

function extractSvg(raw: string): string | null {
  let s = (raw ?? "").trim();
  const fenced = s.match(/```(?:svg|xml)?\s*([\s\S]*?)```/i);
  if (fenced) {
    s = fenced[1].trim();
  }
  const start = s.indexOf("<svg");
  if (start === -1) {
    return null;
  }
  const end = s.lastIndexOf("</svg>");
  const svg = (end === -1 ? s.slice(start) : s.slice(start, end + 6))
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/javascript:/gi, "");
  if (!svg.includes("<svg")) {
    return null;
  }
  return svg;
}

export const generate = action({
  args: { craft: v.string(), prompt: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("请先登录");
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("未配置 OPENAI_API_KEY，请在 API Keys 中添加后重试");
    }

    const craft = CRAFTS[args.craft] ?? CRAFTS.jianzhi;
    const system =
      "你是一位精通中国非遗纹样设计的工艺美术大师，擅长把现代创意转化为可剪裁的传统纹样矢量图。你只输出合法、自包含的 SVG 代码。";
    const userPrompt = [
      `请创作一幅「${craft.name}」纹样，主题为：「${args.prompt}」。`,
      `风格要求：${craft.style}。`,
      `配色：${craft.palette}。`,
      `SVG 技术规范：`,
      `- viewBox="0 0 512 512"，正方形；`,
      `- 背景为纸白或透明；`,
      `- 只用 1-3 种纯色平涂填充，禁用渐变、阴影、滤镜、文字；`,
      `- 图形轮廓连贯、可镂空剪裁，正负形清晰，适合剪纸/雕刻；`,
      `- 构图讲究对称与留白，纹样精致、装饰性强。`,
      `只输出一段完整的 <svg>...</svg> 代码，不要任何解释、注释或 markdown 代码块。`,
    ].join("\n");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
          temperature: 0.8,
          messages: [
            { role: "system", content: system },
            { role: "user", content: userPrompt },
          ],
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `AI 生成失败（${res.status}）：${text.slice(0, 300)}`,
        );
      }

      const data = await res.json();
      const content: string = data?.choices?.[0]?.message?.content ?? "";
      const svg = extractSvg(content);
      if (!svg) {
        throw new Error("AI 未返回有效的 SVG，请换个提示词重试");
      }
      return { svg };
    } finally {
      clearTimeout(timeout);
    }
  },
});

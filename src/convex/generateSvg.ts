import { v } from "convex/values";
import { action } from "./_generated/server";

const CRAFTS: Record<
  string,
  { name: string; style: string; palette: string; caution: string }
> = {
  jianzhi: {
    name: "剪纸",
    style:
      "参考中国民间剪纸常见的单色镂空、阴阳刻结合、对称构图与清晰正负形。这是综合视觉参考，不是某一产地剪纸的复原。",
    palette: "朱红 #C03A2B 与深红 #96281B，纸白背景",
    caution: "属于传统剪纸的数字化再创作，不是剪纸原作。",
  },
  chuanghua: {
    name: "窗花（剪纸的应用形式）",
    style:
      "参考剪纸中用于窗格装饰的团花、圆形辐射对称与密集镂空。窗花是剪纸的常见用途，不是独立工艺门类。",
    palette: "朱红 #C03A2B 单色，纸白背景",
    caution: "属于剪纸应用形式的数字化再创作。",
  },
  piying: {
    name: "皮影影偶造型",
    style:
      "参考皮影影偶常见的侧面剪影、镂空关节与分明轮廓。只借用平面造型，不是在复原皮影戏演出。",
    palette: "深褐 #4A2F1B 与暖金 #C89B3C，浅米背景",
    caution: "属于影偶造型的数字化再创作，不是皮影戏本身。",
  },
  nianhua: {
    name: "木版年画视觉参考",
    style:
      "参考民间木版年画常见的饱满构图、鲜明配色与吉祥纹样。这是综合视觉参考，不对应杨柳青、桃花坞或其他单一产地。",
    palette: "朱红 #C03A2B、金 #C89B3C、藏蓝 #2E4A6B，纸白背景",
    caution: "属于年画视觉语言的数字化演绎，不是木版年画原作。",
  },
  qinghua: {
    name: "青花纹样",
    style:
      "参考瓷器装饰中常见的青花蓝白关系、缠枝莲与云纹。青花是装饰语言，不是织锦，也不是制瓷工艺本身。",
    palette: "青花蓝 #2E5E8C 单色，瓷白背景",
    caution: "属于青花装饰语言的数字化再创作，不是瓷器实物。",
  },
  yunjin: {
    name: "云锦纹样",
    style:
      "参考南京云锦织物常见的云纹、缠枝与金彩对比。只借用纹样与配色，不模拟木机妆花织造工艺。",
    palette: "朱红 #C03A2B、金 #C89B3C、藏青 #2E3A5C，纸白背景",
    caution: "属于云锦纹样的数字化演绎，不是云锦实物。",
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
  handler: async (_ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("未配置 OPENAI_API_KEY，请在 API Keys 中添加后重试");
    }

    const craft = CRAFTS[args.craft] ?? CRAFTS.jianzhi;
    const system = [
      "你是一位国风视觉创作者，擅长把当代想象转成可剪裁的装饰纹样矢量图。",
      "请将传统文化元素作为创作灵感，不要虚构历史事实、非遗等级、传承人或官方认证。",
      "不要声称生成内容是真实文物，也不要声称完全复原传统技艺。",
      "涉及具体历史信息时，不要在画面或任何文字中给出年代、名录或传承人。",
      "生成结果属于 AI 辅助创作，不代表传统工艺的完整复原。",
      "你只输出合法、自包含的 SVG 代码。",
    ].join("");

    const userPrompt = [
      `请创作一幅「${craft.name}」风格的装饰纹样，主题为：「${args.prompt}」。`,
      `风格要求：${craft.style}`,
      `配色：${craft.palette}。`,
      `创作说明：${craft.caution}`,
      `SVG 技术规范：`,
      `- viewBox="0 0 512 512"，正方形；`,
      `- 背景为纸白或透明；`,
      `- 只用 1-3 种纯色平涂填充，禁用渐变、阴影、滤镜、文字；`,
      `- 图形轮廓连贯、可镂空剪裁，正负形清晰；`,
      `- 构图讲究对称与留白，纹样精致、装饰性强；`,
      `- 不要在图中写任何汉字、英文、年代、非遗字样或署名。`,
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

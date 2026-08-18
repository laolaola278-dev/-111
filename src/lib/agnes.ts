import { craftById } from "./crafts";

export const AGNES_ENDPOINT = "https://apihub.agnes-ai.com/v1/images/generations";
export const AGNES_MODEL = "agnes-image-2.1-flash";

export type AgnesResult = {
  imageUrl: string;
  svg: string;
};

export function wrapImageSvg(imageUrl: string): string {
  const safe = imageUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><image href="${safe}" width="1024" height="1024" preserveAspectRatio="xMidYMid meet"/></svg>`;
}

export function buildAgnesPrompt(craftId: string, userPrompt: string): string {
  const craft = craftById(craftId);
  return [
    `Create one square decorative artwork inspired by Chinese traditional visual language: ${craft.name}.`,
    `User theme: ${userPrompt}`,
    `Hierarchy: ${craft.hierarchyLabel}`,
    `Visual features to reference: ${craft.visualHint}`,
    `Style guidance: ${craft.description}`,
    "This is an original AI digital recreation inspired by traditional composition, silhouette, hollow-out, or color relationships.",
    "Do not depict a real museum object, relic, or named inheritor.",
    "Do not add any text, letters, numbers, seals, signatures, dates, or heritage-label badges.",
    "Centered, high detail, clean background, suitable as a Xiaohongshu share image.",
    "Not a photograph of handmade craft, not a complete restoration of a traditional technique.",
  ].join("\n");
}

export function parseAgnesResponse(data: unknown): AgnesResult {
  const root = data as {
    data?: Array<{ url?: string; b64_json?: string }>;
    error?: { message?: string };
    message?: string;
  };
  const message = root?.error?.message || root?.message;
  if (message && !root?.data?.[0]) {
    throw new Error(message);
  }
  const item = root?.data?.[0];
  const url = item?.url;
  const b64 = item?.b64_json;
  const imageUrl = url || (b64 ? `data:image/png;base64,${b64}` : "");
  if (!imageUrl) {
    throw new Error("Agnes 未返回图片，请换个提示词重试");
  }
  return { imageUrl, svg: wrapImageSvg(imageUrl) };
}

export async function requestAgnesImage(
  apiKey: string,
  prompt: string,
): Promise<AgnesResult> {
  const res = await fetch(AGNES_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: AGNES_MODEL,
      prompt,
      size: "1K",
      ratio: "1:1",
      extra_body: { response_format: "url" },
    }),
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  if (!res.ok) {
    throw new Error(`Agnes 生成失败（${res.status}）：${text.slice(0, 280)}`);
  }
  return parseAgnesResponse(json);
}

export async function generateViaLocalApi(
  craft: string,
  prompt: string,
): Promise<AgnesResult> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ craft, prompt }),
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  if (!res.ok) {
    const err = json as { error?: string } | null;
    throw new Error(err?.error || `本地生成接口失败（${res.status}）`);
  }
  return json as AgnesResult;
}

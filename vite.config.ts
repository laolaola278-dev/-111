import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  buildAgnesPrompt,
  requestAgnesImage,
} from "./src/lib/agnes";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function agnesGeneratePlugin(apiKey: string): Plugin {
  const handle = async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }
    if (!apiKey) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "未配置 AGNES_API_KEY" }));
      return;
    }
    try {
      const body = JSON.parse((await readBody(req)) || "{}") as {
        craft?: string;
        prompt?: string;
      };
      const craft = body.craft || "jianzhi";
      const prompt = (body.prompt || "").trim();
      if (!prompt) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "请先输入灵感" }));
        return;
      }
      const result = await requestAgnesImage(
        apiKey,
        buildAgnesPrompt(craft, prompt),
      );
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    } catch (error) {
      res.statusCode = 502;
      res.end(
        JSON.stringify({
          error:
            error instanceof Error ? error.message : "Agnes 生成失败，请重试",
        }),
      );
    }
  };

  return {
    name: "agnes-generate",
    configureServer(server) {
      server.middlewares.use("/api/generate", (req, res) => {
        void handle(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/generate", (req, res) => {
        void handle(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.AGNES_API_KEY || env.VITE_AGNES_API_KEY || "";

  return {
    plugins: [react(), agnesGeneratePlugin(apiKey)],
    server: {
      host: "0.0.0.0",
      hmr: false,
      allowedHosts: true,
    },
    preview: {
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});

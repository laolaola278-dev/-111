# 非遗工坊 · AI 纹样创作

选择一项非遗技艺，输入一句灵感，AI 生成可下载、可剪裁的传统纹样 SVG。

## 技术栈

- React 19 + TypeScript + Vite
- Convex（后端、数据库、认证）
- Convex Auth（邮箱 + 密码）
- Tailwind CSS + Framer Motion

## 本地开发

```bash
bun install
bun run dev
```

Convex 函数位于 `src/convex/`。

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `OPENAI_API_KEY` | 生成纹样所需，由 AI 服务提供（在 API Keys 中配置） |
| `OPENAI_MODEL` | 可选，默认 `gpt-4o-mini` |
| `CONVEX_DEPLOYMENT` / `VITE_CONVEX_URL` | 由 `convex dev` 自动生成 |
| `JWT_PRIVATE_KEY` / `JWKS` | Convex Auth 会话签名密钥，由平台托管管理 |

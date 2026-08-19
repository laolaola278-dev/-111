# 非遗工坊 · 国风 Vibe Coding

选择一种传统视觉语言，输入一句灵感，AI 生成可下载的矢量纹样。

这是一个「国风 × Vibe Coding」互动创作实验。生成结果属于 AI 再创作，不代表对传统工艺的完整复原。

## 体验

- 游客无需注册即可生成、下载、截图
- 登录后可将作品保存到云端纹样库
- 页脚「文化资料」可查看分类说明与参考来源
- `/3d`「立体剪纸」：程序化 3D 纸灯笼 + 粒子特效（星火 + 纸屑），可拖拽旋转 / 滚轮缩放

## 技术栈

- React 19 + TypeScript + Vite
- Convex（后端、数据库、认证）
- Convex Auth（邮箱 + 密码，仅用于保存作品）
- Tailwind CSS + Framer Motion
- Three.js（`/3d` 立体剪纸：LatheGeometry 纸灯笼 + CanvasTexture 镂空贴图 + Points / InstancedMesh 粒子）

## 本地开发

```bash
bun install
bun run dev
```

Convex 函数位于 `src/convex/`。

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `AGNES_API_KEY` | Agnes Image 2.1 Flash 生图密钥，服务端优先使用 |
| `VITE_AGNES_API_KEY` | 仅本地/预览浏览器直连时使用，不要提交到 Git |
| `OPENAI_API_KEY` | 未配置 Agnes 时的 SVG 兜底 |
| `OPENAI_MODEL` | 可选，默认 `gpt-4o-mini` |
| `CONVEX_DEPLOYMENT` / `VITE_CONVEX_URL` | 由 `convex dev` 自动生成 |
| `JWT_PRIVATE_KEY` / `JWKS` | Convex Auth 会话签名密钥，由平台托管管理 |

申请 Agnes 密钥：<https://platform.agnes-ai.com/settings/apiKeys>（也可使用 OpenAI 图像生成作为备选）。

## 文化说明

窗花从属于剪纸的应用形式，不是独立工艺门类。青花是瓷器装饰语言。云锦是织造技艺。具体出处见站内「文化资料」。

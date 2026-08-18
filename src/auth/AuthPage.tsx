import { useState, type FormEvent } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Brand } from "../components/Brand";
import { CutFlower } from "../components/CutFlower";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export function AuthPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/workshop";
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={returnTo} replace />;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      await signIn("password", formData);
      // On success isAuthenticated flips and <Navigate> fires above.
    } catch {
      setError(
        flow === "signIn"
          ? "登录失败，请检查邮箱与密码。"
          : "注册失败，请确认邮箱格式正确、密码至少 8 位。",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="paper-fiber grid min-h-screen lg:grid-cols-2">
      {/* Decorative panel */}
      <div className="relative hidden overflow-hidden bg-cinnabar lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-cinnabar to-cinnabar-deep" />
        <CutFlower
          className="absolute -left-20 top-10 h-96 w-96 opacity-20"
          color="#FAF4E6"
        />
        <CutFlower
          className="absolute -bottom-24 right-0 h-[28rem] w-[28rem] opacity-15"
          color="#FAF4E6"
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-paper">
          <Brand className="[&_span]:text-paper" />
          <div>
            <h1 className="text-balance font-serif text-4xl font-black leading-tight">
              登录只为
              <br />
              把作品留下来。
            </h1>
            <p className="mt-4 max-w-sm text-paper/85">
              工坊本身无需登录。注册后可以把纹样同步到你的作品库。
            </p>
          </div>
          <p className="text-xs text-paper/60">
            国风 × Vibe Coding · AI 再创作
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col px-5 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-cinnabar"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <Brand className="lg:hidden" />
        </div>

        <div className="mx-auto mt-12 w-full max-w-sm flex-1">
          <h2 className="font-serif text-3xl font-bold">
            {flow === "signIn" ? "欢迎回来" : "创建账号"}
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            {flow === "signIn"
              ? "登录后保存作品。游客也可直接进入工坊体验。"
              : "只需一个邮箱，即可把作品同步到云端。"}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={flow === "signIn" ? "输入密码" : "至少 8 位密码"}
                autoComplete={
                  flow === "signIn" ? "current-password" : "new-password"
                }
                minLength={8}
                required
              />
            </div>

            <input type="hidden" name="flow" value={flow} />

            {error ? (
              <p className="rounded-xl bg-cinnabar-soft px-3 py-2 text-sm text-cinnabar-deep">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {flow === "signIn" ? "登录" : "注册并开始创作"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            <Link to="/workshop" className="font-medium text-cinnabar hover:underline">
              先去游客体验
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-ink-soft">
            {flow === "signIn" ? "还没有账号？" : "已经有账号？"}
            <button
              type="button"
              onClick={() => {
                setFlow(flow === "signIn" ? "signUp" : "signIn");
                setError(null);
              }}
              className="ml-1 font-medium text-cinnabar hover:underline"
            >
              {flow === "signIn" ? "免费注册" : "去登录"}
            </button>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-ink-faint">
          登录仅用于保存作品。生成结果属于 AI 再创作，不代表传统工艺复原。
        </p>
      </div>
    </div>
  );
}

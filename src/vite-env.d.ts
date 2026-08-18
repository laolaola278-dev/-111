/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL?: string;
  readonly VITE_AGNES_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

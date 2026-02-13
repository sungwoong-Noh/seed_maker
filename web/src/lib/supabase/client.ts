import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "[Seed Maker] Supabase env 미설정. .env.local 설정 후 'rm -rf .next && npm run dev' 로 재시작하세요."
    );
  }
  return createBrowserClient(url, key);
}

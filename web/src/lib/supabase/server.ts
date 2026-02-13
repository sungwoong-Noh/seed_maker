import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 디버그: 환경 변수 상태 출력
  console.log("[server.ts] Environment check:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlValue: supabaseUrl,
    keyPreview: supabaseKey?.substring(0, 30) + "...",
    allSupabaseEnvKeys: Object.keys(process.env).filter(k => k.includes("SUPABASE"))
  });

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Supabase 환경 변수가 로드되지 않았습니다.\n` +
      `URL: ${supabaseUrl || '(없음)'}\n` +
      `Key: ${supabaseKey ? '(있음)' : '(없음)'}\n` +
      `.env.local 파일 확인 필요`
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component - ignore
        }
      },
    },
  });
}

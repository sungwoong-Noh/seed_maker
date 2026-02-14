"use client";

import { useEffect } from "react";

/**
 * Next.js 전역 에러 페이지
 * 
 * 루트 레이아웃에서 발생한 에러를 처리합니다.
 * 이 파일은 반드시 html과 body 태그를 포함해야 합니다.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="mb-2 text-center text-xl font-bold text-gray-800">
              심각한 오류가 발생했습니다
            </h2>

            <p className="mb-6 text-center text-sm text-gray-600">
              앱을 다시 시작해주세요.
              <br />
              문제가 지속되면 관리자에게 문의해주세요.
            </p>

            {process.env.NODE_ENV === "development" && (
              <div className="mb-6 rounded-lg bg-red-50 p-4">
                <p className="text-xs font-mono text-red-700 break-words">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="mt-2 text-xs text-red-600">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 rounded-lg bg-emerald-600 py-3 font-medium text-white hover:bg-emerald-700"
              >
                다시 시작
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                새로고침
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

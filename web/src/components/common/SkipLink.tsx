"use client";

/**
 * 접근성: 키보드 사용자를 위한 "본문으로 건너뛰기" 링크
 * Tab 키 첫 입력 시 본문으로 바로 이동
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="absolute -translate-y-full left-4 top-4 focus:translate-y-0 focus:z-[100] px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-transform"
    >
      본문으로 건너뛰기
    </a>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Wallet, TrendingUp, Target } from "lucide-react";

/**
 * 하단 네비게이션 바
 * 모든 주요 페이지에서 사용
 */
export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "홈",
      icon: (active: boolean) => (
        <Home
          className="w-6 h-6"
          strokeWidth={active ? 2.5 : 1.75}
          fill={active ? "currentColor" : "none"}
        />
      ),
    },
    {
      href: "/expenses",
      label: "지출",
      icon: (active: boolean) => (
        <Receipt
          className="w-6 h-6"
          strokeWidth={active ? 2.5 : 1.75}
        />
      ),
    },
    {
      href: "/budget",
      label: "예산",
      icon: (active: boolean) => (
        <Wallet
          className="w-6 h-6"
          strokeWidth={active ? 2.5 : 1.75}
        />
      ),
    },
    {
      href: "/portfolio",
      label: "배당",
      icon: (active: boolean) => (
        <TrendingUp
          className="w-6 h-6"
          strokeWidth={active ? 2.5 : 1.75}
        />
      ),
    },
    {
      href: "/goal",
      label: "목표",
      icon: (active: boolean) => (
        <Target
          className="w-6 h-6"
          strokeWidth={active ? 2.5 : 1.75}
        />
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-gray-200 bg-white py-3 safe-area-inset-bottom z-50"
      aria-label="메인 네비게이션"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded ${
              isActive ? "text-emerald-700" : "text-gray-600"
            }`}
            aria-current={isActive ? "page" : undefined}
            aria-label={isActive ? `${item.label} (현재 페이지)` : item.label}
          >
            {item.icon(isActive)}
            <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

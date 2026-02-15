"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

/**
 * 페이지 전환 시 fade + slide 애니메이션 적용
 */
export function PageTransition({ children }: Props) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, DURATION } from "@/lib/motion";

/** Wraps page content with a soft, fast enter transition on route change. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.smooth, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

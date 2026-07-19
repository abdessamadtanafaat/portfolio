// Centralized motion system — every animation in the app should reuse these tokens.
// Inspired by Linear / Vercel-style motion: GPU-accelerated transforms, soft springs,
// consistent easing, and full prefers-reduced-motion support.

import type { Variants, Transition } from "framer-motion";

/** Signature easing curve used across the whole site (expo-out feel). */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.21, 0.47, 0.32, 0.98] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Duration scale (seconds). */
export const DURATION = {
  fast: 0.18,
  base: 0.32,
  smooth: 0.5,
  slow: 0.7,
} as const;

/** Shared spring for interactive elements (buttons, cards, icons). */
export const SPRING = {
  soft: { type: "spring", stiffness: 260, damping: 26 } as Transition,
  snappy: { type: "spring", stiffness: 420, damping: 30 } as Transition,
  gentle: { type: "spring", stiffness: 180, damping: 22 } as Transition,
};

/** Stagger container: children reveal progressively and smoothly. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/** Standard "fade + rise" item variant, reused by ScrollReveal & cards. */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.smooth, ease: EASE_OUT },
  },
};

export const fadeLeftItem: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.smooth, ease: EASE_OUT },
  },
};

export const fadeRightItem: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.smooth, ease: EASE_OUT },
  },
};

/** Viewport config so animations run once, slightly before fully in-view. */
export const IN_VIEW = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -10% 0px",
} as const;

/** Hover / tap micro-interaction presets for buttons & interactive elements. */
export const hoverLift = {
  whileHover: { y: -2, scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: SPRING.soft,
};

export const iconHover = {
  whileHover: { scale: 1.12, rotate: -4 },
  whileTap: { scale: 0.92 },
  transition: SPRING.snappy,
};

/** Helper to build a section header reveal (badge → title → subtitle). */
export const headerReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const headerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

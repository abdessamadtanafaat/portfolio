"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { fadeUpItem, fadeLeftItem, fadeRightItem, IN_VIEW, EASE_OUT, DURATION, staggerContainer } from "@/lib/motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
  className?: string;
  /** Render as a stagger container so direct motion children reveal progressively. */
  stagger?: boolean;
  as?: "div" | "section" | "ul" | "li";
}

const directionVariants: Record<"up" | "left" | "right", Variants> = {
  up: fadeUpItem,
  left: fadeLeftItem,
  right: fadeRightItem,
};

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  stagger = false,
  as = "div",
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  const base = directionVariants[direction];

  if (stagger) {
    return (
      <MotionTag
        className={className}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      variants={base}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

export { EASE_OUT, DURATION };

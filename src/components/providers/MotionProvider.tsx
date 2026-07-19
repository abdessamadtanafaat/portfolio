"use client";

import React from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * Global motion provider:
 * - LazyMotion: loads only the features used → smaller bundle, faster mount.
 * - MotionConfig reducedMotion="user": respects OS preference everywhere at once.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict={false}>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

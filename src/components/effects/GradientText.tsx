"use client";

import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({ children, className = "", animate = false }: GradientTextProps) {
  return (
    <span
      className={`bg-clip-text text-transparent bg-[length:200%_200%] ${
        animate
          ? "bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 dark:from-brand-300 dark:via-brand-400 dark:to-brand-500 animate-gradient"
          : "bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-400 dark:to-brand-500"
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function AnimatedHeadline({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`bg-clip-text text-transparent bg-[length:300%_300%] bg-gradient-to-r from-slate-900 via-brand-600 to-slate-900 dark:from-white dark:via-brand-400 dark:to-white animate-gradient ${className}`}
    >
      {children}
    </span>
  );
}

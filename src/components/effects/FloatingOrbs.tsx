"use client";

import React from "react";
import { motion } from "framer-motion";

interface FloatingOrbsProps {
  className?: string;
  count?: number;
}

const orbColors = [
  "bg-brand-500/[0.38] dark:bg-brand-400/[0.09]",
  "bg-violet-500/[0.30] dark:bg-violet-400/[0.07]",
  "bg-emerald-500/[0.25] dark:bg-emerald-400/[0.06]",
  "bg-amber-500/[0.32] dark:bg-amber-400/[0.07]",
];

const orbSizes = [
  "w-[500px] h-[500px]",
  "w-[400px] h-[400px]",
  "w-[300px] h-[300px]",
  "w-[350px] h-[350px]",
];

const orbPositions = [
  "top-1/4 -left-1/4",
  "top-1/3 -right-1/4",
  "bottom-1/4 left-1/3",
  "bottom-1/3 right-1/3",
];

const orbDurations = [20, 25, 18, 22];

export function FloatingOrbs({ className = "", count = 4 }: FloatingOrbsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`orb ${orbSizes[i % orbSizes.length]} ${orbColors[i % orbColors.length]} ${orbPositions[i % orbPositions.length]}`}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.05, 0.95, 1.02, 1],
          }}
          transition={{
            duration: orbDurations[i % orbDurations.length],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function HeroOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/[0.35] dark:bg-brand-400/[0.08] rounded-full blur-[100px]"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-500/[0.28] dark:bg-violet-400/[0.06] rounded-full blur-[100px]"
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 25, -15, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-emerald-500/[0.24] dark:bg-emerald-400/[0.05] rounded-full blur-[100px]"
        animate={{
          x: [0, 20, -25, 0],
          y: [0, -20, 15, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

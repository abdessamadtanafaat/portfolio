"use client";

import { motion } from "framer-motion";
import { headerReveal, headerChild, EASE_OUT, DURATION } from "@/lib/motion";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

/** Shared section header pattern with a smooth badge → title → subtitle cascade. */
export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <motion.div
      className="section-header"
      variants={headerReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {eyebrow && (
        <motion.span variants={headerChild} className="section-eyebrow">
          {eyebrow}
        </motion.span>
      )}
      <motion.h2 variants={headerChild} className="section-title">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={headerChild} className="section-subtitle">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

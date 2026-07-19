import React from "react";

interface SectionShellProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  /** Surface variant used to alternate rhythm between sections. */
  variant?: "default" | "muted";
}

/**
 * Shared section wrapper: single vertical rhythm and a clean, premium
 * surface. No colored gradients — separation comes from spacing and a
 * very subtle neutral background, in the spirit of Apple / Linear / Vercel.
 * The Hero keeps its own rich background and does NOT use this shell.
 */
export function SectionShell({ id, className = "", children, variant = "default" }: SectionShellProps) {
  return (
    <section
      id={id}
      className={`section-padding relative overflow-hidden section-surface ${variant === "muted" ? "section-surface-muted" : ""} ${className}`}
    >
      <div className="relative mx-auto max-w-6xl container-px">{children}</div>
    </section>
  );
}

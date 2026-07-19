"use client";

import React from "react";

export function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(237, 129, 22, 0.30) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 30%, rgba(245, 158, 11, 0.20) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 50% 80%, rgba(237, 129, 22, 0.15) 0%, transparent 50%)
          `,
          backgroundSize: "200% 200%",
        }}
      />
      <div
        className="absolute inset-0 dark:opacity-30 opacity-70 animate-gradient-shift"
        style={{
          background: `
            radial-gradient(circle at 30% 50%, rgba(237, 129, 22, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 70% 50%, rgba(245, 158, 11, 0.10) 0%, transparent 40%)
          `,
          backgroundSize: "200% 200%",
          animationDelay: "4s",
          animationDuration: "12s",
        }}
      />
    </div>
  );
}

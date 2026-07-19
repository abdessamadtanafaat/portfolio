"use client";

import React from "react";

export function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.25] dark:opacity-[0.07] animate-morph"
        style={{
          background: "radial-gradient(circle, #ed8116 0%, transparent 70%)",
          top: "-10%",
          left: "-10%",
          animationDuration: "12s",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.18] dark:opacity-[0.05] animate-morph"
        style={{
          background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
          top: "20%",
          right: "-15%",
          animationDuration: "16s",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.14] dark:opacity-[0.04] animate-morph"
        style={{
          background: "radial-gradient(circle, #ed8116 0%, transparent 70%)",
          bottom: "-5%",
          left: "30%",
          animationDuration: "20s",
          animationDelay: "4s",
        }}
      />
    </div>
  );
}

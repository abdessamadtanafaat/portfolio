"use client";

import { ImageIcon } from "lucide-react";

interface ImagePreviewProps {
  url: string;
  alt?: string;
  className?: string;
}

export function ImagePreview({ url, alt = "Preview", className = "" }: ImagePreviewProps) {
  if (!url) return null;

  return (
    <div className={`relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
        }}
      />
      <div className="hidden absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="h-8 w-8 mx-auto text-slate-400 mb-2" />
          <p className="text-xs text-slate-500">Invalid image URL</p>
        </div>
      </div>
    </div>
  );
}

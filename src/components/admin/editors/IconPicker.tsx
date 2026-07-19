"use client";

import React, { useState } from "react";
import {
  Code, Award, Briefcase, GraduationCap, Shield, Rocket, Users,
  Lightbulb, Target, Heart, Zap, Star, Globe, Database, Server,
  Terminal, Layers, Cpu, Cloud, Lock, Search, Palette, Smartphone,
  Monitor, Wifi, Key, FileCode, Package, Settings, Wrench,
} from "lucide-react";

const icons = [
  { name: "Code", icon: Code },
  { name: "Award", icon: Award },
  { name: "Briefcase", icon: Briefcase },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "Shield", icon: Shield },
  { name: "Rocket", icon: Rocket },
  { name: "Users", icon: Users },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Target", icon: Target },
  { name: "Heart", icon: Heart },
  { name: "Zap", icon: Zap },
  { name: "Star", icon: Star },
  { name: "Globe", icon: Globe },
  { name: "Database", icon: Database },
  { name: "Server", icon: Server },
  { name: "Terminal", icon: Terminal },
  { name: "Layers", icon: Layers },
  { name: "Cpu", icon: Cpu },
  { name: "Cloud", icon: Cloud },
  { name: "Lock", icon: Lock },
  { name: "Search", icon: Search },
  { name: "Palette", icon: Palette },
  { name: "Smartphone", icon: Smartphone },
  { name: "Monitor", icon: Monitor },
  { name: "Wifi", icon: Wifi },
  { name: "Key", icon: Key },
  { name: "FileCode", icon: FileCode },
  { name: "Package", icon: Package },
  { name: "Settings", icon: Settings },
  { name: "Wrench", icon: Wrench },
];

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = icons.find((i) => i.name === value);
  const SelectedIcon = selected?.icon || Code;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 transition-all"
      >
        <SelectedIcon className="h-4 w-4" />
        <span>{value || "Choose icon"}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-2 w-72 p-3 rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 grid grid-cols-6 gap-1.5">
            {icons.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => { onChange(item.name); setOpen(false); }}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    value === item.name
                      ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                  }`}
                  title={item.name}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function getIconComponent(name: string) {
  const found = icons.find((i) => i.name === name);
  return found?.icon || Code;
}

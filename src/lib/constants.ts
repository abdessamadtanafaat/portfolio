export const PROJECT_CATEGORIES = ["fullstack", "frontend", "backend", "cms", "devops", "mobile"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = ["production", "staging", "prototype", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const SKILL_CATEGORIES = ["frontend", "backend", "cms", "devops", "database", "tools", "testing"] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const SOCIAL_PLATFORMS = ["github", "linkedin", "twitter", "email", "phone", "website"] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const categoryLabels: Record<string, string> = {
  fullstack: "Fullstack",
  frontend: "Frontend",
  backend: "Backend",
  cms: "CMS",
  devops: "DevOps",
  mobile: "Mobile",
  database: "Database",
  tools: "Tools",
  testing: "Testing",
};

export const statusLabels: Record<string, string> = {
  production: "Production",
  staging: "Staging",
  prototype: "Prototype",
  archived: "Archived",
};

export const statusColors: Record<string, string> = {
  production: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  staging: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  prototype: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  archived: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

export const categoryColors: Record<string, string> = {
  fullstack: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400",
  frontend: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  backend: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cms: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  devops: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  mobile: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  database: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  tools: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  testing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export const platformLabels: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  email: "Email",
  phone: "Phone",
  website: "Website",
};

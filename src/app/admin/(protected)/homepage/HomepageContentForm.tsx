"use client";

import { useState } from "react";
import {
  CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronRight,
  Home, User, Sparkles, Briefcase, FolderKanban, Code2,
  GraduationCap, Award, Mail, Copyright, ArrowUpDown,
  Globe, Heart,
} from "lucide-react";
import { SectionOrderEditor } from "@/components/admin/editors/SectionOrderEditor";
import { AboutCardsEditor } from "@/components/admin/editors/AboutCardsEditor";
import { CertificatesInProgressEditor } from "@/components/admin/editors/CertificatesInProgressEditor";

interface HomepageData {
  id: number;
  heroHeadline: string | null;
  heroSubtext: string | null;
  heroCtaText: string | null;
  heroCtaUrl: string | null;
  heroCta2Text: string | null;
  heroCta2Url: string | null;
  heroCta3Text: string | null;
  heroCta3Url: string | null;
  heroBadgeText: string | null;
  aboutBadge: string | null;
  aboutTitle: string | null;
  aboutDescription: string | null;
  aboutCards: string | null;
  differentiatorsTitle: string | null;
  differentiatorsDescription: string | null;
  experienceBadge: string | null;
  experienceTitle: string | null;
  experienceDescription: string | null;
  projectsBadge: string | null;
  projectsTitle: string | null;
  projectsDescription: string | null;
  projectsCtaText: string | null;
  skillsBadge: string | null;
  skillsTitle: string | null;
  skillsDescription: string | null;
  educationBadge: string | null;
  educationTitle: string | null;
  educationDescription: string | null;
  certificatesBadge: string | null;
  certificatesTitle: string | null;
  certificatesDescription: string | null;
  certificatesInProgress: string | null;
  contactBadge: string | null;
  contactTitle: string | null;
  contactDescription: string | null;
  contactSuccessMessage: string | null;
  languagesBadge: string | null;
  languagesTitle: string | null;
  languagesDescription: string | null;
  volunteeringBadge: string | null;
  volunteeringTitle: string | null;
  volunteeringDescription: string | null;
  softSkillsBadge: string | null;
  softSkillsTitle: string | null;
  softSkillsDescription: string | null;
  footerCopyright: string | null;
  footerDescription: string | null;
  footerNavTitle: string | null;
  footerContactTitle: string | null;
  footerTechTitle: string | null;
  sectionVisibility: string | null;
  sectionOrder: string | null;
  [key: string]: unknown;
}

interface Props { data: HomepageData | null; }

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";
const hintClass = "mt-1 text-xs text-slate-400 dark:text-slate-500";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function Section({ title, icon, defaultOpen = false, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <span className="text-slate-500 dark:text-slate-400">{icon}</span>
        <span className="flex-1 text-base font-semibold text-slate-900 dark:text-white">{title}</span>
        {open ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2 space-y-4 border-t border-slate-100 dark:border-slate-800">{children}</div>}
    </div>
  );
}

const defaultSections = [
  { id: "hero", label: "Hero", visible: true },
  { id: "about", label: "A propos de moi", visible: true },
  { id: "differentiators", label: "Ce qui me distingue", visible: true },
  { id: "experience", label: "Parcours professionnel", visible: true },
  { id: "projects", label: "Projets clés", visible: true },
  { id: "skills", label: "Stack technique & Expertise", visible: true },
  { id: "education", label: "Formation", visible: true },
  { id: "certificates", label: "Certifications", visible: true },
  { id: "contact", label: "Contact", visible: true },
];

export function HomepageContentForm({ data }: Props) {
  const [form, setForm] = useState({
    heroHeadline: data?.heroHeadline ?? "",
    heroSubtext: data?.heroSubtext ?? "",
    heroCtaText: data?.heroCtaText ?? "",
    heroCtaUrl: data?.heroCtaUrl ?? "",
    heroCta2Text: data?.heroCta2Text ?? "",
    heroCta2Url: data?.heroCta2Url ?? "",
    heroCta3Text: data?.heroCta3Text ?? "",
    heroCta3Url: data?.heroCta3Url ?? "",
    heroBadgeText: data?.heroBadgeText ?? "",
    aboutBadge: data?.aboutBadge ?? "",
    aboutTitle: data?.aboutTitle ?? "",
    aboutDescription: data?.aboutDescription ?? "",
    aboutCards: data?.aboutCards ?? "[]",
    differentiatorsTitle: data?.differentiatorsTitle ?? "",
    differentiatorsDescription: data?.differentiatorsDescription ?? "",
    experienceBadge: data?.experienceBadge ?? "",
    experienceTitle: data?.experienceTitle ?? "",
    experienceDescription: data?.experienceDescription ?? "",
    projectsBadge: data?.projectsBadge ?? "",
    projectsTitle: data?.projectsTitle ?? "",
    projectsDescription: data?.projectsDescription ?? "",
    projectsCtaText: data?.projectsCtaText ?? "",
    skillsBadge: data?.skillsBadge ?? "",
    skillsTitle: data?.skillsTitle ?? "",
    skillsDescription: data?.skillsDescription ?? "",
    educationBadge: data?.educationBadge ?? "",
    educationTitle: data?.educationTitle ?? "",
    educationDescription: data?.educationDescription ?? "",
    certificatesBadge: data?.certificatesBadge ?? "",
    certificatesTitle: data?.certificatesTitle ?? "",
    certificatesDescription: data?.certificatesDescription ?? "",
    certificatesInProgress: data?.certificatesInProgress ?? "[]",
    contactBadge: data?.contactBadge ?? "",
    contactTitle: data?.contactTitle ?? "",
    contactDescription: data?.contactDescription ?? "",
    contactSuccessMessage: data?.contactSuccessMessage ?? "",
    languagesBadge: data?.languagesBadge ?? "",
    languagesTitle: data?.languagesTitle ?? "",
    languagesDescription: data?.languagesDescription ?? "",
    volunteeringBadge: data?.volunteeringBadge ?? "",
    volunteeringTitle: data?.volunteeringTitle ?? "",
    volunteeringDescription: data?.volunteeringDescription ?? "",
    softSkillsBadge: data?.softSkillsBadge ?? "",
    softSkillsTitle: data?.softSkillsTitle ?? "",
    softSkillsDescription: data?.softSkillsDescription ?? "",
    footerCopyright: data?.footerCopyright ?? "",
    footerDescription: data?.footerDescription ?? "",
    footerNavTitle: data?.footerNavTitle ?? "Navigation",
    footerContactTitle: data?.footerContactTitle ?? "Contact",
    footerTechTitle: data?.footerTechTitle ?? "Technologies",
  });

  const [sections, setSections] = useState(() => {
    try {
      const order = data?.sectionOrder ? JSON.parse(data.sectionOrder) : [];
      const vis = data?.sectionVisibility ? JSON.parse(data.sectionVisibility) : {};
      if (order.length > 0) {
        return order.map((id: string) => ({
          id,
          label: defaultSections.find((s) => s.id === id)?.label || id,
          visible: vis[id] !== false,
        }));
      }
    } catch {}
    return defaultSections;
  });

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const sectionOrder = JSON.stringify(sections.map((s: { id: string; label: string; visible: boolean }) => s.id));
    const sectionVisibility = JSON.stringify(Object.fromEntries(sections.map((s: { id: string; label: string; visible: boolean }) => [s.id, s.visible])));

    try {
      const res = await fetch("/api/homepage-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sectionOrder, sectionVisibility }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setMessage("Homepage content updated successfully!");
    } catch {
      setStatus("error");
      setMessage("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Homepage Content</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Edit all section headers, badges, descriptions, and text across your portfolio homepage.
        </p>
      </div>

      {status && (
        <div className={`flex items-center gap-3 rounded-2xl p-4 ${status === "success" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
          {status === "success" ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Section title="Hero" icon={<Home className="h-5 w-5" />} defaultOpen>
          <div>
            <label className={labelClass}>Badge Text</label>
            <input type="text" value={form.heroBadgeText} onChange={set("heroBadgeText")} className={inputClass} placeholder="Développeur Web Full Stack" />
            <p className={hintClass}>Shown above the headline with a pulsing dot</p>
          </div>
          <div>
            <label className={labelClass}>Headline</label>
            <input type="text" value={form.heroHeadline} onChange={set("heroHeadline")} className={inputClass} placeholder="Abdessamad Tanafa" />
            <p className={hintClass}>The last word will be highlighted with gradient</p>
          </div>
          <div>
            <label className={labelClass}>Subtext</label>
            <textarea value={form.heroSubtext} onChange={set("heroSubtext")} rows={3} className={`${inputClass} resize-none`} placeholder="Your hero tagline..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Primary CTA Text</label>
              <input type="text" value={form.heroCtaText} onChange={set("heroCtaText")} className={inputClass} placeholder="Me contacter" />
            </div>
            <div>
              <label className={labelClass}>Primary CTA URL</label>
              <input type="text" value={form.heroCtaUrl} onChange={set("heroCtaUrl")} className={inputClass} placeholder="#contact" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Secondary CTA Text</label>
              <input type="text" value={form.heroCta2Text} onChange={set("heroCta2Text")} className={inputClass} placeholder="Me contacter" />
            </div>
            <div>
              <label className={labelClass}>Secondary CTA URL</label>
              <input type="text" value={form.heroCta2Url} onChange={set("heroCta2Url")} className={inputClass} placeholder="#contact" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>CV CTA Text</label>
              <input type="text" value={form.heroCta3Text} onChange={set("heroCta3Text")} className={inputClass} placeholder="Télécharger CV" />
            </div>
            <div>
              <label className={labelClass}>CV CTA URL</label>
              <input type="text" value={form.heroCta3Url} onChange={set("heroCta3Url")} className={inputClass} placeholder="/cv.pdf" />
            </div>
          </div>
        </Section>

        <Section title="A propos de moi" icon={<User className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge Text</label>
              <input type="text" value={form.aboutBadge} onChange={set("aboutBadge")} className={inputClass} placeholder="Profil" />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input type="text" value={form.aboutTitle} onChange={set("aboutTitle")} className={inputClass} placeholder="A propos de moi" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.aboutDescription} onChange={set("aboutDescription")} rows={4} className={`${inputClass} resize-none`} placeholder="Your about description..." />
          </div>
          <div>
            <label className={labelClass}>About Cards</label>
            <p className={hintClass}>Add cards that describe your key skills and expertise</p>
            <div className="mt-2">
              <AboutCardsEditor value={form.aboutCards} onChange={(v) => setForm((p) => ({ ...p, aboutCards: v }))} />
            </div>
          </div>
        </Section>

        <Section title="Ce qui me distingue" icon={<Sparkles className="h-5 w-5" />}>
          <div>
            <label className={labelClass}>Section Title</label>
            <input type="text" value={form.differentiatorsTitle} onChange={set("differentiatorsTitle")} className={inputClass} placeholder="Ce qui me distingue" />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.differentiatorsDescription ?? ""} onChange={set("differentiatorsDescription")} rows={3} className={`${inputClass} resize-none`} placeholder="Optional description for this section" />
            <p className={hintClass}>Individual differentiator items are managed in the Differentiators page</p>
          </div>
        </Section>

        <Section title="Parcours professionnel" icon={<Briefcase className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge Text</label>
              <input type="text" value={form.experienceBadge} onChange={set("experienceBadge")} className={inputClass} placeholder="Expérience" />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input type="text" value={form.experienceTitle} onChange={set("experienceTitle")} className={inputClass} placeholder="Parcours professionnel" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.experienceDescription} onChange={set("experienceDescription")} rows={3} className={`${inputClass} resize-none`} placeholder="Section description..." />
          </div>
        </Section>

        <Section title="Projets clés" icon={<FolderKanban className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge Text</label>
              <input type="text" value={form.projectsBadge} onChange={set("projectsBadge")} className={inputClass} placeholder="Réalisations" />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input type="text" value={form.projectsTitle} onChange={set("projectsTitle")} className={inputClass} placeholder="Projets clés" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.projectsDescription} onChange={set("projectsDescription")} rows={3} className={`${inputClass} resize-none`} placeholder="Section description..." />
          </div>
          <div>
            <label className={labelClass}>CTA Button Text</label>
            <input type="text" value={form.projectsCtaText} onChange={set("projectsCtaText")} className={inputClass} placeholder="Voir tous les projets →" />
          </div>
        </Section>

        <Section title="Stack technique & Expertise" icon={<Code2 className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge Text</label>
              <input type="text" value={form.skillsBadge} onChange={set("skillsBadge")} className={inputClass} placeholder="Compétences" />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input type="text" value={form.skillsTitle} onChange={set("skillsTitle")} className={inputClass} placeholder="Stack technique & Expertise" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.skillsDescription} onChange={set("skillsDescription")} rows={3} className={`${inputClass} resize-none`} placeholder="Section description..." />
          </div>
        </Section>

        <Section title="Formation" icon={<GraduationCap className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge Text</label>
              <input type="text" value={form.educationBadge} onChange={set("educationBadge")} className={inputClass} placeholder="Formation & Certifications" />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input type="text" value={form.educationTitle} onChange={set("educationTitle")} className={inputClass} placeholder="Formation académique" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.educationDescription} onChange={set("educationDescription")} rows={3} className={`${inputClass} resize-none`} placeholder="Section description..." />
          </div>
        </Section>

        <Section title="Certifications" icon={<Award className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge Text</label>
              <input type="text" value={form.certificatesBadge} onChange={set("certificatesBadge")} className={inputClass} placeholder="Certifications" />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input type="text" value={form.certificatesTitle} onChange={set("certificatesTitle")} className={inputClass} placeholder="Certifications & Formations" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.certificatesDescription} onChange={set("certificatesDescription")} rows={3} className={`${inputClass} resize-none`} placeholder="Section description..." />
          </div>
          <div>
            <label className={labelClass}>Certificates In Progress</label>
            <p className={hintClass}>Add certificates you are currently working on</p>
            <div className="mt-2">
              <CertificatesInProgressEditor value={form.certificatesInProgress} onChange={(v) => setForm((p) => ({ ...p, certificatesInProgress: v }))} />
            </div>
          </div>
        </Section>

        <Section title="Contact" icon={<Mail className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge Text</label>
              <input type="text" value={form.contactBadge} onChange={set("contactBadge")} className={inputClass} placeholder="Contact" />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input type="text" value={form.contactTitle} onChange={set("contactTitle")} className={inputClass} placeholder="Travaillons ensemble" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.contactDescription} onChange={set("contactDescription")} rows={3} className={`${inputClass} resize-none`} placeholder="Section description..." />
          </div>
          <div>
            <label className={labelClass}>Success Message</label>
            <input type="text" value={form.contactSuccessMessage} onChange={set("contactSuccessMessage")} className={inputClass} placeholder="Message envoyé avec succès !" />
            <p className={hintClass}>Shown after a contact form is submitted successfully</p>
          </div>
        </Section>

        <Section title="Langues" icon={<Globe className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge Text</label>
              <input type="text" value={form.languagesBadge} onChange={set("languagesBadge")} className={inputClass} placeholder="Langues" />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input type="text" value={form.languagesTitle} onChange={set("languagesTitle")} className={inputClass} placeholder="Langues" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.languagesDescription} onChange={set("languagesDescription")} rows={3} className={`${inputClass} resize-none`} placeholder="Section description..." />
          </div>
        </Section>

        <Section title="Bénévolat" icon={<Heart className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge Text</label>
              <input type="text" value={form.volunteeringBadge} onChange={set("volunteeringBadge")} className={inputClass} placeholder="Bénévolat" />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input type="text" value={form.volunteeringTitle} onChange={set("volunteeringTitle")} className={inputClass} placeholder="Engagements & Bénévolat" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.volunteeringDescription} onChange={set("volunteeringDescription")} rows={3} className={`${inputClass} resize-none`} placeholder="Section description..." />
          </div>
        </Section>

        <Section title="Soft Skills & Hobbies" icon={<Sparkles className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Badge Text</label>
              <input type="text" value={form.softSkillsBadge} onChange={set("softSkillsBadge")} className={inputClass} placeholder="Soft Skills & Hobbies" />
            </div>
            <div>
              <label className={labelClass}>Section Title</label>
              <input type="text" value={form.softSkillsTitle} onChange={set("softSkillsTitle")} className={inputClass} placeholder="Savoir-être & Centres d'intérêt" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.softSkillsDescription} onChange={set("softSkillsDescription")} rows={3} className={`${inputClass} resize-none`} placeholder="Section description..." />
          </div>
        </Section>

        <Section title="Footer" icon={<Copyright className="h-5 w-5" />}>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.footerDescription} onChange={set("footerDescription")} rows={2} className={`${inputClass} resize-none`} placeholder="Footer description below logo" />
            <p className={hintClass}>Falls back to personal tagline if empty</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Navigation Column Title</label>
              <input type="text" value={form.footerNavTitle} onChange={set("footerNavTitle")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Column Title</label>
              <input type="text" value={form.footerContactTitle} onChange={set("footerContactTitle")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Technologies Column Title</label>
              <input type="text" value={form.footerTechTitle} onChange={set("footerTechTitle")} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Copyright Text</label>
            <input type="text" value={form.footerCopyright} onChange={set("footerCopyright")} className={inputClass} placeholder="Tous droits réservés." />
          </div>
        </Section>

        <Section title="Section Visibility & Order" icon={<ArrowUpDown className="h-5 w-5" />}>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            Drag to reorder sections. Toggle visibility with the eye icon.
          </p>
          <SectionOrderEditor sections={sections} onChange={setSections} />
        </Section>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save All Changes
        </button>
      </form>
    </div>
  );
}

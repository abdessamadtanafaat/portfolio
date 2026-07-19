"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Send, Loader2, CheckCircle, AlertCircle, MapPin } from "lucide-react";
import { Linkedin, Github } from "@/components/icons";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { GradientOrbs } from "@/components/effects/GradientOrbs";
import { HeroOrbs } from "@/components/effects/FloatingOrbs";
import type { PersonalInfo, SocialLink, HomepageContent, FormField, FormSettings } from "@/lib/queries/portfolio";
import { useTranslations } from "@/i18n/useTranslations";

interface ContactProps {
  personal: PersonalInfo | null;
  socialLinks: SocialLink[];
  homepage: HomepageContent | null;
  formFields?: FormField[];
  formSettings?: FormSettings | null;
}

interface DynamicFormData {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

export function Contact({ personal, socialLinks, homepage, formFields = [], formSettings }: ContactProps) {
  const { t } = useTranslations();
  const visibleFields = useMemo(() => formFields.filter((f) => f.visible && f.formType === "contact").sort((a, b) => a.orderIndex - b.orderIndex), [formFields]);
  const [formData, setFormData] = useState<DynamicFormData>(() => {
    const initial: DynamicFormData = {};
    visibleFields.forEach((f) => { initial[f.name] = ""; });
    return initial;
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    visibleFields.forEach((field) => {
      const value = formData[field.name] || "";
      if (field.required && !value.trim()) {
        newErrors[field.name] = t("contact.validation.required", { field: field.label });
      } else if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field.name] = t("contact.validation.email");
      } else if (field.name === "message" && value && value.trim().length < 20) {
        newErrors[field.name] = t("contact.validation.messageMin");
      } else if (field.name === "name" && value && value.trim().length < 2) {
        newErrors[field.name] = t("contact.validation.nameMin");
      } else if (field.name === "subject" && value && value.trim().length < 5) {
        newErrors[field.name] = t("contact.validation.subjectMin");
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.error) {
        setStatus("error");
        setErrorMessage(result.error);
      } else {
        setStatus("success");
        const reset: DynamicFormData = {};
        visibleFields.forEach((f) => { reset[f.name] = ""; });
        setFormData(reset);
      }
    } catch {
      setStatus("error");
      setErrorMessage(formSettings?.errorMessage || t("contact.error"));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const linkedin = socialLinks.find((l) => l.platform === "linkedin");
  const github = socialLinks.find((l) => l.platform === "github");

  const contactInfo = [
    { icon: Mail, label: t("contact.email"), value: personal?.email ?? "", href: personal?.email ? `mailto:${personal.email}` : "#" },
    { icon: Phone, label: t("contact.phone"), value: personal?.phone ?? "", href: personal?.phone ? `tel:${personal.phone.replace(/\s/g, "")}` : "#" },
    ...(personal?.location ? [{ icon: MapPin, label: t("contact.location"), value: personal.location, href: "#" }] : []),
  ].filter((item) => item.value);

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <HeroOrbs />
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      <GradientOrbs />
      <div className="noise-overlay" />

      <div className="relative mx-auto max-w-6xl container-px">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 rounded-full dark:bg-brand-900/30 dark:text-brand-400 mb-4">
              {homepage?.contactBadge || t("contact.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {homepage?.contactTitle || t("contact.title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {homepage?.contactDescription || t("contact.description")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-2">
          <ScrollReveal delay={0.1} direction="left">
            <div className="glass-card p-6 sm:p-8 h-full">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">{t("contact.coordinates")}</h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                    className="group flex items-center gap-4 p-4 rounded-xl glass-card hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/10"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 group-hover:scale-110 transition-transform">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {(linkedin || github || personal?.email) && (
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{t("contact.socialMedia")}</h4>
                  <div className="flex gap-3">
                    {linkedin && (
                      <a href={linkedin.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-600 dark:text-slate-300 hover:from-brand-500 hover:to-brand-600 hover:text-white dark:hover:from-brand-600 dark:hover:to-brand-700 dark:hover:text-white transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-brand-500/25" aria-label="LinkedIn">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {github && (
                      <a href={github.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-600 dark:text-slate-300 hover:from-slate-800 hover:to-slate-900 hover:text-white dark:hover:from-slate-700 dark:hover:to-slate-600 dark:hover:text-white transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-slate-500/25" aria-label="GitHub">
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {personal?.email && (
                      <a href={`mailto:${personal.email}`} className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-600 dark:text-slate-300 hover:from-red-500 hover:to-red-600 hover:text-white dark:hover:from-red-600 dark:hover:to-red-700 dark:hover:text-white transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-red-500/25" aria-label="Email">
                        <Mail className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} direction="right">
            <div className="glass-card p-6 sm:p-8 h-full">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">{t("contact.sendMessage")}</h3>

              {status === "success" && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{formSettings?.successMessage || homepage?.contactSuccessMessage || t("contact.success")}</p>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-700 dark:text-red-400">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  {visibleFields.filter((f) => f.type !== "textarea").map((field) => (
                    <DynamicFormField key={field.name} field={field} value={formData[field.name] || ""} onChange={handleChange} error={errors[field.name]} />
                  ))}
                </div>
                {visibleFields.filter((f) => f.type === "textarea").map((field) => (
                  <DynamicFormField key={field.name} field={field} value={formData[field.name] || ""} onChange={handleChange} error={errors[field.name]} rows={6} />
                ))}
                <motion.button
                  type="submit"
                  disabled={status === "submitting"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {status === "submitting" ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /><span>{formSettings?.loadingButtonText || t("contact.sending")}</span></>
                  ) : (
                    <><Send className="h-5 w-5" /><span>{formSettings?.submitButtonText || t("contact.send")}</span></>
                  )}
                </motion.button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function DynamicFormField({ field, value, onChange, error, rows }: {
  field: { label: string; name: string; type: string; placeholder?: string | null; required: boolean };
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  rows?: number;
}) {
  const isTextarea = field.type === "textarea";
  return (
    <div className={isTextarea ? "sm:col-span-2" : undefined}>
      <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {field.label} {field.required && <span className="text-brand-500">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          id={field.name}
          name={field.name}
          value={value}
          onChange={onChange}
          rows={rows || 4}
          placeholder={field.placeholder || ""}
          required={field.required}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-150 resize-none ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-200 bg-white focus:border-slate-400 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10"
          }`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${field.name}-error` : undefined}
        />
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder || ""}
          required={field.required}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-150 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-200 bg-white focus:border-slate-400 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10"
          }`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${field.name}-error` : undefined}
        />
      )}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} id={`${field.name}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />{error}
        </motion.p>
      )}
    </div>
  );
}

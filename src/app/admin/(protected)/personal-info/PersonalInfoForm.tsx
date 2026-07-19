"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Props {
  data: {
    id: number;
    name: string;
    title: string;
    tagline: string | null;
    bio: string | null;
    location: string | null;
    email: string | null;
    phone: string | null;
    avatarUrl: string | null;
    resumeUrl: string | null;
  } | null;
}

export function PersonalInfoForm({ data }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: data?.name ?? "",
    title: data?.title ?? "",
    tagline: data?.tagline ?? "",
    bio: data?.bio ?? "",
    location: data?.location ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    avatarUrl: data?.avatarUrl ?? "",
    resumeUrl: data?.resumeUrl ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/personal-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast("success", "Saved successfully!");
      router.refresh();
    } catch {
      toast("error", "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-all duration-150"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Personal Info</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Your public profile information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name <span className="text-red-500">*</span></label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title <span className="text-red-500">*</span></label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
            <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City, Country" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Avatar URL</label>
            <Input value={form.avatarUrl} onChange={(e) => update("avatarUrl", e.target.value)} placeholder="https://..." />
            {form.avatarUrl && <ImagePreview url={form.avatarUrl} alt="Avatar preview" className="mt-3 h-24 w-24 rounded-full" />}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Resume URL</label>
            <Input value={form.resumeUrl} onChange={(e) => update("resumeUrl", e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tagline</label>
          <Input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="A short description of what you do" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bio</label>
          <Textarea
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

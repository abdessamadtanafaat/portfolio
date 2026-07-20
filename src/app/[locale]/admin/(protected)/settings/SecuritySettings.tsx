"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, KeyRound, UserPlus, Trash2, ShieldCheck, Pencil, X } from "lucide-react";
import {
  changePasswordAction,
  createAdminUserAction,
  deleteAdminUserAction,
  updateAdminUserAction,
} from "../../actions";
import { useAdminTranslations } from "@/i18n/useAdminTranslations";

interface AdminRow {
  id: number;
  email: string;
  name: string;
  username: string | null;
  createdAt: number;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-white/10 transition-all duration-150";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-all duration-150 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed";

const dangerBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors dark:border-red-800/60 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-40 disabled:cursor-not-allowed";

export function SecuritySettings({
  currentUserId,
  admins,
}: {
  currentUserId: number | null;
  admins: AdminRow[];
}) {
  const { t } = useAdminTranslations();
  const router = useRouter();

  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit admin
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editUser, setEditUser] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const startEdit = (a: AdminRow) => {
    setEditingId(a.id);
    setEditName(a.name);
    setEditUser(a.username || "");
    setEditEmail(a.email);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditUser("");
    setEditEmail("");
  };

  const handleSaveEdit = async (id: number) => {
    setMsg(null);
    setEditLoading(true);
    try {
      const res = await updateAdminUserAction(id, {
        name: editName,
        username: editUser,
        email: editEmail,
      });
      setMsg({ type: res.success ? "success" : "error", text: res.message });
      if (res.success) {
        cancelEdit();
        router.refresh();
      }
    } finally {
      setEditLoading(false);
    }
  };

  // Change password
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Add admin
  const [aEmail, setAEmail] = useState("");
  const [aName, setAName] = useState("");
  const [aUser, setAUser] = useState("");
  const [aPass, setAPass] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (next !== confirm) {
      setMsg({ type: "error", text: t("security.passwordMismatch") });
      return;
    }
    setPwLoading(true);
    try {
      const res = await changePasswordAction(cur, next);
      setMsg({ type: res.success ? "success" : "error", text: res.message });
      if (res.success) {
        setCur("");
        setNext("");
        setConfirm("");
      }
    } finally {
      setPwLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setAddLoading(true);
    try {
      const res = await createAdminUserAction(aEmail, aName, aPass, aUser);
      setMsg({ type: res.success ? "success" : "error", text: res.message });
      if (res.success) {
        setAEmail("");
        setAName("");
        setAUser("");
        setAPass("");
        router.refresh();
      }
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setMsg(null);
    const res = await deleteAdminUserAction(id);
    setMsg({ type: res.success ? "success" : "error", text: res.message });
    if (res.success) router.refresh();
  };

  return (
    <div className="space-y-6">
      {msg && (
        <div
          className={
            msg.type === "success"
              ? "rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/20 dark:text-emerald-300"
              : "rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-400"
          }
          role="alert"
        >
          {msg.text}
        </div>
      )}

      {/* Change password */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white mb-4">
          <KeyRound className="h-4 w-4 text-slate-500" />
          {t("security.changePassword")}
        </h2>
        <form onSubmit={handleChangePassword} className="grid gap-4 sm:grid-cols-3">
          <input
            type="password"
            value={cur}
            onChange={(e) => setCur(e.target.value)}
            placeholder={t("security.currentPassword")}
            autoComplete="current-password"
            required
            disabled={pwLoading}
            className={inputClass}
          />
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder={t("security.newPassword")}
            autoComplete="new-password"
            required
            disabled={pwLoading}
            className={inputClass}
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={t("security.confirmPassword")}
            autoComplete="new-password"
            required
            disabled={pwLoading}
            className={inputClass}
          />
          <div className="sm:col-span-3">
            <button type="submit" className={primaryBtn} disabled={pwLoading}>
              {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t("security.updatePassword")}
            </button>
          </div>
        </form>
      </section>

      {/* Admin users */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white mb-4">
          <ShieldCheck className="h-4 w-4 text-slate-500" />
          {t("security.adminUsers")}
        </h2>

        <ul className="divide-y divide-slate-100 dark:divide-slate-800 mb-6">
          {admins.length === 0 && (
            <li className="py-3 text-sm text-slate-500 dark:text-slate-400">{t("security.noAdmins")}</li>
          )}
          {admins.map((a) => {
            const isSelf = currentUserId !== null && a.id === currentUserId;
            if (editingId === a.id) {
              return (
                <li key={a.id} className="py-3 border border-slate-200 dark:border-slate-700 rounded-xl px-3 bg-slate-50/60 dark:bg-slate-800/40">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={t("security.name")}
                      disabled={editLoading}
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={editUser}
                      onChange={(e) => setEditUser(e.target.value)}
                      placeholder={t("security.username")}
                      disabled={editLoading}
                      className={inputClass}
                    />
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder={t("security.email")}
                      disabled={editLoading}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="button" className={primaryBtn} disabled={editLoading} onClick={() => handleSaveEdit(a.id)}>
                      {editLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {t("common.save")}
                    </button>
                    <button type="button" className={dangerBtn} disabled={editLoading} onClick={cancelEdit}>
                      <X className="h-3.5 w-3.5" />
                      {t("common.cancel")}
                    </button>
                  </div>
                </li>
              );
            }
            return (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {a.name}{" "}
                    {isSelf && (
                      <span className="text-xs font-normal text-slate-400">({t("security.you")})</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {a.email}
                    {a.username ? ` · @${a.username}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/[0.04]"
                    onClick={() => startEdit(a)}
                    title={t("common.edit")}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {t("common.edit")}
                  </button>
                  <button
                    type="button"
                    className={dangerBtn}
                    onClick={() => handleDelete(a.id)}
                    disabled={isSelf}
                    title={isSelf ? t("security.cannotDeleteSelf") : t("security.delete")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t("security.delete")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-slate-500" />
          {t("security.addAdmin")}
        </h3>
        <form onSubmit={handleCreateAdmin} className="grid gap-4 sm:grid-cols-4">
          <input
            type="text"
            value={aName}
            onChange={(e) => setAName(e.target.value)}
            placeholder={t("security.name")}
            disabled={addLoading}
            className={inputClass}
          />
          <input
            type="text"
            value={aUser}
            onChange={(e) => setAUser(e.target.value)}
            placeholder={t("security.username")}
            disabled={addLoading}
            className={inputClass}
          />
          <input
            type="email"
            value={aEmail}
            onChange={(e) => setAEmail(e.target.value)}
            placeholder={t("security.email")}
            required
            disabled={addLoading}
            className={inputClass}
          />
          <input
            type="password"
            value={aPass}
            onChange={(e) => setAPass(e.target.value)}
            placeholder={t("security.password")}
            required
            disabled={addLoading}
            className={inputClass}
          />
          <button type="submit" className={primaryBtn} disabled={addLoading}>
            {addLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("security.createAdmin")}
          </button>
        </form>
      </section>
    </div>
  );
}

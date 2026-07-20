export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { siteSettings, adminUser } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { SettingsForm } from "./SettingsForm";
import { SecuritySettings } from "./SecuritySettings";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  const { locale = "en" } = await searchParams;
  const settings = await db.select().from(siteSettings).where(eq(siteSettings.locale, locale)).get();

  const session = await auth();
  const currentUserId = session?.user?.id ? Number(session.user.id) : null;
  const admins = await db
    .select({ id: adminUser.id, email: adminUser.email, name: adminUser.name, username: adminUser.username, createdAt: adminUser.createdAt })
    .from(adminUser)
    .orderBy(adminUser.id)
    .all();

  return (
    <div className="space-y-8">
      <SettingsForm data={settings ?? null} locale={locale} />
      <SecuritySettings currentUserId={currentUserId} admins={admins} />
    </div>
  );
}

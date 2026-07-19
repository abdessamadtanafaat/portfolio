export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await db.select().from(siteSettings).get();
  return <SettingsForm data={settings ?? null} />;
}

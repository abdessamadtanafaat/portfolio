export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { homepageContent } from "@/lib/db/schema";
import { FooterForm } from "./FooterForm";

export default async function FooterPage() {
  const hp = await db.select().from(homepageContent).get();
  return <FooterForm data={hp ?? null} />;
}
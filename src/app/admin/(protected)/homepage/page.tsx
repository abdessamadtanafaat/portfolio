export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { homepageContent } from "@/lib/db/schema";
import { HomepageContentForm } from "./HomepageContentForm";

export default async function HomepageContentPage() {
  const hp = await db.select().from(homepageContent).get();
  return <HomepageContentForm data={hp ?? null} />;
}

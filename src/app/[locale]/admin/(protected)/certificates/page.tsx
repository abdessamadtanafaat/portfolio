export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { certificates } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { CertificatesListClient } from "./CertificatesListClient";

export default async function CertificatesListPage() {
  const all = await db.select().from(certificates).orderBy(desc(certificates.issueDate)).all();
  return <CertificatesListClient data={all} />;
}

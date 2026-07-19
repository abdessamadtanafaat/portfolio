"use client";

import { EntityForm } from "@/components/admin/EntityForm";

const fields = [
  { name: "company", label: "Company", required: true, span: 1 as const },
  { name: "role", label: "Role", required: true, span: 1 as const },
  { name: "location", label: "Location" },
  { name: "startDate", label: "Start Date", type: "date" as const, required: true },
  { name: "endDate", label: "End Date", type: "date" as const },
  { name: "current", label: "Currently working here", type: "checkbox" as const },
  { name: "description", label: "Description", type: "textarea" as const, rows: 4, span: 2 as const },
  { name: "highlights", label: "Highlights (one per line)", type: "textarea" as const, rows: 4, span: 2 as const, placeholder: "Led migration to microservices\nReduced load time by 40%" },
  { name: "technologies", label: "Technologies (comma separated)", span: 2 as const, placeholder: "React, Node.js, PostgreSQL" },
  { name: "orderIndex", label: "Order Index", type: "number" as const },
];

export default function NewExperiencePage() {
  return (
    <EntityForm
      title="New Experience"
      entityName="Experience"
      fields={fields}
      apiEndpoint="/api/experiences"
      backHref="/admin/experiences"
      onTransformSubmit={(data) => ({
        ...data,
        startDate: data.startDate ? Math.floor(new Date(String(data.startDate)).getTime() / 1000) : 0,
        endDate: data.endDate ? Math.floor(new Date(String(data.endDate)).getTime() / 1000) : null,
        current: data.current ? 1 : 0,
        highlights: JSON.stringify(String(data.highlights).split("\n").filter(Boolean)),
        technologies: JSON.stringify(String(data.technologies).split(",").map((t: string) => t.trim()).filter(Boolean)),
      })}
    />
  );
}

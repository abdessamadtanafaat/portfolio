"use client";

import { useParams } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";

function toInputDate(ts: number | null) {
  if (!ts) return "";
  return new Date(ts * 1000).toISOString().split("T")[0];
}

const fields = [
  { name: "company", label: "Company", required: true, span: 1 as const },
  { name: "role", label: "Role", required: true, span: 1 as const },
  { name: "location", label: "Location" },
  { name: "startDate", label: "Start Date", type: "date" as const, required: true },
  { name: "endDate", label: "End Date", type: "date" as const },
  { name: "current", label: "Currently working here", type: "checkbox" as const },
  { name: "description", label: "Description", type: "textarea" as const, rows: 4, span: 2 as const },
  { name: "highlights", label: "Highlights (one per line)", type: "textarea" as const, rows: 4, span: 2 as const },
  { name: "technologies", label: "Technologies (comma separated)", span: 2 as const },
  { name: "orderIndex", label: "Order Index", type: "number" as const },
];

export default function EditExperiencePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <EntityForm
      title="Edit Experience"
      entityName="Experience"
      fields={fields}
      apiEndpoint="/api/experiences"
      id={id}
      backHref="/admin/experiences"
      onTransformLoad={(data) => {
        let highlights = "";
        try { highlights = JSON.parse(data.highlights as string).join("\n"); } catch { /* empty */ }
        let techs = "";
        try { techs = JSON.parse(data.technologies as string).join(", "); } catch { /* empty */ }
        return {
          ...data,
          startDate: toInputDate(data.startDate as number),
          endDate: toInputDate(data.endDate as number | null),
          highlights,
          technologies: techs,
        };
      }}
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

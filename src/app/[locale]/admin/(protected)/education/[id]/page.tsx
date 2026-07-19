"use client";

import { useParams } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";

function toInputDate(ts: number | null) {
  if (!ts) return "";
  return new Date(ts * 1000).toISOString().split("T")[0];
}

const fields = [
  { name: "institution", label: "Institution", required: true, span: 2 as const },
  { name: "degree", label: "Degree", required: true, span: 1 as const },
  { name: "field", label: "Field", required: true, span: 1 as const },
  { name: "location", label: "Location" },
  { name: "startDate", label: "Start Date", type: "date" as const, required: true },
  { name: "endDate", label: "End Date", type: "date" as const },
  { name: "honors", label: "Honors" },
  { name: "orderIndex", label: "Order Index", type: "number" as const },
];

export default function EditEducationPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <EntityForm
      title="Edit Education"
      entityName="Education"
      fields={fields}
      apiEndpoint="/api/education"
      id={id}
      backHref="/admin/education"
      onTransformLoad={(data) => ({
        ...data,
        startDate: toInputDate(data.startDate as number),
        endDate: toInputDate(data.endDate as number | null),
      })}
      onTransformSubmit={(data) => ({
        ...data,
        startDate: data.startDate ? Math.floor(new Date(String(data.startDate)).getTime() / 1000) : 0,
        endDate: data.endDate ? Math.floor(new Date(String(data.endDate)).getTime() / 1000) : null,
      })}
    />
  );
}

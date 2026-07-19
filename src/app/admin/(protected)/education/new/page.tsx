"use client";

import { EntityForm } from "@/components/admin/EntityForm";

const fields = [
  { name: "institution", label: "Institution", required: true, span: 2 as const },
  { name: "degree", label: "Degree", required: true, placeholder: "B.Sc.", span: 1 as const },
  { name: "field", label: "Field", required: true, placeholder: "Computer Science", span: 1 as const },
  { name: "location", label: "Location" },
  { name: "startDate", label: "Start Date", type: "date" as const, required: true },
  { name: "endDate", label: "End Date", type: "date" as const },
  { name: "honors", label: "Honors", placeholder: "Magna Cum Laude" },
  { name: "orderIndex", label: "Order Index", type: "number" as const },
];

export default function NewEducationPage() {
  return (
    <EntityForm
      title="New Education"
      entityName="Education"
      fields={fields}
      apiEndpoint="/api/education"
      backHref="/admin/education"
      onTransformSubmit={(data) => ({
        ...data,
        startDate: data.startDate ? Math.floor(new Date(String(data.startDate)).getTime() / 1000) : 0,
        endDate: data.endDate ? Math.floor(new Date(String(data.endDate)).getTime() / 1000) : null,
      })}
    />
  );
}

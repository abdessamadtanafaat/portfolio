"use client";

import { useParams } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "category", label: "Category", type: "select" as const, required: true, options: [
    { label: "Frontend", value: "frontend" },
    { label: "Backend", value: "backend" },
    { label: "CMS", value: "cms" },
    { label: "DevOps", value: "devops" },
    { label: "Database", value: "database" },
    { label: "Tools", value: "tools" },
    { label: "Testing", value: "testing" },
  ]},
  { name: "proficiency", label: "Proficiency (%)", type: "number" as const, min: 0, max: 100 },
  { name: "icon", label: "Icon" },
  { name: "orderIndex", label: "Order Index", type: "number" as const },
];

export default function EditSkillPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <EntityForm
      title="Edit Skill"
      entityName="Skill"
      fields={fields}
      apiEndpoint="/api/skills"
      id={id}
      backHref="/admin/skills"
    />
  );
}

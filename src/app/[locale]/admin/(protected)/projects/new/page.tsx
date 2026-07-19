"use client";

import { EntityForm } from "@/components/admin/EntityForm";

const fields = [
  { name: "title", label: "Title", required: true, span: 1 as const },
  { name: "slug", label: "Slug", required: true, placeholder: "my-project", span: 1 as const },
  { name: "subtitle", label: "Subtitle", span: 1 as const },
  { name: "shortDescription", label: "Short Description", type: "textarea" as const, rows: 2, span: 2 as const },
  { name: "description", label: "Description", type: "textarea" as const, rows: 6, span: 2 as const },
  { name: "coverImageUrl", label: "Cover Image URL", type: "image" as const, span: 2 as const },
  { name: "category", label: "Category", type: "select" as const, required: true, options: [
    { label: "Fullstack", value: "fullstack" },
    { label: "Frontend", value: "frontend" },
    { label: "Backend", value: "backend" },
    { label: "CMS", value: "cms" },
    { label: "DevOps", value: "devops" },
    { label: "Mobile", value: "mobile" },
  ]},
  { name: "status", label: "Status", type: "select" as const, options: [
    { label: "Production", value: "production" },
    { label: "Staging", value: "staging" },
    { label: "Prototype", value: "prototype" },
    { label: "Archived", value: "archived" },
  ]},
  { name: "demoUrl", label: "Demo URL" },
  { name: "repoUrl", label: "Repo URL" },
  { name: "caseStudyUrl", label: "Case Study URL" },
  { name: "orderIndex", label: "Order Index", type: "number" as const },
  { name: "featured", label: "Featured", type: "checkbox" as const },
];

export default function NewProjectPage() {
  return (
    <EntityForm
      title="New Project"
      entityName="Project"
      fields={fields}
      apiEndpoint="/api/projects"
      backHref="/admin/projects"
      onTransformSubmit={(data) => ({ ...data, featured: data.featured ? 1 : 0 })}
    />
  );
}

"use client";

import { useParams } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";

const fields = [
  { name: "platform", label: "Platform", type: "select" as const, options: [
    { label: "GitHub", value: "github" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "Twitter", value: "twitter" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Website", value: "website" },
  ]},
  { name: "url", label: "URL", required: true },
  { name: "label", label: "Label" },
];

export default function EditSocialLinkPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <EntityForm
      title="Edit Social Link"
      entityName="Social Link"
      fields={fields}
      apiEndpoint="/api/social-links"
      id={id}
      backHref="/admin/social-links"
    />
  );
}

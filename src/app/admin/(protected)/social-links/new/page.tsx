"use client";

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
  { name: "url", label: "URL", required: true, placeholder: "https://github.com/username" },
  { name: "label", label: "Label", placeholder: "My GitHub" },
];

export default function NewSocialLinkPage() {
  return (
    <EntityForm
      title="New Social Link"
      entityName="Social Link"
      fields={fields}
      apiEndpoint="/api/social-links"
      backHref="/admin/social-links"
      onTransformSubmit={(data) => ({ ...data, orderIndex: 0 })}
    />
  );
}

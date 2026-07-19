"use client";

import { EntityForm } from "@/components/admin/EntityForm";

const fields = [
  { name: "name", label: "Name", required: true, placeholder: "AWS Solutions Architect" },
  { name: "issuer", label: "Issuer", required: true, placeholder: "Amazon Web Services" },
  { name: "issueDate", label: "Issue Date", type: "date" as const, required: true },
  { name: "expiryDate", label: "Expiry Date", type: "date" as const },
  { name: "credentialUrl", label: "Credential URL", placeholder: "https://..." },
  { name: "imageUrl", label: "Image URL", type: "image" as const },
  { name: "orderIndex", label: "Order Index", type: "number" as const },
];

export default function NewCertificatePage() {
  return (
    <EntityForm
      title="New Certificate"
      entityName="Certificate"
      fields={fields}
      apiEndpoint="/api/certificates"
      backHref="/admin/certificates"
      onTransformSubmit={(data) => ({
        ...data,
        issueDate: data.issueDate ? Math.floor(new Date(String(data.issueDate)).getTime() / 1000) : 0,
        expiryDate: data.expiryDate ? Math.floor(new Date(String(data.expiryDate)).getTime() / 1000) : null,
      })}
    />
  );
}

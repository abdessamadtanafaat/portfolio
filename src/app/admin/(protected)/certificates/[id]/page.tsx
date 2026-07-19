"use client";

import { useParams } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";

function toInputDate(ts: number | null) {
  if (!ts) return "";
  return new Date(ts * 1000).toISOString().split("T")[0];
}

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "issuer", label: "Issuer", required: true },
  { name: "issueDate", label: "Issue Date", type: "date" as const, required: true },
  { name: "expiryDate", label: "Expiry Date", type: "date" as const },
  { name: "credentialUrl", label: "Credential URL" },
  { name: "imageUrl", label: "Image URL", type: "image" as const },
  { name: "orderIndex", label: "Order Index", type: "number" as const },
];

export default function EditCertificatePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <EntityForm
      title="Edit Certificate"
      entityName="Certificate"
      fields={fields}
      apiEndpoint="/api/certificates"
      id={id}
      backHref="/admin/certificates"
      onTransformLoad={(data) => ({
        ...data,
        issueDate: toInputDate(data.issueDate as number),
        expiryDate: toInputDate(data.expiryDate as number | null),
      })}
      onTransformSubmit={(data) => ({
        ...data,
        issueDate: data.issueDate ? Math.floor(new Date(String(data.issueDate)).getTime() / 1000) : 0,
        expiryDate: data.expiryDate ? Math.floor(new Date(String(data.expiryDate)).getTime() / 1000) : null,
      })}
    />
  );
}

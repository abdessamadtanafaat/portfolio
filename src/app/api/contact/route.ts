import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.email("Format d'email invalide"),
  subject: z.string().min(5, "L'objet doit contenir au moins 5 caractères"),
  message: z.string().min(20, "Le message doit contenir au moins 20 caractères"),
});

function getSenderEmail(): string {
  if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;
  if (process.env.NODE_ENV === "production") {
    return "Portfolio Contact <noreply@at.com>";
  }
  return "Portfolio Contact <onboarding@resend.dev>";
}

/** Lazy: Resend throws if constructed without a key (breaks `next build` / Docker with no secrets). */
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstError?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    await db.insert(contactMessages).values({ name, email, subject, message }).run();

    const recipientEmail = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL;
    const resend = getResend();

    if (!resend) {
      console.warn("[Contact] RESEND_API_KEY not set — message saved to DB but email not sent");
      return NextResponse.json({ success: true, message: "Message enregistré (email non configuré)" });
    }

    if (!recipientEmail) {
      console.warn("[Contact] CONTACT_EMAIL not set — message saved to DB but email not sent");
      return NextResponse.json({ success: true, message: "Message enregistré (destinataire non configuré)" });
    }

    const sender = getSenderEmail();
    console.log("[Contact] Sending email:", { from: sender, to: recipientEmail, subject });

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: sender,
      to: recipientEmail,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 8px 0; font-size: 18px; color: #0f172a;">Nouveau message de contact</h2>
            <p style="margin: 0; color: #64748b; font-size: 14px;">Reçu le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 100px; vertical-align: top;">Nom</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Email</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Objet</td>
              <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 500;">${subject}</td>
            </tr>
          </table>
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Message</p>
            <p style="margin: 0; color: #0f172a; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">Ce message a été envoyé depuis le formulaire de contact de votre portfolio.</p>
          </div>
        </div>
      `,
    });

    if (emailError) {
      console.error("[Contact] Email send failed:", {
        name: emailError.name,
        message: emailError.message,
        statusCode: emailError.statusCode,
      });
      return NextResponse.json(
        { success: false, error: `Échec de l'envoi (${emailError.name}: ${emailError.message}). Veuillez réessayer ou me contacter directement par email.` },
        { status: 500 }
      );
    }

    console.log("[Contact] Email sent successfully:", { id: emailData?.id, to: recipientEmail });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

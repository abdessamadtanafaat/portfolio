import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getSeoSetting } from "@/lib/db/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

async function getHomeMetadata(): Promise<Metadata> {
  try {
    const seo = await getSeoSetting("/");
    if (seo) {
      return {
        title: seo.title || "Abdessamad Tanafaat | Ingénieur Full-Stack PHP/Drupal",
        description: seo.description || "Ingénieur Full-Stack spécialisé en PHP 8, Drupal 10/11, Laravel 12, Symfony 8 et React — Casablanca, Maroc.",
        openGraph: {
          title: seo.ogTitle || seo.title || undefined,
          description: seo.ogDescription || seo.description || undefined,
          images: seo.ogImageUrl ? [seo.ogImageUrl] : undefined,
        },
        twitter: {
          card: (seo.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
        },
      };
    }
  } catch {}
  return {
    title: "Abdessamad Tanafaat | Ingénieur Full-Stack PHP/Drupal",
    description: "Ingénieur Full-Stack spécialisé en PHP 8, Drupal 10/11, Laravel 12, Symfony 8 et React — Casablanca, Maroc.",
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return getHomeMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

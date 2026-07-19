"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import type { PersonalInfo, SocialLink, Technology, HomepageContent, NavItem } from "@/lib/queries/portfolio";

interface LayoutShellProps {
  children: React.ReactNode;
  personal: PersonalInfo | null;
  navItems: NavItem[];
  socialLinks: SocialLink[];
  technologies: Technology[];
  homepage: HomepageContent | null;
}

export function LayoutShell({ children, personal, navItems, socialLinks, technologies, homepage }: LayoutShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar name={personal?.name} navItems={navItems} />
      <main className="flex-1">{children}</main>
      <Footer personal={personal} socialLinks={socialLinks} technologies={technologies} homepage={homepage} navItems={navItems} />
    </>
  );
}

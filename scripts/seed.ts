import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });
import { db } from "../src/lib/db";
import {
  adminUser,
  personalInfo,
  projects,
  skills,
  experiences,
  education,
  certificates,
  socialLinks,
  siteSettings,
  homepageContent,
  differentiators,
  seoSettings,
  technologies,
  navItems,
  formFields,
  formSettings,
  customSections,
  customSectionItems,
  languages,
  volunteering,
  softSkills,
  projectTechnologies,
} from "../src/lib/db/schema";
import { hashPassword } from "../src/lib/password";
import { eq, and } from "drizzle-orm";

function ts(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

const LOCALES = ["en", "fr", "ar"] as const;

async function seed() {
  // Idempotent: if the site already has content, do not wipe CMS edits.
  const existing = await db.select({ id: personalInfo.id }).from(personalInfo).limit(1).all();
  if (existing.length > 0) {
    console.log("Database already seeded — skipping to preserve existing content.");
    return;
  }

  console.log("Clearing existing data...");
  await db.delete(projectTechnologies).run();
  await db.delete(socialLinks).run();
  await db.delete(certificates).run();
  await db.delete(education).run();
  await db.delete(experiences).run();
  await db.delete(skills).run();
  await db.delete(projects).run();
  await db.delete(differentiators).run();
  await db.delete(seoSettings).run();
  await db.delete(technologies).run();
  await db.delete(personalInfo).run();
  await db.delete(homepageContent).run();
  await db.delete(siteSettings).run();
  await db.delete(adminUser).run();
  await db.delete(navItems).run();
  await db.delete(formFields).run();
  await db.delete(formSettings).run();
  await db.delete(customSectionItems).run();
  await db.delete(customSections).run();
  await db.delete(languages).run();
  await db.delete(volunteering).run();
  await db.delete(softSkills).run();
  console.log("Existing data cleared");

  console.log("Seeding database...");
  const now = Math.floor(Date.now() / 1000);

  // ─── 1. Admin user (no locale) ─────────────────────────────────────────
  const passwordHash = await hashPassword("admin123");
  await db.insert(adminUser).values({
    email: "admin@portfolio.com",
    username: "admin",
    passwordHash,
    name: "Abdessamad Tanafaat",
    createdAt: now,
    updatedAt: now,
  }).run();
  console.log("Admin user created");

  // ─── 2. Personal Info (3 locales) ──────────────────────────────────────
  const personalInfoData: Record<string, { title: string; tagline: string; bio: string }> = {
    en: {
      title: "Full-Stack PHP/Drupal Engineer | Laravel | Symfony | React | CI/CD",
      tagline: "Full-Stack Engineer specialized in PHP 8, Drupal 10/11, Laravel 12, Symfony 8 and React — Casablanca, Morocco.",
      bio: "Full-Stack Engineer specialized in PHP 8, Drupal 10/11, Laravel 12, Symfony 8 and React, with contributions to the design, development and deployment of web platforms for several major accounts.",
    },
    fr: {
      title: "Ingénieur Full-Stack PHP/Drupal | Laravel | Symfony | React | CI/CD",
      tagline: "Ingénieur Full-Stack spécialisé en PHP 8, Drupal 10/11, Laravel 12, Symfony 8 et React — Casablanca, Maroc.",
      bio: "Ingénieur Full-Stack spécialisé en PHP 8, Drupal 10/11, Laravel 12, Symfony 8 et React, ayant contribué à la conception, au développement et à la mise en production de plateformes web pour plusieurs grands comptes.",
    },
    ar: {
      title: "مهندس Full-Stack PHP/Drupal | Laravel | Symfony | React | CI/CD",
      tagline: "مهندس Full-Stack متخصص في PHP 8 و Drupal 10/11 و Laravel 12 و Symfony 8 و React — الدار البيضاء، المغرب.",
      bio: "مهندس Full-Stack متخصص في PHP 8 و Drupal 10/11 و Laravel 12 و Symfony 8 و React، مع مساهمات في تصميم وتطوير ونشر منصات ويب لعدة عملاء كبار.",
    },
  };

  for (const locale of LOCALES) {
    const d = personalInfoData[locale];
    await db.insert(personalInfo).values({
      locale,
      name: "Abdessamad Tanafaat",
      title: d.title,
      tagline: d.tagline,
      bio: d.bio,
      location: "Casablanca, Maroc",
      email: "tanafaatabdessamad@gmail.com",
      phone: "+212 6 52 14 65 08",
      avatarUrl: null,
      resumeUrl: null,
      createdAt: now,
      updatedAt: now,
    }).run();
  }
  console.log("Personal info created (3 locales)");

  // ─── 3. Site Settings (3 locales) ──────────────────────────────────────
  const siteSettingsData: Record<string, string> = {
    en: "Our site is currently under maintenance. We will be back very soon. Thank you for your patience.",
    fr: "Notre site est actuellement en maintenance. Nous serons de retour très bientôt. Merci pour votre patience.",
    ar: "موقعنا حالياً تحت الصيانة. سنعود قريباً. شكراً لصبركم.",
  };

  for (const locale of LOCALES) {
    await db.insert(siteSettings).values({
      locale,
      siteName: "Abdessamad Tanafaat | Portfolio",
      faviconUrl: "/favicon.ico",
      defaultOgImageUrl: null,
      analyticsId: null,
      contactFormEndpoint: "/api/contact",
      maintenanceMode: false,
      maintenanceMessage: siteSettingsData[locale],
      createdAt: now,
      updatedAt: now,
    }).run();
  }
  console.log("Site settings created (3 locales)");

  // ─── 4. Homepage Content (3 locales) ───────────────────────────────────
  const sectionVisibility = JSON.stringify({
    hero: true, about: true, experience: true, projects: true,
    skills: true, languages: true, education: true, certificates: true,
    volunteering: true, softskills: true, contact: true,
  });
  const sectionOrder = JSON.stringify([
    "hero", "about", "experience", "projects", "skills",
    "languages", "education", "certificates", "volunteering", "softskills", "contact",
  ]);

  const aboutCardsEn = JSON.stringify([
    { icon: "Code", title: "Full-Stack Development", description: "End-to-end web application design and development: architecture, REST/GraphQL APIs, reactive frontend, CI/CD deployment.", color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30" },
    { icon: "Briefcase", title: "CMS & E-commerce Solutions", description: "Expertise in Drupal (7/8/9/10), complex migrations, multisite, headless. Custom e-commerce solutions and ERP/CRM integrations.", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { icon: "GraduationCap", title: "Cloud Architecture & DevOps", description: "Infrastructure as Code (Terraform), containerization (Docker/K8s), CI/CD (GitLab/GitHub Actions), monitoring, security.", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30" },
  ]);
  const aboutCardsFr = JSON.stringify([
    { icon: "Code", title: "Développement Full-Stack", description: "Conception et développement d'applications web de A à Z : architecture, API REST/GraphQL, frontend réactif, déploiement CI/CD.", color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30" },
    { icon: "Briefcase", title: "Solutions CMS & E-commerce", description: "Expertise Drupal (7/8/9/10), migrations complexes, multisite, headless. Solutions e-commerce sur mesure et intégrations ERP/CRM.", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { icon: "GraduationCap", title: "Architecture Cloud & DevOps", description: "Infrastructure as Code (Terraform), conteneurisation (Docker/K8s), CI/CD (GitLab/GitHub Actions), monitoring, sécurité.", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30" },
  ]);
  const aboutCardsAr = JSON.stringify([
    { icon: "Code", title: "تطوير Full-Stack", description: "تصميم وتطوير تطبيقات الويب من البداية إلى النهاية: البنية التحتية، واجهات برمجة التطبيقات REST/GraphQL، واجهة المستخدم التفاعلية، نشر CI/CD.", color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30" },
    { icon: "Briefcase", title: "حلول CMS والتجارة الإلكترونية", description: "خبرة في Drupal (7/8/9/10)، الترجمات المعقدة، المواقع المتعددة، الواجهة الأمامية المنفصلة. حلول تجارة إلكترونية مخصصة وتكاملات ERP/CRM.", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { icon: "GraduationCap", title: "بنية السحابة والDevOps", description: "بنية التحتية كشيفرة (Terraform)، الت_containرنة (Docker/K8s)، CI/CD (GitLab/GitHub Actions)، المراقبة، الأمان.", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30" },
  ]);

  const homepageData: Record<string, {
    heroHeadline: string; heroSubtext: string; heroBadgeText: string;
    heroCtaText: string; heroCtaUrl: string; heroCta2Text: string; heroCta2Url: string;
    heroCta3Text: string; heroCta3Url: string;
    aboutBadge: string; aboutTitle: string; aboutDescription: string; aboutCards: string;
    differentiatorsTitle: string; differentiatorsDescription: string;
    experienceBadge: string; experienceTitle: string; experienceDescription: string;
    projectsBadge: string; projectsTitle: string; projectsDescription: string; projectsCtaText: string;
    skillsBadge: string; skillsTitle: string; skillsDescription: string;
    educationBadge: string; educationTitle: string; educationDescription: string;
    certificatesBadge: string; certificatesTitle: string; certificatesDescription: string;
    languagesBadge: string; languagesTitle: string; languagesDescription: string;
    volunteeringBadge: string; volunteeringTitle: string; volunteeringDescription: string;
    softSkillsBadge: string; softSkillsTitle: string; softSkillsDescription: string;
    contactBadge: string; contactTitle: string; contactDescription: string; contactSuccessMessage: string;
    footerCopyright: string; footerDescription: string;
    footerNavTitle: string; footerContactTitle: string; footerTechTitle: string;
  }> = {
    en: {
      heroHeadline: "Abdessamad Tanafaat",
      heroSubtext: "Full-Stack Engineer specialized in PHP 8, Drupal 10/11, Laravel 12, Symfony 8 and React — Casablanca, Morocco.",
      heroBadgeText: "Full-Stack PHP/Drupal Engineer | Laravel | Symfony | React | CI/CD",
      heroCtaText: "Contact me",
      heroCtaUrl: "#contact",
      heroCta2Text: "View my projects",
      heroCta2Url: "/projects",
      heroCta3Text: "Download CV",
      heroCta3Url: "/cv.pdf",
      aboutBadge: "Profile",
      aboutTitle: "About me",
      aboutDescription: "Passionate Full-Stack Engineer with 5+ years of experience in designing, developing and deploying critical web applications for banking, media and public administration.",
      aboutCards: aboutCardsEn,
      differentiatorsTitle: "What sets me apart",
      differentiatorsDescription: "Cross-functional skills that make a difference in deliverable quality and reliability.",
      experienceBadge: "Experience",
      experienceTitle: "Professional background",
      experienceDescription: "5+ years of experience developing critical applications for banking, media and public administration.",
      projectsBadge: "Portfolio",
      projectsTitle: "Key projects",
      projectsDescription: "A selection of projects delivered to production, from prototype to industrialization.",
      projectsCtaText: "View all projects",
      skillsBadge: "Skills",
      skillsTitle: "Technical stack & Expertise",
      skillsDescription: "A cross-functional expertise covering the entire software development lifecycle.",
      educationBadge: "Education",
      educationTitle: "Education",
      educationDescription: "A solid academic background complemented by industry-recognized certifications.",
      certificatesBadge: "Certifications",
      certificatesTitle: "Certifications & Training",
      certificatesDescription: "Globally recognized certifications validating technical expertise across critical technologies.",
      languagesBadge: "Languages",
      languagesTitle: "Languages",
      languagesDescription: "Languages that enable me to work in an international environment.",
      volunteeringBadge: "Volunteering",
      volunteeringTitle: "Community & Volunteering",
      volunteeringDescription: "Community engagements that demonstrate my teamwork spirit and ability to contribute collectively.",
      softSkillsBadge: "Soft Skills & Hobbies",
      softSkillsTitle: "Interpersonal skills & Interests",
      softSkillsDescription: "The human skills that make the difference beyond technical expertise.",
      contactBadge: "Contact",
      contactTitle: "Let's work together",
      contactDescription: "Have a project in mind? A technical question? A collaboration opportunity? Feel free to reach out, I'll respond as soon as possible.",
      contactSuccessMessage: "Message sent successfully! I will respond as soon as possible.",
      footerCopyright: "All rights reserved.",
      footerDescription: "Full-Stack Engineer specialized in PHP 8, Drupal 10/11, Laravel 12, Symfony 8 and React — Casablanca, Morocco.",
      footerNavTitle: "Navigation",
      footerContactTitle: "Contact",
      footerTechTitle: "Technologies",
    },
    fr: {
      heroHeadline: "Abdessamad Tanafaat",
      heroSubtext: "Ingénieur Full-Stack spécialisé en PHP 8, Drupal 10/11, Laravel 12, Symfony 8 et React — Casablanca, Maroc.",
      heroBadgeText: "Ingénieur Full-Stack PHP/Drupal | Laravel | Symfony | React | CI/CD",
      heroCtaText: "Me contacter",
      heroCtaUrl: "#contact",
      heroCta2Text: "Voir mes projets",
      heroCta2Url: "/projects",
      heroCta3Text: "Télécharger CV",
      heroCta3Url: "/cv.pdf",
      aboutBadge: "Profil",
      aboutTitle: "A propos de moi",
      aboutDescription: "Ingénieur Full-Stack passionné avec 5+ années d'expérience dans la conception, le développement et le déploiement d'applications web critiques pour la banque, les médias et l'administration publique.",
      aboutCards: aboutCardsFr,
      differentiatorsTitle: "Ce qui me distingue",
      differentiatorsDescription: "Des compétences transversales qui font la différence dans la qualité et la fiabilité des livrables.",
      experienceBadge: "Expérience",
      experienceTitle: "Parcours professionnel",
      experienceDescription: "5+ années d'expérience dans le développement d'applications critiques pour la banque, les médias et l'administration publique.",
      projectsBadge: "Réalisations",
      projectsTitle: "Projets clés",
      projectsDescription: "Quelques projets livrés en production, du prototype à l'industrialisation.",
      projectsCtaText: "Voir tous les projets",
      skillsBadge: "Compétences",
      skillsTitle: "Stack technique & Expertise",
      skillsDescription: "Une expertise transversale couvrant tout le cycle de vie du développement logiciel.",
      educationBadge: "Formation",
      educationTitle: "Formation",
      educationDescription: "Un parcours académique solide complété par des certifications reconnues dans l'industrie.",
      certificatesBadge: "Certifications",
      certificatesTitle: "Certifications & Formations",
      certificatesDescription: "Des certifications reconnues mondialement validant l'expertise technique sur les technologies critiques.",
      languagesBadge: "Langues",
      languagesTitle: "Langues",
      languagesDescription: "Des langues qui me permettent de travailler dans un environnement international.",
      volunteeringBadge: "Bénévolat",
      volunteeringTitle: "Engagements & Bénévolat",
      volunteeringDescription: "Des engagements associatifs qui témoignent de mon esprit d'équipe et de ma capacité à contribuer collectivement.",
      softSkillsBadge: "Soft Skills & Hobbies",
      softSkillsTitle: "Savoir-être & Centres d'intérêt",
      softSkillsDescription: "Les compétences humaines qui font la différence au-delà de la technique.",
      contactBadge: "Contact",
      contactTitle: "Travaillons ensemble",
      contactDescription: "Vous avez un projet en tête ? Une question technique ? Une opportunité de collaboration ? N'hésitez pas à me contacter, je répondrai dans les plus brefs délais.",
      contactSuccessMessage: "Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.",
      footerCopyright: "Tous droits réservés.",
      footerDescription: "Ingénieur Full-Stack spécialisé en PHP 8, Drupal 10/11, Laravel 12, Symfony 8 et React — Casablanca, Maroc.",
      footerNavTitle: "Navigation",
      footerContactTitle: "Contact",
      footerTechTitle: "Technologies",
    },
    ar: {
      heroHeadline: "عبد الصمد تنافعات",
      heroSubtext: "مهندس Full-Stack متخصص في PHP 8 و Drupal 10/11 و Laravel 12 و Symfony 8 و React — الدار البيضاء، المغرب.",
      heroBadgeText: "مهندس Full-Stack PHP/Drupal | Laravel | Symfony | React | CI/CD",
      heroCtaText: "تواصل معي",
      heroCtaUrl: "#contact",
      heroCta2Text: "عرض مشاريعي",
      heroCta2Url: "/projects",
      heroCta3Text: "تحميل السيرة الذاتية",
      heroCta3Url: "/cv.pdf",
      aboutBadge: "الملف الشخصي",
      aboutTitle: "نبذة عني",
      aboutDescription: "مهندس Full-Stack شغوف بخبرة تزيد عن 5 سنوات في تصميم وتطوير ونشر تطبيقات الويب الحرجة للقطاع المصرفي والإعلامي والإدارة العامة.",
      aboutCards: aboutCardsAr,
      differentiatorsTitle: "ما يميزني",
      differentiatorsDescription: "مهارات متعددة التخصصات تحدث الفرق في جودة وموثوقية المخرجات.",
      experienceBadge: "الخبرة",
      experienceTitle: "المسيرة المهنية",
      experienceDescription: "أكثر من 5 سنوات من الخبرة في تطوير التطبيقات الحرجة للقطاع المصرفي والإعلامي والإدارة العامة.",
      projectsBadge: "المشاريع",
      projectsTitle: "المشاريع الرئيسية",
      projectsDescription: "مجموعة من المشاريع المُنجزة في بيئة الإنتاج، من النموذج الأولي إلى التصنيع.",
      projectsCtaText: "عرض جميع المشاريع",
      skillsBadge: "المهارات",
      skillsTitle: "المكدس التقني والخبرات",
      skillsDescription: "خبرة شاملة تغطي دورة حياة تطوير البرمجيات بالكامل.",
      educationBadge: "التعليم",
      educationTitle: "التعليم",
      educationDescription: "مسيرة أكاديمية قوية مكملة بشهادات معترف بها من قبل الصناعة.",
      certificatesBadge: "الشهادات",
      certificatesTitle: "الشهادات والتدريب",
      certificatesDescription: "شهادات معترف بها عالمياً تؤكد الخبرة التقنية في التقنيات الحيوية.",
      languagesBadge: "اللغات",
      languagesTitle: "اللغات",
      languagesDescription: "لغات تتيح لي العمل في بيئة دولية.",
      volunteeringBadge: "التطوع",
      volunteeringTitle: "المبادرات والتطوع",
      volunteeringDescription: "مشاركات تطوعية تشهد على روح الفريق والقدرة على المساهمة الجماعية.",
      softSkillsBadge: "المهارات الشخصية",
      softSkillsTitle: "المهارات الإنسانية والاهتمامات",
      softSkillsDescription: "المهارات الإنسانية التي تحدث الفرق وراء الخبرة التقنية.",
      contactBadge: "التواصل",
      contactTitle: "لنعمل معاً",
      contactDescription: "هل لديك مشروع في ذهنك؟ سؤال تقني؟ فرصة للتعاون؟ لا تتردد في التواصل معي، سأرد في أقرب وقت ممكن.",
      contactSuccessMessage: "تم إرسال الرسالة بنجاح! سأرد في أقرب وقت ممكن.",
      footerCopyright: "جميع الحقوق محفوظة.",
      footerDescription: "مهندس Full-Stack متخصص في PHP 8 و Drupal 10/11 و Laravel 12 و Symfony 8 و React — الدار البيضاء، المغرب.",
      footerNavTitle: "التنقل",
      footerContactTitle: "التواصل",
      footerTechTitle: "التقنيات",
    },
  };

  for (const locale of LOCALES) {
    const d = homepageData[locale];
    await db.insert(homepageContent).values({
      locale,
      heroHeadline: d.heroHeadline,
      heroSubtext: d.heroSubtext,
      heroBadgeText: d.heroBadgeText,
      heroCtaText: d.heroCtaText,
      heroCtaUrl: "#contact",
      heroCta2Text: d.heroCta2Text,
      heroCta2Url: null,
      heroCta3Text: d.heroCta3Text,
      heroCta3Url: "/cv.pdf",
      aboutBadge: d.aboutBadge,
      aboutTitle: d.aboutTitle,
      aboutDescription: d.aboutDescription,
      aboutCards: d.aboutCards,
      differentiatorsTitle: d.differentiatorsTitle,
      differentiatorsDescription: d.differentiatorsDescription,
      experienceBadge: d.experienceBadge,
      experienceTitle: d.experienceTitle,
      experienceDescription: d.experienceDescription,
      projectsBadge: d.projectsBadge,
      projectsTitle: d.projectsTitle,
      projectsDescription: d.projectsDescription,
      projectsCtaText: d.projectsCtaText,
      skillsBadge: d.skillsBadge,
      skillsTitle: d.skillsTitle,
      skillsDescription: d.skillsDescription,
      educationBadge: d.educationBadge,
      educationTitle: d.educationTitle,
      educationDescription: d.educationDescription,
      certificatesBadge: d.certificatesBadge,
      certificatesTitle: d.certificatesTitle,
      certificatesDescription: d.certificatesDescription,
      certificatesInProgress: JSON.stringify(["AWS Solutions Architect", "Terraform Associate", "React Advanced Patterns"]),
      languagesBadge: d.languagesBadge,
      languagesTitle: d.languagesTitle,
      languagesDescription: d.languagesDescription,
      volunteeringBadge: d.volunteeringBadge,
      volunteeringTitle: d.volunteeringTitle,
      volunteeringDescription: d.volunteeringDescription,
      softSkillsBadge: d.softSkillsBadge,
      softSkillsTitle: d.softSkillsTitle,
      softSkillsDescription: d.softSkillsDescription,
      contactBadge: d.contactBadge,
      contactTitle: d.contactTitle,
      contactDescription: d.contactDescription,
      contactSuccessMessage: d.contactSuccessMessage,
      footerCopyright: d.footerCopyright,
      footerDescription: d.footerDescription,
      footerNavTitle: d.footerNavTitle,
      footerContactTitle: d.footerContactTitle,
      footerTechTitle: d.footerTechTitle,
      sectionVisibility,
      sectionOrder,
      createdAt: now,
      updatedAt: now,
    }).run();
  }
  console.log("Homepage content created (3 locales)");

  // ─── 5. Differentiators (3 locales × 4 items) ──────────────────────────
  const differentiatorsData: Record<string, { title: string; description: string }[]> = {
    en: [
      { title: "Code Quality", description: "Clean code, automated tests, code reviews, design patterns, living documentation." },
      { title: "Security First", description: "OWASP, robust authentication, encryption, security audits, GDPR compliance." },
      { title: "Continuous Delivery", description: "Automated CI/CD, blue-green deployments, instant rollbacks, zero-downtime." },
      { title: "Mentoring & Knowledge Sharing", description: "Constructive code reviews, junior training, tech watch, documentation." },
    ],
    fr: [
      { title: "Code Quality", description: "Clean code, tests automatisés, revues de code, patterns de conception, documentation vivante." },
      { title: "Sécurité First", description: "OWASP, authentification robuste, chiffrement, audits de sécurité, conformité RGPD." },
      { title: "Livraison Continue", description: "CI/CD automatisé, déploiements blue-green, rollbacks instantanés, zero-downtime." },
      { title: "Mentorat & Partage", description: "Code reviews constructifs, formation des juniors, veille technologique, documentation." },
    ],
    ar: [
      { title: "جودة الكود", description: "كود نظيف، اختبارات آلية، مراجعات الكود، أنماط التصميم، توثيق حي." },
      { title: "الأمان أولاً", description: "OWASP، مصادقة قوية، تشفير، مراجعات أمان، امتثال GDPR." },
      { title: "التسليم المستمر", description: "CI/CD آلي، نشر أزرق-أخضر، تراجع فوري، صفر توقف." },
      { title: "الإرشاد ومشاركة المعرفة", description: "مراجعات بناءة للكود، تدريب المبتدئين، مراقبة التقنيات، التوثيق." },
    ],
  };

  const diffIcons = ["Code", "Shield", "Rocket", "Users"];
  const diffColors = ["brand", "emerald", "violet", "amber"];

  for (const locale of LOCALES) {
    await db.insert(differentiators).values(
      differentiatorsData[locale].map((d, i) => ({
        locale,
        title: d.title,
        description: d.description,
        icon: diffIcons[i],
        color: diffColors[i],
        orderIndex: i,
        createdAt: now,
      }))
    ).run();
  }
  console.log("Differentiators created (3 locales × 4)");

  // ─── 6. Technologies (no locale — universal) ────────────────────────────
  const techData = [
    { slug: "react", name: "React", category: "frontend" as const, primary: true },
    { slug: "typescript", name: "TypeScript", category: "frontend" as const, primary: true },
    { slug: "nextjs", name: "Next.js", category: "frontend" as const, primary: true },
    { slug: "nodejs", name: "Node.js", category: "backend" as const, primary: true },
    { slug: "php", name: "PHP", category: "backend" as const, primary: true },
    { slug: "laravel", name: "Laravel", category: "backend" as const, primary: true },
    { slug: "symfony", name: "Symfony", category: "backend" as const, primary: true },
    { slug: "drupal", name: "Drupal", category: "cms" as const, primary: true },
    { slug: "docker", name: "Docker", category: "devops" as const, primary: true },
    { slug: "kubernetes", name: "Kubernetes", category: "devops" as const, primary: true },
    { slug: "aws", name: "AWS", category: "devops" as const, primary: true },
    { slug: "terraform", name: "Terraform", category: "devops" as const, primary: false },
    { slug: "gitlab-ci", name: "GitLab CI/CD", category: "devops" as const, primary: true },
    { slug: "jenkins", name: "Jenkins", category: "devops" as const, primary: false },
    { slug: "mysql", name: "MySQL", category: "database" as const, primary: true },
    { slug: "postgresql", name: "PostgreSQL", category: "database" as const, primary: false },
    { slug: "angular", name: "Angular", category: "frontend" as const, primary: false },
    { slug: "tailwind", name: "Tailwind CSS", category: "frontend" as const, primary: false },
    { slug: "spring-boot-java", name: "Spring Boot / Java 21", category: "backend" as const, primary: true },
    { slug: "dotnet-core", name: ".NET Core / C#", category: "backend" as const, primary: false },
    { slug: "csharp", name: "C#", category: "backend" as const, primary: false },
    { slug: "unity", name: "Unity Engine", category: "backend" as const, primary: false },
    { slug: "android-studio", name: "Android Studio", category: "tools" as const, primary: false },
    { slug: "sqlite", name: "SQLite", category: "database" as const, primary: false },
    { slug: "sql-server", name: "SQL Server", category: "database" as const, primary: false },
  ].map((t) => ({ ...t, createdAt: now }));
  await db.insert(technologies).values(techData).run();
  console.log("Technologies created");

  // ─── 7. Projects (3 locales × 9 projects) ─────────────────────────────
  // Common fields (no translation needed)
  const projectCommon: Record<string, {
    category: "cms" | "fullstack" | "mobile" | "backend";
    status: "production";
    featured: boolean;
    startDate: string;
    endDate: string | null;
    repoUrl: string | null;
  }> = {
    "ugb-institutional-site": { category: "cms", status: "production", featured: true, startDate: "2025-02-01", endDate: "2025-06-30", repoUrl: null },
    "back-office-multi-tenant": { category: "fullstack", status: "production", featured: true, startDate: "2024-02-01", endDate: "2024-07-31", repoUrl: null },
    "hr-application": { category: "fullstack", status: "production", featured: true, startDate: "2023-07-01", endDate: "2023-08-31", repoUrl: null },
    "hse-serious-game": { category: "fullstack", status: "production", featured: false, startDate: "2024-07-01", endDate: "2024-08-31", repoUrl: null },
    "notify-messaging": { category: "fullstack", status: "production", featured: false, startDate: "2024-01-01", endDate: null, repoUrl: null },
    "edupresence": { category: "mobile", status: "production", featured: false, startDate: "2023-06-01", endDate: null, repoUrl: "https://github.com/abdessamadtanafaat/Attendance_Student_Management" },
    "fleet-manager": { category: "backend", status: "production", featured: false, startDate: "2023-06-01", endDate: null, repoUrl: "https://github.com/abdessamadtanafaat/fleetManagementSystem" },
    "e-learning-app": { category: "fullstack", status: "production", featured: false, startDate: "2023-06-01", endDate: null, repoUrl: "https://github.com/abdessamadtanafaat/E-Learning_App" },
    "pharmacy-pro": { category: "fullstack", status: "production", featured: false, startDate: "2023-06-01", endDate: null, repoUrl: "https://github.com/abdessamadtanafaat/pharmacy_management" },
  };

  const projectsTranslated: Record<string, Record<string, {
    title: string; subtitle: string; shortDescription: string; description: string;
  }>> = {
    "ugb-institutional-site": {
      en: { title: "UGB Institutional Website", subtitle: "Attijariwafa Bank Gabon", shortDescription: "Development of the institutional website for Attijariwafa Bank Gabon (UGB) in PHP 8, Drupal 10 and Twig. From zero to production in 5 months. Internship converted to permanent position.", description: "Development of the institutional website for Attijariwafa Bank Gabon (UGB) in PHP 8, Drupal 10 and Twig. From zero to production in 5 months. Internship converted to permanent position." },
      fr: { title: "Site institutionnel UGB", subtitle: "Attijariwafa Bank Gabon", shortDescription: "Développement du site institutionnel d'Attijariwafa Bank Gabon (UGB) en PHP 8, Drupal 10 et Twig. De zéro à la mise en production en 5 mois. Stage PFE converti en CDI.", description: "Développement du site institutionnel d'Attijariwafa Bank Gabon (UGB) en PHP 8, Drupal 10 et Twig. De zéro à la mise en production en 5 mois. Stage PFE converti en CDI." },
      ar: { title: "الموقع الرسمي لـ UGB", subtitle: "Attijariwafa Bank Gabon", shortDescription: "تطوير الموقع الرسمي لبنك أتيجاري وفا غابون (UGB) باستخدام PHP 8 و Drupal 10 و Twig. من الصفر إلى بيئة الإنتاج في 5 أشهر. تحوّل الت.stage إلى عقد دائم.", description: "تطوير الموقع الرسمي لبنك أتيجاري وفا غابون (UGB) باستخدام PHP 8 و Drupal 10 و Twig. من الصفر إلى بيئة الإنتاج في 5 أشهر. تحوّل التدريب إلى عقد دائم." },
    },
    "back-office-multi-tenant": {
      en: { title: "Multi-Tenant Back-Office", subtitle: "Major Media", shortDescription: "Design and development of a back-office managing 10+ client companies and 200+ satisfaction surveys. RBAC modules with 3+ role levels and analytical dashboards covering 10+ business KPIs.", description: "Design and development of a back-office managing 10+ client companies and 200+ satisfaction surveys. RBAC modules with 3+ role levels and analytical dashboards covering 10+ business KPIs." },
      fr: { title: "Back-office multi-tenant", subtitle: "Major Media", shortDescription: "Conception et développement d'un back-office gérant 10+ entreprises clientes et 200+ enquêtes de satisfaction. Modules RBAC avec 3+ niveaux de rôles et tableaux de bord analytiques couvrant 10+ KPIs métier.", description: "Conception et développement d'un back-office gérant 10+ entreprises clientes et 200+ enquêtes de satisfaction. Modules RBAC avec 3+ niveaux de rôles et tableaux de bord analytiques couvrant 10+ KPIs métier." },
      ar: { title: "نظام الإدارة الخلفي متعدد المستأجرین", subtitle: "Major Media", shortDescription: "تصميم وتطوير نظام إدارة خلفي يدير أكثر من 10 شركات عملاء وأكثر من 200 استبيان رضا. وحدات RBAC مع أكثر من 3 مستويات للأدوار ولوحات تحليلية تغطي أكثر من 10 مؤشرات أداء.", description: "تصميم وتطوير نظام إدارة خلفي يدير أكثر من 10 شركات عملاء وأكثر من 200 استبيان رضا. وحدات RBAC مع أكثر من 3 مستويات للأدوار ولوحات تحليلية تغطي أكثر من 10 مؤشرات أداء." },
    },
    "hr-application": {
      en: { title: "HR Application", subtitle: "ANCFCC", shortDescription: "Development and deployment of an HR application managing 1,000+ applications with RBAC authentication. Tracking module and statistical dashboards for HR management.", description: "Development and deployment of an HR application managing 1,000+ applications with RBAC authentication. Tracking module and statistical dashboards for HR management." },
      fr: { title: "Application RH", subtitle: "ANCFCC", shortDescription: "Développement et déploiement d'une application RH gérant 1 000+ candidatures avec authentification RBAC. Module de suivi des dossiers et tableaux de bord statistiques pour la direction RH.", description: "Développement et déploiement d'une application RH gérant 1 000+ candidatures avec authentification RBAC. Module de suivi des dossiers et tableaux de bord statistiques pour la direction RH." },
      ar: { title: "تطبيق الموارد البشرية", subtitle: "ANCFCC", shortDescription: "تطوير ونشر تطبيق موارد البشرية يدير أكثر من 1000 طلب مع مصادقة RBAC. وحدة تتبع الملفات ولوحات إحصائية لإدارة الموارد البشرية.", description: "تطوير ونشر تطبيق موارد البشرية يدير أكثر من 1000 طلب مع مصادقة RBAC. وحدة تتبع الملفات ولوحات إحصائية لإدارة الموارد البشرية." },
    },
    "hse-serious-game": {
      en: { title: "HSE Serious Game", subtitle: "TECHPAL", shortDescription: "Development of an HSE serious game in 2D/3D with multi-format Quiz module and interactive PPE selection. Game architecture design and technical specifications writing.", description: "Development of an HSE serious game in 2D/3D with multi-format Quiz module and interactive PPE selection. Game architecture design and technical specifications writing." },
      fr: { title: "Serious Game HSE", subtitle: "TECHPAL", shortDescription: "Développement d'un serious game HSE en 2D/3D avec module Quiz multiformats et sélection d'EPI interactifs. Conception de l'architecture du jeu et rédaction du cahier des charges technique.", description: "Développement d'un serious game HSE en 2D/3D avec module Quiz multiformats et sélection d'EPI interactifs. Conception de l'architecture du jeu et rédaction du cahier des charges technique." },
      ar: { title: "لعبة تعليمية HSE", subtitle: "TECHPAL", shortDescription: "تطوير لعبة تعليمية HSE بتنسيق 2D/3D مع وحدة اختبار متعددة التنسيقات وتحديد معدات الحماية الشخصية التفاعلية. تصميم بنية اللعبة وكتابة المواصفات التقنية.", description: "تطوير لعبة تعليمية HSE بتنسيق 2D/3D مع وحدة اختبار متعددة التنسيقات وتحديد معدات الحماية الشخصية التفاعلية. تصميم بنية اللعبة وكتابة المواصفات التقنية." },
    },
    "notify-messaging": {
      en: { title: "Notify-Messaging", subtitle: "Social Network App", shortDescription: "Development of a web messaging application for a social network. Full-stack architecture with .NET Core and React.js.", description: "Development of a web messaging application for a social network. Full-stack architecture with .NET Core and React.js." },
      fr: { title: "Notify-Messaging", subtitle: "Application Réseau Social", shortDescription: "Développement d'une application web de messagerie pour un réseau social. Architecture full-stack avec .NET Core et React.js.", description: "Développement d'une application web de messagerie pour un réseau social. Architecture full-stack avec .NET Core et React.js." },
      ar: { title: "Notify-Messaging", subtitle: "تطبيق شبكة اجتماعية", shortDescription: "تطوير تطبيق ويب للتراسل لشبكة اجتماعية. بنية متكاملة باستخدام .NET Core و React.js.", description: "تطوير تطبيق ويب للتراسل لشبكة اجتماعية. بنية متكاملة باستخدام .NET Core و React.js." },
    },
    "edupresence": {
      en: { title: "EduPresence", subtitle: "Attendance Management", shortDescription: "Mobile application for student attendance management.", description: "Development of a mobile application for student attendance management with SQLite and Android Studio." },
      fr: { title: "EduPresence", subtitle: "Gestion des Présences", shortDescription: "Application mobile de gestion des présences étudiantes.", description: "Développement d'une application mobile pour la gestion des présences étudiantes avec SQLite et Android Studio." },
      ar: { title: "EduPresence", subtitle: "إدارة الحضور", shortDescription: "تطبيق جوال لإدارة حضور الطلاب.", description: "تطوير تطبيق جوال لإدارة حضور الطلاب باستخدام SQLite و Android Studio." },
    },
    "fleet-manager": {
      en: { title: "FleetManager", subtitle: "Fleet Management", shortDescription: "Vehicle fleet management system with Spring Boot.", description: "Backend development of a vehicle fleet management system in collaboration with Ilyass Rouchdi. Spring Boot and Spring Security for authentication." },
      fr: { title: "FleetManager", subtitle: "Gestion de Flotte", shortDescription: "Système de gestion de flotte véhicules avec Spring Boot.", description: "Développement backend d'un système de gestion de flotte véhicules en collaboration avec Ilyass Rouchdi. Spring Boot et Spring Security pour l'authentification." },
      ar: { title: "FleetManager", subtitle: "إدارة الأسطول", shortDescription: "نظام لإدارة أسطول المركبات باستخدام Spring Boot.", description: "تطوير واجهة خلفية لنظام إدارة أسطول المركبات بالتعاون مع Ilyass Rouchdi. Spring Boot و Spring Security للمصادقة." },
    },
    "e-learning-app": {
      en: { title: "E-LearningApp", subtitle: "E-Learning Platform", shortDescription: "E-learning platform with quizzes and certificates.", description: "Creation of an e-learning platform with interactive quizzes and certificate system. Collaboration with Oussama Sfiri, Tarik Ait Lakhlift and Hafssa ElBoudribili." },
      fr: { title: "E-LearningApp", subtitle: "Plateforme E-Learning", shortDescription: "Plateforme e-learning avec quiz et certificats.", description: "Création d'une plateforme e-learning avec quiz interactifs et système de certificats. Collaboration avec Oussama Sfiri, Tarik Ait Lakhlift et Hafssa ElBoudribili." },
      ar: { title: "E-LearningApp", subtitle: "منصة التعلم الإلكتروني", shortDescription: "منصة تعلم إلكتروني مع اختبارات وشهادات.", description: "إنشاء منصة تعلم إلكتروني مع اختبارات تفاعلية ونظام شهادات. بالتعاون مع Oussama Sfiri و Tarik Ait Lakhlift و Hafssa ElBoudribili." },
    },
    "pharmacy-pro": {
      en: { title: "PharmacyPro", subtitle: "Pharmacy Management", shortDescription: "Web application for pharmacy management.", description: "Development of a web application for pharmacy management with Oussama Sfiri and Hafssa Elboudribili." },
      fr: { title: "PharmacyPro", subtitle: "Gestion Pharmacie", shortDescription: "Application web de gestion de pharmacie.", description: "Développement d'une application web de gestion de pharmacie avec Oussama Sfiri et Hafssa Elboudribili." },
      ar: { title: "PharmacyPro", subtitle: "إدارة الصيدلية", shortDescription: "تطبيق ويب لإدارة الصيدلية.", description: "تطوير تطبيق ويب لإدارة الصيدلية مع Oussama Sfiri و Hafssa Elboudribili." },
    },
  };

  const projectSlugs = Object.keys(projectCommon);

  // Insert all projects for all locales
  for (const locale of LOCALES) {
    for (let i = 0; i < projectSlugs.length; i++) {
      const slug = projectSlugs[i];
      const common = projectCommon[slug];
      const translated = projectsTranslated[slug][locale];
      await db.insert(projects).values({
        slug,
        locale,
        title: translated.title,
        subtitle: translated.subtitle,
        shortDescription: translated.shortDescription,
        description: translated.description,
        coverImageUrl: null,
        category: common.category,
        status: common.status,
        featured: common.featured,
        demoUrl: null,
        repoUrl: common.repoUrl,
        caseStudyUrl: null,
        startDate: ts(common.startDate),
        endDate: common.endDate ? ts(common.endDate) : null,
        orderIndex: i,
        createdAt: now,
        updatedAt: now,
      }).run();
    }
  }
  console.log("Projects created (3 locales × 9)");

  // ─── 7b. Project Technologies (link to ALL locale variants) ────────────
  const projectTechMap: Record<string, string[]> = {
    "ugb-institutional-site": ["php", "drupal", "docker", "gitlab-ci", "mysql"],
    "back-office-multi-tenant": ["react", "spring-boot-java", "docker", "mysql", "tailwind"],
    "hr-application": ["angular", "dotnet-core", "docker", "sql-server"],
    "hse-serious-game": ["csharp", "unity"],
    "notify-messaging": ["dotnet-core", "react"],
    "edupresence": ["android-studio", "sqlite"],
    "fleet-manager": ["spring-boot-java"],
    "e-learning-app": ["php", "react"],
    "pharmacy-pro": ["php", "react"],
  };

  // Query all technologies to get IDs
  const allTechs = await db.select().from(technologies).all();
  const techIdBySlug: Record<string, number> = {};
  for (const t of allTechs) {
    techIdBySlug[t.slug] = t.id;
  }

  // Insert project_technologies for every locale variant of each project
  const ptEntries: { projectId: number; technologyId: number }[] = [];
  for (const slug of projectSlugs) {
    const techSlugs = projectTechMap[slug] || [];
    // Find all project rows for this slug (all locales)
    const projectRows = await db.select({ id: projects.id, locale: projects.locale })
      .from(projects)
      .where(eq(projects.slug, slug))
      .all();
    for (const proj of projectRows) {
      for (const techSlug of techSlugs) {
        const techId = techIdBySlug[techSlug];
        if (techId) {
          ptEntries.push({ projectId: proj.id, technologyId: techId });
        }
      }
    }
  }
  if (ptEntries.length > 0) {
    await db.insert(projectTechnologies).values(ptEntries).run();
  }
  console.log(`Project technologies linked (${ptEntries.length} entries)`);

  // ─── 8. Skills (no locale — universal) ──────────────────────────────────
  const skillData = [
    { name: "React / Next.js", category: "frontend" as const, proficiency: 5, orderIndex: 0 },
    { name: "TypeScript / JavaScript", category: "frontend" as const, proficiency: 5, orderIndex: 1 },
    { name: "Angular", category: "frontend" as const, proficiency: 4, orderIndex: 2 },
    { name: "Tailwind CSS", category: "frontend" as const, proficiency: 5, orderIndex: 3 },
    { name: "Twig", category: "frontend" as const, proficiency: 4, orderIndex: 4 },
    { name: "PHP 8", category: "backend" as const, proficiency: 5, orderIndex: 0 },
    { name: "Laravel 12", category: "backend" as const, proficiency: 5, orderIndex: 1 },
    { name: "Symfony 8", category: "backend" as const, proficiency: 5, orderIndex: 2 },
    { name: ".NET Core / C#", category: "backend" as const, proficiency: 4, orderIndex: 3 },
    { name: "Spring Boot / Java 21", category: "backend" as const, proficiency: 4, orderIndex: 4 },
    { name: "REST APIs", category: "backend" as const, proficiency: 5, orderIndex: 5 },
    { name: "Drupal 10/11", category: "cms" as const, proficiency: 5, orderIndex: 0 },
    { name: "Drupal Custom Modules", category: "cms" as const, proficiency: 5, orderIndex: 1 },
    { name: "Headless CMS / Decoupled Architecture", category: "cms" as const, proficiency: 5, orderIndex: 2 },
    { name: "Drupal Services", category: "cms" as const, proficiency: 4, orderIndex: 3 },
    { name: "Docker", category: "devops" as const, proficiency: 5, orderIndex: 0 },
    { name: "GitLab CI/CD", category: "devops" as const, proficiency: 5, orderIndex: 1 },
    { name: "Jenkins", category: "devops" as const, proficiency: 4, orderIndex: 2 },
    { name: "OpenShift", category: "devops" as const, proficiency: 4, orderIndex: 3 },
    { name: "Kubernetes", category: "devops" as const, proficiency: 4, orderIndex: 4 },
    { name: "Linux / Git", category: "devops" as const, proficiency: 5, orderIndex: 5 },
    { name: "MySQL", category: "database" as const, proficiency: 5, orderIndex: 0 },
    { name: "PostgreSQL", category: "database" as const, proficiency: 4, orderIndex: 1 },
    { name: "Oracle", category: "database" as const, proficiency: 3, orderIndex: 2 },
    { name: "SQL Server", category: "database" as const, proficiency: 4, orderIndex: 3 },
    { name: "SQLite", category: "database" as const, proficiency: 4, orderIndex: 4 },
    { name: "Redis", category: "database" as const, proficiency: 3, orderIndex: 5 },
    { name: "Agile / Scrum", category: "tools" as const, proficiency: 5, orderIndex: 0 },
    { name: "Code Review", category: "tools" as const, proficiency: 5, orderIndex: 1 },
    { name: "System Design", category: "tools" as const, proficiency: 4, orderIndex: 2 },
    { name: "Composer", category: "tools" as const, proficiency: 5, orderIndex: 3 },
    { name: "Git / GitFlow", category: "tools" as const, proficiency: 5, orderIndex: 4 },
    { name: "PHPUnit", category: "testing" as const, proficiency: 5, orderIndex: 0 },
    { name: "SonarQube", category: "testing" as const, proficiency: 4, orderIndex: 1 },
  ].map((s) => ({ ...s, createdAt: now }));
  await db.insert(skills).values(skillData).run();
  console.log("Skills created");

  // ─── 9. Experiences (3 locales × 5 entries) ────────────────────────────
  const experiencesData: Record<string, Record<string, {
    role: string; description: string; highlights: string[];
  }>> = {
    "VOID-CDI": {
      en: {
        role: "Full Stack Engineer - Permanent",
        description: "Development of Drupal 10/11, Laravel 12 and Symfony 8 platforms for 6 major client accounts.",
        highlights: [
          "Design of 15+ custom Drupal modules and REST API integrations, reducing delivery times by 20%",
          "Setup of 3+ CI/CD pipelines (GitLab CI, Jenkins) automating deployments on Docker/Kubernetes/OpenShift",
          "Agile/SCRUM coordination across 6 client projects with bi-weekly sprints",
        ],
      },
      fr: {
        role: "Ingénieur Full Stack - CDI",
        description: "Développement de plateformes Drupal 10/11, Laravel 12 et Symfony 8 pour 6 clients grands comptes.",
        highlights: [
          "Conception de 15+ modules Drupal custom et intégration d'APIs REST, réduisant les délais de livraison de 20%",
          "Mise en place de 3+ pipelines CI/CD (GitLab CI, Jenkins) automatisant les déploiements sur Docker/Kubernetes/OpenShift",
          "Coordination Agile/SCRUM sur 6 projets clients avec sprints bi-hebdomadaires",
        ],
      },
      ar: {
        role: "مهندس Full Stack - عقد دائم",
        description: "تطوير منصات Drupal 10/11 و Laravel 12 و Symfony 8 لـ 6 عملاء كبار.",
        highlights: [
          "تصميم أكثر من 15 وحدة Drupal مخصصة وتكاملات REST API، مما قلل أوقات التسليم بنسبة 20%",
          "إعداد أكثر من 3 خطوط CI/CD (GitLab CI، Jenkins) لأتمتة النشر على Docker/Kubernetes/OpenShift",
          "تنسيق Agile/SCRUM على 6 مشاريع عملاء مع سبرنتات نصف أسبوعية",
        ],
      },
    },
    "VOID-PFE": {
      en: {
        role: "Full Stack Engineer - Internship (Converted to Permanent)",
        description: "End-of-study internship converted to permanent position after 5 months. Development of the UGB institutional website in PHP 8 / Drupal 10 / Twig.",
        highlights: [
          "Internship converted to permanent position after 5 months following successful delivery of the institutional website",
          "Implementation of 40+ automated PHPUnit tests, bringing code coverage to 80%",
          "Dockerization of the production environment, reducing configuration time from 2h to 10 min",
        ],
      },
      fr: {
        role: "Ingénieur Full Stack - PFE (Stage converti en CDI)",
        description: "Stage PFE converti en CDI après 5 mois. Développement du site institutionnel UGB en PHP 8 / Drupal 10 / Twig.",
        highlights: [
          "Stage converti en CDI après 5 mois, suite à la livraison réussie du site institutionnel",
          "Mise en œuvre de 40+ tests automatisés PHPUnit, portant la couverture de code à 80%",
          "Dockerisation de l'environnement de production, réduisant le temps de configuration de 2h à 10 min",
        ],
      },
      ar: {
        role: "مهندس Full Stack - تدريب (تحويل إلى عقد دائم)",
        description: "تدريب نهاية الدراسة تحول إلى عقد دائم بعد 5 أشهر. تطوير الموقع الرسمي لـ UGB باستخدام PHP 8 / Drupal 10 / Twig.",
        highlights: [
          "تحويل التدريب إلى عقد دائم بعد 5 أشهر من التسليم الناجح للموقع الرسمي",
          "تنفيذ أكثر من 40 اختباراً آلياً باستخدام PHPUnit، مما رفع تغطية الكود إلى 80%",
          "حاوية بيئة الإنتاج، مما قلل وقت التكويد من ساعتين إلى 10 دقائق",
        ],
      },
    },
    "TECHPAL": {
      en: {
        role: "Intern - C#/Unity Developer",
        description: "Development of an HSE serious game in 2D/3D: multi-format Quiz module and interactive PPE selection.",
        highlights: [
          "Development of an HSE serious game in 2D/3D with multi-format Quiz module",
          "Game architecture design and technical specifications writing",
        ],
      },
      fr: {
        role: "Stagiaire - Développeur C#/Unity",
        description: "Développement d'un serious game HSE en 2D/3D : module Quiz multiformats et sélection d'EPI interactifs.",
        highlights: [
          "Développement d'un serious game HSE en 2D/3D avec module Quiz multiformats",
          "Conception de l'architecture du jeu et rédaction du cahier des charges technique",
        ],
      },
      ar: {
        role: "متدرب - مطور C#/Unity",
        description: "تطوير لعبة تعليمية HSE بتنسيق 2D/3D: وحدة اختبار متعددة التنسيقات وتحديد معدات الحماية التفاعلية.",
        highlights: [
          "تطوير لعبة تعليمية HSE بتنسيق 2D/3D مع وحدة اختبار متعددة التنسيقات",
          "تصميم بنية اللعبة وكتابة المواصفات التقنية",
        ],
      },
    },
    "Major-Media": {
      en: {
        role: "PFA Intern - Full-Stack Developer",
        description: "Design and development of a multi-tenant back-office managing 10+ client companies and 200+ satisfaction surveys.",
        highlights: [
          "RBAC modules with 3+ role levels and analytical dashboards covering 10+ business KPIs",
          "Containerized deployment via Docker, reducing production deployment time from 1 day to a few minutes",
        ],
      },
      fr: {
        role: "Stagiaire PFA - Développeur Full-Stack",
        description: "Conception et développement d'un back-office multi-tenant gérant 10+ entreprises clientes et 200+ enquêtes de satisfaction.",
        highlights: [
          "Modules RBAC avec 3+ niveaux de rôles et tableaux de bord analytiques couvrant 10+ KPIs métier",
          "Déploiement conteneurisé via Docker, réduisant le temps de mise en production de 1 jour à quelques minutes",
        ],
      },
      ar: {
        role: "متدرب PFA - مطور Full-Stack",
        description: "تصميم وتطوير نظام إدارة خلفي متعدد المستأجرین يدير أكثر من 10 شركات عملاء وأكثر من 200 استبيان رضا.",
        highlights: [
          "وحدات RBAC مع أكثر من 3 مستويات للأدوار ولوحات تحليلية تغطي أكثر من 10 مؤشرات أداء",
          "نشر محاكي عبر Docker، مما قلل وقت النشر من يوم إلى بضع دقائق",
        ],
      },
    },
    "ANCFCC": {
      en: {
        role: "Intern - Full-Stack Developer",
        description: "Development and deployment of an HR application managing 1,000+ applications with RBAC authentication.",
        highlights: [
          "Tracking module and statistical dashboards for HR management",
          "Application delivered in 2 months with Angular, .NET Core, C#, SQL Server and Docker",
        ],
      },
      fr: {
        role: "Stagiaire - Développeur Full-Stack",
        description: "Développement et déploiement d'une application RH gérant 1 000+ candidatures avec authentification RBAC.",
        highlights: [
          "Module de suivi des dossiers et tableaux de bord statistiques pour la direction RH",
          "Application livrée en 2 mois avec Angular, .NET Core, C#, SQL Server et Docker",
        ],
      },
      ar: {
        role: "متدرب - مطور Full-Stack",
        description: "تطوير ونشر تطبيق موارد البشرية يدير أكثر من 1000 طلب مع مصادقة RBAC.",
        highlights: [
          "وحدة تتبع الملفات ولوحات إحصائية لإدارة الموارد البشرية",
          "تسليم التطبيق في شهرين باستخدام Angular و .NET Core و C# و SQL Server و Docker",
        ],
      },
    },
  };

  const experienceMeta: {
    company: string; location: string; startDate: string; endDate: string | null; current: boolean;
  }[] = [
    { company: "VOID", location: "Casablanca, Maroc", startDate: "2025-06-01", endDate: null, current: true },
    { company: "VOID", location: "Casablanca, Maroc", startDate: "2025-02-01", endDate: "2025-06-30", current: false },
    { company: "TECHPAL", location: "Casablanca, Maroc", startDate: "2024-07-01", endDate: "2024-08-31", current: false },
    { company: "Major Media", location: "Agadir, Maroc", startDate: "2024-02-01", endDate: "2024-07-31", current: false },
    { company: "ANCFCC", location: "Rabat, Maroc", startDate: "2023-07-01", endDate: "2023-08-31", current: false },
  ];

  const experienceTech: string[] = [
    JSON.stringify(["PHP 8", "Drupal 10/11", "Laravel 12", "Symfony 8", "Next.js 16", "React 19", "Docker", "GitLab CI/CD", "Jenkins", "Kubernetes", "OpenShift"]),
    JSON.stringify(["PHP 8", "Drupal 10/11", "Twig", "Docker", "GitLab CI/CD", "MySQL", "PHPUnit"]),
    JSON.stringify(["C#", "Unity Engine"]),
    JSON.stringify(["React v17", "Spring Boot", "Spring Security", "Java 21", "MySQL", "Tailwind CSS", "Docker"]),
    JSON.stringify(["Angular", ".NET Core", "C#", "SQL Server", "Docker"]),
  ];

  const experienceKeys = ["VOID-CDI", "VOID-PFE", "TECHPAL", "Major-Media", "ANCFCC"];

  for (const locale of LOCALES) {
    await db.insert(experiences).values(
      experienceMeta.map((meta, i) => {
        const key = experienceKeys[i];
        const t = experiencesData[key][locale];
        return {
          locale,
          company: meta.company,
          role: t.role,
          location: meta.location,
          startDate: ts(meta.startDate),
          endDate: meta.endDate ? ts(meta.endDate) : null,
          current: meta.current,
          description: t.description,
          highlights: JSON.stringify(t.highlights),
          technologies: experienceTech[i],
          orderIndex: i,
          createdAt: now,
          updatedAt: now,
        };
      })
    ).run();
  }
  console.log("Experiences created (3 locales × 5)");

  // ─── 10. Education (3 locales × 2 entries) ─────────────────────────────
  const educationData: Record<string, Record<string, {
    institution: string; degree: string; field: string; honors: string;
  }>> = {
    "ENSA": {
      en: { institution: "École Nationale des Sciences Appliquées d'Agadir (ENSA Agadir)", degree: "State Engineer Diploma in Computer Engineering", field: "Computer Engineering", honors: "With Distinction" },
      fr: { institution: "École Nationale des Sciences Appliquées d'Agadir (ENSA Agadir)", degree: "Diplôme d'Ingénieur d'État en Génie Informatique", field: "Génie Informatique", honors: "Mention Bien" },
      ar: { institution: "المدرسة الوطنية للعلوم التطبيقية أكادير (ENSA Agadir)", degree: "دبلوم مهندس دولة في هندسة المعلوماتية", field: "هندسة المعلوماتية", honors: "بشرف" },
    },
    "Lycee": {
      en: { institution: "Lycée Mohamed V Guelmim", degree: "Baccalauréat in Physical Sciences", field: "Physical Sciences", honors: "With Distinction" },
      fr: { institution: "Lycée Mohamed V Guelmim", degree: "Baccalauréat Sciences Physiques", field: "Sciences Physiques", honors: "Mention Bien" },
      ar: { institution: "ثانوية محمد الخامس كلميم", degree: "بكالوريا في العلوم الفيزيائية", field: "العلوم الفيزيائية", honors: "بشرف" },
    },
  };

  const educationMeta: { startDate: string; endDate: string }[] = [
    { startDate: "2020-09-01", endDate: "2025-06-30" },
    { startDate: "2018-11-01", endDate: "2020-07-31" },
  ];

  const educationKeys = ["ENSA", "Lycee"];

  for (const locale of LOCALES) {
    await db.insert(education).values(
      educationMeta.map((meta, i) => {
        const key = educationKeys[i];
        const t = educationData[key][locale];
        const isLycee = key === "Lycee";
        return {
          locale,
          institution: t.institution,
          degree: t.degree,
          field: t.field,
          location: isLycee ? "Guelmim, Maroc" : "Agadir, Maroc",
          startDate: ts(meta.startDate),
          endDate: ts(meta.endDate),
          honors: t.honors,
          orderIndex: i,
          createdAt: now,
        };
      })
    ).run();
  }
  console.log("Education created (3 locales × 2)");

  // ─── 11. Certificates (no locale — universal) ──────────────────────────
  await db.insert(certificates).values([
    { name: "MySQL Database Training", issuer: "LinkedIn Learning", issueDate: ts("2023-01-01"), expiryDate: null, credentialUrl: null, orderIndex: 0, createdAt: now },
    { name: "Basic Coding in JavaScript", issuer: "LinkedIn Learning", issueDate: ts("2023-01-01"), expiryDate: null, credentialUrl: null, orderIndex: 1, createdAt: now },
    { name: "Bootcamp Développeur Web FrontEnd : HTML, CSS, JS et React", issuer: "OpenClassrooms", issueDate: ts("2023-06-01"), expiryDate: null, credentialUrl: null, orderIndex: 2, createdAt: now },
    { name: "CSS : Tailwind Framework", issuer: "OpenClassrooms", issueDate: ts("2023-06-01"), expiryDate: null, credentialUrl: null, orderIndex: 3, createdAt: now },
    { name: "Project Development Using JAVA for Beginners", issuer: "Udemy", issueDate: ts("2023-01-01"), expiryDate: null, credentialUrl: null, orderIndex: 4, createdAt: now },
  ]).run();
  console.log("Certificates created");

  // ─── 12. Languages (3 locales × 3 entries) ─────────────────────────────
  const languagesData: Record<string, { name: string; level: string }[]> = {
    en: [
      { name: "French", level: "Native" },
      { name: "Arabic", level: "Native" },
      { name: "English", level: "Fluent" },
    ],
    fr: [
      { name: "Français", level: "Natif" },
      { name: "Arabe", level: "Natif" },
      { name: "Anglais", level: "Courant" },
    ],
    ar: [
      { name: "الفرنسية", level: "اللغة الأم" },
      { name: "العربية", level: "اللغة الأم" },
      { name: "الإنجليزية", level: "طلاقة" },
    ],
  };

  for (const locale of LOCALES) {
    await db.insert(languages).values(
      languagesData[locale].map((l, i) => ({
        locale,
        name: l.name,
        level: l.level,
        proficiency: i < 2 ? 95 : 85,
        orderIndex: i,
        createdAt: now,
      }))
    ).run();
  }
  console.log("Languages created (3 locales × 3)");

  // ─── 13. Volunteering (3 locales × 6 entries) ──────────────────────────
  const volunteeringData: Record<string, {
    role: string; organization: string; description: string; icon: string; color: string;
  }[]> = {
    en: [
      { role: "Graphic Designer & Social Media Manager", organization: "Club Social ENSA Agadir", description: "Content creation (posters, videos, reels) and social media management.", icon: "Palette", color: "violet" },
      { role: "Organizing Committee Member", organization: "Sports Club ENSA Agadir", description: "Organizing committee member for the ENSA Agadir Internal Olympiad (OLIN), editions 1 and 2.", icon: "Trophy", color: "amber" },
      { role: "Organizing Committee Member", organization: "ADE ENSA Agadir", description: "Organizing committee member for the 2022 graduation ceremony. Responsible for graphic design.", icon: "GraduationCap", color: "emerald" },
      { role: "Treasurer", organization: "AppsClub ENSA Agadir", description: "Budget management, organization of tech events and dev workshops.", icon: "Wallet", color: "brand" },
      { role: "Graphic Designer & Social Media Manager", organization: "Club Oxygen", description: "Content creation (posters, videos, reels) and social media management.", icon: "Paintbrush", color: "rose" },
      { role: "Graphic Designer", organization: "Fonty Media", description: "Visual content creation · Photoshop · Illustrator · Premiere Pro.", icon: "Image", color: "blue" },
    ],
    fr: [
      { role: "Designer Graphique & Social Media Manager", organization: "Club Social ENSA Agadir", description: "Création de contenus (affiches, vidéos, reels) et gestion des réseaux sociaux.", icon: "Palette", color: "violet" },
      { role: "Membre du comité organisateur", organization: "Club Sportif ENSA Agadir", description: "Membre du comité organisateur pour l'Olympiade Interne de l'ENSA Agadir (OLIN), éditions 1 et 2.", icon: "Trophy", color: "amber" },
      { role: "Membre du comité organisateur", organization: "ADE ENSA Agadir", description: "Membre du comité organisateur de la cérémonie de remise des diplômes 2022. Chargé du design graphique.", icon: "GraduationCap", color: "emerald" },
      { role: "Trésorier", organization: "AppsClub ENSA Agadir", description: "Gestion budgétaire, organisation d'événements tech et ateliers dev.", icon: "Wallet", color: "brand" },
      { role: "Designer Graphique & Social Media Manager", organization: "Club Oxygen", description: "Création de contenus (affiches, vidéos, reels) et gestion des réseaux sociaux.", icon: "Paintbrush", color: "rose" },
      { role: "Designer Graphique", organization: "Fonty Media", description: "Création de contenus visuels · Photoshop · Illustrator · Premiere Pro.", icon: "Image", color: "blue" },
    ],
    ar: [
      { role: "مصمم جرافيك ومدير وسائل التواصل الاجتماعي", organization: "النادي الاجتماعي ENSA Agadir", description: "إنشاء المحتوى (ملصقات، فيديوهات، reels) وإدارة وسائل التواصل الاجتماعي.", icon: "Palette", color: "violet" },
      { role: "عضو في اللجنة التنظيمية", organization: "النادي الرياضي ENSA Agadir", description: "عضو في اللجنة التنظيمية للأولمبياد الداخلي لـ ENSA Agadir (OLIN)، الإصداران 1 و 2.", icon: "Trophy", color: "amber" },
      { role: "عضو في اللجنة التنظيمية", organization: "ADE ENSA Agadir", description: "عضو في اللجنة التنظيمية لحفل التخرج 2022. مسؤول عن التصميم الجرافيك.", icon: "GraduationCap", color: "emerald" },
      { role: "أمين الصندوق", organization: "AppsClub ENSA Agadir", description: "إدارة الميزانية، تنظيم الفعاليات التقنية وورشات التطوير.", icon: "Wallet", color: "brand" },
      { role: "مصمم جرافيك ومدير وسائل التواصل الاجتماعي", organization: "نادي Oxygen", description: "إنشاء المحتوى (ملصقات، فيديوهات، reels) وإدارة وسائل التواصل الاجتماعي.", icon: "Paintbrush", color: "rose" },
      { role: "مصمم جرافيك", organization: "Fonty Media", description: "إنشاء المحتوى البصري · Photoshop · Illustrator · Premiere Pro.", icon: "Image", color: "blue" },
    ],
  };

  const volunteeringMeta: { startDate: string; endDate: string | null }[] = [
    { startDate: "2022-10-01", endDate: "2023-09-01" },
    { startDate: "2021-10-01", endDate: "2022-09-01" },
    { startDate: "2022-07-01", endDate: null },
    { startDate: "2023-10-01", endDate: "2024-03-01" },
    { startDate: "2021-10-01", endDate: "2023-09-01" },
    { startDate: "2023-10-01", endDate: "2023-12-01" },
  ];

  for (const locale of LOCALES) {
    await db.insert(volunteering).values(
      volunteeringData[locale].map((v, i) => {
        const meta = volunteeringMeta[i];
        return {
          locale,
          role: v.role,
          organization: v.organization,
          startDate: ts(meta.startDate),
          endDate: meta.endDate ? ts(meta.endDate) : null,
          description: v.description,
          icon: v.icon,
          color: v.color,
          orderIndex: i,
          createdAt: now,
        };
      })
    ).run();
  }
  console.log("Volunteering created (3 locales × 6)");

  // ─── 14. Soft Skills (3 locales × 9 entries) ───────────────────────────
  const softSkillsData: Record<string, { name: string; category: string }[]> = {
    en: [
      { name: "Leadership", category: "soft_skill" },
      { name: "Communication", category: "soft_skill" },
      { name: "Teamwork", category: "soft_skill" },
      { name: "Problem Solving", category: "soft_skill" },
      { name: "Adaptability", category: "soft_skill" },
      { name: "Creativity", category: "soft_skill" },
      { name: "Graphic Design", category: "hobby" },
      { name: "Travel", category: "hobby" },
      { name: "Sports", category: "hobby" },
    ],
    fr: [
      { name: "Leadership", category: "soft_skill" },
      { name: "Communication", category: "soft_skill" },
      { name: "Travail d'équipe", category: "soft_skill" },
      { name: "Résolution de problèmes", category: "soft_skill" },
      { name: "Adaptabilité", category: "soft_skill" },
      { name: "Créativité", category: "soft_skill" },
      { name: "Design Graphique", category: "hobby" },
      { name: "Voyage", category: "hobby" },
      { name: "Sport", category: "hobby" },
    ],
    ar: [
      { name: "القيادة", category: "soft_skill" },
      { name: "التواصل", category: "soft_skill" },
      { name: "العمل الجماعي", category: "soft_skill" },
      { name: "حل المشكلات", category: "soft_skill" },
      { name: "التكيف", category: "soft_skill" },
      { name: "الإبداع", category: "soft_skill" },
      { name: "التصميم الجرافيك", category: "hobby" },
      { name: "السفر", category: "hobby" },
      { name: "الرياضة", category: "hobby" },
    ],
  };

  const softSkillMeta: { icon: string; color: string }[] = [
    { icon: "Users", color: "brand" },
    { icon: "MessageCircle", color: "emerald" },
    { icon: "Users", color: "blue" },
    { icon: "Lightbulb", color: "amber" },
    { icon: "Zap", color: "violet" },
    { icon: "Palette", color: "rose" },
    { icon: "Palette", color: "pink" },
    { icon: "Globe", color: "blue" },
    { icon: "Dumbbell", color: "emerald" },
  ];

  for (const locale of LOCALES) {
    await db.insert(softSkills).values(
      softSkillsData[locale].map((s, i) => ({
        locale,
        name: s.name,
        category: s.category,
        icon: softSkillMeta[i].icon,
        color: softSkillMeta[i].color,
        orderIndex: i,
        createdAt: now,
      }))
    ).run();
  }
  console.log("Soft skills created (3 locales × 9)");

  // ─── 15. Social Links (no locale — universal) ──────────────────────────
  await db.insert(socialLinks).values([
    { platform: "linkedin", url: "https://www.linkedin.com/in/abdessamadtanafaat", label: "LinkedIn", orderIndex: 0, createdAt: now },
    { platform: "github", url: "https://github.com/abdessamadtanafaat", label: "GitHub", orderIndex: 1, createdAt: now },
    { platform: "email", url: "tanafaatabdessamad@gmail.com", label: "Email", orderIndex: 2, createdAt: now },
    { platform: "phone", url: "+212652146508", label: "Phone", orderIndex: 3, createdAt: now },
  ]).run();
  console.log("Social links created");

  // ─── 16. SEO Settings (3 locales × 6 pages) ───────────────────────────
  const seoData: Record<string, Record<string, {
    title: string; description: string; ogTitle: string; ogDescription: string;
  }>> = {
    "/": {
      en: {
        title: "Abdessamad Tanafaat | Full-Stack PHP/Drupal Engineer",
        description: "Full-Stack Engineer specialized in PHP 8, Drupal 10/11, Laravel 12, Symfony 8 and React — Casablanca, Morocco. 5+ years of experience.",
        ogTitle: "Abdessamad Tanafaat — Full-Stack Engineer",
        ogDescription: "Portfolio of Abdessamad Tanafaat, Full-Stack PHP/Drupal Engineer | Laravel | Symfony | React | CI/CD based in Casablanca, Morocco.",
      },
      fr: {
        title: "Abdessamad Tanafaat | Ingénieur Full-Stack PHP/Drupal",
        description: "Ingénieur Full-Stack spécialisé en PHP 8, Drupal 10/11, Laravel 12, Symfony 8 et React — Casablanca, Maroc. 5+ années d'expérience.",
        ogTitle: "Abdessamad Tanafaat — Ingénieur Full-Stack",
        ogDescription: "Portfolio d'Abdessamad Tanafaat, Ingénieur Full-Stack PHP/Drupal | Laravel | Symfony | React | CI/CD basé à Casablanca, Maroc.",
      },
      ar: {
        title: "عبد الصمد تنافعات | مهندس Full-Stack PHP/Drupal",
        description: "مهندس Full-Stack متخصص في PHP 8 و Drupal 10/11 و Laravel 12 و Symfony 8 و React — الدار البيضاء، المغرب. أكثر من 5 سنوات من الخبرة.",
        ogTitle: "عبد الصمد تنافعات — مهندس Full-Stack",
        ogDescription: "الملف الشخصي لعبد الصمد تنافعات، مهندس Full-Stack PHP/Drupal | Laravel | Symfony | React | CI/CD مقيم في الدار البيضاء، المغرب.",
      },
    },
    "/projects": {
      en: {
        title: "Projects | Abdessamad Tanafaat",
        description: "Discover my projects: institutional websites, multi-tenant back-offices, HR applications, serious games — Drupal, Laravel, React, Docker.",
        ogTitle: "Projects — Abdessamad Tanafaat",
        ogDescription: "Projects delivered to production by Abdessamad Tanafaat: Drupal, Laravel, React, Docker, CI/CD.",
      },
      fr: {
        title: "Projets | Abdessamad Tanafaat",
        description: "Découvrez mes projets : sites institutionnels, back-office multi-tenant, applications RH, serious games — Drupal, Laravel, React, Docker.",
        ogTitle: "Projets — Abdessamad Tanafaat",
        ogDescription: "Projets livrés en production par Abdessamad Tanafaat : Drupal, Laravel, React, Docker, CI/CD.",
      },
      ar: {
        title: "المشاريع | عبد الصمد تنافعات",
        description: "اكتشف مشاريعي: مواقع رسمية، أنظمة إدارة خلفية متعددة المستاجرین، تطبيقات موارد بشرية، ألعاب تعليمية — Drupal، Laravel، React، Docker.",
        ogTitle: "المشاريع — عبد الصمد تنافعات",
        ogDescription: "مشاريع منجزة من قبل عبد الصمد تنافعات: Drupal، Laravel، React، Docker، CI/CD.",
      },
    },
    "/#about": {
      en: {
        title: "About | Abdessamad Tanafaat",
        description: "Passionate Full-Stack Engineer with 5+ years of experience in designing and developing critical web applications.",
        ogTitle: "About — Abdessamad Tanafaat",
        ogDescription: "Background, skills and expertise of Abdessamad Tanafaat in Full-Stack development.",
      },
      fr: {
        title: "À propos | Abdessamad Tanafaat",
        description: "Ingénieur Full-Stack passionné avec 5+ années d'expérience dans la conception et le développement d'applications web critiques.",
        ogTitle: "À propos — Abdessamad Tanafaat",
        ogDescription: "Parcours, compétences et expertise d'Abdessamad Tanafaat en développement Full-Stack.",
      },
      ar: {
        title: "نبذة عني | عبد الصمد تنافعات",
        description: "مهندس Full-Stack شغوف بخبرة تزيد عن 5 سنوات في تصميم وتطوير تطبيقات الويب الحرجة.",
        ogTitle: "نبذة عني — عبد الصمد تنافعات",
        ogDescription: "المسيرة والمهارات والخبرات لعبد الصمد تنافعات في تطوير Full-Stack.",
      },
    },
    "/#experience": {
      en: {
        title: "Experience | Abdessamad Tanafaat",
        description: "5+ years of experience at VOID, Major Media, TECHPAL and ANCFCC — Drupal, Laravel, React, Docker, CI/CD.",
        ogTitle: "Experience — Abdessamad Tanafaat",
        ogDescription: "Professional background of Abdessamad Tanafaat: Permanent at VOID, Full-Stack development internships.",
      },
      fr: {
        title: "Expérience | Abdessamad Tanafaat",
        description: "5+ années d'expérience chez VOID, Major Media, TECHPAL et ANCFCC — Drupal, Laravel, React, Docker, CI/CD.",
        ogTitle: "Expérience — Abdessamad Tanafaat",
        ogDescription: "Parcours professionnel d'Abdessamad Tanafaat : CDI chez VOID, stages en développement Full-Stack.",
      },
      ar: {
        title: "الخبرة | عبد الصمد تنافعات",
        description: "أكثر من 5 سنوات من الخبرة في VOID و Major Media و TECHPAL و ANCFCC — Drupal، Laravel، React، Docker، CI/CD.",
        ogTitle: "الخبرة — عبد الصمد تنافعات",
        ogDescription: "المسيرة المهنية لعبد الصمد تنافعات: عقد دائم في VOID، تدريب في تطوير Full-Stack.",
      },
    },
    "/#skills": {
      en: {
        title: "Skills | Abdessamad Tanafaat",
        description: "Technical stack: PHP 8, Drupal 10/11, Laravel 12, Symfony 8, React, Next.js, Docker, Kubernetes, CI/CD.",
        ogTitle: "Skills — Abdessamad Tanafaat",
        ogDescription: "Technical skills of Abdessamad Tanafaat: PHP, Drupal, Laravel, React, Docker, CI/CD.",
      },
      fr: {
        title: "Compétences | Abdessamad Tanafaat",
        description: "Stack technique : PHP 8, Drupal 10/11, Laravel 12, Symfony 8, React, Next.js, Docker, Kubernetes, CI/CD.",
        ogTitle: "Compétences — Abdessamad Tanafaat",
        ogDescription: "Compétences techniques d'Abdessamad Tanafaat : PHP, Drupal, Laravel, React, Docker, CI/CD.",
      },
      ar: {
        title: "المهارات | عبد الصمد تنافعات",
        description: "المكدس التقني: PHP 8، Drupal 10/11، Laravel 12، Symfony 8، React، Next.js، Docker، Kubernetes، CI/CD.",
        ogTitle: "المهارات — عبد الصمد تنافعات",
        ogDescription: "المهارات التقنية لعبد الصمد تنافعات: PHP، Drupal، Laravel، React، Docker، CI/CD.",
      },
    },
    "/#contact": {
      en: {
        title: "Contact | Abdessamad Tanafaat",
        description: "Contact Abdessamad Tanafaat for your web development projects, Drupal, Laravel, React and DevOps.",
        ogTitle: "Contact — Abdessamad Tanafaat",
        ogDescription: "Send a message to Abdessamad Tanafaat, Full-Stack Engineer in Casablanca.",
      },
      fr: {
        title: "Contact | Abdessamad Tanafaat",
        description: "Contactez Abdessamad Tanafaat pour vos projets de développement web, Drupal, Laravel, React et DevOps.",
        ogTitle: "Contact — Abdessamad Tanafaat",
        ogDescription: "Envoyez un message à Abdessamad Tanafaat, Ingénieur Full-Stack à Casablanca.",
      },
      ar: {
        title: "التواصل | عبد الصمد تنافعات",
        description: "تواصل مع عبد الصمد تنافعات لمشاريع تطوير الويب، Drupal، Laravel، React و DevOps.",
        ogTitle: "التواصل — عبد الصمد تنافعات",
        ogDescription: "أرسل رسالة إلى عبد الصمد تنافعات، مهندس Full-Stack في الدار البيضاء.",
      },
    },
  };

  const seoPages = ["/", "/projects", "/#about", "/#experience", "/#skills", "/#contact"];

  for (const locale of LOCALES) {
    await db.insert(seoSettings).values(
      seoPages.map((pagePath) => {
        const d = seoData[pagePath][locale];
        return {
          pagePath,
          locale,
          title: d.title,
          description: d.description,
          ogTitle: d.ogTitle,
          ogDescription: d.ogDescription,
          ogImageUrl: null,
          twitterCard: "summary_large_image",
          createdAt: now,
          updatedAt: now,
        };
      })
    ).run();
  }
  console.log("SEO settings created (3 locales × 6 pages)");

  // ─── 17. Nav Items (3 locales × 6 items) ──────────────────────────────
  const navItemsData: Record<string, { label: string; href: string; type: string }[]> = {
    en: [
      { label: "Home", href: "/", type: "internal" },
      { label: "Projects", href: "/projects", type: "internal" },
      { label: "About", href: "/#about", type: "anchor" },
      { label: "Experience", href: "/#experience", type: "anchor" },
      { label: "Skills", href: "/#skills", type: "anchor" },
      { label: "Contact", href: "/#contact", type: "anchor" },
    ],
    fr: [
      { label: "Accueil", href: "/", type: "internal" },
      { label: "Projets", href: "/projects", type: "internal" },
      { label: "À propos", href: "/#about", type: "anchor" },
      { label: "Expérience", href: "/#experience", type: "anchor" },
      { label: "Compétences", href: "/#skills", type: "anchor" },
      { label: "Contact", href: "/#contact", type: "anchor" },
    ],
    ar: [
      { label: "الرئيسية", href: "/", type: "internal" },
      { label: "المشاريع", href: "/projects", type: "internal" },
      { label: "نبذة عني", href: "/#about", type: "anchor" },
      { label: "الخبرة", href: "/#experience", type: "anchor" },
      { label: "المهارات", href: "/#skills", type: "anchor" },
      { label: "اتصل بي", href: "/#contact", type: "anchor" },
    ],
  };

  for (const locale of LOCALES) {
    await db.insert(navItems).values(
      navItemsData[locale].map((item, i) => ({
        locale,
        label: item.label,
        href: item.href,
        type: item.type as "internal" | "anchor",
        target: "_self" as const,
        visible: true,
        orderIndex: i,
        createdAt: now,
      }))
    ).run();
  }
  console.log("Nav items created (3 locales × 6)");

  // ─── 18. Form Fields (3 locales × 4 fields) ────────────────────────────
  const formFieldsData: Record<string, { label: string; placeholder: string }[]> = {
    en: [
      { label: "Full Name", placeholder: "Your name" },
      { label: "Email", placeholder: "you@example.com" },
      { label: "Subject", placeholder: "Subject of your message" },
      { label: "Message", placeholder: "Describe your project, your needs..." },
    ],
    fr: [
      { label: "Nom complet", placeholder: "Votre nom" },
      { label: "Email", placeholder: "vous@exemple.com" },
      { label: "Objet", placeholder: "Objet de votre message" },
      { label: "Message", placeholder: "Décrivez votre projet, vos besoins..." },
    ],
    ar: [
      { label: "الاسم الكامل", placeholder: "اسمك" },
      { label: "البريد الإلكتروني", placeholder: "you@example.com" },
      { label: "الموضوع", placeholder: "موضوع رسالتك" },
      { label: "الرسالة", placeholder: "صف مشروعك، احتياجاتك..." },
    ],
  };

  const formFieldMeta: { name: string; type: string; required: boolean }[] = [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "subject", type: "text", required: true },
    { name: "message", type: "textarea", required: true },
  ];

  for (const locale of LOCALES) {
    await db.insert(formFields).values(
      formFieldsData[locale].map((f, i) => ({
        locale,
        formType: "contact",
        label: f.label,
        name: formFieldMeta[i].name,
        type: formFieldMeta[i].type as "text" | "email" | "textarea",
        placeholder: f.placeholder,
        required: formFieldMeta[i].required,
        visible: true,
        orderIndex: i,
        createdAt: now,
      }))
    ).run();
  }
  console.log("Form fields created (3 locales × 4)");

  // ─── 19. Form Settings (3 locales) ─────────────────────────────────────
  const formSettingsData: Record<string, {
    submitButtonText: string; loadingButtonText: string;
    successMessage: string; errorMessage: string;
  }> = {
    en: {
      submitButtonText: "Send message",
      loadingButtonText: "Sending...",
      successMessage: "Message sent successfully! I will respond as soon as possible.",
      errorMessage: "An error occurred. Please try again.",
    },
    fr: {
      submitButtonText: "Envoyer le message",
      loadingButtonText: "Envoi en cours...",
      successMessage: "Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.",
      errorMessage: "Une erreur est survenue. Veuillez réessayer.",
    },
    ar: {
      submitButtonText: "إرسال الرسالة",
      loadingButtonText: "جارٍ الإرسال...",
      successMessage: "تم إرسال الرسالة بنجاح! سأرد في أقرب وقت ممكن.",
      errorMessage: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    },
  };

  for (const locale of LOCALES) {
    const d = formSettingsData[locale];
    await db.insert(formSettings).values({
      locale,
      formType: "contact",
      submitButtonText: d.submitButtonText,
      loadingButtonText: d.loadingButtonText,
      successMessage: d.successMessage,
      errorMessage: d.errorMessage,
      createdAt: now,
      updatedAt: now,
    }).run();
  }
  console.log("Form settings created (3 locales)");

  // ─── 20. Custom Sections (3 locales × 1 section with 3 items) ─────────
  const customSectionsData: Record<string, {
    badge: string; title: string; description: string;
    items: { title: string; subtitle: string; description: string; icon: string; color: string; tags: string }[];
  }> = {
    en: {
      badge: "Services",
      title: "What I can do for you",
      description: "Complete solutions for every stage of your digital project.",
      items: [
        {
          title: "Full-Stack Web Development",
          subtitle: "From design to deployment",
          description: "Custom web applications with modern technologies: React, Next.js, Laravel, Symfony, REST/GraphQL APIs.",
          icon: "Code", color: "brand",
          tags: JSON.stringify(["React", "Laravel", "Symfony", "Next.js"]),
        },
        {
          title: "CMS & Drupal Expertise",
          subtitle: "Complex migrations and integrations",
          description: "Drupal 7/8/9/10/11, multisite migrations, headless CMS, custom themes and modules.",
          icon: "Layers", color: "violet",
          tags: JSON.stringify(["Drupal", "WordPress", "Headless"]),
        },
        {
          title: "Architecture & DevOps",
          subtitle: "Scalable and maintainable infrastructure",
          description: "Docker, Kubernetes, Terraform, CI/CD, monitoring, security — professional-grade infrastructure.",
          icon: "Rocket", color: "emerald",
          tags: JSON.stringify(["Docker", "K8s", "Terraform", "CI/CD"]),
        },
      ],
    },
    fr: {
      badge: "Services",
      title: "Ce que je peux faire pour vous",
      description: "Des solutions complètes pour chaque étape de votre projet digital.",
      items: [
        {
          title: "Développement Web Full-Stack",
          subtitle: "De la conception au déploiement",
          description: "Applications web sur mesure avec des technologies modernes : React, Next.js, Laravel, Symfony, API REST/GraphQL.",
          icon: "Code", color: "brand",
          tags: JSON.stringify(["React", "Laravel", "Symfony", "Next.js"]),
        },
        {
          title: "Expertise CMS & Drupal",
          subtitle: "Migrations et intégrations complexes",
          description: "Drupal 7/8/9/10/11, migrations multisite, headless CMS, thèmes et modules personnalisés.",
          icon: "Layers", color: "violet",
          tags: JSON.stringify(["Drupal", "WordPress", "Headless"]),
        },
        {
          title: "Architecture & DevOps",
          subtitle: "Infrastructure scalable et maintenable",
          description: "Docker, Kubernetes, Terraform, CI/CD, monitoring, sécurité — une infrastructure professionnelle.",
          icon: "Rocket", color: "emerald",
          tags: JSON.stringify(["Docker", "K8s", "Terraform", "CI/CD"]),
        },
      ],
    },
    ar: {
      badge: "الخدمات",
      title: "ما أستطيع تقديمه لك",
      description: "حلول شاملة لكل مرحلة من مشاريعك الرقمية.",
      items: [
        {
          title: "تطوير الويب Full-Stack",
          subtitle: "من التصميم إلى النشر",
          description: "تطبيقات ويب مخصصة بتقنيات حديثة: React، Next.js، Laravel، Symfony، واجهات REST/GraphQL.",
          icon: "Code", color: "brand",
          tags: JSON.stringify(["React", "Laravel", "Symfony", "Next.js"]),
        },
        {
          title: "خبرة CMS و Drupal",
          subtitle: "ترجمات وتكاملات معقدة",
          description: "Drupal 7/8/9/10/11، ترجمات المواقع المتعددة، CMS المنفصل، القوالب والوحدات المخصصة.",
          icon: "Layers", color: "violet",
          tags: JSON.stringify(["Drupal", "WordPress", "Headless"]),
        },
        {
          title: "البنية التحتية و DevOps",
          subtitle: "بنية تحتية قابلة للتوسع وقابلة للصيانة",
          description: "Docker، Kubernetes، Terraform، CI/CD، المراقبة، الأمان — بنية تحتية احترافية.",
          icon: "Rocket", color: "emerald",
          tags: JSON.stringify(["Docker", "K8s", "Terraform", "CI/CD"]),
        },
      ],
    },
  };

  for (const locale of LOCALES) {
    const d = customSectionsData[locale];
    const section = await db.insert(customSections).values({
      slug: "services",
      locale,
      badge: d.badge,
      title: d.title,
      description: d.description,
      layout: "cards",
      visible: true,
      orderIndex: 0,
      createdAt: now,
      updatedAt: now,
    }).returning().get();

    await db.insert(customSectionItems).values(
      d.items.map((item, i) => ({
        locale,
        sectionId: section.id,
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        imageUrl: null,
        linkUrl: null,
        linkLabel: null,
        icon: item.icon,
        color: item.color,
        tags: item.tags,
        visible: true,
        orderIndex: i,
        createdAt: now,
      }))
    ).run();
  }
  console.log("Custom sections created (3 locales × 1 section with 3 items)");

  console.log("Seeding completed successfully!");
}

seed().catch(console.error);

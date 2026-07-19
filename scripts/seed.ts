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
} from "../src/lib/db/schema";
import { hashPassword } from "../src/lib/password";

function ts(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / 1000);
}

async function seed() {
  console.log("Clearing existing data...");
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

  // 1. Admin user
  const passwordHash = await hashPassword("admin123");
  await db.insert(adminUser).values({
    email: "admin@portfolio.com",
    passwordHash,
    name: "Abdessamad Tanafaat",
    createdAt: now,
    updatedAt: now,
  }).run();
  console.log("Admin user created");

  // 2. Personal info
  await db.insert(personalInfo).values({
    id: 1,
    name: "Abdessamad Tanafaat",
    title: "Ingénieur Full-Stack PHP/Drupal | Laravel | Symfony | React | CI/CD",
    tagline: "Ingénieur Full-Stack spécialisé en PHP 8, Drupal 10/11, Laravel 12, Symfony 8 et React — Casablanca, Maroc.",
    bio: "Ingénieur Full-Stack spécialisé en PHP 8, Drupal 10/11, Laravel 12, Symfony 8 et React, ayant contribué à la conception, au développement et à la mise en production de plateformes web pour plusieurs grands comptes.",
    location: "Casablanca, Maroc",
    email: "tanafaatabdessamad@gmail.com",
    phone: "+212 6 52 14 65 08",
    avatarUrl: null,
    resumeUrl: null,
    createdAt: now,
    updatedAt: now,
  }).run();
  console.log("Personal info created");

  // 3. Site Settings
  await db.insert(siteSettings).values({
    id: 1,
    siteName: "Abdessamad Tanafaat | Portfolio",
    faviconUrl: "/favicon.ico",
    defaultOgImageUrl: null,
    analyticsId: null,
    contactFormEndpoint: "/api/contact",
    maintenanceMode: false,
    maintenanceMessage: "Notre site est actuellement en maintenance. Nous serons de retour très bientôt. Merci pour votre patience.",
    createdAt: now,
    updatedAt: now,
  }).run();
  console.log("Site settings created");

  // 4. Homepage Content
  await db.insert(homepageContent).values({
    id: 1,
    heroHeadline: "Abdessamad Tanafaat",
    heroSubtext: "Ingénieur Full-Stack spécialisé en PHP 8, Drupal 10/11, Laravel 12, Symfony 8 et React — Casablanca, Maroc.",
    heroBadgeText: "Ingénieur Full-Stack PHP/Drupal | Laravel | Symfony | React | CI/CD",
    heroCtaText: "Me contacter",
    heroCtaUrl: "#contact",
    heroCta2Text: "Voir mes projets",
    heroCta2Url: "/projects",
    aboutBadge: "Profil",
    aboutTitle: "A propos de moi",
    aboutDescription: "Ingénieur Full-Stack passionné avec 5+ années d'expérience dans la conception, le développement et le déploiement d'applications web critiques pour la banque, les médias et l'administration publique.",
    aboutCards: JSON.stringify([
      {
        icon: "Code",
        title: "Développement Full-Stack",
        description: "Conception et développement d'applications web de A à Z : architecture, API REST/GraphQL, frontend réactif, déploiement CI/CD.",
        color: "text-brand-600 dark:text-brand-400",
        bg: "bg-brand-50 dark:bg-brand-900/30",
      },
      {
        icon: "Briefcase",
        title: "Solutions CMS & E-commerce",
        description: "Expertise Drupal (7/8/9/10), migrations complexes, multisite, headless. Solutions e-commerce sur mesure et intégrations ERP/CRM.",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/30",
      },
      {
        icon: "GraduationCap",
        title: "Architecture Cloud & DevOps",
        description: "Infrastructure as Code (Terraform), conteneurisation (Docker/K8s), CI/CD (GitLab/GitHub Actions), monitoring, sécurité.",
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-50 dark:bg-violet-900/30",
      },
    ]),
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
    educationBadge: "Formation & Certifications",
    educationTitle: "Formation & Certifications",
    educationDescription: "Un parcours académique solide complété par des certifications reconnues dans l'industrie.",
    certificatesBadge: "Certifications",
    certificatesTitle: "Certifications & Formations",
    certificatesDescription: "Des certifications reconnues mondialement validant l'expertise technique sur les technologies critiques.",
    certificatesInProgress: JSON.stringify(["AWS Solutions Architect", "Terraform Associate", "React Advanced Patterns"]),
    heroCta3Text: "Télécharger CV",
    heroCta3Url: "/cv.pdf",
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
    sectionVisibility: JSON.stringify({
      hero: true, about: true, experience: true, projects: true,
      skills: true, languages: true, education: true, certificates: true,
      volunteering: true, softskills: true, contact: true,
    }),
    sectionOrder: JSON.stringify(["hero", "about", "experience", "projects", "skills", "languages", "education", "certificates", "volunteering", "softskills", "contact"]),
    createdAt: now,
    updatedAt: now,
  }).run();
  console.log("Homepage content created");

  // 5. Differentiators
  await db.insert(differentiators).values([
    {
      title: "Code Quality",
      description: "Clean code, tests automatisés, revues de code, patterns de conception, documentation vivante.",
      icon: "Code",
      color: "brand",
      orderIndex: 0,
      createdAt: now,
    },
    {
      title: "Sécurité First",
      description: "OWASP, authentification robuste, chiffrement, audits de sécurité, conformité RGPD.",
      icon: "Shield",
      color: "emerald",
      orderIndex: 1,
      createdAt: now,
    },
    {
      title: "Livraison Continue",
      description: "CI/CD automatisé, déploiements blue-green, rollbacks instantanés, zero-downtime.",
      icon: "Rocket",
      color: "violet",
      orderIndex: 2,
      createdAt: now,
    },
    {
      title: "Mentorat & Partage",
      description: "Code reviews constructifs, formation des juniors, veille technologique, documentation.",
      icon: "Users",
      color: "amber",
      orderIndex: 3,
      createdAt: now,
    },
  ]).run();
  console.log("Differentiators created");

  // 6. Technologies (for footer chips & skills tech summary)
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
  ].map((t) => ({ ...t, createdAt: now }));
  await db.insert(technologies).values(techData).run();
  console.log("Technologies created");

  // 7. Projects
  await db.insert(projects).values([
    {
      slug: "ugb-institutional-site",
      title: "Site institutionnel UGB",
      subtitle: "Attijariwafa Bank Gabon",
      shortDescription: "Développement du site institutionnel d'Attijariwafa Bank Gabon (UGB) en PHP 8, Drupal 10 et Twig. De zéro à la mise en production en 5 mois. Stage PFE converti en CDI.",
      category: "cms",
      status: "production",
      featured: true,
      startDate: ts("2025-02-01"),
      endDate: ts("2025-06-30"),
      orderIndex: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "back-office-multi-tenant",
      title: "Back-office multi-tenant",
      subtitle: "Major Media",
      shortDescription: "Conception et développement d'un back-office gérant 10+ entreprises clientes et 200+ enquêtes de satisfaction. Modules RBAC avec 3+ niveaux de rôles et tableaux de bord analytiques couvrant 10+ KPIs métier.",
      category: "fullstack",
      status: "production",
      featured: true,
      startDate: ts("2024-02-01"),
      endDate: ts("2024-07-31"),
      orderIndex: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "hr-application",
      title: "Application RH",
      subtitle: "ANCFCC",
      shortDescription: "Développement et déploiement d'une application RH gérant 1 000+ candidatures avec authentification RBAC. Module de suivi des dossiers et tableaux de bord statistiques pour la direction RH.",
      category: "fullstack",
      status: "production",
      featured: false,
      startDate: ts("2023-07-01"),
      endDate: ts("2023-08-31"),
      orderIndex: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "hse-serious-game",
      title: "Serious Game HSE",
      subtitle: "TECHPAL",
      shortDescription: "Développement d'un serious game HSE en 2D/3D avec module Quiz multiformats et sélection d'EPI interactifs. Conception de l'architecture du jeu et rédaction du cahier des charges technique.",
      category: "fullstack",
      status: "production",
      featured: false,
      startDate: ts("2024-07-01"),
      endDate: ts("2024-08-31"),
      orderIndex: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "notify-messaging",
      title: "Notify-Messaging",
      subtitle: "Application Réseau Social",
      shortDescription: "Développement d'une application web de messagerie pour un réseau social.",
      description: "Développement d'une application web de messagerie pour un réseau social. Architecture full-stack avec .NET Core et React.js.",
      category: "fullstack",
      status: "production",
      featured: false,
      repoUrl: null,
      orderIndex: 4,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "edupresence",
      title: "EduPresence",
      subtitle: "Gestion des Présences",
      shortDescription: "Application mobile de gestion des présences étudiantes.",
      description: "Développement d'une application mobile pour la gestion des présences étudiantes avec SQLite et Android Studio.",
      category: "mobile",
      status: "production",
      featured: false,
      repoUrl: "https://github.com/abdessamadtanafaat/Attendance_Student_Management",
      orderIndex: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "fleet-manager",
      title: "FleetManager",
      subtitle: "Gestion de Flotte",
      shortDescription: "Système de gestion de flotte véhicules avec Spring Boot.",
      description: "Développement backend d'un système de gestion de flotte véhicules en collaboration avec Ilyass Rouchdi. Spring Boot et Spring Security pour l'authentification.",
      category: "backend",
      status: "production",
      featured: false,
      repoUrl: "https://github.com/abdessamadtanafaat/fleetManagementSystem",
      orderIndex: 6,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "e-learning-app",
      title: "E-LearningApp",
      subtitle: "Plateforme E-Learning",
      shortDescription: "Plateforme e-learning avec quiz et certificats.",
      description: "Création d'une plateforme e-learning avec quiz interactifs et système de certificats. Collaboration avec Oussama Sfiri, Tarik Ait Lakhlift et Hafssa ElBoudribili.",
      category: "fullstack",
      status: "production",
      featured: false,
      repoUrl: "https://github.com/abdessamadtanafaat/E-Learning_App",
      orderIndex: 7,
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "pharmacy-pro",
      title: "PharmacyPro",
      subtitle: "Gestion Pharmacie",
      shortDescription: "Application web de gestion de pharmacie.",
      description: "Développement d'une application web de gestion de pharmacie avec Oussama Sfiri et Hafssa Elboudribili.",
      category: "fullstack",
      status: "production",
      featured: false,
      repoUrl: "https://github.com/abdessamadtanafaat/pharmacy_management",
      orderIndex: 8,
      createdAt: now,
      updatedAt: now,
    },
  ]).run();
  console.log("Projects created");

  // 8. Skills
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

  // 9. Experiences
  await db.insert(experiences).values([
    {
      company: "VOID",
      role: "Ingénieur Full Stack - CDI",
      location: "Casablanca, Maroc",
      startDate: ts("2025-06-01"),
      endDate: null,
      current: true,
      description: "Développement de plateformes Drupal 10/11, Laravel 12 et Symfony 8 pour 6 clients grands comptes.",
      highlights: JSON.stringify([
        "Conception de 15+ modules Drupal custom et intégration d'APIs REST, réduisant les délais de livraison de 20%",
        "Mise en place de 3+ pipelines CI/CD (GitLab CI, Jenkins) automatisant les déploiements sur Docker/Kubernetes/OpenShift",
        "Coordination Agile/SCRUM sur 6 projets clients avec sprints bi-hebdomadaires",
      ]),
      technologies: JSON.stringify(["PHP 8", "Drupal 10/11", "Laravel 12", "Symfony 8", "Next.js 16", "React 19", "Docker", "GitLab CI/CD", "Jenkins", "Kubernetes", "OpenShift"]),
      orderIndex: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      company: "VOID",
      role: "Ingénieur Full Stack - PFE (Stage converti en CDI)",
      location: "Casablanca, Maroc",
      startDate: ts("2025-02-01"),
      endDate: ts("2025-06-30"),
      current: false,
      description: "Stage PFE converti en CDI après 5 mois. Développement du site institutionnel UGB en PHP 8 / Drupal 10 / Twig.",
      highlights: JSON.stringify([
        "Stage converti en CDI après 5 mois, suite à la livraison réussie du site institutionnel",
        "Mise en œuvre de 40+ tests automatisés PHPUnit, portant la couverture de code à 80%",
        "Dockerisation de l'environnement de production, réduisant le temps de configuration de 2h à 10 min",
      ]),
      technologies: JSON.stringify(["PHP 8", "Drupal 10/11", "Twig", "Docker", "GitLab CI/CD", "MySQL", "PHPUnit"]),
      orderIndex: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      company: "TECHPAL",
      role: "Stagiaire - Développeur C#/Unity",
      location: "Casablanca, Maroc",
      startDate: ts("2024-07-01"),
      endDate: ts("2024-08-31"),
      current: false,
      description: "Développement d'un serious game HSE en 2D/3D : module Quiz multiformats et sélection d'EPI interactifs.",
      highlights: JSON.stringify([
        "Développement d'un serious game HSE en 2D/3D avec module Quiz multiformats",
        "Conception de l'architecture du jeu et rédaction du cahier des charges technique",
      ]),
      technologies: JSON.stringify(["C#", "Unity Engine"]),
      orderIndex: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      company: "Major Media",
      role: "Stagiaire PFA - Développeur Full-Stack",
      location: "Agadir, Maroc",
      startDate: ts("2024-02-01"),
      endDate: ts("2024-07-31"),
      current: false,
      description: "Conception et développement d'un back-office multi-tenant gérant 10+ entreprises clientes et 200+ enquêtes de satisfaction.",
      highlights: JSON.stringify([
        "Modules RBAC avec 3+ niveaux de rôles et tableaux de bord analytiques couvrant 10+ KPIs métier",
        "Déploiement conteneurisé via Docker, réduisant le temps de mise en production de 1 jour à quelques minutes",
      ]),
      technologies: JSON.stringify(["React v17", "Spring Boot", "Spring Security", "Java 21", "MySQL", "Tailwind CSS", "Docker"]),
      orderIndex: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      company: "ANCFCC",
      role: "Stagiaire - Développeur Full-Stack",
      location: "Rabat, Maroc",
      startDate: ts("2023-07-01"),
      endDate: ts("2023-08-31"),
      current: false,
      description: "Développement et déploiement d'une application RH gérant 1 000+ candidatures avec authentification RBAC.",
      highlights: JSON.stringify([
        "Module de suivi des dossiers et tableaux de bord statistiques pour la direction RH",
        "Application livrée en 2 mois avec Angular, .NET Core, C#, SQL Server et Docker",
      ]),
      technologies: JSON.stringify(["Angular", ".NET Core", "C#", "SQL Server", "Docker"]),
      orderIndex: 4,
      createdAt: now,
      updatedAt: now,
    },
  ]).run();
  console.log("Experiences created");

  // 10. Education
  await db.insert(education).values([
    {
      institution: "École Nationale des Sciences Appliquées d'Agadir (ENSA Agadir)",
      degree: "Diplôme d'Ingénieur d'État en Génie Informatique",
      field: "Génie Informatique",
      location: "Agadir, Maroc",
      startDate: ts("2020-09-01"),
      endDate: ts("2025-06-30"),
      honors: "Mention Bien",
      orderIndex: 0,
      createdAt: now,
    },
    {
      institution: "Lycée Mohamed V Guelmim",
      degree: "Baccalauréat Sciences Physiques",
      field: "Sciences Physiques",
      location: "Guelmim, Maroc",
      startDate: ts("2018-11-01"),
      endDate: ts("2020-07-31"),
      honors: "Mention Bien",
      orderIndex: 1,
      createdAt: now,
    },
  ]).run();
  console.log("Education created");

  // 11. Certificates
  await db.insert(certificates).values([
    { name: "MySQL Database Training", issuer: "LinkedIn Learning", issueDate: ts("2023-01-01"), expiryDate: null, credentialUrl: null, orderIndex: 0, createdAt: now },
    { name: "Basic Coding in JavaScript", issuer: "LinkedIn Learning", issueDate: ts("2023-01-01"), expiryDate: null, credentialUrl: null, orderIndex: 1, createdAt: now },
    { name: "Bootcamp Développeur Web FrontEnd : HTML, CSS, JS et React", issuer: "OpenClassrooms", issueDate: ts("2023-06-01"), expiryDate: null, credentialUrl: null, orderIndex: 2, createdAt: now },
    { name: "CSS : Tailwind Framework", issuer: "OpenClassrooms", issueDate: ts("2023-06-01"), expiryDate: null, credentialUrl: null, orderIndex: 3, createdAt: now },
    { name: "Project Development Using JAVA for Beginners", issuer: "Udemy", issueDate: ts("2023-01-01"), expiryDate: null, credentialUrl: null, orderIndex: 4, createdAt: now },
  ]).run();
  console.log("Certificates created");

  // 12. Languages
  await db.insert(languages).values([
    { name: "Français", level: "Natif", proficiency: 95, orderIndex: 0, createdAt: now },
    { name: "Arabe", level: "Natif", proficiency: 95, orderIndex: 1, createdAt: now },
    { name: "Anglais", level: "Courant", proficiency: 85, orderIndex: 2, createdAt: now },
  ]).run();
  console.log("Languages created");

  // 13. Volunteering
  await db.insert(volunteering).values([
    { role: "Designer Graphique & Social Media Manager", organization: "Club Social ENSA Agadir", startDate: ts("2022-10-01"), endDate: ts("2023-09-01"), description: "Création de contenus (affiches, vidéos, reels) et gestion des réseaux sociaux.", icon: "Palette", color: "violet", orderIndex: 0, createdAt: now },
    { role: "Membre du comité organisateur", organization: "Club Sportif ENSA Agadir", startDate: ts("2021-10-01"), endDate: ts("2022-09-01"), description: "Membre du comité organisateur pour l'Olympiade Interne de l'ENSA Agadir (OLIN), éditions 1 et 2.", icon: "Trophy", color: "amber", orderIndex: 1, createdAt: now },
    { role: "Membre du comité organisateur", organization: "ADE ENSA Agadir", startDate: ts("2022-07-01"), endDate: null, description: "Membre du comité organisateur de la cérémonie de remise des diplômes 2022. Chargé du design graphique.", icon: "GraduationCap", color: "emerald", orderIndex: 2, createdAt: now },
    { role: "Trésorier", organization: "AppsClub ENSA Agadir", startDate: ts("2023-10-01"), endDate: ts("2024-03-01"), description: "Gestion budgétaire, organisation d'événements tech et ateliers dev.", icon: "Wallet", color: "brand", orderIndex: 3, createdAt: now },
    { role: "Designer Graphique & Social Media Manager", organization: "Club Oxygen", startDate: ts("2021-10-01"), endDate: ts("2023-09-01"), description: "Création de contenus (affiches, vidéos, reels) et gestion des réseaux sociaux.", icon: "Paintbrush", color: "rose", orderIndex: 4, createdAt: now },
    { role: "Designer Graphique", organization: "Fonty Media", startDate: ts("2023-10-01"), endDate: ts("2023-12-01"), description: "Création de contenus visuels · Photoshop · Illustrator · Premiere Pro.", icon: "Image", color: "blue", orderIndex: 5, createdAt: now },
  ]).run();
  console.log("Volunteering created");

  // 14. Soft Skills
  await db.insert(softSkills).values([
    { name: "Leadership", category: "soft_skill", icon: "Users", color: "brand", orderIndex: 0, createdAt: now },
    { name: "Communication", category: "soft_skill", icon: "MessageCircle", color: "emerald", orderIndex: 1, createdAt: now },
    { name: "Travail d'équipe", category: "soft_skill", icon: "Users", color: "blue", orderIndex: 2, createdAt: now },
    { name: "Résolution de problèmes", category: "soft_skill", icon: "Lightbulb", color: "amber", orderIndex: 3, createdAt: now },
    { name: "Adaptabilité", category: "soft_skill", icon: "Zap", color: "violet", orderIndex: 4, createdAt: now },
    { name: "Créativité", category: "soft_skill", icon: "Palette", color: "rose", orderIndex: 5, createdAt: now },
    { name: "Design Graphique", category: "hobby", icon: "Palette", color: "pink", orderIndex: 6, createdAt: now },
    { name: "Voyage", category: "hobby", icon: "Globe", color: "blue", orderIndex: 7, createdAt: now },
    { name: "Sport", category: "hobby", icon: "Dumbbell", color: "emerald", orderIndex: 8, createdAt: now },
  ]).run();
  console.log("Soft skills created");

  // 15. Social links
  await db.insert(socialLinks).values([
    { platform: "linkedin", url: "https://www.linkedin.com/in/abdessamadtanafaat", label: "LinkedIn", orderIndex: 0, createdAt: now },
    { platform: "github", url: "https://github.com/abdessamadtanafaat", label: "GitHub", orderIndex: 1, createdAt: now },
    { platform: "email", url: "tanafaatabdessamad@gmail.com", label: "Email", orderIndex: 2, createdAt: now },
    { platform: "phone", url: "+212652146508", label: "Téléphone", orderIndex: 3, createdAt: now },
  ]).run();
  console.log("Social links created");

  // 13. SEO Settings
  await db.insert(seoSettings).values([
    {
      pagePath: "/",
      title: "Abdessamad Tanafaat | Ingénieur Full-Stack PHP/Drupal",
      description: "Ingénieur Full-Stack spécialisé en PHP 8, Drupal 10/11, Laravel 12, Symfony 8 et React — Casablanca, Maroc. 5+ années d'expérience.",
      ogTitle: "Abdessamad Tanafaat — Ingénieur Full-Stack",
      ogDescription: "Portfolio d'Abdessamad Tanafaat, Ingénieur Full-Stack PHP/Drupal | Laravel | Symfony | React | CI/CD basé à Casablanca, Maroc.",
      ogImageUrl: null,
      twitterCard: "summary_large_image",
      createdAt: now,
      updatedAt: now,
    },
    {
      pagePath: "/projects",
      title: "Projets | Abdessamad Tanafaat",
      description: "Découvrez mes projets : sites institutionnels, back-office multi-tenant, applications RH, serious games — Drupal, Laravel, React, Docker.",
      ogTitle: "Projets — Abdessamad Tanafaat",
      ogDescription: "Projets livrés en production par Abdessamad Tanafaat : Drupal, Laravel, React, Docker, CI/CD.",
      ogImageUrl: null,
      twitterCard: "summary_large_image",
      createdAt: now,
      updatedAt: now,
    },
    {
      pagePath: "/#about",
      title: "À propos | Abdessamad Tanafaat",
      description: "Ingénieur Full-Stack passionné avec 5+ années d'expérience dans la conception et le développement d'applications web critiques.",
      ogTitle: "À propos — Abdessamad Tanafaat",
      ogDescription: "Parcours, compétences et expertise d'Abdessamad Tanafaat en développement Full-Stack.",
      ogImageUrl: null,
      twitterCard: "summary_large_image",
      createdAt: now,
      updatedAt: now,
    },
    {
      pagePath: "/#experience",
      title: "Expérience | Abdessamad Tanafaat",
      description: "5+ années d'expérience chez VOID, Major Media, TECHPAL et ANCFCC — Drupal, Laravel, React, Docker, CI/CD.",
      ogTitle: "Expérience — Abdessamad Tanafaat",
      ogDescription: "Parcours professionnel d'Abdessamad Tanafaat : CDI chez VOID, stages en développement Full-Stack.",
      ogImageUrl: null,
      twitterCard: "summary_large_image",
      createdAt: now,
      updatedAt: now,
    },
    {
      pagePath: "/#skills",
      title: "Compétences | Abdessamad Tanafaat",
      description: "Stack technique : PHP 8, Drupal 10/11, Laravel 12, Symfony 8, React, Next.js, Docker, Kubernetes, CI/CD.",
      ogTitle: "Compétences — Abdessamad Tanafaat",
      ogDescription: "Compétences techniques d'Abdessamad Tanafaat : PHP, Drupal, Laravel, React, Docker, CI/CD.",
      ogImageUrl: null,
      twitterCard: "summary_large_image",
      createdAt: now,
      updatedAt: now,
    },
    {
      pagePath: "/#contact",
      title: "Contact | Abdessamad Tanafaat",
      description: "Contactez Abdessamad Tanafaat pour vos projets de développement web, Drupal, Laravel, React et DevOps.",
      ogTitle: "Contact — Abdessamad Tanafaat",
      ogDescription: "Envoyez un message à Abdessamad Tanafaat, Ingénieur Full-Stack à Casablanca.",
      ogImageUrl: null,
      twitterCard: "summary_large_image",
      createdAt: now,
      updatedAt: now,
    },
  ]).run();
  console.log("SEO settings created");

  // 14. Nav Items
  await db.insert(navItems).values([
    { label: "Accueil", href: "/", type: "internal", target: "_self", visible: true, orderIndex: 0, createdAt: now },
    { label: "Projets", href: "/projects", type: "internal", target: "_self", visible: true, orderIndex: 1, createdAt: now },
    { label: "A propos", href: "/#about", type: "anchor", target: "_self", visible: true, orderIndex: 2, createdAt: now },
    { label: "Experience", href: "/#experience", type: "anchor", target: "_self", visible: true, orderIndex: 3, createdAt: now },
    { label: "Competences", href: "/#skills", type: "anchor", target: "_self", visible: true, orderIndex: 4, createdAt: now },
    { label: "Contact", href: "/#contact", type: "anchor", target: "_self", visible: true, orderIndex: 5, createdAt: now },
  ]).run();
  console.log("Nav items created");

  // 15. Form Fields
  await db.insert(formFields).values([
    { formType: "contact", label: "Nom complet", name: "name", type: "text", placeholder: "Votre nom", required: true, visible: true, orderIndex: 0, createdAt: now },
    { formType: "contact", label: "Email", name: "email", type: "email", placeholder: "vous@exemple.com", required: true, visible: true, orderIndex: 1, createdAt: now },
    { formType: "contact", label: "Objet", name: "subject", type: "text", placeholder: "Objet de votre message", required: true, visible: true, orderIndex: 2, createdAt: now },
    { formType: "contact", label: "Message", name: "message", type: "textarea", placeholder: "Décrivez votre projet, vos besoins...", required: true, visible: true, orderIndex: 3, createdAt: now },
  ]).run();
  console.log("Form fields created");

  // 16. Form Settings
  await db.insert(formSettings).values({
    formType: "contact",
    submitButtonText: "Envoyer le message",
    loadingButtonText: "Envoi en cours...",
    successMessage: "Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.",
    errorMessage: "Une erreur est survenue. Veuillez réessayer.",
    createdAt: now,
    updatedAt: now,
  }).run();
  console.log("Form settings created");

  // 17. Custom Sections
  const servicesSection = await db.insert(customSections).values({
    slug: "services",
    badge: "Services",
    title: "Ce que je peux faire pour vous",
    description: "Des solutions complètes pour chaque étape de votre projet digital.",
    layout: "cards",
    visible: true,
    orderIndex: 0,
    createdAt: now,
    updatedAt: now,
  }).returning().get();

  await db.insert(customSectionItems).values([
    {
      sectionId: servicesSection.id,
      title: "Développement Web Full-Stack",
      subtitle: "De la conception au déploiement",
      description: "Applications web sur mesure avec des technologies modernes : React, Next.js, Laravel, Symfony, API REST/GraphQL.",
      icon: "Code",
      color: "brand",
      tags: JSON.stringify(["React", "Laravel", "Symfony", "Next.js"]),
      visible: true,
      orderIndex: 0,
      createdAt: now,
    },
    {
      sectionId: servicesSection.id,
      title: "Expertise CMS & Drupal",
      subtitle: "Migrations et intégrations complexes",
      description: "Drupal 7/8/9/10/11, migrations multisite, headless CMS, thèmes et modules personnalisés.",
      icon: "Layers",
      color: "violet",
      tags: JSON.stringify(["Drupal", "WordPress", "Headless"]),
      visible: true,
      orderIndex: 1,
      createdAt: now,
    },
    {
      sectionId: servicesSection.id,
      title: "Architecture & DevOps",
      subtitle: "Infrastructure scalable et maintenable",
      description: "Docker, Kubernetes, Terraform, CI/CD, monitoring, sécurité — une infrastructure professionnelle.",
      icon: "Rocket",
      color: "emerald",
      tags: JSON.stringify(["Docker", "K8s", "Terraform", "CI/CD"]),
      visible: true,
      orderIndex: 2,
      createdAt: now,
    },
  ]).run();
  console.log("Custom sections created");

  console.log("Seeding completed successfully!");
}

seed().catch(console.error);

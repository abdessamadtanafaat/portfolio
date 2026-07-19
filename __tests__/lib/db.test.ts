import { describe, it, expect, beforeEach } from "vitest";

process.env.TURSO_DATABASE_URL = "file:local.db";

import {
  createProject,
  getProjects,
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
  createTechnology,
  getAllTechnologies,
  updateTechnology,
  deleteTechnology,
  createSkill,
  getAllSkills,
  updateSkill,
  deleteSkill,
  createExperience,
  getAllExperiences,
  updateExperience,
  deleteExperience,
  createEducation,
  getAllEducation,
  updateEducation,
  deleteEducation,
  createCertificate,
  getAllCertificates,
  updateCertificate,
  deleteCertificate,
  createSocialLink,
  getAllSocialLinks,
  updateSocialLink,
  deleteSocialLink,
  upsertSeoSetting,
  deleteSeoSetting,
  getSeoSetting,
  updatePersonalInfo,
  getPersonalInfo,
  updateSiteSettings,
  getSiteSettings,
  updateHomepageContent,
  getHomepageContent,
  createAdminUser,
  getAdminUserByEmail,
} from "../../src/lib/db/utils";

describe("Projects", () => {
  it("should create, read, update, and delete a project", async () => {
    const created = await createProject({
      slug: `test-project-${Date.now()}`,
      title: "Test Project",
      subtitle: "Test Subtitle",
      shortDescription: "A test project",
      description: "Full description",
      category: "fullstack",
      status: "production",
      featured: false,
      orderIndex: 0,
    });

    expect(created).toBeDefined();
    expect(created.id).toBeGreaterThan(0);
    expect(created.title).toBe("Test Project");
    expect(created.slug).toMatch(/^test-project-/);

    const fetched = await getProjectById(created.id);
    expect(fetched).toBeDefined();
    expect(fetched!.title).toBe("Test Project");

    const bySlug = await getProjectBySlug(created.slug);
    expect(bySlug).toBeDefined();
    expect(bySlug!.id).toBe(created.id);

    const updated = await updateProject(created.id, { title: "Updated Project" });
    expect(updated.title).toBe("Updated Project");

    await deleteProject(created.id);
    const deleted = await getProjectById(created.id);
    expect(deleted).toBeUndefined();
  });

  it("should list projects with pagination", async () => {
    const slug = `list-test-${Date.now()}`;
    const created = await createProject({
      slug,
      title: "List Test",
      category: "frontend",
      status: "production",
      featured: false,
      orderIndex: 999,
    });

    const result = await getProjects({ page: 1, pageSize: 100 });
    expect(result.items).toBeInstanceOf(Array);
    expect(result.total).toBeGreaterThan(0);
    expect(result.page).toBe(1);

    await deleteProject(created.id);
  });

  it("should filter projects by featured flag", async () => {
    const slug = `featured-test-${Date.now()}`;
    const created = await createProject({
      slug,
      title: "Featured Test",
      category: "backend",
      status: "production",
      featured: true,
      orderIndex: 0,
    });

    const featured = await getProjects({ featured: true });
    expect(featured.items.some((p) => p.id === created.id)).toBe(true);

    await deleteProject(created.id);
  });
});

describe("Technologies", () => {
  it("should create, read, update, and delete a technology", async () => {
    const created = await createTechnology({
      slug: `test-tech-${Date.now()}`,
      name: "Test Tech",
      category: "frontend",
      primary: false,
    });

    expect(created).toBeDefined();
    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe("Test Tech");

    const all = await getAllTechnologies();
    expect(all.some((t) => t.id === created.id)).toBe(true);

    const updated = await updateTechnology(created.id, { name: "Updated Tech" });
    expect(updated.name).toBe("Updated Tech");

    await deleteTechnology(created.id);
    const allAfter = await getAllTechnologies();
    expect(allAfter.some((t) => t.id === created.id)).toBe(false);
  });
});

describe("Skills", () => {
  it("should create, read, update, and delete a skill", async () => {
    const created = await createSkill({
      name: "Test Skill",
      category: "testing",
      proficiency: 80,
      orderIndex: 0,
    });

    expect(created).toBeDefined();
    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe("Test Skill");

    const all = await getAllSkills();
    expect(all.some((s) => s.id === created.id)).toBe(true);

    const updated = await updateSkill(created.id, { proficiency: 95 });
    expect(updated.proficiency).toBe(95);

    await deleteSkill(created.id);
    const allAfter = await getAllSkills();
    expect(allAfter.some((s) => s.id === created.id)).toBe(false);
  });
});

describe("Experiences", () => {
  it("should create, read, update, and delete an experience", async () => {
    const created = await createExperience({
      company: "Test Corp",
      role: "Developer",
      startDate: Date.now(),
      current: false,
      highlights: "[]",
      technologies: "[]",
    });

    expect(created).toBeDefined();
    expect(created.id).toBeGreaterThan(0);
    expect(created.company).toBe("Test Corp");

    const all = await getAllExperiences();
    expect(all.some((e) => e.id === created.id)).toBe(true);

    const updated = await updateExperience(created.id, { role: "Senior Developer" });
    expect(updated.role).toBe("Senior Developer");

    await deleteExperience(created.id);
    const allAfter = await getAllExperiences();
    expect(allAfter.some((e) => e.id === created.id)).toBe(false);
  });
});

describe("Education", () => {
  it("should create, read, update, and delete education", async () => {
    const created = await createEducation({
      institution: "Test University",
      degree: "BS",
      field: "Computer Science",
      startDate: Date.now(),
    });

    expect(created).toBeDefined();
    expect(created.id).toBeGreaterThan(0);
    expect(created.institution).toBe("Test University");

    const all = await getAllEducation();
    expect(all.some((e) => e.id === created.id)).toBe(true);

    const updated = await updateEducation(created.id, { degree: "MS" });
    expect(updated.degree).toBe("MS");

    await deleteEducation(created.id);
    const allAfter = await getAllEducation();
    expect(allAfter.some((e) => e.id === created.id)).toBe(false);
  });
});

describe("Certificates", () => {
  it("should create, read, update, and delete a certificate", async () => {
    const created = await createCertificate({
      name: "Test Cert",
      issuer: "Test Org",
      issueDate: Date.now(),
    });

    expect(created).toBeDefined();
    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe("Test Cert");

    const all = await getAllCertificates();
    expect(all.some((c) => c.id === created.id)).toBe(true);

    const updated = await updateCertificate(created.id, { issuer: "Updated Org" });
    expect(updated.issuer).toBe("Updated Org");

    await deleteCertificate(created.id);
    const allAfter = await getAllCertificates();
    expect(allAfter.some((c) => c.id === created.id)).toBe(false);
  });
});

describe("Social Links", () => {
  it("should create, read, update, and delete a social link", async () => {
    const created = await createSocialLink({
      platform: "github",
      url: "https://github.com/test",
      orderIndex: 0,
    });

    expect(created).toBeDefined();
    expect(created.id).toBeGreaterThan(0);
    expect(created.platform).toBe("github");

    const all = await getAllSocialLinks();
    expect(all.some((s) => s.id === created.id)).toBe(true);

    const updated = await updateSocialLink(created.id, { url: "https://github.com/updated" });
    expect(updated.url).toBe("https://github.com/updated");

    await deleteSocialLink(created.id);
    const allAfter = await getAllSocialLinks();
    expect(allAfter.some((s) => s.id === created.id)).toBe(false);
  });
});

describe("SEO Settings", () => {
  it("should upsert, read, and delete an SEO setting", async () => {
    const path = `/test-page-${Date.now()}`;
    const created = await upsertSeoSetting({
      pagePath: path,
      title: "Test SEO",
      description: "Test description",
    });

    expect(created).toBeDefined();
    expect(created.pagePath).toBe(path);
    expect(created.title).toBe("Test SEO");

    const fetched = await getSeoSetting(path);
    expect(fetched).toBeDefined();
    expect(fetched!.title).toBe("Test SEO");

    await upsertSeoSetting({
      pagePath: path,
      title: "Updated SEO",
    });
    const afterUpdate = await getSeoSetting(path);
    expect(afterUpdate!.title).toBe("Updated SEO");

    await deleteSeoSetting(created.id);
    const after = await getSeoSetting(path);
    expect(after).toBeUndefined();
  });
});

describe("Singleton Settings", () => {
  it("should update and read personal info", async () => {
    await updatePersonalInfo({ name: "Test User", title: "Developer" });
    const info = await getPersonalInfo();
    expect(info).toBeDefined();
    expect(info!.name).toBe("Test User");

    await updatePersonalInfo({ name: "Updated User" });
    const updated = await getPersonalInfo();
    expect(updated!.name).toBe("Updated User");
  });

  it("should update and read site settings", async () => {
    await updateSiteSettings({ siteName: "Test Site" });
    const settings = await getSiteSettings();
    expect(settings).toBeDefined();
    expect(settings!.siteName).toBe("Test Site");

    await updateSiteSettings({ siteName: "Updated Site" });
    const updated = await getSiteSettings();
    expect(updated!.siteName).toBe("Updated Site");
  });

  it("should update and read homepage content", async () => {
    await updateHomepageContent({ heroHeadline: "Welcome" });
    const content = await getHomepageContent();
    expect(content).toBeDefined();
    expect(content!.heroHeadline).toBe("Welcome");

    await updateHomepageContent({ heroHeadline: "Hello" });
    const updated = await getHomepageContent();
    expect(updated!.heroHeadline).toBe("Hello");
  });
});

describe("Admin User", () => {
  it("should create and find admin user by email", async () => {
    const email = `admin-${Date.now()}@test.com`;
    const created = await createAdminUser({
      email,
      passwordHash: "hashed-password",
      name: "Test Admin",
    });

    expect(created).toBeDefined();
    expect(created.email).toBe(email);

    const found = await getAdminUserByEmail(email);
    expect(found).toBeDefined();
    expect(found!.name).toBe("Test Admin");
  });
});

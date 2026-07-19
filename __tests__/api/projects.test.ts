import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

process.env.TURSO_DATABASE_URL = "file:local.db";

import {
  createProject,
  deleteProject,
  getProjects,
} from "../../src/lib/db/utils";

const mockSession = { user: { id: "1", email: "admin@test.com", name: "Admin" } };

vi.mock("../../src/lib/auth", () => ({
  auth: vi.fn(),
}));

import { auth } from "../../src/lib/auth";

function makeRequest(url: string, options?: RequestInit) {
  return new Request(url, options);
}

let testProjectId: number;

beforeEach(async () => {
  const slug = `api-test-${Date.now()}`;
  const created = await createProject({
    slug,
    title: "API Test Project",
    subtitle: "API Test",
    category: "fullstack",
    status: "production",
    featured: true,
    orderIndex: 0,
  });
  testProjectId = created.id;
});

afterEach(async () => {
  if (testProjectId) {
    await deleteProject(testProjectId);
  }
});

describe("GET /api/projects", () => {
  it("should return a list of projects", async () => {
    const { GET } = await import("../../src/app/api/projects/route");
    const request = makeRequest("http://localhost:3000/api/projects");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("id");
    expect(data[0]).toHaveProperty("title");
  });

  it("should filter featured projects", async () => {
    const { GET } = await import("../../src/app/api/projects/route");
    const request = makeRequest("http://localhost:3000/api/projects?featured=true");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    data.forEach((project: any) => {
      expect(project.featured).toBe(true);
    });
  });
});

describe("GET /api/projects/[id]", () => {
  it("should return a single project", async () => {
    const { GET } = await import("../../src/app/api/projects/[id]/route");
    const request = makeRequest(`http://localhost:3000/api/projects/${testProjectId}`);
    const response = await GET(request, { params: { id: String(testProjectId) } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe(testProjectId);
    expect(data.title).toBe("API Test Project");
  });

  it("should return 404 for nonexistent project", async () => {
    const { GET } = await import("../../src/app/api/projects/[id]/route");
    const request = makeRequest("http://localhost:3000/api/projects/999999");
    const response = await GET(request, { params: { id: "999999" } });

    expect(response.status).toBe(404);
  });
});

describe("POST /api/projects", () => {
  it("should create a project when authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(mockSession as any);

    const { POST } = await import("../../src/app/api/projects/route");
    const body = {
      slug: `post-test-${Date.now()}`,
      title: "POST Test Project",
      category: "frontend",
      status: "staging",
      featured: false,
    };
    const request = makeRequest("http://localhost:3000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.title).toBe("POST Test Project");
    expect(data.id).toBeGreaterThan(0);

    // Cleanup
    await deleteProject(data.id);
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null as any);

    const { POST } = await import("../../src/app/api/projects/route");
    const request = makeRequest("http://localhost:3000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Should Fail" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});

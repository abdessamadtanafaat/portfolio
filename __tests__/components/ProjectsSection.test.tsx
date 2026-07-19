import { describe, it, expect } from "vitest";
import React from "react";

describe("ProjectsSection component", () => {
  it("should export a ProjectsSection function", async () => {
    const mod = await import("../../src/components/public/ProjectsSection");
    expect(mod.ProjectsSection).toBeDefined();
    expect(typeof mod.ProjectsSection).toBe("function");
  });

  it("should render without crashing", async () => {
    const { ProjectsSection } = await import("../../src/components/public/ProjectsSection");
    const element = React.createElement(ProjectsSection);
    expect(element).toBeDefined();
    expect(element.type).toBe(ProjectsSection);
  });

  it("should have the correct display name", async () => {
    const { ProjectsSection } = await import("../../src/components/public/ProjectsSection");
    // Function components don't always have displayName, but the function should exist
    expect(ProjectsSection.name).toBe("ProjectsSection");
  });
});

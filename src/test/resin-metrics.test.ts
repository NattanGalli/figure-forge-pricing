import { describe, it, expect } from "vitest";
import { resinMetrics } from "@/lib/resin-metrics.server";

describe("resinMetrics", () => {
  it("taller figure costs more", () => {
    expect(resinMetrics(30, "simple").price).toBeGreaterThan(resinMetrics(15, "simple").price);
  });
  it("detailed paint costs more than simple", () => {
    expect(resinMetrics(20, "detailed").price).toBeGreaterThan(resinMetrics(20, "simple").price);
  });
});

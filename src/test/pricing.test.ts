import { describe, it, expect } from "vitest";
import { calcPrice, defaultInput } from "@/lib/pricing";

describe("calcPrice", () => {
  it("resin cost = ml/1000 * price per liter", () => {
    expect(calcPrice({ ...defaultInput, resinMl: 100, resinPricePerLiter: 200 }).resin).toBeCloseTo(20);
  });
  it("detailed paint costs more than simple", () => {
    const s = calcPrice({ ...defaultInput, paint: "simple" }).price;
    const d = calcPrice({ ...defaultInput, paint: "detailed" }).price;
    expect(d).toBeGreaterThan(s);
  });
  it("profit is applied on top of total cost", () => {
    const r = calcPrice({ ...defaultInput, profitPct: 100 });
    expect(r.price).toBeCloseTo(r.cost * 2);
  });
});

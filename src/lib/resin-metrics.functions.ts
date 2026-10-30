import { createServerFn } from "@tanstack/react-start";
import type { PaintLevel } from "./pricing";

export const getResinMetrics = createServerFn({ method: "POST" })
  .inputValidator((d: { heightCm: number; paint: PaintLevel }) => {
    const heightCm = Number(d.heightCm);
    if (!Number.isFinite(heightCm) || heightCm <= 0) throw new Error("Altura inválida");
    const paint: PaintLevel = ["none", "simple", "detailed"].includes(d.paint) ? d.paint : "simple";
    return { heightCm, paint };
  })
  .handler(async ({ data }) => {
    const { resinMetrics } = await import("./resin-metrics.server");
    return resinMetrics(data.heightCm, data.paint);
  });

import { calcPrice, defaultInput, type PaintLevel } from "./pricing";

// Figura de referência: 15 cm ≈ 80 ml de resina, 6 h de impressão, 1,5 h de pós-processo.
const REF_CM = 15;

export function resinMetrics(heightCm: number, paint: PaintLevel) {
  const h = Math.min(Math.max(heightCm, 5), 60);
  const k = h / REF_CM;
  const r = calcPrice({
    ...defaultInput,
    resinMl: 80 * k ** 3, // volume cresce com o cubo da altura
    printHours: 6 * k, // camadas crescem com a altura
    laborHours: 1.5 * k ** 1.5,
    paint,
    paintSimple: defaultInput.paintSimple * k ** 2, // área pintada
    paintDetailed: defaultInput.paintDetailed * k ** 2,
  });
  return { heightCm: h, price: Math.round(r.price) };
}

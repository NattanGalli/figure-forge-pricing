import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import raw from "@/assets/raw.jpg";
import paint from "@/assets/paint.jpg";
import { calcPrice, defaultInput, type PaintLevel, type PricingInput } from "@/lib/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Figures 3D sob encomenda + calculadora de preço" },
      { name: "description", content: "Figures de personagens impressas em resina 3D, com calculadora de custo e preço final." },
      { property: "og:title", content: "Figures 3D sob encomenda" },
      { property: "og:description", content: "Impressão 3D em resina com pintura simples ou detalhada e estimativa de preço." },
    ],
  }),
  component: Index,
});

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Field({ label, hint, value, onChange, step = 1, suffix }: { label: string; hint?: string; value: number; onChange: (v: number) => void; step?: number; suffix?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      <div className="mt-1 flex items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
        <input type="number" min={0} step={step} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="w-full bg-transparent px-3 py-2 outline-none" />
        {suffix && <span className="pr-3 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </label>
  );
}

function Calculator() {
  const [i, setI] = useState<PricingInput>(defaultInput);
  const set = <K extends keyof PricingInput>(k: K) => (v: PricingInput[K]) => setI((p) => ({ ...p, [k]: v }));
  const r = calcPrice(i);
  const rows = [
    ["Resina", r.resin],
    ["Suportes / perdas", r.supports],
    ["Energia elétrica", r.energy],
    ["Álcool isopropílico", r.ipa],
    ["Mão de obra", r.labor],
    ["Pintura", r.paint],
  ] as const;
  const paints: { k: PaintLevel; t: string }[] = [
    { k: "none", t: "Sem pintura" },
    { k: "simple", t: "Simples" },
    { k: "detailed", t: "Detalhada" },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8 rounded-xl border border-border bg-card p-6 md:p-8">
        <section>
          <h3 className="mb-4 text-2xl text-primary">1. Resina</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Preço da resina" value={i.resinPricePerLiter} onChange={set("resinPricePerLiter")} suffix="R$/L" />
            <Field label="Resina usada" value={i.resinMl} onChange={set("resinMl")} suffix="ml" />
            <Field label="Suportes e perdas" value={i.supportWastePct} onChange={set("supportWastePct")} suffix="%" />
          </div>
        </section>
        <section>
          <h3 className="mb-4 text-2xl text-primary">2. Gastos adicionais</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Tempo de impressão" value={i.printHours} onChange={set("printHours")} step={0.5} suffix="h" />
            <Field label="Potência da máquina" value={i.printerKw} onChange={set("printerKw")} step={0.01} suffix="kW" />
            <Field label="Preço da luz" value={i.kwhPrice} onChange={set("kwhPrice")} step={0.05} suffix="R$/kWh" />
            <Field label="Álcool isopropílico" hint="por peça" value={i.ipaCost} onChange={set("ipaCost")} step={0.5} suffix="R$" />
          </div>
        </section>
        <section>
          <h3 className="mb-4 text-2xl text-primary">3. Mão de obra</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Horas de trabalho" hint="lavar, curar, tirar suportes, lixar" value={i.laborHours} onChange={set("laborHours")} step={0.5} suffix="h" />
            <Field label="Valor da sua hora" value={i.laborRate} onChange={set("laborRate")} suffix="R$/h" />
          </div>
        </section>
        <section>
          <h3 className="mb-4 text-2xl text-primary">4. Pintura</h3>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {paints.map((p) => (
              <button key={p.k} onClick={() => set("paint")(p.k)} className={`rounded-md border px-3 py-3 text-sm font-semibold transition ${i.paint === p.k ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
                {p.t}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pintura simples" hint="cores base, sem sombreamento" value={i.paintSimple} onChange={set("paintSimple")} suffix="R$" />
            <Field label="Pintura detalhada" hint="sombras, luz, efeitos, verniz" value={i.paintDetailed} onChange={set("paintDetailed")} suffix="R$" />
          </div>
        </section>
        <section>
          <h3 className="mb-4 text-2xl text-primary">5. Seu lucro</h3>
          <input type="range" min={0} max={300} step={5} value={i.profitPct} onChange={(e) => set("profitPct")(Number(e.target.value))} className="w-full accent-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Margem de lucro: <b className="text-foreground">{i.profitPct}%</b> sobre o custo</p>
        </section>
      </div>

      <aside className="h-fit rounded-xl border border-primary/40 bg-card p-6 shadow-glow lg:sticky lg:top-6">
        <h3 className="text-3xl">Estimativa</h3>
        <ul className="mt-4 space-y-2 text-sm">
          {rows.map(([l, v]) => (
            <li key={l} className="flex justify-between"><span className="text-muted-foreground">{l}</span><span>{brl(v)}</span></li>
          ))}
        </ul>
        <div className="my-4 border-t border-border" />
        <div className="flex justify-between font-semibold"><span>Custo total</span><span>{brl(r.cost)}</span></div>
        <div className="mt-1 flex justify-between text-primary"><span>Lucro ({i.profitPct}%)</span><span>+ {brl(r.profit)}</span></div>
        <div className="mt-6 rounded-lg bg-fire p-5 text-primary-foreground">
          <p className="text-xs font-bold uppercase tracking-widest">Preço sugerido</p>
          <p className="font-display text-5xl">{brl(r.price)}</p>
        </div>
        <button onClick={() => setI(defaultInput)} className="mt-4 w-full text-sm text-muted-foreground underline hover:text-foreground">Restaurar valores padrão</button>
      </aside>
    </div>
  );
}

function Index() {
  const nav = [["#inicio", "Início"], ["#galeria", "Galeria"], ["#calculadora", "Calculadora"], ["#contato", "Contato"]];
  return (
    <div id="inicio">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#inicio" className="font-display text-3xl">GAF<span className="text-fire"> 33</span></a>
          <nav className="hidden gap-6 text-sm font-semibold md:flex">
            {nav.map(([h, t]) => <a key={h} href={h} className="hover:text-primary">{t}</a>)}
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-primary">Impressão 3D em resina</p>
          <h1 className="text-6xl leading-none md:text-8xl">Seus personagens favoritos. <span className="text-fire">Em 3D.</span></h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Figures de animes, games, filmes e séries sob encomenda — com pintura simples ou detalhada à mão.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#calculadora" className="rounded-md bg-fire px-6 py-3 font-bold text-primary-foreground shadow-glow">Calcular preço</a>
            <a href="#galeria" className="rounded-md border border-border px-6 py-3 font-bold hover:border-primary">Ver galeria</a>
          </div>
        </div>
        <img src={hero} alt="Figure pintada à mão" width={1024} height={1280} className="mx-auto max-h-[600px] w-auto rounded-xl object-cover shadow-glow" />
      </section>

      <section id="galeria" className="border-y border-border bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-5xl">Do bruto ao <span className="text-fire">acabamento</span></h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              [raw, "Impressão em resina", "Alta resolução, cada detalhe capturado."],
              [paint, "Pintura à mão", "Simples ou detalhada, você escolhe."],
              [hero, "Peça finalizada", "Pronta para a estante."],
            ].map(([img, t, d]) => (
              <figure key={t} className="overflow-hidden rounded-xl border border-border bg-card">
                <img src={img} alt={t} loading="lazy" width={1024} height={1024} className="aspect-square w-full object-cover" />
                <figcaption className="p-5"><h3 className="text-2xl">{t}</h3><p className="text-sm text-muted-foreground">{d}</p></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="calculadora" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-5xl">Calculadora de <span className="text-fire">preço</span></h2>
        <p className="mb-10 mt-2 max-w-2xl text-muted-foreground">Coloque os seus custos reais. O preço final soma resina, gastos extras, mão de obra e pintura — e aplica sua margem de lucro por cima.</p>
        <Calculator />
      </section>

      <section id="contato" className="border-t border-border py-20 text-center">
        <h2 className="text-5xl">Pronto para ter sua figure?</h2>
        <p className="mt-2 text-muted-foreground">Solicite seu orçamento sem compromisso.</p>
        <a href="mailto:gaf33c@gmail.com" className="mt-8 inline-block rounded-md bg-fire px-8 py-4 font-bold text-primary-foreground shadow-glow">Enviar email</a>
      </section>
    </div>
  );
}

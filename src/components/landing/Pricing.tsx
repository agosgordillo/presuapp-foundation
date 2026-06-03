import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "Gratis",
    desc: "Ideal para empezar.",
    features: ["Hasta 3 clientes", "5 presupuestos / mes", "Exportación PDF básica", "Catálogo de servicios"],
    cta: "Comenzar",
    highlighted: false,
  },
  {
    name: "Profesional",
    price: "$12",
    suffix: "/ mes",
    desc: "Para freelancers en crecimiento.",
    features: ["Clientes ilimitados", "Presupuestos ilimitados", "Módulo de pagos completo", "PDFs con branding", "Soporte por email"],
    cta: "Probar 14 días",
    highlighted: true,
  },
  {
    name: "Agencia",
    price: "$39",
    suffix: "/ mes",
    desc: "Equipos pequeños y boutique.",
    features: ["Multiusuario (hasta 5)", "Roles y permisos", "Reportes avanzados", "Webhooks & API", "Soporte prioritario"],
    cta: "Hablar con ventas",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Precios</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-heading">Planes claros, sin sorpresas.</h2>
          <p className="mt-4 text-base text-muted-foreground">Empieza gratis y escala cuando lo necesites.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl p-8 transition-all duration-200 ease-in-out ${
                t.highlighted
                  ? "bg-heading text-white shadow-2xl shadow-primary/20 lg:-translate-y-4"
                  : "bg-card border border-border hover:shadow-lg"
              }`}
            >
              {t.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  Más popular
                </span>
              )}
              <h3 className={`text-lg font-semibold ${t.highlighted ? "text-white" : "text-heading"}`}>{t.name}</h3>
              <p className={`mt-1 text-sm ${t.highlighted ? "text-white/70" : "text-muted-foreground"}`}>{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${t.highlighted ? "text-white" : "text-heading"}`}>{t.price}</span>
                {t.suffix && <span className={`text-sm ${t.highlighted ? "text-white/60" : "text-muted-foreground"}`}>{t.suffix}</span>}
              </div>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${t.highlighted ? "text-success" : "text-primary"}`} />
                    <span className={t.highlighted ? "text-white/90" : "text-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ease-in-out ${
                  t.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                    : "bg-secondary text-secondary-foreground hover:bg-accent border border-border"
                }`}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

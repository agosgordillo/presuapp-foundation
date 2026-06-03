import { ArrowRight, Play, TrendingUp, FileText, CheckCircle2, DollarSign } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-light/40 via-surface to-background pt-20 pb-24">
      <div className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,_#d1d5db_1px,_transparent_0)] [background-size:24px_24px]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            B2B SaaS · Diseñado para profesionales
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-heading">
            Presupuestos inteligentes para{" "}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Freelancers y Agencias
            </span>{" "}
            que quieren crecer.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Automatiza cotizaciones, gestiona clientes, haz seguimiento de pagos y exporta PDFs
            profesionales en segundos. Todo desde un panel centralizado B2B SaaS.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#cta"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all duration-200 ease-in-out hover:-translate-y-0.5"
            >
              Crear Nuevo Presupuesto <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#showcase"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground border border-border hover:bg-accent transition-colors duration-200 ease-in-out"
            >
              <Play className="h-4 w-4" /> Ver Demostración
            </a>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-16 mx-auto max-w-5xl">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-success/20 rounded-3xl blur-2xl" />
          <div className="relative rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-destructive/70" />
              <span className="h-3 w-3 rounded-full bg-warning/70" />
              <span className="h-3 w-3 rounded-full bg-success/70" />
              <span className="ml-4 text-xs text-muted-foreground font-medium">presuapp.io / dashboard</span>
            </div>
            <div className="grid grid-cols-12 gap-4 p-6 bg-surface/50">
              {/* sidebar */}
              <div className="hidden md:flex col-span-3 flex-col gap-2 rounded-xl bg-card p-4 border border-border">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">Menú</span>
                {["Dashboard", "Presupuestos", "Clientes", "Catálogo", "Pagos"].map((i, idx) => (
                  <span key={i} className={`text-sm font-medium px-3 py-2 rounded-lg ${idx === 0 ? "bg-primary-light text-primary-dark" : "text-foreground hover:bg-accent"}`}>
                    {i}
                  </span>
                ))}
              </div>
              {/* main */}
              <div className="col-span-12 md:col-span-9 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <MetricMini icon={<DollarSign className="h-4 w-4" />} label="Facturado" value="$15,240" tone="primary" />
                  <MetricMini icon={<CheckCircle2 className="h-4 w-4" />} label="Cobrado" value="$11,800" tone="success" />
                  <MetricMini icon={<FileText className="h-4 w-4" />} label="Pendiente" value="$3,440" tone="warning" />
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-heading">Ingresos últimos 6 meses</p>
                      <p className="text-xs text-muted-foreground">Tendencia mensual</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                      <TrendingUp className="h-3 w-3" /> +24.5%
                    </span>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {[40, 55, 48, 70, 62, 88].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-primary/40" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricMini({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "primary" | "success" | "warning" }) {
  const tones = {
    primary: "bg-primary-light text-primary-dark",
    success: "bg-success-light text-success-dark",
    warning: "bg-warning-light text-warning-dark",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</span>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="mt-2 text-xl font-bold text-heading">{value}</p>
    </div>
  );
}

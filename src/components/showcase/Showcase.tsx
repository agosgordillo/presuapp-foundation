import { AlertCircle, Check, ChevronDown, Loader2, MoreVertical, TrendingUp, DollarSign } from "lucide-react";

export function Showcase() {
  return (
    <section id="showcase" className="py-24 bg-gradient-to-b from-background to-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Design System</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-heading">
            🎛️ Catálogo de Componentes Estáticos
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Sandbox visual de las primitivas atómicas con todas sus variantes y estados.
          </p>
        </div>

        <div className="mt-16 space-y-12">
          <ShowcaseBlock title="1. Buttons" subtitle="Variantes, estados y tamaños">
            <ButtonsMatrix />
          </ShowcaseBlock>

          <ShowcaseBlock title="2. Input Fields" subtitle="Inputs, estados focus y error, selectores">
            <InputsSandbox />
          </ShowcaseBlock>

          <ShowcaseBlock title="3. Semantic Status Badges" subtitle="Estados del ciclo de vida del presupuesto">
            <BadgesShowcase />
          </ShowcaseBlock>

          <ShowcaseBlock title="4. Data Cards" subtitle="Contenedores y cards de métricas financieras">
            <CardsShowcase />
          </ShowcaseBlock>
        </div>
      </div>
    </section>
  );
}

function ShowcaseBlock({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border bg-surface px-6 py-4">
        <h3 className="text-base font-semibold text-heading">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

/* ---------- BUTTONS ---------- */
const btnBase = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
const btnSize = { md: "px-4 py-2 text-sm", sm: "px-3 py-1.5 text-xs" };

function Btn({ variant = "primary", state = "normal", size = "md", children }: { variant?: "primary" | "secondary" | "destructive"; state?: "normal" | "hover" | "active" | "disabled" | "loading"; size?: "md" | "sm"; children: React.ReactNode }) {
  const variants = {
    primary: {
      normal: "bg-primary text-primary-foreground hover:bg-primary-hover",
      hover: "bg-primary-hover text-primary-foreground shadow-md",
      active: "bg-primary-dark text-primary-foreground",
      disabled: "bg-primary/40 text-primary-foreground cursor-not-allowed",
      loading: "bg-primary text-primary-foreground cursor-wait",
    },
    secondary: {
      normal: "bg-secondary text-secondary-foreground border border-border hover:bg-accent",
      hover: "bg-accent text-secondary-foreground border border-border-strong shadow-sm",
      active: "bg-border text-secondary-foreground border border-border-strong",
      disabled: "bg-secondary/60 text-muted-foreground border border-border cursor-not-allowed",
      loading: "bg-secondary text-secondary-foreground border border-border cursor-wait",
    },
    destructive: {
      normal: "bg-destructive text-destructive-foreground hover:bg-destructive-dark",
      hover: "bg-destructive-dark text-destructive-foreground shadow-md",
      active: "bg-destructive-dark text-destructive-foreground",
      disabled: "bg-destructive/40 text-destructive-foreground cursor-not-allowed",
      loading: "bg-destructive text-destructive-foreground cursor-wait",
    },
  } as const;
  const isDisabled = state === "disabled" || state === "loading";
  return (
    <button disabled={isDisabled} className={`${btnBase} ${btnSize[size]} ${variants[variant][state]}`}>
      {state === "loading" ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Procesando...
        </>
      ) : (
        children
      )}
    </button>
  );
}

function ButtonsMatrix() {
  const variants: Array<"primary" | "secondary" | "destructive"> = ["primary", "secondary", "destructive"];
  const states: Array<{ s: "normal" | "hover" | "active" | "disabled" | "loading"; label: string }> = [
    { s: "normal", label: "Normal" },
    { s: "hover", label: "Hover" },
    { s: "active", label: "Active" },
    { s: "disabled", label: "Disabled" },
    { s: "loading", label: "Loading" },
  ];
  return (
    <div className="space-y-8">
      {variants.map((v) => (
        <div key={v}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{v}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {states.map((st) => (
              <div key={st.s} className="flex flex-col items-start gap-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{st.label}</span>
                <Btn variant={v} state={st.s}>Acción</Btn>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sizes</p>
        <div className="flex flex-wrap items-center gap-3">
          <Btn variant="primary" size="md">Regular</Btn>
          <Btn variant="primary" size="sm">Small</Btn>
          <Btn variant="secondary" size="md">Regular</Btn>
          <Btn variant="secondary" size="sm">Small</Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- INPUTS ---------- */
function InputsSandbox() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
      <Field label="Email — Normal">
        <input
          type="email"
          placeholder="cliente@empresa.com"
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ease-in-out"
        />
      </Field>
      <Field label="Email — Focus / Active">
        <input
          type="email"
          defaultValue="cliente@empresa.com"
          autoFocus={false}
          className="w-full rounded-lg border-2 border-primary bg-card px-3 py-2 text-sm text-foreground ring-2 ring-primary/20 focus:outline-none"
        />
      </Field>
      <Field label="Texto — Error">
        <input
          type="text"
          defaultValue="presupuesto-#001"
          className="w-full rounded-lg border-2 border-destructive bg-destructive-light/30 px-3 py-2 text-sm text-heading focus:outline-none"
        />
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive-dark">
          <AlertCircle className="h-3.5 w-3.5" /> Este identificador ya existe en tu catálogo.
        </p>
      </Field>
      <Field label="Selector — Unidad">
        <div className="relative">
          <select className="w-full appearance-none rounded-lg border border-border bg-card px-3 py-2 pr-9 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ease-in-out">
            <option>hr — Hora</option>
            <option>u — Unidad</option>
            <option>svc — Servicio</option>
            <option>mes — Mensual</option>
            <option>proy — Proyecto</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}

/* ---------- BADGES ---------- */
function BadgesShowcase() {
  const pill = "inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-xs";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className={`${pill} bg-secondary text-muted-foreground`}>Borrador</span>
      <span className={`${pill} bg-primary-light text-primary-dark`}>Enviado</span>
      <span className={`${pill} bg-success-light text-success-dark`}>
        <Check className="h-3 w-3" /> Aceptado
      </span>
      <span className={`${pill} bg-success-light text-success-dark`}>
        <Check className="h-3 w-3" /> Activo
      </span>
      <span className={`${pill} bg-destructive-light text-destructive-dark`}>Rechazado</span>
      <span className={`${pill} bg-warning-light text-warning-dark`}>Pendiente</span>
    </div>
  );
}

/* ---------- CARDS ---------- */
function CardsShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <MetricCard label="Total Facturado" value="$15,000.00" delta="+12.4%" icon={<DollarSign className="h-4 w-4" />} tone="primary" />
      <MetricCard label="Cobrado este mes" value="$11,800.00" delta="+8.1%" icon={<TrendingUp className="h-4 w-4" />} tone="success" />
      <MetricCard label="Saldo Pendiente" value="$3,200.00" delta="3 facturas" icon={<DollarSign className="h-4 w-4" />} tone="warning" />

      <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-border bg-card p-6 transition-all duration-200 ease-in-out hover:shadow-lg hover:border-primary/30">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Presupuesto #PA-2026-014</p>
            <h4 className="mt-1 text-lg font-semibold text-heading">Rediseño web — Estudio Lumen</h4>
          </div>
          <button className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-heading transition-colors duration-200 ease-in-out">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-4">
          <Stat label="Subtotal" value="$4,200.00" />
          <Stat label="IVA (21%)" value="$882.00" />
          <Stat label="Total" value="$5,082.00" highlight />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-3 py-1 text-xs font-semibold text-success-dark">
            <Check className="h-3 w-3" /> Aceptado
          </span>
          <div className="flex gap-2">
            <Btn variant="secondary" size="sm">Ver detalle</Btn>
            <Btn variant="primary" size="sm">Registrar pago</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, delta, icon, tone }: { label: string; value: string; delta: string; icon: React.ReactNode; tone: "primary" | "success" | "warning" }) {
  const tones = {
    primary: "bg-primary-light text-primary-dark",
    success: "bg-success-light text-success-dark",
    warning: "bg-warning-light text-warning-dark",
  };
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-200 ease-in-out hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-bold text-heading">{value}</p>
      <p className="mt-1 text-xs font-medium text-success-dark">{delta}</p>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-bold ${highlight ? "text-primary" : "text-heading"}`}>{value}</p>
    </div>
  );
}

import { DollarSign, TrendingUp, FileText, Users } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          /dashboard
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">
          Dashboard — Resumen Operativo
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Hub central de métricas B2B. Vista panorámica de facturación, cobros pendientes
          y actividad de presupuestos en tiempo real.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Metric label="Facturado (mes)" value="$15,240" tone="primary" icon={<DollarSign className="h-4 w-4" />} delta="+12.4%" />
        <Metric label="Cobrado" value="$11,800" tone="success" icon={<TrendingUp className="h-4 w-4" />} delta="+8.1%" />
        <Metric label="Saldo Pendiente" value="$3,440" tone="warning" icon={<FileText className="h-4 w-4" />} delta="3 facturas" />
        <Metric label="Clientes Activos" value="24" tone="primary" icon={<Users className="h-4 w-4" />} delta="+2 nuevos" />
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-heading">Actividad Reciente</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pipeline de presupuestos en curso. Conecta con `/quotes` para ver el detalle completo.
        </p>
        <ul className="mt-5 divide-y divide-border">
          {[
            { id: "PA-2026-014", client: "Estudio Lumen", status: "Aceptado", amount: "$5,082" },
            { id: "PA-2026-013", client: "Norte Digital", status: "Enviado", amount: "$2,640" },
            { id: "PA-2026-012", client: "Boreal Studio", status: "Borrador", amount: "$1,200" },
          ].map((q) => (
            <li key={q.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold text-heading">{q.id}</p>
                <p className="text-xs text-muted-foreground">{q.client}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-heading">{q.amount}</p>
                <p className="text-xs text-muted-foreground">{q.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  delta,
  icon,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ReactNode;
  tone: "primary" | "success" | "warning";
}) {
  const tones = {
    primary: "bg-primary-light text-primary-dark",
    success: "bg-success-light text-success-dark",
    warning: "bg-warning-light text-warning-dark",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-bold text-heading">{value}</p>
      <p className="mt-1 text-xs font-medium text-success-dark">{delta}</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, FileText, Users, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { getDashboardMetrics, type DashboardMetrics } from "@/lib/api/quotes";

type Metrics = DashboardMetrics;

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const ESTADO_LABEL: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviado",
  VIEWED: "Visto",
  ACCEPTED: "Aceptado",
  REJECTED: "Rechazado",
};

export default function Dashboard() {
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setData(await getDashboardMetrics());
      } catch (e: any) {
        toast.error(e?.message ?? "Error al cargar métricas.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="/dashboard"
        title="Panel de Control — Resumen Operativo"
        description="Hub central de métricas B2B. Vista panorámica en tiempo real desde Lovable Cloud."
      />

      {loading || !data ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Cargando métricas…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Metric label="Facturado (aceptado)" value={money(data.facturado)} tone="primary" icon={<DollarSign className="h-4 w-4" />} delta="Presupuestos aceptados" />
            <Metric label="Cobrado" value={money(data.cobrado)} tone="success" icon={<TrendingUp className="h-4 w-4" />} delta="Σ pagos" />
            <Metric label="Saldo Pendiente" value={money(data.pendiente)} tone="warning" icon={<FileText className="h-4 w-4" />} delta="Facturado − Cobrado" />
            <Metric label="Clientes en cartera" value={String(data.clientes)} tone="primary" icon={<Users className="h-4 w-4" />} delta="Cartera total" />
          </div>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-heading">Actividad Reciente</h2>
            <p className="mt-1 text-sm text-muted-foreground">Últimos presupuestos creados. <Link to="/quotes" className="text-primary font-medium">Ver todos →</Link></p>
            {data.recientes.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">Aún no has creado presupuestos.</p>
            ) : (
              <ul className="mt-5 divide-y divide-border">
                {data.recientes.map((q) => (
                  <li key={q.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-heading">{q.codigo}</p>
                      <p className="text-xs text-muted-foreground">{q.cliente}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-heading">{money(q.total)}</p>
                      <p className="text-xs text-muted-foreground">{ESTADO_LABEL[q.estado] ?? q.estado}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, delta, icon, tone }: { label: string; value: string; delta: string; icon: React.ReactNode; tone: "primary" | "success" | "warning"; }) {
  const tones = { primary: "bg-primary-light text-primary-dark", success: "bg-success-light text-success-dark", warning: "bg-warning-light text-warning-dark" };
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

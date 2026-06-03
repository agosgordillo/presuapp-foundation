import { Check, Plus } from "lucide-react";

const quotes = [
  { id: "PA-2026-014", client: "Estudio Lumen", total: "$5,082", status: "Aceptado" },
  { id: "PA-2026-013", client: "Norte Digital", total: "$2,640", status: "Enviado" },
  { id: "PA-2026-012", client: "Boreal Studio", total: "$1,200", status: "Borrador" },
  { id: "PA-2026-011", client: "Atlas Co.", total: "$890", status: "Rechazado" },
];

const statusStyles: Record<string, string> = {
  Borrador: "bg-secondary text-muted-foreground",
  Enviado: "bg-primary-light text-primary-dark",
  Aceptado: "bg-success-light text-success-dark",
  Rechazado: "bg-destructive-light text-destructive-dark",
};

export default function QuotesList() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">/quotes</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">
            Presupuestos — Centralizador Multi-Estado
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Pipeline completo de cotizaciones: borrador, enviado, aceptado y rechazado en un solo lugar.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors duration-200 ease-in-out">
          <Plus className="h-4 w-4" /> Nuevo presupuesto
        </button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-surface/60 transition-colors duration-200 ease-in-out">
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{q.id}</td>
                <td className="px-5 py-4 font-semibold text-heading">{q.client}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[q.status]}`}>
                    {q.status === "Aceptado" && <Check className="h-3 w-3" />}
                    {q.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-semibold text-heading">{q.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { Plus } from "lucide-react";

const items = [
  { sku: "SVC-001", name: "Auditoría UX completa", unit: "svc", price: "$1,200" },
  { sku: "HR-001", name: "Hora de Diseño Senior", unit: "hr", price: "$80" },
  { sku: "MES-001", name: "Mantenimiento mensual", unit: "mes", price: "$450" },
  { sku: "PRY-001", name: "Proyecto Llave en mano", unit: "proy", price: "$4,500" },
];

export default function CatalogList() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">/catalog</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">
            Catálogo — Inventario de Servicios
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Backoffice de servicios y unidades reutilizables (hr, u, svc, mes, proy) para tus presupuestos.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors duration-200 ease-in-out">
          <Plus className="h-4 w-4" /> Nuevo ítem
        </button>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Servicio</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unidad</th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Precio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((i) => (
              <tr key={i.sku} className="hover:bg-surface/60 transition-colors duration-200 ease-in-out">
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{i.sku}</td>
                <td className="px-5 py-4 font-semibold text-heading">{i.name}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-md bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary-dark">
                    {i.unit}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-semibold text-heading">{i.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

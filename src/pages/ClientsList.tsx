import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";

const clients = [
  { id: "client-123", name: "Estudio Lumen", email: "hola@lumen.io", projects: 4, status: "Activo" },
  { id: "client-204", name: "Norte Digital", email: "ops@nortedigital.co", projects: 2, status: "Activo" },
  { id: "client-318", name: "Boreal Studio", email: "info@boreal.studio", projects: 1, status: "Inactivo" },
];

export default function ClientsList() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">/clients</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">
            Clientes — Cartera de Cuentas
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Datatable central para trazar relaciones comerciales y proyectos activos por cuenta.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/clients/$id"
            params={{ id: "client-123" }}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark hover:bg-primary hover:text-primary-foreground transition-colors duration-200 ease-in-out"
          >
            Ver client-123 (validar :id) <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors duration-200 ease-in-out">
            <Plus className="h-4 w-4" /> Nuevo cliente
          </button>
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left">
            <tr>
              <Th>Cliente</Th>
              <Th>Email</Th>
              <Th>Proyectos</Th>
              <Th>Estado</Th>
              <Th className="text-right">Acciones</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clients.map((c) => (
              <tr key={c.id} className="hover:bg-surface/60 transition-colors duration-200 ease-in-out">
                <td className="px-5 py-4 font-semibold text-heading">{c.name}</td>
                <td className="px-5 py-4 text-muted-foreground">{c.email}</td>
                <td className="px-5 py-4">{c.projects}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      c.status === "Activo"
                        ? "bg-success-light text-success-dark"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    to="/clients/$id"
                    params={{ id: c.id }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    Abrir <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${className}`}>
      {children}
    </th>
  );
}

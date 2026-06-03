import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export default function ClientDetail({ id }: { id: string }) {
  return (
    <div className="space-y-8">
      <Link
        to="/clients"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-heading transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a Clientes
      </Link>

      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          /clients/:id
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">
          Cliente: <span className="text-primary">{id}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Token dinámico capturado vía <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">useParams()</code>.
          Esta vista renderiza el perfil parametrizado del cliente seleccionado.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-heading">Información de la cuenta</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <Info label="ID interno" value={id} />
            <Info label="Razón social" value="Demo Client S.A." />
            <Info label="Email" value="contacto@cliente.com" />
            <Info label="Teléfono" value="+54 11 5555 1234" />
          </dl>
        </section>
        <aside className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-heading">Resumen financiero</h2>
          <p className="mt-4 text-3xl font-bold text-primary">$12,400</p>
          <p className="text-xs text-muted-foreground">Facturación acumulada</p>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold text-heading">{value}</dd>
    </div>
  );
}

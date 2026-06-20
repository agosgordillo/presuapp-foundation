import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCustomerById, type CustomerDetail } from "@/lib/api/customers";
import { getProjectsByClient, type ProjectByClient } from "@/lib/api/projects";
import { getAcceptedTotalsByProjectIds } from "@/lib/api/quotes";
import { PageHeader } from "@/components/PageHeader";

type ClientRow = CustomerDetail;
type ProyectoRow = ProjectByClient;

export default function ClientDetail({ id }: { id: string }) {
  const clientId = Number(id);
  const [cliente, setCliente] = useState<ClientRow | null>(null);
  const [proyectos, setProyectos] = useState<ProyectoRow[]>([]);
  const [facturacion, setFacturacion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!Number.isFinite(clientId)) {
        setLoading(false);
        return;
      }
      try {
        const [c, p] = await Promise.all([getCustomerById(clientId), getProjectsByClient(clientId)]);
        setCliente(c);
        setProyectos(p);
        const projIds = p.map((x) => x.id);
        setFacturacion(await getAcceptedTotalsByProjectIds(projIds));
      } catch (e: any) {
        toast.error(e?.message ?? "Error al cargar cliente.");
      } finally {
        setLoading(false);
      }
    })();
  }, [clientId]);

  return (
    <div className="space-y-8">
      <Link to="/clients" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-heading">
        <ArrowLeft className="h-4 w-4" /> Volver a Clientes
      </Link>

      <PageHeader
        eyebrow="/clients/:id"
        title={<>Cliente: <span className="text-primary">#{id}</span></>}
        description={<>Token <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">:id</code> capturado vía <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">useParams()</code> y resuelto contra Lovable Cloud.</>}
      />

      {loading ? (
        <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Cargando…</p>
      ) : !cliente ? (
        <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Cliente no encontrado o sin acceso.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-heading">Información de la cuenta</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <Info label="ID interno" value={String(cliente.id)} />
              <Info label="Empresa" value={cliente.empresa} />
              <Info label="Email" value={cliente.email} />
              <Info label="Teléfono" value={cliente.telefono} />
            </dl>

            <h3 className="mt-8 text-sm font-semibold text-heading uppercase tracking-wider">Proyectos</h3>
            {proyectos.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Aún no hay proyectos para este cliente.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {proyectos.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3">
                    <Link to="/projects/$id" params={{ id: String(p.id) }} className="font-medium text-heading hover:text-primary">
                      {p.nombre}
                    </Link>
                    <span className="text-xs font-semibold text-muted-foreground">{p.estado}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <aside className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-heading">Facturación acumulada</h2>
            <p className="mt-4 text-3xl font-bold text-primary">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(facturacion)}
            </p>
            <p className="text-xs text-muted-foreground">Suma de presupuestos ACCEPTED</p>
          </aside>
        </div>
      )}
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

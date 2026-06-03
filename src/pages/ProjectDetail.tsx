import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";

export default function ProjectDetail({ id }: { id: string }) {
  const milestones = [
    { name: "Discovery & Research", done: true },
    { name: "Wireframes aprobados", done: true },
    { name: "Diseño visual final", done: true },
    { name: "Desarrollo Frontend", done: false },
    { name: "QA + Lanzamiento", done: false },
  ];

  return (
    <div className="space-y-8">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-heading transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a Proyectos
      </Link>

      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          /projects/:id
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">
          Proyecto: <span className="text-primary">{id}</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Token dinámico capturado vía <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">useParams()</code>.
          Sub-panel de seguimiento de pagos y milestones para este proyecto.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-heading">Milestones</h2>
          <ul className="mt-5 space-y-3">
            {milestones.map((m) => (
              <li key={m.name} className="flex items-center gap-3">
                {m.done ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className={`text-sm ${m.done ? "text-heading" : "text-muted-foreground"}`}>
                  {m.name}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Presupuesto total</p>
            <p className="mt-1 text-2xl font-bold text-heading">$8,400</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Cobrado</p>
            <p className="mt-1 text-2xl font-bold text-success-dark">$5,040</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Saldo pendiente</p>
            <p className="mt-1 text-2xl font-bold text-warning-dark">$3,360</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

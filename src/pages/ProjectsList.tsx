import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";

const projects = [
  { id: "project-456", name: "Rediseño Web", client: "Estudio Lumen", progress: 72 },
  { id: "project-501", name: "App iOS Onboarding", client: "Norte Digital", progress: 35 },
  { id: "project-612", name: "Branding Boreal", client: "Boreal Studio", progress: 90 },
];

export default function ProjectsList() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">/projects</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">
            Proyectos — Pipeline Activo
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Grid panorámico de proyectos en ejecución con progreso visible por entregable.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/projects/$id"
            params={{ id: "project-456" }}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark hover:bg-primary hover:text-primary-foreground transition-colors duration-200 ease-in-out"
          >
            Ver project-456 (validar :id) <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors duration-200 ease-in-out">
            <Plus className="h-4 w-4" /> Nuevo proyecto
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <Link
            key={p.id}
            to="/projects/$id"
            params={{ id: p.id }}
            className="group rounded-2xl border border-border bg-card p-5 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30"
          >
            <p className="text-xs text-muted-foreground">{p.client}</p>
            <h3 className="mt-1 text-lg font-semibold text-heading group-hover:text-primary transition-colors">
              {p.name}
            </h3>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Progreso</span>
                <span className="text-heading">{p.progress}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-200 ease-in-out"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

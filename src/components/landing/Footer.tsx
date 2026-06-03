import { LayoutGrid } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutGrid className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold text-heading">PresuApp</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              Sistema inteligente de presupuestos y seguimiento de pagos para freelancers y agencias.
            </p>
          </div>
          <FooterCol title="Producto" links={["Características", "Precios", "Showcase", "Roadmap"]} />
          <FooterCol title="Legal" links={["Términos", "Privacidad", "Cookies", "Contacto"]} />
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">Generado con PresuApp © 2026</p>
          <p className="text-xs text-muted-foreground">Hecho con cariño para profesionales independientes.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-heading">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-muted-foreground hover:text-heading transition-colors duration-200 ease-in-out">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

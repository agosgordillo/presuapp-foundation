import { LayoutGrid } from "lucide-react";

const links = [
  { href: "#features", label: "Características" },
  { href: "#pricing", label: "Precios" },
  { href: "#faq", label: "FAQ" },
  { href: "#showcase", label: "UI Showcase" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutGrid className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold text-heading tracking-tight">PresuApp</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-heading transition-colors duration-200 ease-in-out"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#cta"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors duration-200 ease-in-out"
        >
          Probar Gratis
        </a>
      </div>
    </header>
  );
}

import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BookOpen,
  FileText,
  LayoutGrid,
  X,
  ArrowLeft,
} from "lucide-react";
import { Header } from "@/components/Header";

const navItems = [
  { to: "/dashboard", label: "Panel de Control", icon: LayoutDashboard },
  { to: "/clients", label: "Clientes", icon: Users },
  { to: "/projects", label: "Proyectos", icon: FolderKanban },
  { to: "/catalog", label: "Catálogo", icon: BookOpen },
  { to: "/quotes", label: "Presupuestos", icon: FileText },
] as const;

export function DashboardLayout({ children, user }: { children: ReactNode; user?: User | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutGrid className="h-4 w-4" />
            </span>
            <span className="text-base font-bold text-heading tracking-tight">PresuApp</span>
          </Link>
          <button
            className="md:hidden text-muted-foreground hover:text-heading"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Navegación
          </p>
          {navItems.map((item) => {
            const active =
              pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
                  active
                    ? "bg-primary-light text-primary-dark"
                    : "text-foreground hover:bg-accent hover:text-heading"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-heading transition-colors duration-200 ease-in-out"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Volver a la Landing
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="md:pl-64">
        <Header user={user} onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}


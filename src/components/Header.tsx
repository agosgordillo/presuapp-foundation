import type { User } from "@supabase/supabase-js";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type HeaderProps = {
  user?: User | null;
  /** Optional override for the small uppercase label on the left. */
  eyebrow?: string;
  /** Optional override for the bolded title on the left. */
  title?: string;
  /** Triggered when the user taps the mobile menu button. */
  onOpenMobileMenu?: () => void;
};

/**
 * Reusable top-bar Header for the authenticated app shell.
 * Centralizes user info, session badge and sign-out button so pages don't duplicate it.
 */
export function Header({
  user,
  eyebrow = "Panel B2B SaaS",
  title = "Consola PresuApp",
  onOpenMobileMenu,
}: HeaderProps) {
  const navigate = useNavigate();

  const nombre =
    (user?.user_metadata?.nombre as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Invitado";
  const initial = nombre.charAt(0).toUpperCase() || "P";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 md:px-8">
      {onOpenMobileMenu && (
        <button
          className="md:hidden text-heading"
          onClick={onOpenMobileMenu}
          aria-label="Abrir menú"
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <div className="hidden md:block">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </p>
        <p className="text-sm font-semibold text-heading">{title}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-semibold text-success-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Sesión activa
        </span>
        <div className="hidden md:flex flex-col items-end leading-tight">
          <span className="text-sm font-semibold text-heading">{nombre}</span>
          <span className="text-[11px] text-muted-foreground">{user?.email}</span>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {initial}
        </span>
        <button
          onClick={handleSignOut}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          type="button"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

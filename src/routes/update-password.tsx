import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout, AuthField } from "@/components/auth/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/update-password")({
  head: () => ({ meta: [{ title: "Actualizar Contraseña — PresuApp" }] }),
  component: UpdatePasswordPage,
});

function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  useEffect(() => {
    // Supabase auto-parses the recovery hash and sets a session.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!password) next.password = "La contraseña es obligatoria.";
    else if (password.length < 6) next.password = "Mínimo 6 caracteres.";
    if (confirm !== password) next.confirm = "Las contraseñas no coinciden.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Contraseña actualizada. Inicia sesión con tus nuevas credenciales.");
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <AuthLayout
      title="Define tu nueva contraseña"
      subtitle="Por seguridad, elige una contraseña que no hayas usado antes."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <AuthField
          id="password"
          label="Nueva contraseña"
          type={show ? "text" : "password"}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          error={errors.password}
          disabled={loading || !ready}
          rightSlot={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="text-muted-foreground hover:text-heading transition-colors"
              aria-label={show ? "Ocultar" : "Mostrar"}
              tabIndex={-1}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <AuthField
          id="confirm"
          label="Confirmar contraseña"
          type={show ? "text" : "password"}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirm}
          onChange={setConfirm}
          error={errors.confirm}
          disabled={loading || !ready}
        />
        {!ready && (
          <p className="text-xs text-muted-foreground">
            Validando enlace de recuperación... Si no llegaste aquí desde el correo, solicita un nuevo enlace.
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !ready}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Procesando...
            </>
          ) : (
            "Guardar nueva contraseña"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

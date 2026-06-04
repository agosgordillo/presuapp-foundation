import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout, AuthField, emailIsValid } from "@/components/auth/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Recuperar Contraseña — PresuApp" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("El correo es obligatorio.");
    if (!emailIsValid(email)) return setError("Ingresa un correo válido.");
    setError(undefined);
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);
    if (err) {
      toast.error(err.message);
      return;
    }
    setSent(true);
    toast.success("Te enviamos un enlace de recuperación.");
  };

  return (
    <AuthLayout
      title="Recupera tu acceso"
      subtitle="Te enviaremos un enlace para restablecer tu contraseña."
      footer={
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Volver a iniciar sesión
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-lg border border-success/30 bg-[#DCFCE7] p-4 flex gap-3">
          <CheckCircle2 className="h-5 w-5 text-[#166534] shrink-0 mt-0.5" />
          <div className="text-sm text-[#166534]">
            <p className="font-semibold">Revisa tu bandeja de entrada</p>
            <p className="mt-1">Enviamos instrucciones a <strong>{email}</strong>.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <AuthField id="email" label="Correo electrónico" type="email" required autoComplete="email" placeholder="tu@empresa.com" value={email} onChange={setEmail} error={error} disabled={loading} />
          <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors disabled:opacity-70">
            {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>) : ("Enviar enlace de recuperación")}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

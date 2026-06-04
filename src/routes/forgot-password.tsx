import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { AuthLayout, AuthField, emailIsValid } from "@/components/auth/AuthLayout";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Recuperar Contraseña — PresuApp" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("El correo es obligatorio.");
    if (!emailIsValid(email)) return setError("Ingresa un correo válido.");
    setError(undefined);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setEmail("");
    }, 1000);
  };

  return (
    <AuthLayout
      title="Recupera tu acceso"
      subtitle="Te enviaremos un enlace seguro a tu correo para restablecer la contraseña."
    >
      {sent ? (
        <div className="space-y-5">
          <div
            className="flex items-start gap-3 rounded-lg border p-4"
            style={{ backgroundColor: "#DCFCE7", borderColor: "#86efac", color: "#166534" }}
          >
            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">¡Listo! Revisa tu bandeja de entrada.</p>
              <p className="mt-1 opacity-90">
                Si tu correo está registrado, recibirás las instrucciones para restablecer
                tu contraseña en los próximos minutos.
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al Login
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <AuthField
            id="email"
            label="Correo electrónico"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@empresa.com"
            value={email}
            onChange={setEmail}
            error={error}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Procesando...
              </>
            ) : (
              "Enviar Instrucciones"
            )}
          </button>
          <Link
            to="/login"
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-heading"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al Login
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}

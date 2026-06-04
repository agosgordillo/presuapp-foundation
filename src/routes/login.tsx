import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout, AuthField, emailIsValid } from "@/components/auth/AuthLayout";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Iniciar Sesión — PresuApp" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email) next.email = "El correo es obligatorio.";
    else if (!emailIsValid(email)) next.email = "Ingresa un correo válido (user@dominio.com).";
    if (!password) next.password = "La contraseña es obligatoria.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setTimeout(() => {
      toast.success("Sesión iniciada correctamente");
      navigate({ to: "/dashboard" });
    }, 1100);
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Ingresa tus credenciales para continuar a tu panel."
      footer={
        <>
          ¿Aún no tienes cuenta?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Crear cuenta
          </Link>
        </>
      }
    >
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
          error={errors.email}
          disabled={loading}
        />
        <AuthField
          id="password"
          label="Contraseña"
          type={show ? "text" : "password"}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          error={errors.password}
          disabled={loading}
          rightSlot={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="text-muted-foreground hover:text-heading transition-colors"
              aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-border-strong text-primary focus:ring-2 focus:ring-primary/30 cursor-pointer"
              disabled={loading}
            />
            Recordarme
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

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
            "Iniciar Sesión"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}

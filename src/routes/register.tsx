import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout, AuthField, emailIsValid } from "@/components/auth/AuthLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Crear Cuenta — PresuApp" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Ingresa tu nombre completo.";
    if (!form.email) next.email = "El correo es obligatorio.";
    else if (!emailIsValid(form.email)) next.email = "Ingresa un correo válido.";
    if (!form.password) next.password = "La contraseña es obligatoria.";
    else if (form.password.length < 8) next.password = "Mínimo 8 caracteres.";
    if (!form.confirm) next.confirm = "Confirma tu contraseña.";
    else if (form.password !== form.confirm) next.confirm = "Las contraseñas no coinciden.";

    setErrors(next);
    if (Object.keys(next).length) {
      if (next.confirm === "Las contraseñas no coinciden.") {
        toast.error("Las contraseñas no coinciden");
      }
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          nombre: form.fullName,
          empresa_nombre: form.company || "Mi Empresa",
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("¡Cuenta creada con éxito!");
    navigate({ to: "/dashboard" });
  };

  const eyeBtn = (
    <button
      type="button"
      onClick={() => setShow((s) => !s)}
      className="text-muted-foreground hover:text-heading transition-colors"
      aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
      tabIndex={-1}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a gestionar tus presupuestos en menos de 1 minuto."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <AuthField id="fullName" label="Nombre completo" required autoComplete="name" placeholder="Ada Lovelace" value={form.fullName} onChange={set("fullName")} error={errors.fullName} disabled={loading} />
        <AuthField id="company" label="Empresa (opcional)" autoComplete="organization" placeholder="Tu agencia o marca personal" value={form.company} onChange={set("company")} disabled={loading} />
        <AuthField id="email" label="Correo electrónico" type="email" required autoComplete="email" placeholder="tu@empresa.com" value={form.email} onChange={set("email")} error={errors.email} disabled={loading} />
        <AuthField id="password" label="Contraseña" type={show ? "text" : "password"} required autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={set("password")} error={errors.password} disabled={loading} rightSlot={eyeBtn} />
        <AuthField id="confirm" label="Confirmar contraseña" type={show ? "text" : "password"} required autoComplete="new-password" placeholder="Repite la contraseña" value={form.confirm} onChange={set("confirm")} error={errors.confirm} disabled={loading} />

        <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
          {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Procesando...</>) : ("Crear Cuenta")}
        </button>

        <p className="text-xs text-muted-foreground text-center pt-1">
          Al registrarte aceptas nuestros Términos de servicio y la Política de privacidad.
        </p>
      </form>
    </AuthLayout>
  );
}

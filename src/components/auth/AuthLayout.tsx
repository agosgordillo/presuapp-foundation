import { Link } from "@tanstack/react-router";
import { LayoutGrid, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface">
      {/* Left: brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark p-12 text-primary-foreground">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,_#ffffff_1px,_transparent_0)] [background-size:24px_24px]" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary-light/20 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2 w-fit">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
            <LayoutGrid className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">PresuApp</span>
        </Link>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              El control financiero <br /> de tu negocio, simplificado.
            </h2>
            <p className="mt-4 text-base text-white/80 max-w-md">
              Centraliza clientes, presupuestos y cobros en una plataforma diseñada
              para freelancers y agencias modernas.
            </p>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              { icon: <Zap className="h-4 w-4" />, text: "Cotizaciones automáticas en segundos" },
              { icon: <TrendingUp className="h-4 w-4" />, text: "Reportes financieros en tiempo real" },
              { icon: <ShieldCheck className="h-4 w-4" />, text: "Seguridad bancaria · GDPR ready" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                  {item.icon}
                </span>
                <span className="font-medium text-white/90">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">
          © {new Date().getFullYear()} PresuApp · Todos los derechos reservados.
        </p>
      </aside>

      {/* Right: form panel */}
      <main className="flex flex-col items-center justify-center px-6 py-12 sm:px-12 animate-fade-in">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="lg:hidden mb-8 flex items-center gap-2 w-fit"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutGrid className="h-4 w-4" />
            </span>
            <span className="text-base font-bold text-heading">PresuApp</span>
          </Link>

          <AuthTabs />

          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <header className="mb-6">
              <h1 className="text-2xl font-bold text-heading tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
            </header>
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

function AuthTabs() {
  return (
    <div className="mb-6 inline-flex w-full rounded-lg border border-border bg-card p-1 shadow-sm">
      <Link
        to="/login"
        activeProps={{ className: "bg-primary text-primary-foreground shadow-sm" }}
        inactiveProps={{ className: "text-muted-foreground hover:text-heading" }}
        className="flex-1 rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors"
      >
        Ingresar
      </Link>
      <Link
        to="/register"
        activeProps={{ className: "bg-primary text-primary-foreground shadow-sm" }}
        inactiveProps={{ className: "text-muted-foreground hover:text-heading" }}
        className="flex-1 rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors"
      >
        Registrarse
      </Link>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  rightSlot?: ReactNode;
  autoComplete?: string;
}

export function AuthField({
  id,
  label,
  type = "text",
  required,
  value,
  onChange,
  error,
  placeholder,
  disabled,
  rightSlot,
  autoComplete,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className={`block w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm text-heading shadow-sm transition-all placeholder:text-muted-foreground/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
            error
              ? "border-destructive focus:border-destructive focus:ring-4 focus:ring-destructive/15"
              : "border-border focus:border-primary focus:ring-4 focus:ring-primary/15"
          } ${rightSlot ? "pr-10" : ""}`}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightSlot}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircleIcon /> {error}
        </p>
      )}
    </div>
  );
}

function AlertCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function emailIsValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

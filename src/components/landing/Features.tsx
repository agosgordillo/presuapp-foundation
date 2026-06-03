import { Users, Calculator, Wallet, BookOpen, FileBarChart, Bell } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestión de Clientes y Proyectos",
    desc: "Relaciones jerárquicas directas entre clientes, proyectos y presupuestos. Toda la información de tu cartera centralizada.",
  },
  {
    icon: Calculator,
    title: "Tabla de Ítems Dinámica",
    desc: "Cálculo en tiempo real de subtotales, IVA, impuestos y totales. Sin fórmulas manuales ni errores de hoja de cálculo.",
  },
  {
    icon: Wallet,
    title: "Módulo de Pagos e Historial",
    desc: "Seguimiento estricto del saldo pendiente hasta llegar a $0. Registra abonos parciales con trazabilidad completa.",
  },
  {
    icon: BookOpen,
    title: "Catálogo Personal de Servicios",
    desc: "Unidades pre-configuradas (hr, u, svc, mes, proy). Reutiliza servicios entre presupuestos con un clic.",
  },
  {
    icon: FileBarChart,
    title: "Exportación PDF Profesional",
    desc: "Genera presupuestos con tu branding listos para enviar. Tipografía limpia y estructura corporativa por defecto.",
  },
  {
    icon: Bell,
    title: "Estados y Notificaciones",
    desc: "Borrador, Enviado, Aceptado o Rechazado. Sabes exactamente en qué etapa se encuentra cada cotización.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Características</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-heading">
            Todo lo que necesitas para cotizar como un equipo grande.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Diseñado desde cero para el flujo real de freelancers y agencias boutique.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 ease-in-out hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary-dark group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 ease-in-out">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-heading">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

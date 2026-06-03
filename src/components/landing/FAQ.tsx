import { useState } from "react";
import { ChevronDown } from "lucide-react";

const items = [
  {
    q: "¿Los cálculos de IVA y subtotales se actualizan automáticamente?",
    a: "¡Sí, los cálculos de IVA y subtotales se actualizan instantáneamente! Cada vez que añades o modificas un ítem, PresuApp recalcula subtotales, impuestos y total en tiempo real.",
  },
  {
    q: "¿Puedo definir mis propias unidades de cobro?",
    a: "Puedes configurar unidades por hora, mes, o servicios fijos en el catálogo. Las unidades pre-configuradas incluyen hr, u, svc, mes y proy, y puedes añadir las propias.",
  },
  {
    q: "¿Cómo funciona el seguimiento de pagos?",
    a: "Registras abonos parciales o totales sobre cada presupuesto aceptado. El módulo mantiene el saldo pendiente actualizado hasta llegar a $0 y muestra el historial completo.",
  },
  {
    q: "¿Puedo exportar los presupuestos a PDF?",
    a: "Sí. Generas PDFs profesionales con tu branding en un clic, listos para enviar al cliente por email.",
  },
  {
    q: "¿PresuApp sirve para agencias con varios usuarios?",
    a: "Sí. El plan Agencia incluye multiusuario con roles y permisos, ideal para boutiques de Marketing Digital y Diseño Web.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-heading">Preguntas frecuentes</h2>
        </div>
        <div className="mt-12 space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 ease-in-out">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-surface transition-colors duration-200 ease-in-out"
                >
                  <span className="text-sm md:text-base font-semibold text-heading pr-4">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ease-in-out ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

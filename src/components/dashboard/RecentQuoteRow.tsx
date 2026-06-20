type Props = {
  codigo: string;
  cliente: string;
  total: number;
  estado: string;
};

const ESTADO_LABEL: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviado",
  VIEWED: "Visto",
  ACCEPTED: "Aceptado",
  REJECTED: "Rechazado",
};

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export function RecentQuoteRow({ codigo, cliente, total, estado }: Props) {
  return (
    <li className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-semibold text-heading">{codigo}</p>
        <p className="text-xs text-muted-foreground">{cliente}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-heading">{money(total)}</p>
        <p className="text-xs text-muted-foreground">{ESTADO_LABEL[estado] ?? estado}</p>
      </div>
    </li>
  );
}

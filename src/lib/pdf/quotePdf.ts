import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";

const money = (n: number | null | undefined) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n ?? 0));

export type QuotePdfItem = {
  nombre_historico: string;
  tipo_unidad_historica: string;
  cantidad: number | string;
  precio_unitario: number | string;
  subtotal_item: number | string;
  aplica_impuesto?: boolean | null;
  impuesto_porcentaje?: number | string | null;
};

export type QuotePdfData = {
  id: number;
  codigo: string;
  fecha_emision?: string | null;
  estado: string;
  subtotal: number | string;
  impuestos: number | string;
  total: number | string;
  proyecto?: string | null;
  cliente?: string | null;
  cliente_email?: string | null;
  items?: QuotePdfItem[];
};

/**
 * Generates a branded PDF from the EXACT quote object the user clicked on.
 * If `items` are not provided, they are fetched fresh by quote id.
 */
export async function downloadQuotePdf(quote: QuotePdfData) {
  let items = quote.items;

  if (!items) {
    const { data, error } = await supabase
      .from("presupuesto_items")
      .select("nombre_historico, tipo_unidad_historica, cantidad, precio_unitario, subtotal_item, aplica_impuesto, impuesto_porcentaje")
      .eq("presupuesto_id", quote.id);
    if (error) throw new Error(error.message);
    items = (data ?? []) as QuotePdfItem[];
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  // Header — brand
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("PresuApp", margin, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Presupuesto profesional", pageWidth - margin, 44, { align: "right" });

  // Meta block (left)
  doc.setTextColor(30, 30, 30);
  let y = 110;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Presupuesto ${quote.codigo}`, margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  y += 22;
  doc.text(`Fecha de emisión: ${quote.fecha_emision ?? "—"}`, margin, y);
  y += 14;
  doc.text(`Estado: ${quote.estado}`, margin, y);

  // Client block (right)
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.text("Cliente", pageWidth - margin, 132, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90, 90, 90);
  doc.text(quote.cliente ?? "—", pageWidth - margin, 146, { align: "right" });
  if (quote.cliente_email) doc.text(quote.cliente_email, pageWidth - margin, 160, { align: "right" });
  doc.text(`Proyecto: ${quote.proyecto ?? "—"}`, pageWidth - margin, 174, { align: "right" });

  // Items table — REAL data (with per-item tax)
  autoTable(doc, {
    startY: 200,
    head: [["Concepto", "Unidad", "Cantidad", "Precio Unit.", "Imp. %", "Subtotal"]],
    body: items.map((it) => {
      const taxPct = it.aplica_impuesto === false ? 0 : Number(it.impuesto_porcentaje ?? 0);
      return [
        it.nombre_historico,
        it.tipo_unidad_historica,
        String(it.cantidad),
        money(Number(it.precio_unitario)),
        it.aplica_impuesto === false ? "—" : `${taxPct}%`,
        money(Number(it.subtotal_item)),
      ];
    }),
    styles: { fontSize: 10, cellPadding: 8 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, halign: "left" },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
    },
    margin: { left: margin, right: margin },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 20;
  const labelX = pageWidth - margin - 140;
  const valueX = pageWidth - margin;

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text("Subtotal", labelX, finalY);
  doc.text(money(Number(quote.subtotal)), valueX, finalY, { align: "right" });
  doc.text("Impuestos", labelX, finalY + 16);
  doc.text(money(Number(quote.impuestos)), valueX, finalY + 16, { align: "right" });

  doc.setDrawColor(220, 220, 220);
  doc.line(labelX, finalY + 24, valueX, finalY + 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(37, 99, 235);
  doc.text("TOTAL", labelX, finalY + 44);
  doc.text(money(Number(quote.total)), valueX, finalY + 44, { align: "right" });

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generado por PresuApp · ${new Date().toLocaleString("es-AR")}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 24,
    { align: "center" }
  );

  doc.save(`Presupuesto_${quote.codigo.replace("#", "")}.pdf`);
}

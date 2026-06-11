import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export async function downloadQuotePdf(presupuestoId: number) {
  // Load full quote + items + project + client
  const { data, error } = await supabase
    .from("presupuestos")
    .select(
      "id, codigo, fecha_emision, estado, subtotal, impuestos, total, proyectos!inner(nombre, clientes!inner(nombre, email))"
    )
    .eq("id", presupuestoId)
    .single();
  if (error || !data) throw new Error(error?.message || "No se pudo cargar el presupuesto.");

  const { data: items, error: itErr } = await supabase
    .from("presupuesto_items")
    .select("nombre_historico, tipo_unidad_historica, cantidad, precio_unitario, subtotal_item")
    .eq("presupuesto_id", presupuestoId);
  if (itErr) throw new Error(itErr.message);

  const proyecto: any = (data as any).proyectos;
  const cliente: any = proyecto?.clientes;

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

  // Meta block
  doc.setTextColor(30, 30, 30);
  let y = 110;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Presupuesto ${data.codigo}`, margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  y += 22;
  doc.text(`Fecha de emisión: ${data.fecha_emision ?? "—"}`, margin, y);
  y += 14;
  doc.text(`Estado: ${data.estado}`, margin, y);

  // Client block (right)
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.text("Cliente", pageWidth - margin, 132, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90, 90, 90);
  doc.text(cliente?.nombre ?? "—", pageWidth - margin, 146, { align: "right" });
  if (cliente?.email) doc.text(cliente.email, pageWidth - margin, 160, { align: "right" });
  doc.text(`Proyecto: ${proyecto?.nombre ?? "—"}`, pageWidth - margin, 174, { align: "right" });

  // Items table
  autoTable(doc, {
    startY: 200,
    head: [["Concepto", "Unidad", "Cantidad", "Precio Unit.", "Subtotal"]],
    body: (items ?? []).map((it: any) => [
      it.nombre_historico,
      it.tipo_unidad_historica,
      String(it.cantidad),
      money(Number(it.precio_unitario)),
      money(Number(it.subtotal_item)),
    ]),
    styles: { fontSize: 10, cellPadding: 8 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, halign: "left" },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
    margin: { left: margin, right: margin },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 20;
  const labelX = pageWidth - margin - 140;
  const valueX = pageWidth - margin;

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text("Subtotal", labelX, finalY);
  doc.text(money(Number(data.subtotal)), valueX, finalY, { align: "right" });
  doc.text("Impuestos", labelX, finalY + 16);
  doc.text(money(Number(data.impuestos)), valueX, finalY + 16, { align: "right" });

  doc.setDrawColor(220, 220, 220);
  doc.line(labelX, finalY + 24, valueX, finalY + 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(37, 99, 235);
  doc.text("TOTAL", labelX, finalY + 44);
  doc.text(money(Number(data.total)), valueX, finalY + 44, { align: "right" });

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

  doc.save(`Presupuesto_${data.codigo.replace("#", "")}.pdf`);
}

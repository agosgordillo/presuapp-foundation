import { useEffect, useState } from "react";
import { Check, Download, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { downloadQuotePdf } from "@/lib/pdf/quotePdf";

type Quote = { id: number; codigo: string; fecha_emision: string | null; total: number; subtotal: number; impuestos: number; estado: string; proyecto: string; cliente: string; cliente_email: string | null };
type Proyecto = { id: number; nombre: string; clientes?: { nombre: string } };

const STATUSES = ["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED"] as const;
const statusStyles: Record<string, string> = {
  DRAFT: "bg-secondary text-muted-foreground",
  SENT: "bg-primary-light text-primary-dark",
  VIEWED: "bg-warning-light text-warning-dark",
  ACCEPTED: "bg-success-light text-success-dark",
  REJECTED: "bg-destructive-light text-destructive-dark",
};
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

type LineItem = { nombre: string; tipo_unidad: string; cantidad: string; precio_unitario: string };

export default function QuotesList() {
  const [rows, setRows] = useState<Quote[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [proyectoId, setProyectoId] = useState("");
  const [taxPct, setTaxPct] = useState("21");
  const [items, setItems] = useState<LineItem[]>([{ nombre: "", tipo_unidad: "HR", cantidad: "1", precio_unitario: "0" }]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: q }, { data: p }] = await Promise.all([
      supabase.from("presupuestos").select("id, codigo, fecha_emision, subtotal, impuestos, total, estado, proyectos!inner(nombre, clientes!inner(nombre, email))").order("created_at", { ascending: false }),
      supabase.from("proyectos").select("id, nombre, clientes(nombre)").order("created_at", { ascending: false }),
    ]);
    setRows((q ?? []).map((r: any) => ({
      id: r.id, codigo: r.codigo, fecha_emision: r.fecha_emision,
      subtotal: Number(r.subtotal), impuestos: Number(r.impuestos), total: Number(r.total), estado: r.estado,
      proyecto: r.proyectos?.nombre ?? "—",
      cliente: r.proyectos?.clientes?.nombre ?? "—",
      cliente_email: r.proyectos?.clientes?.email ?? null,
    })));
    setProyectos((p ?? []) as any);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  // Math engine (client-side)
  const subtotal = items.reduce((s, it) => s + (Number(it.cantidad) || 0) * (Number(it.precio_unitario) || 0), 0);
  const taxRate = (Number(taxPct) || 0) / 100;
  const impuestos = subtotal * taxRate;
  const total = subtotal + impuestos;

  const addItem = () => setItems([...items, { nombre: "", tipo_unidad: "HR", cantidad: "1", precio_unitario: "0" }]);
  const rmItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const setItem = (i: number, k: keyof LineItem, v: string) => setItems(items.map((it, idx) => idx === i ? { ...it, [k]: v } : it));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proyectoId) return toast.error("Selecciona un proyecto.");
    if (items.length === 0) return toast.error("Agrega al menos un ítem.");
    for (const it of items) {
      if (!it.nombre.trim()) return toast.error("Cada ítem requiere un nombre.");
      if (!(Number(it.cantidad) > 0)) return toast.error("Cantidad inválida.");
      if (!(Number(it.precio_unitario) >= 0)) return toast.error("Precio inválido.");
    }
    setSaving(true);

    // Generate codigo (e.g. #007)
    const { count } = await supabase.from("presupuestos").select("*", { count: "exact", head: true });
    const codigo = `#${String((count ?? 0) + 1).padStart(3, "0")}`;

    const { data: ins, error } = await supabase.from("presupuestos").insert({
      proyecto_id: Number(proyectoId),
      codigo,
      fecha_emision: new Date().toISOString().slice(0, 10),
      estado: "DRAFT",
      subtotal: Number(subtotal.toFixed(2)),
      impuestos: Number(impuestos.toFixed(2)),
      total: Number(total.toFixed(2)),
    }).select("id").single();

    if (error || !ins) { setSaving(false); return toast.error(error?.message || "Error al guardar."); }

    const itemRows = items.map((it) => {
      const qty = Number(it.cantidad);
      const price = Number(it.precio_unitario);
      return {
        presupuesto_id: ins.id,
        nombre_historico: it.nombre,
        tipo_unidad_historica: it.tipo_unidad,
        cantidad: qty,
        precio_unitario: price,
        subtotal_item: Number((qty * price).toFixed(2)),
      };
    });
    const { error: itErr } = await supabase.from("presupuesto_items").insert(itemRows);
    setSaving(false);
    if (itErr) return toast.error(itErr.message);

    toast.success(`Presupuesto ${codigo} creado`, {
      action: { label: "Descargar PDF", onClick: () => downloadPdfById(ins.id) },
    });
    setShowForm(false);
    setProyectoId("");
    setItems([{ nombre: "", tipo_unidad: "HR", cantidad: "1", precio_unitario: "0" }]);
    load();
  };

  const updateStatus = async (id: number, estado: string) => {
    const { error } = await supabase.from("presupuestos").update({ estado }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Estado: ${estado}`);
    load();
  };

  const downloadPdf = async (quote: Quote) => {
    try {
      await downloadQuotePdf(quote);
      toast.success("PDF descargado");
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo generar el PDF.");
    }
  };

  const downloadPdfById = async (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (row) return downloadPdf(row);
    // Freshly created quote may not be in rows yet — fetch minimally
    const { data, error } = await supabase
      .from("presupuestos")
      .select("id, codigo, fecha_emision, subtotal, impuestos, total, estado, proyectos!inner(nombre, clientes!inner(nombre, email))")
      .eq("id", id)
      .single();
    if (error || !data) return toast.error(error?.message ?? "No se pudo cargar.");
    const r: any = data;
    return downloadPdf({
      id: r.id, codigo: r.codigo, fecha_emision: r.fecha_emision,
      subtotal: Number(r.subtotal), impuestos: Number(r.impuestos), total: Number(r.total), estado: r.estado,
      proyecto: r.proyectos?.nombre ?? "—",
      cliente: r.proyectos?.clientes?.nombre ?? "—",
      cliente_email: r.proyectos?.clientes?.email ?? null,
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">/quotes</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">Presupuestos — Centralizador Multi-Estado</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">Pipeline de cotizaciones con motor de cálculo cliente + persistencia transaccional en Lovable Cloud.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> {showForm ? "Cancelar" : "Nuevo presupuesto"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={save} className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2">
              <option value="">Seleccionar proyecto…</option>
              {proyectos.map((p) => <option key={p.id} value={p.id}>{p.nombre} — {p.clientes?.nombre ?? "—"}</option>)}
            </select>
            <input type="number" step="0.01" min="0" max="100" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} placeholder="Impuesto %" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ítems</p>
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <input value={it.nombre} onChange={(e) => setItem(i, "nombre", e.target.value)} placeholder="Concepto" className="col-span-5 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                <select value={it.tipo_unidad} onChange={(e) => setItem(i, "tipo_unidad", e.target.value)} className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  {["HR", "U", "SVC", "MES", "PROY"].map((u) => <option key={u}>{u}</option>)}
                </select>
                <input type="number" step="0.01" min="0" value={it.cantidad} onChange={(e) => setItem(i, "cantidad", e.target.value)} placeholder="Cant." className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                <input type="number" step="0.01" min="0" value={it.precio_unitario} onChange={(e) => setItem(i, "precio_unitario", e.target.value)} placeholder="Precio" className="col-span-2 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                <button type="button" onClick={() => rmItem(i)} className="col-span-1 inline-flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="text-xs font-semibold text-primary hover:underline">+ Agregar ítem</button>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-lg bg-surface p-4 text-sm">
            <div><p className="text-xs text-muted-foreground">Subtotal</p><p className="font-semibold text-heading">{money(subtotal)}</p></div>
            <div><p className="text-xs text-muted-foreground">Impuestos ({taxPct}%)</p><p className="font-semibold text-heading">{money(impuestos)}</p></div>
            <div><p className="text-xs text-muted-foreground">Total</p><p className="font-bold text-primary text-base">{money(total)}</p></div>
          </div>

          <button disabled={saving} className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70">
            {saving ? "Guardando..." : "Guardar presupuesto"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? <p className="p-6 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Cargando…</p>
        : rows.length === 0 ? <p className="p-6 text-sm text-muted-foreground">Aún no hay presupuestos. Crea el primero arriba.</p>
        : (
          <table className="w-full text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Código</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proyecto / Cliente</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Total</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((q) => (
                <tr key={q.id} className="hover:bg-surface/60">
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{q.codigo}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-heading">{q.proyecto}</p>
                    <p className="text-xs text-muted-foreground">{q.cliente}</p>
                  </td>
                  <td className="px-5 py-4">
                    <select value={q.estado} onChange={(e) => updateStatus(q.id, e.target.value)} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border-none cursor-pointer ${statusStyles[q.estado] ?? statusStyles.DRAFT}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {q.estado === "ACCEPTED" && <Check className="inline h-3 w-3 ml-1 text-success" />}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-heading">{money(q.total)}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => downloadPdf(q)}
                      title="Descargar PDF"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <Download className="h-3.5 w-3.5" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Download, FileText, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { downloadQuotePdf } from "@/lib/pdf/quotePdf";

type Quote = { id: number; codigo: string; fecha_emision: string | null; total: number; subtotal: number; impuestos: number; estado: string; proyecto: string; cliente: string; cliente_email: string | null; proyecto_id: number };
type Proyecto = { id: number; nombre: string; clientes?: { nombre: string } };
type CatalogItem = { id: number; nombre: string; tipo_unidad: string; precio_referecia: number; activo: boolean };

const STATUSES = ["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED"] as const;
const ESTADO_LABEL: Record<string, string> = {
  DRAFT: "Borrador", SENT: "Enviado", VIEWED: "Visto", ACCEPTED: "Aceptado", REJECTED: "Rechazado",
};
const statusStyles: Record<string, string> = {
  DRAFT: "bg-secondary text-muted-foreground",
  SENT: "bg-primary-light text-primary-dark",
  VIEWED: "bg-warning-light text-warning-dark",
  ACCEPTED: "bg-success-light text-success-dark",
  REJECTED: "bg-destructive-light text-destructive-dark",
};
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

// State machine: forward transitions only. ACCEPTED & REJECTED are terminal (reverts require confirmation).
const ALLOWED_NEXT: Record<string, string[]> = {
  DRAFT: ["SENT"],
  SENT: ["VIEWED", "ACCEPTED", "REJECTED"],
  VIEWED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
};

// Units that represent a flat / single deliverable — cantidad is fixed at 1 and hidden.
const FIXED_UNITS = new Set(["SVC", "PROY"]);

type LineItem = { catalogo_item_id: number | null; nombre: string; tipo_unidad: string; cantidad: string; precio_unitario: string; aplica_impuesto: boolean; impuesto_porcentaje: string };
const DEFAULT_TAX = "21";
const emptyItem = (): LineItem => ({ catalogo_item_id: null, nombre: "", tipo_unidad: "HR", cantidad: "1", precio_unitario: "0", aplica_impuesto: true, impuesto_porcentaje: DEFAULT_TAX });

export default function QuotesList() {
  const [rows, setRows] = useState<Quote[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [proyectoId, setProyectoId] = useState("");
  const [defaultTaxPct, setDefaultTaxPct] = useState(DEFAULT_TAX);
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: q }, { data: p }, { data: c }] = await Promise.all([
      supabase.from("presupuestos").select("id, codigo, fecha_emision, subtotal, impuestos, total, estado, proyecto_id, proyectos!inner(nombre, clientes!inner(nombre, email))").order("created_at", { ascending: false }),
      supabase.from("proyectos").select("id, nombre, clientes(nombre)").order("created_at", { ascending: false }),
      supabase.from("catalogo_items").select("id, nombre, tipo_unidad, precio_referecia, activo").eq("activo", true).order("nombre"),
    ]);
    setRows((q ?? []).map((r: any) => ({
      id: r.id, codigo: r.codigo, fecha_emision: r.fecha_emision, proyecto_id: r.proyecto_id,
      subtotal: Number(r.subtotal), impuestos: Number(r.impuestos), total: Number(r.total), estado: r.estado,
      proyecto: r.proyectos?.nombre ?? "—",
      cliente: r.proyectos?.clientes?.nombre ?? "—",
      cliente_email: r.proyectos?.clientes?.email ?? null,
    })));
    setProyectos((p ?? []) as any);
    setCatalog((c ?? []).map((r: any) => ({ ...r, precio_referecia: Number(r.precio_referecia) })));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { DRAFT: 0, SENT: 0, VIEWED: 0, ACCEPTED: 0, REJECTED: 0 };
    rows.forEach((r) => { c[r.estado] = (c[r.estado] ?? 0) + 1; });
    return c;
  }, [rows]);

  const { subtotal, impuestos, total } = useMemo(() => {
    let sub = 0;
    let imp = 0;
    for (const it of items) {
      const base = (Number(it.cantidad) || 0) * (Number(it.precio_unitario) || 0);
      sub += base;
      if (it.aplica_impuesto) imp += base * ((Number(it.impuesto_porcentaje) || 0) / 100);
    }
    return { subtotal: sub, impuestos: imp, total: sub + imp };
  }, [items]);

  const resetForm = () => {
    setEditingId(null); setProyectoId(""); setDefaultTaxPct(DEFAULT_TAX);
    setItems([emptyItem()]); setShowForm(false);
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const rmItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const setItem = (i: number, patch: Partial<LineItem>) => setItems((prev) => prev.map((it, idx) => {
    if (idx !== i) return it;
    const next = { ...it, ...patch };
    // If switching to a fixed-quantity unit, force cantidad = 1
    if (patch.tipo_unidad && FIXED_UNITS.has(patch.tipo_unidad)) next.cantidad = "1";
    return next;
  }));

  const pickCatalog = (i: number, catId: string) => {
    if (!catId) return setItem(i, { catalogo_item_id: null });
    const c = catalog.find((x) => x.id === Number(catId));
    if (!c) return;
    setItem(i, {
      catalogo_item_id: c.id,
      nombre: c.nombre,
      tipo_unidad: c.tipo_unidad,
      precio_unitario: String(c.precio_referecia),
      cantidad: "1",
      impuesto_porcentaje: defaultTaxPct,
      aplica_impuesto: true,
    });
  };

  const startNew = () => { resetForm(); setShowForm(true); };

  const startEdit = async (q: Quote) => {
    const { data, error } = await supabase
      .from("presupuesto_items")
      .select("nombre_historico, tipo_unidad_historica, cantidad, precio_unitario, aplica_impuesto, impuesto_porcentaje")
      .eq("presupuesto_id", q.id);
    if (error) return toast.error(error.message);
    setEditingId(q.id);
    setProyectoId(String(q.proyecto_id));
    setDefaultTaxPct(DEFAULT_TAX);
    setItems((data ?? []).map((r: any) => ({
      catalogo_item_id: null,
      nombre: r.nombre_historico,
      tipo_unidad: r.tipo_unidad_historica,
      cantidad: String(r.cantidad),
      precio_unitario: String(r.precio_unitario),
      aplica_impuesto: r.aplica_impuesto ?? true,
      impuesto_porcentaje: String(r.impuesto_porcentaje ?? DEFAULT_TAX),
    })));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

    const itemRows = (presupuesto_id: number) => items.map((it) => {
      const qty = Number(it.cantidad);
      const price = Number(it.precio_unitario);
      return {
        presupuesto_id,
        nombre_historico: it.nombre,
        tipo_unidad_historica: it.tipo_unidad,
        cantidad: qty,
        precio_unitario: price,
        subtotal_item: Number((qty * price).toFixed(2)),
        aplica_impuesto: it.aplica_impuesto,
        impuesto_porcentaje: Number(it.impuesto_porcentaje) || 0,
      };
    });

    try {
      if (editingId != null) {
        const { error: upErr } = await supabase.from("presupuestos").update({
          proyecto_id: Number(proyectoId),
          subtotal: Number(subtotal.toFixed(2)),
          impuestos: Number(impuestos.toFixed(2)),
          total: Number(total.toFixed(2)),
        }).eq("id", editingId);
        if (upErr) throw upErr;
        const { error: delErr } = await supabase.from("presupuesto_items").delete().eq("presupuesto_id", editingId);
        if (delErr) throw delErr;
        const { error: insErr } = await supabase.from("presupuesto_items").insert(itemRows(editingId));
        if (insErr) throw insErr;
        toast.success("Presupuesto actualizado");
      } else {
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
        if (error || !ins) throw error ?? new Error("Error al guardar.");
        const { error: itErr } = await supabase.from("presupuesto_items").insert(itemRows(ins.id));
        if (itErr) throw itErr;
        toast.success(`Presupuesto ${codigo} creado`);
      }
      await load();
      resetForm();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (q: Quote) => {
    if (!confirm(`¿Eliminar presupuesto ${q.codigo}? Esta acción no se puede deshacer.`)) return;
    const { error: itErr } = await supabase.from("presupuesto_items").delete().eq("presupuesto_id", q.id);
    if (itErr) return toast.error(itErr.message);
    const { error } = await supabase.from("presupuestos").delete().eq("id", q.id);
    if (error) return toast.error(error.message);
    toast.success("Presupuesto eliminado");
    await load();
  };

  const duplicate = async (q: Quote) => {
    const { data: src, error: srcErr } = await supabase
      .from("presupuesto_items")
      .select("nombre_historico, tipo_unidad_historica, cantidad, precio_unitario, subtotal_item")
      .eq("presupuesto_id", q.id);
    if (srcErr) return toast.error(srcErr.message);
    const { count } = await supabase.from("presupuestos").select("*", { count: "exact", head: true });
    const codigo = `#${String((count ?? 0) + 1).padStart(3, "0")}`;
    const { data: ins, error } = await supabase.from("presupuestos").insert({
      proyecto_id: q.proyecto_id,
      codigo,
      fecha_emision: new Date().toISOString().slice(0, 10),
      estado: "DRAFT",
      subtotal: q.subtotal,
      impuestos: q.impuestos,
      total: q.total,
    }).select("id").single();
    if (error || !ins) return toast.error(error?.message || "Error al duplicar.");
    if (src && src.length > 0) {
      const { error: itErr } = await supabase.from("presupuesto_items").insert(
        src.map((r: any) => ({ ...r, presupuesto_id: ins.id }))
      );
      if (itErr) return toast.error(itErr.message);
    }
    toast.success(`Duplicado como ${codigo} (Borrador)`);
    await load();
  };

  const updateStatus = async (q: Quote, estado: string) => {
    if (estado === q.estado) return;
    const allowed = ALLOWED_NEXT[q.estado] ?? [];
    const isForward = allowed.includes(estado);

    // Revert from ACCEPTED → warn about preserved payment history
    if (q.estado === "ACCEPTED" && estado !== "ACCEPTED") {
      const { count: payCount } = await supabase
        .from("pagos")
        .select("*", { count: "exact", head: true })
        .eq("proyecto_id", q.proyecto_id);
      const msg = payCount && payCount > 0
        ? `⚠️ Advertencia: este presupuesto está ACEPTADO y el proyecto tiene ${payCount} pago(s) registrado(s).\n\nAl revertir a "${ESTADO_LABEL[estado]}" el valor de contrato cambiará, pero los pagos se conservarán en el historial para auditoría.\n\n¿Confirmas el cambio?`
        : `⚠️ Vas a revertir un presupuesto ACEPTADO a "${ESTADO_LABEL[estado]}". Esto deshabilitará nuevos pagos si no hay otros presupuestos aceptados.\n\n¿Continuar?`;
      if (!confirm(msg)) return;
    } else if (!isForward) {
      // Non-forward transition that isn't an ACCEPTED revert (e.g. REJECTED → SENT, or skipping steps)
      if (!confirm(`Transición no estándar: ${ESTADO_LABEL[q.estado]} → ${ESTADO_LABEL[estado]}.\n\nEl flujo recomendado es Borrador → Enviado → Visto → Aceptado/Rechazado.\n\n¿Continuar de todos modos?`)) return;
    }

    const { error } = await supabase.from("presupuestos").update({ estado }).eq("id", q.id);
    if (error) return toast.error(error.message);

    if (estado === "ACCEPTED") {
      toast.success(`Aceptado — Módulo de Pagos habilitado para "${q.proyecto}"`);
    } else {
      toast.success(`Estado: ${ESTADO_LABEL[estado] ?? estado}`);
    }
    await load();
  };

  const downloadPdf = async (quote: Quote) => {
    try { await downloadQuotePdf(quote); toast.success("PDF descargado"); }
    catch (e: any) { toast.error(e?.message ?? "No se pudo generar el PDF."); }
  };

  const metricCards: { key: typeof STATUSES[number]; label: string }[] = [
    { key: "DRAFT", label: "Borradores" },
    { key: "SENT", label: "Enviados" },
    { key: "VIEWED", label: "Vistos" },
    { key: "ACCEPTED", label: "Aceptados" },
    { key: "REJECTED", label: "Rechazados" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">/presupuestos</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">Presupuestos — Centralizador Multi-Estado</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">Pipeline de cotizaciones con motor de cálculo cliente + persistencia transaccional en Lovable Cloud.</p>
        </div>
        <button onClick={() => showForm ? resetForm() : startNew()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> {showForm ? "Cancelar" : "Nuevo presupuesto"}
        </button>
      </header>

      {/* Métricas por estado */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {metricCards.map((m) => (
          <div key={m.key} className={`rounded-2xl border border-border bg-card p-4 ${counts[m.key] > 0 ? "" : "opacity-70"}`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <p className="mt-2 text-2xl font-bold text-heading">{counts[m.key] ?? 0}</p>
            <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[m.key]}`}>{ESTADO_LABEL[m.key]}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={save} className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-heading">
              {editingId != null ? "Editar presupuesto" : "Nuevo presupuesto"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2">
              <option value="">Seleccionar proyecto…</option>
              {proyectos.map((p) => <option key={p.id} value={p.id}>{p.nombre} — {p.clientes?.nombre ?? "—"}</option>)}
            </select>
            <input type="number" step="0.01" min="0" max="100" value={defaultTaxPct} onChange={(e) => setDefaultTaxPct(e.target.value)} placeholder="Impuesto % por defecto" title="Impuesto % por defecto para nuevos ítems" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ítems</p>
            {items.map((it, i) => {
              const isFixed = FIXED_UNITS.has(it.tipo_unidad);
              const base = (Number(it.cantidad) || 0) * (Number(it.precio_unitario) || 0);
              const itemTax = it.aplica_impuesto ? base * ((Number(it.impuesto_porcentaje) || 0) / 100) : 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="grid grid-cols-12 gap-2 items-start">
                    <select
                      value={it.catalogo_item_id ?? ""}
                      onChange={(e) => pickCatalog(i, e.target.value)}
                      className="col-span-3 rounded-lg border border-border bg-background px-2 py-2 text-xs"
                      title="Cargar desde catálogo"
                    >
                      <option value="">— Catálogo —</option>
                      {catalog.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    <input value={it.nombre} onChange={(e) => setItem(i, { nombre: e.target.value })} placeholder="Concepto" className="col-span-3 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                    <select value={it.tipo_unidad} onChange={(e) => setItem(i, { tipo_unidad: e.target.value })} className="col-span-1 rounded-lg border border-border bg-background px-2 py-2 text-sm">
                      {["HR", "U", "SVC", "MES", "PROY"].map((u) => <option key={u}>{u}</option>)}
                    </select>
                    {isFixed ? (
                      <div className="col-span-1 text-center text-xs text-muted-foreground pt-2.5" title="Unidad fija — cantidad = 1">—</div>
                    ) : (
                      <input type="number" step="0.01" min="0" value={it.cantidad} onChange={(e) => setItem(i, { cantidad: e.target.value })} placeholder="Cant." className="col-span-1 rounded-lg border border-border bg-background px-2 py-2 text-sm" />
                    )}
                    <input type="number" step="0.01" min="0" value={it.precio_unitario} onChange={(e) => setItem(i, { precio_unitario: e.target.value })} placeholder={isFixed ? "Precio total" : "Precio"} className="col-span-2 rounded-lg border border-border bg-background px-2 py-2 text-sm" />
                    <div className="col-span-1 text-right text-xs font-semibold text-heading pt-2">
                      {money(base)}
                    </div>
                    <button type="button" onClick={() => rmItem(i)} className="col-span-1 inline-flex items-center justify-center rounded-lg border border-border py-2 text-muted-foreground hover:text-destructive hover:border-destructive/40">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 pl-1 text-xs text-muted-foreground">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={it.aplica_impuesto}
                        onChange={(e) => setItem(i, { aplica_impuesto: e.target.checked })}
                        className="h-3.5 w-3.5 rounded border-border accent-primary"
                      />
                      <span>Aplica impuesto</span>
                    </label>
                    <div className="inline-flex items-center gap-1">
                      <input
                        type="number" step="0.01" min="0" max="100"
                        value={it.impuesto_porcentaje}
                        disabled={!it.aplica_impuesto}
                        onChange={(e) => setItem(i, { impuesto_porcentaje: e.target.value })}
                        className="w-16 rounded-md border border-border bg-background px-2 py-1 text-xs disabled:opacity-50"
                      />
                      <span>%</span>
                    </div>
                    <span className="ml-auto">
                      Impuesto ítem: <span className="font-semibold text-heading">{money(itemTax)}</span>
                    </span>
                  </div>
                </div>
              );
            })}
            <button type="button" onClick={addItem} className="text-xs font-semibold text-primary hover:underline">+ Agregar ítem</button>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-lg bg-surface p-4 text-sm">
            <div><p className="text-xs text-muted-foreground">Subtotal</p><p className="font-semibold text-heading">{money(subtotal)}</p></div>
            <div><p className="text-xs text-muted-foreground">Impuestos (por ítem)</p><p className="font-semibold text-heading">{money(impuestos)}</p></div>
            <div><p className="text-xs text-muted-foreground">Total</p><p className="font-bold text-primary text-base">{money(total)}</p></div>
          </div>

          <div className="flex gap-2">
            <button disabled={saving} className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70">
              {saving ? "Guardando..." : editingId != null ? "Actualizar presupuesto" : "Guardar presupuesto"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-surface">
              Cancelar
            </button>
          </div>
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
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Acciones</th>
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
                    <select value={q.estado} onChange={(e) => updateStatus(q, e.target.value)} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border-none cursor-pointer ${statusStyles[q.estado] ?? statusStyles.DRAFT}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{ESTADO_LABEL[s]}</option>)}
                    </select>
                    {q.estado === "ACCEPTED" && <Check className="inline h-3 w-3 ml-1 text-success" />}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-heading">{money(q.total)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => downloadPdf(q)} title="Descargar PDF" className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground">
                        <FileText className="h-3.5 w-3.5" /><Download className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => startEdit(q)} title="Editar" className="inline-flex items-center rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-heading hover:bg-surface">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => duplicate(q)} title="Duplicar" className="inline-flex items-center rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-heading hover:bg-surface">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => remove(q)} title="Eliminar" className="inline-flex items-center rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/40">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
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

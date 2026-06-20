import { supabase } from "@/integrations/supabase/client";

export type Quote = {
  id: number;
  codigo: string;
  fecha_emision: string | null;
  total: number;
  subtotal: number;
  impuestos: number;
  estado: string;
  proyecto: string;
  cliente: string;
  cliente_email: string | null;
  proyecto_id: number;
};

export type Proyecto = { id: number; nombre: string; clientes?: { nombre: string } };

export type QuoteHeaderInput = {
  proyecto_id: number;
  subtotal: number;
  impuestos: number;
  total: number;
};

export type QuoteItemInput = {
  presupuesto_id: number;
  nombre_historico: string;
  tipo_unidad_historica: string;
  cantidad: number;
  precio_unitario: number;
  subtotal_item: number;
  aplica_impuesto: boolean;
  impuesto_porcentaje: number;
};

export type QuoteItemEditRow = {
  nombre_historico: string;
  tipo_unidad_historica: string;
  cantidad: number;
  precio_unitario: number;
  aplica_impuesto: boolean | null;
  impuesto_porcentaje: number | null;
};

export type QuoteByProject = { id: number; codigo: string; total: number; estado: string };

export type DashboardMetrics = {
  facturado: number;
  cobrado: number;
  pendiente: number;
  clientes: number;
  recientes: { id: number; codigo: string; cliente: string; total: number; estado: string }[];
};

export async function getQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from("presupuestos")
    .select(
      "id, codigo, fecha_emision, subtotal, impuestos, total, estado, proyecto_id, proyectos!inner(nombre, clientes!inner(nombre, email))",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    codigo: r.codigo,
    fecha_emision: r.fecha_emision,
    proyecto_id: r.proyecto_id,
    subtotal: Number(r.subtotal),
    impuestos: Number(r.impuestos),
    total: Number(r.total),
    estado: r.estado,
    proyecto: r.proyectos?.nombre ?? "—",
    cliente: r.proyectos?.clientes?.nombre ?? "—",
    cliente_email: r.proyectos?.clientes?.email ?? null,
  }));
}

export async function getProyectoOptions(): Promise<Proyecto[]> {
  const { data, error } = await supabase
    .from("proyectos")
    .select("id, nombre, clientes(nombre)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as any;
}

export async function getQuoteItemsForEdit(presupuestoId: number): Promise<QuoteItemEditRow[]> {
  const { data, error } = await supabase
    .from("presupuesto_items")
    .select("nombre_historico, tipo_unidad_historica, cantidad, precio_unitario, aplica_impuesto, impuesto_porcentaje")
    .eq("presupuesto_id", presupuestoId);
  if (error) throw error;
  return (data ?? []) as QuoteItemEditRow[];
}

export async function getNextQuoteCodigo(): Promise<string> {
  const { count } = await supabase.from("presupuestos").select("*", { count: "exact", head: true });
  return `#${String((count ?? 0) + 1).padStart(3, "0")}`;
}

export async function updateQuoteHeader(id: number, input: QuoteHeaderInput) {
  const { error } = await supabase.from("presupuestos").update(input).eq("id", id);
  if (error) throw error;
}

export async function createQuote(input: QuoteHeaderInput & { codigo: string; fecha_emision: string; estado: string }): Promise<number> {
  const { data, error } = await supabase.from("presupuestos").insert(input).select("id").single();
  if (error || !data) throw error ?? new Error("Error al guardar.");
  return data.id;
}

export async function deleteQuoteItems(presupuestoId: number) {
  const { error } = await supabase.from("presupuesto_items").delete().eq("presupuesto_id", presupuestoId);
  if (error) throw error;
}

export async function insertQuoteItems(items: QuoteItemInput[]) {
  const { error } = await supabase.from("presupuesto_items").insert(items);
  if (error) throw error;
}

export async function deleteQuote(id: number) {
  const { error: itErr } = await supabase.from("presupuesto_items").delete().eq("presupuesto_id", id);
  if (itErr) throw itErr;
  const { error } = await supabase.from("presupuestos").delete().eq("id", id);
  if (error) throw error;
}

export async function duplicateQuote(q: Quote): Promise<string> {
  const { data: src, error: srcErr } = await supabase
    .from("presupuesto_items")
    .select("nombre_historico, tipo_unidad_historica, cantidad, precio_unitario, subtotal_item, aplica_impuesto, impuesto_porcentaje")
    .eq("presupuesto_id", q.id);
  if (srcErr) throw srcErr;
  const codigo = await getNextQuoteCodigo();
  const { data: ins, error } = await supabase
    .from("presupuestos")
    .insert({
      proyecto_id: q.proyecto_id,
      codigo,
      fecha_emision: new Date().toISOString().slice(0, 10),
      estado: "DRAFT",
      subtotal: q.subtotal,
      impuestos: q.impuestos,
      total: q.total,
    })
    .select("id")
    .single();
  if (error || !ins) throw error ?? new Error("Error al duplicar.");
  if (src && src.length > 0) {
    const { error: itErr } = await supabase
      .from("presupuesto_items")
      .insert(src.map((r: any) => ({ ...r, presupuesto_id: ins.id })));
    if (itErr) throw itErr;
  }
  return codigo;
}

export async function updateQuoteEstado(id: number, estado: string) {
  const { error } = await supabase.from("presupuestos").update({ estado }).eq("id", id);
  if (error) throw error;
}

export async function countPagosByProject(projectId: number): Promise<number> {
  const { count } = await supabase
    .from("pagos")
    .select("*", { count: "exact", head: true })
    .eq("proyecto_id", projectId);
  return count ?? 0;
}

export async function getQuotesByProject(projectId: number): Promise<QuoteByProject[]> {
  const { data, error } = await supabase
    .from("presupuestos")
    .select("id, codigo, total, estado")
    .eq("proyecto_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ ...r, total: Number(r.total) })) as QuoteByProject[];
}

export async function getAcceptedTotalsByProjectIds(projectIds: number[]): Promise<number> {
  if (projectIds.length === 0) return 0;
  const { data, error } = await supabase
    .from("presupuestos")
    .select("total")
    .eq("estado", "ACCEPTED")
    .in("proyecto_id", projectIds);
  if (error) throw error;
  return (data ?? []).reduce((s, r: any) => s + Number(r.total), 0);
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [{ data: accepted }, { data: pagos }, { count: cliCount }, { data: recientes }] = await Promise.all([
    supabase.from("presupuestos").select("total,estado").eq("estado", "ACCEPTED"),
    supabase.from("pagos").select("monto"),
    supabase.from("clientes").select("*", { count: "exact", head: true }),
    supabase
      .from("presupuestos")
      .select("id, codigo, total, estado, proyectos!inner(clientes!inner(nombre))")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  const facturado = (accepted ?? []).reduce((s, r: any) => s + Number(r.total), 0);
  const cobrado = (pagos ?? []).reduce((s, r: any) => s + Number(r.monto), 0);
  const pendiente = Math.max(0, facturado - cobrado);
  const recientesFormatted = (recientes ?? []).map((r: any) => ({
    id: r.id,
    codigo: r.codigo,
    cliente: r.proyectos?.clientes?.nombre ?? "—",
    total: Number(r.total),
    estado: r.estado,
  }));
  return { facturado, cobrado, pendiente, clientes: cliCount ?? 0, recientes: recientesFormatted };
}

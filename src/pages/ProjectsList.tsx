import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Row = { id: number; nombre: string; estado: string; cliente: string; cliente_id: number };
type ClienteOpt = { id: number; nombre: string };

export default function ProjectsList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [clientes, setClientes] = useState<ClienteOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", cliente_id: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("proyectos").select("id, nombre, estado, cliente_id, clientes!inner(nombre)").order("created_at", { ascending: false }),
      supabase.from("clientes").select("id, nombre").order("nombre"),
    ]);
    setRows((p ?? []).map((r: any) => ({ id: r.id, nombre: r.nombre, estado: r.estado, cliente_id: r.cliente_id, cliente: r.clientes?.nombre ?? "—" })));
    setClientes((c ?? []) as ClienteOpt[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.cliente_id) return toast.error("Nombre y cliente son obligatorios.");
    setSaving(true);
    const { error } = await supabase.from("proyectos").insert({
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      cliente_id: Number(form.cliente_id),
      estado: "ACTIVE",
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Proyecto creado");
    setForm({ nombre: "", descripcion: "", cliente_id: "" });
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">/projects</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">Proyectos — Pipeline Activo</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">Grid de proyectos en ejecución, persistido en Lovable Cloud.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> {showForm ? "Cancelar" : "Nuevo proyecto"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={save} className="rounded-2xl border border-border bg-card p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del proyecto" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <select value={form.cliente_id} onChange={(e) => setForm({ ...form, cliente_id: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="">Seleccionar cliente…</option>
            {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          
          <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2 min-h-[80px]" />
          <button disabled={saving} className="md:col-span-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70">
            {saving ? "Guardando..." : "Guardar proyecto"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Aún no tienes proyectos.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rows.map((p) => (
            <Link key={p.id} to="/projects/$id" params={{ id: String(p.id) }} className="group rounded-2xl border border-border bg-card p-5 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30 transition-all">
              <p className="text-xs text-muted-foreground">{p.cliente}</p>
              <h3 className="mt-1 text-lg font-semibold text-heading group-hover:text-primary">{p.nombre}</h3>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">{p.estado}</span>
                <ArrowUpRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

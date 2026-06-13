import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Row = { id: number; nombre: string; email: string; telefono: string; empresa: string; proyectos: number };
type FormState = { nombre: string; email: string; telefono: string; empresa: string };
const EMPTY: FormState = { nombre: "", email: "", telefono: "", empresa: "" };

export default function ClientsList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nombre, email, telefono, empresa, proyectos(count)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows(
      (data ?? []).map((c: any) => ({
        id: c.id, nombre: c.nombre, email: c.email, telefono: c.telefono, empresa: c.empresa,
        proyectos: c.proyectos?.[0]?.count ?? 0,
      })),
    );
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.nombre.toLowerCase().includes(q) || r.empresa.toLowerCase().includes(q));
  }, [rows, query]);

  const resetForm = () => { setForm(EMPTY); setEditingId(null); setShowForm(false); };

  const startEdit = (r: Row) => {
    setEditingId(r.id);
    setForm({ nombre: r.nombre, email: r.email, telefono: r.telefono, empresa: r.empresa });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.telefono || !form.empresa) {
      return toast.error("Completa todos los campos.");
    }
    setSaving(true);
    if (editingId != null) {
      const { error } = await supabase.from("clientes").update(form).eq("id", editingId);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Cliente actualizado");
    } else {
      const { data: u } = await supabase.from("usuarios").select("id").maybeSingle();
      if (!u) { setSaving(false); return toast.error("Inicia sesión para crear clientes."); }
      const { error } = await supabase.from("clientes").insert({ ...form, usuario_id: u.id });
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Cliente creado");
    }
    resetForm();
    load();
  };

  const remove = async (r: Row) => {
    if (r.proyectos > 0) {
      return toast.error(`No se puede eliminar: el cliente tiene ${r.proyectos} proyecto(s) activo(s).`);
    }
    if (!confirm(`¿Eliminar al cliente "${r.nombre}"? Esta acción no se puede deshacer.`)) return;
    const { error } = await supabase.from("clientes").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Cliente eliminado");
    load();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">/clientes</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">Clientes — Cartera de Cuentas</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">Gestiona, edita y filtra tus clientes. La eliminación se restringe si existen proyectos asociados.</p>
        </div>
        <button onClick={() => { if (showForm) resetForm(); else setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> {showForm ? "Cancelar" : "Nuevo cliente"}
        </button>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o empresa…"
          className="w-full rounded-lg border border-border bg-background pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={save} className="rounded-2xl border border-border bg-card p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-heading">{editingId != null ? "Editar cliente" : "Nuevo cliente"}</p>
            {editingId != null && <button type="button" onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground">Cancelar edición</button>}
          </div>
          <Input ph="Nombre" v={form.nombre} on={(v) => setForm({ ...form, nombre: v })} />
          <Input ph="Email" type="email" v={form.email} on={(v) => setForm({ ...form, email: v })} />
          <Input ph="Teléfono" v={form.telefono} on={(v) => setForm({ ...form, telefono: v })} />
          <Input ph="Empresa" v={form.empresa} on={(v) => setForm({ ...form, empresa: v })} />
          <button disabled={saving} className="md:col-span-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70">
            {saving ? "Guardando..." : editingId != null ? "Actualizar cliente" : "Guardar cliente"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Cargando…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">{query ? "Sin resultados para tu búsqueda." : "Aún no tienes clientes. Crea el primero arriba."}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <Th>Cliente</Th><Th>Email</Th><Th>Empresa</Th><Th>Proyectos</Th><Th className="text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-surface/60">
                  <td className="px-5 py-4 font-semibold text-heading">{c.nombre}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.email}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.empresa}</td>
                  <td className="px-5 py-4">{c.proyectos}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to="/clients/$id" params={{ id: String(c.id) }} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark">
                        Abrir <ArrowUpRight className="h-3 w-3" />
                      </Link>
                      <button onClick={() => startEdit(c)} title="Editar" className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-primary hover:border-primary/40">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(c)}
                        title={c.proyectos > 0 ? "No se puede eliminar: tiene proyectos" : "Eliminar"}
                        disabled={c.proyectos > 0}
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
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

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${className}`}>{children}</th>;
}
function Input({ v, on, ph, type = "text" }: { v: string; on: (v: string) => void; ph: string; type?: string }) {
  return <input type={type} value={v} onChange={(e) => on(e.target.value)} placeholder={ph} className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />;
}

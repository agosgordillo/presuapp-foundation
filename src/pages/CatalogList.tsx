import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Power, PowerOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Item = {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo_unidad: string;
  precio_referecia: number;
  activo: boolean;
};
const UNITS = ["HR", "U", "SVC", "MES", "PROY"] as const;

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

type FormState = { nombre: string; descripcion: string; tipo_unidad: string; precio_referecia: string };
const EMPTY: FormState = { nombre: "", descripcion: "", tipo_unidad: "HR", precio_referecia: "" };

export default function CatalogList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [showInactive, setShowInactive] = useState(true);

  const load = async () => {
    const { data, error } = await supabase.from("catalogo_items").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data ?? []).map((r: any) => ({ ...r, precio_referecia: Number(r.precio_referecia), activo: r.activo ?? true })));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(EMPTY); setEditingId(null); setShowForm(false); };

  const startEdit = (i: Item) => {
    setEditingId(i.id);
    setForm({
      nombre: i.nombre,
      descripcion: i.descripcion ?? "",
      tipo_unidad: i.tipo_unidad,
      precio_referecia: String(i.precio_referecia),
    });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const precio = Number(form.precio_referecia);
    if (!form.nombre || !Number.isFinite(precio) || precio < 0) return toast.error("Completa nombre y precio válido.");
    setSaving(true);
    if (editingId != null) {
      const { error } = await supabase.from("catalogo_items").update({
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        tipo_unidad: form.tipo_unidad,
        precio_referecia: precio,
      }).eq("id", editingId);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Ítem actualizado");
    } else {
      const { data: u } = await supabase.from("usuarios").select("id").maybeSingle();
      if (!u) { setSaving(false); return toast.error("Inicia sesión."); }
      const { error } = await supabase.from("catalogo_items").insert({
        usuario_id: u.id,
        nombre: form.nombre,
        descripcion: form.descripcion || null,
        tipo_unidad: form.tipo_unidad,
        precio_referecia: precio,
      });
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Ítem creado");
    }
    resetForm();
    load();
  };

  const toggleActivo = async (i: Item) => {
    const { error } = await supabase.from("catalogo_items").update({ activo: !i.activo }).eq("id", i.id);
    if (error) return toast.error(error.message);
    toast.success(i.activo ? "Ítem desactivado" : "Ítem activado");
    load();
  };

  const remove = async (i: Item) => {
    if (!confirm(`¿Eliminar el ítem "${i.nombre}"? Los presupuestos históricos que lo usan no se verán afectados.`)) return;
    const { error } = await supabase.from("catalogo_items").delete().eq("id", i.id);
    if (error) return toast.error(error.message);
    toast.success("Ítem eliminado");
    load();
  };

  const visible = showInactive ? items : items.filter((i) => i.activo);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">/catalogo</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">Catálogo — Inventario de Servicios</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">Ítems reutilizables. Desactiva los obsoletos para ocultarlos al crear presupuestos sin afectar los históricos.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="rounded border-border" />
            Mostrar inactivos
          </label>
          <button onClick={() => { if (showForm) resetForm(); else setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
            <Plus className="h-4 w-4" /> {showForm ? "Cancelar" : "Nuevo ítem"}
          </button>
        </div>
      </header>

      {showForm && (
        <form onSubmit={save} className="rounded-2xl border border-border bg-card p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-heading">{editingId != null ? "Editar ítem" : "Nuevo ítem"}</p>
            {editingId != null && <button type="button" onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground">Cancelar edición</button>}
          </div>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre" className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2" />
          <select value={form.tipo_unidad} onChange={(e) => setForm({ ...form, tipo_unidad: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
          <input type="number" step="0.01" min="0" value={form.precio_referecia} onChange={(e) => setForm({ ...form, precio_referecia: e.target.value })} placeholder="Precio referencia" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-4 min-h-[60px]" />
          <button disabled={saving} className="md:col-span-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70">
            {saving ? "Guardando..." : editingId != null ? "Actualizar ítem" : "Guardar ítem"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? <p className="p-6 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Cargando…</p>
        : visible.length === 0 ? <p className="p-6 text-sm text-muted-foreground">Catálogo vacío.</p>
        : (
          <table className="w-full text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Servicio</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unidad</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Precio</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((i) => (
                <tr key={i.id} className={`hover:bg-surface/60 ${!i.activo ? "opacity-60" : ""}`}>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">#{i.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-heading">{i.nombre}</p>
                    {i.descripcion && <p className="text-xs text-muted-foreground">{i.descripcion}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-md bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary-dark">{i.tipo_unidad}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleActivo(i)}
                      title={i.activo ? "Desactivar" : "Activar"}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${i.activo ? "bg-success-light text-success-dark" : "bg-secondary text-muted-foreground"}`}
                    >
                      {i.activo ? <Power className="h-3 w-3" /> : <PowerOff className="h-3 w-3" />}
                      {i.activo ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-heading">{money(i.precio_referecia)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(i)} title="Editar" className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-primary hover:border-primary/40">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => remove(i)} title="Eliminar" className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40">
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

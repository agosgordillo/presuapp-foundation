import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Item = { id: number; nombre: string; descripcion: string | null; tipo_unidad: string; precio_referecia: number };
const UNITS = ["HR", "U", "SVC", "MES", "PROY"] as const;

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function CatalogList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", tipo_unidad: "HR", precio_referecia: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("catalogo_items").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data ?? []).map((r: any) => ({ ...r, precio_referecia: Number(r.precio_referecia) })));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const precio = Number(form.precio_referecia);
    if (!form.nombre || !Number.isFinite(precio) || precio < 0) return toast.error("Completa nombre y precio válido.");
    setSaving(true);
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
    setForm({ nombre: "", descripcion: "", tipo_unidad: "HR", precio_referecia: "" });
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">/catalog</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-heading">Catálogo — Inventario de Servicios</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">Ítems reutilizables persistidos en Lovable Cloud para reutilizar en presupuestos.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> {showForm ? "Cancelar" : "Nuevo ítem"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={save} className="rounded-2xl border border-border bg-card p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre" className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2" />
          <select value={form.tipo_unidad} onChange={(e) => setForm({ ...form, tipo_unidad: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
          <input type="number" step="0.01" min="0" value={form.precio_referecia} onChange={(e) => setForm({ ...form, precio_referecia: e.target.value })} placeholder="Precio referencia" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-4 min-h-[60px]" />
          <button disabled={saving} className="md:col-span-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70">
            {saving ? "Guardando..." : "Guardar ítem"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? <p className="p-6 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Cargando…</p>
        : items.length === 0 ? <p className="p-6 text-sm text-muted-foreground">Catálogo vacío. Crea tu primer ítem.</p>
        : (
          <table className="w-full text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Servicio</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Unidad</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Precio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((i) => (
                <tr key={i.id} className="hover:bg-surface/60">
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">#{i.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-heading">{i.nombre}</p>
                    {i.descripcion && <p className="text-xs text-muted-foreground">{i.descripcion}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-md bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary-dark">{i.tipo_unidad}</span>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-heading">{money(i.precio_referecia)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

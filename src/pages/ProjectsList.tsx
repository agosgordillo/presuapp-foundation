import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createProject,
  deleteProject,
  getClienteOptions,
  getProjects,
  updateProject,
  type ClienteOpt,
  type ProjectRow,
} from "@/lib/api/projects";

const ESTADOS = ["ACTIVE", "CLOSED"] as const;
const ESTADO_LABEL: Record<string, string> = { ACTIVE: "Activo", CLOSED: "Cerrado" };

type FormState = { nombre: string; descripcion: string; cliente_id: string; estado: string };
const EMPTY: FormState = { nombre: "", descripcion: "", cliente_id: "", estado: "ACTIVE" };

export default function ProjectsList() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [clientes, setClientes] = useState<ClienteOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([getProjects(), getClienteOptions()]);
      setRows(p);
      setClientes(c);
    } catch (e: any) {
      toast.error(e?.message ?? "Error al cargar proyectos.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(EMPTY); setEditingId(null); setShowForm(false); };

  const startEdit = (r: ProjectRow, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(r.id);
    setForm({ nombre: r.nombre, descripcion: r.descripcion ?? "", cliente_id: String(r.cliente_id), estado: r.estado });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.cliente_id) return toast.error("Nombre y cliente son obligatorios.");
    setSaving(true);
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      cliente_id: Number(form.cliente_id),
      estado: form.estado,
    };
    try {
      if (editingId != null) {
        await updateProject(editingId, payload);
        toast.success("Proyecto actualizado");
      } else {
        await createProject(payload);
        toast.success("Proyecto creado");
      }
      resetForm();
      load();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: ProjectRow, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`¿Eliminar el proyecto "${r.nombre}"? Se eliminarán también sus presupuestos y pagos asociados.`)) return;
    try {
      await deleteProject(r.id);
      toast.success("Proyecto eliminado");
      load();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar.");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="/proyectos"
        title="Proyectos — Pipeline Activo"
        description="Crea, edita y elimina proyectos. El borrado elimina en cascada presupuestos y pagos asociados."
        actions={
          <button onClick={() => { if (showForm) resetForm(); else setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
            <Plus className="h-4 w-4" /> {showForm ? "Cancelar" : "Nuevo proyecto"}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={save} className="rounded-2xl border border-border bg-card p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-heading">{editingId != null ? "Editar proyecto" : "Nuevo proyecto"}</p>
            {editingId != null && <button type="button" onClick={resetForm} className="text-xs text-muted-foreground hover:text-foreground">Cancelar edición</button>}
          </div>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del proyecto" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <select value={form.cliente_id} onChange={(e) => setForm({ ...form, cliente_id: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="">Seleccionar cliente…</option>
            {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
          <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2">
            {ESTADOS.map((s) => <option key={s} value={s}>{ESTADO_LABEL[s]}</option>)}
          </select>
          <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2 min-h-[80px]" />
          <button disabled={saving} className="md:col-span-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70">
            {saving ? "Guardando..." : editingId != null ? "Actualizar proyecto" : "Guardar proyecto"}
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
            <Link key={p.id} to="/projects/$id" params={{ id: String(p.id) }} className="group relative rounded-2xl border border-border bg-card p-5 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30 transition-all">
              <p className="text-xs text-muted-foreground">{p.cliente}</p>
              <h3 className="mt-1 text-lg font-semibold text-heading group-hover:text-primary">{p.nombre}</h3>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">{ESTADO_LABEL[p.estado] ?? p.estado}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={(e) => startEdit(p, e)} title="Editar" className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-primary hover:border-primary/40">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={(e) => remove(p, e)} title="Eliminar" className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <ArrowUpRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

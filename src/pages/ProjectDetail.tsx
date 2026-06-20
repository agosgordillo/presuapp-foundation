import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Loader2, Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import {
  createPago,
  createRepo,
  deleteRepo,
  getPagosByProject,
  getProjectDetail,
  getReposByProject,
  updateRepo,
  type Pago,
  type ProjectDetail as ProyectoT,
  type Repo,
} from "@/lib/api/projects";
import { getQuotesByProject, type QuoteByProject } from "@/lib/api/quotes";
import { PageHeader } from "@/components/PageHeader";

type Proyecto = ProyectoT;
type Pres = QuoteByProject;

const ESTADO_LABEL: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviado",
  VIEWED: "Visto",
  ACCEPTED: "Aceptado",
  REJECTED: "Rechazado",
};
const METODO_LABEL: Record<string, string> = {
  TRANSFER: "Transferencia",
  CARD: "Tarjeta",
  CASH: "Efectivo",
  CHEQUE: "Cheque",
  OTHER: "Otro",
};

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function ProjectDetail({ id }: { id: string }) {
  const projectId = Number(id);
  const [tab, setTab] = useState<"budgets" | "repo" | "payments">("budgets");
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [presupuestos, setPresupuestos] = useState<Pres[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [pago, setPago] = useState({ monto: "", metodo: "TRANSFER", notas: "" });
  const [saving, setSaving] = useState(false);

  // Repo state
  const [showRepoForm, setShowRepoForm] = useState(false);
  const [repoForm, setRepoForm] = useState({ nombre: "", url: "" });
  const [repoSaving, setRepoSaving] = useState(false);
  const [editingRepoId, setEditingRepoId] = useState<number | null>(null);
  const [editRepo, setEditRepo] = useState({ nombre: "", url: "" });

  const loadRepos = async () => {
    try {
      setRepos(await getReposByProject(projectId));
    } catch (e: any) {
      toast.error(e?.message ?? "Error al cargar repositorios.");
    }
  };

  const load = async () => {
    if (!Number.isFinite(projectId)) return setLoading(false);
    try {
      const [pr, pres, pgs] = await Promise.all([
        getProjectDetail(projectId),
        getQuotesByProject(projectId),
        getPagosByProject(projectId),
      ]);
      setProyecto(pr);
      setPresupuestos(pres);
      setPagos(pgs);
      await loadRepos();
    } catch (e: any) {
      toast.error(e?.message ?? "Error al cargar proyecto.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [projectId]);

  const contractValue = presupuestos.filter((p) => p.estado === "ACCEPTED").reduce((s, p) => s + p.total, 0);
  const cobrado = pagos.reduce((s, p) => s + p.monto, 0);
  const saldo = Math.max(0, contractValue - cobrado);

  const addPago = async (e: React.FormEvent) => {
    e.preventDefault();
    const monto = Number(pago.monto);
    if (!Number.isFinite(monto) || monto <= 0) return toast.error("Monto inválido.");
    if (contractValue === 0) return toast.error("No hay presupuestos ACCEPTED en este proyecto.");
    if (monto > saldo) return toast.error(`El pago (${money(monto)}) excede el saldo pendiente (${money(saldo)}).`);
    setSaving(true);
    try {
      await createPago({ proyecto_id: projectId, monto, metodo: pago.metodo, notas: pago.notas || null });
      toast.success("Pago registrado");
      setPago({ monto: "", metodo: "TRANSFER", notas: "" });
      load();
    } catch (e: any) {
      toast.error(e?.message ?? "Error al registrar pago.");
    } finally {
      setSaving(false);
    }
  };

  const addRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoForm.nombre.trim() || !repoForm.url.trim()) return toast.error("Nombre y URL son obligatorios.");
    setRepoSaving(true);
    try {
      await createRepo(projectId, { nombre: repoForm.nombre.trim(), url: repoForm.url.trim() });
      toast.success("Repositorio agregado");
      setRepoForm({ nombre: "", url: "" });
      setShowRepoForm(false);
      loadRepos();
    } catch (e: any) {
      toast.error(e?.message ?? "Error al agregar.");
    } finally {
      setRepoSaving(false);
    }
  };

  const startEditRepo = (r: Repo) => {
    setEditingRepoId(r.id);
    setEditRepo({ nombre: r.nombre, url: r.url });
  };

  const saveEditRepo = async (id: number) => {
    if (!editRepo.nombre.trim() || !editRepo.url.trim()) return toast.error("Nombre y URL son obligatorios.");
    try {
      await updateRepo(id, { nombre: editRepo.nombre.trim(), url: editRepo.url.trim() });
      toast.success("Repositorio actualizado");
      setEditingRepoId(null);
      loadRepos();
    } catch (e: any) {
      toast.error(e?.message ?? "Error al actualizar.");
    }
  };

  const deleteRepoFn = async (r: Repo) => {
    toast(`Eliminar "${r.nombre}"?`, {
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await deleteRepo(r.id);
            toast.success("Repositorio eliminado");
            loadRepos();
          } catch (e: any) {
            toast.error(e?.message ?? "Error al eliminar.");
          }
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    });
  };

  return (
    <div className="space-y-8">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-heading">
        <ArrowLeft className="h-4 w-4" /> Volver a Proyectos
      </Link>

      <PageHeader
        eyebrow="Detalle de Proyecto"
        title={<>Proyecto <span className="text-primary">#{id}</span>{proyecto && <span className="text-heading"> — {proyecto.nombre}</span>}</>}
        description={proyecto?.clientes?.nombre ? <>Cliente: <strong>{proyecto.clientes.nombre}</strong></> : "Información del proyecto y su actividad."}
      />

      {loading ? (
        <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Cargando…</p>
      ) : !proyecto ? (
        <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Proyecto no encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-4">
            <div className="flex gap-2 border-b border-border">
              {(["budgets", "repo", "payments"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-heading"}`}>
                  {t === "budgets" ? "Presupuestos" : t === "repo" ? "Repositorio" : "Pagos"}
                </button>
              ))}
            </div>

            {tab === "budgets" && (
              <div className="rounded-2xl border border-border bg-card p-6">
                {presupuestos.length === 0 ? <p className="text-sm text-muted-foreground">Sin presupuestos. Crea uno desde la sección Presupuestos.</p> : (
                  <ul className="divide-y divide-border">
                    {presupuestos.map((p) => (
                      <li key={p.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-mono text-sm text-heading">{p.codigo}</p>
                          <p className="text-xs text-muted-foreground">{ESTADO_LABEL[p.estado] ?? p.estado}</p>
                        </div>
                        <p className="font-semibold text-heading">{money(p.total)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === "repo" && (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Repositorios del proyecto</p>
                    <p className="text-sm text-heading">{repos.length} registrado{repos.length === 1 ? "" : "s"}</p>
                  </div>
                  {repos.length > 0 && !showRepoForm && (
                    <button onClick={() => setShowRepoForm(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover">
                      <Plus className="h-3.5 w-3.5" /> Agregar Repositorio
                    </button>
                  )}
                </div>

                {showRepoForm && (
                  <form onSubmit={addRepo} className="rounded-xl border border-border bg-background p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      value={repoForm.nombre}
                      onChange={(e) => setRepoForm({ ...repoForm, nombre: e.target.value })}
                      placeholder="Nombre (e.g. Frontend)"
                      maxLength={100}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                    <input
                      value={repoForm.url}
                      onChange={(e) => setRepoForm({ ...repoForm, url: e.target.value })}
                      placeholder="URL del repositorio"
                      maxLength={255}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                    <div className="md:col-span-2 flex gap-2 justify-end">
                      <button type="button" onClick={() => { setShowRepoForm(false); setRepoForm({ nombre: "", url: "" }); }} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-heading">
                        Cancelar
                      </button>
                      <button disabled={repoSaving} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-70">
                        {repoSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Guardar
                      </button>
                    </div>
                  </form>
                )}

                {repos.length === 0 && !showRepoForm ? (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-3">
                    <p className="text-sm text-muted-foreground">Sin repositorio asociado.</p>
                    <button onClick={() => setShowRepoForm(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
                      <Plus className="h-4 w-4" /> Agregar Repositorio
                    </button>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {repos.map((r) => (
                      <li key={r.id} className="py-3">
                        {editingRepoId === r.id ? (
                          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2 items-center">
                            <input value={editRepo.nombre} onChange={(e) => setEditRepo({ ...editRepo, nombre: e.target.value })} maxLength={100} className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm" />
                            <input value={editRepo.url} onChange={(e) => setEditRepo({ ...editRepo, url: e.target.value })} maxLength={255} className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm" />
                            <div className="flex gap-1 justify-end">
                              <button onClick={() => saveEditRepo(r.id)} className="rounded-lg p-1.5 text-success-dark hover:bg-secondary" title="Guardar">
                                <Check className="h-4 w-4" />
                              </button>
                              <button onClick={() => setEditingRepoId(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary" title="Cancelar">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-heading">{r.nombre}</p>
                              <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-xs text-primary break-all hover:underline">
                                {r.url} <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              </a>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button onClick={() => startEditRepo(r)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-heading" title="Editar">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button onClick={() => deleteRepoFn(r)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive" title="Eliminar">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === "payments" && (
              <div className="space-y-4">
                <form onSubmit={addPago} className="rounded-2xl border border-border bg-card p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input type="number" step="0.01" min="0.01" value={pago.monto} onChange={(e) => setPago({ ...pago, monto: e.target.value })} placeholder="Monto" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                  <select value={pago.metodo} onChange={(e) => setPago({ ...pago, metodo: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    {["TRANSFER", "CARD", "CASH", "CHEQUE", "OTHER"].map((m) => <option key={m} value={m}>{METODO_LABEL[m]}</option>)}
                  </select>
                  <input value={pago.notas} onChange={(e) => setPago({ ...pago, notas: e.target.value })} placeholder="Notas (opcional)" className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2" />
                  <button disabled={saving} className="md:col-span-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70">
                    <Plus className="h-4 w-4" /> {saving ? "Guardando..." : "Registrar pago"}
                  </button>
                </form>
                <div className="rounded-2xl border border-border bg-card p-6">
                  {pagos.length === 0 ? <p className="text-sm text-muted-foreground">Aún no se han registrado pagos.</p> : (
                    <ul className="divide-y divide-border">
                      {pagos.map((p) => (
                        <li key={p.id} className="flex items-center justify-between py-3">
                          <div>
                            <p className="text-sm font-semibold text-heading">{money(p.monto)} · {METODO_LABEL[p.metodo] ?? p.metodo}</p>
                            <p className="text-xs text-muted-foreground">{p.fecha_pago}{p.notas ? ` — ${p.notas}` : ""}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </section>

          <aside className="rounded-2xl border border-border bg-card p-6 space-y-4 h-fit">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Valor de contrato</p>
              <p className="mt-1 text-2xl font-bold text-heading">{money(contractValue)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Cobrado</p>
              <p className="mt-1 text-2xl font-bold text-success-dark">{money(cobrado)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Saldo pendiente</p>
              <p className="mt-1 text-2xl font-bold text-warning-dark">{money(saldo)}</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

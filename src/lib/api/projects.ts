import { supabase } from "@/integrations/supabase/client";

export type ProjectRow = {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: string;
  cliente: string;
  cliente_id: number;
};

export type ProjectInput = {
  nombre: string;
  descripcion: string | null;
  cliente_id: number;
  estado: string;
};

export type ProjectDetail = {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: string;
  cliente_id: number;
  clientes?: { nombre: string };
};

export type ProjectByClient = { id: number; nombre: string; estado: string };

export type ClienteOpt = { id: number; nombre: string };

export type Pago = { id: number; fecha_pago: string; monto: number; metodo: string; notas: string | null };
export type PagoInput = { proyecto_id: number; monto: number; metodo: string; notas: string | null };

export type Repo = { id: number; nombre: string; url: string };
export type RepoInput = { nombre: string; url: string };

export async function getProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from("proyectos")
    .select("id, nombre, descripcion, estado, cliente_id, clientes!inner(nombre)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id,
    nombre: r.nombre,
    descripcion: r.descripcion,
    estado: r.estado,
    cliente_id: r.cliente_id,
    cliente: r.clientes?.nombre ?? "—",
  }));
}

export async function getClienteOptions(): Promise<ClienteOpt[]> {
  const { data, error } = await supabase.from("clientes").select("id, nombre").order("nombre");
  if (error) throw error;
  return (data ?? []) as ClienteOpt[];
}

export async function createProject(input: ProjectInput) {
  const { error } = await supabase.from("proyectos").insert(input);
  if (error) throw error;
}

export async function updateProject(id: number, input: ProjectInput) {
  const { error } = await supabase.from("proyectos").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteProject(id: number) {
  const { error } = await supabase.from("proyectos").delete().eq("id", id);
  if (error) throw error;
}

export async function getProjectDetail(id: number): Promise<ProjectDetail | null> {
  const { data, error } = await supabase.from("proyectos").select("*, clientes(nombre)").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as ProjectDetail | null) ?? null;
}

export async function getProjectsByClient(clienteId: number): Promise<ProjectByClient[]> {
  const { data, error } = await supabase
    .from("proyectos")
    .select("id, nombre, estado")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProjectByClient[];
}

// ---- Pagos ----
export async function getPagosByProject(projectId: number): Promise<Pago[]> {
  const { data, error } = await supabase
    .from("pagos")
    .select("*")
    .eq("proyecto_id", projectId)
    .order("fecha_pago", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ ...r, monto: Number(r.monto) })) as Pago[];
}

export async function createPago(input: PagoInput) {
  const { error } = await supabase.from("pagos").insert(input);
  if (error) throw error;
}

// ---- Repositorios ----
export async function getReposByProject(projectId: number): Promise<Repo[]> {
  const { data, error } = await supabase
    .from("proyecto_repositorios")
    .select("id, nombre, url")
    .eq("proyecto_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Repo[];
}

export async function createRepo(projectId: number, input: RepoInput) {
  const { error } = await supabase.from("proyecto_repositorios").insert({ proyecto_id: projectId, ...input });
  if (error) throw error;
}

export async function updateRepo(id: number, input: RepoInput) {
  const { error } = await supabase.from("proyecto_repositorios").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteRepo(id: number) {
  const { error } = await supabase.from("proyecto_repositorios").delete().eq("id", id);
  if (error) throw error;
}

import { supabase } from "@/integrations/supabase/client";

export type CustomerRow = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  proyectos: number;
};

export type CustomerInput = {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
};

export type CustomerDetail = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
};

export async function getCustomers(): Promise<CustomerRow[]> {
  const { data, error } = await supabase
    .from("clientes")
    .select("id, nombre, email, telefono, empresa, proyectos(count)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((c: any) => ({
    id: c.id,
    nombre: c.nombre,
    email: c.email,
    telefono: c.telefono,
    empresa: c.empresa,
    proyectos: c.proyectos?.[0]?.count ?? 0,
  }));
}

export async function getCustomerById(id: number): Promise<CustomerDetail | null> {
  const { data, error } = await supabase.from("clientes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as CustomerDetail | null) ?? null;
}

export async function updateCustomer(id: number, input: CustomerInput) {
  const { error } = await supabase.from("clientes").update(input).eq("id", id);
  if (error) throw error;
}

export async function createCustomer(input: CustomerInput) {
  const { data: u } = await supabase.from("usuarios").select("id").maybeSingle();
  if (!u) throw new Error("Inicia sesión para crear clientes.");
  const { error } = await supabase.from("clientes").insert({ ...input, usuario_id: u.id });
  if (error) throw error;
}

export async function deleteCustomer(id: number) {
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw error;
}

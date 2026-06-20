import { supabase } from "@/integrations/supabase/client";

export type CatalogItemRow = {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo_unidad: string;
  precio_referecia: number;
  activo: boolean;
};

export type CatalogItemInput = {
  nombre: string;
  descripcion: string | null;
  tipo_unidad: string;
  precio_referecia: number;
};

export type ActiveCatalogItem = {
  id: number;
  nombre: string;
  tipo_unidad: string;
  precio_referecia: number;
  activo: boolean;
};

export async function getCatalogItems(): Promise<CatalogItemRow[]> {
  const { data, error } = await supabase.from("catalogo_items").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    ...r,
    precio_referecia: Number(r.precio_referecia),
    activo: r.activo ?? true,
  }));
}

export async function getActiveCatalogItems(): Promise<ActiveCatalogItem[]> {
  const { data, error } = await supabase
    .from("catalogo_items")
    .select("id, nombre, tipo_unidad, precio_referecia, activo")
    .eq("activo", true)
    .order("nombre");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ ...r, precio_referecia: Number(r.precio_referecia) }));
}

export async function createCatalogItem(input: CatalogItemInput) {
  const { data: u } = await supabase.from("usuarios").select("id").maybeSingle();
  if (!u) throw new Error("Inicia sesión.");
  const { error } = await supabase.from("catalogo_items").insert({ usuario_id: u.id, ...input });
  if (error) throw error;
}

export async function updateCatalogItem(id: number, input: CatalogItemInput) {
  const { error } = await supabase.from("catalogo_items").update(input).eq("id", id);
  if (error) throw error;
}

export async function setCatalogItemActive(id: number, activo: boolean) {
  const { error } = await supabase.from("catalogo_items").update({ activo }).eq("id", id);
  if (error) throw error;
}

export async function deleteCatalogItem(id: number) {
  const { error } = await supabase.from("catalogo_items").delete().eq("id", id);
  if (error) throw error;
}

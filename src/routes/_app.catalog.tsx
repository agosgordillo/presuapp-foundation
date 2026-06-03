import { createFileRoute } from "@tanstack/react-router";
import CatalogList from "@/pages/CatalogList";

export const Route = createFileRoute("/_app/catalog")({
  head: () => ({ meta: [{ title: "Catálogo — PresuApp" }] }),
  component: CatalogList,
});

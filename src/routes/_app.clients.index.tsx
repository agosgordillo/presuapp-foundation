import { createFileRoute } from "@tanstack/react-router";
import ClientsList from "@/pages/ClientsList";

export const Route = createFileRoute("/_app/clients/")({
  head: () => ({ meta: [{ title: "Clientes — PresuApp" }] }),
  component: ClientsList,
});

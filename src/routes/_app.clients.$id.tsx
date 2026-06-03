import { createFileRoute } from "@tanstack/react-router";
import ClientDetail from "@/pages/ClientDetail";

export const Route = createFileRoute("/_app/clients/$id")({
  head: () => ({ meta: [{ title: "Detalle de Cliente — PresuApp" }] }),
  component: ClientDetailRoute,
});

function ClientDetailRoute() {
  const { id } = Route.useParams();
  return <ClientDetail id={id} />;
}

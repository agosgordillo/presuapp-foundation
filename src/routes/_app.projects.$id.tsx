import { createFileRoute } from "@tanstack/react-router";
import ProjectDetail from "@/pages/ProjectDetail";

export const Route = createFileRoute("/_app/projects/$id")({
  head: () => ({ meta: [{ title: "Detalle de Proyecto — PresuApp" }] }),
  component: ProjectDetailRoute,
});

function ProjectDetailRoute() {
  const { id } = Route.useParams();
  return <ProjectDetail id={id} />;
}

import { createFileRoute } from "@tanstack/react-router";
import ProjectsList from "@/pages/ProjectsList";

export const Route = createFileRoute("/_app/projects/")({
  head: () => ({ meta: [{ title: "Proyectos — PresuApp" }] }),
  component: ProjectsList,
});

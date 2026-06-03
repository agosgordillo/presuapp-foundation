import { createFileRoute } from "@tanstack/react-router";
import QuotesList from "@/pages/QuotesList";

export const Route = createFileRoute("/_app/quotes")({
  head: () => ({ meta: [{ title: "Presupuestos — PresuApp" }] }),
  component: QuotesList,
});

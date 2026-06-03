import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { Showcase } from "@/components/showcase/Showcase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PresuApp — Presupuestos inteligentes para Freelancers y Agencias" },
      { name: "description", content: "Automatiza cotizaciones, gestiona clientes, haz seguimiento de pagos y exporta PDFs profesionales. SaaS B2B para freelancers y agencias." },
      { property: "og:title", content: "PresuApp — Presupuestos inteligentes" },
      { property: "og:description", content: "Automatiza cotizaciones, gestiona clientes y haz seguimiento de pagos en segundos." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <FAQ />
        <Showcase />
      </main>
      <Footer />
    </div>
  );
}

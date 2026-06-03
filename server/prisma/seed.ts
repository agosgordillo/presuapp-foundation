import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding PresuApp database...");

  await prisma.itemCatalog.createMany({
    data: [
      { name: "Diseño UI/UX", description: "Diseño de interfaz por hora", unitType: "HR", referencePrice: 45, category: "Diseño" },
      { name: "Desarrollo Frontend", description: "Desarrollo React/TypeScript por hora", unitType: "HR", referencePrice: 60, category: "Desarrollo" },
      { name: "Consultoría Técnica", description: "Sesión de consultoría", unitType: "SVC", referencePrice: 120, category: "Consultoría" },
      { name: "Mantenimiento Mensual", description: "Soporte mensual", unitType: "MES", referencePrice: 350, category: "Soporte" },
      { name: "Proyecto Llave en Mano", description: "Proyecto completo", unitType: "PROY", referencePrice: 4500, category: "Desarrollo" },
    ],
  });

  const client = await prisma.client.create({
    data: {
      name: "Ana García",
      company: "TechStart SL",
      email: "ana@techstart.io",
      phone: "+34 600 123 456",
    },
  });

  await prisma.project.create({
    data: { name: "Landing Corporativa", clientId: client.id, description: "Sitio marketing v2" },
  });

  console.log("✅ Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

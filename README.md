# PresuApp Foundation

Plataforma SaaS B2B para la gestión integral de presupuestos, proyectos y cobros, orientada a profesionales independientes y agencias de servicios.

---

## 1. Identificación

- **Nombre del proyecto:** PresuApp Foundation
- **Integrantes del grupo:**
  - María Agostina Garaizabal Gordillo
  - Alejandra Judith Labra

---

## 2. Descripción Técnica

**Propósito.** PresuApp Foundation es un panel centralizado SaaS B2B que digitaliza el ciclo completo de cotización, contratación y cobranza de servicios profesionales. Permite a sus usuarios mantener un catálogo de servicios reutilizables, generar presupuestos con cálculo impositivo flexible en tiempo real, seguir el estado de cada proyecto y conciliar pagos contra el monto efectivamente aceptado por el cliente.

**Problemática que resuelve.**
- **Automatización de cotizaciones:** elimina la dependencia de plantillas dispersas en planillas de cálculo o documentos de texto.
- **Descontrol en el seguimiento de estados:** ofrece un flujo formal y trazable de presupuestos (Borrador → Enviado → Visto → Aceptado / Rechazado).
- **Cálculos manuales propensos a errores:** recalcula subtotales, impuestos individuales por ítem y totales de forma instantánea.
- **Desorganización de cobros:** integra un módulo de pagos vinculado al presupuesto aceptado, con validaciones que impiden sobrecobros.

**Perfil de usuario.**
- Freelancers de servicios profesionales (desarrollo, diseño, consultoría).
- Pequeñas y medianas agencias B2B con flujos recurrentes de cotización.
- Consultores y profesionales independientes que necesitan centralizar clientes, proyectos, presupuestos y cobranzas en una única herramienta multi-tenant.

---

## 3. Arquitectura del Proyecto

PresuApp Foundation es una SPA construida con **TanStack Start** (React 19 + Vite 7, routing basado en archivos) acoplada a **Supabase** como backend gestionado (PostgreSQL, Auth y Row-Level Security).

### Estructura de carpetas

```text
src/
├── components/
│   ├── auth/         # Layout y helpers de autenticación
│   ├── landing/      # Secciones de la landing comercial
│   ├── layout/       # DashboardLayout (sidebar + topbar autenticado)
│   └── ui/           # Primitivas Shadcn UI / Radix (Button, Dialog, Table, Toast…)
├── hooks/            # Hooks reutilizables
├── integrations/
│   └── supabase/     # Cliente Supabase tipado y helpers de auth
├── lib/
│   └── pdf/          # Módulo de generación de PDF (quotePdf.ts)
├── pages/            # Vistas de negocio (Dashboard, Clientes, Proyectos, Catálogo, Presupuestos)
├── routes/           # File-based routing (TanStack Router)
├── styles.css        # Tailwind CSS v4 + tokens de diseño
└── router.tsx        # Configuración del router

supabase/
└── migrations/       # Migraciones SQL versionadas (esquema, RLS, triggers, funciones)
```

### Organización de componentes

- **`src/pages/`** concentra la lógica de cada vista de negocio (consultas a Supabase, validaciones, formularios y diálogos CRUD).
- **`src/components/ui/`** expone los átomos del Design System basados en **Radix UI** y **Shadcn UI**, tipados con Tailwind.
- **`src/components/layout/`** define el `DashboardLayout` compartido por todas las rutas autenticadas.
- **`src/integrations/supabase/`** centraliza el cliente Supabase y los hooks de autenticación; es la única vía de acceso a la base.
- **`src/lib/pdf/`** contiene el generador de PDF de presupuestos (`quotePdf.ts`), construido sobre `jsPDF` + `jspdf-autotable`, que lee los datos reales del presupuesto y respeta el desglose de impuestos individuales por ítem.

---

## 4. Objetivos y Tecnologías

### Objetivos alcanzados en esta fase

- **Autenticación segura** con Supabase Auth (registro, login, recuperación y actualización de contraseña).
- **Enrutamiento protegido** mediante layouts autenticados y Row-Level Security multi-tenant en la base de datos.
- **CRUD completo** sobre Clientes, Proyectos, Catálogo y Presupuestos, con búsqueda y borrado seguro.
- **Cálculo flexible de impuestos individuales por ítem**, permitiendo activar/desactivar y personalizar el porcentaje en cada línea del presupuesto.
- **Flujo multi-estado de presupuestos** (Borrador → Enviado → Visto → Aceptado / Rechazado) con validaciones de transición y métricas por estado.
- **Exportación dinámica a PDF** del presupuesto, con marca, desglose por ítem, impuestos individuales y totales coherentes con la UI.
- **Módulo de seguimiento de pagos** habilitado automáticamente al aceptar un presupuesto, con regla anti-overflow que impide registrar pagos por encima del contrato.
- **Duplicación de presupuestos** y precarga inteligente desde el catálogo sin afectar el histórico.

### Stack tecnológico

- **Frontend:** React 19, TypeScript, Vite 7, TanStack Router / Start.
- **UI:** Tailwind CSS v4, Shadcn UI, Radix UI primitives, Lucide Icons, Sonner.
- **Backend gestionado:** Supabase (PostgreSQL, Auth, Row-Level Security, Storage).
- **PDF:** jsPDF + jspdf-autotable.
- **Tooling:** ESLint, Prettier, Bun / npm, migraciones SQL versionadas.

---

## 5. Guía de Instalación

### Requisitos previos

- Node.js 20+ **o** Bun 1.1+
- Una instancia de Supabase con las migraciones de `supabase/migrations/` aplicadas.

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO> presuapp-foundation
cd presuapp-foundation
```

### 2. Instalar dependencias

Con **npm**:

```bash
npm install
```

O con **Bun** (recomendado, usa el `bun.lockb` del repo):

```bash
bun install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz con las credenciales públicas del proyecto Supabase:

```bash
VITE_SUPABASE_URL="https://<tu-proyecto>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<anon-public-key>"
VITE_SUPABASE_PROJECT_ID="<project-ref>"
```

### 4. Aplicar el esquema de base de datos

Ejecutar las migraciones de `supabase/migrations/` en orden cronológico contra la instancia de Supabase (vía Supabase CLI o el SQL Editor). Esto crea las tablas, las policies RLS y los triggers necesarios.

### 5. Ejecutar el servidor de desarrollo

Con npm:

```bash
npm run dev
```

Con Bun:

```bash
bun run dev
```

La aplicación queda disponible en `http://localhost:8080` (o el puerto que indique Vite en consola).

### 6. Scripts adicionales

```bash
npm run build     # Build de producción
npm run preview   # Servir el build localmente
npm run lint      # Análisis estático con ESLint
```

---

## Mapa de Rutas

| Ruta | Descripción |
| --- | --- |
| `/` | Landing comercial pública |
| `/login` · `/register` | Acceso y registro |
| `/forgot-password` · `/update-password` | Flujo de recuperación de contraseña |
| `/dashboard` | KPIs agregados en tiempo real |
| `/clients` · `/clients/:id` | Cartera de clientes y ficha de detalle |
| `/projects` · `/projects/:id` | Pipeline y detalle de proyecto (Presupuestos · Repositorio · Pagos) |
| `/catalog` | Catálogo de servicios reutilizables |
| `/quotes` | Builder de presupuestos con motor de cálculo e impuestos por ítem |

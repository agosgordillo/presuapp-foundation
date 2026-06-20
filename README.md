# PresuApp Foundation

Plataforma SaaS B2B para la gestión flexible de presupuestos, clientes, proyectos y cobros, orientada a profesionales independientes y agencias de servicios.

---

## 1. Identificación

- **Nombre del proyecto:** PresuApp Foundation
- **Integrantes del grupo:**
  - María Agostina Garaizabal Gordillo
  - Alejandra Judith Labra

---

## 2. Descripción Técnica

**Propósito.** PresuApp Foundation es un panel centralizado **SaaS B2B** para la gestión flexible de presupuestos, clientes y proyectos. Digitaliza el ciclo completo de cotización, contratación y cobranza, permitiendo mantener un catálogo de servicios reutilizables, emitir presupuestos con cálculo impositivo personalizable, seguir el estado de cada proyecto y conciliar pagos contra el monto efectivamente aceptado por el cliente.

**Problemática que resuelve.**
- **Automatización de cotizaciones:** elimina la dependencia de plantillas dispersas en planillas de cálculo o documentos de texto.
- **Descontrol en el seguimiento de estados:** ofrece un flujo formal y trazable de presupuestos (Borrador → Enviado → Visto → Aceptado / Rechazado).
- **Cálculos manuales propensos a errores:** recalcula subtotales, impuestos individuales por ítem y totales en tiempo real.
- **Desorganización de cobros:** integra un módulo de pagos vinculado al presupuesto aceptado, con validaciones anti-overflow que impiden registrar montos superiores al contrato.

**Perfil de usuario.**
- Freelancers de servicios profesionales (desarrollo, diseño, consultoría).
- Pequeñas y medianas agencias B2B con flujos recurrentes de cotización.
- Consultores y profesionales independientes que necesitan centralizar clientes, proyectos, presupuestos y cobranzas en una única herramienta multi-tenant.

---

## 3. Arquitectura y Organización

PresuApp Foundation es una SPA construida con **TanStack Start** (React 19 + Vite 7, routing basado en archivos) acoplada a **Supabase** como backend gestionado (PostgreSQL, Auth y Row-Level Security). La arquitectura aplica buenas prácticas de ingeniería de software: separación de responsabilidades, modularización por dominio y reutilización de componentes.

### Estructura de carpetas

```text
src/
├── components/
│   ├── auth/          # Layout y helpers de autenticación
│   ├── dashboard/     # Subcomponentes especializados del Dashboard
│   ├── landing/       # Secciones de la landing comercial
│   ├── layout/        # DashboardLayout global (sidebar + header autenticado)
│   ├── ui/            # Primitivas Shadcn UI / Radix
│   ├── Header.tsx     # Barra superior reutilizable
│   └── PageHeader.tsx # Cabecera estandarizada de vistas
├── hooks/             # Hooks reutilizables
├── integrations/
│   └── supabase/      # Cliente Supabase tipado y helpers de auth
├── lib/
│   ├── api/           # Capa de servicios (desacople de la DB)
│   └── pdf/           # Generador de PDF de presupuestos
├── pages/             # Vistas de negocio
├── routes/            # File-based routing (TanStack Router)
├── styles.css         # Tailwind CSS v4 + tokens de diseño
└── router.tsx         # Configuración del router

supabase/
└── migrations/        # Migraciones SQL versionadas (esquema, RLS, triggers)
```

### 3.1 Capa de Servicios / API (`src/lib/api/`)

Se desacopló por completo la lógica de acceso a base de datos respecto de las vistas. Ningún componente de página consulta a Supabase de forma directa: toda interacción pasa por módulos asíncronos especializados, agrupados por entidad del dominio:

- **`customers.ts`** — CRUD de clientes (`getCustomers`, `createCustomer`, `updateCustomer`, `deleteCustomer`, `getCustomerById`).
- **`projects.ts`** — Proyectos, repositorios asociados y pagos (`getProjects`, `getProjectDetail`, `getReposByProject`, `createPago`, etc.).
- **`quotes.ts`** — Presupuestos, ítems, duplicación, cambio de estado y métricas del Dashboard (`getQuotes`, `duplicateQuote`, `updateQuoteEstado`, `getDashboardMetrics`).
- **`catalog.ts`** — Gestión del catálogo de servicios reutilizables (`getActiveCatalogItems`, `setCatalogItemActive`).

Esta capa centraliza tipos, validaciones y manejo de errores, elimina duplicación de queries y permite que las páginas se concentren exclusivamente en estado local, formularios y feedback al usuario (toasts, loaders).

### 3.2 Layout y Estandarización (`src/components/`)

- **`Header.tsx`** — Barra superior reutilizable que centraliza el branding, los datos del usuario autenticado (nombre, email, badge de sesión activa) y la acción de cierre de sesión.
- **`layout/DashboardLayout.tsx`** — Shell global de las rutas autenticadas: incluye la sidebar de navegación responsive y consume el `Header` único, eliminando la duplicación que existía página por página.
- **`PageHeader.tsx`** — Cabecera estandarizada para cada vista, con `eyebrow`, `title`, `description` y un slot de `actions`. Garantiza consistencia visual de tipografía, espaciado y comportamiento responsive en Dashboard, Clientes, Proyectos, Catálogo y Presupuestos.
- **`components/ui/`** — Átomos del Design System basados en **Shadcn UI** y **Radix**, usados de forma homogénea para botones, inputs, diálogos, tablas, badges y toasts.

### 3.3 Componentización Avanzada

Se modularizaron los bloques de renderizado iterativos para evitar componentes monolíticos. Caso destacado:

- **`components/dashboard/RecentQuoteRow.tsx`** — Subcomponente especializado que abstrae el renderizado de cada fila de la lista de "Presupuestos recientes" del Dashboard. Recibe por props (`codigo`, `cliente`, `total`, `estado`) y encapsula el mapeo de estados, el formato de moneda y el estilo de la fila. El `Dashboard.tsx` ahora se limita a iterar la colección e invocar el subcomponente.

Esta estrategia se aplicó como criterio general: ningún `return` principal contiene bloques iterativos masivos embebidos.

---

## 4. Objetivos y Tecnologías

### Objetivos alcanzados en esta fase

- **Autenticación segura** con Supabase Auth (registro, login, recuperación y actualización de contraseña).
- **Enrutamiento robusto** con **TanStack Router** (auditado y asegurado contra vulnerabilidades conocidas), layouts autenticados y rutas tipadas.
- **Row-Level Security multi-tenant** en la base de datos, aislando los datos de cada usuario.
- **CRUD completo** sobre Clientes, Proyectos, Catálogo y Presupuestos con búsqueda y borrado seguro.
- **Cálculo flexible de impuestos parametrizables de forma individual por ítem**, con activación/desactivación y porcentaje personalizable en cada línea del presupuesto.
- **Flujo multi-estado de presupuestos** (Borrador → Enviado → Visto → Aceptado / Rechazado) con validaciones de transición y métricas agregadas.
- **Exportación dinámica a PDF** del presupuesto, con desglose por ítem, impuestos individuales y totales coherentes con la UI.
- **Módulo de seguimiento de pagos** habilitado al aceptar un presupuesto, con regla anti-overflow.
- **Refactor arquitectónico** con capa de servicios, layout unificado y componentización avanzada.

### Stack tecnológico

- **Frontend:** React 19, TypeScript, **TanStack Router / Start** (auditado y asegurado contra vulnerabilidades), Vite 7.
- **UI:** Tailwind CSS v4, **Shadcn UI**, Radix UI primitives, Lucide Icons, Sonner.
- **Backend gestionado:** **Supabase** (PostgreSQL, Auth, Row-Level Security, Storage).
- **PDF:** jsPDF + jspdf-autotable.
- **Tooling:** ESLint, Prettier, npm / Bun, migraciones SQL versionadas.

---

## 5. Guía de Instalación

### Requisitos previos

- Node.js 20+
- Una instancia de Supabase con las migraciones de `supabase/migrations/` aplicadas.

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO> presuapp-foundation
cd presuapp-foundation
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz con las credenciales públicas del proyecto Supabase:

```bash
VITE_SUPABASE_URL="https://<tu-proyecto>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<anon-public-key>"
VITE_SUPABASE_PROJECT_ID="<project-ref>"
```

### 4. Aplicar el esquema de base de datos

Ejecutar las migraciones de `supabase/migrations/` en orden cronológico contra la instancia de Supabase (vía Supabase CLI o el SQL Editor).

### 5. Ejecutar el servidor de desarrollo de Vite

```bash
npm run dev
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
| `/forgot-password` · `/update-password` | Recuperación de contraseña |
| `/dashboard` | KPIs agregados en tiempo real |
| `/clients` · `/clients/:id` | Cartera de clientes y ficha de detalle |
| `/projects` · `/projects/:id` | Pipeline y detalle de proyecto (Presupuestos · Repositorio · Pagos) |
| `/catalog` | Catálogo de servicios reutilizables |
| `/quotes` | Builder de presupuestos con motor de cálculo e impuestos por ítem |

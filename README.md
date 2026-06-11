# PresuApp

Plataforma SaaS de gestión de presupuestos y CRM financiero para profesionales independientes y agencias de servicios.

---

## 1. Identificación

- **Nombre del proyecto:** PresuApp
- **Integrantes del grupo:**
  - María Agostina Garaizabal Gordillo
  - Alejandra Judith Labra

---

## 2. Descripción Técnica

**Propósito.** PresuApp digitaliza el ciclo completo de cotización y cobranza de servicios profesionales: catálogo de servicios reutilizables, generación de presupuestos con cálculo impositivo en tiempo real, seguimiento de proyectos y conciliación de pagos.

**Problemática que resuelve.** Los trabajadores independientes y pequeñas agencias suelen gestionar presupuestos en planillas dispersas, sin trazabilidad entre el monto cotizado, el contrato aceptado y los pagos efectivamente cobrados. Esto provoca errores de facturación, sobrecobros, pérdida de información histórica y falta de visibilidad sobre el saldo real de cada proyecto. PresuApp centraliza clientes, proyectos, presupuestos, repositorios y pagos en una única base relacional con reglas de negocio que evitan inconsistencias (por ejemplo, impide registrar pagos que superen el valor del contrato aceptado).

**Perfil de usuario.**
- Freelancers de servicios profesionales (desarrollo, diseño, consultoría).
- Pequeñas y medianas agencias B2B que emiten presupuestos recurrentes.
- Equipos que necesitan separar su cartera de clientes, su pipeline de proyectos y su flujo de cobranzas en una única herramienta multi-tenant.

---

## 3. Arquitectura del Proyecto

PresuApp es una SPA construida con **TanStack Start** (file-based routing sobre React 19 + Vite 7) acoplada a **Lovable Cloud (Supabase)** como motor de persistencia, autenticación y Row-Level Security.

### Estructura de carpetas

```text
src/
├── components/
│   ├── auth/         # Layout y helpers de las pantallas de autenticación
│   ├── landing/      # Secciones de la landing comercial (Hero, Features, Pricing, FAQ, Footer)
│   ├── layout/       # DashboardLayout (sidebar + topbar autenticado)
│   ├── showcase/     # Panel de pruebas estáticas del Design System
│   └── ui/           # Primitivas Shadcn/UI (Button, Input, Dialog, Table, Toast…)
├── hooks/            # Hooks reutilizables (use-mobile, etc.)
├── integrations/
│   └── supabase/     # Cliente Supabase autogenerado, tipos Database y helpers de auth
├── lib/              # Utilidades, server functions y configuración de errores
├── pages/            # Vistas de negocio invocadas desde las rutas
│   ├── Dashboard.tsx
│   ├── ClientsList.tsx · ClientDetail.tsx
│   ├── ProjectsList.tsx · ProjectDetail.tsx
│   ├── CatalogList.tsx
│   └── QuotesList.tsx
├── routes/           # File-based routing (TanStack Router)
│   ├── __root.tsx              # Shell de la app
│   ├── index.tsx               # Landing pública
│   ├── login.tsx · register.tsx
│   ├── forgot-password.tsx · update-password.tsx
│   └── _app.*.tsx              # Rutas autenticadas (dashboard, clients, projects, catalog, quotes)
├── styles.css        # Tailwind v4 + design tokens
├── router.tsx        # Configuración del router
└── start.ts          # Bootstrap de TanStack Start (middlewares globales)

supabase/
└── migrations/       # Migraciones SQL versionadas (esquema, RLS, triggers, funciones)
```

### Organización de componentes

- **`components/ui`** contiene los átomos del Design System (Shadcn/UI tipados con Tailwind v4).
- **`components/landing`** agrupa las secciones de marketing renderizadas en `/`.
- **`components/layout`** expone el `DashboardLayout` que envuelve todas las rutas autenticadas bajo `_app`.
- **`pages`** concentra la lógica de cada vista (queries a Supabase, validaciones, formularios) y se monta desde los archivos `src/routes/_app.*.tsx`.
- **`integrations/supabase`** es la única vía de acceso a la base: el cliente y los tipos se autogeneran a partir del esquema real.

### Modelo de datos (PostgreSQL · RLS activa)

| Tabla | Campos clave | Relación |
| --- | --- | --- |
| `usuarios` | `id`, `auth_user_id` (→ `auth.users`), `nombre`, `email`, `empresa_nombre` | Tenant raíz |
| `clientes` | `id`, `usuario_id`, `nombre`, `email`, `telefono`, `empresa` | N:1 usuarios |
| `proyectos` | `id`, `cliente_id`, `nombre`, `descripcion`, `estado` | N:1 clientes |
| `proyecto_repositorios` | `id`, `proyecto_id`, `nombre`, `url` | N:1 proyectos |
| `catalogo_items` | `id`, `usuario_id`, `nombre`, `tipo_unidad`, `precio_referecia` | N:1 usuarios |
| `presupuestos` | `id`, `proyecto_id`, `codigo`, `estado`, `subtotal`, `impuestos`, `total` | N:1 proyectos |
| `presupuesto_items` | `id`, `presupuesto_id`, `nombre_historico`, `cantidad`, `precio_unitario`, `subtotal_item` | N:1 presupuestos |
| `pagos` | `id`, `proyecto_id`, `fecha_pago`, `monto`, `metodo` | N:1 proyectos |

Triggers y funciones clave:

- `on_auth_user_created` aprovisiona la fila correspondiente en `usuarios` al registrarse un usuario en `auth.users`.
- `current_usuario_id()` (`SECURITY DEFINER`) resuelve el `usuario_id` del tenant autenticado y es la base de todas las policies RLS.
- `prevent_auth_user_id_change` impide reasignar el vínculo entre un perfil y su cuenta de auth.

---

## 4. Objetivos y Tecnologías

### Objetivos alcanzados en esta fase

- **Autenticación completa** con Supabase Auth: registro, login, recuperación de contraseña (`/forgot-password` → `/update-password`) y sesión persistida.
- **Multi-tenant seguro** mediante RLS: cada usuario sólo accede a sus propios clientes, proyectos, presupuestos, repositorios y pagos.
- **Gestión de clientes** con alta, listado y ficha de detalle dinámica.
- **Pipeline de proyectos** con tabs internas (Presupuestos, Repositorios, Pagos) y soporte para múltiples repositorios por proyecto con edición inline.
- **Catálogo de servicios** reutilizable con tipos de unidad (HR, U, SVC, MES, PROY) y precio de referencia.
- **Builder de presupuestos** multi-ítem con motor de cálculo client-side (subtotales, impuestos configurables y total recalculados en vivo).
- **Conciliación de pagos** con regla anti-overflow: ningún pago puede superar `Σ presupuestos.total (estado=ACCEPTED) − Σ pagos previos`.
- **Dashboard de KPIs** con métricas agregadas en tiempo real (presupuestos activos, cobros, saldo).
- **Hardening de seguridad**: políticas RLS granulares, revocación de privilegios sobre el rol `anon`, columna de contraseña en claro eliminada y triggers que bloquean escaladas de privilegio.

### Stack tecnológico

- **Frontend:** React 19, TypeScript estricto, **TanStack Router v1.170+ y TanStack Start v1.168+** (versiones actualizadas y auditadas, sin vulnerabilidades conocidas tras `bun audit`), Vite 7, Tailwind CSS v4, Shadcn/UI, Lucide Icons, Sonner (toasts).
- **Backend gestionado:** Lovable Cloud (Supabase) — PostgreSQL, Auth, Row-Level Security, Storage.
- **Capa de acceso a datos:** cliente Supabase tipado autogenerado en `src/integrations/supabase`.
- **Tooling:** ESLint, Prettier, Bun (gestor de paquetes y lockfile), migraciones SQL versionadas en `supabase/migrations`.

### Design System (tokens principales)

- **Primary:** `#2563EB` · **Hover:** `#1D4ED8` · **Light:** `#DBEAFE`
- **Success:** `#10B981` · **Warning:** `#F59E0B` · **Destructive:** `#EF4444`
- **Neutrals:** Surface `#F9FAFB`, Border `#E5E7EB`, Muted `#6B7280`, Heading `#111827`
- **Tipografía:** Inter (400–800)

---

## 5. Guía de Instalación

### Requisitos previos

- Node.js 20+ (o Bun 1.1+).
- npm 10+ (o el gestor equivalente).
- Una instancia de Supabase con el esquema aplicado desde `supabase/migrations/`.

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO> presuapp
cd presuapp
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

> En entornos gestionados por Lovable Cloud estas variables se inyectan automáticamente y no requieren configuración manual.

### 4. Aplicar el esquema de base de datos

Ejecutar las migraciones de `supabase/migrations/` en orden cronológico contra la instancia Supabase (vía Supabase CLI, SQL editor o el flujo de Lovable Cloud). Esto crea tablas, policies RLS, triggers y la función `current_usuario_id()`.

### 5. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

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
| `/projects` · `/projects/:id` | Pipeline y detalle de proyecto (tabs: Presupuestos · Repositorio · Pagos) |
| `/catalog` | Inventario de servicios reutilizables |
| `/quotes` | Builder de presupuestos con motor de cálculo |

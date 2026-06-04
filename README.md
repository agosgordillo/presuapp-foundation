# PresuApp - Smart Budget Management System (Supabase Integrated)

## 👥 Integrantes del Grupo
- **Desarrollador/Integrante:** [Insertar Nombre Completo] (Trabajo Individual / Grupal)

## 📝 Descripción Técnica del Proyecto
**PresuApp** es una plataforma B2B SaaS integral de gestión de presupuestos y CRM financiero para trabajadores independientes y agencias de servicios. Permite digitalizar el catálogo de servicios, automatizar cotizaciones con cálculo impositivo en tiempo real y realizar el seguimiento transaccional de pagos sobre proyectos activos.

---

## 📐 Arquitectura del Ecosistema y Modelo de Datos
El sistema acopla una arquitectura SPA en el cliente con un motor de persistencia relacional en la nube (PostgreSQL administrado por Lovable Cloud / Supabase):

```text
src/
├── components/
│   ├── ui/          # Elementos atómicos del Design System (Botones, Inputs, Badges)
│   ├── landing/     # Secciones de la Landing Page de marketing (Hero, FAQ)
│   ├── layout/      # Envoltorio estructural de la aplicación (DashboardLayout)
│   └── showcase/    # Panel de pruebas estáticas de componentes (Showcase)
├── integrations/
│   └── supabase/    # Cliente Supabase autogenerado + tipos relacionales (Database)
├── pages/           # Controladores de vista interactivos vinculados a la base de datos
│   ├── auth/        # Vistas de acceso (Login, Registro, Recuperación)
│   ├── LandingPage.tsx
│   ├── Dashboard.tsx       # Métricas agregadas en vivo (presupuestos + pagos)
│   ├── ClientsList.tsx     # Cartera de clientes con alta y enlace dinámico
│   ├── ClientDetail.tsx    # Enrutamiento dinámico interactivo con Supabase (:id)
│   ├── ProjectsList.tsx    # Pipeline activo con alta de proyectos
│   ├── ProjectDetail.tsx   # Monitoreo de presupuestos y conciliación de cobros (:id)
│   ├── CatalogList.tsx     # Inventario de servicios reutilizables
│   └── QuotesList.tsx      # Builder multi-ítem con motor de cálculo
├── routes/          # Mapeo de rutas SPA file-based (TanStack Router)
└── main.tsx
```

---

## 🗄️ Esquema Relacional (PostgreSQL en Supabase)
Provisionado vía migración estricta, con Row-Level Security activa y todas las operaciones aisladas por usuario autenticado (`auth.uid()`).

| Tabla | Campos clave | Relación |
| --- | --- | --- |
| `usuarios` | `id` (INT PK), `auth_user_id` (UUID → auth.users), `nombre`, `email`, `empresa_nombre` | Tenant raíz |
| `clientes` | `id`, `usuario_id` (FK → usuarios), `nombre`, `email`, `telefono`, `empresa` | N:1 usuarios |
| `proyectos` | `id`, `cliente_id` (FK → clientes), `nombre`, `descripcion`, `estado`, `repositorio_url` | N:1 clientes |
| `catalogo_items` | `id`, `usuario_id`, `nombre`, `descripcion`, `tipo_unidad` (HR, U, SVC, MES, PROY), `precio_referecia` | N:1 usuarios |
| `presupuestos` | `id`, `proyecto_id`, `codigo` (#001), `fecha_emision`, `estado` (DRAFT…REJECTED), `subtotal`, `impuestos`, `total`, `pdf_url` | N:1 proyectos |
| `presupuesto_items` | `id`, `presupuesto_id`, `nombre_historico`, `tipo_unidad_historica`, `cantidad`, `precio_unitario`, `subtotal_item` | N:1 presupuestos |
| `pagos` | `id`, `proyecto_id`, `fecha_pago`, `monto`, `metodo` (TRANSFER…OTHER), `notas` | N:1 proyectos |

**Trigger automatizado:** `on_auth_user_created` aprovisiona la fila correspondiente en `usuarios` cada vez que se registra un nuevo usuario en `auth.users`, asegurando integridad referencial sin intervención manual.

---

## 🔐 Módulo de Autenticación
- **`/register`** — `supabase.auth.signUp` con metadata `nombre` + `empresa_nombre` que alimenta el trigger.
- **`/login`** — `supabase.auth.signInWithPassword`, sesión persistida y redirección a `/dashboard`.
- **`/forgot-password`** — `supabase.auth.resetPasswordForEmail` con feedback de éxito (`#DCFCE7`).

---

## 🧮 Leyes de Negocio Preservadas
1. **Motor de cálculo client-side (`/quotes`):** subtotales, impuestos (% configurable) y total se recalculan en vivo dentro del estado React antes de persistir. Los `subtotal_item` se computan por línea y se insertan junto al maestro `presupuestos` en una secuencia atómica.
2. **Regla anti-overflow de pagos (`/projects/:id`):** Antes de insertar en `pagos`, el cliente calcula `valor_contrato = Σ presupuestos.total WHERE estado='ACCEPTED'` y `saldo = contrato − Σ pagos`. Cualquier monto que exceda dispara un `toast.error` inmediato y aborta el insert.

---

## 🎨 Design System Tokens
- **Primary:** `#2563EB` · **Hover:** `#1D4ED8` · **Light:** `#DBEAFE`
- **Success:** `#10B981` (light `#DCFCE7`, dark `#166534`)
- **Warning:** `#F59E0B` · **Destructive:** `#EF4444`
- **Neutrals:** Surface `#F9FAFB`, Border `#E5E7EB`, Muted `#6B7280`, Heading `#111827`
- **Tipografía:** Inter (400-800)

---

## 🛠️ Stack Tecnológico
- **Frontend:** React 19, TanStack Router/Start, Vite 7, TypeScript estricto, Tailwind CSS v4, Shadcn/UI.
- **Backend (cloud):** Lovable Cloud (Supabase) — PostgreSQL + Auth + RLS.
- **Validación UX:** Sonner toasts, validaciones inline con iconografía Lucide.

---

## 🚀 Instalación y Ejecución
```bash
npm install
npm run dev
```
Accede a `http://localhost:5173`. La configuración de Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) se inyecta automáticamente por Lovable Cloud.

---

## 🧭 Mapa de Rutas SPA
| Ruta | Descripción |
| --- | --- |
| `/` | Landing comercial + UI Showcase |
| `/login`, `/register`, `/forgot-password` | Módulo de autenticación |
| `/dashboard` | KPIs agregados en tiempo real |
| `/clients`, `/clients/:id` | Cartera + ficha cliente dinámica |
| `/projects`, `/projects/:id` | Pipeline + tabs (Presupuestos / Repositorio / Pagos) |
| `/catalog` | Inventario de servicios |
| `/quotes` | Builder de presupuestos con motor de cálculo |

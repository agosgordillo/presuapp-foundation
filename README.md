# PresuApp - Smart Budget Management System (With Auth Architecture)

## 👥 Integrantes del Grupo
- **Desarrollador/Integrante:** [Insertar Nombre Completo] (Trabajo Individual / Grupal)

## 📝 Descripción Técnica del Proyecto
**PresuApp** es una plataforma web inteligente diseñada como una solución B2B SaaS y CRM ágil para freelancers, profesionales independientes y agencias creativas boutique que necesitan automatizar su flujo de cotizaciones, catálogos e historial de pagos.

---

## 📐 Arquitectura del Sistema (Estructura de Carpetas Actualizada)
El árbol del proyecto integra de forma modular el diseño atómico, la navegación por rutas SPA y las vistas críticas de autenticación:

```text
src/
├── components/
│   ├── ui/          # Primitivas del Design System (Button, Input, Badge, Card)
│   ├── landing/     # Secciones estructurales de la Landing Page (Hero, Features)
│   ├── layout/      # Envoltorio global de la aplicación (DashboardLayout)
│   ├── auth/        # NUEVO: Layout compartido y campos del módulo de Auth
│   └── showcase/    # Panel de pruebas del catálogo estático (Showcase)
├── pages/           # Vistas de página completas mapeadas por React Router DOM
│   ├── auth/        # NUEVO: Submódulo de Autenticación (Login, Register, Recovery)
│   ├── LandingPage.tsx
│   ├── Dashboard.tsx
│   ├── ClientsList.tsx
│   ├── ClientDetail.tsx
│   ├── ProjectsList.tsx
│   ├── ProjectDetail.tsx
│   ├── CatalogList.tsx
│   └── QuotesList.tsx
├── App.tsx          # Configuración central del Router, mapeo de rutas y parámetros
└── main.tsx
```

## 🔐 Módulo de Autenticación
El módulo unificado integra tres vistas críticas bajo un layout split-screen branded:

| Ruta | Vista | Descripción |
| --- | --- | --- |
| `/login` | Login | Email + password con toggle Eye/EyeOff, "Recordarme" y link a recuperación. |
| `/register` | Registro | Nombre, empresa (opcional), email, password y confirmación con validación de coincidencia. |
| `/forgot-password` | Recuperación | Email único con alerta verde de éxito (`#DCFCE7` / `#166534`). |

Todos los formularios muestran estados completos: focus azul (`#2563EB`), error crimson (`#EF4444`) con `AlertCircle`, y loading con spinner + "Procesando...". Tras una acción exitosa simulada, el usuario es redirigido programáticamente a `/dashboard`.

## 🎨 Design System Tokens
- **Primary:** `#2563EB` · **Hover:** `#1D4ED8` · **Light:** `#DBEAFE`
- **Success:** `#10B981` (light `#DCFCE7`, dark `#166534`)
- **Warning:** `#F59E0B` · **Destructive:** `#EF4444`
- **Neutrals:** Surface `#F9FAFB`, Border `#E5E7EB`, Muted text `#6B7280`, Heading `#111827`
- **Tipografía:** Inter (400-800)

## 🛠️ Stack Tecnológico
- **Frontend:** React 19, TanStack Router/Start, Vite 7, TypeScript, Tailwind CSS v4, Shadcn/UI.
- **Backend:** Node.js + Express + Prisma ORM (carpeta `/server`).
- **Validación UX:** Sonner toasts, validación inline con Lucide icons.

## 🚀 Instalación y Ejecución

### Frontend
```bash
npm install
npm run dev
```
Accede a `http://localhost:5173`.

### Backend
```bash
cd server
npm install
npx prisma migrate dev --name init
npm run dev
```

# PresuApp - Smart Budget Management System

## 👥 Integrantes del Grupo
- **Desarrollador/Integrante:** [Insertar Nombre Completo] (Trabajo Individual / Grupal)

## 📝 Descripción Técnica del Proyecto
**PresuApp** es una plataforma web inteligente diseñada como una solución B2B SaaS y CRM ágil para freelancers, profesionales independientes y agencias creativas boutique.

### Problemática que Resuelve:
Los profesionales independientes pierden múltiples horas mensuales estructurando propuestas de servicios, lidiando con errores de cálculo manuales de IVA/impuestos y perdiendo la trazabilidad financiera sobre qué cobros reales se han efectuado frente a los saldos pendientes de presupuestos aceptados.

### Perfil de Usuario Target:
- Freelancers de la economía del conocimiento (Diseñadores UX/UI, Desarrolladores, Consultores).
- Pequeñas agencias digitales y estudios creativos.

---

## 📐 Arquitectura de Carpetas y Enrutamiento (SPA)
El proyecto implementa un esquema modular y atómico, aislando primitivas de diseño, bloques de maquetación de la Landing Page y componentes de páginas ruteadas:

```text
src/
├── components/
│   ├── ui/          # Primitivas del Design System (Botones, Inputs, Badges, Cards)
│   ├── landing/     # Secciones modulares de la Landing Page (Hero, Features, FAQ)
│   ├── layout/      # Estructura de envoltorio global (DashboardLayout con barra de navegación)
│   └── showcase/    # Catálogo estático para validación de componentes (Showcase)
├── pages/           # Vistas de página mapeadas a las rutas del sistema SPA
│   ├── Dashboard.tsx
│   ├── ClientsList.tsx
│   ├── ClientDetail.tsx  # Ruta dinámica (:id)
│   ├── ProjectsList.tsx
│   ├── ProjectDetail.tsx  # Ruta dinámica (:id)
│   ├── CatalogList.tsx
│   └── QuotesList.tsx
├── routes/          # Declaración de rutas SPA (file-based routing)
└── router.tsx       # Configuración del router y mapeo de paths
```

### Mapa de Rutas
| Path                | Vista              | Tipo     |
|---------------------|--------------------|----------|
| `/`                 | LandingPage + Showcase | Estática |
| `/dashboard`        | Dashboard          | Estática |
| `/clients`          | ClientsList        | Estática |
| `/clients/:id`      | ClientDetail       | Dinámica |
| `/projects`         | ProjectsList       | Estática |
| `/projects/:id`     | ProjectDetail      | Dinámica |
| `/catalog`          | CatalogList        | Estática |
| `/quotes`           | QuotesList         | Estática |

---

## 🎯 Objetivos Técnicos Alcanzados

### 1. Sistema de Ruteo Consolidado (Entrega #3)
- **Navegación SPA Completa:** Infraestructura de enrutamiento client-side sin recarga de página.
- **Rutas Estáticas y Dinámicas:** Mapeo completo de la lógica de negocio incluyendo captura de identificadores por URL (`/clients/:id` y `/projects/:id`) mediante el hook `useParams`.
- **Layout Global de Aplicación:** `DashboardLayout` con sidebar persistente en desktop y drawer hamburguesa en mobile, compartido por todas las rutas internas.
- **Estructura de Páginas Escalable:** Cada ruta renderiza un componente dedicado con `<h1>` jerárquico, listo para inyección de datos lógicos.

### 2. Implementación de Design System y Landing Page (Entrega #2)
- **Variables Globales Coherentes:** Tokens estrictos basados en grilla de 8px y paleta corporativa (Azul `#2563EB`, Verde `#10B981`, Ámbar `#F59E0B`, Rojo `#EF4444`).
- **Catálogo de Componentes Estáticos (Showcase):** Espacio interactivo al final de la Landing Page que testea variantes de botones (incluyendo estado *Loading* con spinner animado), inputs con estados de error simulados, y badges de estado del ciclo de vida del presupuesto.

---

## 🛠️ Stack Tecnológico Utilizado
- **React 19** (Librería UI declarativa)
- **Vite 7** (Herramienta de compilación ultrarrápida para desarrollo frontend)
- **TypeScript** (Tipado estricto para estabilidad del software)
- **TanStack Router** (Motor de enrutamiento SPA type-safe con file-based routing y soporte para rutas dinámicas vía `useParams`)
- **Tailwind CSS 4 & Shadcn/UI** (Estilizado utilitario y componentes accesibles)

---

## 🚀 Guía de Instalación y Ejecución Local

Sigue estos pasos para clonar el repositorio, configurar dependencias locales y levantar la aplicación:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/[tu-usuario]/presuapp.git
cd presuapp
```

### 2. Instalar Dependencias del Sistema
```bash
npm install
```

### 3. Ejecutar el Proyecto en Entorno de Desarrollo Local
```bash
npm run dev
```
El servidor local se iniciará de forma predeterminada en la dirección: `http://localhost:5173`

# PresuApp - Smart Budget Management System (Full-Stack Architecture)

## 👥 Integrantes del Grupo
- **Desarrollador/Integrante:** [Insertar Nombre Completo] (Trabajo Individual / Grupal)

## 📝 Descripción Técnica del Proyecto
**PresuApp** es un ecosistema digital B2B SaaS desarrollado para optimizar la cadena de valor de freelancers y agencias boutique. Centraliza el ciclo completo de negocio: desde el alta de clientes y la cotización inteligente basada en un catálogo de servicios, hasta el rastreo automatizado de saldos pendientes y cobros reales en base de datos.

---

## 📐 Arquitectura del Sistema Completo (Monorepo Estructurado)
El sistema divide estrictamente las responsabilidades de la interfaz de usuario en el cliente de la lógica transaccional en el servidor:

```text
presuapp/
├── client/              # FRONTEND SPA (React + Vite)
│   ├── src/
│   │   ├── components/  # Primitivas de UI, Secciones de Landing y Showcase
│   │   ├── pages/       # Vistas de navegación mapeadas por React Router DOM
│   │   └── App.tsx      # Orquestador de rutas estáticas y dinámicas (:id)
└── server/              # BACKEND API REST (Express + TypeScript)
    ├── src/
    │   ├── config/      # Conexiones de Base de Datos e Inyección de Env
    │   ├── controllers/ # Orquestadores de peticiones HTTP e Interceptores
    │   ├── routes/      # Mapeo de rutas REST (/api/clients, /api/quotes, etc)
    │   ├── services/    # Lógica central de negocio y consultas transaccionales
    │   └── app.ts       # Inicialización del Servidor Express
    └── prisma/          # Esquemas relacionales y migraciones del ORM
```

## 🎯 Objetivos Técnicos e Hitos Alcanzados (Full-Stack Integration)

### 1. Motor del Servidor y API RESTful
- **Arquitectura de Software en Capas:** Desacoplamiento total mediante Controladores y Servicios independientes tipados estrictamente en TypeScript.
- **Automatización de Lógica de Negocio:** El backend calcula subtotales y tasas impositivas en tiempo real antes de la inserción, blindando la integridad de los datos financieros.
- **Reglas de Validación Estrictas:** Bloqueo transaccional que impide registrar un pago que exceda el saldo pendiente real de un proyecto.

### 2. Capa de Datos y Persistencia Relacional
- **Esquema ORM Robusto:** Modelado entidad-relación mediante Prisma, controlando de forma segura las relaciones jerárquicas de Clientes, Proyectos, Ítems del Catálogo, Presupuestos y Pagos.

## 🛠️ Stack Tecnológico Utilizado
- **Frontend:** React 18, Vite, TypeScript, React Router DOM 6, Tailwind CSS.
- **Backend Runtime:** Node.js con TypeScript (ts-node-dev).
- **Framework de Servidor:** Express.js.
- **Persistencia de Datos:** Prisma ORM + PostgreSQL / SQLite.
- **Seguridad:** CORS (Cross-Origin Resource Sharing) y Helmet Security Headers.

## 🚀 Guía de Instalación y Ejecución del Ecosistema Completo

### 1. Configuración del Servidor (Backend)
```bash
cd server
npm install
# Ejecutar migraciones iniciales de base de datos
npx prisma migrate dev --name init
# Iniciar servidor en entorno de desarrollo (Normalmente en Puerto 3000)
npm run dev
```

### 2. Configuración del Cliente (Frontend)
```bash
cd ../client
npm install
npm run dev
```

Accede localmente a la Landing Page e interfaces ruteadas a través de: `http://localhost:5173`

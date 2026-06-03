# PresuApp - Smart Budget Management System

## 👥 Integrantes del Grupo

- **Desarrollador/Integrante:** [Insertar Nombre Completo] (Trabajo Individual / Grupal)

## 📝 Descripción Técnica del Proyecto

**PresuApp** es una plataforma web inteligente diseñada específicamente como una solución B2B SaaS y CRM ágil para freelancers, profesionales independientes y pequeñas agencias de servicios globales.

### Problemática que Resuelve:

Los profesionales independientes suelen perder incontables horas mensuales armando presupuestos manualmente en hojas de cálculo desorganizadas, cometiendo errores críticos en el cálculo de impuestos y perdiendo la trazabilidad de qué cotizaciones han sido enviadas, cuáles fueron aceptadas y qué montos quedan pendientes de cobro real.

### Perfil de Usuario Target:

- Freelancers de la economía del conocimiento (Diseñadores UX/UI, Desarrolladores de Software, Consultores).
- Pequeñas agencias boutique de Marketing Digital y Diseño Web.
- Proveedores de servicios corporativos que facturan bajo modalidades mixtas (por hora, abonos mensuales o llave en mano).

---

## 📐 Arquitectura de Componentes y Carpetas

El proyecto implementa un patrón de arquitectura modular y atómico sobre React + Vite, separando de manera estricta los componentes reutilizables globales de las vistas contextuales de la Landing Page:

```text
src/
├── components/
│   ├── ui/          # Componentes primitivos atómicos (Botones, Inputs, Badges, Cards)
│   ├── landing/     # Secciones estructurales de la Landing Page (Hero, Features, FAQ, Footer)
│   └── showcase/    # Panel de Pruebas interactivo del Catálogo Estático (Showcase)
├── styles/          # Configuración global de Tailwind CSS y variables de tokens visuales
├── App.tsx          # Punto de entrada principal y orquestador de renderizado
└── main.tsx         # Inicialización del entorno React
```

---

## 🎯 Objetivos Alcanzados en esta Fase

1. **Consistencia Visual Absoluta:** Configuración e implementación de un Design System corporativo unificado mediante clases utilitarias globales de Tailwind CSS y primitivas visuales.
2. **Modularidad Estricta:** Creación de componentes desacoplados con contratos de propiedades estables y tipados estrictos en TypeScript.
3. **Mitigación de Incertidumbre:** Creación de un catálogo/hoja de ruta estática (*Showcase*) para evaluar de forma inmediata la fidelidad del diseño frente a la interfaz planteada en Figma.

## 🛠️ Tecnologías Utilizadas (Tech Stack)

- **React 18** (Biblioteca para la construcción de interfaces de usuario)
- **Vite** (Herramienta de empaquetado de alta velocidad para entornos frontend modernos)
- **TypeScript** (Tipado estricto para garantizar solidez operativa en el código)
- **Tailwind CSS** (Framework de estilos enfocado en utilidades bajo grilla de 8px)
- **Shadcn/UI & Lucide-React** (Base de componentes accesibles e iconografía moderna)

---

## 🚀 Guía de Instalación y Ejecución Local

Sigue estos pasos para clonar el repositorio, instalar las dependencias requeridas y levantar el entorno local de desarrollo:

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

El servidor local se iniciará comúnmente en la dirección: `http://localhost:5173`

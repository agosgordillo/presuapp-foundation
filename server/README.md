# PresuApp - Backend API

Servidor REST para PresuApp construido con Express + TypeScript + Prisma.

## Instalación

```bash
cd server
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

El servidor se ejecuta en `http://localhost:3000`.

## Endpoints principales

| Método | Path | Descripción |
|--------|------|-------------|
| GET    | `/api/health` | Health check |
| GET    | `/api/clients` | Listar clientes |
| POST   | `/api/clients` | Crear cliente |
| GET    | `/api/clients/:id` | Cliente + proyectos |
| POST   | `/api/projects` | Crear proyecto |
| GET    | `/api/catalog` | Catálogo de ítems |
| POST   | `/api/catalog` | Añadir ítem |
| GET    | `/api/quotes?search=&status=DRAFT,SENT` | Listar presupuestos |
| POST   | `/api/quotes` | Crear presupuesto (cálculo automático) |
| PATCH  | `/api/quotes/:id/status` | Transición de estado |
| POST   | `/api/payments` | Registrar pago (valida saldo) |
| GET    | `/api/payments/project/:projectId/balance` | Saldo del proyecto |

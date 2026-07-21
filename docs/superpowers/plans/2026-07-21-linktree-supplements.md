# Plan de Implementación: Sistema Linktree de Suplementos (Docker Self-Hosted)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un sistema Linktree autohospedado para una marca de suplementos con Next.js 14, Tailwind CSS (estética fitness dark/neón), Prisma ORM + SQLite, Autenticación JWT para el panel de administración, y contenedorización con Docker / Docker Compose para desarrollo en Windows y producción en Ubuntu VPS.

**Architecture:** La aplicación usará Next.js (App Router) con Server Components para la vista pública (`/`) y Server Actions / API Routes protegidos por middleware JWT para el panel de administración (`/admin`). Los datos se almacenan en una base de datos SQLite gestionada por Prisma ORM y persistida a través de un volumen de Docker.

**Tech Stack:** Next.js 14+ (App Router, TypeScript), Tailwind CSS, Lucide React Icons, Prisma ORM, SQLite, `bcryptjs`, `jose` (JWT), Docker & Docker Compose.

## Global Constraints

- Estética visual: Dark mode premium (`#0B0F17`), acentos en verde esmeralda neón (`#10B981`), glassmorphism y fuente sans-serif limpia.
- Base de Datos: SQLite autohospedada localmente en `/app/prisma/dev.db`.
- Autenticación: Cookie HTTP-Only con JWT token firmado mediante `jose` y contraseñas hasheadas con `bcryptjs`.
- Docker: Multi-stage build con Next.js standalone output y `docker-compose.yml` con volumen persistente `sqlite_data`.

---

### Task 1: Inicialización del Proyecto Next.js, Tailwind CSS y Prisma SQLite

**Files:**
- Create: `package.json`, `tailwind.config.js`, `src/app/globals.css`, `prisma/schema.prisma`, `src/lib/prisma.ts`, `prisma/seed.ts`

**Interfaces:**
- Produces: Conexión Singleton de Prisma Client en `src/lib/prisma.ts` y modelos Prisma (`User`, `BrandProfile`, `Product`, `Link`).

- [ ] **Step 1: Inicializar proyecto Next.js 14 con TypeScript y Tailwind CSS**
- [ ] **Step 2: Instalar dependencias necesarias (`@prisma/client`, `prisma`, `bcryptjs`, `jose`, `lucide-react`, `clsx`, `tailwind-merge`)**
- [ ] **Step 3: Crear el esquema de Prisma en `prisma/schema.prisma` con SQLite**
- [ ] **Step 4: Crear cliente Prisma Singleton en `src/lib/prisma.ts`**
- [ ] **Step 5: Crear script de seed `prisma/seed.ts` con perfil de marca inicial y usuario admin por defecto**
- [ ] **Step 6: Ejecutar migración/push inicial y seed de base de datos**
- [ ] **Step 7: Commit del Task 1**

```bash
git add .
git commit -m "feat: setup Next.js project with Tailwind CSS and Prisma SQLite schema"
```

---

### Task 2: Servicio de Autenticación JWT y Middleware

**Files:**
- Create: `src/lib/auth.ts`, `src/middleware.ts`, `src/app/api/auth/login/route.ts`, `src/app/api/auth/logout/route.ts`

**Interfaces:**
- Consumes: Prisma User model.
- Produces: `verifyJWT()`, `signJWT()`, cookie `admin_token`, protección de rutas `/admin/dashboard*` y `/api/admin/*`.

- [ ] **Step 1: Crear `src/lib/auth.ts` con funciones de hashing (`bcryptjs`) y token JWT (`jose`)**
- [ ] **Step 2: Crear API Route `/api/auth/login` que valide credenciales y establezca cookie HTTP-Only**
- [ ] **Step 3: Crear API Route `/api/auth/logout` que limpie la cookie de sesión**
- [ ] **Step 4: Crear Middleware en `src/middleware.ts` para redirigir peticiones no autenticadas a `/admin/login`**
- [ ] **Step 5: Probar flujo de autenticación JWT**
- [ ] **Step 6: Commit del Task 2**

```bash
git add src/lib/auth.ts src/middleware.ts src/app/api/auth/
git commit -m "feat: add JWT authentication service, login routes, and middleware protection"
```

---

### Task 3: Vista Pública Linktree de Suplementos & Componentes UI

**Files:**
- Create: `src/app/page.tsx`, `src/components/Header.tsx`, `src/components/PromoBanner.tsx`, `src/components/ProductGrid.tsx`, `src/components/LinksList.tsx`, `src/components/WhatsAppFloat.tsx`, `src/app/api/click/route.ts`

**Interfaces:**
- Consumes: Prisma models (`BrandProfile`, `Product`, `Link`).
- Produces: Landing page pública responsiva para la bio de redes sociales.

- [ ] **Step 1: Crear `src/components/Header.tsx` (Logo, insignia oficial de verificación, título de marca y bio)**
- [ ] **Step 2: Crear `src/components/PromoBanner.tsx` (Banner de descuento con cupón copiable en 1 clic)**
- [ ] **Step 3: Crear `src/components/ProductGrid.tsx` (Tarjetas de suplementos con precio, badge de oferta y botón de compra)**
- [ ] **Step 4: Crear `src/components/LinksList.tsx` (Botones de enlaces sociales e institucionales)**
- [ ] **Step 5: Crear `src/components/WhatsAppFloat.tsx` (Botón flotante de WhatsApp con pulso animado)**
- [ ] **Step 6: Crear API route `/api/click` para incrementar contador de clics**
- [ ] **Step 7: Probar la vista pública `/`**
- [ ] **Step 8: Commit del Task 3**

```bash
git add src/app/page.tsx src/components/ src/app/api/click/
git commit -m "feat: implement public linktree view with supplement products, promo banner, and custom buttons"
```

---

### Task 4: Panel de Administración (CRUD de Productos, Enlaces y Configuración)

**Files:**
- Create: `src/app/admin/login/page.tsx`, `src/app/admin/dashboard/page.tsx`, `src/app/api/admin/products/route.ts`, `src/app/api/admin/links/route.ts`, `src/app/api/admin/brand/route.ts`

**Interfaces:**
- Consumes: Authentication JWT Middleware, Prisma Client.
- Produces: Interfaz administrativa `/admin/dashboard` para control total de datos.

- [ ] **Step 1: Crear vista `/admin/login` con formulario estilizado**
- [ ] **Step 2: Crear vista `/admin/dashboard` con pestañas para Productos, Enlaces y Configuración**
- [ ] **Step 3: Crear API routes para CRUD de Productos (`/api/admin/products`)**
- [ ] **Step 4: Crear API routes para CRUD de Enlaces (`/api/admin/links`)**
- [ ] **Step 5: Crear API route para actualización del Perfil de Marca (`/api/admin/brand`)**
- [ ] **Step 6: Probar creación, edición y eliminación desde el panel**
- [ ] **Step 7: Commit del Task 4**

```bash
git add src/app/admin/ src/app/api/admin/
git commit -m "feat: add admin dashboard with CRUD operations for products, links, and brand settings"
```

---

### Task 5: Contenedorización con Docker & Docker Compose

**Files:**
- Create: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `scripts/entrypoint.sh`

**Interfaces:**
- Consumes: Next.js standalone output, Prisma SQLite database file.
- Produces: Entorno portable listo para desarrollo en Windows y producción en Ubuntu VPS.

- [ ] **Step 1: Configurar Next.js para `output: 'standalone'` en `next.config.mjs`**
- [ ] **Step 2: Crear `Dockerfile` multi-stage optimizado para producción**
- [ ] **Step 3: Crear script `scripts/entrypoint.sh` para ejecutar `npx prisma db push` y lanzar la app**
- [ ] **Step 4: Crear `docker-compose.yml` con volumen persistente `sqlite_data`**
- [ ] **Step 5: Crear `.dockerignore`**
- [ ] **Step 6: Probar construcción y ejecución de contenedor local**
- [ ] **Step 7: Commit del Task 5**

```bash
git add Dockerfile docker-compose.yml .dockerignore scripts/ next.config.mjs
git commit -m "feat: add Docker multi-stage configuration and docker-compose for VPS deployment"
```

---

### Task 6: Verificación Global y Documentación de Despliegue

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: Todo el sistema finalizado.
- Produces: Documentación paso a paso para desplegar en Ubuntu VPS con Docker.

- [ ] **Step 1: Probar build de producción local (`npm run build`)**
- [ ] **Step 2: Escribir `README.md` con instrucciones de desarrollo en Windows y despliegue en VPS Ubuntu**
- [ ] **Step 3: Commit final**

```bash
git add README.md
git commit -m "docs: add complete deployment guide and project README"
```

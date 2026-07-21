# Spec de Diseño: Sistema Linktree de Suplementos (Docker & Self-Hosted)

**Fecha**: 2026-07-21  
**Estado**: Aprobado por el usuario  
**Propósito**: Crear un sistema de enlaces tipo Linktree enfocado en la conversión de ventas para una tienda de suplementos deportivos, con panel de administración con autenticación, base de datos SQLite persistente con Prisma, containerizado con Docker para desarrollo en Windows y despliegue en VPS Ubuntu.

---

## 1. Visión General del Proyecto
El proyecto `linktree_kallpay` es una plataforma web autohospedada, moderna y optimizada para dispositivos móviles. Permite a una marca de suplementos mostrar un banner promocional con cupones, productos destacados con botón de compra/WhatsApp, enlaces sociales y botones de acción, administrados desde un panel de control privado con autenticación.

---

## 2. Arquitectura y Stack Tecnológico

### 2.1 Stack Principal
- **Framework**: Next.js 14+ (App Router, Server Components y Server Actions).
- **Estilos & UI**: Tailwind CSS, Lucide React Icons.
- **Estética Visual**: Dark Mode Fitness (`#0B0F17` fondo, `#10B981` verde esmeralda neón, glassmorphism, tipografía Inter/Outfit).
- **Base de Datos & ORM**: SQLite con Prisma ORM.
- **Autenticación**: JWT en Cookie `HTTP-Only` cifrada usando `jose` y hash de contraseñas con `bcryptjs`.
- **Contenedorización**: `Dockerfile` multi-stage (Next.js standalone mode) y `docker-compose.yml` con volumen persistente para SQLite.

---

## 3. Modelo de Datos (Prisma Schema)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model BrandProfile {
  id                 String  @id @default("default")
  title              String  @default("Kallpay Suplementos")
  bio                String  @default("Suplementación deportiva de alta calidad 🏋️‍♂️")
  logoUrl            String?
  whatsappNumber     String  @default("51999999999")
  whatsappDefaultMsg String  @default("Hola! Vengo de su Linktree y deseo información de los suplementos.")
  bannerText         String? @default("🔥 10% OFF en tu primera compra con el cupón")
  promoCode          String? @default("FIT10")
  showBanner         Boolean @default(true)
}

model Product {
  id        String   @id @default(uuid())
  title     String
  price     String
  imageUrl  String
  buyUrl    String
  badgeText String?  // Ej: "Más vendido", "Oferta"
  position  Int      @default(0)
  active    Boolean  @default(true)
  clicks    Int      @default(0)
  createdAt DateTime @default(now())
}

model Link {
  id        String   @id @default(uuid())
  title     String
  url       String
  icon      String   @default("link") // instagram, tiktok, globe, pdf, message-circle, shopping-bag
  position  Int      @default(0)
  active    Boolean  @default(true)
  clicks    Int      @default(0)
  createdAt DateTime @default(now())
}
```

---

## 4. Módulos y Funcionalidades

### 4.1 Vista Pública (`/`)
1. **Header de Marca**: Avatar/Logo, nombre de la marca, verificación dorada/esmeralda y bio fitness.
2. **Banner Promocional**: Mensaje de descuento con botón interactivo de 1-clic para copiar el cupón (`FIT10`).
3. **Productos Destacados**: Grid/Carrusel de suplementos con imagen, nombre, precio, insignia (badge) y botón de compra (WhatsApp / Tienda).
4. **Lista de Enlaces**: Botones estilizados con efecto hover neón e iconos representativos.
5. **Botón Flotante de WhatsApp**: Fijado en la esquina inferior derecha con tooltip e indicador de disponibilidad en línea.

### 4.2 Panel de Administración (`/admin`)
1. **`/admin/login`**: Formulario de inicio de sesión con correo y contraseña.
2. **`/admin` (Dashboard)**:
   - **Gestor de Productos**: Formulario para crear, editar, eliminar, ordenar y activar/desactivar suplementos.
   - **Gestor de Enlaces**: Formulario para añadir, editar, ordenar y eliminar enlaces sociales o de catálogo.
   - **Configuración de Marca & Promo**: Actualización de logo, número de WhatsApp, mensaje predeterminado y banner de cupón.
   - **Métricas**: Indicadores de total de clics recibidos en enlaces y productos.

---

## 5. Docker y Despliegue en VPS (Ubuntu)

### 5.1 `Dockerfile`
- Multi-stage build utilizando Node.js LTS Alpine.
- Ejecuta `prisma generate` y construye la app en modo standalone de Next.js.

### 5.2 `docker-compose.yml`
- Define la aplicación `linktree` escuchando en el puerto 3000.
- Monta un volumen nombrado (`sqlite_data`) hacia `/app/prisma` para evitar pérdida de datos SQLite en reinicios o despliegues.
- Configura las variables de entorno `DATABASE_URL=file:/app/prisma/dev.db` y `JWT_SECRET`.

---

## 6. Criterios de Aceptación
- La aplicación se ejecuta correctamente en Windows durante el desarrollo local (`npm run dev`).
- La aplicación se compila y levanta limpiamente dentro de Docker en producción.
- La base de datos se inicializa automáticamente con datos por defecto de la marca y un usuario administrador inicial.
- El panel `/admin` requiere autenticación y protege todas las acciones de modificación.
- La vista pública es totalmente responsiva y rápida en dispositivos móviles.

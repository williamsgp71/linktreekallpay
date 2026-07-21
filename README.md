# KallPay Linktree - Plataforma Autohospedada

Sistema Linktree autohospedado para marca de suplementos deportivos diseñado con una estética **Dark Mode Fitness** moderna, elegante y orientada a la conversión.

## 🚀 Características Principales

### 📱 Vista Pública (Alta Conversión)
- **Banner Promocional Interactivo**: Copiado de cupón de descuento en 1-clic con feedback visual.
- **Productos Destacados**: Tarjetas de productos con imagen, descripción, precio y badge de promoción/destacado.
- **Enlaces Personalizados**: Acceso rápido a redes sociales y canales de atención con seguimiento de clics.
- **Botón Flotante de WhatsApp**: Integración directa con mensaje automatizado personalizado.

### 🛡️ Panel de Administración (Seguro con JWT)
- **Autenticación Robusta**: Login protegido por tokens JWT guardados en cookies HTTP-only.
- **Gestión CRUD Completa**:
  - Productos (crear, editar, eliminar, ordenar, badges, precios, links).
  - Enlaces de redes sociales y ofertas.
  - Perfil de marca (avatar, nombre, bio, WhatsApp automatizado).
  - Banner promocional (título, descripción, código de cupón, estado activo/inactivo).

### 📊 Métricas en Tiempo Real
- **Contador de clics por ítem**: Registro automático de la interacción de los usuarios en cada enlace y producto.

---

## 📋 Requisitos Previos

- **Node.js**: `v18.x` o `v20.x` superior.
- **Docker & Docker Compose**: (Para despliegue en servidor / producción).

---

## 🛠️ Desarrollo Local (Windows / Linux / macOS)

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Sincronizar esquema de base de datos (SQLite / Prisma)**:
   ```bash
   npx prisma db push
   ```

3. **Poblar la base de datos con datos iniciales (Seed)**:
   ```bash
   npx prisma db seed
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

5. **Acceso a la Aplicación**:
   - **Vista Pública**: `http://localhost:3000`
   - **Panel de Admin**: `http://localhost:3000/admin/login`

6. **Credenciales por Defecto (Semilla)**:
   - **Email**: `admin@kallpay.com`
   - **Password**: `admin123`

---

## 🐳 Despliegue en Producción (VPS Ubuntu con Docker)

El proyecto incluye soporte nativo para despliegue encapsulado usando Docker y Docker Compose.

### 1. Clonar el Repositorio en el VPS
```bash
git clone <URL_DEL_REPOSITORIO> /opt/linktree_kallpay
cd /opt/linktree_kallpay
```

### 2. Configurar Variables de Entorno
Asegúrate de ajustar `JWT_SECRET` en el archivo `docker-compose.yml` o crear un archivo `.env`:
```yaml
environment:
  - DATABASE_URL=file:/app/prisma/dev.db
  - JWT_SECRET=tu_clave_secreta_super_segura_aqui
```

### 3. Desplegar con Docker Compose
```bash
docker compose up -d --build
```

### 4. Persistencia de Datos
El contenedor utiliza el volumen nombrado `sqlite_data` mapeado en la ruta `/app/prisma`. Esto garantiza que la base de datos SQLite y todos los datos persistan de forma segura entre reinicios, reconstrucciones o actualizaciones de los contenedores Docker.

### 5. Proxy Inverso Recomendado (HTTPS)
Para producción, se recomienda utilizar un proxy inverso como **Nginx**, **Caddy** o **Cloudflare Tunnels** para gestionar la terminación SSL/TLS (HTTPS).

#### Ejemplo de Configuración Nginx:
```nginx
server {
    server_name linktree.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📜 Licencia & Créditos

Desarrollado para KallPay. Todos los derechos reservados.

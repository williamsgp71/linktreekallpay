# Plan de Implementación: Reseteo de Password, WhatsApp Automatizado e Info Real de Kallpay

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar mecanismo de reseteo de contraseña por CLI/Admin, mejorar mensajes predeterminados de WhatsApp por producto, e integrar la información y productos reales de la marca desde https://kallpay.us/ en la base de datos y la interfaz.

**Architecture:** Se agregará un script ejecutable TypeScript para reseteo de contraseña por CLI, un endpoint `/api/admin/change-password` para cambio de clave en el dashboard, lógica de generación de URLs de WhatsApp con mensajes dinámicos en el componente `ProductGrid`, y actualización del script `prisma/seed.ts` con datos reales de Kallpay.

---

### Task 1: Reseteo de Contraseña (Script CLI y Cambio en Dashboard)

**Files:**
- Create: `scripts/reset-password.ts`, `src/app/api/admin/change-password/route.ts`
- Modify: `package.json`, `src/app/admin/dashboard/page.tsx`

- [ ] **Step 1: Crear `scripts/reset-password.ts` que reciba argumento de nueva clave, haga hash con `bcryptjs` y actualice el usuario admin en SQLite**
- [ ] **Step 2: Añadir script `"reset-password": "npx tsx scripts/reset-password.ts"` en `package.json`**
- [ ] **Step 3: Crear API Route `/api/admin/change-password` (POST) para cambiar la clave desde la interfaz protegida**
- [ ] **Step 4: Añadir formulario de cambio de contraseña en la pestaña Configuración de `/admin/dashboard`**
- [ ] **Step 5: Probar reseteo por CLI y cambio por panel**
- [ ] **Step 6: Commit del Task 1**

```bash
git add .
git commit -m "feat: add CLI password reset script and admin dashboard password change form"
```

---

### Task 2: Mensajes Automatizados de WhatsApp por Producto y Formato Dinámico

**Files:**
- Modify: `src/components/ProductGrid.tsx`, `src/components/WhatsAppFloat.tsx`

- [ ] **Step 1: Modificar `ProductGrid.tsx` para que si `buyUrl` contiene `wa.me` o `#whatsapp` o está vacío, genere automáticamente el enlace a WhatsApp con el mensaje pre-llenado:**
  `Hola! Vengo de su Linktree y deseo información / comprar el producto: [Nombre] ([Precio]).`
- [ ] **Step 2: Asegurar que el botón flotante `WhatsAppFloat.tsx` use el mensaje general predeterminado configurado en el perfil de la marca**
- [ ] **Step 3: Commit del Task 2**

```bash
git add src/components/ProductGrid.tsx src/components/WhatsAppFloat.tsx
git commit -m "feat: implement product-specific WhatsApp inquiry messages"
```

---

### Task 3: Actualización con Datos Reales de Kallpay (kallpay.us)

**Files:**
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Actualizar `prisma/seed.ts` con la información real de Kallpay:**
  - `title`: "Kallpay"
  - `bio`: "Ancestral wisdom & modern science. Suplementos, fórmulas herbales y orientación de salud personalizada 🌿"
  - `whatsappNumber`: "16193622288"
  - `whatsappDefaultMsg`: "Hola! Vengo de su Linktree y quisiera información sobre sus suplementos y programas de salud."
  - `bannerText`: "✨ Asesoría Inicial de Salud de 20 minutos GRATIS con nuestros especialistas"
  - `promoCode`: "CONSULTA20"
  - Productos reales:
    1. `AlgaeCal Collagen` ($55.99 USD) - Badge: "Popular"
    2. `Milk Thistle Plus` ($35.99 USD) - Badge: "Detox & Hígado"
    3. `Mastica Digest - 120 Capsules` ($43.99 USD) - Badge: "Salud Digestiva"
    4. `Nattokinase Circulatory Enzymes` ($44.99 USD) - Badge: "Circulación"
    5. `Consulta Inicial Coaching de Salud (20 min)` ($0.00 USD) - Badge: "Gratis"
  - Enlaces reales:
    1. `🛒 Tienda Completa de Suplementos` (`https://kallpay.us/collections/all`) - Icono `shopping-bag`
    2. `📅 Agendar Consulta Gratuita (20 min)` (`https://kallpay.us/pages/book-now-20`) - Icono `calendar`
    3. `🌿 Sobre Nosotros & Historia Kallpay` (`https://kallpay.us/pages/our-story`) - Icono `globe`
    4. `📸 Instagram Oficial (@kallpay.us)` (`https://www.instagram.com/kallpay.us/`) - Icono `instagram`
- [ ] **Step 2: Ejecutar `npx prisma db seed` para actualizar la base de datos local**
- [ ] **Step 3: Verificar compilación con `npx tsc --noEmit` y `npm run build`**
- [ ] **Step 4: Commit final**

```bash
git add .
git commit -m "feat: update seed data and branding with official Kallpay website content"
```

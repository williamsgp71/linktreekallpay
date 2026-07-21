# Plan de Implementación: Soporte Multi-Lenguaje (i18n: Inglés por defecto / Español)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar soporte bilingüe completo (Inglés como idioma predeterminado y Español opcional) en el esquema de base de datos, la vista pública (con selector de idioma EN/ES) y el panel de administración.

**Architecture:** Se actualizarán los modelos de Prisma para almacenar títulos, bios, banners y badges en `En` y `Es`. Se creará un helper de internacionalización `src/lib/i18n.ts` con diccionario estático y soporte para almacenar la preferencia de idioma en el cliente. El panel admin permitirá gestionar los campos bilingües.

---

### Task 1: Esquema Prisma Bilingüe & Sembrado de Datos

**Files:**
- Modify: `prisma/schema.prisma`, `prisma/seed.ts`

- [ ] **Step 1: Modificar `prisma/schema.prisma` agregando campos bilingües (`titleEn`, `titleEs`, `bioEn`, `bioEs`, `bannerTextEn`, `bannerTextEs`, `badgeTextEn`, `badgeTextEs`, `whatsappDefaultMsgEn`, `whatsappDefaultMsgEs`)**
- [ ] **Step 2: Actualizar `prisma/seed.ts` con datos completos en Inglés y Español para Kallpay**
- [ ] **Step 3: Ejecutar `npx prisma db push` y `npx prisma db seed`**
- [ ] **Step 4: Commit del Task 1**

```bash
git add prisma/
git commit -m "feat: update prisma schema and seed data for bilingual support (EN/ES)"
```

---

### Task 2: Selector de Idioma (LanguageToggle) e Integración i18n en Vista Pública

**Files:**
- Create: `src/lib/i18n.ts`, `src/components/LanguageToggle.tsx`
- Modify: `src/app/page.tsx`, `src/components/Header.tsx`, `src/components/PromoBanner.tsx`, `src/components/ProductGrid.tsx`, `src/components/LinksList.tsx`, `src/components/WhatsAppFloat.tsx`

- [ ] **Step 1: Crear `src/lib/i18n.ts` con los diccionarios UI (`en` por defecto, `es`) y tipo `Language = 'en' | 'es'`**
- [ ] **Step 2: Crear `src/components/LanguageToggle.tsx` con botones estilizados `[ EN | ES ]`**
- [ ] **Step 3: Actualizar componentes públicos para renderizar el contenido dinámico según el idioma seleccionado (`en` por defecto)**
- [ ] **Step 4: Probar la vista pública `/` alternando entre Inglés y Español**
- [ ] **Step 5: Commit del Task 2**

```bash
git add src/lib/i18n.ts src/components/ src/app/page.tsx
git commit -m "feat: add i18n language selector and bilingual public view with English as default"
```

---

### Task 3: Actualización del Panel Admin para Gestión Bilingüe (EN / ES)

**Files:**
- Modify: `src/app/admin/dashboard/page.tsx`, `src/app/api/admin/products/route.ts`, `src/app/api/admin/products/[id]/route.ts`, `src/app/api/admin/links/route.ts`, `src/app/api/admin/links/[id]/route.ts`, `src/app/api/admin/brand/route.ts`

- [ ] **Step 1: Modificar API routes de admin para aceptar y validar campos en Inglés y Español**
- [ ] **Step 2: Modificar formularios del dashboard `/admin/dashboard` para permitir ingresar títulos, bios y badges en Inglés y Español**
- [ ] **Step 3: Probar creación y edición de productos, enlaces y perfil en ambos idiomas**
- [ ] **Step 4: Commit del Task 3**

```bash
git add src/app/admin/ src/app/api/admin/
git commit -m "feat: update admin dashboard forms and API endpoints for bilingual content management"
```

---

### Task 4: Verificación Final y Build

- [ ] **Step 1: Ejecutar `npx tsc --noEmit`**
- [ ] **Step 2: Ejecutar `npm run build`**
- [ ] **Step 3: Commit final**

```bash
git add .
git commit -m "docs: finish multi-language integration with English as default"
```

# Personalización de colores de marca — Diseño

## Contexto

El proyecto es un bio-link/Linktree para Kallpay Supplements. Actualmente el tema visual (fondo `#0B0F17`, tarjetas `#161E2E`, acento verde esmeralda `#10B981`, texto claro) está hardcodeado con clases de Tailwind en la página pública (`PublicView`, `Header`, `PromoBanner`, `ProductGrid`, `LinksList`) y en el panel de administración (`admin/login`, `admin/dashboard`). Se quiere permitir que el administrador configure estos colores desde el panel, con vista previa en vivo, y que se apliquen tanto en la página pública como en el propio panel admin.

## Alcance

Colores configurables:
- Fondo general de la página
- Fondo de tarjetas/banner/header
- Color de acento (botones, precios, links activos)
- Color de texto principal

Fuera de alcance (quedan fijos, decisión explícita del usuario):
- Colores de estado: rojo (eliminar/error), verde de notificaciones de éxito (toast), ámbar y morado (destacados de Analíticas) — todos son colores semánticos de UI, no de marca, y no siguen el acento configurado
- Verde de marca de WhatsApp en el botón flotante — se mantiene siempre verde WhatsApp, no sigue el acento configurado
- Validación automática de contraste de accesibilidad

## Modelo de datos

Se agregan 4 campos a `BrandProfile` en `prisma/schema.prisma`, cada uno con `@default(...)` igual al tema actual (cambio no destructivo, aplicado vía `prisma db push`, que es el flujo que ya usa el proyecto — no hay carpeta de migraciones):

```prisma
model BrandProfile {
  // ...campos existentes sin cambios
  colorBackground String @default("#0B0F17")
  colorCard       String @default("#161E2E")
  colorAccent     String @default("#10B981")
  colorText       String @default("#F3F4F6")
}
```

`GET /api/admin/brand` y `POST` (creación con defaults) no necesitan cambios más allá de que Prisma ya devuelve/crea estos campos automáticamente por sus defaults.

`PUT /api/admin/brand` se extiende para aceptar y persistir los 4 campos nuevos, siguiendo el mismo patrón que los campos existentes (`campo !== undefined ? campo : existingProfile.campo`). Antes de guardar, valida cada color contra `/^#([0-9A-Fa-f]{3}){1,2}$/`; si alguno no matchea, responde `400` con `{ error: 'Color inválido' }` sin tocar la base de datos.

## Mecanismo de theming

**Tailwind config** (`tailwind.config.ts`): los tokens de color que representan fondo/tarjeta/acento/texto pasan de hex fijos a variables CSS:

```ts
colors: {
  darkBg: "var(--color-bg)",
  darkCard: "var(--color-card)",
  brand: {
    accent: "var(--color-accent)",
    text: "var(--color-text)",
  },
}
```

**`ThemeStyle` component** (nuevo: `src/components/ThemeStyle.tsx`): recibe los 4 valores de color como props y renderiza un `<style>` inline definiendo las variables CSS en `:root`:

```css
:root {
  --color-bg: #0B0F17;
  --color-card: #161E2E;
  --color-accent: #10B981;
  --color-text: #F3F4F6;
}
```

Se monta una sola vez en `src/app/layout.tsx` (root layout compartido por `/` y `/admin/*`), leyendo el `BrandProfile` en el server component del layout. Esto garantiza una única fuente de verdad que pinta tanto la página pública como el panel admin.

**Reemplazo de clases hardcodeadas**:
- Los componentes públicos (`PublicView`, `Header`, `PromoBanner`, `ProductGrid`, `LinksList`) ya usan en su mayoría los tokens `darkBg`, `darkCard`, `emeraldAccent`, `neonAccent` del `tailwind.config.ts` en vez de hex directo — para estos basta con redefinir esos tokens para que apunten a las variables CSS (`emeraldAccent` y `neonAccent` apuntan ambos a `var(--color-accent)`, sin variante más clara separada). Los pocos hex sueltos que queden (ej. `bg-[#0B0F17]` en `PublicView.tsx:56`) se cambian a `bg-darkBg`. Se agrega el token de texto (`text-brand-text`) donde hoy se usa `text-gray-100`/`text-white` para texto principal (no en textos secundarios grises como `text-gray-400`, que quedan fijos como jerarquía visual).
- `admin/login/page.tsx` y `admin/dashboard/page.tsx` usan hex directo (`bg-[#0B0F17]`, `bg-[#161E2E]`) y la paleta nativa de Tailwind (`emerald-500`, `emerald-400`, etc.) en vez de los tokens custom. Se reemplazan por los mismos tokens (`bg-darkBg`, `bg-darkCard`, `bg-brand-accent`, `text-brand-accent`) **solo en los usos de marca/acento** (botones primarios, tab activo, bordes de foco, logo, precios): no en los toasts de éxito/error, badges ámbar/morado de analíticas, ni en textos secundarios grises, que se dejan con sus clases Tailwind actuales.

## Formulario y vista previa en vivo

Nueva sub-sección "Colores" dentro de la pestaña "Configuración de Marca" existente en `admin/dashboard/page.tsx`, con 4 filas (Fondo, Tarjetas, Acento, Texto). Cada fila tiene:
- Un `<input type="color">` (picker nativo)
- Un `<input type="text">` con el hex, sincronizado bidireccionalmente con el picker
- Ambos ligados al mismo estado `brand.colorBackground` / `colorCard` / `colorAccent` / `colorText` (extensión del `useState<BrandProfile>` ya existente)

**Vista previa en vivo**: cada `onChange` de un color, además de actualizar el estado de React, llama a `document.documentElement.style.setProperty('--color-bg', value)` (u la variable correspondiente). Esto repinta instantáneamente el propio panel admin sin recargar la página ni requerir un iframe de preview separado. Al pulsar "Guardar Cambios" se persiste con `PUT /api/admin/brand` igual que los demás campos de marca; la página pública reflejará el cambio en su próxima carga (SSR lee el `BrandProfile` actualizado).

**Validación en el input de texto**: el campo hex de texto libre solo aplica el cambio (estado + variable CSS) si el valor matchea `/^#([0-9A-Fa-f]{3}){1,2}$/`, evitando que un valor incompleto mientras se escribe rompa el preview. El `<input type="color">` siempre produce hex válido y no necesita esta validación.

**Botón "Restaurar valores por defecto"**: junto al bloque de colores, resetea los 4 campos y las variables CSS en vivo a `#0B0F17`, `#161E2E`, `#10B981`, `#F3F4F6` sin persistir — requiere pulsar "Guardar Cambios" para confirmar.

## Manejo de errores

- Frontend: valores hex inválidos escritos a mano no se aplican (ver validación arriba); no se muestra error bloqueante, simplemente no actualiza hasta que sea válido.
- Backend: `PUT /api/admin/brand` devuelve `400` con mensaje de error si algún color no matchea el formato hex, mostrado vía el sistema de toast ya existente (`showToast('error', ...)`).
- No se agrega validación de contraste de accesibilidad (fuera de alcance, decisión explícita).

## Plan de pruebas

Manual (el proyecto no tiene suite de tests automatizados; no se introduce infraestructura de testing nueva para esta feature):
1. Cambiar cada uno de los 4 colores en el panel y confirmar que el preview en vivo repinta el propio dashboard al instante.
2. Guardar cambios, recargar `/` (página pública) y `/admin/login`, confirmar que los nuevos colores persisten.
3. Caso borde: primer arranque sin `BrandProfile` en la BD — confirmar que se crea con los defaults del tema actual (`#0B0F17`, `#161E2E`, `#10B981`, `#F3F4F6`) sin romper nada.
4. Caso borde: escribir un hex inválido en el campo de texto — confirmar que no rompe el preview ni se envía al backend; probar también enviar un color inválido directo a la API y confirmar `400`.
5. Confirmar que los colores de estado (rojo eliminar/error, ámbar, morado) y el verde del botón de WhatsApp no cambian al modificar el acento.

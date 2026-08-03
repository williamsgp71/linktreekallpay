# Personalización de Colores de Marca — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the Kallpay admin configure background, card, accent, and text colors from the admin panel, with live preview, applied to both the public bio page and the admin panel itself.

**Architecture:** Four new hex color fields on `BrandProfile` (Prisma/SQLite) are rendered into CSS custom properties (`--color-bg`, `--color-card`, `--color-accent`, `--color-text`) by a `ThemeStyle` component mounted once in the root layout. `tailwind.config.ts` tokens (`darkBg`, `darkCard`, `emeraldAccent`, `neonAccent`, `brand.accent`, `brand.text`) are redefined to read those CSS variables instead of hardcoded hex, so existing Tailwind utility classes become dynamic with no per-component rewrite where a token was already in use. The admin panel gets a new color-picker sub-section that also mutates the CSS variables directly on `input` for instant preview, independent of the save button.

**Tech Stack:** Next.js 14 (App Router), Prisma 5 + SQLite, Tailwind CSS, React (client components for interactive admin/public UI).

## Global Constraints

- Colors configurable: fondo general, fondo de tarjetas/banner/header, acento (botones/precios/links), texto principal. Exactly these 4 — no more, no less (spec: `docs/superpowers/specs/2026-08-03-color-customization-design.md`).
- Fixed, never driven by the configured accent: red (eliminar/error), green de notificaciones de éxito (toast), ámbar y morado (Analíticas), y el verde de marca de WhatsApp en el botón flotante.
- Hex validation regex everywhere colors are accepted: `/^#([0-9A-Fa-f]{3}){1,2}$/`.
- Default values (must match the current hardcoded theme so existing profiles don't visually change until edited): `colorBackground=#0B0F17`, `colorCard=#161E2E`, `colorAccent=#10B981`, `colorText=#F3F4F6`.
- No automated test suite exists in this project and none is introduced by this feature — verification steps are manual (curl, grep, dev server + browser).
- Project uses `prisma db push` (no migrations folder) — schema changes are non-destructive additions with `@default(...)`.

---

### Task 1: Prisma schema — add color fields to BrandProfile

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: `BrandProfile.colorBackground`, `BrandProfile.colorCard`, `BrandProfile.colorAccent`, `BrandProfile.colorText` (all `String`, all with defaults) — consumed by Task 2 (API route), Task 4 (layout/ThemeStyle), Task 7 (admin form).

- [ ] **Step 1: Add the four color fields to the `BrandProfile` model**

In `prisma/schema.prisma`, find the `BrandProfile` model (it currently ends with `updatedAt DateTime @updatedAt`). Add the four fields right before `updatedAt`:

```prisma
model BrandProfile {
  id                   String   @id @default(cuid())
  title                String
  bioEn                String
  bioEs                String
  logoUrl              String
  whatsappNumber       String
  whatsappDefaultMsgEn String
  whatsappDefaultMsgEs String
  bannerTextEn         String
  bannerTextEs         String
  promoCode            String
  showBanner           Boolean  @default(true)
  colorBackground      String   @default("#0B0F17")
  colorCard            String   @default("#161E2E")
  colorAccent          String   @default("#10B981")
  colorText            String   @default("#F3F4F6")
  updatedAt            DateTime @updatedAt
}
```

- [ ] **Step 2: Apply the schema change to the local dev database**

Run:
```bash
npx prisma db push
```
Expected: output ends with `Your database is now in sync with your Prisma schema` and regenerates the Prisma Client.

- [ ] **Step 3: Verify the new fields exist with the correct defaults**

Run:
```bash
node -e "const {PrismaClient}=require('@prisma/client'); const p=new PrismaClient(); p.brandProfile.findFirst().then(r=>{console.log(JSON.stringify(r,null,2)); return p.\$disconnect()})"
```
Expected: the JSON output includes `"colorBackground": "#0B0F17"`, `"colorCard": "#161E2E"`, `"colorAccent": "#10B981"`, `"colorText": "#F3F4F6"` on the existing seeded profile (Prisma backfills defaults for existing rows on `db push`).

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add brand color fields to BrandProfile schema"
```

---

### Task 2: Brand API route — accept, validate, and persist colors

**Files:**
- Modify: `src/app/api/admin/brand/route.ts`

**Interfaces:**
- Consumes: `BrandProfile.colorBackground/colorCard/colorAccent/colorText` (Task 1)
- Produces: `PUT /api/admin/brand` now accepts and persists these 4 fields; returns `400 {"error": "Color inválido"}` if any fails the hex regex — consumed by Task 7 (admin form's save flow).

- [ ] **Step 1: Add hex validation helper and extend the PUT handler**

In `src/app/api/admin/brand/route.ts`, add near the top of the file (after imports):

```ts
const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}){1,2}$/;

function isValidHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_REGEX.test(value);
}
```

Then in the `PUT` handler, destructure the new fields from `body` alongside the existing ones:

```ts
const {
  title,
  bio,
  bioEn,
  bioEs,
  logoUrl,
  whatsappNumber,
  whatsappDefaultMsg,
  whatsappDefaultMsgEn,
  whatsappDefaultMsgEs,
  bannerText,
  bannerTextEn,
  bannerTextEs,
  promoCode,
  showBanner,
  colorBackground,
  colorCard,
  colorAccent,
  colorText,
} = body;
```

Immediately after that destructuring (still inside the `try` block, before `existingProfile` is fetched), validate any color field that was actually sent:

```ts
const colorFields = { colorBackground, colorCard, colorAccent, colorText };
for (const [key, value] of Object.entries(colorFields)) {
  if (value !== undefined && !isValidHexColor(value)) {
    return NextResponse.json(
      { error: 'Color inválido' },
      { status: 400 }
    );
  }
}
```

Add the 4 fields to both the `update` branch and the `create` (existing-profile) branch's `data` object, following the same `!== undefined` fallback pattern already used for every other field:

```ts
colorBackground: colorBackground !== undefined ? colorBackground : existingProfile.colorBackground,
colorCard: colorCard !== undefined ? colorCard : existingProfile.colorCard,
colorAccent: colorAccent !== undefined ? colorAccent : existingProfile.colorAccent,
colorText: colorText !== undefined ? colorText : existingProfile.colorText,
```

And in the `else` branch (no existing profile — creates one with fallbacks), add:

```ts
colorBackground: colorBackground || '#0B0F17',
colorCard: colorCard || '#161E2E',
colorAccent: colorAccent || '#10B981',
colorText: colorText || '#F3F4F6',
```

- [ ] **Step 2: Start the dev server if it isn't already running**

Run (skip if already running on port 3000):
```bash
npm run dev &
sleep 3
```

- [ ] **Step 3: Verify a valid color update persists**

Log in and capture the session cookie, then PUT a color change:
```bash
COOKIE=$(curl -s -i -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@kallpay.us","password":"K4llp4y2026$!"}' | grep -i '^set-cookie' | sed 's/set-cookie: //I' | cut -d';' -f1)
curl -s -X PUT http://localhost:3000/api/admin/brand -H "Content-Type: application/json" -H "Cookie: $COOKIE" -d '{"colorAccent":"#FF0000"}'
```
Expected: `200` response with `"colorAccent":"#FF0000"` in the JSON body, other color fields unchanged.

- [ ] **Step 4: Verify an invalid color is rejected**

Note: shell state (like `$COOKIE`) does not persist between separate command invocations — re-derive it in each step's script:
```bash
COOKIE=$(curl -s -i -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@kallpay.us","password":"K4llp4y2026$!"}' | grep -i '^set-cookie' | sed 's/set-cookie: //I' | cut -d';' -f1)
curl -s -i -X PUT http://localhost:3000/api/admin/brand -H "Content-Type: application/json" -H "Cookie: $COOKIE" -d '{"colorAccent":"notacolor"}'
```
Expected: `HTTP/1.1 400` with body `{"error":"Color inválido"}`.

- [ ] **Step 5: Restore the accent color back to the default for a clean slate**

```bash
COOKIE=$(curl -s -i -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@kallpay.us","password":"K4llp4y2026$!"}' | grep -i '^set-cookie' | sed 's/set-cookie: //I' | cut -d';' -f1)
curl -s -X PUT http://localhost:3000/api/admin/brand -H "Content-Type: application/json" -H "Cookie: $COOKIE" -d '{"colorAccent":"#10B981"}'
```

- [ ] **Step 6: Commit**

```bash
git add src/app/api/admin/brand/route.ts
git commit -m "feat: validate and persist brand color fields in brand API"
```

---

### Task 3: Tailwind config — repoint color tokens to CSS variables

**Files:**
- Modify: `tailwind.config.ts`

**Interfaces:**
- Produces: Tailwind utility classes `bg-darkBg`, `bg-darkCard`, `text-emeraldAccent`/`bg-emeraldAccent`/`border-emeraldAccent`, `text-neonAccent`/etc, `bg-brand-accent`/`text-brand-accent`/`border-brand-accent`/`accent-brand-accent`, `text-brand-text` all resolve to CSS custom properties instead of fixed hex — consumed by Task 4 (which defines those variables), Task 5, and Task 6 (which use these class names).

- [ ] **Step 1: Replace the `colors.extend` block**

In `tailwind.config.ts`, replace:

```ts
      colors: {
        darkBg: "#0B0F17",
        darkCard: "#161E2E",
        emeraldAccent: "#10B981",
        neonAccent: "#34D399",
        brand: {
          bg: "#0B0F17",
          card: "#161E2E",
          emerald: "#10B981",
          neon: "#34D399",
        },
      },
```

with:

```ts
      colors: {
        darkBg: "var(--color-bg)",
        darkCard: "var(--color-card)",
        emeraldAccent: "var(--color-accent)",
        neonAccent: "var(--color-accent)",
        brand: {
          accent: "var(--color-accent)",
          text: "var(--color-text)",
        },
      },
```

(`emeraldAccent` and `neonAccent` both point at the same accent variable — per spec, there's no separate lighter hover shade; `brand.bg`/`brand.card`/`brand.emerald`/`brand.neon` were unused dead tokens and are removed.)

- [ ] **Step 2: Verify the project still type-checks and builds**

```bash
npx tsc --noEmit
```
Expected: no errors (this step alone won't yet render any color since the CSS variables don't exist until Task 4 — that's expected and fine; we're only verifying the config file itself is syntactically valid TypeScript at this point).

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: repoint Tailwind brand color tokens to CSS custom properties"
```

---

### Task 4: ThemeStyle component + root layout wiring

**Files:**
- Create: `src/components/ThemeStyle.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `BrandProfile.colorBackground/colorCard/colorAccent/colorText` (Task 1), Tailwind tokens from Task 3 that expect `--color-bg`/`--color-card`/`--color-accent`/`--color-text` to exist.
- Produces: `ThemeStyle` component with props `{ colorBackground: string; colorCard: string; colorAccent: string; colorText: string }`, mounted once in the root layout — after this task, every page under `/` and `/admin/*` has the 4 CSS variables defined on `:root`.

- [ ] **Step 1: Create the ThemeStyle component**

Create `src/components/ThemeStyle.tsx`:

```tsx
interface ThemeStyleProps {
  colorBackground: string;
  colorCard: string;
  colorAccent: string;
  colorText: string;
}

export function ThemeStyle({
  colorBackground,
  colorCard,
  colorAccent,
  colorText,
}: ThemeStyleProps) {
  const css = `:root{--color-bg:${colorBackground};--color-card:${colorCard};--color-accent:${colorAccent};--color-text:${colorText};}`;
  return <style>{css}</style>;
}

export default ThemeStyle;
```

- [ ] **Step 2: Wire it into the root layout**

In `src/app/layout.tsx`, add imports for `prisma` and `ThemeStyle`:

```ts
import { prisma } from "@/lib/prisma";
import ThemeStyle from "@/components/ThemeStyle";
```

Add a module-level defaults constant (same values as the Prisma schema defaults):

```ts
const DEFAULT_THEME = {
  colorBackground: '#0B0F17',
  colorCard: '#161E2E',
  colorAccent: '#10B981',
  colorText: '#F3F4F6',
};

export const dynamic = 'force-dynamic';
```

Change `RootLayout` to an `async function` that fetches the profile and renders `ThemeStyle` in `<head>`:

```tsx
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await prisma.brandProfile.findFirst();

  return (
    <html lang="en">
      <head>
        <ThemeStyle
          colorBackground={profile?.colorBackground || DEFAULT_THEME.colorBackground}
          colorCard={profile?.colorCard || DEFAULT_THEME.colorCard}
          colorAccent={profile?.colorAccent || DEFAULT_THEME.colorAccent}
          colorText={profile?.colorText || DEFAULT_THEME.colorText}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

(Leave the `geistSans`/`geistMono`/`metadata` declarations above this untouched.)

- [ ] **Step 3: Verify the CSS variables render**

With the dev server running:
```bash
curl -s http://localhost:3000/ | grep -o ':root{[^}]*}'
```
Expected: `:root{--color-bg:#0B0F17;--color-card:#161E2E;--color-accent:#10B981;--color-text:#F3F4F6;}` (or whatever the current DB values are).

```bash
curl -s http://localhost:3000/admin/login | grep -o ':root{[^}]*}'
```
Expected: same output — confirms the shared root layout serves both public and admin routes.

- [ ] **Step 4: Commit**

```bash
git add src/components/ThemeStyle.tsx src/app/layout.tsx
git commit -m "feat: render brand colors as CSS variables from the root layout"
```

---

### Task 5: Public page — remove remaining hardcoded colors

**Files:**
- Modify: `src/components/PublicView.tsx:56`
- Modify: `src/components/Header.tsx:47`
- Modify: `src/components/PromoBanner.tsx:74-75`

**Interfaces:**
- Consumes: Tailwind tokens from Task 3 (`bg-darkBg`, `text-brand-text`, `emeraldAccent`).
- No new interfaces produced — `ProductGrid.tsx` and `LinksList.tsx` need **no changes**: they already use `darkCard`/`emeraldAccent`/`neonAccent` exclusively, which became dynamic in Task 3.

- [ ] **Step 1: Update PublicView's root wrapper**

In `src/components/PublicView.tsx`, line 56, replace:
```tsx
    <main className="min-h-screen bg-[#0B0F17] text-gray-100 selection:bg-emeraldAccent selection:text-darkBg font-sans">
```
with:
```tsx
    <main className="min-h-screen bg-darkBg text-brand-text selection:bg-emeraldAccent selection:text-darkBg font-sans">
```

- [ ] **Step 2: Update Header's title text color**

In `src/components/Header.tsx`, line 47, replace:
```tsx
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
```
with:
```tsx
          <h1 className="text-2xl font-extrabold text-brand-text tracking-tight">
```

- [ ] **Step 3: Fix PromoBanner's "copied" button state to use the dynamic accent token**

In `src/components/PromoBanner.tsx`, lines 72-76, replace:
```tsx
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md ${
                copied
                  ? 'bg-emerald-500 text-darkBg border border-emerald-400'
                  : 'bg-emeraldAccent text-darkBg hover:bg-neonAccent hover:shadow-[0_0_12px_rgba(52,211,153,0.4)] active:scale-95'
              }`}
```
with:
```tsx
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md ${
                copied
                  ? 'bg-emeraldAccent text-darkBg border border-emeraldAccent'
                  : 'bg-emeraldAccent text-darkBg hover:bg-neonAccent hover:shadow-[0_0_12px_rgba(52,211,153,0.4)] active:scale-95'
              }`}
```
(This was the one spot in the public components using Tailwind's built-in `emerald-500`/`emerald-400` palette instead of the project's own token — now both branches use the same dynamic `emeraldAccent` token, consistent with the rest of the file.)

- [ ] **Step 4: Verify visually**

```bash
curl -s http://localhost:3000/ -o /tmp/home.html && grep -c "bg-\[#0B0F17\]" /tmp/home.html
```
Expected: `0` (no more raw hex background left in the rendered public page — Next.js inlines the compiled Tailwind class names, not this exact check on rendered HTML class names is indirect; the authoritative check is the source files no longer containing the hex, confirmed by:)

```bash
grep -rn "bg-\[#0B0F17\]\|text-white" src/components/PublicView.tsx src/components/Header.tsx
```
Expected: no output (no matches) confirming both hardcoded values were replaced.

- [ ] **Step 5: Commit**

```bash
git add src/components/PublicView.tsx src/components/Header.tsx src/components/PromoBanner.tsx
git commit -m "feat: remove remaining hardcoded colors from public bio page"
```

---

### Task 6: Admin panel — restyle to use brand tokens

**Files:**
- Modify: `src/app/admin/login/page.tsx`
- Modify: `src/app/admin/dashboard/page.tsx`

**Interfaces:**
- Consumes: Tailwind tokens from Task 3 (`bg-darkBg`, `bg-darkCard`, `brand-accent`, `brand-text`).
- No new interfaces produced.

**Explicit exclusions (do NOT touch — these are fixed status colors, per the spec):**
- In `admin/dashboard/page.tsx`, the toast notification block (`notification.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300' : ...` and the `<CheckCircle2 className="w-5 h-5 text-emerald-400" />` right after it) — leave every class in that block exactly as-is.
- Amber (`amber-*`) and purple (`purple-*`) classes anywhere (Top Producto / Top Enlace analytics cards, product badges in `ProductGrid.tsx` — not touched in this task) stay unchanged.
- Red (`red-*`) classes (delete buttons, error toast) stay unchanged.
- Section heading `<h2>` elements (e.g. "Catálogo de Productos", "Enlaces Destacados") keep `text-white` — only the top-level page wrapper and the "Kallpay Admin" brand title convert to `text-brand-text`, per the spec's "texto principal" scope (not every white text in the UI).

#### Part A — `src/app/admin/login/page.tsx` (no status-color exceptions in this file)

- [ ] **Step 1: Blanket-replace background hex and native emerald palette with brand tokens**

Run these from the project root — each is a whole-file literal substring replacement (`sed` is used here only because these are pure mechanical token renames across many identical occurrences in one file; if using an editor, apply the same substitutions everywhere they appear):

```bash
sed -i "s/bg-\[#0B0F17\]/bg-darkBg/g" src/app/admin/login/page.tsx
sed -i "s/bg-\[#161E2E\]/bg-darkCard/g" src/app/admin/login/page.tsx
sed -i "s/emerald-500/brand-accent/g" src/app/admin/login/page.tsx
sed -i "s/emerald-400/brand-accent/g" src/app/admin/login/page.tsx
```

- [ ] **Step 2: Convert the page title's text color**

In `src/app/admin/login/page.tsx`, find:
```tsx
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
```
replace with:
```tsx
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-text">
```

- [ ] **Step 3: Verify no old tokens remain**

```bash
grep -n "bg-\[#0B0F17\]\|bg-\[#161E2E\]\|emerald-500\|emerald-400" src/app/admin/login/page.tsx
```
Expected: no output.

#### Part B — `src/app/admin/dashboard/page.tsx` (has status colors to protect — read the exclusions above first)

- [ ] **Step 4: Blanket-replace the background/card hex (safe everywhere in this file — these hex values are never used for anything but backgrounds)**

```bash
sed -i "s/bg-\[#0B0F17\]/bg-darkBg/g" src/app/admin/dashboard/page.tsx
sed -i "s/bg-\[#161E2E\]/bg-darkCard/g" src/app/admin/dashboard/page.tsx
```

- [ ] **Step 5: Blanket-replace the focus ring/border token used only by form inputs (never appears in the toast)**

```bash
sed -i "s/focus:border-emerald-500/focus:border-brand-accent/g" src/app/admin/dashboard/page.tsx
```

- [ ] **Step 6: Blanket-replace the 4 identical tab-button strings**

```bash
sed -i "s/bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500\/20'/bg-brand-accent text-darkBg font-bold shadow-lg shadow-brand-accent\/20'/g" src/app/admin/dashboard/page.tsx
```

- [ ] **Step 7: Blanket-replace the 2 identical "Nuevo Producto"/"Nuevo Enlace" button strings**

```bash
sed -i "s/bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500\/20 transition/bg-brand-accent hover:bg-brand-accent\/90 text-darkBg font-bold text-sm shadow-lg shadow-brand-accent\/20 transition/g" src/app/admin/dashboard/page.tsx
```

- [ ] **Step 8: Blanket-replace the 2 identical empty-state "Crear Producto"/"Crear Enlace" CTA button strings**

```bash
sed -i "s/px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-sm/px-4 py-2 rounded-xl bg-brand-accent text-darkBg font-bold text-sm/g" src/app/admin/dashboard/page.tsx
```

- [ ] **Step 9: Blanket-replace the 2 identical click-count icon strings**

```bash
sed -i 's/<MousePointerClick className="w-3.5 h-3.5 text-emerald-400" \/>/<MousePointerClick className="w-3.5 h-3.5 text-brand-accent" \/>/g' src/app/admin/dashboard/page.tsx
```

- [ ] **Step 10: Blanket-replace the 2 identical active-toggle ternary strings**

```bash
sed -i "s/? 'bg-emerald-500\/10 border-emerald-500\/30 text-emerald-400'/? 'bg-brand-accent\/10 border-brand-accent\/30 text-brand-accent'/g" src/app/admin/dashboard/page.tsx
```

- [ ] **Step 11: Blanket-replace the 2 identical "Guardar" modal button strings**

```bash
sed -i "s/px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 text-sm/px-4 py-2 bg-brand-accent text-darkBg font-bold rounded-xl hover:bg-brand-accent\/90 text-sm/g" src/app/admin/dashboard/page.tsx
```

- [ ] **Step 12: Blanket-replace the 2 identical checkbox accent-color strings**

```bash
sed -i "s/accent-emerald-500/accent-brand-accent/g" src/app/admin/dashboard/page.tsx
```

- [ ] **Step 13: Blanket-replace the 2 identical analytics metric-icon-box strings**

```bash
sed -i 's/<div className="w-10 h-10 rounded-xl bg-emerald-500\/10 text-emerald-400 flex items-center justify-center">/<div className="w-10 h-10 rounded-xl bg-brand-accent\/10 text-brand-accent flex items-center justify-center">/g' src/app/admin/dashboard/page.tsx
```

- [ ] **Step 14: Blanket-replace the 2 identical "Top Producto"/"Top Enlace" value-text strings**

```bash
sed -i 's/<p className="text-xs text-emerald-400 mt-1 font-semibold">/<p className="text-xs text-brand-accent mt-1 font-semibold">/g' src/app/admin/dashboard/page.tsx
```

- [ ] **Step 15: Individual edits — root wrapper (line ~456)**

Find:
```tsx
    <div className="min-h-screen bg-darkBg text-gray-100 font-sans selection:bg-emerald-500 selection:text-black">
```
(the `bg-darkBg` part is already converted from Step 4; only `text-gray-100` and the `selection:` classes remain to fix)

Replace with:
```tsx
    <div className="min-h-screen bg-darkBg text-brand-text font-sans selection:bg-brand-accent selection:text-darkBg">
```

- [ ] **Step 16: Individual edit — header logo badge ("K" box)**

Find:
```tsx
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
```
Replace with:
```tsx
            <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 text-brand-accent flex items-center justify-center font-bold text-lg">
```

- [ ] **Step 17: Individual edit — "Kallpay Admin" header title**

Find:
```tsx
              <h1 className="font-bold text-white text-lg tracking-tight">
                Kallpay <span className="text-emerald-400">Admin</span>
              </h1>
```
Replace with:
```tsx
              <h1 className="font-bold text-brand-text text-lg tracking-tight">
                Kallpay <span className="text-brand-accent">Admin</span>
              </h1>
```

- [ ] **Step 18: Individual edit — product badge (e.g. "Best Seller")**

Find:
```tsx
                          {(product.badgeTextEn || product.badgeTextEs) && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
```
Replace the `<span>` line with:
```tsx
                            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-brand-accent/20 text-brand-accent border border-brand-accent/30">
```

- [ ] **Step 19: Individual edit — product price display**

Find:
```tsx
                        <p className="text-emerald-400 font-extrabold text-sm mt-0.5">
```
Replace with:
```tsx
                        <p className="text-brand-accent font-extrabold text-sm mt-0.5">
```

- [ ] **Step 20: Individual edit — link icon preview box**

Find:
```tsx
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
```
Replace with:
```tsx
                      <div className="w-12 h-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 text-brand-accent flex items-center justify-center shrink-0">
```

- [ ] **Step 21: Individual edit — showBanner toggle switch fill**

Find:
```tsx
                    <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
```
Replace `peer-checked:bg-emerald-500` (at the end) with `peer-checked:bg-brand-accent` — full line becomes:
```tsx
                    <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent" />
```

- [ ] **Step 22: Individual edit — "Guardar Cambios" brand form submit button**

Find:
```tsx
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 disabled:opacity-50"
```
Replace with:
```tsx
                  className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-darkBg font-bold rounded-xl shadow-lg shadow-brand-accent/20 transition flex items-center gap-2 disabled:opacity-50"
```

- [ ] **Step 23: Individual edit — "Desglose por Producto" icon**

Find:
```tsx
                  <Package className="w-5 h-5 text-emerald-400" />
```
(the one inside the "Desglose por Producto" `<h3>`, not the tab-button `Package` icon which has no color class)
Replace with:
```tsx
                  <Package className="w-5 h-5 text-brand-accent" />
```

- [ ] **Step 24: Individual edit — "Desglose por Enlace" icon**

Find:
```tsx
                  <LinkIcon className="w-5 h-5 text-emerald-400" />
```
Replace with:
```tsx
                  <LinkIcon className="w-5 h-5 text-brand-accent" />
```

- [ ] **Step 25: Individual edit — product clicks progress-bar label and fill**

Find:
```tsx
                            <span className="text-emerald-400 font-bold">{prod.clicks} clics</span>
```
Replace with:
```tsx
                            <span className="text-brand-accent font-bold">{prod.clicks} clics</span>
```

Find:
```tsx
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
```
Replace with:
```tsx
                              className="bg-brand-accent h-2 rounded-full transition-all duration-500"
```

- [ ] **Step 26: Individual edit — link clicks progress-bar label and fill**

Find:
```tsx
                            <span className="text-emerald-400 font-bold">{lnk.clicks} clics</span>
```
Replace with:
```tsx
                            <span className="text-brand-accent font-bold">{lnk.clicks} clics</span>
```

Find:
```tsx
                              className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
```
Replace with:
```tsx
                              className="bg-brand-accent h-2 rounded-full transition-all duration-500"
```

- [ ] **Step 27: Individual edit — icon picker selected state (link modal)**

Find:
```tsx
                          linkForm.icon === iconName
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
```
Replace with:
```tsx
                          linkForm.icon === iconName
                            ? 'bg-brand-accent/20 border-brand-accent text-brand-accent font-bold'
```

- [ ] **Step 28: Verify the toast notification block is untouched**

```bash
grep -n "bg-emerald-950\|text-emerald-300" src/app/admin/dashboard/page.tsx
```
Expected: 1 line showing `'bg-emerald-950/90 border-emerald-500 text-emerald-300'` still intact (this confirms the toast's success-state classes were never touched by the blanket replacements above).

```bash
grep -n "text-emerald-400" src/app/admin/dashboard/page.tsx
```
Expected: exactly 1 remaining match — the toast's `<CheckCircle2 className="w-5 h-5 text-emerald-400" />` icon. If any other line still shows `text-emerald-400`, one of Steps 16-27 was missed — go back and apply it.

- [ ] **Step 29: Verify no other stray old tokens remain**

```bash
grep -n "bg-\[#0B0F17\]\|bg-\[#161E2E\]\|emerald-500\b" src/app/admin/dashboard/page.tsx
```
Expected: no output (every `emerald-500` occurrence should have been converted; only `emerald-950`/`emerald-300`/`emerald-400` — the toast — remain, and those don't match `emerald-500`).

- [ ] **Step 30: Run the dev server and type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 31: Visually verify in the browser**

Start (or confirm running) `npm run dev`, open `http://localhost:3000/admin/login` and `http://localhost:3000/admin/dashboard` (after logging in). Confirm: page background and cards are still the same dark theme (values unchanged so far, only the mechanism changed), buttons/tabs/prices/badges still look emerald-green, and the success toast (trigger by saving something) is still green with the error toast still red.

- [ ] **Step 32: Commit**

```bash
git add src/app/admin/login/page.tsx src/app/admin/dashboard/page.tsx
git commit -m "feat: restyle admin panel to use dynamic brand color tokens"
```

---

### Task 7: Admin form — color pickers, live preview, reset button

**Files:**
- Modify: `src/app/admin/dashboard/page.tsx`

**Interfaces:**
- Consumes: `BrandProfile` fields from Task 1/2; CSS variables `--color-bg`/`--color-card`/`--color-accent`/`--color-text` from Task 4.
- Produces: none consumed by later tasks (this is the last feature task).

- [ ] **Step 1: Extend the `BrandProfile` interface**

Find (near the top of the file):
```ts
interface BrandProfile {
  id?: string;
  title: string;
  bioEn: string;
  bioEs: string;
  logoUrl: string;
  whatsappNumber: string;
  whatsappDefaultMsgEn: string;
  whatsappDefaultMsgEs: string;
  bannerTextEn: string;
  bannerTextEs: string;
  promoCode: string;
  showBanner: boolean;
}
```
Replace with:
```ts
interface BrandProfile {
  id?: string;
  title: string;
  bioEn: string;
  bioEs: string;
  logoUrl: string;
  whatsappNumber: string;
  whatsappDefaultMsgEn: string;
  whatsappDefaultMsgEs: string;
  bannerTextEn: string;
  bannerTextEs: string;
  promoCode: string;
  showBanner: boolean;
  colorBackground: string;
  colorCard: string;
  colorAccent: string;
  colorText: string;
}
```

- [ ] **Step 2: Extend the initial `brand` state**

Find:
```ts
  const [brand, setBrand] = useState<BrandProfile>({
    title: '',
    bioEn: '',
    bioEs: '',
    logoUrl: '',
    whatsappNumber: '',
    whatsappDefaultMsgEn: '',
    whatsappDefaultMsgEs: '',
    bannerTextEn: '',
    bannerTextEs: '',
    promoCode: '',
    showBanner: true,
  });
```
Replace with:
```ts
  const [brand, setBrand] = useState<BrandProfile>({
    title: '',
    bioEn: '',
    bioEs: '',
    logoUrl: '',
    whatsappNumber: '',
    whatsappDefaultMsgEn: '',
    whatsappDefaultMsgEs: '',
    bannerTextEn: '',
    bannerTextEs: '',
    promoCode: '',
    showBanner: true,
    colorBackground: '#0B0F17',
    colorCard: '#161E2E',
    colorAccent: '#10B981',
    colorText: '#F3F4F6',
  });
```

- [ ] **Step 3: Add the color-change and reset handlers**

Find the `handleSaveBrand` function and add the following right after its closing brace:

```ts
  // --- COLOR HANDLERS ---
  const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}){1,2}$/;

  const CSS_VAR_BY_FIELD = {
    colorBackground: '--color-bg',
    colorCard: '--color-card',
    colorAccent: '--color-accent',
    colorText: '--color-text',
  } as const;

  type ColorField = keyof typeof CSS_VAR_BY_FIELD;

  const DEFAULT_COLORS: Record<ColorField, string> = {
    colorBackground: '#0B0F17',
    colorCard: '#161E2E',
    colorAccent: '#10B981',
    colorText: '#F3F4F6',
  };

  const handleColorChange = (field: ColorField, value: string) => {
    setBrand((prev) => ({ ...prev, [field]: value }));
    if (HEX_COLOR_REGEX.test(value)) {
      document.documentElement.style.setProperty(CSS_VAR_BY_FIELD[field], value);
    }
  };

  const handleResetColors = () => {
    setBrand((prev) => ({ ...prev, ...DEFAULT_COLORS }));
    (Object.keys(DEFAULT_COLORS) as ColorField[]).forEach((field) => {
      document.documentElement.style.setProperty(CSS_VAR_BY_FIELD[field], DEFAULT_COLORS[field]);
    });
  };
```

- [ ] **Step 4: Insert the color-picker section into the brand form**

Find the closing of the promo-code block and the start of the submit-button block:
```tsx
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Código Promocional
                  </label>
                  <input
                    type="text"
                    value={brand.promoCode}
                    onChange={(e) => setBrand({ ...brand, promoCode: e.target.value })}
                    placeholder="KALLPAY10"
                    className="w-full px-4 py-3 bg-darkBg border border-gray-700 rounded-xl text-white focus:outline-none focus:border-brand-accent transition"
                  />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 flex justify-end">
```

Insert a new section between the closing `</div>` of the promo block and the submit-button `<div>`:

```tsx
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                    Código Promocional
                  </label>
                  <input
                    type="text"
                    value={brand.promoCode}
                    onChange={(e) => setBrand({ ...brand, promoCode: e.target.value })}
                    placeholder="KALLPAY10"
                    className="w-full px-4 py-3 bg-darkBg border border-gray-700 rounded-xl text-white focus:outline-none focus:border-brand-accent transition"
                  />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">Colores de la Página</h4>
                    <p className="text-xs text-gray-400">
                      Personaliza el fondo, las tarjetas, el acento y el texto principal. Se previsualiza al instante.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetColors}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 border border-gray-700 transition"
                  >
                    Restaurar valores por defecto
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(
                    [
                      { field: 'colorBackground' as ColorField, label: 'Fondo General' },
                      { field: 'colorCard' as ColorField, label: 'Tarjetas / Banner' },
                      { field: 'colorAccent' as ColorField, label: 'Acento (Botones, Precios)' },
                      { field: 'colorText' as ColorField, label: 'Texto Principal' },
                    ]
                  ).map(({ field, label }) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                        {label}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={brand[field]}
                          onChange={(e) => handleColorChange(field, e.target.value)}
                          className="w-12 h-11 rounded-lg border border-gray-700 bg-darkBg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={brand[field]}
                          onChange={(e) => handleColorChange(field, e.target.value)}
                          placeholder="#000000"
                          className="w-full px-4 py-3 bg-darkBg border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-brand-accent transition"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 flex justify-end">
```

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Manual verification in the browser**

With `npm run dev` running, log into `http://localhost:3000/admin/login`, go to "Configuración de Marca":
1. Change the "Acento" color picker — confirm the active tab background, "Guardar Cambios" button, and other accent-colored elements on the dashboard repaint instantly (no page reload).
2. Type an incomplete hex into the "Fondo General" text field (e.g. `#12`) — confirm nothing breaks and the preview simply doesn't update until you complete a valid hex.
3. Click "Restaurar valores por defecto" — confirm all 4 pickers/text fields and the live preview revert to the original theme.
4. Click "Guardar Cambios" — confirm the success toast appears (still green) and reload the page — confirm colors persisted.

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/dashboard/page.tsx
git commit -m "feat: add brand color pickers with live preview to admin dashboard"
```

---

### Task 8: End-to-end verification pass

**Files:** none (verification only)

- [ ] **Step 1: Fresh-profile edge case**

```bash
COOKIE=$(curl -s -i -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@kallpay.us","password":"K4llp4y2026$!"}' | grep -i '^set-cookie' | sed 's/set-cookie: //I' | cut -d';' -f1)
node -e "const {PrismaClient}=require('@prisma/client'); const p=new PrismaClient(); p.brandProfile.deleteMany().then(()=>p.\$disconnect())"
curl -s http://localhost:3000/api/admin/brand -H "Cookie: $COOKIE" | head -c 300
```
Expected: a brand profile is auto-created (per the existing `GET` handler behavior) with `colorBackground: "#0B0F17"`, `colorCard: "#161E2E"`, `colorAccent: "#10B981"`, `colorText: "#F3F4F6"` — confirming Prisma's schema defaults kick in even through the `GET` handler's hardcoded `create` call, since Task 2 didn't touch that path's defaults (it uses its own literal object, which does not set color fields — Prisma applies its `@default` for any field omitted from `create`).

- [ ] **Step 2: Re-seed to restore full demo data**

```bash
npx tsx prisma/seed.ts
```

- [ ] **Step 3: Confirm fixed status colors are unaffected by an accent change**

```bash
COOKIE=$(curl -s -i -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@kallpay.us","password":"K4llp4y2026$!"}' | grep -i '^set-cookie' | sed 's/set-cookie: //I' | cut -d';' -f1)
curl -s -X PUT http://localhost:3000/api/admin/brand -H "Content-Type: application/json" -H "Cookie: $COOKIE" -d '{"colorAccent":"#FF00FF"}'
```
Open `http://localhost:3000/admin/dashboard` in the browser, trigger a success toast (e.g. toggle a product's active state) and an error (e.g. try an action that fails, or just visually confirm the delete button is still red) — confirm the toast stays green/red and does not turn magenta, and the WhatsApp floating button on the public page (`http://localhost:3000/`) stays WhatsApp-green.

- [ ] **Step 4: Restore the accent color**

```bash
COOKIE=$(curl -s -i -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@kallpay.us","password":"K4llp4y2026$!"}' | grep -i '^set-cookie' | sed 's/set-cookie: //I' | cut -d';' -f1)
curl -s -X PUT http://localhost:3000/api/admin/brand -H "Content-Type: application/json" -H "Cookie: $COOKIE" -d '{"colorAccent":"#10B981"}'
```

- [ ] **Step 5: Final full-suite sanity check**

```bash
npx tsc --noEmit && npm run build
```
Expected: both succeed with no errors (the production build step also catches any lint/type issues the dev server tolerates).

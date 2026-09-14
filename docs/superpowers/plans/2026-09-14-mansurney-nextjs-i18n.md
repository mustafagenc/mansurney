# Mansur Ney — Next.js Çok Dilli Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** mansurney.com’u; mevcut görsel kimliği koruyan, TR/EN/AR (RTL) destekli, statik üretilen, SEO birikimini 301’lerle taşıyan, KVKK uyumlu sipariş/iletişim formlarına sahip bir Next.js sitesi olarak yeniden kurmak.

**Architecture:** Next.js App Router, tüm sayfalar `[locale]` segmenti altında statik üretilir (SSG). Yönlendirme ve yerelleştirilmiş slug’lar `next-intl` ile; uzun içerik `content/<locale>/*.mdx` dosyalarında, kısa/yapısal veri (akortlar, galeri, ürünler, işletme bilgisi) tipli TS veri dosyalarında. Formlar Server Action + Zod + Cloudflare Turnstile + Resend. Veritabanı ve CMS **yok** (ilk sürüm; bkz. Karar K4).

**Tech Stack:** Next.js 16.3 · React 19.3 · TypeScript (strict) · next-intl 4.14 · Tailwind CSS 4.3 · @next/mdx 16.3 · Zod 4 · Resend 6 · @marsidev/react-turnstile 1.6 · schema-dts 2 · Vitest 5 + Testing Library · Playwright 1.63 + @axe-core/playwright · pnpm (corepack)

**Spec:** [`docs/analiz/mansurney-site-analizi.md`](../../analiz/mansurney-site-analizi.md) (özellikle §8 tasarım, §9 SEO, §12 yasal, §14 öneriler, §15 sorular). İçerik kaynağı: [`docs/icerik/`](../../icerik/README.md).

## Global Constraints

- Node ≥ 20.9 (yerelde 20.19.2 mevcut). Paket yöneticisi: `pnpm` (`corepack enable`).
- Diller: `tr` (varsayılan, öneksiz), `en`, `ar`. `localePrefix: 'as-needed'` → `/`, `/en`, `/ar`.
- `ar` sayfalarında `<html dir="rtl" lang="ar">`. Yön bağımlı CSS yasak: `ml-/mr-/pl-/pr-/left-/right-/text-left/text-right` yerine `ms-/me-/ps-/pe-/start-/end-/text-start/text-end`.
- Renk tokenları analiz §8’deki değerlerle **birebir**: `murekkep #10201b`, `yesil #1b3a31`, `yesil-acik #2c5347`, `altin #bf9b46`, `altin-koyu #9c7d33`, `kagit #f6f1e6`, `kagit-2 #efe7d5`, `kamis #d8c39a`, `kor #a2532b`, `metin #243029`, `metin-soluk #5d6b62`.
- Fontlar: başlık Fraunces, metin Source Sans 3 (latin + latin-ext); AR: Noto Naskh Arabic. Tümü `next/font/google` ile self-host.
- Kod dili: tanımlayıcılar İngilizce; kullanıcıya görünen hiçbir metin koda gömülmez → `messages/<locale>.json` veya `content/`.
- Üç locale’in mesaj anahtarları birebir aynı olmalı (Görev 4’teki test zorunlu).
- Telefon `+905325930436`, e-posta `neyzen@mansurney.com` yalnızca `src/config/business.ts` içinde tanımlanır.
- Tüm görseller `next/image`; `alt` zorunlu (dekoratifse `alt=""` bilinçli).
- Hedefler: Lighthouse mobil Performans ≥ 90, Erişilebilirlik ≥ 95, SEO 100; axe “serious/critical” ihlali 0.
- Her eski URL (analiz §5) yeni karşılığına **kalıcı** yönlendirilir; 404’e düşen eski URL kalmaz.
- Kişisel veri toplayan her form: KVKK aydınlatma linki + zorunlu onay kutusu + Turnstile + honeypot.
- Commit mesajları Conventional Commits; `Co-Authored-By` satırı **eklenmez** (kullanıcı kararı).

---

## Kararlar (varsayılan — müşteri aksi yönde karar verirse ilgili görev güncellenir)

| # | Konu | Karar | Gerekçe | Etkilenen görev |
|---|------|-------|---------|-----------------|
| K1 | Diller | TR + EN + AR | 2019’da da TR/EN/AR vardı; ney pazarı Arap dünyası ve diaspora | 3, 4 |
| K2 | Varsayılan URL | TR öneksiz | Mevcut TR SEO birikimi korunur | 3, 12 |
| K3 | Slug | Her dilde yerelleştirilmiş Latin slug | Okunabilir, paylaşılabilir; AR slug’larda Latin transliterasyon (Arapça harfli URL’ler kopyalanınca %-kodlanıp bozuluyor) | 3 |
| K4 | İçerik yönetimi | Git içinde MDX + TS veri, CMS yok | ~15 sayfa, nadiren güncelleniyor; maliyet/güvenlik. Müşteri kendisi düzenlemek isterse Faz 2: Payload CMS (Next.js içine gömülü, yerleşik localization) | 5 |
| K5 | Haberler | İlk sürümde yok | 20 yıllık 2 duyuru, değer yok; eski URL’ler yönlendirilir | 12 |
| K6 | Sipariş | Ödeme yok, “sipariş talebi” formu | Mevcut iş modeli; fiyat/ödeme müşteri kararı (§15-4) | 10 |
| K7 | E-posta | **Resend** — sipariş ve iletişim formları (müşteri kararı, 14.09.2026); gönderici `form@mansurney.com` | Güvenilir teslim, basit API | 9, 10 |
| K8 | Barındırma | **Vercel** (müşteri kararı, 14.09.2026) + Cloudflare DNS “DNS only” | Next.js için sıfır yapılandırma | 13, 15 |
| K9 | Analitik | İlk sürümde yok; eklenirse çerezsiz (Plausible/Umami) | KVKK çerez bannerı gerektirmez | — |
| K10 | Geriye dönük çalışma | **Yapılmaz** (müşteri kararı, 14.09.2026): Wayback’ten görsel/metin kurtarma, 2003–2019 dönemi URL yönlendirmeleri, eski hosting yedekleme/kapatma adımları kapsam dışı. Yalnızca **bugün yayında olan** sitenin URL’leri 301 ile yeni sayfalara yönlendirilir; içerik mevcut sitedeki metinlerden taşınır. | Müşteri talebi | 5, 6, 7, 12, 15 |

---

## Dosya Yapısı

```
mansurney/
├── docs/                              # analiz, içerik kaynakları, bu plan (mevcut)
├── content/
│   ├── tr/
│   │   ├── guide/{history,making,anatomy,care}.mdx
│   │   ├── workshop.mdx
│   │   ├── case.mdx
│   │   └── legal/{kvkk,privacy}.mdx
│   ├── en/ (aynı dosya adları)
│   └── ar/ (aynı dosya adları)
├── messages/{tr,en,ar}.json            # arayüz metinleri
├── assets-src/                         # ham/kurtarılmış görseller (git LFS önerilir)
├── scripts/
│   ├── recover-images.ts               # canlı siteden görsel indirme
│   └── optimize-images.ts              # sharp ile yeniden boyutlandırma
├── src/
│   ├── assets/images/                  # optimize görseller (statik import → otomatik boyut + blur)
│   ├── proxy.ts                        # next-intl locale yönlendirme (Next 16: middleware → proxy)
│   ├── i18n/
│   │   ├── routing.ts                  # locales, pathnames
│   │   ├── navigation.ts               # Link, redirect, usePathname, getPathname
│   │   └── request.ts                  # getRequestConfig
│   ├── config/
│   │   ├── business.ts                 # NAP, saatler, sosyal, WhatsApp
│   │   └── legacy-redirects.ts         # eski PHP URL → yeni yol tablosu
│   ├── data/
│   │   ├── tunings.ts                  # 8 akort
│   │   ├── gallery.ts                  # galeri öğeleri
│   │   └── couplets.ts                 # beyitler
│   ├── lib/
│   │   ├── content.ts                  # MDX kayıt/yükleme
│   │   ├── seo.ts                      # generateMetadata yardımcıları, hreflang
│   │   ├── jsonld.ts                   # schema.org üreticileri
│   │   ├── forms/schemas.ts            # Zod şemaları
│   │   ├── forms/turnstile.ts          # sunucu doğrulama
│   │   ├── forms/mailer.ts             # Resend soyutlaması
│   │   └── fonts.ts
│   ├── components/
│   │   ├── ui/{Button,ReedDivider,Eyebrow,Container,SectionHeading}.tsx
│   │   ├── layout/{TopBar,Header,MobileNav,LanguageSwitcher,Footer,Breadcrumbs}.tsx
│   │   ├── home/{Hero,CoupletBand,AboutTeaser,GuideGrid,TuningsTeaser,GalleryStrip}.tsx
│   │   ├── gallery/{GalleryGrid,Lightbox}.tsx
│   │   ├── forms/{OrderForm,ContactForm,ConsentCheckbox,FormStatus}.tsx
│   │   └── JsonLd.tsx
│   └── app/
│       ├── globals.css                 # Tailwind v4 @theme tokenları
│       ├── sitemap.ts
│       ├── robots.ts
│       ├── not-found.tsx
│       └── [locale]/
│           ├── layout.tsx
│           ├── not-found.tsx
│           ├── page.tsx                                  # anasayfa
│           ├── ney-rehberi/page.tsx
│           ├── ney-rehberi/[slug]/page.tsx
│           ├── akortlar/page.tsx
│           ├── ney-cantasi/page.tsx
│           ├── atolye/page.tsx
│           ├── galeri/page.tsx
│           ├── siparis/{page.tsx,actions.ts}
│           ├── iletisim/{page.tsx,actions.ts}
│           └── yasal/[slug]/page.tsx
├── tests/
│   ├── unit/…                          # Vitest
│   └── e2e/…                           # Playwright
├── mdx-components.tsx
├── next.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── .env.example
```

> Klasör adları (`ney-rehberi`, `siparis`…) iç rota adlarıdır; dış URL’ler `routing.ts` içindeki `pathnames` ile her dilde ayrı belirlenir.

---

## Faz 0 — Müşteri Girdileri (kod dışı, paralel yürür)

### Görev 0: İçerik ve bilgi toplama

**Files:**
- Modify: `docs/analiz/mansurney-site-analizi.md` §15 (cevapları işle)
- Create: `docs/icerik/musteri-cevaplari.md`

- [ ] **Adım 1:** Analiz §15’teki 13 soruyu müşteriye ilet; cevapları `docs/icerik/musteri-cevaplari.md` dosyasına soru numarasıyla yaz.
- [ ] **Adım 2:** Bloklayıcıları işaretle. Kod görevleri bunlar gelmeden yer tutucu veriyle ilerler; ancak **yayın (Görev 15) şu cevaplar olmadan yapılamaz:** §15-1 adres/saat, §15-2 usta izni, §15-3 ürün gamı, §15-10 metin kaynağı, §15-11 form alıcısı.
- [ ] **Adım 3:** Çeviri paketini hazırla: `docs/icerik/` altındaki düzeltilmiş TR metinler + `messages/tr.json` (Görev 4 sonrası) + terim sözlüğü (aşağıda). Çevirmene gönder.

**Terim sözlüğü (çevirmene verilecek; çevrilmeyecek terimler):**

| TR | EN | AR |
|----|----|----|
| ney | ney | ناي (nay) |
| neyzen | neyzen (ney player) | عازف الناي |
| başpare | başpare (mouthpiece) | باشبارة (başpare) |
| parazvane | parazvane (metal ring) | بارازفانة (parazvane) |
| boğum | node | عقدة |
| akort | tuning (ahenk) | دوزان |
| Bolâhenk, Süpürde, Mansur, Kız, Müstahsen, Şah, Davud, Bolâhenk Nısfiye | aynen (Latin) | aynen transliterasyon + Latin parantez içinde |
| Mesnevî | Masnavi | المثنوي |
| Mevlânâ | Rumi (Mevlana) | مولانا جلال الدين الرومي |

---

## Faz 1 — Temel

### Görev 1: Proje iskeleti ve test altyapısı

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`, `.env.example`, `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Produces: `pnpm test` (Vitest), `pnpm test:e2e` (Playwright, `pnpm build && pnpm start` üzerinde), `pnpm lint`, `pnpm typecheck`.

- [ ] **Adım 1: Repo ve Next.js kurulumu**

`docs/` zaten var; iskeleti geçici klasörde üretip taşı:

```bash
cd /Users/mustafagenc/Repositories/Kova/mansurney
git init -b main
corepack enable
pnpm dlx create-next-app@16.3.5 .scaffold --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --turbopack --no-git
rsync -a .scaffold/ ./ && rm -rf .scaffold
```

- [ ] **Adım 2: Bağımlılıklar**

```bash
pnpm add next-intl@4.14.5 @next/mdx@16.3.5 @mdx-js/loader @mdx-js/react zod@4.6.5 resend@6.28.0 @marsidev/react-turnstile@1.6.1
pnpm add -D @types/mdx schema-dts@2.0.0 vitest@5.0.0 @vitejs/plugin-react @testing-library/react @testing-library/dom jsdom @playwright/test@1.63.0 @axe-core/playwright tsx sharp
pnpm exec playwright install chromium
```

- [ ] **Adım 3: `tsconfig.json` içinde `"strict": true`, `"noUncheckedIndexedAccess": true` olduğundan emin ol.**

- [ ] **Adım 4: `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
  },
});
```

- [ ] **Adım 5: `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:3100' },
  webServer: {
    command: 'pnpm build && pnpm start -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: { FORMS_DRY_RUN: '1' },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
```

- [ ] **Adım 6: `package.json` script’leri**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Adım 7: Smoke testleri yaz**

`tests/unit/smoke.test.ts`:
```ts
import { expect, test } from 'vitest';
test('vitest çalışıyor', () => expect(1 + 1).toBe(2));
```

`tests/e2e/smoke.spec.ts`:
```ts
import { expect, test } from '@playwright/test';
test('anasayfa 200 döner', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
});
```

- [ ] **Adım 8: Çalıştır** — `pnpm test && pnpm typecheck && pnpm test:e2e` → hepsi PASS.

- [ ] **Adım 9: `.env.example`**

```dotenv
NEXT_PUBLIC_SITE_URL=https://mansurney.vercel.app
RESEND_API_KEY=
FORM_TO_EMAIL=neyzen@mansurney.com
FORM_FROM_EMAIL=Mansur Ney <form@mansurney.com>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
# 1 ise e-posta gönderilmez, Turnstile atlanır (yalnızca test)
FORMS_DRY_RUN=
```

- [ ] **Adım 10: Commit**

```bash
git add -A
git commit -m "chore: next.js 16 iskeleti, vitest ve playwright altyapısı"
```

### Görev 2: Tasarım tokenları, fontlar ve temel UI bileşenleri

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/fonts.ts`, `src/components/ui/{Button,ReedDivider,Eyebrow,Container,SectionHeading}.tsx`
- Test: `tests/unit/ui/reed-divider.test.tsx`, `tests/unit/ui/button.test.tsx`

**Interfaces:**
- Produces: Tailwind sınıfları `bg-yesil text-kagit text-altin font-display font-body font-arabic`; `<Button variant="gold"|"green"|"outline" href?>`, `<ReedDivider className?>`, `<Eyebrow>`, `<Container>`, `<SectionHeading eyebrow title description? align="center"|"start">`; `fontVariables: string` (`src/lib/fonts.ts`).

- [ ] **Adım 1: Başarısız testleri yaz**

`tests/unit/ui/reed-divider.test.tsx`:
```tsx
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ReedDivider } from '@/components/ui/ReedDivider';

test('dekoratif olarak ekran okuyuculardan gizlenir', () => {
  const { container } = render(<ReedDivider />);
  expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
});
```

`tests/unit/ui/button.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Button } from '@/components/ui/Button';

test('href verilince link, verilmezse button render eder', () => {
  render(<><Button href="/siparis">Sipariş</Button><Button type="submit">Gönder</Button></>);
  expect(screen.getByRole('link', { name: 'Sipariş' }).getAttribute('href')).toBe('/siparis');
  expect(screen.getByRole('button', { name: 'Gönder' })).toBeTruthy();
});
```

- [ ] **Adım 2:** `pnpm test` → FAIL (modül bulunamadı).

- [ ] **Adım 3: `src/app/globals.css`**

```css
@import 'tailwindcss';

@theme {
  --color-murekkep: #10201b;
  --color-yesil: #1b3a31;
  --color-yesil-acik: #2c5347;
  --color-altin: #bf9b46;
  --color-altin-koyu: #9c7d33;
  --color-kagit: #f6f1e6;
  --color-kagit-2: #efe7d5;
  --color-kamis: #d8c39a;
  --color-kor: #a2532b;
  --color-metin: #243029;
  --color-metin-soluk: #5d6b62;
  --radius-kart: 14px;
  --font-display: var(--font-fraunces), Georgia, serif;
  --font-body: var(--font-source-sans), system-ui, sans-serif;
  --font-arabic: var(--font-noto-naskh), 'Geeza Pro', serif;
  --shadow-kart: 0 18px 48px -24px rgb(16 32 27 / 0.55);
}

@layer base {
  html { scroll-behavior: smooth; }
  body { @apply bg-kagit text-metin font-body antialiased; font-size: 17px; line-height: 1.65; }
  h1, h2, h3, h4 { @apply font-display text-murekkep; font-weight: 600; line-height: 1.15; }
  :lang(ar) body, :lang(ar) h1, :lang(ar) h2, :lang(ar) h3, :lang(ar) h4 { font-family: var(--font-arabic); line-height: 1.8; }
  :focus-visible { outline: 3px solid var(--color-altin); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
}
```

- [ ] **Adım 4: `src/lib/fonts.ts`**

```ts
import { Fraunces, Noto_Naskh_Arabic, Source_Sans_3 } from 'next/font/google';

const fraunces = Fraunces({ subsets: ['latin', 'latin-ext'], weight: ['500', '600'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap' });
const sourceSans = Source_Sans_3({ subsets: ['latin', 'latin-ext'], weight: ['400', '600', '700'], variable: '--font-source-sans', display: 'swap' });
const notoNaskh = Noto_Naskh_Arabic({ subsets: ['arabic'], weight: ['400', '600'], variable: '--font-noto-naskh', display: 'swap' });

export const fontVariables = [fraunces.variable, sourceSans.variable, notoNaskh.variable].join(' ');
```

- [ ] **Adım 5: Bileşenler**

`src/components/ui/ReedDivider.tsx` (mevcut sitedeki `.bogum` imzasının karşılığı; `bg-linear-to-e` RTL’de otomatik döner):
```tsx
export function ReedDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-3.5 text-altin ${className}`}>
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-altin rtl:bg-linear-to-l" />
      <span className="size-[9px] shrink-0 rounded-full border-2 border-altin shadow-[0_0_0_4px_rgb(191_155_70/0.15)]" />
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-altin rtl:bg-linear-to-r" />
    </div>
  );
}
```

`src/components/ui/Button.tsx`:
```tsx
import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

const variants = {
  gold: 'bg-altin text-murekkep hover:bg-altin-koyu hover:text-white',
  green: 'bg-yesil text-kagit hover:bg-yesil-acik hover:text-white',
  outline: 'border-[1.5px] border-current text-kagit hover:bg-altin hover:border-altin hover:text-murekkep',
} as const;

type Common = { variant?: keyof typeof variants; children: ReactNode; className?: string };
type AsLink = Common & { href: ComponentProps<typeof Link>['href'] };
type AsButton = Common & Omit<ComponentProps<'button'>, 'className' | 'children'> & { href?: undefined };

export function Button(props: AsLink | AsButton) {
  const { variant = 'gold', className = '', children } = props;
  const cls = `inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.95rem] font-semibold transition hover:-translate-y-0.5 ${variants[variant]} ${className}`;
  if (props.href !== undefined) return <Link href={props.href} className={cls}>{children}</Link>;
  const { variant: _v, className: _c, children: _ch, href: _h, ...rest } = props;
  return <button className={cls} {...rest}>{children}</button>;
}
```

> `@/i18n/navigation` Görev 3’te oluşur. Bu görevin testinde mock’la: `tests/unit/setup-navigation.ts` içinde
> ```ts
> import { vi } from 'vitest';
> vi.mock('@/i18n/navigation', () => ({ Link: (p: { href: string; children: React.ReactNode; className?: string }) => <a href={p.href} className={p.className}>{p.children}</a> }));
> ```
> dosya uzantısı `.tsx`; `vitest.config.ts` → `test.setupFiles: ['tests/unit/setup-navigation.tsx']`.

`src/components/ui/Eyebrow.tsx`:
```tsx
export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-xs font-bold uppercase tracking-[0.22em] text-altin-koyu rtl:tracking-normal ${className}`}>{children}</p>;
}
```

`src/components/ui/Container.tsx`:
```tsx
export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-[min(1180px,92%)] ${className}`}>{children}</div>;
}
```

`src/components/ui/SectionHeading.tsx`:
```tsx
import { Eyebrow } from './Eyebrow';
import { ReedDivider } from './ReedDivider';

type Props = { eyebrow: string; title: string; description?: string; align?: 'center' | 'start'; as?: 'h1' | 'h2' };

export function SectionHeading({ eyebrow, title, description, align = 'center', as: H = 'h2' }: Props) {
  return (
    <header className={align === 'center' ? 'mx-auto mb-10 max-w-2xl text-center' : 'mb-8'}>
      <ReedDivider className={align === 'center' ? 'mx-auto mb-6 max-w-[220px]' : 'mb-6 max-w-[220px]'} />
      <Eyebrow>{eyebrow}</Eyebrow>
      <H className="mt-2 text-3xl md:text-4xl">{title}</H>
      {description && <p className="mt-3 text-metin-soluk">{description}</p>}
    </header>
  );
}
```

- [ ] **Adım 6:** `pnpm test` → PASS.

- [ ] **Adım 7: Kontrast kontrolü.** `altin-koyu (#9c7d33)` üzerine `kagit (#f6f1e6)` kontrastını ölç (webaim contrast checker). < 4.5:1 ise Eyebrow için yeni token `--color-altin-metin: #7d6428` ekle, Eyebrow’da onu kullan ve bu kararı `globals.css` içinde yorumla belgele.

- [ ] **Adım 8: Commit** — `git commit -am "feat(ui): tasarım tokenları, fontlar ve temel bileşenler"`

---

## Faz 2 — Çok Dil ve İskelet

### Görev 3: next-intl yönlendirme, yerelleştirilmiş slug’lar, RTL

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`, `src/proxy.ts`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx` (geçici), `src/app/not-found.tsx`, `messages/{tr,en,ar}.json` (geçici, tek anahtar)
- Modify: `next.config.ts`
- Delete: `src/app/layout.tsx`, `src/app/page.tsx` (create-next-app’in ürettikleri)
- Test: `tests/unit/i18n/routing.test.ts`, `tests/e2e/i18n.spec.ts`

**Interfaces:**
- Produces: `routing` (`locales: readonly ['tr','en','ar']`, `defaultLocale: 'tr'`), `type Locale = (typeof routing.locales)[number]`, `isRtl(locale: Locale): boolean`, `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` (`@/i18n/navigation`).

- [ ] **Adım 1: Başarısız unit testi**

`tests/unit/i18n/routing.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { isRtl, routing } from '@/i18n/routing';

describe('routing', () => {
  test('her pathname her dil için tanımlı', () => {
    for (const [key, value] of Object.entries(routing.pathnames)) {
      if (typeof value === 'string') continue; // '/' gibi ortak yollar
      expect(Object.keys(value).sort(), key).toEqual([...routing.locales].sort());
    }
  });

  test('bir dil içinde iki rota aynı dış yolu kullanamaz', () => {
    for (const locale of routing.locales) {
      const paths = Object.values(routing.pathnames).map((v) => (typeof v === 'string' ? v : v[locale]));
      expect(new Set(paths).size, locale).toBe(paths.length);
    }
  });

  test('yalnızca ar sağdan sola', () => {
    expect(routing.locales.filter(isRtl)).toEqual(['ar']);
  });
});
```

- [ ] **Adım 2:** `pnpm test` → FAIL.

- [ ] **Adım 3: `src/i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['tr', 'en', 'ar'],
  defaultLocale: 'tr',
  localePrefix: 'as-needed',
  // Accept-Language ile otomatik yönlendirme kapalı: URL = içerik dili (SEO ve paylaşım kararlılığı)
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/ney-rehberi': { tr: '/ney-rehberi', en: '/ney-guide', ar: '/dalil-al-nay' },
    '/ney-rehberi/[slug]': { tr: '/ney-rehberi/[slug]', en: '/ney-guide/[slug]', ar: '/dalil-al-nay/[slug]' },
    '/akortlar': { tr: '/akortlar', en: '/tunings', ar: '/al-dawzan' },
    '/ney-cantasi': { tr: '/ney-cantasi', en: '/ney-case', ar: '/haqibat-al-nay' },
    '/atolye': { tr: '/atolye', en: '/workshop', ar: '/al-warsha' },
    '/galeri': { tr: '/galeri', en: '/gallery', ar: '/maarad' },
    '/siparis': { tr: '/siparis', en: '/order', ar: '/talab' },
    '/iletisim': { tr: '/iletisim', en: '/contact', ar: '/ittisal' },
    '/yasal/[slug]': { tr: '/yasal/[slug]', en: '/legal/[slug]', ar: '/qanuni/[slug]' },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
export const isRtl = (locale: Locale) => locale === 'ar';
```

- [ ] **Adım 4: `src/i18n/navigation.ts`**

```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
```

- [ ] **Adım 5: `src/i18n/request.ts`**

```ts
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return { locale, messages: (await import(`../../messages/${locale}.json`)).default };
});
```

- [ ] **Adım 6: `src/proxy.ts`** (Next 16’da `middleware.ts` → `proxy.ts`)

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

// Nokta içeren yollar (eski *.php URL’leri dahil) proxy’ye girmez; onları next.config redirects karşılar.
export const config = { matcher: '/((?!api|_next|_vercel|.*\\..*).*)' };
```

- [ ] **Adım 7: `next.config.ts`**

```ts
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withMDX = createMDX({});

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: { formats: ['image/avif', 'image/webp'] },
};

export default withNextIntl(withMDX(nextConfig));
```

- [ ] **Adım 8: `src/app/[locale]/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { isRtl, routing } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import '../globals.css';

export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mansurney.vercel.app') };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={isRtl(locale) ? 'rtl' : 'ltr'} className={fontVariables}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Adım 9: Geçici anasayfa ve kök 404**

`messages/tr.json`: `{ "Home": { "title": "Mansur Ney" } }` — `en.json` ve `ar.json` aynı içerik (Görev 4’te gerçek metinlerle değişir).

`src/app/[locale]/page.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

export default function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('Home');
  return <h1>{t('title')}</h1>;
}
```

`src/app/not-found.tsx` (locale dışı 404, ör. `/xx/yy`):
```tsx
export default function RootNotFound() {
  return (
    <html lang="tr">
      <body style={{ fontFamily: 'system-ui', textAlign: 'center', padding: '4rem' }}>
        <h1>404</h1>
        <p><a href="/">mansurney.com</a></p>
      </body>
    </html>
  );
}
```

- [ ] **Adım 10: E2E testi**

`tests/e2e/i18n.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

const cases = [
  { path: '/', lang: 'tr', dir: 'ltr' },
  { path: '/en', lang: 'en', dir: 'ltr' },
  { path: '/ar', lang: 'ar', dir: 'rtl' },
];

for (const c of cases) {
  test(`${c.path} → lang=${c.lang} dir=${c.dir}`, async ({ page }) => {
    await page.goto(c.path);
    await expect(page.locator('html')).toHaveAttribute('lang', c.lang);
    await expect(page.locator('html')).toHaveAttribute('dir', c.dir);
  });
}

test('/tr öneki varsayılan dilde kaldırılır', async ({ page }) => {
  await page.goto('/tr');
  await expect(page).toHaveURL(/\/$/);
});

test('Accept-Language ile yönlendirme yapılmaz', async ({ browser }) => {
  const ctx = await browser.newContext({ locale: 'ar-SA' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await ctx.close();
});
```

- [ ] **Adım 11:** `pnpm test && pnpm typecheck && pnpm test:e2e` → PASS.

- [ ] **Adım 12: Commit** — `git add -A && git commit -m "feat(i18n): tr/en/ar yönlendirme, yerelleştirilmiş yollar, rtl"`

### Görev 4: Arayüz metinleri, işletme bilgisi, Header/Footer/Dil seçici

**Files:**
- Create: `src/config/business.ts`, `src/components/layout/{TopBar,Header,MobileNav,LanguageSwitcher,Footer,Breadcrumbs}.tsx`
- Modify: `messages/{tr,en,ar}.json`, `src/app/[locale]/layout.tsx`
- Test: `tests/unit/i18n/messages.test.ts`, `tests/unit/config/business.test.ts`, `tests/e2e/layout.spec.ts`

**Interfaces:**
- Consumes: `routing`, `Link`, `usePathname`, `useRouter` (Görev 3); `Container`, `Button`, `ReedDivider` (Görev 2).
- Produces: `business: Business` (aşağıdaki tip), `whatsappUrl(text?: string): string`, `telUrl(): string`; `<Breadcrumbs items={{ label: string; href?: AppHref }[]} />` (son öğe href’siz); `messages` isim alanları: `Common`, `Nav`, `Footer`, `NotFound`, `Home`, `Guide`, `Tunings`, `Case`, `Workshop`, `Gallery`, `Order`, `Contact`, `Forms`, `Legal`, `Meta`.

- [ ] **Adım 1: Başarısız testler**

`tests/unit/i18n/messages.test.ts`:
```ts
import { expect, test } from 'vitest';
import ar from '../../../messages/ar.json';
import en from '../../../messages/en.json';
import tr from '../../../messages/tr.json';

function keys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

test('en ve ar, tr ile aynı anahtarlara sahip', () => {
  const base = keys(tr).sort();
  expect(keys(en).sort()).toEqual(base);
  expect(keys(ar).sort()).toEqual(base);
});

test('boş çeviri yok', () => {
  for (const [name, m] of Object.entries({ tr, en, ar })) {
    const empty = keys(m).filter((k) => k.split('.').reduce<any>((o, p) => o[p], m) === '');
    expect(empty, name).toEqual([]);
  }
});
```

`tests/unit/config/business.test.ts`:
```ts
import { expect, test } from 'vitest';
import { business, telUrl, whatsappUrl } from '@/config/business';

test('telefon E.164 formatında', () => expect(business.phone).toMatch(/^\+90\d{10}$/));
test('tel linki', () => expect(telUrl()).toBe('tel:+905325930436'));
test('whatsapp linki metni kodlar', () =>
  expect(whatsappUrl('Kız ney')).toBe('https://wa.me/905325930436?text=K%C4%B1z%20ney'));
test('sosyal linkler ya null ya da gerçek profil URL’si', () => {
  for (const url of Object.values(business.social)) {
    if (url === null) continue;
    expect(new URL(url).pathname.length).toBeGreaterThan(1); // mevcut sitedeki "facebook.com/" hatası tekrarlanmasın
  }
});
```

- [ ] **Adım 2:** `pnpm test` → FAIL.

- [ ] **Adım 3: `src/config/business.ts`**

```ts
export type Business = {
  name: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: { street: string; locality: string; region: string; postalCode: string | null; country: 'TR' };
  geo: { lat: number; lng: number } | null;
  openingHours: { days: ('Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su')[]; opens: string; closes: string }[];
  social: { instagram: string | null; youtube: string | null; facebook: string | null };
  foundingYear: number;
};

// ⚠️ Adres, saatler ve sosyal hesaplar Görev 0 (§15-1, §15-8) cevaplarıyla güncellenecek.
export const business: Business = {
  name: 'Mansur Ney',
  phone: '+905325930436',
  phoneDisplay: '0 532 593 04 36',
  whatsapp: '905325930436',
  email: 'neyzen@mansurney.com',
  address: { street: 'Atatürk Caddesi, Narin Otel yanı', locality: 'Antakya', region: 'Hatay', postalCode: null, country: 'TR' },
  geo: null,
  openingHours: [{ days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], opens: '09:00', closes: '19:30' }],
  social: { instagram: null, youtube: null, facebook: null },
  foundingYear: 2003,
};

export const telUrl = () => `tel:${business.phone}`;
export const whatsappUrl = (text?: string) =>
  `https://wa.me/${business.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
```

- [ ] **Adım 4: Mesaj dosyaları.** `messages/tr.json` (kaynak: `docs/icerik/mevcut-site/10-ortak-alanlar.md`, `00-anasayfa.md`):

```json
{
  "Meta": {
    "siteName": "Mansur Ney",
    "tagline": "Neyzen Atölyesi",
    "defaultDescription": "Hatay’da Asi kamışından el yapımı ney. Tüm akortlarda ney siparişi, ney çantası, ney yapımı ve bakımı rehberi."
  },
  "Common": {
    "readMore": "Devamını oku",
    "backHome": "Anasayfaya dön",
    "home": "Anasayfa",
    "openMenu": "Menüyü aç",
    "closeMenu": "Menüyü kapat",
    "language": "Dil",
    "whatsapp": "WhatsApp ile yazın",
    "call": "Arayın",
    "skipToContent": "İçeriğe geç"
  },
  "Nav": {
    "home": "Anasayfa",
    "guide": "Ney Rehberi",
    "tunings": "Akortlar",
    "case": "Ney Çantası",
    "workshop": "Atölye",
    "gallery": "Galeri",
    "order": "Ney Siparişi",
    "contact": "İletişim"
  },
  "Footer": {
    "couplet": "Bir çemenden yaratıp Hazret-i Mevlâ nây’ı / Halka bildirmek için Hazret-i Mevlânâ’yı",
    "about": "Ney; sulak zeminde yetişen kamıştan üretilen, sazların en kadîmi nefesli çalgıdır. Atölyemizde Asi kıyısının kamışları ustalıkla neye dönüşür.",
    "quickLinks": "Hızlı Bağlantılar",
    "guideLinks": "Ney Rehberi",
    "contactTitle": "İletişim",
    "legal": "Yasal",
    "rights": "© {year} Mansur Ney. Tüm hakları saklıdır."
  },
  "NotFound": {
    "title": "Aradığınız sayfa bulunamadı",
    "text": "Sayfa taşınmış ya da kaldırılmış olabilir. Anasayfadan devam edebilirsiniz."
  }
}
```

`messages/en.json`:
```json
{
  "Meta": {
    "siteName": "Mansur Ney",
    "tagline": "Ney Workshop",
    "defaultDescription": "Handmade Turkish ney flutes from Hatay reed, crafted in every tuning. Order a ney, ney cases, and a guide to ney making and care."
  },
  "Common": {
    "readMore": "Read more",
    "backHome": "Back to home",
    "home": "Home",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "language": "Language",
    "whatsapp": "Message us on WhatsApp",
    "call": "Call us",
    "skipToContent": "Skip to content"
  },
  "Nav": {
    "home": "Home",
    "guide": "Ney Guide",
    "tunings": "Tunings",
    "case": "Ney Case",
    "workshop": "Workshop",
    "gallery": "Gallery",
    "order": "Order a Ney",
    "contact": "Contact"
  },
  "Footer": {
    "couplet": "Having created the ney from a meadow, God / made Rumi known to the world through it",
    "about": "The ney is the oldest of wind instruments, made from reed grown in wetlands. In our workshop, reeds from the banks of the Orontes become neys by hand.",
    "quickLinks": "Quick Links",
    "guideLinks": "Ney Guide",
    "contactTitle": "Contact",
    "legal": "Legal",
    "rights": "© {year} Mansur Ney. All rights reserved."
  },
  "NotFound": {
    "title": "Page not found",
    "text": "The page may have been moved or removed. You can continue from the home page."
  }
}
```

`messages/ar.json`:
```json
{
  "Meta": {
    "siteName": "Mansur Ney",
    "tagline": "ورشة صناعة الناي",
    "defaultDescription": "ناي تركي مصنوع يدويًا من قصب نهر العاصي في هاتاي، بجميع الدوزانات. اطلب نايك، حقائب الناي، ودليل صناعة الناي والعناية به."
  },
  "Common": {
    "readMore": "اقرأ المزيد",
    "backHome": "العودة إلى الصفحة الرئيسية",
    "home": "الرئيسية",
    "openMenu": "فتح القائمة",
    "closeMenu": "إغلاق القائمة",
    "language": "اللغة",
    "whatsapp": "راسلنا عبر واتساب",
    "call": "اتصل بنا",
    "skipToContent": "انتقل إلى المحتوى"
  },
  "Nav": {
    "home": "الرئيسية",
    "guide": "دليل الناي",
    "tunings": "الدوزانات",
    "case": "حقيبة الناي",
    "workshop": "الورشة",
    "gallery": "معرض الصور",
    "order": "اطلب نايًا",
    "contact": "اتصل بنا"
  },
  "Footer": {
    "couplet": "خلق الله الناي من مرج / ليُعرّف الناس بمولانا",
    "about": "الناي أقدم آلات النفخ، يُصنع من القصب النابت في الأراضي الرطبة. في ورشتنا يتحوّل قصب ضفاف العاصي إلى ناي بأيدٍ ماهرة.",
    "quickLinks": "روابط سريعة",
    "guideLinks": "دليل الناي",
    "contactTitle": "اتصل بنا",
    "legal": "قانوني",
    "rights": "© {year} Mansur Ney. جميع الحقوق محفوظة."
  },
  "NotFound": {
    "title": "الصفحة غير موجودة",
    "text": "ربما نُقلت الصفحة أو حُذفت. يمكنك المتابعة من الصفحة الرئيسية."
  }
}
```

> EN/AR metinleri geliştirme için yazılmış ilk sürümdür; Görev 0 Adım 3’teki profesyonel çeviri gelince değiştirilir. Sonraki görevler her yeni isim alanını **üç dosyaya birden** ekler (messages testi bunu zorlar).

- [ ] **Adım 5: `src/components/layout/LanguageSwitcher.tsx`** — aynı sayfanın diğer dildeki karşılığına gider (dinamik parametreler dahil):

```tsx
'use client';

import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const labels: Record<Locale, string> = { tr: 'Türkçe', en: 'English', ar: 'العربية' };

export function LanguageSwitcher() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">{t('language')}</span>
      <select
        className="rounded-full border border-white/20 bg-transparent px-3 py-1"
        value={locale}
        disabled={pending}
        onChange={(e) =>
          startTransition(() =>
            // @ts-expect-error -- params mevcut rotayla eşleşir (next-intl önerilen kalıp)
            router.replace({ pathname, params }, { locale: e.target.value as Locale }),
          )
        }
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} lang={l} className="text-murekkep">{labels[l]}</option>
        ))}
      </select>
    </label>
  );
}
```

> Rehber detay sayfalarında slug dile göre değiştiği için (`tarihce` ↔ `history`) Görev 6’da bu bileşene `slugMap` desteği eklenecek.

- [ ] **Adım 6: `Header` + `MobileNav`** — mevcut sitenin düzeni: koyu yeşil üst bar (e-posta, telefon, WhatsApp, dil, “Ney Siparişi” butonu) + koyu yeşil header (amblem + “Mansur Ney / Neyzen Atölyesi”, menü). Mobilde menü `<dialog>` tabanlı.

`src/components/layout/MobileNav.tsx`:
```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Link } from '@/i18n/navigation';
import type { NavItem } from './Header';

export function MobileNav({ items }: { items: NavItem[] }) {
  const t = useTranslations('Common');
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="lg:hidden text-2xl" aria-label={t('openMenu')} aria-haspopup="dialog" onClick={() => ref.current?.showModal()}>
        ☰
      </button>
      <dialog ref={ref} className="ms-auto h-dvh max-h-none w-80 max-w-[85vw] bg-yesil p-6 text-kagit backdrop:bg-murekkep/60">
        <button type="button" className="mb-6 text-3xl" aria-label={t('closeMenu')} onClick={() => ref.current?.close()}>×</button>
        <nav>
          <ul className="space-y-4 text-lg">
            {items.map((i) => (
              <li key={i.href}><Link href={i.href} onClick={() => ref.current?.close()}>{i.label}</Link></li>
            ))}
          </ul>
        </nav>
      </dialog>
    </>
  );
}
```

`src/components/layout/Header.tsx`:
```tsx
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';
import { MobileNav } from './MobileNav';
import { TopBar } from './TopBar';

export type NavItem = { href: Exclude<AppPathname, `${string}[slug]`>; label: string };

export async function Header() {
  const t = await getTranslations();
  const items: NavItem[] = [
    { href: '/', label: t('Nav.home') },
    { href: '/ney-rehberi', label: t('Nav.guide') },
    { href: '/akortlar', label: t('Nav.tunings') },
    { href: '/ney-cantasi', label: t('Nav.case') },
    { href: '/atolye', label: t('Nav.workshop') },
    { href: '/galeri', label: t('Nav.gallery') },
    { href: '/iletisim', label: t('Nav.contact') },
  ];
  return (
    <>
      <a href="#icerik" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:bg-altin focus:px-4 focus:py-2">{t('Common.skipToContent')}</a>
      <TopBar />
      <header className="sticky top-0 z-40 bg-yesil text-kagit shadow-kart">
        <Container className="flex items-center justify-between gap-6 py-3">
          <Link href="/" className="flex items-center gap-3 text-kagit">
            <Image src="/images/brand/amblem.svg" alt="" width={40} height={40} />
            <span className="leading-tight">
              <b className="block font-display text-xl">{t('Meta.siteName')}</b>
              <small className="text-xs uppercase tracking-[0.2em] text-kamis rtl:tracking-normal">{t('Meta.tagline')}</small>
            </span>
          </Link>
          <nav className="hidden lg:block" aria-label={t('Nav.home')}>
            <ul className="flex items-center gap-6 text-sm font-semibold uppercase tracking-wide rtl:normal-case">
              {items.slice(1).map((i) => (
                <li key={i.href}><Link href={i.href} className="text-kagit hover:text-altin">{i.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <Button href="/siparis" variant="gold" className="hidden sm:inline-flex">{t('Nav.order')}</Button>
            <MobileNav items={[...items, { href: '/siparis', label: t('Nav.order') }]} />
          </div>
        </Container>
      </header>
    </>
  );
}
```

`src/components/layout/TopBar.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { business, telUrl, whatsappUrl } from '@/config/business';
import { LanguageSwitcher } from './LanguageSwitcher';

export async function TopBar() {
  const t = await getTranslations('Common');
  return (
    <div className="bg-murekkep text-sm text-kamis">
      <Container className="flex flex-wrap items-center justify-between gap-2 py-2">
        <ul className="flex flex-wrap gap-4">
          <li><a href={telUrl()} dir="ltr">{business.phoneDisplay}</a></li>
          <li><a href={whatsappUrl()} target="_blank" rel="noopener">{t('whatsapp')}</a></li>
        </ul>
        <LanguageSwitcher />
      </Container>
    </div>
  );
}
```

> E-posta adresi üst barda gösterilmez (spam); footer’da `mailto` olarak kalır. Telefon numaraları AR sayfada da soldan sağa okunmalı → `dir="ltr"`.

- [ ] **Adım 7: `Footer` ve `Breadcrumbs`**

`src/components/layout/Footer.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { ReedDivider } from '@/components/ui/ReedDivider';
import { business, telUrl, whatsappUrl } from '@/config/business';
import { Link } from '@/i18n/navigation';

export async function Footer() {
  const t = await getTranslations();
  const social = Object.entries(business.social).filter((e): e is [string, string] => e[1] !== null);
  return (
    <footer className="bg-murekkep pt-16 text-kamis">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl text-kagit">{t('Meta.siteName')}</p>
            <p className="mt-3 font-display italic text-altin">{t('Footer.couplet')}</p>
            <p className="mt-3 text-sm">{t('Footer.about')}</p>
            {social.length > 0 && (
              <ul className="mt-4 flex gap-3">
                {social.map(([name, url]) => <li key={name}><a href={url} target="_blank" rel="noopener" className="capitalize">{name}</a></li>)}
              </ul>
            )}
          </div>
          <div>
            <h2 className="mb-4 text-base text-kagit">{t('Footer.quickLinks')}</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/siparis">{t('Nav.order')}</Link></li>
              <li><Link href="/akortlar">{t('Nav.tunings')}</Link></li>
              <li><Link href="/atolye">{t('Nav.workshop')}</Link></li>
              <li><Link href="/galeri">{t('Nav.gallery')}</Link></li>
              <li><Link href="/iletisim">{t('Nav.contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-base text-kagit">{t('Footer.guideLinks')}</h2>
            {/* Görev 6: getGuideList(locale) ile rehber yazıları listelenir */}
            <ul className="space-y-2 text-sm"><li><Link href="/ney-rehberi">{t('Nav.guide')}</Link></li></ul>
          </div>
          <address className="not-italic">
            <h2 className="mb-4 text-base text-kagit">{t('Footer.contactTitle')}</h2>
            <p className="text-sm">{business.address.street}, {business.address.locality} / {business.address.region}</p>
            <p className="mt-2 text-sm"><a href={telUrl()} dir="ltr">{business.phoneDisplay}</a></p>
            <p className="mt-2 text-sm"><a href={`mailto:${business.email}`}>{business.email}</a></p>
            <p className="mt-2 text-sm"><a href={whatsappUrl()} target="_blank" rel="noopener">{t('Common.whatsapp')}</a></p>
          </address>
        </div>
        <ReedDivider className="my-10" />
        <div className="flex flex-wrap justify-between gap-4 pb-8 text-xs">
          <span>{t('Footer.rights', { year: new Date().getFullYear() })}</span>
          <span className="flex gap-4">
            <Link href={{ pathname: '/yasal/[slug]', params: { slug: 'kvkk' } }}>KVKK</Link>
          </span>
        </div>
      </Container>
    </footer>
  );
}
```

> Footer’daki KVKK linki Görev 10’da yasal slug eşlemesi eklenince dile göre (`kvkk` / `privacy-notice` / `ishaar-al-khususiya`) güncellenir.

`src/components/layout/Breadcrumbs.tsx`:
```tsx
import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

export type Crumb = { label: string; href?: ComponentProps<typeof Link>['href'] };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-kamis">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="rtl:rotate-180">›</span>}
            {c.href ? <Link href={c.href} className="text-kamis hover:text-altin">{c.label}</Link> : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Adım 8: Layout’a bağla.** `src/app/[locale]/layout.tsx` içinde `<NextIntlClientProvider>` içeriğini `<Header /><main id="icerik">{children}</main><Footer />` yap. `amblem.svg` dosyasını indir: `curl -sL https://mansurney.vercel.app/assets/img/amblem.svg -o public/images/brand/amblem.svg` ve `src/app/icon.svg` olarak da kopyala.

- [ ] **Adım 9: Yerelleştirilmiş 404** — `src/app/[locale]/not-found.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ReedDivider } from '@/components/ui/ReedDivider';

export default function NotFound() {
  const t = useTranslations();
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-8xl text-altin">404</p>
      <ReedDivider className="mx-auto my-6 max-w-[200px]" />
      <h1 className="text-3xl">{t('NotFound.title')}</h1>
      <p className="mx-auto mt-3 max-w-md text-metin-soluk">{t('NotFound.text')}</p>
      <Button href="/" variant="green" className="mt-8">{t('Common.backHome')}</Button>
    </Container>
  );
}
```

- [ ] **Adım 10: E2E**

`tests/e2e/layout.spec.ts`:
```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('mobil menü açılır, kapanır', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/');
  await page.getByRole('button', { name: 'Menüyü aç' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('dil seçici aynı sayfanın İngilizcesine gider', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Dil').selectOption('en');
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('bilinmeyen sayfa yerelleştirilmiş 404 döner', async ({ page }) => {
  const res = await page.goto('/en/olmayan-sayfa');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

for (const path of ['/', '/en', '/ar']) {
  test(`${path} axe ciddi ihlal yok`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
  });
}
```

- [ ] **Adım 11:** `pnpm test && pnpm typecheck && pnpm lint && pnpm test:e2e` → PASS. `pnpm dev` ile `/ar` sayfasında logo, menü ve footer sütunlarının aynalandığını gözle kontrol et.

- [ ] **Adım 12: Commit** — `git add -A && git commit -m "feat(layout): header, footer, dil seçici, işletme bilgisi, çeviri dosyaları"`

---

## Faz 3 — İçerik

### Görev 5: Mevcut görsellerin alınması ve optimizasyonu

**Files:**
- Create: `scripts/image-sources.ts`, `scripts/recover-images.ts`, `scripts/optimize-images.ts`, `assets-src/.gitkeep`, `src/assets/images/**`
- Modify: `package.json` (script’ler), `.gitattributes`
- Test: `tests/unit/assets/images.test.ts`

**Interfaces:**
- Produces: `src/assets/images/{brand,hero,guide,case,workshop,gallery}/*.jpg` — sonraki görevler **statik import** ile kullanır (`import cover from '@/assets/images/guide/history.jpg'`). `pnpm images:recover`, `pnpm images:optimize`.

- [ ] **Adım 1: Başarısız test** — `tests/unit/assets/images.test.ts`:

```ts
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { expect, test } from 'vitest';

const ROOT = 'src/assets/images';
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));

test('optimize görsel klasörü boş değil', () => expect(walk(ROOT).length).toBeGreaterThan(0));

test.each(walk(ROOT).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)))('%s ≤ 450 KB ve ≤ 2400 px', async (file) => {
  expect(statSync(file).size).toBeLessThanOrEqual(450 * 1024);
  const { width = 0 } = await sharp(file).metadata();
  expect(width).toBeLessThanOrEqual(2400);
});
```

- [ ] **Adım 2:** `pnpm test tests/unit/assets` → FAIL (klasör yok).

- [ ] **Adım 3: Kaynak listesi** — `scripts/image-sources.ts` (yalnızca canlı sitedeki, analizde 200 döndüğü doğrulanan görseller — K10):

```ts
export type ImageSource = { url: string; out: string };

const live = 'https://mansurney.vercel.app';

export const imageSources: ImageSource[] = [
  { url: `${live}/assets/img/amblem.svg`, out: 'brand/amblem.svg' },
  { url: `${live}/resimler/banner/28.jpg`, out: 'hero/reeds-28.jpg' },
  { url: `${live}/resimler/banner/27.jpg`, out: 'hero/reeds-27.jpg' },
  { url: `${live}/resimler/banner/26.jpg`, out: 'hero/reeds-26.jpg' },
  { url: `${live}/resimler/banner/23.jpg`, out: 'hero/reeds-23.jpg' },
  { url: `${live}/resimler/site/hakkinda.jpg`, out: 'workshop/about.jpg' },
  { url: `${live}/resimler/icerikler/10.jpg`, out: 'guide/history.jpg' },
  { url: `${live}/resimler/icerikler/11.jpg`, out: 'guide/making.jpg' },
  { url: `${live}/resimler/icerikler/12.jpg`, out: 'guide/anatomy.jpg' },
  { url: `${live}/resimler/icerikler/13.jpg`, out: 'guide/care.jpg' },
  { url: `${live}/resimler/icerikler/14.jpg`, out: 'case/cover.jpg' },
  ...[16, 17, 18, 19].map((n) => ({ url: `${live}/resimler/galeriresim/800/${n}.jpg`, out: `gallery/workshop-${n}.jpg` })),
];
```

- [ ] **Adım 4: `scripts/recover-images.ts`**

```ts
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { imageSources } from './image-sources';

const OUT = 'assets-src';
const missing: string[] = [];

for (const { url, out } of imageSources) {
  const res = await fetch(url, { redirect: 'follow' });
  const type = res.headers.get('content-type') ?? '';
  if (!res.ok || !(type.startsWith('image/'))) {
    missing.push(`${res.status} ${type} ${url}`);
    continue;
  }
  const file = join(OUT, out);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log('✔', out);
  await new Promise((r) => setTimeout(r, 300)); // sunucuya nazik davran
}

if (missing.length) {
  console.warn('\nİndirilemeyenler (yeniden çekim listesine ekle):\n' + missing.join('\n'));
}
```

- [ ] **Adım 5: `scripts/optimize-images.ts`**

```ts
import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import sharp from 'sharp';

const SRC = 'assets-src';
const OUT = 'src/assets/images';

async function* walk(dir: string): AsyncGenerator<string> {
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else yield p;
  }
}

for await (const file of walk(SRC)) {
  const rel = relative(SRC, file);
  const target = join(OUT, rel).replace(/\.(jpe?g|png)$/i, '.jpg');
  await mkdir(dirname(target), { recursive: true });
  if (extname(file) === '.svg') { await copyFile(file, target); continue; }
  const maxWidth = rel.startsWith('hero/') ? 2400 : 1600;
  await sharp(file).rotate().resize({ width: maxWidth, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(target);
  console.log('✔', target);
}
```

- [ ] **Adım 6:** `package.json` → `"images:recover": "tsx scripts/recover-images.ts"`, `"images:optimize": "tsx scripts/optimize-images.ts"`. `.gitattributes` → `assets-src/** filter=lfs diff=lfs merge=lfs -text` (git LFS kurulu değilse bu satırı ekleme, `assets-src/` klasörünü `.gitignore`’a al ve ham görselleri Drive’da sakla — ekiple karar ver).

- [ ] **Adım 7:** `pnpm images:recover && pnpm images:optimize`. Konsoldaki “İndirilemeyenler” listesini `docs/icerik/musteri-cevaplari.md` → “Çekilecek fotoğraflar” başlığına ekle.

- [ ] **Adım 8:** `pnpm test tests/unit/assets` → PASS. Hâlâ 450 KB üstü dosya varsa o dosya için `quality: 70` ile yeniden çalıştır.

- [ ] **Adım 9: Commit** — `git add -A && git commit -m "feat(assets): mevcut site görsellerinin alınması ve optimizasyonu"`

### Görev 6: MDX içerik katmanı, SEO yardımcıları ve Ney Rehberi sayfaları

**Files:**
- Create: `mdx-components.tsx`, `src/components/mdx/Figure.tsx`, `src/lib/content.ts`, `src/lib/seo.ts`, `src/lib/jsonld.ts`, `src/components/JsonLd.tsx`, `content/{tr,en,ar}/guide/{history,making,anatomy,care}.mdx`, `src/app/[locale]/ney-rehberi/page.tsx`, `src/app/[locale]/ney-rehberi/[slug]/page.tsx`, `src/components/guide/{GuideCard,OrderCta}.tsx`
- Modify: `vitest.config.ts` (MDX eklentisi), `messages/{tr,en,ar}.json` (`Guide`), `src/components/layout/LanguageSwitcher.tsx`, `src/components/layout/Footer.tsx`
- Test: `tests/unit/content/guide.test.ts`, `tests/unit/lib/seo.test.ts`, `tests/e2e/guide.spec.ts`

**Interfaces:**
- Consumes: `routing`, `Locale`, `getPathname` (Görev 3); `Breadcrumbs`, `Container`, `SectionHeading`, `Button` (Görev 2, 4); `src/assets/images/guide/*` (Görev 5).
- Produces:
  - `guideKeys: readonly ['history','making','anatomy','care']`, `type GuideKey`
  - `guideSlug(key: GuideKey, locale: Locale): string`
  - `guideKeyFromSlug(locale: Locale, slug: string): GuideKey | null`
  - `loadGuide(locale: Locale, key: GuideKey): Promise<{ Content: MDXContent; meta: GuideMeta; faq: Faq[] }>`
  - `getGuideList(locale: Locale): Promise<{ key: GuideKey; slug: string; meta: GuideMeta }[]>`
  - `type GuideMeta = { title: string; description: string; cover: StaticImageData; coverAlt: string; updated: string }`, `type Faq = { q: string; a: string }`
  - `buildAlternates(locale: Locale, hrefFor: (l: Locale) => Href): Metadata['alternates']`
  - `pageMetadata(args: { locale: Locale; title: string; description: string; hrefFor: (l: Locale) => Href; image?: StaticImageData }): Metadata`
  - `articleLd`, `breadcrumbLd`, `faqLd` (`src/lib/jsonld.ts`), `<JsonLd data />`

- [ ] **Adım 1: Vitest’e MDX desteği**

```bash
pnpm add -D @mdx-js/rollup
```

`vitest.config.ts` → `plugins: [mdx(), react()]` (`import mdx from '@mdx-js/rollup'`), ve statik görsel importları için `test.alias` altına: `{ find: /^.*\.(jpg|png|svg)$/, replacement: fileURLToPath(new URL('./tests/unit/__mocks__/image.ts', import.meta.url)) }`.

`tests/unit/__mocks__/image.ts`:
```ts
export default { src: '/mock.jpg', width: 1200, height: 800, blurDataURL: 'data:image/jpeg;base64,' };
```

- [ ] **Adım 2: Başarısız testler**

`tests/unit/content/guide.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { routing } from '@/i18n/routing';
import { getGuideList, guideKeyFromSlug, guideKeys, guideSlug, loadGuide } from '@/lib/content';

describe('rehber içeriği', () => {
  test.each(routing.locales.flatMap((l) => guideKeys.map((k) => [l, k] as const)))('%s/%s yüklenir ve metadata geçerli', async (locale, key) => {
    const { meta, Content } = await loadGuide(locale, key);
    expect(typeof Content).toBe('function');
    expect(meta.description.length).toBeGreaterThanOrEqual(70);
    expect(meta.description.length).toBeLessThanOrEqual(160);
  });

  test('slug ↔ key dönüşümü tutarlı ve dil içinde benzersiz', () => {
    for (const locale of routing.locales) {
      const slugs = guideKeys.map((k) => guideSlug(k, locale));
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const k of guideKeys) expect(guideKeyFromSlug(locale, guideSlug(k, locale))).toBe(k);
    }
    expect(guideKeyFromSlug('en', 'tarihce')).toBeNull();
  });

  test('liste sabit sırada döner', async () => {
    expect((await getGuideList('tr')).map((g) => g.key)).toEqual(['history', 'making', 'anatomy', 'care']);
  });

  test('bakım rehberinde SSS var', async () => {
    for (const locale of routing.locales) expect((await loadGuide(locale, 'care')).faq.length).toBeGreaterThanOrEqual(2);
  });
});
```

`tests/unit/lib/seo.test.ts`:
```ts
import { expect, test } from 'vitest';
import { buildAlternates } from '@/lib/seo';

test('hreflang: her dil + x-default, canonical mevcut dil', () => {
  const alt = buildAlternates('en', () => '/iletisim');
  expect(alt?.canonical).toBe('/en/contact');
  expect(alt?.languages).toEqual({ tr: '/iletisim', en: '/en/contact', ar: '/ar/ittisal', 'x-default': '/iletisim' });
});
```

- [ ] **Adım 3:** `pnpm test` → FAIL.

- [ ] **Adım 4: `src/lib/content.ts`**

```ts
import type { MDXContent } from 'mdx/types';
import type { StaticImageData } from 'next/image';
import { z } from 'zod';
import { routing, type Locale } from '@/i18n/routing';

export const guideKeys = ['history', 'making', 'anatomy', 'care'] as const;
export type GuideKey = (typeof guideKeys)[number];

const slugs: Record<GuideKey, Record<Locale, string>> = {
  history: { tr: 'tarihce', en: 'history', ar: 'tarikh' },
  making: { tr: 'yapimi', en: 'making', ar: 'sinaa' },
  anatomy: { tr: 'bolumleri', en: 'anatomy', ar: 'ajza' },
  care: { tr: 'bakimi', en: 'care', ar: 'siyana' },
};

export const guideSlug = (key: GuideKey, locale: Locale) => slugs[key][locale];
export const guideKeyFromSlug = (locale: Locale, slug: string): GuideKey | null =>
  guideKeys.find((k) => slugs[k][locale] === slug) ?? null;

const image = z.custom<StaticImageData>((v) => typeof v === 'object' && v !== null && 'src' in v && 'width' in v);

const guideMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(70).max(160),
  cover: image,
  coverAlt: z.string().min(1),
  updated: z.iso.date(),
});
const faqSchema = z.array(z.object({ q: z.string().min(1), a: z.string().min(1) }));

export type GuideMeta = z.infer<typeof guideMetaSchema>;
export type Faq = z.infer<typeof faqSchema>[number];

export async function loadGuide(locale: Locale, key: GuideKey) {
  const mod = (await import(`../../content/${locale}/guide/${key}.mdx`)) as { default: MDXContent; metadata: unknown; faq?: unknown };
  return { Content: mod.default, meta: guideMetaSchema.parse(mod.metadata), faq: faqSchema.parse(mod.faq ?? []) };
}

export async function getGuideList(locale: Locale) {
  return Promise.all(guideKeys.map(async (key) => ({ key, slug: guideSlug(key, locale), meta: (await loadGuide(locale, key)).meta })));
}

export const allGuideParams = () =>
  routing.locales.flatMap((locale) => guideKeys.map((key) => ({ locale, slug: guideSlug(key, locale) })));
```

- [ ] **Adım 5: `src/lib/seo.ts`**

```ts
import type { Metadata } from 'next';
import type { StaticImageData } from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { ComponentProps } from 'react';
import { getPathname, type Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

export type Href = ComponentProps<typeof Link>['href'];

export function buildAlternates(locale: Locale, hrefFor: (l: Locale) => Href): Metadata['alternates'] {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, getPathname({ locale: l, href: hrefFor(l) })])) as Record<Locale, string>;
  return { canonical: languages[locale], languages: { ...languages, 'x-default': languages[routing.defaultLocale] } };
}

export async function pageMetadata(args: { locale: Locale; title: string; description: string; hrefFor: (l: Locale) => Href; image?: StaticImageData }): Promise<Metadata> {
  const t = await getTranslations({ locale: args.locale, namespace: 'Meta' });
  const alternates = buildAlternates(args.locale, args.hrefFor);
  return {
    title: `${args.title} — ${t('siteName')}`,
    description: args.description,
    alternates,
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      locale: { tr: 'tr_TR', en: 'en_US', ar: 'ar_AR' }[args.locale],
      url: alternates?.canonical as string,
      title: args.title,
      description: args.description,
      images: args.image ? [{ url: args.image.src, width: args.image.width, height: args.image.height }] : undefined,
    },
  };
}
```

- [ ] **Adım 6: `src/lib/jsonld.ts` ve `src/components/JsonLd.tsx`**

```ts
import type { Article, BreadcrumbList, FAQPage, WithContext } from 'schema-dts';
import type { Faq } from './content';

const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mansurney.vercel.app';
const abs = (path: string) => new URL(path, site).toString();

export const breadcrumbLd = (items: { name: string; path: string }[]): WithContext<BreadcrumbList> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
});

export const articleLd = (a: { title: string; description: string; path: string; image: string; updated: string; inLanguage: string }): WithContext<Article> => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.title,
  description: a.description,
  image: abs(a.image),
  dateModified: a.updated,
  inLanguage: a.inLanguage,
  mainEntityOfPage: abs(a.path),
  publisher: { '@type': 'Organization', name: 'Mansur Ney', url: site },
});

export const faqLd = (faq: Faq[]): WithContext<FAQPage> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
```

```tsx
// src/components/JsonLd.tsx
import type { Thing, WithContext } from 'schema-dts';

export function JsonLd({ data }: { data: WithContext<Thing> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
```

- [ ] **Adım 7: MDX bileşenleri**

`src/components/mdx/Figure.tsx`:
```tsx
import Image, { type StaticImageData } from 'next/image';

export function Figure({ src, alt, caption }: { src: StaticImageData; alt: string; caption?: string }) {
  return (
    <figure className="my-8">
      <Image src={src} alt={alt} placeholder="blur" sizes="(min-width: 1024px) 720px, 100vw" className="rounded-kart" />
      {caption && <figcaption className="mt-2 text-center text-sm text-metin-soluk">{caption}</figcaption>}
    </figure>
  );
}
```

`mdx-components.tsx` (proje kökü):
```tsx
import type { MDXComponents } from 'mdx/types';
import { Figure } from '@/components/mdx/Figure';

const components: MDXComponents = {
  h2: (p) => <h2 className="mt-12 mb-4 text-2xl md:text-3xl" {...p} />,
  h3: (p) => <h3 className="mt-8 mb-3 text-xl" {...p} />,
  p: (p) => <p className="my-4" {...p} />,
  ul: (p) => <ul className="my-4 list-disc space-y-2 ps-6" {...p} />,
  ol: (p) => <ol className="my-4 list-decimal space-y-2 ps-6" {...p} />,
  blockquote: (p) => <blockquote className="my-8 border-s-4 border-altin ps-6 font-display text-xl italic text-yesil" {...p} />,
  a: (p) => <a className="text-yesil underline decoration-altin underline-offset-4" {...p} />,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
```

- [ ] **Adım 8: İçerik dosyaları (12 adet).** Her dosyanın iskeleti aynıdır. TR örneği — `content/tr/guide/history.mdx`:

```mdx
import cover from '@/assets/images/guide/history.jpg';

export const metadata = {
  title: 'Neyin Tarihçesi',
  description: 'Sümerlerden Mevlevîliğe, Osmanlı sarayından günümüze sazların en kadîmi neyin binlerce yıllık hikâyesi.',
  cover,
  coverAlt: 'Yan yana dizilmiş kamış neyler',
  updated: '2026-09-14',
};

## Kökeni

(docs/icerik/mevcut-site/01-neyin-tarihcesi.md → 1. paragraf, “Editoryal notlar” düzeltmeleri uygulanmış)

## İslam geleneğinde ney

(2. paragraf)

## Mevlânâ ve Mevlevîlik

(3. paragraf)

## Osmanlı sarayında ney

(4. ve 5. paragraflar)

## Dokuz boğum, yedi delik

(6. paragraf)
```

> Parantez içindeki yönergeler **metinle değiştirilir** — kaynak dosyadaki paragraf kelimesi kelimesine taşınır, yalnızca ilgili “Editoryal notlar”daki imla düzeltmeleri uygulanır. İçerik uydurulmaz.

Dosya → kaynak eşlemesi:

| Dosya | Kaynak | Yapı |
|-------|--------|------|
| `history.mdx` | `mevcut-site/01` | Yukarıdaki 5 başlık |
| `making.mdx` | `mevcut-site/02` | Giriş + “Adım adım” numaralı 7 adım (notlardaki liste) |
| `anatomy.mdx` | `mevcut-site/03` | `## Başpare`, `## Parazvane`, `## Boğumlar ve delikler` (tarihçedeki “dokuz boğum, yedi delik” cümlesi) |
| `care.mdx` | `mevcut-site/04` | `## Yağlama` (mevcut paragraf) + `export const faq` (aşağıda). Arşivdeki bakım metni **kullanılmaz** (K10). |

`care.mdx` SSS (TR; yalnızca kaynak metinlerde geçen bilgiler):
```mdx
export const faq = [
  { q: 'Ney ne sıklıkla yağlanmalı?', a: 'Neylerin 15 günde bir yağlanması gerekir.' },
  { q: 'Ney bakımında hangi yağ kullanılır?', a: 'Yağlama için bir yağ haznesi kullanılır; tercihen susam yağı veya badem yağı uygundur.' },
];
```

EN ve AR dosyaları aynı `metadata` alanlarını, aynı başlık yapısını ve aynı `faq` sayısını taşır. Profesyonel çeviri gelene kadar geliştirici EN/AR dosyalarına TR metnin makine çevirisini koyar ve her dosyanın başına `{/* ÇEVİRİ-TASLAK: profesyonel çeviriyle değiştirilecek */}` yorumu ekler. Görev 15’teki yayın kontrolü bu yorumu arar.

- [ ] **Adım 9: `Guide` mesajları** — üç dosyaya:

```json
"Guide": {
  "eyebrow": "Ney Rehberi",
  "title": "Bilgi & Makaleler",
  "description": "Neyin tarihçesinden yapımına, bölümlerinden bakımına dair yazılar.",
  "updated": "Güncelleme: {date}",
  "related": "Diğer yazılar",
  "faqTitle": "Sık sorulan sorular",
  "orderCtaTitle": "Ney Siparişi",
  "orderCtaText": "El yapımı Mansur neyleriniz için atölyemizle iletişime geçin.",
  "orderCtaButton": "Sipariş ver"
}
```
EN: `"Ney Guide"`, `"Articles"`, `"Stories on the history, making, parts and care of the ney."`, `"Updated: {date}"`, `"More articles"`, `"Frequently asked questions"`, `"Order a Ney"`, `"Contact our workshop for your handmade Mansur ney."`, `"Place an order"`.
AR: `"دليل الناي"`, `"مقالات"`, `"مقالات عن تاريخ الناي وصناعته وأجزائه والعناية به."`, `"آخر تحديث: {date}"`, `"مقالات أخرى"`, `"الأسئلة الشائعة"`, `"اطلب نايًا"`, `"تواصل مع ورشتنا لطلب ناي منصور المصنوع يدويًا."`, `"اطلب الآن"`.

- [ ] **Adım 10: Hub sayfası** — `src/app/[locale]/ney-rehberi/page.tsx`:

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideCard } from '@/components/guide/GuideCard';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Locale } from '@/i18n/routing';
import { getGuideList } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/ney-rehberi'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Guide' });
  return pageMetadata({ locale, title: t('eyebrow'), description: t('description'), hrefFor: () => '/ney-rehberi' });
}

export default async function GuideHub({ params }: PageProps<'/[locale]/ney-rehberi'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations('Guide');
  const guides = await getGuideList(locale);
  return (
    <Container className="py-16">
      <SectionHeading as="h1" eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {guides.map((g) => <GuideCard key={g.key} slug={g.slug} meta={g.meta} />)}
      </div>
    </Container>
  );
}
```

`src/components/guide/GuideCard.tsx`:
```tsx
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { GuideMeta } from '@/lib/content';

export async function GuideCard({ slug, meta }: { slug: string; meta: GuideMeta }) {
  const t = await getTranslations('Common');
  const href = { pathname: '/ney-rehberi/[slug]', params: { slug } } as const;
  return (
    <article className="overflow-hidden rounded-kart bg-white shadow-kart">
      <Link href={href}><Image src={meta.cover} alt={meta.coverAlt} placeholder="blur" sizes="(min-width:1024px) 280px, (min-width:640px) 50vw, 100vw" className="aspect-[4/3] object-cover" /></Link>
      <div className="p-5">
        <h2 className="text-xl"><Link href={href} className="text-murekkep hover:text-altin-koyu">{meta.title}</Link></h2>
        <p className="mt-2 text-sm text-metin-soluk">{meta.description}</p>
        <Link href={href} className="mt-3 inline-block text-sm font-semibold">{t('readMore')} <span aria-hidden className="inline-block rtl:rotate-180">→</span></Link>
      </div>
    </article>
  );
}
```

- [ ] **Adım 11: Detay sayfası** — `src/app/[locale]/ney-rehberi/[slug]/page.tsx`:

```tsx
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { OrderCta } from '@/components/guide/OrderCta';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { allGuideParams, getGuideList, guideKeyFromSlug, guideSlug, loadGuide } from '@/lib/content';
import { articleLd, breadcrumbLd, faqLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return allGuideParams().filter((p) => p.locale === params.locale).map(({ slug }) => ({ slug }));
}

async function resolve(params: PageProps<'/[locale]/ney-rehberi/[slug]'>['params']) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const key = guideKeyFromSlug(locale, slug);
  if (!key) notFound();
  return { locale, key, ...(await loadGuide(locale, key)) };
}

export async function generateMetadata({ params }: PageProps<'/[locale]/ney-rehberi/[slug]'>) {
  const { locale, key, meta } = await resolve(params);
  return pageMetadata({
    locale, title: meta.title, description: meta.description, image: meta.cover,
    hrefFor: (l) => ({ pathname: '/ney-rehberi/[slug]', params: { slug: guideSlug(key, l) } }),
  });
}

export default async function GuidePage({ params }: PageProps<'/[locale]/ney-rehberi/[slug]'>) {
  const { locale, key, meta, Content, faq } = await resolve(params);
  setRequestLocale(locale);
  const t = await getTranslations();
  const format = await getFormatter();
  const others = (await getGuideList(locale)).filter((g) => g.key !== key);
  const path = getPathname({ locale, href: { pathname: '/ney-rehberi/[slug]', params: { slug: guideSlug(key, locale) } } });
  const hub = getPathname({ locale, href: '/ney-rehberi' });

  return (
    <>
      <JsonLd data={articleLd({ title: meta.title, description: meta.description, path, image: meta.cover.src, updated: meta.updated, inLanguage: locale })} />
      <JsonLd data={breadcrumbLd([{ name: t('Common.home'), path: getPathname({ locale, href: '/' }) }, { name: t('Guide.eyebrow'), path: hub }, { name: meta.title, path }])} />
      {faq.length > 0 && <JsonLd data={faqLd(faq)} />}

      <section className="bg-yesil py-12 text-kagit">
        <Container>
          <h1 className="text-4xl text-kagit md:text-5xl">{meta.title}</h1>
          <div className="mt-4"><Breadcrumbs items={[{ label: t('Common.home'), href: '/' }, { label: t('Guide.eyebrow'), href: '/ney-rehberi' }, { label: meta.title }]} /></div>
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_320px]">
        <article>
          <Image src={meta.cover} alt={meta.coverAlt} priority placeholder="blur" sizes="(min-width:1024px) 760px, 100vw" className="rounded-kart" />
          <p className="mt-4 text-sm text-metin-soluk">{t('Guide.updated', { date: format.dateTime(new Date(meta.updated), { dateStyle: 'long' }) })}</p>
          <p className="mt-6 text-lg font-semibold text-yesil">{meta.description}</p>
          <div className="max-w-prose"><Content /></div>
          {faq.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-2xl">{t('Guide.faqTitle')}</h2>
              {faq.map((f) => (
                <details key={f.q} className="border-b border-yesil/15 py-4">
                  <summary className="cursor-pointer font-semibold">{f.q}</summary>
                  <p className="mt-2">{f.a}</p>
                </details>
              ))}
            </section>
          )}
        </article>
        <aside className="space-y-6">
          <nav aria-label={t('Guide.related')} className="rounded-kart bg-white p-6 shadow-kart">
            <h2 className="mb-4 text-lg">{t('Guide.related')}</h2>
            <ul className="space-y-3">{others.map((g) => <li key={g.key}><a href={getPathname({ locale, href: { pathname: '/ney-rehberi/[slug]', params: { slug: g.slug } } })}>{g.meta.title}</a></li>)}</ul>
          </nav>
          <OrderCta />
        </aside>
      </Container>
    </>
  );
}
```

`src/components/guide/OrderCta.tsx`:
```tsx
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';

export async function OrderCta() {
  const t = await getTranslations('Guide');
  return (
    <div className="rounded-kart bg-yesil p-6 text-kagit">
      <h2 className="border-b border-altin pb-2 text-lg text-white">{t('orderCtaTitle')}</h2>
      <p className="mt-3 text-sm text-kamis">{t('orderCtaText')}</p>
      <Button href="/siparis" className="mt-4">{t('orderCtaButton')}</Button>
    </div>
  );
}
```

> Kenar çubuğundaki linkler `Link` yerine `getPathname` ile üretildi çünkü sunucu bileşeninde tipli `params` döngüsü gerekmiyor; istenirse `Link` ile değiştirilebilir.

- [ ] **Adım 12: Dil seçiciyi hreflang’a bağla.** Rehber slug’ı dile göre değiştiğinden `router.replace({ pathname, params })` yanlış slug üretir. Her sayfa `pageMetadata` ile `<link rel="alternate" hreflang>` yayınladığı için seçici bunu kullanır. `LanguageSwitcher.tsx` içindeki `onChange`:

```tsx
onChange={(e) => {
  const next = e.target.value as Locale;
  const alt = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${next}"]`);
  if (alt) {
    window.location.assign(alt.href);
    return;
  }
  startTransition(() =>
    // @ts-expect-error -- params mevcut rotayla eşleşir
    router.replace({ pathname, params }, { locale: next }),
  );
}}
```

- [ ] **Adım 13: Footer rehber listesi.** `Footer.tsx` içinde “Görev 6” yorumlu listeyi `const guides = await getGuideList(await getLocale() as Locale)` ile doldur: her öğe `<Link href={{ pathname: '/ney-rehberi/[slug]', params: { slug: g.slug } }}>{g.meta.title}</Link>`.

- [ ] **Adım 14: E2E** — `tests/e2e/guide.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('rehber hub 4 yazıyı listeler', async ({ page }) => {
  await page.goto('/ney-rehberi');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bilgi & Makaleler');
  await expect(page.locator('main article')).toHaveCount(4);
});

test('detay sayfası: h1, hreflang, canonical, Article JSON-LD', async ({ page }) => {
  await page.goto('/ney-rehberi/tarihce');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Neyin Tarihçesi');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en\/ney-guide\/history$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/ney-rehberi\/tarihce$/);
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((s) => JSON.parse(s)['@type'] === 'Article')).toBe(true);
});

test('dil değişince slug da çevrilir', async ({ page }) => {
  await page.goto('/ney-rehberi/bakimi');
  await page.getByLabel('Dil').selectOption('ar');
  await expect(page).toHaveURL(/\/ar\/dalil-al-nay\/siyana$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('başka dilin slug’ı 404', async ({ page }) => {
  expect((await page.goto('/en/ney-guide/tarihce'))?.status()).toBe(404);
});

test('bakım sayfasında FAQPage JSON-LD', async ({ page }) => {
  await page.goto('/en/ney-guide/care');
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((s) => JSON.parse(s)['@type'] === 'FAQPage')).toBe(true);
});
```

- [ ] **Adım 15:** `pnpm test && pnpm typecheck && pnpm test:e2e` → PASS.

- [ ] **Adım 16: Commit** — `git add -A && git commit -m "feat(guide): mdx içerik katmanı, seo yardımcıları ve ney rehberi sayfaları"`

### Görev 7: Akortlar, Ney Çantası ve Atölye sayfaları

**Files:**
- Create: `src/data/tunings.ts`, `src/data/case-models.ts`, `content/{tr,en,ar}/{case,workshop}.mdx`, `src/lib/pages.ts`, `src/app/[locale]/akortlar/page.tsx`, `src/app/[locale]/ney-cantasi/page.tsx`, `src/app/[locale]/atolye/page.tsx`, `src/components/PageHero.tsx`
- Modify: `src/config/business.ts` (usta onayı), `messages/{tr,en,ar}.json` (`Tunings`, `Case`, `Workshop`)
- Test: `tests/unit/data/tunings.test.ts`, `tests/unit/content/pages.test.ts`, `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: `pageMetadata`, `buildAlternates` (Görev 6), `Breadcrumbs`, `Button`, `Container`, `SectionHeading`.
- Produces:
  - `tuningKeys: readonly ['bolahenk','supurde','mansur','kiz','mustahsen','sah','davud','bolahenkNisfiye']`, `type TuningKey`
  - `tunings: Tuning[]` — `type Tuning = { key: TuningKey; name: string; lengthCm: number | null; audio: string | null }`
  - `isTuningKey(v: unknown): v is TuningKey`
  - `caseModels: CaseModel[]` — `type CaseModel = { key: string; capacity: number | 'set'; material: 'aluminium' | 'wood'; dimensionsCm: [number, number, number] | null; image: StaticImageData | null }`
  - `loadPage(locale: Locale, key: 'case' | 'workshop'): Promise<{ Content: MDXContent; meta: PageMeta }>`
  - `<PageHero title breadcrumbs />`
  - `business.master: { name: string; consent: boolean }`

- [ ] **Adım 1: Başarısız testler**

`tests/unit/data/tunings.test.ts`:
```ts
import { expect, test } from 'vitest';
import { isTuningKey, tuningKeys, tunings } from '@/data/tunings';

test('mevcut sipariş formundaki 8 akort, aynı sırayla', () => {
  expect(tunings.map((t) => t.name)).toEqual(['Bolâhenk', 'Süpürde', 'Mansur', 'Kız', 'Müstahsen', 'Şah', 'Davud', 'Bolâhenk Nısfiye']);
  expect(tunings.map((t) => t.key)).toEqual([...tuningKeys]);
});

test('teknik bilgi ya ustadan gelmiş gerçek değer ya da null (uydurma yok)', () => {
  for (const t of tunings) expect(t.lengthCm === null || (t.lengthCm > 20 && t.lengthCm < 130)).toBe(true);
});

test('isTuningKey', () => {
  expect(isTuningKey('kiz')).toBe(true);
  expect(isTuningKey('Kız')).toBe(false);
});
```

`tests/unit/content/pages.test.ts`:
```ts
import { expect, test } from 'vitest';
import { routing } from '@/i18n/routing';
import { loadPage } from '@/lib/pages';

test.each(routing.locales.flatMap((l) => (['case', 'workshop'] as const).map((k) => [l, k] as const)))('%s/%s yüklenir', async (locale, key) => {
  const { meta } = await loadPage(locale, key);
  expect(meta.title.length).toBeGreaterThan(0);
  expect(meta.description.length).toBeGreaterThanOrEqual(70);
});
```

- [ ] **Adım 2:** `pnpm test` → FAIL.

- [ ] **Adım 3: `src/data/tunings.ts`**

```ts
export const tuningKeys = ['bolahenk', 'supurde', 'mansur', 'kiz', 'mustahsen', 'sah', 'davud', 'bolahenkNisfiye'] as const;
export type TuningKey = (typeof tuningKeys)[number];

export type Tuning = { key: TuningKey; name: string; lengthCm: number | null; audio: string | null };

const names: Record<TuningKey, string> = {
  bolahenk: 'Bolâhenk', supurde: 'Süpürde', mansur: 'Mansur', kiz: 'Kız',
  mustahsen: 'Müstahsen', sah: 'Şah', davud: 'Davud', bolahenkNisfiye: 'Bolâhenk Nısfiye',
};

// Boy ve ses kaydı Görev 0’da ustadan gelir; gelene kadar null (sayfa “ustaya danışın” gösterir).
// Sıra mevcut sipariş formundaki sıradır; usta perde yüksekliğine göre sıralanmasını isterse burada değiştirilir.
export const tunings: Tuning[] = tuningKeys.map((key) => ({ key, name: names[key], lengthCm: null, audio: null }));

export const isTuningKey = (v: unknown): v is TuningKey => typeof v === 'string' && (tuningKeys as readonly string[]).includes(v);
```

- [ ] **Adım 4: `src/data/case-models.ts`** (mevcut sitedeki iki model; ahşap kutular Görev 0 §15-3 cevabına göre eklenir/çıkarılır)

```ts
import type { StaticImageData } from 'next/image';

export type CaseModel = {
  key: 'aluminium-3' | 'aluminium-set' | 'wood-2' | 'wood-3' | 'wood-4';
  capacity: number | 'set';
  material: 'aluminium' | 'wood';
  dimensionsCm: [number, number, number] | null;
  image: StaticImageData | null;
};

export const caseModels: CaseModel[] = [
  { key: 'aluminium-3', capacity: 3, material: 'aluminium', dimensionsCm: null, image: null },
  { key: 'aluminium-set', capacity: 'set', material: 'aluminium', dimensionsCm: null, image: null },
];
```

- [ ] **Adım 5: `src/lib/pages.ts`** — Görev 6’daki şemayı yeniden kullanır:

```ts
import type { MDXContent } from 'mdx/types';
import { z } from 'zod';
import type { Locale } from '@/i18n/routing';

const pageMetaSchema = z.object({ title: z.string().min(1), description: z.string().min(70).max(160) });
export type PageMeta = z.infer<typeof pageMetaSchema>;

export async function loadPage(locale: Locale, key: 'case' | 'workshop') {
  const mod = (await import(`../../content/${locale}/${key}.mdx`)) as { default: MDXContent; metadata: unknown };
  return { Content: mod.default, meta: pageMetaSchema.parse(mod.metadata) };
}
```

- [ ] **Adım 6: İçerik**

`content/tr/case.mdx` — kaynak `docs/icerik/mevcut-site/05-ney-cantasi.md` (metin olduğu gibi, virgül/boşluk düzeltmeleriyle):
```mdx
export const metadata = {
  title: 'Ney Çantası',
  description: 'Alüminyumdan imal edilmiş, şık, sağlam ve hafif ney çantaları: 3’lü ve takım ney çantası seçenekleri.',
};

Şık tasarımı, sağlam yapısı ve aynı zamanda hafifliği ile göze çarpan ney çantasını sizlere sunuyoruz. Ney çantası alüminyumdan imal edilmiş olup 3’lü ve takım ney çantası olarak iki çeşittir.
```

`content/tr/workshop.mdx` — yalnızca doğrulanmış bilgiler (analiz §2); usta biyografisi Görev 0 §15-2 cevabıyla eklenir:
```mdx
export const metadata = {
  title: 'Atölye',
  description: 'Mansur Ney, 2003’ten bu yana Antakya’da Asi ırmağı kıyısından kesilen kamışlardan el yapımı ney üreten bir neyzen atölyesidir.',
};

## Asi’nin kamışından

Neyin ana malzemesi olan kamışlar Hatay ilimizin Asi ırmağı kenarından kesilir ve yaklaşık altı ay süren bir kurutma sürecinden sonra atölyede neye dönüşür.

## 2003’ten beri

mansurney.com 2003’ten bu yana yayında; atölyemize aynı telefon ve e-posta adresinden ulaşabilirsiniz.
```

EN/AR dosyaları aynı yapıda, Görev 6 Adım 8’deki `ÇEVİRİ-TASLAK` kuralıyla.

- [ ] **Adım 7: Usta onay bayrağı** — `business.ts` tipine `master: { name: string; consent: boolean }` ekle, değer `{ name: 'Alper Yıldırım', consent: false }`. Atölye sayfası usta adını **yalnızca** `consent === true` iken gösterir.

- [ ] **Adım 8: Mesajlar** — üç dosyaya (EN/AR karşılıkları aynı anahtarlarla):

```json
"Tunings": {
  "eyebrow": "Akortlar",
  "title": "Her ahenkte el yapımı ney",
  "intro": "Neyin akordu (ahengi) boyuna göre belirlenir. Atölyemiz sekiz akortta ney üretir; hangi akordun size uygun olduğundan emin değilseniz bize danışın.",
  "length": "Boy",
  "lengthUnknown": "Ölçü için ustaya danışın",
  "listen": "Sesini dinleyin",
  "orderThis": "{name} ney siparişi"
},
"Case": {
  "eyebrow": "Aksesuar",
  "models": "Modeller",
  "capacity": "{count, plural, =1 {1 ney} other {# ney}}",
  "set": "Takım",
  "aluminium": "Alüminyum",
  "wood": "Ahşap",
  "askPrice": "Fiyat için iletişime geçin"
},
"Workshop": {
  "eyebrow": "Hakkımızda",
  "master": "Ney yapım ustası"
}
```

EN `Tunings.intro`: “A ney’s tuning (ahenk) is determined by its length. Our workshop makes neys in eight tunings; if you are unsure which suits you, ask us.” AR: «يُحدَّد دوزان الناي (الأهنك) بحسب طوله. تصنع ورشتنا الناي بثمانية دوزانات؛ وإن لم تكن متأكدًا أيها يناسبك فاستشرنا.» Diğer anahtarlar aynı mantıkla çevrilir; akort adları çevrilmez (sözlük, Görev 0).

- [ ] **Adım 9: `src/components/PageHero.tsx`** (Görev 6 detay sayfasındaki yeşil başlık bandını ortak bileşene çıkar ve rehber detayını da buna geçir):

```tsx
import { Breadcrumbs, type Crumb } from '@/components/layout/Breadcrumbs';
import { Container } from '@/components/ui/Container';

export function PageHero({ title, breadcrumbs }: { title: string; breadcrumbs: Crumb[] }) {
  return (
    <section className="bg-yesil py-12 text-kagit">
      <Container>
        <h1 className="text-4xl text-kagit md:text-5xl">{title}</h1>
        <div className="mt-4"><Breadcrumbs items={breadcrumbs} /></div>
      </Container>
    </section>
  );
}
```

- [ ] **Adım 10: Akortlar sayfası** — `src/app/[locale]/akortlar/page.tsx`:

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { tunings } from '@/data/tunings';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/akortlar'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Tunings' });
  return pageMetadata({ locale, title: t('eyebrow'), description: t('intro'), hrefFor: () => '/akortlar' });
}

export default async function TuningsPage({ params }: PageProps<'/[locale]/akortlar'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <PageHero title={t('Tunings.title')} breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: t('Tunings.eyebrow') }]} />
      <Container className="py-14">
        <p className="max-w-prose text-lg">{t('Tunings.intro')}</p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tunings.map((tu) => (
            <li key={tu.key} id={tu.key} className="flex flex-col rounded-kart bg-white p-6 shadow-kart">
              <h2 className="text-2xl" lang="tr">{tu.name}</h2>
              <p className="mt-2 text-sm text-metin-soluk">
                {t('Tunings.length')}: {tu.lengthCm ? `${tu.lengthCm} cm` : t('Tunings.lengthUnknown')}
              </p>
              {tu.audio && (
                <audio controls preload="none" className="mt-4 w-full" aria-label={`${t('Tunings.listen')} — ${tu.name}`}>
                  <source src={tu.audio} type="audio/mpeg" />
                </audio>
              )}
              <Button href={{ pathname: '/siparis', query: { akort: tu.key } }} variant="green" className="mt-auto self-start pt-3">
                {t('Tunings.orderThis', { name: tu.name })}
              </Button>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
```

> Akort adlarına `lang="tr"` verilir; AR/EN ekran okuyucular Türkçe telaffuz eder.

- [ ] **Adım 11: Ney Çantası ve Atölye sayfaları** — ikisi de aynı kalıp:

```tsx
// src/app/[locale]/ney-cantasi/page.tsx
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { caseModels } from '@/data/case-models';
import type { Locale } from '@/i18n/routing';
import { loadPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/ney-cantasi'>) {
  const locale = (await params).locale as Locale;
  const { meta } = await loadPage(locale, 'case');
  return pageMetadata({ locale, title: meta.title, description: meta.description, hrefFor: () => '/ney-cantasi' });
}

export default async function CasePage({ params }: PageProps<'/[locale]/ney-cantasi'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { Content, meta } = await loadPage(locale, 'case');
  return (
    <>
      <PageHero title={meta.title} breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: meta.title }]} />
      <Container className="py-14">
        <div className="max-w-prose text-lg"><Content /></div>
        <h2 className="mt-12 text-2xl">{t('Case.models')}</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {caseModels.map((m) => (
            <li key={m.key} className="rounded-kart bg-white p-6 shadow-kart">
              {m.image && <Image src={m.image} alt="" placeholder="blur" sizes="(min-width:640px) 50vw, 100vw" className="mb-4 rounded-kart" />}
              <p className="font-display text-xl">
                {m.capacity === 'set' ? t('Case.set') : t('Case.capacity', { count: m.capacity })} · {t(`Case.${m.material}`)}
              </p>
              {m.dimensionsCm && <p className="mt-1 text-sm text-metin-soluk" dir="ltr">{m.dimensionsCm.join(' × ')} cm</p>}
              <p className="mt-2 text-sm">{t('Case.askPrice')}</p>
            </li>
          ))}
        </ul>
        <Button href="/iletisim" className="mt-10">{t('Nav.contact')}</Button>
      </Container>
    </>
  );
}
```

`src/app/[locale]/atolye/page.tsx`: aynı kalıp; `loadPage(locale, 'workshop')`, hero altında `workshop/about.jpg` (`priority`) ve MDX içerik; `business.master.consent` ise `t('Workshop.master')`: `business.master.name` satırı; sonunda `/galeri` ve `/siparis` butonları. `hrefFor: () => '/atolye'`.

> Ürün sayfası için `Product` JSON-LD **eklenmez**: fiyat (`offers`) olmadan Google zengin sonuç üretmez ve Search Console uyarı verir. Görev 0 §15-4’te fiyat gelirse eklenir.

- [ ] **Adım 12: E2E** — `tests/e2e/pages.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('akortlar: 8 kart, sipariş linki akordu taşır', async ({ page }) => {
  await page.goto('/akortlar');
  await expect(page.locator('main li[id]')).toHaveCount(8);
  await expect(page.getByRole('link', { name: 'Kız ney siparişi' })).toHaveAttribute('href', '/siparis?akort=kiz');
});

test('ingilizce akort sayfası yerelleştirilmiş sipariş yoluna gider', async ({ page }) => {
  await page.goto('/en/tunings');
  await expect(page.locator('main li#sah a')).toHaveAttribute('href', '/en/order?akort=sah');
});

test('ney çantası ve atölye 200, usta adı onaysız görünmez', async ({ page }) => {
  expect((await page.goto('/ney-cantasi'))?.status()).toBe(200);
  expect((await page.goto('/ar/al-warsha'))?.status()).toBe(200);
  await page.goto('/atolye');
  await expect(page.getByText('Alper Yıldırım')).toHaveCount(0);
});
```

- [ ] **Adım 13:** `pnpm test && pnpm typecheck && pnpm test:e2e` → PASS (sipariş sayfası henüz yok; link `href` testi sayfa varlığını gerektirmez).

- [ ] **Adım 14: Commit** — `git add -A && git commit -m "feat(pages): akortlar, ney çantası ve atölye sayfaları"`

### Görev 8: Galeri ve erişilebilir lightbox

**Files:**
- Create: `src/data/gallery.ts`, `src/components/gallery/{GalleryGrid,Lightbox}.tsx`, `src/app/[locale]/galeri/page.tsx`
- Modify: `messages/{tr,en,ar}.json` (`Gallery`)
- Test: `tests/unit/data/gallery.test.ts`, `tests/e2e/gallery.spec.ts`

**Interfaces:**
- Consumes: `src/assets/images/gallery/*`, `workshop/*` (Görev 5); `PageHero`, `pageMetadata`.
- Produces: `galleryCategories: readonly ['workshop','neys','cases']`, `type GalleryItem = { id: string; image: StaticImageData; category: GalleryCategory; alt: Record<Locale, string> }`, `gallery: GalleryItem[]`; `<GalleryGrid items={{ id; src: StaticImageData; alt: string }[]} />` (anasayfa da kullanır — Görev 11).

- [ ] **Adım 1: Başarısız test** — `tests/unit/data/gallery.test.ts`:

```ts
import { expect, test } from 'vitest';
import { gallery, galleryCategories } from '@/data/gallery';
import { routing } from '@/i18n/routing';

test('her görselin her dilde anlamlı alt metni var', () => {
  for (const item of gallery) for (const l of routing.locales) expect(item.alt[l].trim().length, `${item.id}/${l}`).toBeGreaterThan(5);
});
test('id’ler benzersiz, kategoriler geçerli', () => {
  expect(new Set(gallery.map((g) => g.id)).size).toBe(gallery.length);
  for (const g of gallery) expect(galleryCategories).toContain(g.category);
});
```

- [ ] **Adım 2:** `pnpm test` → FAIL.

- [ ] **Adım 3: `src/data/gallery.ts`** — yalnızca Görev 5’te gerçekten oluşan dosyaları import et. Alt metinleri fotoğrafa **bakarak** yaz (ör. `workshop-16.jpg` neyse onu tarif et); aşağıdaki kalıp:

```ts
import type { StaticImageData } from 'next/image';
import type { Locale } from '@/i18n/routing';
import w16 from '@/assets/images/gallery/workshop-16.jpg';
import w17 from '@/assets/images/gallery/workshop-17.jpg';
import w18 from '@/assets/images/gallery/workshop-18.jpg';
import w19 from '@/assets/images/gallery/workshop-19.jpg';

export const galleryCategories = ['workshop', 'neys', 'cases'] as const;
export type GalleryCategory = (typeof galleryCategories)[number];
export type GalleryItem = { id: string; image: StaticImageData; category: GalleryCategory; alt: Record<Locale, string> };

export const gallery: GalleryItem[] = [
  { id: 'workshop-16', image: w16, category: 'workshop', alt: { tr: '…', en: '…', ar: '…' } },
  { id: 'workshop-17', image: w17, category: 'workshop', alt: { tr: '…', en: '…', ar: '…' } },
  { id: 'workshop-18', image: w18, category: 'workshop', alt: { tr: '…', en: '…', ar: '…' } },
  { id: 'workshop-19', image: w19, category: 'workshop', alt: { tr: '…', en: '…', ar: '…' } },
];
```

> `'…'` değerleri Adım 3’ün kendisidir: her birini görseli açıp tarif eden cümleyle değiştir. Test, değiştirilmeyen `'…'` değerini (≤ 5 karakter) yakalar.

- [ ] **Adım 4: `src/components/gallery/Lightbox.tsx`** — native `<dialog>` (odak yakalama, Esc, arka plan inert tarayıcıdan gelir):

```tsx
'use client';

import Image, { type StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

export type LightboxItem = { id: string; src: StaticImageData; alt: string };

export function Lightbox({ items, index, onIndex, onClose }: { items: LightboxItem[]; index: number | null; onIndex: (i: number) => void; onClose: () => void }) {
  const t = useTranslations('Gallery');
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  if (items.length === 0) return null;
  const i = index ?? 0;
  const go = (delta: number) => onIndex((i + delta + items.length) % items.length);
  const item = items[i]!;

  return (
    <dialog
      ref={ref}
      aria-label={t('viewer')}
      onClose={onClose}
      onKeyDown={(e) => {
        const rtl = document.documentElement.dir === 'rtl';
        if (e.key === 'ArrowRight') go(rtl ? -1 : 1);
        if (e.key === 'ArrowLeft') go(rtl ? 1 : -1);
      }}
      className="m-auto max-h-[92dvh] max-w-[92vw] bg-transparent p-0 backdrop:bg-murekkep/90"
    >
      <figure className="relative">
        <Image src={item.src} alt={item.alt} sizes="92vw" className="max-h-[85dvh] w-auto object-contain" />
        <figcaption className="mt-2 text-center text-kamis">{item.alt} · {i + 1}/{items.length}</figcaption>
      </figure>
      <button type="button" onClick={() => go(-1)} aria-label={t('prev')} className="absolute start-2 top-1/2 text-5xl text-kagit">‹</button>
      <button type="button" onClick={() => go(1)} aria-label={t('next')} className="absolute end-2 top-1/2 text-5xl text-kagit">›</button>
      <button type="button" onClick={onClose} aria-label={t('close')} autoFocus className="absolute end-2 top-2 text-4xl text-kagit">×</button>
    </dialog>
  );
}
```

> RTL’de `‹` / `›` karakterleri `start/end` konumlandırmasıyla birlikte doğru tarafa düşer; ok tuşlarının anlamı da yukarıdaki `rtl` kontrolüyle ters çevrilir.

- [ ] **Adım 5: `src/components/gallery/GalleryGrid.tsx`**

```tsx
'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Lightbox, type LightboxItem } from './Lightbox';

export function GalleryGrid({ items }: { items: LightboxItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((it, i) => (
          <li key={it.id}>
            <button type="button" className="block w-full overflow-hidden rounded-kart" onClick={(e) => { opener.current = e.currentTarget; setIndex(i); }}>
              <Image src={it.src} alt={it.alt} placeholder="blur" sizes="(min-width:768px) 25vw, 50vw" className="aspect-square object-cover transition hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={items} index={index} onIndex={setIndex} onClose={() => { setIndex(null); opener.current?.focus(); }} />
    </>
  );
}
```

- [ ] **Adım 6: Sayfa** — `src/app/[locale]/galeri/page.tsx`: `PageHero` + kategori başlıklarıyla (`t(\`Gallery.categories.${c}\`)`) gruplanmış `GalleryGrid`; boş kategori render edilmez. `items = gallery.filter(g => g.category === c).map(g => ({ id: g.id, src: g.image, alt: g.alt[locale] }))`. Metadata `hrefFor: () => '/galeri'`.

Mesajlar (TR; EN/AR karşılıklarıyla):
```json
"Gallery": {
  "eyebrow": "Atölyeden",
  "title": "Foto Galeri",
  "description": "Mansur Ney atölyesinden neyler, kamışlar ve çalışma anları.",
  "viewer": "Görsel görüntüleyici",
  "prev": "Önceki görsel",
  "next": "Sonraki görsel",
  "close": "Kapat",
  "categories": { "workshop": "Atölye", "neys": "Neyler", "cases": "Çantalar" }
}
```

- [ ] **Adım 7: E2E** — `tests/e2e/gallery.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('lightbox klavye ile gezilir ve odak geri döner', async ({ page }) => {
  await page.goto('/galeri');
  const first = page.locator('main ul button').first();
  await first.click();
  const dialog = page.getByRole('dialog', { name: 'Görsel görüntüleyici' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('figcaption')).toContainText('1/');
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('figcaption')).toContainText('2/');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();
});

test('arapçada sağ ok önceki görsele gider', async ({ page }) => {
  await page.goto('/ar/maarad');
  await page.locator('main ul button').nth(1).click();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('dialog').locator('figcaption')).toContainText('1/');
});
```

- [ ] **Adım 8:** `pnpm test && pnpm test:e2e` → PASS.

- [ ] **Adım 9: Commit** — `git add -A && git commit -m "feat(gallery): kategorili galeri ve erişilebilir lightbox"`

---

## Faz 4 — Dönüşüm

### Görev 9: Form altyapısı (şema, Turnstile, e-posta, gönderim çekirdeği)

**Files:**
- Create: `src/lib/forms/{schemas,turnstile,mailer,submit,templates}.ts`
- Test: `tests/unit/forms/schemas.test.ts`, `tests/unit/forms/submit.test.ts`

**Interfaces:**
- Consumes: `tuningKeys`, `tunings` (Görev 7); `business` (Görev 4).
- Produces:
  - `orderSchema`, `contactSchema` (Zod), `type OrderInput`, `type ContactInput`
  - `type FormState = { status: 'idle' | 'success' | 'error'; error?: 'validation' | 'captcha' | 'server'; fields?: string[] }`, `initialFormState: FormState`
  - `verifyTurnstile(token: string | null, ip: string | null): Promise<boolean>`
  - `type Mail = { subject: string; text: string; replyTo?: string }`, `interface Mailer { send(mail: Mail): Promise<void> }`, `getMailer(): Mailer`
  - `handleSubmission<S extends z.ZodType>(args: { formData: FormData; schema: S; verify: (token: string | null) => Promise<boolean>; mailer: Mailer; toMail: (data: z.infer<S>) => Mail }): Promise<FormState>`
  - `orderMail(data: OrderInput, locale: Locale): Mail`, `contactMail(data: ContactInput, locale: Locale): Mail`

- [ ] **Adım 1: Başarısız testler**

`tests/unit/forms/schemas.test.ts`:
```ts
import { describe, expect, test } from 'vitest';
import { contactSchema, orderSchema } from '@/lib/forms/schemas';

const order = { name: 'Ali Veli', phone: '0532 593 04 36', email: '', tuning: 'kiz', quantity: '2', note: '', consent: 'on', website: '' };

describe('orderSchema', () => {
  test('geçerli sipariş', () => expect(orderSchema.safeParse(order).success).toBe(true));
  test('adet sayıya çevrilir', () => expect(orderSchema.parse(order).quantity).toBe(2));
  test('akort boş olabilir (danışacağım)', () => expect(orderSchema.safeParse({ ...order, tuning: '' }).success).toBe(true));
  test('geçersiz akort reddedilir', () => expect(orderSchema.safeParse({ ...order, tuning: 'Kız' }).success).toBe(false));
  test('KVKK onayı zorunlu', () => expect(orderSchema.safeParse({ ...order, consent: undefined }).success).toBe(false));
  test('uluslararası telefon kabul', () => expect(orderSchema.safeParse({ ...order, phone: '+49 151 2345 6789' }).success).toBe(true));
  test('harf içeren telefon red', () => expect(orderSchema.safeParse({ ...order, phone: 'abc' }).success).toBe(false));
  test('adet 1–50', () => expect(orderSchema.safeParse({ ...order, quantity: '0' }).success).toBe(false));
});

describe('contactSchema', () => {
  const contact = { name: 'Ali', email: 'ali@example.com', phone: '', subject: '', message: 'Merhaba, bilgi almak istiyorum.', consent: 'on', website: '' };
  test('geçerli', () => expect(contactSchema.safeParse(contact).success).toBe(true));
  test('e-posta zorunlu', () => expect(contactSchema.safeParse({ ...contact, email: '' }).success).toBe(false));
  test('mesaj en az 10 karakter', () => expect(contactSchema.safeParse({ ...contact, message: 'kısa' }).success).toBe(false));
});
```

`tests/unit/forms/submit.test.ts`:
```ts
import { describe, expect, test, vi } from 'vitest';
import { orderSchema } from '@/lib/forms/schemas';
import { handleSubmission } from '@/lib/forms/submit';

const fd = (o: Record<string, string>) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };
const valid = { name: 'Ali Veli', phone: '05325930436', email: '', tuning: 'kiz', quantity: '1', note: '', consent: 'on', website: '', 'cf-turnstile-response': 'tok' };

function setup(overrides: { verify?: boolean; sendError?: boolean } = {}) {
  const mailer = { send: vi.fn(async () => { if (overrides.sendError) throw new Error('down'); }) };
  const verify = vi.fn(async () => overrides.verify ?? true);
  const run = (data: Record<string, string>) =>
    handleSubmission({ formData: fd(data), schema: orderSchema, verify, mailer, toMail: (d) => ({ subject: d.name, text: 'x' }) });
  return { mailer, verify, run };
}

describe('handleSubmission', () => {
  test('geçerli form → e-posta gönderilir, success', async () => {
    const { run, mailer, verify } = setup();
    expect(await run(valid)).toEqual({ status: 'success' });
    expect(verify).toHaveBeenCalledWith('tok');
    expect(mailer.send).toHaveBeenCalledOnce();
  });

  test('honeypot dolu → sessizce success, e-posta yok, captcha çağrılmaz', async () => {
    const { run, mailer, verify } = setup();
    expect(await run({ ...valid, website: 'http://spam' })).toEqual({ status: 'success' });
    expect(mailer.send).not.toHaveBeenCalled();
    expect(verify).not.toHaveBeenCalled();
  });

  test('doğrulama hatası → hatalı alan adları döner', async () => {
    const { run, mailer } = setup();
    const res = await run({ ...valid, phone: 'abc', consent: '' });
    expect(res.status).toBe('error');
    expect(res.error).toBe('validation');
    expect(res.fields).toEqual(expect.arrayContaining(['phone', 'consent']));
    expect(mailer.send).not.toHaveBeenCalled();
  });

  test('turnstile başarısız → captcha hatası', async () => {
    const { run, mailer } = setup({ verify: false });
    expect(await run(valid)).toEqual({ status: 'error', error: 'captcha' });
    expect(mailer.send).not.toHaveBeenCalled();
  });

  test('e-posta servisi hata verirse server hatası', async () => {
    const { run } = setup({ sendError: true });
    expect(await run(valid)).toEqual({ status: 'error', error: 'server' });
  });
});
```

- [ ] **Adım 2:** `pnpm test tests/unit/forms` → FAIL.

- [ ] **Adım 3: `src/lib/forms/schemas.ts`**

```ts
import { z } from 'zod';
import { tuningKeys } from '@/data/tunings';

const name = z.string().trim().min(2).max(100);
const phone = z.string().trim().regex(/^\+?[\d\s()-]{10,20}$/);
const optional = (s: z.ZodString) => z.union([z.literal(''), s]).default('');
const consent = z.literal('on');
const honeypot = z.string().max(0).default('');

export const orderSchema = z.object({
  name,
  phone,
  email: optional(z.email()),
  tuning: z.union([z.literal(''), z.enum(tuningKeys)]).default(''),
  quantity: z.coerce.number().int().min(1).max(50),
  note: z.string().trim().max(2000).default(''),
  consent,
  website: honeypot,
});

export const contactSchema = z.object({
  name,
  email: z.email(),
  phone: optional(phone),
  subject: z.string().trim().max(150).default(''),
  message: z.string().trim().min(10).max(5000),
  consent,
  website: honeypot,
});

export type OrderInput = z.infer<typeof orderSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export type FormState = { status: 'idle' | 'success' | 'error'; error?: 'validation' | 'captcha' | 'server'; fields?: string[] };
export const initialFormState: FormState = { status: 'idle' };
```

- [ ] **Adım 4: `src/lib/forms/submit.ts`**

```ts
import type { z } from 'zod';
import type { Mail, Mailer } from './mailer';
import type { FormState } from './schemas';

export async function handleSubmission<S extends z.ZodType>(args: {
  formData: FormData;
  schema: S;
  verify: (token: string | null) => Promise<boolean>;
  mailer: Mailer;
  toMail: (data: z.infer<S>) => Mail;
}): Promise<FormState> {
  const raw = Object.fromEntries(args.formData.entries());

  // Bot honeypot’u doldurduysa başarılı görün ama hiçbir şey yapma.
  if (typeof raw.website === 'string' && raw.website !== '') return { status: 'success' };

  const parsed = args.schema.safeParse(raw);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))];
    return { status: 'error', error: 'validation', fields };
  }

  const token = typeof raw['cf-turnstile-response'] === 'string' ? raw['cf-turnstile-response'] : null;
  if (!(await args.verify(token))) return { status: 'error', error: 'captcha' };

  try {
    await args.mailer.send(args.toMail(parsed.data));
  } catch (err) {
    console.error('[forms] e-posta gönderilemedi', err);
    return { status: 'error', error: 'server' };
  }
  return { status: 'success' };
}
```

- [ ] **Adım 5: `src/lib/forms/turnstile.ts`**

```ts
import 'server-only';

export async function verifyTurnstile(token: string | null, ip: string | null): Promise<boolean> {
  if (process.env.FORMS_DRY_RUN === '1') return true;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error('TURNSTILE_SECRET_KEY tanımlı değil');
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  if (!res.ok) return false;
  return ((await res.json()) as { success: boolean }).success;
}
```

- [ ] **Adım 6: `src/lib/forms/mailer.ts`**

```ts
import 'server-only';
import { Resend } from 'resend';

export type Mail = { subject: string; text: string; replyTo?: string };
export interface Mailer { send(mail: Mail): Promise<void> }

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} tanımlı değil`);
  return v;
}

const resendMailer = (): Mailer => {
  const resend = new Resend(required('RESEND_API_KEY'));
  return {
    async send(mail) {
      const { error } = await resend.emails.send({
        from: required('FORM_FROM_EMAIL'),
        to: [required('FORM_TO_EMAIL')],
        subject: mail.subject,
        text: mail.text,
        replyTo: mail.replyTo,
      });
      if (error) throw new Error(error.message);
    },
  };
};

const dryRunMailer: Mailer = { async send(mail) { console.info('[forms:dry-run]', mail.subject); } };

export const getMailer = (): Mailer => (process.env.FORMS_DRY_RUN === '1' ? dryRunMailer : resendMailer());
```

`pnpm add server-only`.

- [ ] **Adım 7: `src/lib/forms/templates.ts`** — atölyeye giden e-posta her zaman Türkçedir; ziyaretçinin dili belirtilir:

```ts
import { tunings } from '@/data/tunings';
import type { Locale } from '@/i18n/routing';
import type { Mail } from './mailer';
import type { ContactInput, OrderInput } from './schemas';

const langName: Record<Locale, string> = { tr: 'Türkçe', en: 'İngilizce', ar: 'Arapça' };
const lines = (rows: [string, string][]) => rows.filter(([, v]) => v !== '').map(([k, v]) => `${k}: ${v}`).join('\n');

export function orderMail(d: OrderInput, locale: Locale): Mail {
  const tuning = tunings.find((t) => t.key === d.tuning)?.name ?? 'Belirtilmedi (danışacak)';
  return {
    subject: `Ney sipariş talebi — ${d.name} (${tuning}, ${d.quantity} adet)`,
    replyTo: d.email || undefined,
    text: lines([
      ['Ad Soyad', d.name], ['Telefon', d.phone], ['E-posta', d.email], ['Akort', tuning],
      ['Adet', String(d.quantity)], ['Not', d.note], ['Site dili', langName[locale]], ['KVKK onayı', 'Verildi'],
    ]),
  };
}

export function contactMail(d: ContactInput, locale: Locale): Mail {
  return {
    subject: `İletişim formu — ${d.subject || d.name}`,
    replyTo: d.email,
    text: lines([
      ['Ad Soyad', d.name], ['E-posta', d.email], ['Telefon', d.phone], ['Konu', d.subject],
      ['Site dili', langName[locale]], ['KVKK onayı', 'Verildi'], ['', ''], ['Mesaj', `\n${d.message}`],
    ]),
  };
}
```

Şablon için ek unit test (`tests/unit/forms/templates.test.ts`): `orderMail({ …, tuning: '' }, 'ar')` → `subject` “Belirtilmedi (danışacak)” içerir, `text` “Site dili: Arapça” içerir, `email: ''` iken `replyTo` `undefined`.

- [ ] **Adım 8:** `pnpm test tests/unit/forms` → PASS.

> Hız sınırlama (rate limit) bilinçli olarak eklenmedi: sunucusuz ortamda bellek içi sayaç işe yaramaz, Turnstile + honeypot bu trafik hacmi için yeterli. Spam görülürse Vercel Firewall kuralı veya Upstash Ratelimit eklenir.

- [ ] **Adım 9: Commit** — `git add -A && git commit -m "feat(forms): zod şemaları, turnstile, resend ve gönderim çekirdeği"`

### Görev 10: Sipariş, İletişim ve yasal sayfalar

**Files:**
- Create: `src/components/forms/{OrderForm,ContactForm,Field,ConsentCheckbox,FormStatus,TurnstileField}.tsx`, `src/app/[locale]/siparis/{page.tsx,actions.ts}`, `src/app/[locale]/iletisim/{page.tsx,actions.ts}`, `src/lib/legal.ts`, `content/{tr,en,ar}/legal/{kvkk,privacy}.mdx`, `src/app/[locale]/yasal/[slug]/page.tsx`
- Modify: `messages/{tr,en,ar}.json` (`Order`, `Contact`, `Forms`, `Legal`), `src/components/layout/Footer.tsx` (yasal linkler)
- Test: `tests/unit/legal.test.ts`, `tests/e2e/forms.spec.ts`

**Interfaces:**
- Consumes: `handleSubmission`, `orderSchema`, `contactSchema`, `initialFormState`, `FormState`, `verifyTurnstile`, `getMailer`, `orderMail`, `contactMail` (Görev 9); `tunings`, `isTuningKey` (Görev 7); `business`, `whatsappUrl`, `telUrl` (Görev 4); `PageHero`, `pageMetadata`.
- Produces: `submitOrder(prev: FormState, fd: FormData): Promise<FormState>`, `submitContact(...)`; `legalKeys: readonly ['kvkk','privacy']`, `legalSlug(key, locale)`, `legalKeyFromSlug(locale, slug)`, `loadLegal(locale, key)`; `<ConsentCheckbox />` (KVKK linkli, zorunlu).

- [ ] **Adım 1: Başarısız testler**

`tests/unit/legal.test.ts`:
```ts
import { expect, test } from 'vitest';
import { routing } from '@/i18n/routing';
import { legalKeyFromSlug, legalKeys, legalSlug, loadLegal } from '@/lib/legal';

test('slug eşlemesi tutarlı', () => {
  for (const l of routing.locales) for (const k of legalKeys) expect(legalKeyFromSlug(l, legalSlug(k, l))).toBe(k);
});
test.each(routing.locales.flatMap((l) => legalKeys.map((k) => [l, k] as const)))('%s/%s yüklenir, güncelleme tarihi var', async (l, k) => {
  expect((await loadLegal(l, k)).meta.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});
```

`tests/e2e/forms.spec.ts` (Playwright `FORMS_DRY_RUN=1` ile çalışır — Görev 1):
```ts
import { expect, test } from '@playwright/test';

test('akort sorgu parametresiyle ön seçilir', async ({ page }) => {
  await page.goto('/siparis?akort=sah');
  await expect(page.getByLabel('Akort')).toHaveValue('sah');
});

test('geçersiz akort parametresi yok sayılır', async ({ page }) => {
  await page.goto('/siparis?akort=<script>');
  await expect(page.getByLabel('Akort')).toHaveValue('');
});

test('sipariş formu gönderilir', async ({ page }) => {
  await page.goto('/siparis');
  await page.getByLabel('Adınız Soyadınız').fill('Test Kullanıcı');
  await page.getByLabel('Telefon').fill('0532 000 00 00');
  await page.getByLabel('Akort').selectOption('kiz');
  await page.getByRole('checkbox', { name: /Aydınlatma Metni/ }).check();
  await page.getByRole('button', { name: 'Sipariş talebi gönder' }).click();
  await expect(page.getByRole('status')).toContainText('Talebiniz bize ulaştı');
});

test('sunucu doğrulama hatası erişilebilir biçimde gösterilir', async ({ page }) => {
  await page.goto('/siparis');
  await page.getByLabel('Adınız Soyadınız').fill('Test');
  await page.getByLabel('Telefon').fill('12'); // HTML doğrulamasını geçer (pattern yok), sunucu reddeder
  await page.getByRole('checkbox', { name: /Aydınlatma Metni/ }).check();
  await page.getByRole('button', { name: 'Sipariş talebi gönder' }).click();
  await expect(page.getByLabel('Telefon')).toHaveAttribute('aria-invalid', 'true');
});

test('ingilizce iletişim formu', async ({ page }) => {
  await page.goto('/en/contact');
  await page.getByLabel('Full name').fill('John Doe');
  await page.getByLabel('Email').fill('john@example.com');
  await page.getByLabel('Message').fill('I would like to order a Kız ney.');
  await page.getByRole('checkbox', { name: /Privacy Notice/ }).check();
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('status')).toContainText('received');
});

test('KVKK linki doğru dildeki yasal sayfaya gider', async ({ page }) => {
  await page.goto('/ar/talab');
  await expect(page.locator('form a[href*="qanuni"]')).toHaveAttribute('href', '/ar/qanuni/ishaar-al-khususiya');
});
```

- [ ] **Adım 2:** `pnpm test tests/unit/legal.test.ts` → FAIL.

- [ ] **Adım 3: `src/lib/legal.ts`**

```ts
import type { MDXContent } from 'mdx/types';
import { z } from 'zod';
import type { Locale } from '@/i18n/routing';

export const legalKeys = ['kvkk', 'privacy'] as const;
export type LegalKey = (typeof legalKeys)[number];

const slugs: Record<LegalKey, Record<Locale, string>> = {
  kvkk: { tr: 'kvkk-aydinlatma-metni', en: 'privacy-notice', ar: 'ishaar-al-khususiya' },
  privacy: { tr: 'gizlilik-politikasi', en: 'privacy-policy', ar: 'siyasat-al-khususiya' },
};

export const legalSlug = (key: LegalKey, locale: Locale) => slugs[key][locale];
export const legalKeyFromSlug = (locale: Locale, slug: string): LegalKey | null => legalKeys.find((k) => slugs[k][locale] === slug) ?? null;

const metaSchema = z.object({ title: z.string().min(1), updated: z.iso.date() });

export async function loadLegal(locale: Locale, key: LegalKey) {
  const mod = (await import(`../../content/${locale}/legal/${key}.mdx`)) as { default: MDXContent; metadata: unknown };
  return { Content: mod.default, meta: metaSchema.parse(mod.metadata) };
}
```

> Görev 4’teki test e2e testinde `/yasal/kvkk` yazıyorsa bu slug’larla güncelle; Footer’a iki yasal link ekle (`legalSlug(k, locale)` ile).

- [ ] **Adım 4: Yasal içerik.** `content/tr/legal/kvkk.mdx` metni **hukuk danışmanından** gelir; geliştirici aşağıdaki başlık iskeletini ve bilinen olguları yazar, dosyanın başına `{/* HUKUK-ONAYI-BEKLİYOR */}` koyar (Görev 15 yayın kontrolü bunu arar). KVKK md. 10 zorunlu başlıkları:

```mdx
{/* HUKUK-ONAYI-BEKLİYOR */}
export const metadata = { title: 'KVKK Aydınlatma Metni', updated: '2026-09-14' };

## Veri sorumlusu
Mansur Ney — {adres ve unvan Görev 0 §15-1 cevabından}

## İşlenen kişisel veriler
Sipariş formu: ad soyad, telefon, e-posta (isteğe bağlı), akort ve adet tercihi, not.
İletişim formu: ad soyad, e-posta, telefon (isteğe bağlı), konu, mesaj.
Güvenlik: IP adresi ve tarayıcı bilgisi (bot koruması için Cloudflare Turnstile tarafından).

## İşleme amaçları
Sipariş ve bilgi taleplerine dönüş yapılması; formların kötüye kullanımının önlenmesi.

## Hukuki sebep ve toplama yöntemi
Web sitesi formları aracılığıyla elektronik ortamda; bir sözleşmenin kurulması için gerekli olması (md. 5/2-c) ve açık rıza.

## Aktarım
Form içeriği e-posta hizmet sağlayıcısı Resend (ABD), bot doğrulaması Cloudflare (ABD), barındırma Vercel (ABD) üzerinden işlenir — yurt dışına aktarım dayanağı (md. 9) hukuk danışmanınca belirlenecek.

## Saklama süresi
{hukuk danışmanı}

## İlgili kişinin hakları (md. 11)
{md. 11 hakları listesi ve başvuru yöntemi: neyzen@mansurney.com}
```

> Süslü parantezli satırlar MDX’te ifade olarak yorumlanır ve **derlemeyi kırar** — bilinçli: hukuk metni gelmeden `pnpm build` başarılı olmaz ve yanlışlıkla yayına çıkılmaz. Geliştirme sırasında bu satırları `{/* … */}` yorumuna çevir; Görev 15 kontrolü `HUKUK-ONAYI-BEKLİYOR` işaretini arar.

`privacy.mdx`: çerez kullanılmadığı (K9), sunucu günlükleri ve yukarıdaki hizmet sağlayıcıları; aynı işaretle. EN/AR sürümleri hukuk onaylı TR metnin çevirisidir.

- [ ] **Adım 5: Yasal sayfa rotası** — `src/app/[locale]/yasal/[slug]/page.tsx`: Görev 6 detay sayfasındaki kalıp (`dynamicParams = false`, `generateStaticParams` → `legalKeys.map(k => ({ slug: legalSlug(k, locale) }))`, `PageHero`, `<Content />`, “Son güncelleme” tarihi), metadata’da `robots: { index: true, follow: true }` ve `hrefFor: (l) => ({ pathname: '/yasal/[slug]', params: { slug: legalSlug(key, l) } })`.

- [ ] **Adım 6: Mesajlar** (TR; EN/AR aynı anahtarlarla):

```json
"Forms": {
  "required": "zorunlu",
  "name": "Adınız Soyadınız",
  "phone": "Telefon",
  "email": "E-posta",
  "subject": "Konu",
  "message": "Mesajınız",
  "consent": "<link>KVKK Aydınlatma Metni</link>’ni okudum, kişisel verilerimin talebime dönüş yapılması amacıyla işlenmesini kabul ediyorum.",
  "sending": "Gönderiliyor…",
  "success": "Talebiniz bize ulaştı. Atölyemiz en kısa sürede sizinle iletişime geçecek.",
  "errors": {
    "validation": "Lütfen işaretli alanları kontrol edin.",
    "captcha": "Güvenlik doğrulaması tamamlanamadı. Sayfayı yenileyip tekrar deneyin.",
    "server": "Şu an gönderilemedi. Lütfen telefon veya WhatsApp ile ulaşın.",
    "name": "Adınızı en az 2 karakter olarak yazın.",
    "phone": "Geçerli bir telefon numarası yazın.",
    "email": "Geçerli bir e-posta adresi yazın.",
    "quantity": "Adet 1 ile 50 arasında olmalı.",
    "message": "Mesajınız en az 10 karakter olmalı.",
    "consent": "Devam etmek için aydınlatma metnini onaylayın.",
    "tuning": "Listeden bir akort seçin.",
    "note": "Not en fazla 2000 karakter olabilir.",
    "subject": "Konu en fazla 150 karakter olabilir."
  }
},
"Order": {
  "title": "Ney Siparişi",
  "heading": "El Yapımı Mansur Neyi",
  "intro": "Her neyimiz, seçilmiş kamıştan, geleneksel yöntemlerle ve ustalıkla hazırlanır. İstediğiniz akort ve ölçüde ney siparişi için aşağıdaki formu doldurun; atölyemiz en kısa sürede sizinle iletişime geçsin.",
  "description": "El yapımı ney siparişi: Bolâhenk, Süpürde, Mansur, Kız, Müstahsen, Şah, Davud ve Bolâhenk Nısfiye akortlarında ney talebinizi iletin.",
  "tuning": "Akort",
  "tuningUnsure": "Seçiniz / danışacağım",
  "quantity": "Adet",
  "note": "Notunuz",
  "notePlaceholder": "Özel istekleriniz, tercih ettiğiniz ölçü vb.",
  "submit": "Sipariş talebi gönder",
  "whyTitle": "Neden Mansur Ney?",
  "why": { "reed": "Seçilmiş kamış", "craft": "El işçiliği ve hassas akort", "tunings": "Tüm akortlarda üretim", "packing": "Özenli paketleme" },
  "shipping": "Türkiye’nin her yerine kargo ile ney gönderiyoruz.",
  "whatsappText": "Merhaba, ney siparişi hakkında bilgi almak istiyorum."
},
"Contact": {
  "title": "İletişim",
  "heading": "Bize yazın",
  "description": "Mansur Ney atölyesine ulaşın: Antakya / Hatay adres, telefon, WhatsApp ve iletişim formu.",
  "submit": "Gönder",
  "infoTitle": "İletişim bilgileri",
  "hours": "Çalışma saatleri",
  "map": "Haritada aç"
},
"Legal": { "updated": "Son güncelleme: {date}" }
```

> “Neden Mansur Ney?” maddeleri, sipariş giriş metni ve kargo cümlesi mevcut siteden birebir alınmıştır (`docs/icerik/mevcut-site/06`, `08`). EN örnekleri e2e testte kullanılan etiketler: `"name": "Full name"`, `"email": "Email"`, `"message": "Message"`, `"consent": "I have read the <link>Privacy Notice</link> and consent to the processing of my personal data to respond to my request."`, `Contact.submit: "Send"`, `Forms.success: "Your request has been received. Our workshop will contact you shortly."`

- [ ] **Adım 7: Form parçaları**

`src/components/forms/Field.tsx`:
```tsx
import { useId, type ReactElement, cloneElement } from 'react';

export function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: ReactElement<Record<string, unknown>> }) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">{label}{required && <span aria-hidden="true" className="text-kor"> *</span>}</label>
      {cloneElement(children, {
        id, required, 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': error ? errId : undefined,
        className: 'rounded-lg border border-yesil/20 bg-white px-3 py-2.5 focus:border-altin aria-invalid:border-kor',
      })}
      {error && <p id={errId} className="text-sm text-kor">{error}</p>}
    </div>
  );
}
```

`src/components/forms/ConsentCheckbox.tsx`:
```tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { legalSlug } from '@/lib/legal';

export function ConsentCheckbox({ invalid }: { invalid: boolean }) {
  const t = useTranslations('Forms');
  const locale = useLocale() as Locale;
  return (
    <div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" required aria-invalid={invalid || undefined} className="mt-1 size-4 accent-yesil" />
        <span>
          {t.rich('consent', {
            link: (chunks) => (
              <Link href={{ pathname: '/yasal/[slug]', params: { slug: legalSlug('kvkk', locale) } }} target="_blank" className="underline decoration-altin">{chunks}</Link>
            ),
          })}
        </span>
      </label>
      {invalid && <p className="mt-1 text-sm text-kor">{t('errors.consent')}</p>}
    </div>
  );
}
```

> `legal.ts` MDX dinamik import içerdiği için istemci bileşeninden import edilince paketlemeye çalışır. `legalKeys/legalSlug/legalKeyFromSlug` fonksiyonlarını `src/lib/legal-slugs.ts` dosyasına ayır, `legal.ts` onu yeniden dışa aktarsın; `ConsentCheckbox` yalnızca `legal-slugs.ts`’i import etsin.

`src/components/forms/TurnstileField.tsx`:
```tsx
'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { useLocale } from 'next-intl';

export function TurnstileField() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const locale = useLocale();
  if (!siteKey) return null; // dry-run/geliştirme; sunucu tarafı FORMS_DRY_RUN olmadan token’sız isteği reddeder
  return <Turnstile siteKey={siteKey} options={{ language: locale, theme: 'light', size: 'flexible' }} />;
}
```

> Widget, gizli `cf-turnstile-response` alanını forma kendisi ekler; `handleSubmission` bu adı okur. Staging’de Cloudflare test anahtarları: site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.

`src/components/forms/FormStatus.tsx`:
```tsx
'use client';

import { useTranslations } from 'next-intl';
import type { FormState } from '@/lib/forms/schemas';

export function FormStatus({ state }: { state: FormState }) {
  const t = useTranslations('Forms');
  return (
    <div role="status" aria-live="polite" className="min-h-6">
      {state.status === 'success' && <p className="rounded-lg bg-yesil/10 p-4 text-yesil">{t('success')}</p>}
      {state.status === 'error' && state.error && <p className="rounded-lg bg-kor/10 p-4 text-kor">{t(`errors.${state.error}`)}</p>}
    </div>
  );
}
```

- [ ] **Adım 8: `OrderForm`**

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { submitOrder } from '@/app/[locale]/siparis/actions';
import { Button } from '@/components/ui/Button';
import { tunings, type TuningKey } from '@/data/tunings';
import { initialFormState } from '@/lib/forms/schemas';
import { ConsentCheckbox } from './ConsentCheckbox';
import { Field } from './Field';
import { FormStatus } from './FormStatus';
import { TurnstileField } from './TurnstileField';

export function OrderForm({ defaultTuning }: { defaultTuning: TuningKey | '' }) {
  const t = useTranslations();
  const [state, action, pending] = useActionState(submitOrder, initialFormState);
  const err = (f: string) => (state.fields?.includes(f) ? t(`Forms.errors.${f}`) : undefined);

  if (state.status === 'success') return <FormStatus state={state} />;

  return (
    <form action={action} className="mt-6 space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('Forms.name')} required error={err('name')}><input name="name" autoComplete="name" /></Field>
        <Field label={t('Forms.phone')} required error={err('phone')}><input name="phone" type="tel" autoComplete="tel" dir="ltr" /></Field>
        <Field label={t('Forms.email')} error={err('email')}><input name="email" type="email" autoComplete="email" dir="ltr" /></Field>
        <Field label={t('Order.tuning')} error={err('tuning')}>
          <select name="tuning" defaultValue={defaultTuning}>
            <option value="">{t('Order.tuningUnsure')}</option>
            {tunings.map((tu) => <option key={tu.key} value={tu.key}>{tu.name}</option>)}
          </select>
        </Field>
      </div>
      <div className="max-w-40"><Field label={t('Order.quantity')} error={err('quantity')}><input name="quantity" type="number" min={1} max={50} defaultValue={1} /></Field></div>
      <Field label={t('Order.note')} error={err('note')}><textarea name="note" rows={4} placeholder={t('Order.notePlaceholder')} /></Field>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -start-[9999px] size-px opacity-0" />
      <ConsentCheckbox invalid={Boolean(state.fields?.includes('consent'))} />
      <TurnstileField />
      <FormStatus state={state} />
      <Button type="submit" disabled={pending}>{pending ? t('Forms.sending') : t('Order.submit')}</Button>
    </form>
  );
}
```

> Başarılı gönderimden sonra form yerine yalnızca `FormStatus` render edilir; e2e testi `role="status"` ile bunu doğrular.

`ContactForm`: aynı yapı, alanlar `name*`, `email*`, `phone`, `subject`, `message*` (`textarea rows={6}`), `submitContact`, buton `t('Contact.submit')`.

- [ ] **Adım 9: Server Action’lar**

`src/app/[locale]/siparis/actions.ts`:
```ts
'use server';

import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getMailer } from '@/lib/forms/mailer';
import { orderSchema, type FormState } from '@/lib/forms/schemas';
import { handleSubmission } from '@/lib/forms/submit';
import { orderMail } from '@/lib/forms/templates';
import { verifyTurnstile } from '@/lib/forms/turnstile';

export async function submitOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  const ip = h.get('cf-connecting-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const locale = (await getLocale()) as Locale;
  return handleSubmission({
    formData,
    schema: orderSchema,
    verify: (token) => verifyTurnstile(token, ip),
    mailer: getMailer(),
    toMail: (data) => orderMail(data, locale),
  });
}
```

`src/app/[locale]/iletisim/actions.ts`: aynı, `contactSchema` + `contactMail` ile `submitContact`.

- [ ] **Adım 10: Sipariş sayfası** — `src/app/[locale]/siparis/page.tsx`:

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { OrderForm } from '@/components/forms/OrderForm';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ReedDivider } from '@/components/ui/ReedDivider';
import { business, telUrl, whatsappUrl } from '@/config/business';
import { isTuningKey } from '@/data/tunings';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/siparis'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Order' });
  return pageMetadata({ locale, title: t('title'), description: t('description'), hrefFor: () => '/siparis' });
}

export default async function OrderPage({ params, searchParams }: PageProps<'/[locale]/siparis'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const { akort } = await searchParams;
  const t = await getTranslations();
  const why = ['reed', 'craft', 'tunings', 'packing'] as const;

  return (
    <>
      <PageHero title={t('Order.title')} breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: t('Order.title') }]} />
      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_340px]">
        <div className="rounded-kart bg-white p-6 shadow-kart md:p-10">
          <ReedDivider className="mb-6 max-w-[220px]" />
          <h2 className="text-3xl">{t('Order.heading')}</h2>
          <p className="mt-3">{t('Order.intro')}</p>
          <OrderForm defaultTuning={isTuningKey(akort) ? akort : ''} />
        </div>
        <aside className="h-fit rounded-kart bg-yesil p-6 text-kagit">
          <h2 className="border-b border-altin pb-2 text-lg text-white">{t('Order.whyTitle')}</h2>
          <ul className="mt-4 space-y-3 text-kamis">{why.map((k) => <li key={k}>✓ {t(`Order.why.${k}`)}</li>)}</ul>
          <p className="mt-4 text-sm text-kamis">{t('Order.shipping')}</p>
          <Button href={whatsappUrl(t('Order.whatsappText'))} className="mt-6 w-full justify-center">{t('Common.whatsapp')}</Button>
          <a href={telUrl()} dir="ltr" className="mt-3 block text-center text-kagit">{business.phoneDisplay}</a>
        </aside>
      </Container>
    </>
  );
}
```

> `Button` bileşeni `href`’i `next-intl` `Link`’e verir; harici WhatsApp URL’si için `Button`’a `external` desteği ekle: `href` `http` ile başlıyorsa düz `<a target="_blank" rel="noopener">` render et. Bu değişikliği `tests/unit/ui/button.test.tsx`’e yeni bir test ile ekle.

> `searchParams` kullanımı sayfayı dinamik yapar. Statik kalması için alternatif: `OrderForm` içinde `useSearchParams()` ile okuyup `<Suspense>` ile sar. **Tercih edilen budur** (tüm site SSG) — sayfa bileşeninden `searchParams`’ı kaldır, `OrderForm`’da `const akort = useSearchParams().get('akort')` ve `defaultValue={isTuningKey(akort) ? akort : ''}` kullan; sayfada `<Suspense fallback={null}><OrderForm /></Suspense>`.

- [ ] **Adım 11: İletişim sayfası** — sipariş sayfası düzeni; sağ kutuda adres (`<address>`), telefon, e-posta, WhatsApp, `t('Contact.hours')` başlığı altında `business.openingHours` (gün adları `getFormatter().dateTime` ile yerel dilde; ör. 2024-01-01 Pazartesi’den gün hesaplayarak), ve `t('Contact.map')` linki: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(\`${business.address.street}, ${business.address.locality}\`)}` (`business.geo` doluysa `query=lat,lng`). Gömülü harita iframe’i **eklenmez** (üçüncü taraf çerez → K9).

- [ ] **Adım 12:** `pnpm test && pnpm typecheck && pnpm test:e2e` → PASS.

- [ ] **Adım 13: Gerçek gönderim testi (staging).** `.env.local`’a Resend anahtarı ve Turnstile test anahtarlarını koy, `FORMS_DRY_RUN` boş; `pnpm dev` ile her iki formu TR/EN/AR’da gönder, `FORM_TO_EMAIL` kutusuna 6 e-postanın geldiğini ve `Reply-To`’nun doğru olduğunu doğrula.

- [ ] **Adım 14: Commit** — `git add -A && git commit -m "feat(forms): sipariş, iletişim ve kvkk sayfaları"`

---

## Faz 5 — Anasayfa ve SEO Taşıma

### Görev 11: Anasayfa

**Files:**
- Create: `src/data/couplets.ts`, `src/components/home/{Hero,CoupletBand,AboutTeaser,GuideGrid,TuningsTeaser,GalleryStrip,OrderBand}.tsx`
- Modify: `src/app/[locale]/page.tsx` (Görev 3’teki geçici sürümün yerine), `messages/{tr,en,ar}.json` (`Home`)
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `getGuideList`, `GuideCard` (Görev 6); `tunings` (Görev 7); `gallery`, `GalleryGrid` (Görev 8); `Button`, `Container`, `SectionHeading`, `ReedDivider`, `pageMetadata`.
- Produces: `couplets: Couplet[]` — `type Couplet = { id: string; lines: Record<Locale, string[]>; source: string }`.

Mevcut anasayfadan **kalanlar:** hero mesajı (“Dinle neyden”), Mesnevî bandı, “Sazların en kadîmi, sükûtun sesi” tanıtımı, rehber kartları, galeri. **Kaldırılanlar** (analiz §6.1): otomatik dönen slayt (WCAG 2.2.2, LCP), sayaç bandı, haberler, boş referanslar. **Eklenenler:** akort şeridi, sipariş bandı, anasayfa H1’i.

- [ ] **Adım 1: Başarısız E2E** — `tests/e2e/home.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('anasayfa bölümleri ve tek h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dinle neyden');
  await expect(page.locator('#rehber article')).toHaveCount(4);
  await expect(page.locator('#akortlar li a')).toHaveCount(8);
  await expect(page.getByRole('link', { name: 'Ney Siparişi' }).first()).toBeVisible();
});

test('hero görseli öncelikli yüklenir (LCP)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section#hero img')).toHaveAttribute('fetchpriority', 'high');
});

test('otomatik dönen içerik yok', async ({ page }) => {
  await page.goto('/');
  const before = await page.locator('section#hero h1').textContent();
  await page.waitForTimeout(7000);
  expect(await page.locator('section#hero h1').textContent()).toBe(before);
});

test('arapça anasayfa rtl ve çevrilmiş', async ({ page }) => {
  await page.goto('/ar');
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Dinle neyden');
});
```

- [ ] **Adım 2:** `pnpm test:e2e tests/e2e/home.spec.ts` → FAIL.

- [ ] **Adım 3: `src/data/couplets.ts`** — yalnızca mevcut sitede yayında olan iki beyit (analiz §7; arşivdeki diğer beyitler müşteri tercihiyle eklenir, Mesnevî tercümesinin kaynağı netleşmeden **eklenmez**):

```ts
import type { Locale } from '@/i18n/routing';

export type Couplet = { id: string; lines: Record<Locale, string[]>; source: string };

export const couplets: Couplet[] = [
  {
    id: 'mesnevi-1',
    source: 'Mevlânâ, Mesnevî',
    lines: {
      tr: ['Dinle, bu ney nasıl şikâyet ediyor;', 'ayrılıkları nasıl anlatıyor.'],
      en: ['Listen to the ney, how it complains,', 'telling the tale of separations.'],
      ar: ['اسمع الناي كيف يشكو،', 'وكيف يحكي حكاية الفراق.'],
    },
  },
  {
    id: 'la-edri',
    source: 'Lâ-edrî',
    lines: {
      tr: ['Bir çemenden yaratıp Hazret-i Mevlâ nây’ı,', 'Halka bildirmek için Hazret-i Mevlânâ’yı.'],
      en: ['Having created the ney from a meadow, God', 'made Rumi known to the world through it.'],
      ar: ['خلق الله الناي من مرج', 'ليُعرّف الناس بمولانا.'],
    },
  },
];
```

> Beyit satırları `lang` özniteliğiyle render edilir; EN/AR satırlar çeviri olduğundan kaynak adının yanında Görev 0 çevirmeninin onayı aranır.

- [ ] **Adım 4: `Home` mesajları** (TR; EN/AR aynı anahtarlarla):

```json
"Home": {
  "metaTitle": "El Yapımı Ney — Hatay",
  "hero": {
    "eyebrow": "Mansur Ney · Neyzen Atölyesi",
    "title": "Dinle neyden",
    "text": "Kamışın sükûtundan doğan ses; nefesle söze duran sabır.",
    "lead": "Asi kıyısının kamışından, sekiz akortta el yapımı ney.",
    "imageAlt": "Yakın plan, yan yana dizilmiş kamış neyler ve başpareler",
    "gallery": "Galeriyi gör"
  },
  "about": {
    "eyebrow": "Neyin Tarihçesi",
    "title": "Sazların en kadîmi, sükûtun sesi",
    "text": "Ney; sulak zeminde, muhtelif uzunluklarda yetişen bitki ve bu bitkiden üretilen nefesli bir çalgıdır. Kökeni mitolojik çağlara dayanır; Sümerlerden Mevlevîliğe binlerce yıllık bir yolculuğun sesidir.",
    "cta": "Devamını oku"
  },
  "tunings": { "eyebrow": "Akortlar", "title": "Her ahenkte ney", "cta": "Akortları incele" },
  "gallery": { "cta": "Tüm galeriyi gör" },
  "order": { "title": "Neyinizi atölyemizden isteyin", "text": "Akordunuzu seçin ya da bize danışın; atölyemiz en kısa sürede sizinle iletişime geçsin." }
}
```

- [ ] **Adım 5: Bileşenler**

`src/components/home/Hero.tsx`:
```tsx
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import heroImage from '@/assets/images/hero/reeds-28.jpg';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

export async function Hero() {
  const t = await getTranslations();
  return (
    <section id="hero" className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-murekkep">
      <Image src={heroImage} alt={t('Home.hero.imageAlt')} fill priority placeholder="blur" sizes="100vw" className="-z-10 object-cover opacity-80" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-murekkep via-murekkep/50 to-transparent" />
      <Container className="pb-20 pt-40 text-kagit">
        <Eyebrow className="!text-altin">{t('Home.hero.eyebrow')}</Eyebrow>
        <h1 className="mt-3 text-5xl text-kagit md:text-7xl">{t('Home.hero.title')}</h1>
        <p className="mt-4 max-w-xl font-display text-xl italic text-kamis">{t('Home.hero.text')}</p>
        <p className="mt-2 max-w-xl text-kagit/90">{t('Home.hero.lead')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/siparis">{t('Nav.order')}</Button>
          <Button href="/galeri" variant="outline">{t('Home.hero.gallery')}</Button>
        </div>
      </Container>
    </section>
  );
}
```

> `next/image` `priority` → `fetchpriority="high"` üretir (e2e testi bunu kontrol eder). Hero için `reeds-28.jpg` mevcut ilk slayttır; müşteri yeni çekim sağlarsa yalnızca import değişir.

`src/components/home/CoupletBand.tsx`:
```tsx
import { getLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { couplets } from '@/data/couplets';
import type { Locale } from '@/i18n/routing';

export async function CoupletBand() {
  const locale = (await getLocale()) as Locale;
  const c = couplets[0]!;
  return (
    <section className="bg-yesil py-10 text-center">
      <Container>
        <blockquote className="font-display text-2xl italic text-kagit md:text-3xl" lang={locale}>
          {c.lines[locale].map((l) => <span key={l} className="block">{l}</span>)}
          <footer className="mt-3 text-sm not-italic text-altin">— {c.source}</footer>
        </blockquote>
      </Container>
    </section>
  );
}
```

`AboutTeaser`: iki sütun (`workshop/about.jpg` sol, metin sağ; RTL’de grid otomatik aynalanır), `ReedDivider`, `Eyebrow`, `h2` = `Home.about.title`, paragraf, `Button variant="green" href={{ pathname: '/ney-rehberi/[slug]', params: { slug: guideSlug('history', locale) } }}`.

`GuideGrid`: `<section id="rehber">` + `SectionHeading eyebrow={t('Guide.eyebrow')} title={t('Guide.title')} description={t('Guide.description')}` + `getGuideList(locale)` → 4 `GuideCard`.

`TuningsTeaser`:
```tsx
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { tunings } from '@/data/tunings';
import { Link } from '@/i18n/navigation';

export async function TuningsTeaser() {
  const t = await getTranslations('Home.tunings');
  return (
    <section id="akortlar" className="bg-kagit-2 py-20">
      <Container className="text-center">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <ul className="flex flex-wrap justify-center gap-3">
          {tunings.map((tu) => (
            <li key={tu.key}>
              <Link href={{ pathname: '/akortlar', hash: tu.key }} lang="tr" className="inline-block rounded-full border border-altin px-5 py-2 font-display text-lg text-yesil hover:bg-altin hover:text-murekkep">
                {tu.name}
              </Link>
            </li>
          ))}
        </ul>
        <Button href="/akortlar" variant="green" className="mt-10">{t('cta')}</Button>
      </Container>
    </section>
  );
}
```

`GalleryStrip`: `SectionHeading eyebrow={t('Gallery.eyebrow')} title={t('Gallery.title')}` + `GalleryGrid items={gallery.slice(0, 8).map(...)}` + `Button href="/galeri"`.

`OrderBand`: koyu yeşil bant, `h2` = `Home.order.title`, metin, `Button href="/siparis"` + WhatsApp butonu (`whatsappUrl(t('Order.whatsappText'))`).

- [ ] **Adım 6: Sayfa** — `src/app/[locale]/page.tsx`:

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AboutTeaser } from '@/components/home/AboutTeaser';
import { CoupletBand } from '@/components/home/CoupletBand';
import { GalleryStrip } from '@/components/home/GalleryStrip';
import { GuideGrid } from '@/components/home/GuideGrid';
import { Hero } from '@/components/home/Hero';
import { OrderBand } from '@/components/home/OrderBand';
import { TuningsTeaser } from '@/components/home/TuningsTeaser';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale });
  const meta = await pageMetadata({ locale, title: t('Home.metaTitle'), description: t('Meta.defaultDescription'), hrefFor: () => '/' });
  return { ...meta, title: { absolute: `${t('Meta.siteName')} — ${t('Home.metaTitle')}` } };
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  setRequestLocale((await params).locale as Locale);
  return (
    <>
      <Hero />
      <CoupletBand />
      <AboutTeaser />
      <GuideGrid />
      <TuningsTeaser />
      <GalleryStrip />
      <OrderBand />
    </>
  );
}
```

- [ ] **Adım 7:** `pnpm test:e2e` → PASS. `pnpm build` çıktısında `/`, `/en`, `/ar` rotalarının `○ (Static)` / `● (SSG)` olarak listelendiğini doğrula; dinamik (`ƒ`) sayfa kalmamalı.

- [ ] **Adım 8: Commit** — `git add -A && git commit -m "feat(home): anasayfa"`

### Görev 12: Mevcut site URL’lerinin yeni sayfalara yönlendirilmesi

**Files:**
- Create: `src/config/legacy-redirects.ts`
- Modify: `src/proxy.ts`
- Test: `tests/unit/config/legacy-redirects.test.ts`, `tests/e2e/legacy.spec.ts`

**Interfaces:**
- Consumes: `routing` (Görev 3); rehber slug’ları (Görev 6).
- Produces: `resolveLegacyUrl(pathname: string, search: URLSearchParams): string | null` — yalnızca TR yollar döndürür (eski site tek dilliydi).

> **Kapsam (K10):** yalnızca bugün yayında olan PHP sitesinin URL’leri (analiz §5). 2003–2019 dönemine ait adresler için yönlendirme yazılmaz; 404 döner.
>
> Neden `next.config` `redirects()` değil: `icerik.php?id=` eşleşmesi sorgu parametresine bağlı ve `has: [{ type: 'query' }]` kullanıldığında Next.js kaynak sorguyu hedefe taşır (`/ney-rehberi/tarihce?id=10&s=…`). Proxy içinde saf bir fonksiyon temiz hedef üretir ve unit test edilebilir.

- [ ] **Adım 1: Başarısız unit test** — `tests/unit/config/legacy-redirects.test.ts`:

```ts
import { expect, test } from 'vitest';
import { resolveLegacyUrl } from '@/config/legacy-redirects';

const r = (url: string) => {
  const u = new URL(url, 'https://mansurney.vercel.app');
  return resolveLegacyUrl(u.pathname, u.searchParams);
};

test.each([
  ['/index.php', '/'],
  ['/INDEX.PHP', '/'],
  ['/icerik.php?id=10', '/ney-rehberi/tarihce'],
  ['/icerik.php?id=10&s=neyin-tarihcesi', '/ney-rehberi/tarihce'],
  ['/icerik.php?id=11&s=neyin-yapimi', '/ney-rehberi/yapimi'],
  ['/icerik.php?id=12', '/ney-rehberi/bolumleri'],
  ['/icerik.php?id=13', '/ney-rehberi/bakimi'],
  ['/icerik.php?id=14', '/ney-cantasi'],
  ['/icerik.php?id=53', '/akortlar'],
  ['/icerik.php?id=54', '/akortlar'],
  ['/icerik.php?id=999', '/ney-rehberi'],
  ['/icerik.php', '/ney-rehberi'],
  ['/siparis.php', '/siparis'],
  ['/iletisim.php', '/iletisim'],
  ['/fotogaleri.php', '/galeri'],
  ['/fotogaleri.php?id=3', '/galeri'],
  ['/galeri.php?id=13', '/galeri'],
  ['/haberler.php', '/'],
  ['/haber.php?id=4', '/'],
  ['/haber.php?id=5', '/ney-cantasi'],
  ['/kategori.php?id=92&s=haberler', '/'],
])('%s → %s', (from, to) => expect(r(from)).toBe(to));

test.each(['/', '/siparis', '/en/contact', '/ar/talab', '/ney-rehberi/tarihce', '/images/x.jpg', '/02.htm', '/d/10/neyin-tarihcesi'])(
  '%s yönlendirilmez',
  (p) => expect(r(p)).toBeNull(),
);
```

- [ ] **Adım 2:** `pnpm test tests/unit/config` → FAIL.

- [ ] **Adım 3: `src/config/legacy-redirects.ts`**

```ts
const guide = (slug: 'tarihce' | 'yapimi' | 'bolumleri' | 'bakimi') => `/ney-rehberi/${slug}`;

const contentById: Record<string, string> = {
  '10': guide('tarihce'),
  '11': guide('yapimi'),
  '12': guide('bolumleri'),
  '13': guide('bakimi'),
  '14': '/ney-cantasi',
  '53': '/akortlar', // footer “12 Çeşitli” (kırık link)
  '54': '/akortlar', // footer “9 Çeşitli” (kırık link)
};

const pages: Record<string, string> = {
  '/index.php': '/',
  '/siparis.php': '/siparis',
  '/iletisim.php': '/iletisim',
  '/fotogaleri.php': '/galeri',
  '/galeri.php': '/galeri',
  '/haberler.php': '/',
  '/kategori.php': '/',
};

export function resolveLegacyUrl(pathname: string, search: URLSearchParams): string | null {
  const path = pathname.toLowerCase();
  if (path === '/icerik.php') return contentById[search.get('id') ?? ''] ?? '/ney-rehberi';
  if (path === '/haber.php') return search.get('id') === '5' ? '/ney-cantasi' : '/';
  return pages[path] ?? null;
}
```

- [ ] **Adım 4:** `pnpm test tests/unit/config` → PASS.

- [ ] **Adım 5: `src/proxy.ts`**

```ts
import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { resolveLegacyUrl } from './config/legacy-redirects';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const legacy = resolveLegacyUrl(pathname, searchParams);
  if (legacy) return NextResponse.redirect(new URL(legacy, request.url), 301);
  return intl(request);
}

export const config = {
  // 2. desen: kök dizindeki *.php dosyaları (ilk desen noktalı yolları dışarıda bırakıyor)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/([^/]+\\.[pP][hH][pP])'],
};
```

> Matcher deseni Next.js’in path-to-regexp sözdizimine bağlıdır; e2e testi `.php` isteğinin proxy’ye ulaştığını doğrular. Ulaşmıyorsa deseni düzelt, testi değiştirme.

- [ ] **Adım 6: E2E** — `tests/e2e/legacy.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

for (const [from, to] of [
  ['/icerik.php?id=13&s=neyin-bakimi', '/ney-rehberi/bakimi'],
  ['/siparis.php', '/siparis'],
  ['/fotogaleri.php', '/galeri'],
  ['/haber.php?id=5', '/ney-cantasi'],
]) {
  test(`${from} 301 → ${to}`, async ({ request, baseURL }) => {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(res.headers()['location']).toBe(`${baseURL}${to}`);
  });
}

test('yönlendirme hedefi 200 döner (zincir yok)', async ({ request }) => {
  const res = await request.get('/icerik.php?id=10');
  expect(res.status()).toBe(200);
  expect(res.url()).toMatch(/\/ney-rehberi\/tarihce$/);
});
```

- [ ] **Adım 7:** `pnpm test && pnpm test:e2e` → PASS.

- [ ] **Adım 8: Commit** — `git add -A && git commit -m "feat(seo): mevcut php url’leri için 301 yönlendirmeleri"`

### Görev 13: Sitemap, robots, işletme şeması ve paylaşım görseli

**Files:**
- Create: `src/lib/routes.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/[locale]/opengraph-image.jpg`
- Modify: `src/lib/jsonld.ts` (`localBusinessLd`), `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
- Test: `tests/unit/lib/routes.test.ts`, `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `routing`, `getPathname`; `guideKeys`, `guideSlug` (Görev 6); `legalKeys`, `legalSlug` (Görev 10); `business` (Görev 4).
- Produces: `allRoutes(): { key: string; hrefFor: (l: Locale) => Href }[]` (sitemap ve prelaunch kontrolü kullanır), `localBusinessLd(locale: Locale): WithContext<MusicStore>`.

- [ ] **Adım 1: Başarısız testler**

`tests/unit/lib/routes.test.ts`:
```ts
import { expect, test } from 'vitest';
import { allRoutes } from '@/lib/routes';

test('sitemap rotaları: 8 sabit sayfa + 4 rehber + 2 yasal', () => {
  expect(allRoutes()).toHaveLength(14);
  expect(new Set(allRoutes().map((r) => r.key)).size).toBe(14);
});
```

`tests/e2e/seo.spec.ts`:
```ts
import { expect, test } from '@playwright/test';

test('sitemap.xml tüm dillerde alternatifleri listeler', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml.match(/<url>/g)?.length).toBe(42); // 14 rota × 3 dil
  expect(xml).toContain('hreflang="ar"');
  expect(xml).toContain('/en/ney-guide/history');
});

test('robots.txt sitemap’i gösterir', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text();
  expect(txt).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
});

test('anasayfada MusicStore JSON-LD ve NAP', async ({ page }) => {
  await page.goto('/');
  const data = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((s) => JSON.parse(s));
  const store = data.find((d) => d['@type'] === 'MusicStore');
  expect(store.telephone).toBe('+905325930436');
  expect(store.address.addressLocality).toBe('Antakya');
});

test('her sayfada og:image ve description var', async ({ page }) => {
  for (const path of ['/', '/en/tunings', '/ar/talab', '/ney-rehberi/bakimi']) {
    await page.goto(path);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
  }
});
```

- [ ] **Adım 2:** `pnpm test tests/unit/lib/routes.test.ts` → FAIL.

- [ ] **Adım 3: `src/lib/routes.ts`**

```ts
import type { Locale } from '@/i18n/routing';
import { guideKeys, guideSlug } from '@/lib/content';
import { legalKeys, legalSlug } from '@/lib/legal-slugs';
import type { Href } from '@/lib/seo';

const staticPaths = ['/', '/ney-rehberi', '/akortlar', '/ney-cantasi', '/atolye', '/galeri', '/siparis', '/iletisim'] as const;

export function allRoutes(): { key: string; hrefFor: (l: Locale) => Href }[] {
  return [
    ...staticPaths.map((p) => ({ key: p, hrefFor: () => p })),
    ...guideKeys.map((k) => ({ key: `guide:${k}`, hrefFor: (l: Locale) => ({ pathname: '/ney-rehberi/[slug]', params: { slug: guideSlug(k, l) } }) as const })),
    ...legalKeys.map((k) => ({ key: `legal:${k}`, hrefFor: (l: Locale) => ({ pathname: '/yasal/[slug]', params: { slug: legalSlug(k, l) } }) as const })),
  ];
}
```

- [ ] **Adım 4: `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { allRoutes } from '@/lib/routes';

const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mansurney.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes().flatMap((route) => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, site + getPathname({ locale: l, href: route.hrefFor(l) })]),
    );
    return routing.locales.map((l) => ({
      url: languages[l]!,
      changeFrequency: 'monthly' as const,
      priority: route.key === '/' ? 1 : route.key === '/siparis' ? 0.9 : 0.7,
      alternates: { languages },
    }));
  });
}
```

- [ ] **Adım 5: `src/app/robots.ts`**

```ts
import type { MetadataRoute } from 'next';

const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mansurney.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
```

> Mevcut sitede Cloudflare’in “AI botlarını engelle” yönetimli `robots.txt`’i açık (analiz §4). Cloudflare proxy açık kalırsa bu ayar Next.js’in `robots.txt`’inin **önüne geçer**. AI arama motorlarında (ChatGPT, Perplexity, Claude) görünürlük istenip istenmediğini müşteriye sor; karar Cloudflare panelinde uygulanır, koda yansımaz.

- [ ] **Adım 6: `localBusinessLd`** — `src/lib/jsonld.ts`’e ekle:

```ts
import type { MusicStore } from 'schema-dts';
import { business } from '@/config/business';
import type { Locale } from '@/i18n/routing';

export const localBusinessLd = (locale: Locale, description: string): WithContext<MusicStore> => ({
  '@context': 'https://schema.org',
  '@type': 'MusicStore',
  '@id': `${site}/#business`,
  name: business.name,
  description,
  url: site,
  inLanguage: locale,
  telephone: business.phone,
  email: business.email,
  foundingDate: String(business.foundingYear),
  image: abs('/opengraph-image.jpg'),
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address.street,
    addressLocality: business.address.locality,
    addressRegion: business.address.region,
    ...(business.address.postalCode ? { postalCode: business.address.postalCode } : {}),
    addressCountry: business.address.country,
  },
  ...(business.geo ? { geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng } } : {}),
  openingHoursSpecification: business.openingHours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days.map((d) => `https://schema.org/${{ Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' }[d]}`),
    opens: h.opens,
    closes: h.closes,
  })),
  sameAs: Object.values(business.social).filter((u): u is string => u !== null),
});
```

Anasayfada `<JsonLd data={localBusinessLd(locale, t('Meta.defaultDescription'))} />`; iletişim sayfasında da aynısı.

- [ ] **Adım 7: Paylaşım görseli.** `sharp` ile hero görselinden 1200×630 kırp: `pnpm tsx -e "import sharp from 'sharp'; await sharp('src/assets/images/hero/reeds-28.jpg').resize(1200,630,{fit:'cover'}).jpeg({quality:80}).toFile('src/app/[locale]/opengraph-image.jpg')"`. Next dosya kuralı bunu tüm dil sayfalarına `og:image` olarak ekler; rehber sayfaları `pageMetadata({ image })` ile kendi kapaklarını kullanır.

- [ ] **Adım 8: `pageMetadata` ve eksik description.** Görev 7–10’da `description` olarak kullanılan mesajların hepsi ≥ 50 karakter olmalı (e2e testi kontrol eder); kısa olanı genişlet.

- [ ] **Adım 9:** `pnpm test && pnpm test:e2e` → PASS. Google Rich Results Test’te (`search.google.com/test/rich-results`) staging URL’si ile anasayfa (MusicStore), `/ney-rehberi/bakimi` (Article + FAQPage + BreadcrumbList) doğrulanır; hata 0.

- [ ] **Adım 10: Commit** — `git add -A && git commit -m "feat(seo): sitemap, robots, işletme şeması ve og görseli"`

---

## Faz 6 — Kalite ve Yayın

### Görev 14: Kalite kapıları (erişilebilirlik, performans, yayın öncesi kontrol)

**Files:**
- Create: `tests/e2e/a11y.spec.ts`, `lighthouserc.json`, `scripts/prelaunch-check.ts`, `.github/workflows/ci.yml`
- Test: `tests/unit/scripts/prelaunch-check.test.ts`

**Interfaces:**
- Consumes: `allRoutes` (Görev 13), `business` (Görev 4), `gallery` (Görev 8).
- Produces: `findLaunchBlockers(root: string): Promise<string[]>`; `pnpm prelaunch` (blokaj varsa çıkış kodu 1).

- [ ] **Adım 1: Tüm rotalarda axe** — `tests/e2e/a11y.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const paths = [
  '/', '/ney-rehberi', '/ney-rehberi/tarihce', '/ney-rehberi/bakimi', '/akortlar', '/ney-cantasi', '/atolye', '/galeri', '/siparis', '/iletisim',
  '/en', '/en/ney-guide/care', '/en/order', '/ar', '/ar/dalil-al-nay/tarikh', '/ar/talab', '/ar/ittisal',
];

for (const path of paths) {
  test(`axe: ${path}`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(violations.map((v) => `${v.impact} ${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}
```

> Burada **tüm** ihlaller (minor dahil) sıfır hedeflenir; Görev 4’teki test yalnızca serious/critical’ı kontrol ediyordu.

- [ ] **Adım 2: Lighthouse CI** — `pnpm add -D @lhci/cli`; `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm start -p 3200",
      "url": ["http://localhost:3200/", "http://localhost:3200/ney-rehberi/bakimi", "http://localhost:3200/siparis", "http://localhost:3200/ar"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 1 }],
        "categories:best-practices": ["warn", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

`package.json`: `"lhci": "pnpm build && lhci autorun"`. Çalıştır; eşik altında kalan sayfada öncelik: hero görsel boyutu/`sizes`, font sayısı (Fraunces italik gerçekten kullanılmıyorsa kaldır), istemci JS (Turnstile yalnızca form sayfalarında).

- [ ] **Adım 3: Başarısız test** — `tests/unit/scripts/prelaunch-check.test.ts`:

```ts
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { findLaunchBlockers } from '../../../scripts/prelaunch-check';

test('taslak çeviri ve hukuk işaretlerini bulur', async () => {
  const root = mkdtempSync(join(tmpdir(), 'mn-'));
  mkdirSync(join(root, 'content/en/guide'), { recursive: true });
  mkdirSync(join(root, 'content/tr/legal'), { recursive: true });
  writeFileSync(join(root, 'content/en/guide/care.mdx'), '{/* ÇEVİRİ-TASLAK: ... */}\n# Care');
  writeFileSync(join(root, 'content/tr/legal/kvkk.mdx'), '{/* HUKUK-ONAYI-BEKLİYOR */}');
  writeFileSync(join(root, 'content/tr/guide/history.mdx'), '# Tarihçe');
  const blockers = await findLaunchBlockers(root);
  expect(blockers).toEqual(expect.arrayContaining([
    expect.stringContaining('content/en/guide/care.mdx'),
    expect.stringContaining('content/tr/legal/kvkk.mdx'),
  ]));
  expect(blockers.some((b) => b.includes('history.mdx'))).toBe(false);
});
```

- [ ] **Adım 4:** `pnpm test tests/unit/scripts` → FAIL.

- [ ] **Adım 5: `scripts/prelaunch-check.ts`**

```ts
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const MARKERS = ['ÇEVİRİ-TASLAK', 'HUKUK-ONAYI-BEKLİYOR'];

async function* walk(dir: string): AsyncGenerator<string> {
  for (const d of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else yield p;
  }
}

export async function findLaunchBlockers(root: string): Promise<string[]> {
  const blockers: string[] = [];
  for await (const file of walk(join(root, 'content'))) {
    const text = await readFile(file, 'utf8');
    for (const m of MARKERS) if (text.includes(m)) blockers.push(`${m}: ${relative(root, file)}`);
  }
  return blockers;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.cwd();
  const blockers = await findLaunchBlockers(root);
  const { business } = await import('../src/config/business');
  if (business.geo === null) blockers.push('business.geo boş (harita ve LocalBusiness geo eksik)');
  if (Object.values(business.social).every((v) => v === null)) console.warn('uyarı: hiç sosyal hesap tanımlı değil');
  if (blockers.length) {
    console.error('Yayın engelleri:\n- ' + blockers.join('\n- '));
    process.exit(1);
  }
  console.log('✔ Yayın öncesi kontrol temiz');
}
```

`package.json`: `"prelaunch": "tsx scripts/prelaunch-check.ts"`.

- [ ] **Adım 6:** `pnpm test tests/unit/scripts` → PASS.

- [ ] **Adım 7: CI** — `.github/workflows/ci.yml`:

```yaml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm typecheck && pnpm test
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
        env: { FORMS_DRY_RUN: '1', NEXT_PUBLIC_SITE_URL: 'http://localhost:3100' }
```

> `prelaunch` CI’ya **eklenmez** (içerik onayları gelene kadar her build kırmızı olur); Görev 15’te elle çalıştırılır.

- [ ] **Adım 8: RTL görsel kontrol.** `pnpm dev`, 375 px ve 1280 px genişlikte `/ar`, `/ar/talab`, `/ar/dalil-al-nay/tarikh`, `/ar/maarad` sayfalarının ekran görüntülerini al; kontrol listesi: logo sağda, menü sağdan sola, boğum ayracı gradyanları simetrik, ok/kırıntı ikonları ters, form etiketleri sağa hizalı, telefon/e-posta LTR, Arapça metinde Fraunces’e düşen glif yok.

- [ ] **Adım 9: Commit** — `git add -A && git commit -m "chore(quality): axe, lighthouse ci, yayın öncesi kontrol ve ci"`

### Görev 15: Yayına alma ve geçiş

**Files:**
- Create: `docs/yayin-kontrol-listesi.md`

**Interfaces:**
- Consumes: tüm görevler; `pnpm prelaunch` (Görev 14); Görev 0 cevapları.

- [ ] **Adım 1: Ön koşullar** — `pnpm prelaunch` çıkış kodu 0; Görev 0 bloklayıcı cevapları (§15-1, 2, 3, 10, 11) işlenmiş; EN/AR profesyonel çeviriler yerleştirilmiş; KVKK metni hukuk onaylı.

- [ ] **Adım 2: DNS envanteri (kritik).** Cloudflare panelinden mevcut tüm DNS kayıtlarını dışa aktar ve `docs/yayin-kontrol-listesi.md`’ye yapıştır. **`MX`, `SPF (TXT)`, `DKIM` kayıtlarına dokunulmayacak** — `neyzen@mansurney.com` 20 yıllık iletişim adresi; yalnızca web (`A`/`CNAME` @ ve www) kayıtları değişir.

- [ ] **Adım 3: Vercel projesi** — repo bağla; ortam değişkenleri (`.env.example` listesi) Production ve Preview için ayrı; `FORMS_DRY_RUN` Production’da **tanımsız**. Preview URL’sinde Görev 10 Adım 13’teki gerçek gönderim testini tekrarla.

- [ ] **Adım 4: Resend alan adı** — `mansurney.com` için Resend’in verdiği SPF/DKIM kayıtlarını **mevcut SPF ile birleştirerek** ekle (tek SPF TXT kaydı olmalı: `v=spf1 include:<mevcut> include:amazonses.com ~all`). Doğrulama “Verified” olmadan geçişe başlama.

- [ ] **Adım 5: Turnstile** — Cloudflare → Turnstile → site ekle (`mansurney.com`, `www.mansurney.com`, Vercel preview alan adı), gerçek anahtarları Vercel’e gir.

- [ ] **Adım 6: Geçiş** — trafiğin düşük olduğu saatte: TTL’i bir gün önceden 300 sn’ye indir → `@` ve `www` kayıtlarını Vercel’e yönlendir (Cloudflare kaydı “DNS only”) → Vercel’de `www` → apex kalıcı yönlendirme → SSL aktif olunca aşağıdaki doğrulamalar:

```bash
curl -sI https://mansurney.vercel.app/ | head -1
```
```bash
curl -sI "https://mansurney.vercel.app/icerik.php?id=13&s=neyin-bakimi" | grep -iE "^(HTTP|location)"
```
```bash
curl -s https://mansurney.vercel.app/sitemap.xml | grep -c "<url>"
```

Beklenen: `HTTP/2 200`; `301` + `location: https://mansurney.vercel.app/ney-rehberi/bakimi`; `42`.

- [ ] **Adım 7: Arama motorları** — Search Console’da (alan adı mülkü, DNS doğrulamalı) `sitemap.xml` gönder; “URL Denetimi” ile `/`, `/en`, `/ar`, `/ney-rehberi/bakimi` için dizine ekleme iste. Bing Webmaster Tools’a aynı sitemap. Google Business Profile varsa web sitesi alanını ve adresi güncelle (§15-8).

- [ ] **Adım 8: İzleme (14 gün)** — Vercel log’larında 404 veren yolları günlük incele; yeni bir eski URL kalıbı görülürse Görev 12 unit tablosuna satır ekle, düzelt, yayına al. Search Console “Sayfalar” raporunda “Yönlendirmeli sayfa” sayısının artıp “Bulunamadı (404)” sayısının artmadığını doğrula. Form e-postalarının geldiğini müşteriyle teyit et.

- [ ] **Adım 9: Commit** — `git add docs/yayin-kontrol-listesi.md && git commit -m "docs: yayın kontrol listesi"` ve `git tag v1.0.0`.

---

## Faz 2 Adayları (bu planın kapsamı dışında)

| Konu | Tetikleyici | Not |
|------|-------------|-----|
| Payload CMS | Müşteri içeriği kendisi güncellemek isterse (§15-12) | `content/` ve `src/data/` şemaları doğrudan Payload koleksiyonlarına eşlenir; `localization` yerleşik |
| “Atölyeden” blog | Düzenli içerik üretimi taahhüdü | Rehber altyapısı (Görev 6) yeniden kullanılır |
| Online ödeme | Fiyatlar netleşirse (§15-4) | iyzico / PayTR; mesafeli satış sözleşmesi, ön bilgilendirme formu gerekir |
| Ses/video | Akort kayıtları ve atölye videosu (§15-9) | `tunings[].audio` alanı hazır; video için YouTube `lite-youtube` (çerezsiz `youtube-nocookie`) |
| Farsça (fa) | Müşteri talebi (§15-6) | `routing.locales`’a ekle; RTL altyapısı hazır; Vazirmatn font |

---

## Öz-Denetim

**1. Spec kapsamı (analiz → görev):**

| Analiz bölümü | Görev |
|---------------|-------|
| §2 İşletme bilgisi, deprem sonrası adres teyidi | 0, 4 (`business.ts`), 13 (LocalBusiness) |
| §5 Bilgi mimarisi sorunları (ürün/rehber karışıklığı, akort sayfası yok, hakkımızda yok, boş haber linki, kırık footer linkleri) | 3 (yeni IA), 7, 11, 12 |
| §6.1 Anasayfa (tekrarlı slayt, sayaç, yer tutucu galeri, H1 yok) | 11 |
| §6.2 İçerik sayfaları (imla, kırık görseller, eksik bakım metni) | 5, 6 |
| §6.3–6.4 Sipariş/iletişim eksikleri (KVKK, spam, WhatsApp, harita, saatler) | 9, 10 |
| §6.5 Haberler | K5, 12 |
| §6.6 Galeri (boş albüm, alt metin) | 8 |
| §7 İçerik kayıpları | 5, 6, 7 |
| §8 Tasarım sistemi + Arapça font + mantıksal CSS | Global Constraints, 2, 14 (RTL kontrol) |
| §9 SEO (description, canonical, OG, JSON-LD, sitemap, hreflang, 301) | 6, 12, 13 |
| §10 Performans | 5, 11 (tek hero, `priority`), 14 (Lighthouse) |
| §11 Erişilebilirlik (H1, alt, otomatik slayt, dialog odak, aria) | 2, 4, 8, 10, 11, 14 |
| §12 Güvenlik/yasal (`/yonetim/`, spam, KVKK, sahte sosyal linkler, telif) | 4 (sosyal testi), 9, 10, 0 (telif teyidi) |
| §15 Müşteri soruları | 0; yayın kapısı 14–15 |

**2. Yer tutucu taraması:** Kasıtlı ve test/kapı ile korunan üç tür dışında yer tutucu yok — `'…'` galeri alt metinleri (Görev 8 testi yakalar), `ÇEVİRİ-TASLAK` ve `HUKUK-ONAYI-BEKLİYOR` işaretleri (Görev 14 `prelaunch` yakalar). Müşteriden gelmesi gereken olgular (akort boyları, adres, usta biyografisi) `null`/onay bayrağı olarak modellenmiş ve arayüz bu durumda dürüst bir mesaj gösteriyor.

**3. Tip/isim tutarlılığı:** `guideSlug/guideKeyFromSlug` (6 → 11, 13), `legalSlug` (`legal-slugs.ts`, 10 → 4 Footer, 13), `FormState/initialFormState` (9 → 10), `tunings/isTuningKey` (7 → 9, 10, 11), `GalleryGrid items: LightboxItem[]` (8 → 11), `PageHero` (7 → 6 geriye dönük refaktör, 8, 10), `allRoutes` (13 → 14) kontrol edildi.

**Bilinen düzeltme notları (uygulayıcı dikkat):**
- Rota sayısı 14 (8 sabit + 4 rehber + 2 yasal) → sitemap 42 URL; Görev 13 testleri ve Görev 15 Adım 6 bu sayıya bağlı. Rota eklenirse üçü birlikte güncellenir.
- Görev 4 Footer’daki geçici `slug: 'kvkk'` linki Görev 10’da `legalSlug('kvkk', locale)` ile değişir.
- Görev 10’da `searchParams` yerine `useSearchParams` + `Suspense` tercih edilir (tüm site statik kalır).

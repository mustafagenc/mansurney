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
- Commit mesajları Conventional Commits; her commit sonunda `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

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
| K7 | E-posta | Resend (alan adı doğrulamalı gönderici `form@mansurney.com`) | Güvenilir teslim, basit API | 9 |
| K8 | Barındırma | Vercel + Cloudflare DNS (proxy kapalı ya da “DNS only”) | Next.js için sıfır yapılandırma; alternatif: `output: 'standalone'` ile Node sunucu | 15 |
| K9 | Analitik | İlk sürümde yok; eklenirse çerezsiz (Plausible/Umami) | KVKK çerez bannerı gerektirmez | — |

---

## Dosya Yapısı

```
mansurney/
├── docs/                              # analiz, içerik kaynakları, bu plan (mevcut)
├── content/
│   ├── tr/
│   │   ├── rehber/{tarihce,yapimi,bolumleri,bakimi}.mdx
│   │   ├── atolye.mdx
│   │   ├── ney-cantasi.mdx
│   │   └── yasal/{kvkk,gizlilik}.mdx
│   ├── en/ (aynı dosya adları)
│   └── ar/ (aynı dosya adları)
├── messages/{tr,en,ar}.json            # arayüz metinleri
├── public/images/                      # optimize edilmiş kaynak görseller
├── scripts/
│   ├── recover-wayback-images.ts       # arşivden görsel kurtarma
│   └── optimize-images.ts              # sharp ile yeniden boyutlandırma
├── src/
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
NEXT_PUBLIC_SITE_URL=https://mansurney.com
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

export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mansurney.com') };

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

- [ ] **Adım 8: Layout’a bağla.** `src/app/[locale]/layout.tsx` içinde `<NextIntlClientProvider>` içeriğini `<Header /><main id="icerik">{children}</main><Footer />` yap. `amblem.svg` dosyasını indir: `curl -sL https://mansurney.com/assets/img/amblem.svg -o public/images/brand/amblem.svg` ve `src/app/icon.svg` olarak da kopyala.

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

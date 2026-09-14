# Mansur Ney

[mansurney.com](https://mansurney.com), Hatay/Antakya'da el yapımı ney üreten bir atölyenin web sitesidir. Bu depo, mevcut PHP sitesinin görsel kimliğini koruyarak Türkçe (varsayılan), İngilizce ve Arapça (RTL) destekli, statik üretilen bir Next.js sitesi olarak yeniden kurulmasını içerir.

> Bu README yalnızca gerçekten var olan veya kararlaştırılmış şeyleri anlatır; henüz kurulmamış özellikler "planlanan" olarak işaretlenmiştir. Uygulama detayları için bkz. [Belgeler](#belgeler).

## Teknoloji

- **Next.js 16.3** (App Router) · **React 19.2** · **TypeScript** (strict)
- **Tailwind CSS 4.3**
- **next-intl 4.14** — çok dilli yönlendirme (TR/EN/AR) *(planlanan; entegrasyon devam ediyor)*
- **MDX** (`@next/mdx`) — uzun içerik sayfaları *(planlanan)*
- **Resend** — sipariş ve iletişim formu e-postaları *(planlanan)*
- **Cloudflare Turnstile** (`@marsidev/react-turnstile`) — form spam koruması *(planlanan)*
- **Vitest 5** + Testing Library — birim testleri
- **Playwright** + `@axe-core/playwright` — uçtan uca ve erişilebilirlik testleri
- **Vercel** — barındırma

Sürümler `package.json` içindeki gerçek bağımlılıklardan alınmıştır; güncel liste için o dosyaya bakın.

## Gereksinimler

- **Node.js 22** (bkz. `.nvmrc`; `engines.node` alanı `>=22.12` gerektirir)
- **pnpm** — corepack ile etkinleştirilir:

```bash
corepack enable
```

## Kurulum ve komutlar

Bağımlılıkları kur:

```bash
pnpm install
```

Geliştirme sunucusu:

```bash
pnpm dev
```

Üretim derlemesi:

```bash
pnpm build
```

Birim testleri (Vitest):

```bash
pnpm test
```

Uçtan uca testler (Playwright):

```bash
pnpm test:e2e
```

Tip kontrolü:

```bash
pnpm typecheck
```

Lint:

```bash
pnpm lint
```

## Ortam değişkenleri

`.env.example` dosyasını kopyalayarak `.env` oluşturun. Değişkenlerin anlamı:

| Değişken | Anlamı |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sitenin kanonik kök URL'si (`https://mansurney.com`) |
| `RESEND_API_KEY` | Sipariş/iletişim formu e-postalarını göndermek için Resend API anahtarı |
| `FORM_TO_EMAIL` | Form gönderimlerinin ulaşacağı adres (`neyzen@mansurney.com`) |
| `FORM_FROM_EMAIL` | Resend üzerinden gönderilen e-postaların "gönderen" adresi |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile istemci anahtarı |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile sunucu doğrulama anahtarı |
| `FORMS_DRY_RUN` | `1` ise formlar e-posta göndermez ve Turnstile atlanır (yalnızca test ortamı; Production'da tanımsız olmalı) |

## Dizin yapısı

```
src/          Uygulama kodu (Next.js App Router, bileşenler, i18n, yardımcılar)
content/      Dil başına MDX içerik (planlanan)
messages/     Arayüz metinleri, dil başına JSON (planlanan)
tests/        Vitest (tests/unit) ve Playwright (tests/e2e) testleri
docs/         Site analizi, mevcut sitenin içerik arşivi ve uygulama planı — depoda kalır, Vercel'e dağıtılmaz
assets/photos/  Müşteriden alınan ham fotoğraflar — depoda kalır, Vercel'e dağıtılmaz.
                Optimize edilmiş, uygulamanın kullandığı kopyalar `src/assets/images/` altındadır.
```

## Yayın (Vercel)

- Dağıtım, Vercel'in **Git entegrasyonu** ile yapılır (push tetiklemeli); ayrı bir build/install komutu tanımlı değildir — Vercel, Next.js + pnpm'i otomatik algılar.
- Node sürümü `package.json` → `engines.node` alanından okunur.
- `vercel.json` fonksiyon bölgesini `fra1` (Frankfurt, Türkiye'ye en yakın bölge) olarak sabitler ve eski site URL'lerinin 301 yönlendirmelerini tanımlar (bkz. [Eski URL yönlendirmeleri](#eski-url-yönlendirmeleri)).
- `.vercelignore`, kök dizindeki `docs/` ve `assets/` klasörlerinin dağıtıma dahil edilmesini engeller; bu klasörler yalnızca git geçmişinde kalır.
- Ortam değişkenleri (yukarıdaki tablo) Vercel proje ayarlarında Production ve Preview için ayrı ayrı girilmelidir.
- `www` → apex (`mansurney.com`) yönlendirmesi kodda değil, Vercel **Domains** ayarlarından yapılandırılır.
- Resend'in verdiği alan adı doğrulama (SPF/DKIM) DNS kayıtları eklenmelidir.
- **Uyarı:** DNS geçişi sırasında `neyzen@mansurney.com` adresine ait mevcut `MX` kayıtlarına **dokunulmamalıdır** — yalnızca web (`A`/`CNAME`) kayıtları değişir.

## Eski URL yönlendirmeleri

Yalnızca bugün yayında olan PHP sitesinin URL'leri taşınır (2003–2019 dönemi kapsam dışı). Tümü `301 Moved Permanently`.

| Eski URL | Yeni URL |
|---|---|
| `/index.php` | `/` |
| `/icerik.php?id=10` | `/ney-rehberi/tarihce` |
| `/icerik.php?id=11` | `/ney-rehberi/yapimi` |
| `/icerik.php?id=12` | `/ney-rehberi/bolumleri` |
| `/icerik.php?id=13` | `/ney-rehberi/bakimi` |
| `/icerik.php?id=14` | `/ney-cantasi` |
| `/icerik.php?id=53` veya `id=54` | `/akortlar` |
| `/icerik.php` (diğer/eksik `id`) | `/ney-rehberi` |
| `/siparis.php` | `/siparis` |
| `/iletisim.php` | `/iletisim` |
| `/fotogaleri.php`, `/galeri.php` | `/galeri` |
| `/haberler.php` | `/` |
| `/haber.php?id=5` | `/ney-cantasi` |
| `/haber.php` (diğer/eksik `id`) | `/` |
| `/kategori.php` | `/` |

Tam kurallar `vercel.json` içindedir; davranış `tests/unit/config/vercel-redirects.test.ts` ile test edilir.

## Belgeler

- [Site analizi](docs/analiz/mansurney-site-analizi.md)
- [İçerik arşivi](docs/icerik/README.md)
- [Next.js/çok dilli uygulama planı](docs/superpowers/plans/2026-09-14-mansurney-nextjs-i18n.md)

## Lisans

[Apache License 2.0](LICENSE).

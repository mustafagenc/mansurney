# Mansur Ney

[mansurney.com](https://mansurney.com), Hatay/Antakya'da el yapımı ney üreten bir atölyenin web sitesidir. Bu depo, mevcut PHP sitesinin görsel kimliğini koruyarak Türkçe (varsayılan), İngilizce ve Arapça (RTL) destekli, statik üretilen bir Next.js sitesi olarak yeniden kurulmasını içerir.

> Bu README yalnızca gerçekten var olan veya kararlaştırılmış şeyleri anlatır. Uygulama detayları için bkz. [Belgeler](#belgeler); yayına geçiş adımları için bkz. [Yayın kontrol listesi](docs/yayin-kontrol-listesi.md).

## Teknoloji

- **Next.js 16.3** (App Router) · **React 19.2** · **TypeScript** (strict)
- **Tailwind CSS 4.3**
- **next-intl 4.14** — çok dilli yönlendirme (TR varsayılan ve öneksiz, `/en`, `/ar` RTL)
- **MDX** (`@next/mdx`) — ney rehberi, atölye, ney çantası ve yasal metin sayfaları (`content/`)
- **Server Actions + Zod** — sipariş ve iletişim formları
- **Resend** — form e-postalarının gönderimi
- **Cloudflare Turnstile** (`@marsidev/react-turnstile`) — form spam koruması
- **Vitest 5** + Testing Library, **Playwright** + `@axe-core/playwright` — mevcut test paketleri (bkz. [Doğrulama](#doğrulama))
- **Vercel** — barındırma

Sürümler `package.json` içindeki gerçek bağımlılıklardan alınmıştır; güncel liste için o dosyaya bakın.

## Gereksinimler

- **Node.js 22** (bkz. `.nvmrc`; `engines.node` alanı `22.x`)
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

Tip kontrolü:

```bash
pnpm typecheck
```

Lint:

```bash
pnpm lint
```

Yayın öncesi içerik kontrolü (`content/` altında `ÇEVİRİ-TASLAK` / `HUKUK-ONAYI-BEKLİYOR` işaretlerini ve boş `business.geo` alanını engel olarak raporlar):

```bash
pnpm prelaunch
```

Çeviriler, hukuk onayı ve koordinatlar tamamlanana kadar bu komutun **hata vermesi beklenir**.

## Doğrulama

Değişikliklerin doğrulama yolu `pnpm typecheck`, `pnpm lint` ve `pnpm build` komutlarının temiz geçmesi ve yayından önce [yayın kontrol listesinin](docs/yayin-kontrol-listesi.md) izlenmesidir.

`tests/` altında Vitest (`pnpm test`) ve Playwright (`pnpm test:e2e`) testleri bulunur; ancak işletme sahibi test çalışmasını şimdilik durdurduğu için bu testler güncel tutulmamaktadır ve doğrulama yolu olarak kullanılmaz — bazıları mevcut kodla uyuşmayabilir.

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
| `FORMS_DRY_RUN` | `1` ise formlar e-posta göndermez ve Turnstile atlanır. Yalnızca yerel uçtan uca testler içindir; Vercel'de (Production veya Preview) hiç tanımlanmamalı. `VERCEL_ENV=production` iken kod bu bayrağı yok sayar. |

## Dizin yapısı

```
src/          Uygulama kodu (Next.js App Router, bileşenler, i18n, yardımcılar)
content/      Dil başına MDX içerik (tr, en, ar)
messages/     Arayüz metinleri, dil başına JSON (tr.json, en.json, ar.json)
scripts/      Görsel kurtarma/optimizasyon ve yayın öncesi kontrol betikleri
tests/        Vitest (tests/unit) ve Playwright (tests/e2e) testleri (güncel tutulmuyor; bkz. Doğrulama)
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
- Resend panelinin alan adı için gösterdiği DNS kayıtları birebir eklenmelidir; kök alan adındaki mevcut SPF/MX kayıtları düzenlenmez.
- **Uyarı:** DNS geçişi sırasında `neyzen@mansurney.com` adresine ait mevcut `MX`/`SPF`/`DKIM` kayıtlarına **dokunulmamalıdır** — yalnızca web (`A`/`CNAME`) kayıtları değişir.
- Adım adım geçiş için: [Yayın kontrol listesi](docs/yayin-kontrol-listesi.md).

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

Tam kurallar `vercel.json` içindedir (`tests/unit/config/vercel-redirects.test.ts` bu tabloyu kapsar, ancak testler şu an güncel tutulmuyor). Gerçek 301 davranışı yalnızca Vercel üzerinde doğrulanabilir; bkz. yayın kontrol listesi §7.

## Belgeler

- [Site analizi](docs/analiz/mansurney-site-analizi.md)
- [İçerik arşivi](docs/icerik/README.md)
- [Next.js/çok dilli uygulama planı](docs/superpowers/plans/2026-09-14-mansurney-nextjs-i18n.md)
- [Yayın kontrol listesi](docs/yayin-kontrol-listesi.md)

## Lisans

[Apache License 2.0](LICENSE).

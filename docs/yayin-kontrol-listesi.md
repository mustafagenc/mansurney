# Yayın kontrol listesi

Bu belge, mansurney.com'un yeni Next.js sitesine geçişi için **işletme sahibinin** (veya
sahibi adına Vercel/DNS erişimi olan kişinin) takip edeceği sıralı bir kontrol listesidir.
Kurulum, ortam değişkenleri, dizin yapısı ve eski URL yönlendirmelerinin teknik özeti için
önce [`README.md`](../README.md) dosyasına bakın — burada onlar tekrar edilmez, yalnızca
yayına özgü adımlar ve teyitler yer alır.

> Bu listedeki hiçbir adım bu depodaki kod tarafından otomatik yürütülmez. Her kutu,
> sorumlu kişinin elle tamamlayıp işaretlemesi için bırakılmıştır.

## 1. Ön koşullar

- [ ] `pnpm prelaunch` yerelde çalıştırıldığında **çıkış kodu 0** verir (yani `ÇEVİRİ-TASLAK`,
      `HUKUK-ONAYI-BEKLİYOR` işareti ve `business.geo === null` durumu kalmamıştır).
      Komut: `source ~/.nvm/nvm.sh && nvm use 22 && pnpm prelaunch`
- [ ] `content/en/` ve `content/ar/` altındaki tüm MDX dosyalarındaki profesyonel çeviriler
      yerleştirilmiş, taslak (`ÇEVİRİ-TASLAK`) işaretleri kaldırılmış.
- [ ] `messages/en.json` ve `messages/ar.json` içindeki İngilizce/Arapça arayüz metinleri de
      taslak çeviridir ve profesyonel çeviri kontrolüne dahil edilmiş (`pnpm prelaunch` yalnızca
      `content/` klasörünü tarar; bu dosyalardaki taslak metinleri yakalamaz).
- [ ] `content/*/legal/kvkk.mdx` ve `content/*/legal/privacy.mdx` metinleri hukuk
      danışmanınca onaylanmış, `HUKUK-ONAYI-BEKLİYOR` işaretleri kaldırılmış (üç dilde de).
- [ ] **Avukata sorulacak:** Aydınlatma metni ile açık rıza aynı onay kutusunda birleşik
      (`Forms.consent`); md. 5/2-c varken açık rıza istenip istenmeyeceği ve aydınlatmanın
      ayrı sunulması avukatla netleştirilmeli.
- [ ] **Avukata sorulacak:** Google Analytics (`NEXT_PUBLIC_GA_MEASUREMENT_ID` tanımlıysa,
      yalnızca Vercel Production'da yüklenir — `src/components/analytics/GoogleAnalytics.tsx`)
      zorunlu olmayan bir izleme çerezi kullanır; Gizlilik Politikası bunu belirtir ancak
      açık rıza gerektiren bir çerez onay bandı eklenip eklenmeyeceği avukatla netleştirilmeli.
- [ ] Aşağıdaki "Sahibinden beklenen bilgiler" bölümündeki tüm maddeler teyit edilmiş ve
      ilgili koda/içeriğe işlenmiş (`src/config/business.ts`, `src/data/tunings.ts`,
      `src/data/case-models.ts`, galeri ve sosyal medya bağlantıları).
- [ ] `pnpm typecheck && pnpm lint && pnpm build` yerelde temiz geçiyor.

## 2. Sahibinden beklenen bilgiler

Aşağıdaki bilgiler siteye kasıtlı olarak `null` / "onay bekliyor" durumunda modellenmiştir;
kod bu durumu dürüstçe gösterir (uydurma veri yoktur). Yayından önce hepsi teyit edilmeli.

- [ ] **Adres ve çalışma saatleri** — 2023 depremi sonrası atölye adresi ve çalışma saatleri
      güncel mi? (`src/config/business.ts` → `address`, `openingHours`)
- [ ] **Usta adı/fotoğraf izni** — Alper Yıldırım'ın adı, fotoğrafı ve biyografisinin sitede
      kullanılmasına yazılı onay var mı? (`src/config/business.ts` → `master.consent`,
      şu an `false`; atölye sayfası bu alan `true` olmadan ustanın adını göstermez)
- [ ] **Akort boyları ve ses kayıtları** — her akort için ney boyu (cm) ve mümkünse taksim
      ses kaydı sağlandı mı? (`src/data/tunings.ts` → `lengthCm`, `audio`; şu an tüm
      akortlarda `null`)
- [ ] **Ney çantası fotoğrafları ve ürün gamı** — mevcut iki model (alüminyum 3'lü,
      alüminyum set) için gerçek ürün fotoğrafı var mı; ahşap kutu modelleri (2'li/3'lü/4'lü)
      satışta mı, eklensin mi? (`src/data/case-models.ts` → `image`, model listesi)
- [ ] **Gerçek sosyal medya hesapları** — Instagram / YouTube / Facebook hesapları var mı,
      varsa bağlantıları nedir? (`src/config/business.ts` → `social`; şu an üçü de `null`)
- [ ] **`business.geo` koordinatları** — atölyenin haritada gösterilecek enlem/boylamı
      (harita gömme ve `LocalBusiness` yapılandırılmış verisi için zorunlu;
      `pnpm prelaunch` bu alan boşken engel olarak raporlar)
- [ ] **Form alıcı e-postası** — sipariş ve iletişim formları hangi adrese düşsün?
      (`.env.example` → `FORM_TO_EMAIL`; şu an `mansurney@hotmail.com` varsayılan)
- [ ] **Sahne/performans fotoğrafları izni** — galeri veya diğer sayfalarda kullanılacak
      sahne/performans fotoğraflarının kullanım izni var mı?

## 3. DNS envanteri (kritik)

> ⚠️ **`neyzen@mansurney.com`, 20 yıldır kullanılan iletişim adresidir. `MX`, `SPF (TXT)` ve
> `DKIM` kayıtlarına DOKUNULMAYACAK.** Yalnızca web trafiğini yönlendiren `A` (kök `@`) ve
> `CNAME` (`www`) kayıtları değişecek. Aşağıdaki envanteri çıkarmadan hiçbir DNS kaydını
> değiştirmeyin.

- [ ] Cloudflare panelinden mevcut tüm DNS kayıtlarını (DNS → Records) dışa aktarın.
- [ ] Aşağıya, o an geçerli olan kayıtları (tür, ad, değer, TTL, proxy durumu) yapıştırın —
      özellikle mevcut `MX`, `SPF`/`TXT`, `DKIM` kayıtlarını değişiklikten önceki hâliyle
      arşivlemek için:

```
(buraya Cloudflare "Export DNS records" çıktısını yapıştırın)
```

- [ ] Mevcut `A`/`CNAME` (`@` ve `www`) kayıtlarını not edin — geçiş sonrası eski değere
      dönmek gerekirse bu kayıt referans olacak.
- [ ] Mevcut `MX`, `SPF`, `DKIM` kayıt sayısının geçişten sonra **değişmediğini** teyit
      edecek bir kontrol planlayın (bkz. Adım 7 — Geçiş ve Adım 9 — İzleme).

## 4. Vercel projesi

- [ ] Depo Vercel'e **Git entegrasyonu** ile bağlandı (push tetiklemeli; ayrı build/install
      komutu girilmesine gerek yok — bkz. [README → Yayın (Vercel)](../README.md#yayın-vercel)).
- [ ] Şu değişkenler Vercel proje ayarlarında **Production** ve **Preview** için ayrı ayrı
      girildi: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `FORM_TO_EMAIL`, `FORM_FROM_EMAIL`,
      `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
- [ ] `FORMS_DRY_RUN` Vercel'de **hiçbir ortamda (Production veya Preview) tanımlı değil**.
      Bu bayrak yalnızca yerel uçtan uca testler içindir; tanımlıyken formlar e-posta
      göndermez ve Turnstile doğrulaması atlanır. (Kod, `VERCEL_ENV=production` iken bayrağı
      zaten yok sayar ve log'a hata yazar; yine de hiçbir Vercel ortamında girilmemelidir.)
- [ ] `vercel.json` içindeki `regions: ["fra1"]` ayarı korunuyor (Frankfurt, Türkiye'ye en
      yakın Vercel bölgesi) — proje ayarlarında ezilmemiş.
- [ ] Vercel **Domains** ayarlarında `www.mansurney.com` → `mansurney.com` (apex) kalıcı
      yönlendirmesi yapılandırıldı.
- [ ] Preview URL'sinde, gerçek Resend ve Turnstile anahtarlarıyla (Adım 5 ve 6 tamamlandıktan
      sonra) sipariş ve iletişim formlarının her biri en az bir kez gerçekten gönderildi ve
      e-postanın `FORM_TO_EMAIL` adresine ulaştığı görüldü.

## 5. Resend alan adı doğrulaması

- [ ] Resend panelinden `mansurney.com` alan adı eklendi.
- [ ] DNS'e **yalnızca Resend panelinde bu alan adı için gösterilen kayıtlar, panelde yazdığı
      ad ve değerlerle birebir** eklendi (Resend gönderim için bir alt alan adı ve bir DKIM
      kaydı kullanır; değerler burada verilmemiştir, panelden kopyalanmalıdır).
- [ ] Kök alan adındaki (apex) mevcut `SPF` (TXT) ve `MX` kayıtları **düzenlenmedi** (bkz.
      Adım 3). Resend paneli kök alan adında bir değişiklik isterse **durun** ve
      `neyzen@mansurney.com` e-postasını yöneten kişiye danışmadan devam etmeyin.
- [ ] Resend panelinde alan adı durumu **"Verified"** oluncaya kadar geçişe (Adım 7)
      başlanmadı.

## 6. Cloudflare Turnstile anahtarları

- [ ] Cloudflare → Turnstile → yeni site eklendi; izin verilen alan adları:
      `mansurney.com`, `www.mansurney.com` ve Vercel preview alan adı
      (`*.vercel.app` ya da projeye özel preview domaini).
- [ ] Üretilen gerçek `Site Key` / `Secret Key` çifti, test anahtarlarının yerine Vercel
      ortam değişkenlerine girildi: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
      (Production ve Preview için ayrı ayrı, gerekiyorsa).

## 7. Geçiş

Trafiğin düşük olduğu bir saatte yapın:

- [ ] **Bir gün önceden**: mevcut `@` ve `www` DNS kayıtlarının TTL değeri 300 saniyeye
      düşürüldü (yayılımı hızlandırmak için).
- [ ] `@` ve `www` kayıtları Vercel'in verdiği hedeflere yönlendirildi; Cloudflare'de bu
      kayıtlar **"DNS only"** (turuncu bulut kapalı) olarak ayarlandı — Vercel'in kendi
      SSL/CDN'i devrede olmalı, Cloudflare proxy'si araya girmemeli.
- [ ] Vercel Domains'te `www` → apex kalıcı yönlendirmesi aktif (bkz. Adım 4).
- [ ] SSL sertifikası Vercel tarafında aktif olduktan sonra aşağıdaki "Doğrulama"
      komutları çalıştırıldı ve beklenen sonuçlar alındı.
- [ ] Adım 3'te arşivlenen `MX`/`SPF`/`DKIM` kayıtlarının geçişten **etkilenmediği**
      Cloudflare panelinden tekrar kontrol edildi.

### Doğrulama

Anasayfa 200 dönüyor:

```bash
curl -sI https://mansurney.vercel.app/ | head -1
```

Eski bir URL kalıbı kalıcı yönlendiriliyor (örnek: `icerik.php?id=13`):

```bash
curl -sI "https://mansurney.vercel.app/icerik.php?id=13&s=neyin-bakimi" | grep -iE "^(HTTP|location)"
```

Beklenen: `301` durum kodu ve `location` başlığında hedef yol — göreli
(`/ney-rehberi/bakimi`) veya mutlak (`https://mansurney.vercel.app/ney-rehberi/bakimi`) olabilir,
ikisi de doğrudur (sorgu dizesi olduğu gibi iletilebilir — bu kabul edilebilir, çünkü hedef
sayfadaki canonical etiketi asıl URL'yi zaten belirtir).

Sitemap 42 URL içeriyor (14 rota × 3 dil):

```bash
curl -s https://mansurney.vercel.app/sitemap.xml | grep -c "<url>"
```

`robots.txt` sitemap'i işaret ediyor:

```bash
curl -s https://mansurney.vercel.app/robots.txt
```

> Not: Bu doğrulamalar yalnızca canlı (production) alan adında anlamlıdır. `vercel.json`
> yönlendirmeleri Vercel kenarında uygulanır; yerel `pnpm start` bunları uygulamaz — bu
> yüzden gerçek 301 davranışı ancak burada, bir Vercel preview veya production URL'sinde
> doğrulanabilir.

## 8. Arama motorları

- [ ] Google Search Console'da **alan adı mülkü** (domain property, DNS TXT ile
      doğrulanmış) eklendi.
- [ ] `sitemap.xml` Search Console'a gönderildi.
- [ ] "URL Denetimi" aracıyla şu URL'ler için dizine ekleme talep edildi: `/`, `/en`, `/ar`,
      `/ney-rehberi/bakimi`.
- [ ] Aynı `sitemap.xml`, Bing Webmaster Tools'a da gönderildi.
- [ ] Google Business Profile kaydı varsa web sitesi alanı ve adres bilgisi güncellendi
      (Adım 2'deki teyit edilmiş adresle tutarlı olacak şekilde).

## 9. İzleme (14 gün)

- [ ] Vercel log'larında 404 dönen yollar günlük olarak incelendi; daha önce
      `vercel.json`'da karşılığı olmayan bir eski URL kalıbı görülürse
      `tests/unit/config/vercel-redirects.test.ts` tablosuna satır eklenip düzeltildi ve
      yeniden yayına alındı.
- [ ] Search Console "Sayfalar" raporunda "Yönlendirmeli sayfa" sayısının arttığı,
      "Bulunamadı (404)" sayısının artmadığı doğrulandı.
- [ ] Sipariş ve iletişim formu e-postalarının gerçekten işletme sahibine ulaştığı
      kendisiyle teyit edildi (en az bir gerçek gönderim örneğiyle).

---

## Ertelenen testler

Aşağıdaki testler, görev planlarında (Görev 3–14) tanımlanmış ancak sahibinin "test yok"
kararı (bu geçiş için) doğrultusunda hiç yazılmamış veya eklenmemiştir. İleride ayrı bir
faz olarak istenirse referans olması için burada listelenmiştir. Liste, bu depodaki
`tests/` klasörünün mevcut durumuna göre süzülmüştür — zaten var olan testler aşağıda
tekrar **listelenmemiştir**.

| Eksik test | Tür | Kaynak görev | Amaç |
|---|---|---|---|
| `tests/unit/lib/routes.test.ts` | Birim (Vitest) | Görev 13 | `allRoutes()`'un 8 sabit + 4 rehber + 2 yasal = 14 benzersiz rota döndürdüğünü doğrular |
| `tests/e2e/seo.spec.ts` | Uçtan uca (Playwright) | Görev 13 | `sitemap.xml`'in 42 URL ve `hreflang="ar"` içerdiğini, `robots.txt`'in sitemap'i gösterdiğini, anasayfada `MusicStore` JSON-LD/NAP verisinin doğru olduğunu, her sayfada `og:image`/description bulunduğunu doğrular |
| `tests/e2e/a11y.spec.ts` | Uçtan uca (Playwright + axe) | Görev 14 | Tüm 17 rotada (TR/EN/AR) axe ile WCAG 2.2 AA ihlali sıfır olduğunu doğrular (Görev 4'teki mevcut testten farklı olarak minor ihlalleri de kapsar) |
| `tests/unit/scripts/prelaunch-check.test.ts` | Birim (Vitest) | Görev 14 | `findLaunchBlockers()`'ın taslak çeviri/hukuk işaretlerini bulduğunu, onaylı içeriği engel saymadığını doğrular — kontrolcü kararıyla bu görevde de yazılmadı |
| `vercel.json` hedef-geçerlilik testi | Birim (Vitest, `tests/unit/config/vercel-redirects.test.ts` içine ek `test`) | Görev 12 | Her `destination` değerinin `routing.pathnames` TR yolları + `guideSlug(k,'tr')` kümesinde gerçekten var olan bir rotaya karşılık geldiğini doğrular — dosya mevcut ama bu spesifik doğrulama eklenmedi |
| Lighthouse CI bütçeleri (`lighthouserc.json`, `pnpm lhci`) | Performans/erişilebilirlik/SEO eşiği | Görev 14 | `/`, `/ney-rehberi/bakimi`, `/siparis`, `/ar` sayfalarında Performans ≥ 90, Erişilebilirlik ≥ 95, SEO 100 hedeflerini CI'da otomatik doğrular |
| GitHub Actions CI iş akışı (`.github/workflows/ci.yml`) | CI | Görev 14 | Her push/PR'da lint, typecheck, birim testleri ve Playwright e2e testlerini otomatik çalıştırır |

**Zaten var olan ve korunan test paketleri** (bilgi amaçlı — bu görevde değiştirilmedi):
`tests/unit/` altında `smoke`, `legal`, `assets/images`, `ui/button`, `ui/reed-divider`,
`forms/schemas`, `forms/submit`, `forms/templates`, `config/business`,
`config/vercel-redirects` (mevcut kapsamıyla — yukarıdaki hedef-geçerlilik testi hariç),
`content/pages`, `content/guide`, `lib/seo`, `i18n/messages`, `i18n/routing`,
`data/tunings`, `data/gallery`; `tests/e2e/` altında `smoke`, `pages`, `home`, `layout`,
`guide`, `forms`, `gallery`, `i18n`.

> Kapsam dışı bırakılan konular: eski barındırmanın yedeklenmesi/kapatılması ve Faz 2
> adayları (Payload CMS, "Atölyeden" blog, online ödeme, ses/video, Farsça) — bunlar bu
> geçişin kapsamında değildir; ayrıntı için [`README.md`](../README.md) ve görev
> planındaki "Faz 2 Adayları" tablosuna bakın.

# Mansur Ney — Tasarım Modernizasyonu (Editoryal Zanaat)

**Tarih:** 15 Eylül 2026
**Karar veren:** Site sahibi — yön: *Editoryal zanaat*, kapsam: *tüm site tek seferde*, görsel onay adımı yok.
**Dal:** `feat/modern-tasarim` (`main`'den)

## 1. Amaç

Mevcut Next.js sitesi eski PHP sitesinin görünümünü neredeyse birebir taşıyor (hap butonlar, gölgeli beyaz kartlar, yeşil bantlar, ortalanmış başlıklar). Hedef: **aynı renk paleti ve fontlarla**, butik bir zanaat markası gibi görünen, bol boşluklu, büyük tipografili, fotoğrafı öne çıkaran modern bir arayüz.

## 2. Değişmeyecekler (bağlayıcı)

- **Renk tokenları aynı hex değerlerde kalır** (`src/app/globals.css` `@theme`): `murekkep #10201b`, `yesil #1b3a31`, `yesil-acik #2c5347`, `altin #bf9b46`, `altin-koyu #9c7d33`, `altin-metin #7d6428`, `kagit #f6f1e6`, `kagit-2 #efe7d5`, `kamis #d8c39a`, `kor #a2532b`, `metin #243029`, `metin-soluk #5d6b62`. Yeni renk tonu eklenmez; opaklık varyantları (`murekkep/10` vb.) serbest.
- **Fontlar aynı:** Fraunces (başlık), Source Sans 3 (metin), Noto Naskh Arabic (AR).
- İçerik, rotalar, URL'ler, metadata, JSON-LD, formların davranışı (Server Action, doğrulama, Turnstile, honeypot, KVKK onayı), i18n anahtarları ve sayfa işlevleri değişmez. Sadece görünüm ve yerleşim.
- Yeni **çalışma zamanı bağımlılığı eklenmez** (animasyon kütüphanesi yok; CSS ile).
- RTL: yalnızca mantıksal sınıflar (`ms-/me-/ps-/pe-/start-/end-/text-start/text-end`), `ml-/mr-/pl-/pr-/left-/right-/text-left/text-right` yasak. Arapça sayfalar ayna düzen, italik yok.
- Kullanıcıya görünen yeni her metin `messages/{tr,en,ar}.json`'a üç dilde eklenir (anahtar eşitliği).
- Erişilebilirlik: WCAG AA kontrast (küçük altın metin için `altin-metin`), görünür odak, tek `h1`, anlamlı başlık sırası, `prefers-reduced-motion` desteği.
- Tüm sayfalar statik (SSG) kalır.
- **Test yazılmaz/çalıştırılmaz** (sahip kararı). Doğrulama: `pnpm typecheck`, `pnpm lint`, `pnpm build` temiz.
- Commit mesajları Türkçe Conventional Commits, `Co-Authored-By` satırı yok.

## 3. Tasarım dili

### 3.1 Tipografi
- Başlıklar büyük ve iddialı, `clamp()` ile akışkan:
  - Görüntü (hero): `clamp(3rem, 8vw, 7.5rem)`, `line-height: 0.95`, `letter-spacing: -0.02em`, Fraunces 500, opsz yüksek.
  - H1 (iç sayfa): `clamp(2.5rem, 5.5vw, 5rem)`.
  - H2 (bölüm): `clamp(2rem, 4vw, 3.25rem)`.
  - H3: `1.5rem–1.75rem`.
- Vurgu için başlık içinde **Fraunces italik** kelime (`<em>` ya da `italic` sınıfı) altın/altin-metin tonunda — dekoratif, AR'de italik kapalı.
- Gövde: Source Sans 3, `1.0625rem–1.125rem`, `line-height 1.7`, okuma genişliği `max-w-[65ch]`.
- **Eyebrow/etiket:** küçük (0.75rem), büyük harf, geniş aralık (0.18em), `altin-metin`, önünde 24–32px ince çizgi (`::before`, mantıksal yönde). AR'de büyük harf/aralık yok.
- Sayısal indeksler: bölümlerde ve listelerde `01`, `02`… (Fraunces, `tabular-nums`, `altin-metin`).

### 3.2 Yerleşim ve boşluk
- Container: `max-w-[1280px]`, yan boşluk `px-5 sm:px-8 lg:px-12`.
- Bölüm dikey boşluğu: `py-20 md:py-28 lg:py-32`.
- 12 sütunlu grid, **asimetrik bölünmeler** (7/5, 5/7, 8/4). Ortalanmış bölüm başlıkları yerine **başa hizalı** başlık + sağda kısa açıklama/link (masaüstü), mobilde alt alta.
- İnce çizgiler (hairline) ile ayrım: `border-murekkep/10` (açık zemin), `border-kagit/15` (koyu zemin), altın vurgu çizgisi `border-altin/40`.

### 3.3 Yüzeyler
- Ana zemin `kagit`; ikincil bölümler `kagit-2`; güçlü kontrast bölümleri `murekkep` (yeşil bantlar yerine koyu mürekkep; `yesil` detay/hover için).
- **Kartlar:** gölge yok; ya çerçevesiz (görsel + metin) ya da `1px` hairline çerçeve. Köşe yarıçapı küçük: `--radius-kart` → `4px` (token değeri güncellenir). Görseller `aspect-[4/5]` / `aspect-[3/2]` gibi sabit oranlar, `object-cover`.
- `--shadow-kart` yalnızca lightbox/menü gibi katmanlarda kullanılır.

### 3.4 Butonlar ve linkler
- **Birincil:** dikdörtgen (`rounded-[2px]`), `bg-murekkep text-kagit`, `px-6 py-3.5`, küçük büyük-harf etiket (0.8125rem, 0.12em aralık), hover `bg-yesil`; koyu zemin üstünde `bg-altin text-murekkep`, hover `bg-kamis`.
- **İkincil (çizgi):** aynı ölçü, `border border-current`, şeffaf zemin.
- **Metin linki:** etiket + ok (`→`, RTL'de döner), alttan çizgi animasyonu (`background-size` geçişi).
- Hap (pill) butonlar kaldırılır. `Button` bileşeni varyant adları: `primary`, `secondary`, `onDark`, `link` (mevcut `gold/green/outline` kullanımları yeni varyantlara taşınır).

### 3.5 Hareket (yalnız CSS)
- Kaydırmada hafif belirme: `@supports (animation-timeline: view())` içinde `.reveal` sınıfı (opacity 0→1, translateY 16px→0); desteklemeyen tarayıcıda içerik direkt görünür.
- Görsel hover: `scale-[1.03]` 500ms, `overflow-hidden` kapsayıcı.
- Link alt çizgi ve buton renk geçişleri 200–300ms.
- `prefers-reduced-motion: reduce` → tüm animasyon/geçiş kapalı (mevcut kural korunur).

### 3.6 İmza öğesi
- Kamış boğumu (`ReedDivider`) seyrek kullanılan küçük bir süs olur: yalnızca beyit bandı ve footer'da. Bölüm başlarındaki boğumlar Eyebrow çizgisiyle değiştirilir.

## 4. Bileşen ve sayfa kararları

### 4.1 Ortak
- **Header:** `TopBar` kaldırılır; tek satır yapışkan header — `bg-kagit/85 backdrop-blur` + alt hairline, sol: amblem + "Mansur Ney" (Fraunces) ve küçük "Neyzen Atölyesi"; orta/sağ: nav linkleri (küçük, aralıklı, aktif sayfa altın alt çizgi); en sağ: dil seçici (sade), "Ney Siparişi" birincil buton. Telefon/WhatsApp footer ve iletişim alanlarına taşınır. Mobil: amblem + menü düğmesi; `MobileNav` tam ekran `murekkep` panel, büyük Fraunces linkler, altta telefon/WhatsApp/dil.
- **Footer:** `murekkep` zemin; üstte büyük beyit/slogan satırı (Fraunces italik, `kamis`); ardından 12 sütun grid: marka + kısa açıklama (4), rehber (2), hızlı linkler (2), iletişim (4, adres/telefon/e-posta/WhatsApp LTR); en altta hairline + telif + yasal linkler. Küçük `ReedDivider`.
- **PageHero (iç sayfalar):** yeşil bant kaldırılır; `kagit` zemin, üstte breadcrumbs (küçük), altında büyük H1 (başa hizalı), isteğe bağlı kısa giriş cümlesi prop'u (`lead`), altta hairline. Görsel prop'u opsiyonel (varsa başlığın yanında/altında geniş oranlı görsel).
- **SectionHeading:** `align="start"` varsayılan; Eyebrow + H2 + opsiyonel açıklama; opsiyonel `action` (sağda metin linki).
- **Breadcrumbs:** küçük, `metin-soluk`, ayraç `/`.
- **Prose (MDX):** `mdx-components.tsx` stilleri: okuma genişliği, H2 üstünde büyük boşluk + küçük altın çizgi, blockquote büyük Fraunces italik ve başta ince altın çizgi, ilk paragrafta TR/EN için Fraunces drop cap (`first-letter`, AR'de yok), `Figure` tam okuma genişliğini aşan (breakout) görsel + küçük altyazı.

### 4.2 Anasayfa
1. **Hero:** iki sütun (7/5). Sol: Eyebrow, dev "Dinle neyden" (vurgu kelimesi italik altın), alt satır italik beyit cümlesi, kısa açıklama, iki buton (birincil + ikincil). Sağ: dikey oranlı (`aspect-[4/5]`) hero görseli, altında küçük altyazı (mesaj anahtarından). Mobilde görsel üstte değil metnin altında. `min-h` yok; ekranın ilk görünümüne sığan dengeli yükseklik. Görsel `loading="eager"` + `fetchPriority="high"` korunur.
2. **Beyit bandı:** `kagit-2` zemin, ortada çok büyük Fraunces italik beyit, üstte/altta küçük `ReedDivider`, kaynak küçük etiket.
3. **Tarihçe tanıtımı:** 5/7 asimetrik; görsel `aspect-[3/4]` ve üzerinde küçük `01` indeksi; metin sütununda Eyebrow, H2, paragraf, metin linki.
4. **Ney Rehberi:** başlık satırı (başa hizalı H2 + sağda "Tümü" linki); altında 4 yazı **numaralı editoryal liste** (masaüstünde 2×2 grid, her öğe: görsel `aspect-[3/2]`, `0X` indeks, başlık H3, açıklama, link) — gölgesiz.
5. **Akortlar:** `murekkep` koyu bölüm; solda Eyebrow + H2 + açıklama (Tunings.intro), sağda 8 akort **iki sütunlu numaralı liste** (Fraunces isimler, hover altın, her biri `/akortlar#key`), altta metin linki.
6. **Galeri şeridi:** asimetrik mozaik grid (ilk görsel 2×2 büyük, diğerleri küçük), 5–7 görsel; lightbox davranışı aynı. Başlık satırı + "Tüm galeri" linki.
7. **Sipariş bandı:** `kagit` zemin, büyük hairline çerçeveli alan; solda büyük H2 ve açıklama, sağda birincil buton + WhatsApp ikincil buton.

### 4.3 İç sayfalar
- **Ney Rehberi hub:** PageHero (lead = Guide.description) + numaralı editoryal liste (anasayfadaki bileşenin tam hali).
- **Rehber detayı:** PageHero (başlık + güncelleme tarihi + lead=açıklama); kapak görseli geniş (`aspect-[16/9]`, container genişliğinde); altında 8/4 düzen: sol makale (prose), sağ yapışkan (`lg:sticky lg:top-28`) kenar sütunu: "Diğer yazılar" numaralı liste + sade OrderCta (hairline çerçeveli, koyu değil). SSS: hairline ayrımlı akordeon (`details`), büyük artı/eksi işareti.
- **Akortlar:** PageHero + intro; 8 akort **tablo benzeri satırlar** (masaüstü: indeks | isim (Fraunces büyük) | boy | ses oynatıcı | sipariş linki; mobil: kart satır), hairline ayraçlı; `id={key}` korunur.
- **Ney Çantası:** PageHero; 7/5: sol metin (prose), sağ model listesi (hairline satırlar); iletişim metin linki/butonu.
- **Atölye:** PageHero; büyük geniş görsel (about) + iki sütunlu metin; iç mekân fotoğrafı asimetrik yerleşim; sonunda galeri ve sipariş linkleri.
- **Galeri:** PageHero; kategori başlıkları başa hizalı (Eyebrow + H2 + adet); görseller CSS `columns` ile masonry (1/2/3 sütun), küçük yuvarlatma; lightbox: koyu `murekkep/95` zemin, ince oklar, altyazı küçük.
- **404:** büyük Fraunces "404", kısa metin, birincil buton; ortalı ama sade.

### 4.4 Formlar (sipariş, iletişim) ve yasal
- **Sipariş / İletişim:** PageHero (lead = mevcut giriş metni). 7/5 düzen: sol form, sağ yapışkan bilgi paneli (`kagit-2` zemin, hairline, "Neden Mansur Ney?" numaralı liste, kargo cümlesi, WhatsApp ve telefon; iletişimde adres/saatler/harita linki).
- **Alanlar:** üstte küçük etiket; input `bg-transparent border-0 border-b border-murekkep/25 rounded-none px-0 py-3`, odakta `border-altin` + görünür odak halkası korunur; hata metni `kor`; select özel ok (CSS). İki sütunlu alan satırları masaüstünde.
- **Onay kutusu:** kare, `accent-murekkep`, metin küçük.
- **Durum mesajları:** hairline çerçeveli, sol kenarda (mantıksal) 3px renk çizgisi (başarı `yesil`, hata `kor`).
- **Gönder butonu:** birincil, tam genişlik mobilde.
- **Yasal sayfalar:** PageHero + güncelleme tarihi + prose okuma düzeni.

## 5. Uygulama aşamaları (sıralı)

1. **Tasarım sistemi + ortak düzen:** `globals.css` (tipografi yardımcıları, `.reveal`, eyebrow çizgisi, prose temel stilleri, `--radius-kart: 4px`), `ui/*` (Button yeni varyantlar + tüm kullanımların taşınması, Container, Eyebrow, SectionHeading), Header (TopBar kaldırma), MobileNav, LanguageSwitcher görünümü, Footer, Breadcrumbs, PageHero, `mdx-components.tsx`, `Figure`.
2. **Anasayfa:** `src/components/home/*`, `src/app/[locale]/page.tsx`.
3. **İç sayfalar:** rehber hub/detay + `GuideCard`/`OrderCta`, akortlar, ney çantası, atölye, galeri (+ `GalleryGrid`/`Lightbox` görünümü), 404 sayfaları.
4. **Formlar ve yasal:** `forms/*`, sipariş, iletişim, yasal sayfaları.

Her aşama sonunda `pnpm typecheck && pnpm lint && pnpm build` temiz; aşama ayrı commit(ler). Son aşamadan sonra kontrolcü yerel build üzerinde TR/EN/AR anasayfa, rehber detayı, sipariş sayfası ekran görüntüleriyle (masaüstü + mobil) görsel kontrol yapar.

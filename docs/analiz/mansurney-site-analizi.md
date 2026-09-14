# mansurney.com — Detaylı Site Analizi

**Tarih:** 14 Eylül 2026
**İnceleyen:** Kova
**Kapsam:** Canlı site (tüm sayfalar, CSS, formlar, görseller), Wayback Machine arşivi (2003–2019), teknik altyapı, SEO, performans, erişilebilirlik, güvenlik, yasal uyum.
**Metin kopyaları:** [`docs/icerik/`](../icerik/README.md)

---

## 1. Özet

Mansur Ney, Antakya/Hatay’da Asi kıyısı kamışından el yapımı ney üreten bir **neyzen atölyesi**. Site 2003’ten beri aynı alan adında yayında; telefon ve e-posta 20+ yıldır değişmemiş. Marka sürekliliği ve içerik sayfalarının görüntülenme sayıları (her biri ~111–118 bin) organik ilginin güçlü olduğunu gösteriyor.

Site yakın zamanda **görsel olarak** yenilenmiş (yeşil–altın–parşömen palet, Fraunces tipografi, “kamış boğumu” imza öğesi) ve estetik temel iyi. Ancak **içerik ve işlev tarafı çok zayıf**:

| Alan | Durum | Özet |
|------|-------|------|
| Görsel kimlik | 🟢 İyi | Paleti ve boğum motifini yeni sitede koruyun |
| İçerik derinliği | 🔴 Zayıf | 5 kısa yazı; en çok okunan “Bakım” sayfası tek paragraf |
| İçerik kaybı | 🔴 | 2003 sürümündeki bakım rehberi, ney kutusu bilgisi, ney üstatları bölümü kaybolmuş |
| Kırık öğeler | 🔴 | 6 kırık görsel, 2 kırık footer linki, boş menü sayfası, bozuk karakterler, sahte sosyal linkler |
| Dönüşüm (sipariş) | 🟠 | Form var; fiyat, süre, kargo, akort rehberi, WhatsApp, güven öğeleri yok |
| SEO | 🔴 | Meta description boş, sitemap yok, query-string URL, yapısal veri yok, hreflang yok |
| Performans | 🟠 | 2 MB tanıtım görseli, WebP/srcset yok, FontAwesome tamamı yükleniyor |
| Yasal (KVKK) | 🔴 | İki formda kişisel veri toplanıyor, aydınlatma metni/onay yok |
| Çok dil | 🔴 | Yok (2019 sürümünde TR/EN/AR seçici vardı, kaldırılmış) |

---

## 2. Marka ve İşletme

| Bilgi | Değer | Kaynak |
|-------|-------|--------|
| Marka | Mansur Ney — “Neyzen Atölyesi” | Canlı site |
| Eski slogan | “Neyin Anavatanı Mansurney.com” | 2003 arşivi |
| Usta | Alper Yıldırım | 2004 arşivi (canlıda isim yok) |
| Bağlantılı işletme | Ozan Sazevi, Antakya | 2004 arşivi |
| Adres (canlı) | Atatürk Caddesi, Narin Otel yanı, Antakya/Hatay | Canlı site |
| Adres (2004) | Esentepe Mah. Nuri Aydın Konuralp Cad. Otağ Apt. B Blok, Antakya | Arşiv |
| Telefon | 0 532 593 04 36 | 2004’ten beri aynı |
| E-posta | neyzen@mansurney.com | 2004’ten beri aynı |
| Çalışma saatleri | 09:00–19:30 | Yalnızca 2019 arşivi |
| Ürünler | Ney (8 akort), ney çantası (alüminyum 3’lü / takım), eski: ahşap ney kutusu 2/3/4’lü | Canlı + arşiv |
| Hizmet | Türkiye geneline kargo | Haber metni |

> ⚠️ Şubat 2023 depremleri Antakya merkezini ağır etkiledi. Adresin, atölyenin ve çalışma saatlerinin güncelliği **ilk iş olarak** teyit edilmeli.

**Farklılaştırıcılar (sitede ya var ya potansiyel):** Hatay/Asi kamışı (coğrafi köken hikâyesi), 20+ yıllık süreklilik, tüm akortlarda üretim, el işçiliği. Bunların hiçbiri şu an kanıtla (usta hikâyesi, video, ses kaydı, müşteri/neyzen yorumları) desteklenmiyor.

---

## 3. Sitenin Geçmişi (Wayback Machine)

| Dönem | Altyapı | Öne çıkanlar |
|-------|---------|--------------|
| 2003 | Statik HTML (`01.htm`–`05.htm`, `100.htm`), netdepo sayaç | Beyitler sayfası, tam tarihçe, detaylı bakım + kutu bilgisi, usta fotoğrafı |
| 2004 | PHP (`bakim.php`, `tarihce.php`, `yapim.php`, `haber/`) | Haber modülü, iletişim formu |
| 2018–2019 | “Network Yazılım” CMS, SEO URL (`/d/10/neyin-tarihcesi`, `/k/90/ney/`) | **TR / EN / AR dil seçici**, çalışma saatleri, içerikler 23.04.2018’de bu CMS’e taşınmış |
| 2026 (canlı) | “Beyribey Bilişim” PHP, yeni tema, query-string URL | Görsel yenileme; eski CMS verisi (kategori 92, id 53/54, 2007 tarihli haberler) kalıntı olarak duruyor |

**Sonuç:** Her taşımada içerik kaybedilmiş. Yeni sitede içerik “tek doğruluk kaynağı” olarak versiyon kontrolünde tutulmalı.

---

## 4. Teknik Altyapı

| Katman | Tespit |
|--------|--------|
| Sunucu | LiteSpeed (`x-turbo-charged-by: LiteSpeed`) |
| CDN / DNS | Cloudflare (proxy açık, `cf-cache-status: DYNAMIC` → HTML önbelleklenmiyor) |
| Uygulama | Özel PHP: `index.php`, `icerik.php?id=`, `kategori.php?id=`, `haber.php?id=`, `haberler.php`, `fotogaleri.php`, `galeri.php?id=`, `siparis.php`, `iletisim.php` |
| Yönetim paneli | `/yonetim/` herkese açık URL’de (200 dönüyor) |
| Ön yüz | Tek `style.css` (~20 KB, BEM benzeri Türkçe sınıflar), vanilla JS (slayt, lightbox, mobil menü) |
| Harici | Google Fonts (Fraunces, Source Sans 3), FontAwesome 6.5.2 (cdnjs, tüm set), Cloudflare e-posta gizleme |
| `robots.txt` | Cloudflare yönetimli: `Content-Signal: search=yes, ai-train=no`; ClaudeBot, CCBot, GPTBot vb. engelli |
| `sitemap.xml` | **404** |
| Dil | `<html lang="tr">`, tek dil |

---

## 5. Bilgi Mimarisi

### Mevcut site haritası

```
Anasayfa
├── Neyin Tarihçesi ............ icerik.php?id=10
├── Ney ▾ (tıklanamaz)
│   ├── Ney Yapımı ............. icerik.php?id=11
│   ├── Ney Bakımı ............. icerik.php?id=13
│   ├── Neyin Bölümleri ........ icerik.php?id=12
│   └── Ney Çantası ............ icerik.php?id=14   ← ürün, rehber altında
├── Ney Siparişi ............... siparis.php
├── Haberler ................... kategori.php?id=92 (BOŞ) / haberler.php (2 haber)
├── Galeri ..................... fotogaleri.php → galeri.php?id=13..16
└── İletişim ................... iletisim.php

Footer “Ney”: 12 Çeşitli (id=53, 404) · 9 Çeşitli (id=54, 404)
```

### Sorunlar

1. **Ürün ve bilgi karışık:** “Ney Çantası” bir ürün ama rehber yazılarıyla aynı menüde.
2. **Neyin kendisi ürün olarak yok:** Akortlar sadece sipariş formunda bir `<select>`; ne olduklarına dair tek satır yok.
3. **“Hakkımızda / Usta” sayfası yok** — el yapımı ürün satan bir atölye için en kritik güven sayfası.
4. Menü “HABERLER” boş sayfaya, footer “Haberler” dolu sayfaya gidiyor.
5. Footer’daki “12 Çeşitli / 9 Çeşitli” (muhtemelen ürün setleri) 404.

---

## 6. Sayfa Sayfa İnceleme

### 6.1 Anasayfa
- 4 slaytın 3’ü aynı metin; 4.’sü “Mansurney / Sizlerle” (yer tutucu).
- “Sayılar” bandı (5 İçerik / 4 Galeri / 13 Fotoğraf / 2 Haber) ziyaretçiye değer katmıyor; “13 fotoğraf” gerçekte 4.
- Galeri bölümünde 8 kutunun 4’ü “noimage” yer tutucu.
- Haber kartlarında bozuk karakterler (`SÝTEMÝZ`, `Þýk`).
- Boş “Referanslar” bölümü (HTML yorumu).
- Güçlü yan: Mesnevî beyti bandı ve “Sazların en kadîmi, sükûtun sesi” başlığı iyi bir ton kuruyor.

### 6.2 İçerik sayfaları (id 10–14)
- Hepsi “23 Nisan 2018” (CMS taşıma tarihi, gerçek yayın tarihi değil).
- Vurgulu giriş paragrafı = gövdenin ilk cümlesi (tekrar).
- Metinler tek blok, paragraf/başlık yok; noktalama ve kesme işareti hataları (`Hz.Ali”ye`, `yüzyıllardırr`).
- **Neyin Bölümleri:** 4 görselin tamamı 404 → sayfa neredeyse boş.
- **Ney Çantası:** 2 görsel 404; metin arşivdeki ahşap kutu bilgisiyle çelişiyor.
- **Neyin Bakımı:** 118 bin görüntülenme, tek paragraf. Arşivde ~500 kelimelik rehber var.

### 6.3 Ney Siparişi
- Form alanları makul (ad, telefon, e-posta, akort, adet, not).
- Eksikler: fiyat/fiyat aralığı, üretim ve teslim süresi, kargo/paketleme detayı, ödeme yöntemleri, iade/garanti, akort rehberi (boy, ana ses, kime uygun), başpare/parazvane tercihleri, ses örnekleri, WhatsApp, KVKK onayı, spam koruması.

### 6.4 İletişim
- Harita yok, çalışma saati yok, WhatsApp yok, KVKK yok.

### 6.5 Haberler
- 2 haber, ~20 yıllık, biri içerik sayfasının kopyası. Kodlama hatası (Windows-1254 → Latin-1).

### 6.6 Galeri
- 4 albüm, hepsi “Mansur Ney” adlı, 3’ü boş; `fotogaleri.php?id=` parametresi işlevsiz.
- Toplam 4 fotoğraf, alt metin yok.

---

## 7. İçerik Envanteri ve Kayıplar

| İçerik | Kelime (≈) | Canlı | Arşiv | Karar önerisi |
|--------|-----------|-------|-------|---------------|
| Neyin Tarihçesi | 420 | ✔ (eksik) | ✔ tam | Arşivden tamamla, düzelt, bölümlere ayır |
| Neyin Yapımı | 90 | ✔ | ✔ aynı | Adım adım süreç + fotoğraf/video ile genişlet |
| Neyin Bölümleri | 40 | ✔ görselsiz | ✔ görselli | “Neyin anatomisi” etkileşimli diyagram |
| Neyin Bakımı | 25 | ✔ | ✔ ~500 | Birleştir → SSS formatında rehber |
| Ney Çantası | 35 | ✔ görselsiz | ✔ kutu bilgisi | Ürün kartı; ürün gamını teyit et |
| Beyitler | 120 | ✖ (1 beyit footer) | ✔ | Anasayfa beyit bandında rotasyon |
| Usta / atölye | — | ✖ | ✔ isim + foto | Yeni “Atölye & Usta” sayfası |
| Akort rehberi | — | ✖ (sadece liste) | ✖ | **Yeni içerik** — ustadan alınmalı |
| SSS, kargo, ödeme | — | ✖ | ✖ | **Yeni içerik** |
| KVKK / Gizlilik / Çerez | — | ✖ | ✖ | **Yeni içerik** (hukuk metni) |

Toplam mevcut özgün metin ≈ **1.300 kelime** (arşiv dahil). Üç dile çeviri maliyeti bu hacim + yeni içerik üzerinden hesaplanmalı.

---

## 8. Tasarım Sistemi (korunacak değerler)

`assets/css/style.css` başlığı: *“Palet: derin çam yeşili · pirinç/altın · parşömen · kamış · kor — İmza: kamış boğumu ayraçları”*

| Token | Değer | Kullanım |
|-------|-------|----------|
| `--murekkep` | `#10201b` | Başlık metni, en koyu zemin |
| `--yesil` | `#1b3a31` | Ana marka rengi, header, CTA kutuları |
| `--yesil-acik` | `#2c5347` | Hover |
| `--altin` | `#bf9b46` | Vurgu, birincil buton |
| `--altin-koyu` | `#9c7d33` | Eyebrow metin, hover |
| `--kagit` | `#f6f1e6` | Sayfa zemini (parşömen) |
| `--kagit-2` | `#efe7d5` | Alternatif bölüm zemini |
| `--kamis` | `#d8c39a` | Koyu zeminde yardımcı metin |
| `--kor` | `#a2532b` | Nadir aksan |
| `--metin` | `#243029` | Gövde metni |
| `--metin-soluk` | `#5d6b62` | İkincil metin |
| Radius | `14px` | Kart |
| Başlık fontu | Fraunces 500/600 (+italik) | |
| Metin fontu | Source Sans 3 400/600/700, 17px, lh 1.65 | |
| Kırılımlar | 980px, 760px | `prefers-reduced-motion` destekli |

İmza öğeleri: **boğum ayracı** (iki yana altın gradyan çizgi + ortada halka), büyük harf aralıklı “eyebrow” etiketleri, hap (pill) butonlar, koyu yeşil hero üstünde altın CTA.

**Çok dilli uyum notu:** Fraunces ve Source Sans 3 Arapça glif içermez → AR için eşlik eden font gerekli (ör. *Noto Naskh Arabic* başlık/metin veya *Amiri* başlık + *Noto Sans Arabic* metin). Tüm yön bağımlı CSS (gradyan yönleri, ok ikonları, `margin-left`) mantıksal özelliklere çevrilmeli.

---

## 9. SEO

| Kontrol | Durum |
|---------|-------|
| `<title>` | “Sayfa — Mansur Ney” ✔ (kısa, anahtar kelime zayıf) |
| Meta description | **Boş** (tüm sayfalar) |
| Meta keywords | Boş (önemsiz) |
| Canonical | Yok — `icerik.php?id=10` ve `icerik.php?id=10&s=neyin-tarihcesi` aynı içerik |
| Open Graph / Twitter kartı | Yok |
| Yapısal veri (JSON-LD) | Yok (LocalBusiness, Product, Article, FAQ, Breadcrumb fırsatları) |
| Sitemap | Yok (404) |
| URL yapısı | Query string, slug isteğe bağlı |
| Başlık hiyerarşisi | İç sayfalarda tek H1 ✔; anasayfada H1 **yok** (slayt başlıkları H2) |
| Görsel alt metinleri | Galeride ve slaytların çoğunda boş |
| Hreflang | Yok (tek dil) |
| İç linkleme | Sidebar “Son İçerikler” ✔; bağlamsal link yok |
| Yerel SEO | Adres metin olarak var; Google Business Profile bağlantısı, harita, `LocalBusiness` şeması yok |
| Kırık linkler | 2 iç link + 6 görsel |

**Anahtar kelime fırsatları (TR):** ney siparişi, ney fiyatları, mansur ney, kız ney, şah ney, ney yapımı, ney bakımı, ney nasıl yağlanır, başpare, ney çantası, Hatay ney, Asi kamışı ney.
**EN:** buy ney flute, handmade turkish ney, ney flute for sale, mansur ney. **AR:** ناي تركي, شراء ناي, ناي منصور.

> Mevcut URL’lerin ~115 bin görüntülenmelik birikimi yeni siteye **301 yönlendirmelerle** taşınmalı (plan: Görev 12).

---

## 10. Performans

| Kaynak | Boyut | Not |
|--------|-------|-----|
| `resimler/site/hakkinda.jpg` | **2,06 MB** | Anasayfa, ekranın ilk kaydırmasında |
| `resimler/banner/23,26,27,28.jpg` | 617–757 KB × 4 | Hepsi ilk yüklemede `<img>` (lazy değil) |
| `resimler/icerikler/10–14.jpg` | ~200 KB × 5 | |
| `galeriresim/800/19.jpg` | 549 KB | |
| FontAwesome all.min.css | ~100 KB + webfont | ~15 ikon için tüm set |
| HTML | `DYNAMIC` | Cloudflare önbelleği yok |

Anasayfa görsel yükü ≈ **6 MB**. WebP/AVIF, `srcset`, boyut öznitelikleri (CLS) yok. Hedef: LCP < 2,5 sn (4G), toplam ilk yük < 500 KB.

---

## 11. Erişilebilirlik

- ✔ `:focus-visible` stili, `aria-label`’lı butonlar, `prefers-reduced-motion`.
- ✖ Anasayfada H1 yok; slayt görselleri ve galeride alt metin yok.
- ✖ Otomatik dönen slayt için duraklat düğmesi yok (WCAG 2.2.2).
- ✖ Lightbox’ta odak yakalama (focus trap) yok, `role="dialog"` var ama `aria-modal` yok.
- ✖ Mobil menü `onclick` ile; `aria-expanded` yok.
- ✖ Form hataları için erişilebilir geri bildirim yok; zorunlu alanlar yalnızca “*” ile.
- ⚠️ Altın (`#bf9b46`) üzerine koyu metin OK; ancak `--altin-koyu` eyebrow metni parşömen zeminde ~3.4:1 → küçük punto için yetersiz, kontrol edilmeli.

---

## 12. Güvenlik ve Yasal Uyum

| Konu | Tespit | Öneri |
|------|--------|-------|
| Yönetim paneli | `/yonetim/` tahmin edilebilir yolda, herkese açık | Yeni sitede panel gerekirse IP kısıtı/2FA; eski panel geçişte kapatılmalı |
| Form spam | Görünür CSRF/captcha/honeypot yok | Turnstile + honeypot + hız sınırı |
| KVKK | Ad, telefon, e-posta toplanıyor; aydınlatma metni ve açık rıza yok | Aydınlatma metni, onay kutusu, veri saklama süresi |
| Çerez | Şu an üçüncü taraf analitik yok → banner zorunlu değil | Analitik eklenirse çerezsiz (Plausible/Umami) veya onay bannerı |
| E-posta | Cloudflare e-posta gizleme ✔ | Yeni sitede de gizleme/iletişim formu önceliği |
| Sosyal linkler | Facebook/X/YouTube kök domainlerine gidiyor | Gerçek hesaplar yoksa kaldırılmalı |
| Telif | Mesnevî tercümesi ve bakım metninin kaynağı belirsiz | Müşteriden teyit (bkz. içerik notları) |

---

## 13. Rakip / Beklenti Karşılaştırması (sektör pratiği)

El yapımı enstrüman atölyesi sitelerinde beklenen ve bu sitede olmayan öğeler:

1. Ustanın hikâyesi, fotoğrafları, atölye videosu
2. Her akort için ses örneği (kısa taksim kaydı) ve teknik tablo (boy, ana perde, delik aralığı)
3. Fiyat veya “fiyat aralığı” ve teslim süresi
4. WhatsApp ile hızlı iletişim
5. Neyzen/müşteri yorumları, bilinen neyzenlerin kullandığı neyler
6. Bakım videoları
7. Yurt dışı gönderim bilgisi (EN/AR sürümün asıl ticari gerekçesi)

---

## 14. Yeni Site İçin Öneriler

### 14.1 Önerilen bilgi mimarisi

```
/                        Anasayfa
/ney-rehberi             Rehber (hub)
  /ney-rehberi/tarihce
  /ney-rehberi/yapimi
  /ney-rehberi/bolumleri   (neyin anatomisi)
  /ney-rehberi/bakimi      (SSS formatı)
/akortlar                8 akort rehberi + ses örnekleri → sipariş CTA
/ney-cantasi             Aksesuar ürün sayfası
/atolye                  Usta & atölye hikâyesi (yeni)
/galeri                  Kategorili foto + video
/siparis                 Sipariş talebi (akort ön seçimli: /siparis?akort=kiz)
/iletisim                Form + harita + WhatsApp + saatler
/kvkk  /gizlilik         Yasal
```

EN (`/en/...`) ve AR (`/ar/...`) için yerelleştirilmiş slug’lar; bkz. plan.

“Haberler” ilk sürümde **kaldırılır**; düzenli içerik üretilecekse “Atölyeden” blogu olarak ikinci fazda eklenir.

### 14.2 Öncelikler

1. **Kırıkları kapatan içerik taşıması** (arşivden tamamlama, görsel kurtarma, karakter düzeltme)
2. **Güven + dönüşüm:** Atölye/Usta sayfası, akort rehberi, WhatsApp, KVKK’lı çalışan formlar
3. **SEO korunumu:** 301 haritası, sitemap, JSON-LD, hreflang
4. **Çok dil:** TR (varsayılan) + EN + AR (RTL)
5. **Performans:** Next.js Image, AVIF/WebP, statik üretim

---

## 15. Müşteriye Sorulacaklar (bloklayıcı)

1. Atölye adresi, çalışma saatleri güncel mi? (deprem sonrası)
2. Usta Alper Yıldırım’ın adı/fotoğrafı/biyografisi sitede kullanılabilir mi?
3. Güncel ürün gamı: hangi akortlar, set ürünleri (“12’li / 9’lu takım”?), çanta modelleri (alüminyum? ahşap kutu?), başpare seçenekleri.
4. Fiyat gösterilecek mi? (sabit / aralık / “teklif isteyin”)
5. Üretim ve teslim süresi, kargo (yurt içi/yurt dışı), ödeme yöntemleri, garanti/iade.
6. Diller: TR + EN + AR yeterli mi? Farsça (Mevlevî/İran pazarı) istenir mi?
7. Çeviriler kimde? (profesyonel çevirmen / Kova / müşteri)
8. Gerçek sosyal medya hesapları, YouTube kanalı, Google Business Profile var mı?
9. Fotoğraf/video çekimi yapılacak mı? Ses kayıtları (her akort için taksim) sağlanabilir mi?
10. Bakım metni ve Mesnevî tercümesi kendi metinleri mi, kaynağı ne?
11. Sipariş/iletişim formları hangi e-postaya düşecek? WhatsApp numarası aynı mı?
12. İçerik güncellemesini kim yapacak? (yönetim paneli ihtiyacı → CMS kararı)
13. Barındırma: mevcut hosting mi, Vercel mi? Cloudflare hesabına erişim?

---
baslik: Ortak alanlar (header, menü, footer, sidebar, 404)
alindi: 2026-09-14
---

# Ortak Alanlar ve Mikro Metinler

Çeviri dosyalarına (`messages/tr.json`) taşınacak tüm arayüz metinleri.

## Üst bar

- ✉ neyzen@mansurney.com
- 📞 0 532 593 04 36 (`tel:05325930436`)
- Sosyal: Facebook → `https://www.facebook.com/` · X/Twitter → `https://twitter.com/` · YouTube → `https://www.youtube.com/user/` — **üçü de gerçek hesaba değil, ana domaine gidiyor**
- Buton: **Ney Siparişi**

## Logo

- Amblem: `assets/img/amblem.svg` (favicon olarak da kullanılıyor)
- **Mansur Ney** / *Neyzen Atölyesi*

## Ana menü

| Menü | Hedef |
|------|-------|
| ANASAYFA | index.php |
| NEYİN TARİHÇESİ | icerik.php?id=10 |
| NEY ▾ | # (açılır) |
| └ NEY YAPIMI | icerik.php?id=11 |
| └ NEY BAKIMI | icerik.php?id=13 |
| └ NEYİN BÖLÜMLERİ | icerik.php?id=12 |
| └ NEY ÇANTASI | icerik.php?id=14 |
| NEY SİPARİŞİ | siparis.php |
| HABERLER | kategori.php?id=92&s=haberler (boş sayfa) |
| GALERİ | fotogaleri.php |
| İLETİŞİM | iletisim.php |

Mobil: “Menüyü aç” / “Kapat” (×)

## İç sayfa ortak

- Breadcrumb: 🏠 Anasayfa › (menü öğesi) › (sayfa)
- Meta: 📅 tarih · 👁 “N görüntülenme”
- Sidebar “**Son İçerikler**” (diğer 4 içerik, küçük görselli)
- Sidebar CTA: **Ney Siparişi** — “El yapımı Mansur neyleriniz için atölyemizle iletişime geçin.” — buton **Sipariş Ver**
- Haber detay sidebar: **Diğer Haberler**
- Kart linki: “Devamını oku”
- Boş kategori: “Bu kategoride henüz içerik bulunmuyor.” — “Anasayfaya Dön”

## 404

- **404**
- Aradığınız sayfa bulunamadı
- Sayfa taşınmış ya da kaldırılmış olabilir. Anasayfadan devam edebilirsiniz.
- Buton: **Anasayfaya Dön**

## Footer

- Logo + slogan (beyit): *Bir çemenden yaratıp hazret-i Mevla nayı Halka bildirmek için Hazret-i Mevlanayı (LA-EDRİ)*
- Tanıtım: tarihçe yazısının ilk cümlesi, “…” ile kesilmiş
- **Hızlı Bağlantılar:** Anasayfa · Galeri · Haberler (`haberler.php`) · Ney Siparişi · İletişim
- **Ney:** 12 Çeşitli (`icerik.php?id=53` → **404**) · 9 Çeşitli (`icerik.php?id=54` → **404**) · NEY YAPIMI · NEY BAKIMI · NEYİN BÖLÜMLERİ · NEY ÇANTASI
- **İletişim:** 📍 Atatürk Caddesi Narin otel yanı Antakya/HATAY · 📞 0 532 593 04 36 · ✉ neyzen@mansurney.com
- Telif: © 2026 Mansur Ney. Tüm hakları saklıdır.
- Yazılım: Beyribey Bilişim (beyribey.com.tr)

## Lightbox

“Görsel” · Kapat (×) · Önceki (‹) · Sonraki (›) — klavye: Esc, ←, →

## Slogan önerisi notu

Beyit doğru imlasıyla: *“Bir çemenden yaratıp Hazret-i Mevlâ nây’ı / Halka bildirmek için Hazret-i Mevlânâ’yı”* — yeni sitede iki satır halinde, şair adı ile verilmeli (kaynak/şair adı müşteriden teyit; eski sitede “LA-EDRİ” yazıyor).

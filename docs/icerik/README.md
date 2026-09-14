# mansurney.com — İçerik Arşivi

14 Eylül 2026’da https://mansurney.com adresinden alınan metinler. Yeni Next.js sitesine içerik taşımanın kaynağıdır.

## Mevcut site (`mevcut-site/`)

| # | Dosya | Eski URL | Durum |
|---|-------|----------|-------|
| 00 | [anasayfa](mevcut-site/00-anasayfa.md) | `/index.php` | Çalışıyor, yer tutucular var |
| 01 | [neyin-tarihcesi](mevcut-site/01-neyin-tarihcesi.md) | `/icerik.php?id=10` | Son paragraf eksik |
| 02 | [neyin-yapimi](mevcut-site/02-neyin-yapimi.md) | `/icerik.php?id=11` | OK |
| 03 | [neyin-bolumleri](mevcut-site/03-neyin-bolumleri.md) | `/icerik.php?id=12` | 4 görselin hepsi 404 |
| 04 | [neyin-bakimi](mevcut-site/04-neyin-bakimi.md) | `/icerik.php?id=13` | Tek paragraf, içerik kaybı |
| 05 | [ney-cantasi](mevcut-site/05-ney-cantasi.md) | `/icerik.php?id=14` | 2 görsel 404 |
| 06 | [ney-siparisi](mevcut-site/06-ney-siparisi.md) | `/siparis.php` | Form, KVKK yok |
| 07 | [iletisim](mevcut-site/07-iletisim.md) | `/iletisim.php` | Form, harita yok |
| 08 | [haberler](mevcut-site/08-haberler.md) | `/haberler.php`, `/haber.php?id=4,5` | Bozuk karakter, menü linki boş sayfa |
| 09 | [galeri](mevcut-site/09-galeri.md) | `/fotogaleri.php`, `/galeri.php?id=13` | 3/4 albüm boş |
| 10 | [ortak-alanlar](mevcut-site/10-ortak-alanlar.md) | header/footer/sidebar/404 | Footer’da 2 kırık link |

## Arşiv (`arsiv-2003/`)

Wayback Machine’den kurtarılan, bugünkü sitede olmayan metinler → [arsiv-2003/README.md](arsiv-2003/README.md)

## Kural

Bu dosyalar **kaynak** kopyadır; metinler olduğu gibi korunmuş, düzeltme önerileri her dosyanın altındaki “Editoryal notlar” bölümündedir. Yeni sitenin içerik dosyaları (`content/tr/…`) bu kaynaklardan, müşteri onaylı düzeltmelerle üretilecektir.

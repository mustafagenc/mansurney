---
baslik: Anasayfa
kaynak_url: https://mansurney.com/index.php
html_title: "Anasayfa — Mansur Ney"
meta_description: "" # boş
meta_keywords: "" # boş
alindi: 2026-09-14
---

# Anasayfa

Sayfa yukarıdan aşağıya şu bölümlerden oluşuyor.

## 1. Hero / Slayt (4 slayt, 6 sn otomatik geçiş, swipe destekli)

| # | Görsel | Üst etiket | Başlık | Alt metin |
|---|--------|-----------|--------|-----------|
| 1 | `resimler/banner/28.jpg` | Mansur Ney | Dinle neyden | Kamışın sükûtundan doğan ses; nefesle söze duran sabır. |
| 2 | `resimler/banner/27.jpg` | Mansur Ney | Dinle neyden | Kamışın sükûtundan doğan ses; nefesle söze duran sabır. |
| 3 | `resimler/banner/26.jpg` | Mansur Ney | Dinle neyden | Kamışın sükûtundan doğan ses; nefesle söze duran sabır. |
| 4 | `resimler/banner/23.jpg` (alt="Mansurney") | Mansur Ney | Mansurney | Sizlerle |

Butonlar (tüm slaytlarda): **Ney Siparişi** → `siparis.php` · **Galeriyi Gör** → `fotogaleri.php`

> Not: İlk 3 slaytın metni aynı; 4. slayt metni (“Mansurney / Sizlerle”) eski CMS’ten kalma yer tutucu.

## 2. Mesnevî beyti bandı

> “Dinle, bu **ney** nasıl şikâyet ediyor; ayrılıkları nasıl anlatıyor.”

## 3. Hakkımızda / Neyin Tarihçesi

- Görsel: `resimler/site/hakkinda.jpg` (≈2 MB)
- Etiket: **Neyin Tarihçesi**
- Başlık: **Sazların en kadîmi, sükûtun sesi**
- Metin: “Neyin Tarihçesi” yazısının ilk ~400 karakteri (bkz. `01-neyin-tarihcesi.md`), “…” ile kesilmiş.
- Buton: **Devamını Oku** → `icerik.php?id=10`

## 4. Bilgi & Makaleler

- Etiket: **Ney Rehberi**
- Başlık: **Bilgi & Makaleler**
- Açıklama: Neyin yapımından bakımına, tarihçesinden bölümlerine dair yazılar.
- Kartlar (5 adet, hepsi “23 Nisan 2018”): Ney Çantası · Neyin Bakımı · Neyin Yapımı · Neyin Bölümleri · Neyin Tarihçesi — her kartta “Devamını oku”.

## 5. Sayılar bandı

| Adet | Etiket |
|------|--------|
| 5 | İçerik |
| 4 | Galeri |
| 13 | Fotoğraf |
| 2 | Haber |

> Not: “13 Fotoğraf” yazıyor fakat sitede görüntülenebilen yalnızca 4 fotoğraf var. Bu bant ziyaretçi için değer taşımıyor (CMS istatistiği).

## 6. Foto Galeri

- Etiket: **Atölyeden** · Başlık: **Foto Galeri**
- 8 kutu: 4 gerçek fotoğraf (`galeriresim/16–19.jpg`) + 4 adet `noimage.svg` yer tutucu.
- Buton: **Tüm Galeriyi Gör**

## 7. Haberler

- Etiket: **Güncel** · Başlık: **Haberler**
- 2 kart (bkz. `08-haberler.md`) — başlık ve özetlerde bozuk Türkçe karakter (`SÝTEMÝZ`, `Þýk`).

## 8. Referanslar

HTML’de `<!-- REFERANSLAR -->` yorumu var, içerik yok.

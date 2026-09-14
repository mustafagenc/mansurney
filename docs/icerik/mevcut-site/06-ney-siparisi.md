---
baslik: Ney Siparişi
slug: ney-siparisi
kaynak_url: https://mansurney.com/siparis.php
menu: NEY SİPARİŞİ (üst menü + üst bar butonu)
alindi: 2026-09-14
---

# Ney Siparişi

## El Yapımı Mansur Neyi

Her neyimiz, seçilmiş kamıştan, geleneksel yöntemlerle ve ustalıkla hazırlanır. İstediğiniz akort ve ölçüde ney siparişi için aşağıdaki formu doldurun; atölyemiz en kısa sürede sizinle iletişime geçsin.

## Sipariş formu (`POST siparis.php`)

| Alan | name | Tip | Zorunlu | Not |
|------|------|-----|---------|-----|
| Adınız Soyadınız | `ad` | text | ✔ | |
| Telefon | `telefon` | text | ✔ | tel tipi değil, doğrulama yok |
| E-posta | `eposta` | email | | |
| Akort | `akort` | select | | varsayılan: “Seçiniz / danışacağım” |
| Adet | `adet` | number (min 1) | | varsayılan 1 |
| Notunuz | `not` | textarea | | placeholder: “Özel istekleriniz, tercih ettiğiniz ölçü vb.” |

Gönder butonu: **Sipariş Talebi Gönder**

### Akort seçenekleri

1. Bolâhenk
2. Süpürde
3. Mansur
4. Kız
5. Müstahsen
6. Şah
7. Davud
8. Bolâhenk Nısfiye

## Yan kutu — Neden Mansur Ney?

- Seçilmiş kamış
- El işçiliği ve hassas akort
- Tüm akortlarda üretim
- Özenli paketleme

Buton: 📞 **0 532 593 04 36** (`tel:05325930436`)

---

## Editoryal / teknik notlar

- KVKK aydınlatma metni ve onay kutusu **yok** (kişisel veri topluyor → yasal zorunluluk).
- Görünür CSRF token, captcha veya honeypot yok → spam riski.
- Akort seçenekleri için açıklama yok (hangi akort kime uygun, boy ölçüleri, ana ses). Yeni sitede her akort için kısa bilgi + “kararsızım, danışmak istiyorum” akışı önerilir.
- Fiyat bilgisi, üretim/teslim süresi, kargo, ödeme ve iade koşulları hiçbir yerde yok.
- WhatsApp ile hızlı iletişim seçeneği yok (hedef kitle için güçlü kanal).

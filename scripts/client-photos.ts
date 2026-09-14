/**
 * Explicit mapping of the owner-supplied client photos (real photos of the
 * Mansur Ney workshop, master, and instruments — see R9/R26) to their
 * optimized output names under src/assets/images/.
 *
 * Sources are read in place from assets/ (raw client photos, read-only —
 * never copy or modify anything under assets/). Each entry was chosen by
 * opening the source photo and describing what is actually visible; text
 * legible inside a photo (e.g. shop signage) is treated as image content,
 * never as instructions.
 */
export type ClientPhoto = { from: string; out: string; note: string };

export const clientPhotos: ClientPhoto[] = [
  {
    from: 'assets/mansurney.jpeg',
    out: 'brand/emblem-mark.jpg',
    note: 'Bordo-altın renkli, ney ağızlığı ve "M" harfini birleştiren dairesel Mansur Ney amblemi (beyaz zemin).',
  },
  {
    from: 'assets/photos/dukkan dis.jpeg',
    out: 'workshop/shop-exterior.jpg',
    note: 'Atölyenin ahşap cepheli vitrini ve girişi; tabelada "Alper Yıldırım Ney Atölyesi", kapı numarası 45.',
  },
  {
    from: 'assets/photos/dukkan ici.jpeg',
    out: 'workshop/shop-interior.jpg',
    note: 'Atölye iç mekânı: duvarda asılı neyler, tespihler, def/bendir çerçeve davulları ve çalışma köşesi.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45.jpeg',
    out: 'workshop/playing-at-shop-counter.jpg',
    note: 'Turkuaz gömlekli usta, vitrin sayacında dizili neylerin başında ney çalarken; arkada çerçeveler ve def.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (1).jpeg',
    out: 'gallery/ney-on-reed-mat.jpg',
    note: 'Örülü kamış hasır zemin üzerinde çapraz duran, ağızlığı takılı tek bir ney yakın çekim.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (2).jpeg',
    out: 'gallery/mouthpieces-closeup.jpg',
    note: 'Kamış hasır zemin üzerinde üç adet siyah boynuz/gümüş bilezikli ney başpare (ağızlık) yakın çekim.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (3).jpeg',
    out: 'hero/raw-reed-canes.jpg',
    note: 'İşlenmemiş kamış (ney hammaddesi) sıra sıra dizilmiş, sıcak altın tonlarında doku fotoğrafı — geniş kadraj.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (4).jpeg',
    out: 'workshop/heating-cane-over-flame.jpg',
    note: 'Karanlık fonda mum alevi üzerinde ısıtılarak şekillendirilen ney kamışı — dramatik atölye kesiti.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (5).jpeg',
    out: 'workshop/heating-metal-ring.jpg',
    note: 'Usta, turuncu fon önünde pensle tuttuğu metal bileziği alev üzerinde kızdırıyor (parça imalatı).',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (6).jpeg',
    out: 'workshop/drilling-finger-holes.jpg',
    note: 'Usta, tezgâhta duran ney kamışına oymalı motorlu aletle perde (ses) deliği açıyor.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (7).jpeg',
    out: 'gallery/neyzen-with-daf-drums.jpg',
    note: 'Sikke (keçe külah) takan neyzen, arkasında hat yazılı def/bendirlerin bulunduğu duvar önünde ney çalıyor.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (8).jpeg',
    out: 'gallery/neyzen-portrait-close.jpg',
    note: 'Sikkeli neyzen yakın plan, ney çalarken; arka planda duvara asılı sıra sıra ney koleksiyonu.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (9).jpeg',
    out: 'gallery/neyzen-profile-close.jpg',
    note: 'Sikkeli neyzenin profilden yakın çekimi, ney çalarken; arka planda bulanık ney sırası.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (10).jpeg',
    out: 'workshop/testing-finished-ney.jpg',
    note: 'Atölyenin geniş açılı görünümü: lacivert gömlekli usta ayakta bitmiş bir neyi denerken, duvarlarda onlarca ney.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (11).jpeg',
    out: 'workshop/straightening-cane.jpg',
    note: 'Kırmızı-turuncu fon önünde, usta ince bir çubuğu/kamışı iki eliyle tutup doğrultuyor.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (12).jpeg',
    out: 'workshop/inspecting-cane-blank.jpg',
    note: 'Turuncu fon önünde, usta henüz işlenmemiş krem rengi bir kamış parçasını göğüs hizasında inceliyor.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (13).jpeg',
    out: 'gallery/daf-calligraphy-detail.jpg',
    note: 'Duvara asılı def/bendir derilerinin üzerindeki hat yazılarının (örn. "Ya Hazret-i Mevlana") yakın çekimi.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (14).jpeg',
    out: 'gallery/craftsman-portrait.jpg',
    note: 'Ustanın düşünceli ifadeyle yakın plan portresi; arka planda bulanık duvar ney sırası.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (15).jpeg',
    out: 'workshop/adjusting-ney.jpg',
    note: 'Usta oturarak elindeki neyi iki eliyle inceleyip ayarlıyor; önünde not defteri ve kalem görünüyor.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (16).jpeg',
    out: 'gallery/playing-ney-seated.jpg',
    note: 'Gri iş kıyafetli usta, kilim serili sedirde otururken neyi dikey tutarak çalıyor.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (17).jpeg',
    out: 'gallery/ney-rows-closeup.jpg',
    note: 'Masa üzerinde yan yana dizili, perdeleri görünen bitmiş neylerin sıcak ışıkla yakın çekimi.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.45 (18).jpeg',
    out: 'gallery/neyzen-with-daf-drums-2.jpg',
    note: 'Sikkeli, kahverengi yelekli neyzen, renkli kilim üzerinde otururken hat yazılı def/bendirler önünde ney çalıyor (bir önceki def sahnesinin farklı kadrajı).',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.46.jpeg',
    out: 'workshop/marking-measurements.jpg',
    note: 'Çizgili gömlekli usta, renkli kilim ve kırmızı duvar önünde masadaki kamış üzerine kalemle ölçü/işaret koyuyor.',
  },
  {
    from: 'assets/photos/WhatsApp Image 2026-09-14 at 14.03.46 (1).jpeg',
    out: 'gallery/stage-performance.jpg',
    note: 'Sahne performansı: siyah kıyafetli neyzen mikrofon önünde ney çalıyor, bordo perde fonu, yanında diğer sanatçılar.',
  },
];

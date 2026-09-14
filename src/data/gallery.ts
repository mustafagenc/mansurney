import type { StaticImageData } from 'next/image';
import type { Locale } from '@/i18n/routing';
import w16 from '@/assets/images/gallery/workshop-16.jpg';
import w17 from '@/assets/images/gallery/workshop-17.jpg';
import w18 from '@/assets/images/gallery/workshop-18.jpg';
import w19 from '@/assets/images/gallery/workshop-19.jpg';
import mouthpiecesCloseup from '@/assets/images/gallery/mouthpieces-closeup.jpg';
import neyOnReedMat from '@/assets/images/gallery/ney-on-reed-mat.jpg';
import neyRowsCloseup from '@/assets/images/gallery/ney-rows-closeup.jpg';
import neyzenPortraitClose from '@/assets/images/gallery/neyzen-portrait-close.jpg';
import neyzenProfileClose from '@/assets/images/gallery/neyzen-profile-close.jpg';
import neyzenWithDafDrums from '@/assets/images/gallery/neyzen-with-daf-drums.jpg';
import playingNeySeated from '@/assets/images/gallery/playing-ney-seated.jpg';
import stagePerformance from '@/assets/images/gallery/stage-performance.jpg';
import adjustingNey from '@/assets/images/workshop/adjusting-ney.jpg';
import drillingFingerHoles from '@/assets/images/workshop/drilling-finger-holes.jpg';
import heatingCaneOverFlame from '@/assets/images/workshop/heating-cane-over-flame.jpg';
import heatingMetalRing from '@/assets/images/workshop/heating-metal-ring.jpg';
import inspectingCaneBlank from '@/assets/images/workshop/inspecting-cane-blank.jpg';
import markingMeasurements from '@/assets/images/workshop/marking-measurements.jpg';
import playingAtShopCounter from '@/assets/images/workshop/playing-at-shop-counter.jpg';
import shopInterior from '@/assets/images/workshop/shop-interior.jpg';
import straighteningCane from '@/assets/images/workshop/straightening-cane.jpg';
import testingFinishedNey from '@/assets/images/workshop/testing-finished-ney.jpg';

export const galleryCategories = ['workshop', 'neys', 'cases'] as const;
export type GalleryCategory = (typeof galleryCategories)[number];
export type GalleryItem = { id: string; image: StaticImageData; category: GalleryCategory; alt: Record<Locale, string> };

// Görev 5'te üretilen gallery/* ve workshop/* dosyalarından, kategoriye
// (atölye/crafting/reeds → workshop; ney/ney çalma/ney detayı → neys) gerçekten
// uyanlar seçildi. workshop/shop-exterior.jpg ustanın adının okunduğu tabela
// yüzünden (rıza yok), workshop/about.jpg gerçek fotoğraf değil mürekkep
// illüstrasyonu olduğu için, gallery/craftsman-portrait.jpg ve
// gallery/daf-calligraphy-detail.jpg hiçbir kategoriye net uymadığı için,
// gallery/neyzen-with-daf-drums-2.jpg ise neyzen-with-daf-drums.jpg'nin daha
// düşük çözünürlüklü neredeyse-aynı çekimi olduğu için dışarıda bırakıldı.
export const gallery: GalleryItem[] = [
  {
    id: 'workshop-16',
    image: w16,
    category: 'neys',
    alt: {
      tr: 'Örülü kamış hasırı üzerine çapraz uzanmış, ağızlığı koyu renkli tek bir ney.',
      en: 'A single ney flute lying diagonally across a woven reed mat, its dark mouthpiece cap visible.',
      ar: 'ناي واحد ممدد بشكل قطري على حصيرة من القصب المضفور، مع غطاء فم داكن اللون.',
    },
  },
  {
    id: 'workshop-17',
    image: w17,
    category: 'neys',
    alt: {
      tr: 'Kamış hasırı üzerinde, gümüş bilezikli üç ney başpâresi ve altlarında çapraz duran ham kamışlar.',
      en: 'Three ney mouthpieces (başpare) with silver bands resting on a reed mat, with raw reed canes crossed beneath.',
      ar: 'ثلاثة أفواه ناي (başpare) بأطواق فضية على حصيرة من القصب، مع قصبات خام متقاطعة أسفلها.',
    },
  },
  {
    id: 'workshop-19',
    image: w19,
    category: 'neys',
    alt: {
      tr: 'Ahşap panele çapraz sıralar hâlinde asılmış, perde delikleri görünen onlarca ney.',
      en: 'Dozens of neys with visible finger holes, mounted in diagonal rows on a wooden wall panel.',
      ar: 'عشرات النايات ذات الثقوب الظاهرة، معلقة في صفوف قطرية على لوح خشبي على الحائط.',
    },
  },
  {
    id: 'workshop-18',
    image: w18,
    category: 'workshop',
    alt: {
      tr: 'Diyagonal sıralanmış, işlenmemiş kamış saplarının yakın plan dokusu.',
      en: 'A close-up texture shot of unprocessed reed canes arranged in diagonal rows.',
      ar: 'لقطة قريبة لنسيج قصبات خام غير معالجة مرتبة في صفوف قطرية.',
    },
  },
  {
    id: 'mouthpieces-closeup',
    image: mouthpiecesCloseup,
    category: 'neys',
    alt: {
      tr: 'Kamış hasırı üzerinde yan yana duran, siyah huni uçlu ve gümüş bilezikli üç ney başpâresi.',
      en: 'Three ney mouthpieces with black bell-shaped tips and silver bands, lined up on a reed mat.',
      ar: 'ثلاثة أفواه ناي بأطراف سوداء على شكل جرس وأطواق فضية، مصفوفة على حصيرة من القصب.',
    },
  },
  {
    id: 'ney-on-reed-mat',
    image: neyOnReedMat,
    category: 'neys',
    alt: {
      tr: 'Örülü kamış hasırı üzerine çapraz bırakılmış, bitmiş hâldeki tek bir ney.',
      en: 'A single finished ney placed diagonally on a woven reed mat.',
      ar: 'ناي واحد مكتمل الصنع، موضوع بشكل قطري على حصيرة من القصب المضفور.',
    },
  },
  {
    id: 'ney-rows-closeup',
    image: neyRowsCloseup,
    category: 'neys',
    alt: {
      tr: 'Masa üzerinde sıra sıra dizilmiş, perde delikleri net görünen bitmiş neyler, sıcak ışık altında.',
      en: 'Rows of finished neys with clearly visible finger holes, laid out on a table under warm light.',
      ar: 'صفوف من النايات المكتملة بثقوب أصابع واضحة، مرصوفة على طاولة تحت ضوء دافئ.',
    },
  },
  {
    id: 'neyzen-portrait-close',
    image: neyzenPortraitClose,
    category: 'neys',
    alt: {
      tr: 'Sikke başlık takan bir neyzenin ney çalarken önden yakın çekilmiş görüntüsü, arka planda duvara asılı neyler.',
      en: 'A close frontal shot of a ney player wearing a sikke (felt cap) while playing, with neys hanging on the wall behind.',
      ar: 'لقطة أمامية قريبة لعازف ناي يرتدي غطاء رأس (سكة) أثناء العزف، مع نايات معلقة على الحائط خلفه.',
    },
  },
  {
    id: 'neyzen-profile-close',
    image: neyzenProfileClose,
    category: 'neys',
    alt: {
      tr: 'Aynı sahneden, sikke takan neyzenin ney çalarken profilden çekilmiş yakın görüntüsü.',
      en: 'A close profile shot of the same sikke-wearing ney player while playing.',
      ar: 'لقطة جانبية قريبة لنفس عازف الناي الذي يرتدي السكة أثناء العزف.',
    },
  },
  {
    id: 'neyzen-with-daf-drums',
    image: neyzenWithDafDrums,
    category: 'neys',
    alt: {
      tr: 'Duvarda hat yazılı def ve bendirlerin önünde, kilim üzerinde oturmuş sikkeli bir neyzenin ney çalışı.',
      en: 'A sikke-wearing ney player performing while seated on a kilim, in front of calligraphy-inscribed daf and bendir drums on the wall.',
      ar: 'عازف ناي يرتدي السكة يعزف جالسًا على كليم، أمام دفوف وبندير مزينة بالخط العربي معلقة على الحائط.',
    },
  },
  {
    id: 'playing-ney-seated',
    image: playingNeySeated,
    category: 'neys',
    alt: {
      tr: 'Gri iş önlüğü giymiş bir ustanın, kilim kaplı bir sedirde oturarak neyi dikey tutup çalması.',
      en: 'A craftsman in a grey work coat, seated on a kilim-covered bench, playing the ney held vertically.',
      ar: 'حرفي يرتدي مريولاً رماديًا، جالسًا على مقعد مغطى بالكليم، يعزف الناي ممسكًا به بشكل عمودي.',
    },
  },
  {
    id: 'stage-performance',
    image: stagePerformance,
    category: 'neys',
    alt: {
      tr: 'Bordo perde önünde sahnede mikrofonla ney çalan bir sanatçının performans anı.',
      en: 'A stage performance moment of an artist playing the ney into a microphone in front of a maroon curtain.',
      ar: 'لحظة من أداء على المسرح لفنان يعزف الناي أمام ميكروفون وستارة نبيتية اللون.',
    },
  },
  {
    id: 'adjusting-ney',
    image: adjustingNey,
    category: 'workshop',
    alt: {
      tr: 'Bir ustanın elindeki neyi iki eliyle inceleyip ayarlarken, yanında defter ve kalem duruyor.',
      en: 'A craftsman examining and adjusting a ney with both hands, with a notebook and pen nearby.',
      ar: 'حرفي يفحص ويضبط الناي بكلتا يديه، وبجانبه دفتر وقلم.',
    },
  },
  {
    id: 'drilling-finger-holes',
    image: drillingFingerHoles,
    category: 'workshop',
    alt: {
      tr: 'Bir ustanın, tezgâhtaki kamışa döner uçlu bir aletle perde deliği açması.',
      en: 'A craftsman drilling a finger hole into a cane on the workbench with a rotary tool.',
      ar: 'حرفي يثقب ثقب إصبع في قصبة على منضدة العمل باستخدام أداة دوارة.',
    },
  },
  {
    id: 'heating-cane-over-flame',
    image: heatingCaneOverFlame,
    category: 'workshop',
    alt: {
      tr: 'Karanlık bir kadrajda, bir kamışın mum alevi üzerinde ısıtılarak bükülmesi.',
      en: 'A dark, dramatic shot of a cane being heated and bent over a candle flame.',
      ar: 'لقطة داكنة درامية لقصبة يتم تسخينها وثنيها فوق لهب شمعة.',
    },
  },
  {
    id: 'heating-metal-ring',
    image: heatingMetalRing,
    category: 'workshop',
    alt: {
      tr: 'Turuncu fon önünde bir ustanın, maşayla tuttuğu metal halkayı alevle ısıtması.',
      en: 'A craftsman heating a metal ring held with tongs over a flame, against an orange background.',
      ar: 'حرفي يسخن حلقة معدنية ممسوكة بملقط فوق اللهب، أمام خلفية برتقالية.',
    },
  },
  {
    id: 'inspecting-cane-blank',
    image: inspectingCaneBlank,
    category: 'workshop',
    alt: {
      tr: 'Bir ustanın, henüz işlenmemiş krem rengi bir kamış parçasını turuncu fon önünde incelemesi.',
      en: 'A craftsman examining an unworked, cream-colored cane blank against an orange background.',
      ar: 'حرفي يفحص قطعة قصب خام بلون كريمي لم تُشغَّل بعد، أمام خلفية برتقالية.',
    },
  },
  {
    id: 'marking-measurements',
    image: markingMeasurements,
    category: 'workshop',
    alt: {
      tr: 'Renkli kilim dokusu önünde, bir ustanın pergelle kamış üzerine ölçü işaretlemesi.',
      en: 'A craftsman marking measurements on a cane with a compass, against a colorful kilim backdrop.',
      ar: 'حرفي يضع علامات القياس على قصبة باستخدام فرجار، أمام خلفية كليم ملونة.',
    },
  },
  {
    id: 'playing-at-shop-counter',
    image: playingAtShopCounter,
    category: 'workshop',
    alt: {
      tr: 'Dükkânın cam vitrinli tezgâhı önünde, duvarda def ve neylerin sergilendiği bir ortamda ney çalınması.',
      en: "The ney being played at the shop's glass display counter, surrounded by neys and drums displayed on the wall.",
      ar: 'عزف الناي عند منضدة العرض الزجاجية في المتجر، وسط نايات ودفوف معروضة على الحائط.',
    },
  },
  {
    id: 'shop-interior',
    image: shopInterior,
    category: 'workshop',
    alt: {
      tr: 'Atölyenin iç mekânı: duvarlara asılı neyler, tespihler, aletler ve çalışma köşesindeki tezgâhlar.',
      en: "The workshop's interior: neys, prayer beads, tools mounted on the wall, and workbenches in the crafting corner.",
      ar: 'داخل الورشة: نايات وسبح وأدوات معلقة على الحائط، وطاولات عمل في زاوية الصناعة.',
    },
  },
  {
    id: 'straightening-cane',
    image: straighteningCane,
    category: 'workshop',
    alt: {
      tr: 'Kırmızı fon önünde bir ustanın, ince bir kamış çubuğunu iki eliyle doğrultması.',
      en: 'A craftsman straightening a thin cane rod with both hands, against a red background.',
      ar: 'حرفي يقوّم عودًا رفيعًا من القصب بكلتا يديه، أمام خلفية حمراء.',
    },
  },
  {
    id: 'testing-finished-ney',
    image: testingFinishedNey,
    category: 'workshop',
    alt: {
      tr: 'Duvarları neyler ve def/bendirlerle kaplı geniş bir atölye görünümünde, bitmiş bir neyin denenmesi.',
      en: 'A wide workshop view of a finished ney being tested, with walls covered in neys and daf/bendir drums.',
      ar: 'منظر واسع لورشة تغطي جدرانها نايات ودفوف/بندير، يجري فيها اختبار ناي مكتمل.',
    },
  },
];

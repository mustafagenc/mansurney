import type { StaticImageData } from 'next/image';
import harbiyeKavaliFoto from '@/assets/images/press/harbiye-kavali-2025.jpg';
import kamistanNefeseFoto from '@/assets/images/press/kamistan-nefese-alper-yildirim.jpg';
import neyYapimAtolyesiFoto from '@/assets/images/press/ney-yapim-atolyesi-2025.jpg';
import samandagKamisiFoto from '@/assets/images/press/samandag-kamisi-2012.jpg';
import type { Locale } from '@/i18n/routing';

/** Haberin görseli: fotoğraf ya da YouTube videosu. */
export type PressMedia =
  | { type: 'image'; image: StaticImageData; alt: Record<Locale, string> }
  | {
      type: 'youtube';
      /** YouTube video ID'si — `https://www.youtube.com/watch?v=<ID>` adresindeki `<ID>`. */
      videoId: string;
      /** İsteğe bağlı kapak görseli; yoksa sade bir oynat kartı gösterilir. */
      poster?: StaticImageData;
    };

export type PressItem = {
  /** Benzersiz kısa ad (ör. `hatay-gazetesi-2024-ney-atolyesi`). */
  id: string;
  /** Yayın tarihi, `YYYY-MM-DD`. Liste yeniden eskiye sıralanır. */
  date: string;
  /** Yayın organının adı (ör. "Hatay Gazetesi"). Çevrilmez. */
  outlet: string;
  title: Record<Locale, string>;
  /** İsteğe bağlı kısa açıklama. */
  description?: Record<Locale, string>;
  media?: PressMedia;
  /** Haberin orijinal bağlantısı. */
  url: string;
};

/*
 * Yeni haber eklemek için bu diziye bir kayıt ekleyin. Fotoğrafı `src/assets/images/press/`
 * altına koyup yukarıda `import` edin. Örnek:
 *
 * import haberFoto from '@/assets/images/press/hatay-gazetesi-2024.jpg';
 *
 * {
 *   id: 'hatay-gazetesi-2024',
 *   date: '2024-05-12',
 *   outlet: 'Hatay Gazetesi',
 *   title: { tr: '…', en: '…', ar: '…' },
 *   description: { tr: '…', en: '…', ar: '…' },
 *   media: { type: 'image', image: haberFoto, alt: { tr: '…', en: '…', ar: '…' } },
 *   // ya da: media: { type: 'youtube', videoId: 'dQw4w9WgXcQ' },
 *   url: 'https://…',
 * },
 */
export const press: PressItem[] = [
  {
    id: 'hatay-mahalli-haber-2025-ney-yapim-atolyesi',
    date: '2025-02-16',
    outlet: 'Hatay Mahalli Haber',
    title: {
      tr: 'Kamıştan Nefese Uzanan Yolculuk: Ney Yapım Atölyesi Büyük İlgi Gördü',
      en: 'A Journey from Reed to Breath: Ney-Making Workshop Draws Great Interest',
      ar: 'رحلة من القصب إلى النفَس: ورشة صناعة الناي تلقى إقبالًا كبيرًا',
    },
    description: {
      tr: 'Milli Eğitim Bakanlığı bünyesinde faaliyet gösteren Öğretmen Akademileri kapsamında Sanat Çarşısı atölyesinde düzenlenen Müzik Akademisi etkinlikleri hız kesmeden devam ediyor. Bu kapsamda gerçekleştirilen beşinci etkinlik olan “Kamıştan Nefese Uzanan Yolculuk” Ney Yapım Atölyesi, yoğun ilgi gördü.',
      en: 'The Music Academy events held at the Art Bazaar workshop, part of the Ministry of National Education’s Teacher Academies, continue without slowing down. The fifth event in this series, the “Journey from Reed to Breath” Ney-Making Workshop, drew great interest.',
      ar: 'تتواصل فعاليات أكاديمية الموسيقى التي تُقام في ورشة السوق الفني ضمن أكاديميات المعلمين التابعة لوزارة التربية الوطنية، دون تباطؤ. ولقيت الفعالية الخامسة في هذا الإطار، ورشة "رحلة من القصب إلى النفَس" لصناعة الناي، إقبالًا كبيرًا.',
    },
    media: {
      type: 'image',
      image: neyYapimAtolyesiFoto,
      alt: {
        tr: 'Alper Yıldırım, Müzik Akademisi etkinliğinde dinleyicilere ney yapımını anlatıyor',
        en: 'Alper Yıldırım demonstrating ney-making to an audience at the Music Academy event',
        ar: 'ألبر يلدريم يشرح صناعة الناي للحضور في فعالية أكاديمية الموسيقى',
      },
    },
    url: 'https://www.hataymahallihaber.com/haber/kamistan-nefese-uzanan-yolculuk-ney-yapim-atolyesi-buyuk-ilgi-gordu/',
  },
  {
    id: 'ilk-haber-gazetesi-2025-harbiye-kavali',
    date: '2025-06-03',
    outlet: 'İlk Haber Gazetesi',
    title: {
      tr: 'Neyin ustası, kavalın izinde: Harbiye’ye nostaljik bir dönüş',
      en: 'The Ney Master on the Trail of the Kaval: A Nostalgic Return to Harbiye',
      ar: 'أسطى الناي في أثر الكافال: عودة حنينية إلى حربية',
    },
    description: {
      tr: 'Tasavvuf müziğinin usta ismi Alper Yıldırım, unutulmaya yüz tutmuş Harbiye kavalını yeniden üretmeye hazırlanıyor. Samandağ kamışlarından ney yapan sanatçı, şimdi de çocukluk ezgilerini günümüze taşımak için kolları sıvıyor.',
      en: 'Alper Yıldırım, a master name in Sufi music, is preparing to revive the nearly forgotten Harbiye kaval. Having built neys from Samandağ reed, the artisan is now rolling up his sleeves to bring the melodies of his childhood into the present.',
      ar: 'يستعد ألبر يلدريم، الاسم البارز في الموسيقى الصوفية، لإعادة إنتاج كافال حربية الذي كاد يُنسى. وبعد صناعته النايات من قصب ساماندآغ، يشمّر الفنان الآن عن ساعديه لينقل ألحان طفولته إلى الحاضر.',
    },
    media: {
      type: 'image',
      image: harbiyeKavaliFoto,
      alt: {
        tr: 'Alper Yıldırım atölyesinde elindeki uzun bir neyi üflüyor',
        en: 'Alper Yıldırım blowing a long ney in his workshop',
        ar: 'ألبر يلدريم ينفخ في ناي طويل داخل ورشته',
      },
    },
    url: 'https://www.ilkhaber-gazetesi.com/dunya/neyin-ustasi-kavalin-izinde-harbiye-ye-nostaljik-bir-donus-289501',
  },
  {
    id: 'yeni-asya-2012-samandag-kamisi',
    date: '2012-02-25',
    outlet: 'Yeni Asya',
    title: {
      tr: 'Dünyanın En Kaliteli Ney Kamışı Hatay Samandağı’nda',
      en: 'The World’s Finest Ney Reed Grows in Hatay’s Samandağ',
      ar: 'أجود قصب الناي في العالم في ساماندآغ بولاية هاتاي',
    },
    description: {
      tr: 'Tasavvuf müziğinin en önemli enstrümanlarından neyin yapımında kullanılan ve boğum aralığı nedeniyle yurt içi ve yurt dışındaki neyzenlerin tercih ettiği Hatay’ın Samandağ ilçesinde tabiî olarak yetişen kamışların, coğrafi işaretlemesinin alınması için çalışma başlatıldı.',
      en: 'Work has begun to secure a geographical indication for the reed that grows naturally in Hatay’s Samandağ district — used to make the ney, one of the most important instruments in Sufi music, and preferred by neyzens at home and abroad for its node spacing.',
      ar: 'بدأ العمل على تسجيل مؤشر جغرافي للقصب الذي ينمو طبيعيًا في منطقة ساماندآغ بولاية هاتاي، والذي يُستخدم في صناعة الناي، أحد أهمّ آلات الموسيقى الصوفية، ويفضّله عازفو الناي في الداخل والخارج بسبب تباعد عُقَده.',
    },
    media: {
      type: 'image',
      image: samandagKamisiFoto,
      alt: {
        tr: 'Bir neyzen, arkasında def ve tespihlerin bulunduğu bir ortamda ney üflüyor',
        en: 'A neyzen playing the ney, with a tambourine and prayer beads in the background',
        ar: 'عازف ناي ينفخ في نايه وخلفه دف ومسبحة',
      },
    },
    url: 'https://www.yeniasya.com.tr/hafta-sonu/dunyanin-en-kaliteli-ney-kamisi-hatay-samandagi-nda_129993',
  },
  {
    id: 'hatay-mahalli-haber-2025-kamistan-nefese-alper-yildirim',
    date: '2025-05-22',
    outlet: 'Hatay Mahalli Haber',
    title: {
      tr: 'Kamıştan Nefese Uzanan Bir Ustalık Hikayesi: Alper Yıldırım',
      en: 'A Story of Mastery from Reed to Breath: Alper Yıldırım',
      ar: 'حكاية إتقان من القصب إلى النفَس: ألبر يلدريم',
    },
    description: {
      tr: 'Tasavvuf müziğinin vazgeçilmez enstrümanlarından biri olan ve insan sesine en yakın enstrüman olarak kabul edilen ney, usta sanatçı Alper Yıldırım’ın ellerinde adeta hayat buluyor. 2010 yılında Kültür ve Turizm Bakanlığı tarafından “Geleneksel El Sanatkârı” belgesi verilen Yıldırım, coğrafi işarete sahip Samandağ kamışından ürettiği neylerle hem yurt içinde hem de yurt dışında tanınıyor.',
      en: 'The ney — one of the essential instruments of Sufi music and regarded as the instrument closest to the human voice — comes to life in the hands of master artisan Alper Yıldırım. Awarded a “Traditional Craftsman” certificate by the Ministry of Culture and Tourism in 2010, Yıldırım is known at home and abroad for the neys he makes from geographically-indicated Samandağ reed.',
      ar: 'الناي، أحد أهمّ آلات الموسيقى الصوفية والمعتبَر أقرب آلة إلى الصوت البشري، يكتسب حياة حقيقية بين يدَي الحرفي الماهر ألبر يلدريم. حصل يلدريم عام 2010 على شهادة "الحرفي التقليدي" من وزارة الثقافة والسياحة، وهو معروف داخل تركيا وخارجها بالنايات التي يصنعها من قصب ساماندآغ ذي المؤشر الجغرافي.',
    },
    media: {
      type: 'image',
      image: kamistanNefeseFoto,
      alt: {
        tr: 'Alper Yıldırım atölyesinde elindeki uzun bir neyi üflüyor',
        en: 'Alper Yıldırım blowing a long ney in his workshop',
        ar: 'ألبر يلدريم ينفخ في ناي طويل داخل ورشته',
      },
    },
    url: 'https://www.hataymahallihaber.com/haber/kamistan-nefese-uzanan-bir-ustalik-hikayesi-alper-yildirim/',
  },
];

export const sortedPress = () => [...press].sort((a, b) => b.date.localeCompare(a.date));

import type { StaticImageData } from 'next/image';
import alisanHayataGulumseFoto from '@/assets/images/press/alisan-hayata-gulumse-2026.jpg';
import harbiyeKavaliFoto from '@/assets/images/press/harbiye-kavali-2025.jpg';
import kamistanNefeseFoto from '@/assets/images/press/kamistan-nefese-alper-yildirim.jpg';
import kutuphanelerHaftasiFoto from '@/assets/images/press/kutuphaneler-haftasi-sergi-2026.jpg';
import kutuphanelerHaftasiFotoB from '@/assets/images/press/kutuphaneler-haftasi-sergi-2026-b.jpg';
import neyYapimAtolyesiFoto from '@/assets/images/press/ney-yapim-atolyesi-2025.jpg';
import neyYapimAtolyesiFotoB from '@/assets/images/press/ney-yapim-atolyesi-2025-b.jpg';
import samandagKamisiFoto from '@/assets/images/press/samandag-kamisi-2012.jpg';
import samandagKamisiNeycilerinGozdesiFoto from '@/assets/images/press/samandag-kamisi-neycilerin-gozdesi-2007.jpg';
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
    id: 'trt1-2026-alisan-ile-hayata-gulumse',
    date: '2026-04-08',
    outlet: 'TRT 1',
    title: {
      tr: 'Alişan İle Hayata Gülümse 882. Bölüm',
      en: 'Alişan İle Hayata Gülümse — Episode 882',
      ar: 'أليشان مع ابتسم للحياة – الحلقة 882',
    },
    description: {
      tr: 'Alişan, Antakya Medeniyetler Korosu ve Hataylı konuklarla şehrin zengin kültürel mirasını, coğrafi işaretli yöresel yemeklerini ve geleneksel el sanatlarını ekranlara taşıyor. Programda deprem sonrası Hatay’da yürütülen çalışmalar, müzikal performanslar ve tiyatro gösterileri eşliğinde kadim şehrin dayanışma ruhu ve mutfak kültürü tüm yönleriyle tanıtılıyor.',
      en: 'Alişan brings the city’s rich cultural heritage, geographically-indicated local dishes and traditional handicrafts to the screen together with the Antakya Civilizations Choir and guests from Hatay. Alongside the post-earthquake recovery work under way in Hatay, the program showcases every facet of the ancient city’s spirit of solidarity and its culinary culture through musical performances and theatrical shows.',
      ar: 'ينقل أليشان إلى الشاشة، بمشاركة جوقة أنطاكيا للحضارات وضيوف من هاتاي، التراث الثقافي الغني للمدينة وأطباقها المحلية ذات المؤشر الجغرافي وحرفها اليدوية التقليدية. ويعرض البرنامج، إلى جانب الأعمال الجارية في هاتاي بعد الزلزال، وعبر عروض موسيقية ومسرحية، روح التضامن في هذه المدينة العريقة وثقافتها الغذائية بكل جوانبها.',
    },
    media: {
      type: 'youtube',
      videoId: 'twNCOOlFV3c',
      poster: alisanHayataGulumseFoto,
    },
    url: 'https://www.youtube.com/watch?v=twNCOOlFV3c',
  },
  {
    id: 'son-dakika-hatay-2026-kutuphaneler-haftasi-sergi',
    date: '2026-03-31',
    outlet: 'Son Dakika Hatay',
    title: {
      tr: 'Hatay, Kütüphaneler Haftası kapsamında kültür ve sanatı bir araya getiren özel bir sergiye ev sahipliği yaptı',
      en: 'Hatay Hosts a Special Exhibition Bringing Culture and Art Together for Library Week',
      ar: 'هاتاي تستضيف معرضًا خاصًا يجمع بين الثقافة والفن بمناسبة أسبوع المكتبات',
    },
    description: {
      tr: 'T.C. Hatay Valiliği ve T.C. Hatay İl Kültür ve Turizm Müdürlüğü öncülüğünde, Hatay Turizm Derneği ve Hatay Kültür Sanat Çarşısı iş birliğiyle düzenlenen etkinlik, Cemil Meriç İl Halk Kütüphanesi’nde sanatseverlerle buluştu.',
      en: 'Organized under the leadership of the Hatay Governorship and the Hatay Provincial Directorate of Culture and Tourism, in cooperation with the Hatay Tourism Association and the Hatay Culture and Art Bazaar, the event brought art lovers together at the Cemil Meriç Provincial Public Library.',
      ar: 'بتنظيم من محافظة هاتاي والمديرية الإقليمية للثقافة والسياحة في هاتاي، وبالتعاون مع جمعية هاتاي للسياحة وسوق هاتاي للثقافة والفنون، جمعت الفعالية محبي الفن في مكتبة جميل مريتش العامة الإقليمية.',
    },
    media: {
      type: 'image',
      image: kutuphanelerHaftasiFoto,
      alt: {
        tr: 'Cemil Meriç İl Halk Kütüphanesi’nde düzenlenen sergide bir araya gelen katılımcılar, arkada kitap rafları',
        en: 'Participants gathered for the exhibition at Cemil Meriç Provincial Public Library, with bookshelves in the background',
        ar: 'مشاركون يجتمعون في معرض أُقيم في مكتبة جميل مريتش العامة، وخلفهم رفوف الكتب',
      },
    },
    url: 'https://www.sondakikahatay.com/ilce-haberleri/hatayda-kutuphaneler-haftasina-ozel-sanat-sergisi-acildi',
  },
  {
    id: 'kurtulus-gazetesi-2026-kutuphaneler-haftasi-sergi',
    date: '2026-03-31',
    outlet: 'Kurtuluş Gazetesi',
    title: {
      tr: 'Hatay’da Kütüphaneler Haftası’na Özel Sanat Sergisi',
      en: 'A Special Art Exhibition for Library Week in Hatay',
      ar: 'معرض فني خاص بمناسبة أسبوع المكتبات في هاتاي',
    },
    description: {
      tr: 'Hatay Valiliği ile Hatay İl Kültür ve Turizm Müdürlüğü’nün öncülüğünde; Hatay Turizm Derneği ve Hatay Kültür Sanat Çarşısı iş birliğiyle, Cemil Meriç İl Halk Kütüphanesi’nde Hatay’ın yöresel sanatlarını tanıtan özel bir sergi kapılarını sanatseverlere açtı.',
      en: 'Led by the Hatay Governorship and the Hatay Provincial Directorate of Culture and Tourism, in cooperation with the Hatay Tourism Association and the Hatay Culture and Art Bazaar, a special exhibition showcasing Hatay’s local arts opened its doors to art lovers at the Cemil Meriç Provincial Public Library.',
      ar: 'بقيادة محافظة هاتاي والمديرية الإقليمية للثقافة والسياحة في هاتاي، وبالتعاون مع جمعية هاتاي للسياحة وسوق هاتاي للثقافة والفنون، فتح معرض خاص يُعرّف بالفنون المحلية في هاتاي أبوابه لمحبي الفن في مكتبة جميل مريتش العامة الإقليمية.',
    },
    media: {
      type: 'image',
      image: kutuphanelerHaftasiFotoB,
      alt: {
        tr: 'Kütüphanedeki büyük mozaik pano önünde toplu fotoğraf veren sergi katılımcıları',
        en: 'Exhibition participants posing for a group photo in front of the library’s large mosaic panel',
        ar: 'مشاركون في المعرض يلتقطون صورة جماعية أمام لوحة الفسيفساء الكبيرة في المكتبة',
      },
    },
    url: 'https://www.kurtulusgazetesi.com/hatayda-kutuphaneler-haftasina-ozel-sanat-sergisi/',
  },
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
    id: 'hatay-eksen-2025-ney-yapim-atolyesi',
    date: '2025-02-16',
    outlet: 'Hatay Eksen',
    title: {
      tr: 'Ney Yapım Atölyesi Büyük İlgi Gördü',
      en: 'Ney-Making Workshop Draws Great Interest',
      ar: 'ورشة صناعة الناي تلقى إقبالًا كبيرًا',
    },
    description: {
      tr: 'Milli Eğitim Bakanlığı bünyesinde faaliyet gösteren Öğretmen Akademileri kapsamında düzenlenen Müzik Akademisi etkinlikleri hız kesmeden devam ediyor. Bu kapsamda gerçekleştirilen beşinci etkinlik olan “Kamıştan Nefese Uzanan Yolculuk” Ney Yapım Atölyesi, yoğun ilgi gördü. Müzik Akademisi Koordinatörleri Mehmet Akif Karataş ve Rezzan Ezer’in öncülüğünde gerçekleşen etkinlikte, ney yapım ustası Alper Yıldırım katılımcılarla buluştu. Yıldırım, neyin tarihçesi, farklı coğrafyalardaki üretim yöntemleri ve çeşitleri hakkında detaylı bilgiler aktararak, katılımcılara ney yapım sürecini yakından gözlemleme ve deneyimleme fırsatı sundu.',
      en: 'The Music Academy events held under the Ministry of National Education’s Teacher Academies continue without slowing down. The fifth event in this series, the “Journey from Reed to Breath” Ney-Making Workshop, drew great interest. Led by Music Academy Coordinators Mehmet Akif Karataş and Rezzan Ezer, the event brought participants together with ney-making master Alper Yıldırım. Yıldırım shared detailed information about the history of the ney and its production methods and varieties across different regions, giving participants the chance to closely observe and experience the ney-making process.',
      ar: 'تتواصل فعاليات أكاديمية الموسيقى التي تُقام ضمن أكاديميات المعلمين التابعة لوزارة التربية الوطنية، دون تباطؤ. ولقيت الفعالية الخامسة في هذا الإطار، ورشة "رحلة من القصب إلى النفَس" لصناعة الناي، إقبالًا كبيرًا. وبقيادة منسّقَي أكاديمية الموسيقى محمد عاكف كاراتاش ورزان إيزر، التقى المشاركون بأسطى صناعة الناي ألبر يلدريم. وقدّم يلدريم معلومات مفصّلة عن تاريخ الناي وطرق صناعته وأنواعه في مناطق مختلفة، مانحًا المشاركين فرصة لمراقبة عملية صناعة الناي وتجربتها عن قرب.',
    },
    media: {
      type: 'image',
      image: neyYapimAtolyesiFotoB,
      alt: {
        tr: 'Ney Yapım Atölyesi katılımcıları, önlüğünde “Mansurney Ney Atölyesi” yazan Alper Yıldırım ile birlikte dışarıda poz veriyor',
        en: 'Participants of the Ney-Making Workshop pose outdoors with Alper Yıldırım, wearing an apron that reads “Mansurney Ney Atölyesi”',
        ar: 'مشاركون في ورشة صناعة الناي يلتقطون صورة في الخارج مع ألبر يلدريم الذي يرتدي مئزرًا مكتوبًا عليه "Mansurney Ney Atölyesi"',
      },
    },
    url: 'https://hatayeksen.com/2025/02/16/ney-yapim-atolyesi-buyuk-ilgi-gordu/',
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
        tr: 'Alper Yıldırım atölyesinde bir neyin başparesini işliyor',
        en: 'Alper Yıldırım working on a ney’s mouthpiece in his workshop',
        ar: 'ألبر يلدريم يعمل على باشبارة (فم) ناي داخل ورشته',
      },
    },
    url: 'https://www.hataymahallihaber.com/haber/kamistan-nefese-uzanan-bir-ustalik-hikayesi-alper-yildirim/',
  },
  {
    id: 'iskenderun-org-2007-samandag-kamisi',
    date: '2007-12-18',
    outlet: 'İskenderun.org',
    title: {
      tr: 'Samandağ Kamışı Ney’cilerin Gözdesi',
      en: 'Samandağ Reed, the Favorite of Ney Makers',
      ar: 'قصب ساماندآغ المفضّل لدى صنّاع الناي',
    },
    description: {
      tr: 'Antakya’da Edebiyat öğretmenliğinin yanı sıra Ney üretimi yapan Alper Yıldırım ağızlığı Manda boynuzundan, ana gövdesi Samandağ kamışından yapılan neylerin Türkiye’de ve Dünyada bir numara olduğunu söyledi. Mevlana’nın 800. doğum yıldönümü nedeniyle İskenderun Halk Eğitim Merkezi Sergi salonunda kendi ürettiği neyler ile Birlikte Mesnevi müzik aletlerini sergisi açan edebiyat öğretmeni Alper Yıldırım Hatay’ın Samandağ İlçesinin dünyaca ünlü yönünü öne çıkardı. Edebiyat Öğretmeni Alper Yıldırım, Mevlevi sazlarını tanıtmak amacıyla bu sergiyi açtıklarını belirterek yöre halkının ve birçok kişinin Ney yapımcıları tarafından Samandağ bölgesinde yetişen kamışlardan yapıldığını bilmediğine dikkat çekti.',
      en: 'Alper Yıldırım, who teaches literature in Antakya alongside making neys, said that the neys he crafts — with mouthpieces of water-buffalo horn and bodies of Samandağ reed — are unmatched in Turkey and the world. For the 800th anniversary of Rumi’s birth, literature teacher Alper Yıldırım opened an exhibition of Mesnevi musical instruments, including his own neys, at the İskenderun Public Education Center exhibition hall, highlighting the world-renowned reputation of Hatay’s Samandağ district. Alper Yıldırım said the exhibition was opened to introduce Mevlevi instruments, noting that many people, including locals, are unaware that neys are made from reed grown in the Samandağ region.',
      ar: 'قال ألبر يلدريم، الذي يعمل مدرّسًا للأدب في أنطاكيا إلى جانب صناعته للناي، إن النايات التي يصنعها -بمبسم من قرن الجاموس وجسم رئيسي من قصب ساماندآغ- هي الأفضل في تركيا والعالم. وبمناسبة الذكرى الثمانمائة لميلاد مولانا، افتتح مدرّس الأدب ألبر يلدريم معرضًا لآلات المثنوي الموسيقية إلى جانب النايات التي صنعها بنفسه، في قاعة معرض مركز إسكندرون للتعليم الشعبي، مسلّطًا الضوء على الشهرة العالمية لمنطقة ساماندآغ التابعة لهاتاي. وأشار ألبر يلدريم إلى أن الهدف من المعرض هو التعريف بآلات المولوية، لافتًا إلى أن كثيرًا من الناس، بمن فيهم أهالي المنطقة، لا يعلمون أن الناي يُصنع من القصب النابت في منطقة ساماندآغ.',
    },
    media: {
      type: 'image',
      image: samandagKamisiNeycilerinGozdesiFoto,
      alt: {
        tr: 'Alper Yıldırım, sergi salonunda duvara asılı neyleri işaret ederken elinde uzun bir kamış tutuyor',
        en: 'Alper Yıldırım pointing to neys displayed on the exhibition wall, holding a long cane',
        ar: 'ألبر يلدريم يشير إلى النايات المعروضة على جدار الصالة، ممسكًا بقصبة طويلة',
      },
    },
    url: 'https://www.iskenderun.org/samandag-kamisi-neycilerin-gozdesi',
  },
];

export const sortedPress = () => [...press].sort((a, b) => b.date.localeCompare(a.date));

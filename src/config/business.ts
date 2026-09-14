export type Business = {
  name: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: { street: string; locality: string; region: string; postalCode: string | null; country: 'TR' };
  geo: { lat: number; lng: number } | null;
  openingHours: { days: ('Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su')[]; opens: string; closes: string }[];
  social: { instagram: string | null; youtube: string | null; facebook: string | null };
  foundingYear: number;
  master: { name: string; consent: boolean };
};

// ⚠️ Adres, saatler ve sosyal hesaplar Görev 0 (§15-1, §15-8) cevaplarıyla güncellenecek.
// `master.consent` ustadan yazılı onay gelene kadar `false` kalır; atölye sayfası
// adını yalnızca `consent === true` iken gösterir (Görev 7 §7).
export const business: Business = {
  name: 'Mansur Ney',
  phone: '+905325930436',
  phoneDisplay: '0 532 593 04 36',
  whatsapp: '905325930436',
  email: 'neyzen@mansurney.com',
  address: { street: 'Atatürk Caddesi, Narin Otel yanı', locality: 'Antakya', region: 'Hatay', postalCode: null, country: 'TR' },
  geo: null,
  openingHours: [{ days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], opens: '09:00', closes: '19:30' }],
  social: { instagram: null, youtube: null, facebook: null },
  foundingYear: 2003,
  master: { name: 'Alper Yıldırım', consent: false },
};

export const telUrl = () => `tel:${business.phone}`;
export const whatsappUrl = (text?: string) =>
  `https://wa.me/${business.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

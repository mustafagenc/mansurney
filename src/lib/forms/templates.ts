import { tunings } from '@/data/tunings';
import type { Locale } from '@/i18n/routing';
import type { Mail } from './mailer';
import type { ContactInput, OrderInput } from './schemas';

const langName: Record<Locale, string> = { tr: 'Türkçe', en: 'İngilizce', ar: 'Arapça' };
const lines = (rows: [string, string][]) =>
  rows.filter(([, v]) => v !== '').map(([k, v]) => `${k}: ${v}`).join('\n');

export function orderMail(d: OrderInput, locale: Locale): Mail {
  const tuning = tunings.find((t) => t.key === d.tuning)?.name ?? 'Belirtilmedi (danışacak)';
  return {
    subject: `Ney sipariş talebi — ${d.name} (${tuning}, ${d.quantity} adet)`,
    replyTo: d.email || undefined,
    text: lines([
      ['Ad Soyad', d.name],
      ['Telefon', d.phone],
      ['E-posta', d.email],
      ['Akort', tuning],
      ['Adet', String(d.quantity)],
      ['Not', d.note],
      ['Site dili', langName[locale]],
      ['KVKK onayı', 'Verildi'],
    ]),
  };
}

export function contactMail(d: ContactInput, locale: Locale): Mail {
  return {
    subject: `İletişim formu — ${d.subject || d.name}`,
    replyTo: d.email,
    text: lines([
      ['Ad Soyad', d.name],
      ['E-posta', d.email],
      ['Telefon', d.phone],
      ['Konu', d.subject],
      ['Site dili', langName[locale]],
      ['KVKK onayı', 'Verildi'],
      ['', ''],
      ['Mesaj', `\n${d.message}`],
    ]),
  };
}

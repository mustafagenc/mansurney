import { z } from 'zod';
import { tuningKeys } from '@/data/tunings';

// Tek satırlık alanlar (e-posta başlığına gidenler dahil): kontrol karakterleri
// (CR/LF/TAB vb.) yasak — e-posta başlığı enjeksiyonunu (header injection) engeller.
const singleLine = /^[^\x00-\x1f\x7f]*$/;
const name = z.string().trim().min(2).max(100).regex(singleLine);
const phone = z.string().trim().regex(/^\+?[\d\s()-]{10,20}$/);
const optional = (s: z.ZodType<string, string>) => z.union([z.literal(''), s]).default('');
const consent = z.literal('on');
const honeypot = z.string().max(0).default('');

export const orderSchema = z.object({
  name,
  phone,
  email: optional(z.email()),
  tuning: z.union([z.literal(''), z.enum(tuningKeys)]).default(''),
  quantity: z.coerce.number().int().min(1).max(50),
  note: z.string().trim().max(2000).default(''),
  consent,
  website: honeypot,
});

export const contactSchema = z.object({
  name,
  email: z.email(),
  phone: optional(phone),
  subject: z.string().trim().max(150).regex(singleLine).default(''),
  message: z.string().trim().min(10).max(5000),
  consent,
  website: honeypot,
});

export type OrderInput = z.infer<typeof orderSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export type FormState = {
  status: 'idle' | 'success' | 'error';
  error?: 'validation' | 'captcha' | 'server';
  fields?: string[];
  /** Hata dönüşlerinde gönderilen metin değerleri (honeypot ve Turnstile token'ı hariç):
   * React 19 her action sonrası formu sıfırladığı için alanlar bunlarla yeniden doldurulur. */
  values?: Record<string, string>;
};
export const initialFormState: FormState = { status: 'idle' };

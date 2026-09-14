import { z } from 'zod';
import { tuningKeys } from '@/data/tunings';

const name = z.string().trim().min(2).max(100);
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
  subject: z.string().trim().max(150).default(''),
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
};
export const initialFormState: FormState = { status: 'idle' };

import 'server-only';
import { Resend } from 'resend';
import { isDryRun } from './dry-run';

export type Mail = { subject: string; text: string; replyTo?: string };
export interface Mailer {
  send(mail: Mail): Promise<void>;
}

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} tanımlı değil`);
  return v;
}

// Ortam değişkenleri ve Resend istemcisi `send` içinde, tembel olarak okunur:
// eksik bir anahtar yalnızca gerçekten e-posta gönderilirken (ve çağıranın
// `try` bloğu içinde) hata verir — honeypot/doğrulama/captcha yollarını çökertmez.
const resendMailer: Mailer = {
  async send(mail) {
    const resend = new Resend(required('RESEND_API_KEY'));
    const { error } = await resend.emails.send({
      from: required('FORM_FROM_EMAIL'),
      to: [required('FORM_TO_EMAIL')],
      subject: mail.subject,
      text: mail.text,
      replyTo: mail.replyTo,
    });
    if (error) throw new Error(error.message);
  },
};

const dryRunMailer: Mailer = {
  async send(mail) {
    console.info('[forms:dry-run]', mail.subject);
  },
};

export const getMailer = (): Mailer => (isDryRun() ? dryRunMailer : resendMailer);

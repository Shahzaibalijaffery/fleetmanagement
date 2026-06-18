import nodemailer from 'nodemailer';
import type Transporter from 'nodemailer/lib/mailer';

import { env } from '../../config/env';

let cachedTransport: Transporter | null | undefined;

export function isEmailConfigured(): boolean {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

function getTransport(): Transporter | null {
  if (cachedTransport !== undefined) {
    return cachedTransport;
  }

  if (!isEmailConfigured()) {
    cachedTransport = null;
    return null;
  }

  cachedTransport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return cachedTransport;
}

export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const transport = getTransport();

  if (!transport) {
    console.warn(`[email] SMTP not configured — OTP for ${to}: ${code}`);
    return;
  }

  await transport.sendMail({
    from: env.SMTP_FROM ?? env.SMTP_USER,
    to,
    subject: 'Your FleetLink verification code',
    text: `Your FleetLink verification code is ${code}. It expires in 10 minutes.`,
    html: `
      <p>Your FleetLink verification code is:</p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${code}</p>
      <p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
    `,
  });

  console.log(`[email] OTP sent to ${to}`);
}

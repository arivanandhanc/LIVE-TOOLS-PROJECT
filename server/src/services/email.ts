import nodemailer from "nodemailer";
import { env } from "../config/env";
import { logger } from "../config/logger";

let transporter: nodemailer.Transporter | null = null;

export function emailConfigured(): boolean {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);
}

function getTransport(): nodemailer.Transporter | null {
  if (!emailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host!,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user!, pass: env.smtp.pass! },
    });
  }
  return transporter;
}

/**
 * Send a one-time code. When SMTP isn't configured (dev), the code is logged to
 * the server console so the flow is still testable locally.
 */
export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const t = getTransport();
  if (!t) {
    logger.warn({ to, code }, "SMTP not configured — OTP logged instead of emailed (dev mode)");
    return;
  }
  await t.sendMail({
    from: env.smtp.from,
    to,
    subject: `Your Arivu's Scrab Tools verification code: ${code}`,
    text: `Your Arivu's Scrab Tools verification code is ${code}. It expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.`,
    html: `<p>Your Arivu's Scrab Tools verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</p><p>It expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`,
  });
}

import { Resend } from 'resend';

type NetlifyEvent = {
  httpMethod: string;
  body: string | null;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const json = (statusCode: number, payload: Record<string, unknown>) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

export const handler = async (event: NetlifyEvent) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey) {
    return json(500, { error: 'Missing RESEND_API_KEY' });
  }

  let body: Record<string, unknown> = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid request body' });
  }

  const replyTo = String(body.from || '').trim();
  const subject = String(body.subject || '').trim();
  const message = String(body.message || '').trim();

  if (!replyTo || !isValidEmail(replyTo)) {
    return json(400, { error: 'Valid sender email is required' });
  }
  if (!subject) {
    return json(400, { error: 'Subject is required' });
  }
  if (!message) {
    return json(400, { error: 'Transmission message is required' });
  }

  const resend = new Resend(apiKey);
  const safeReplyTo = escapeHtml(replyTo);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

  try {
    const result = await resend.emails.send({
      from: senderEmail,
      to: 'mendoncajose7@gmail.com',
      replyTo,
      subject,
      html: `<p>New portfolio transmission from <strong>${safeReplyTo}</strong>:</p><p>${safeMessage}</p>`,
    });
    return json(200, { ok: true, id: result.data?.id });
  } catch (error) {
    return json(500, {
      error: error instanceof Error ? error.message : 'Failed to send transmission',
    });
  }
};

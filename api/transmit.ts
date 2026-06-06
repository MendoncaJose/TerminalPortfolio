import { Resend } from 'resend';

type TransmitRequest = {
  method?: string;
  body?: {
    from?: unknown;
    subject?: unknown;
    message?: unknown;
  };
};

type JsonResponse = {
  setHeader: (key: string, value: string) => void;
  status: (code: number) => {
    json: (payload: Record<string, unknown>) => void;
  };
};

const escapeHtml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default async function handler(request: TransmitRequest, response: JsonResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey) {
    return response.status(500).json({ error: 'Missing RESEND_API_KEY' });
  }

  const replyTo = String(request.body?.from || '').trim();
  const subject = String(request.body?.subject || '').trim();
  const message = String(request.body?.message || '').trim();

  if (!replyTo || !isValidEmail(replyTo)) {
    return response.status(400).json({ error: 'Valid sender email is required' });
  }

  if (!subject) {
    return response.status(400).json({ error: 'Subject is required' });
  }

  if (!message) {
    return response.status(400).json({ error: 'Transmission message is required' });
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

    return response.status(200).json({ ok: true, id: result.data?.id });
  } catch (error) {
    return response.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to send transmission',
    });
  }
}

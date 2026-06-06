import { Resend } from 'resend';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const escapeHtml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const readRequestBody = async (request: NodeJS.ReadableStream) =>
  new Promise<Record<string, unknown>>((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += String(chunk);
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON payload'));
      }
    });
    request.on('error', reject);
  });

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'portfolio-transmit-api-dev',
        configureServer(server) {
          server.middlewares.use('/api/transmit', async (request, response) => {
            response.setHeader('Content-Type', 'application/json');

            if (request.method !== 'POST') {
              response.statusCode = 405;
              response.setHeader('Allow', 'POST');
              response.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            const apiKey = env.RESEND_API_KEY;
            const senderEmail = env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

            if (!apiKey) {
              response.statusCode = 500;
              response.end(JSON.stringify({ error: 'Missing RESEND_API_KEY' }));
              return;
            }

            try {
              const body = await readRequestBody(request);
              const replyTo = String(body.from || '').trim();
              const subject = String(body.subject || '').trim();
              const message = String(body.message || '').trim();

              if (!replyTo || !isValidEmail(replyTo)) {
                response.statusCode = 400;
                response.end(JSON.stringify({ error: 'Valid sender email is required' }));
                return;
              }

              if (!subject) {
                response.statusCode = 400;
                response.end(JSON.stringify({ error: 'Subject is required' }));
                return;
              }

              if (!message) {
                response.statusCode = 400;
                response.end(JSON.stringify({ error: 'Transmission message is required' }));
                return;
              }

              const resend = new Resend(apiKey);
              const safeReplyTo = escapeHtml(replyTo);
              const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');
              const result = await resend.emails.send({
                from: senderEmail,
                to: 'mendoncajose7@gmail.com',
                replyTo,
                subject,
                html: `<p>New portfolio transmission from <strong>${safeReplyTo}</strong>:</p><p>${safeMessage}</p>`,
              });

              response.statusCode = 200;
              response.end(JSON.stringify({ ok: true, id: result.data?.id }));
            } catch (error) {
              response.statusCode = 500;
              response.end(
                JSON.stringify({
                  error: error instanceof Error ? error.message : 'Failed to send transmission',
                })
              );
            }
          });
        },
      },
    ],
  };
});

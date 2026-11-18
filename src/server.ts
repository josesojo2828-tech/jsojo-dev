import 'dotenv/config';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * 🔎 CONTACT DIAGNOSTICS
 * Reports whether the Telegram env vars reached the container and if the bot
 * token is valid. Never exposes the token itself.
 */
app.get('/api/contact', async (_req, res) => {
  const token = process.env['TELEGRAM_BOT_TOKEN'];
  const chatId = process.env['TELEGRAM_CHAT_ID'];

  const result: {
    telegramConfigured: boolean;
    chatIdSet: boolean;
    botValid: boolean;
    botUsername: string | null;
    telegramError?: string;
  } = {
    telegramConfigured: Boolean(token && chatId),
    chatIdSet: Boolean(chatId),
    botValid: false,
    botUsername: null
  };

  if (token) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
        signal: AbortSignal.timeout(4000)
      });
      const data = await response.json();
      result.botValid = Boolean(data.ok);
      result.botUsername = data.result?.username ?? null;
      if (!data.ok) {
        result.telegramError = data.description ?? 'unknown';
      }
    } catch {
      result.telegramError = 'network';
    }
  }

  res.json(result);
});

/**
 * 🔒 SECURE TELEGRAM PROXY API
 * Reads bot token and chat id from ENVIRONMENT VARIABLES (Docker)
 */
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body ?? {};
  const botToken = process.env['TELEGRAM_BOT_TOKEN'];
  const chatId = process.env['TELEGRAM_CHAT_ID'];

  if (!botToken || !chatId) {
    console.error('❌ Environment variables TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID are MISSING.');
    return res.status(500).json({ error: 'Configuración de servidor incompleta.' });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos requeridos.' });
  }

  const text = [
    '🆕 NUEVO CONTACTO — PORTFOLIO',
    '',
    `👤 Nombre: ${name}`,
    `📧 Email: ${email}`,
    '',
    '💬 Mensaje:',
    `${message}`
  ].join('\n');

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    }

    const errData = await response.json();
    console.error('❌ Telegram API error:', errData);
    return res.status(500).json({ error: 'Error al enviar a Telegram.' });
  } catch (error) {
    console.error('❌ Network error sending to Telegram:', error);
    return res.status(500).json({ error: 'Fallo de conexión en el servidor.' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) { throw error; }
    console.log(`🚀 Node Express server listening on http://localhost:${port}`);
    console.log(`🔧 Environment: TELEGRAM_BOT_TOKEN is ${process.env['TELEGRAM_BOT_TOKEN'] ? 'SET' : 'NOT SET'}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);

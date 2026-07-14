// Vercel Serverless Function — POST /api/contact
// Sends the portfolio contact form to mohalaminadamou@gmail.com using Resend.
// Requires the RESEND_API_KEY environment variable (configured in Vercel).

const { Resend } = require('resend');

const RECIPIENT = 'mohalaminadamou@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// .trim() guards against a stray leading/trailing space or newline being
// pasted into the Vercel dashboard's env var value — a blank-looking but
// non-empty string like " " would otherwise pass a plain truthy check.
const RESEND_KEY = (process.env.RESEND_API_KEY || '').trim();

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = async (req, res) => {
  // ── TEMPORARY DEBUG ENDPOINT ────────────────────────────────
  // GET /api/contact?debug=1
  // Confirms whether Vercel is actually injecting RESEND_API_KEY into
  // this function at runtime, without ever revealing the key itself.
  // Remove this whole block once the fix is confirmed in production.
  if (req.method === 'GET' && req.query && req.query.debug === '1') {
    return res.status(200).json({
      hasKey: RESEND_KEY.length > 0,
      keyLength: RESEND_KEY.length,
      keyPrefix: RESEND_KEY ? RESEND_KEY.slice(0, 3) + '…' : null,
      vercelEnv: process.env.VERCEL_ENV || null,   // 'production' | 'preview' | 'development'
      nodeEnv: process.env.NODE_ENV || null,
      region: process.env.VERCEL_REGION || null,
    });
  }
  // ─────────────────────────────────────────────────────────────

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid JSON body.' });
    }
  }
  body = body || {};

  const name = (body.name || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const social = (body.social || '').toString().trim();
  const media = (body.media || '').toString().trim();
  const service = (body.service || '').toString().trim();
  const budget = (body.budget || '').toString().trim();
  const message = (body.message || '').toString().trim();

  // Required fields — mirrors the "required" attributes on the frontend form.
  const missing = [];
  if (!name) missing.push('name');
  if (!email) missing.push('email');
  if (!message) missing.push('message');

  if (missing.length) {
    return res.status(400).json({
      success: false,
      error: `Missing required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}.`,
    });
  }

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
  }

  if (!RESEND_KEY) {
    // Runtime log — visible in Vercel → Project → Logs. Never logs the key
    // itself, only whether one was found, so it's safe to leave in.
    console.error('[contact] RESEND_API_KEY missing at runtime.', {
      vercelEnv: process.env.VERCEL_ENV || 'unknown',
    });
    return res.status(500).json({ success: false, error: 'Email service is not configured.' });
  }

  try {
    const resend = new Resend(RESEND_KEY);

    const html = `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Social Handle:</strong> ${escapeHtml(social || '—')}</p>
      <p><strong>Media:</strong> ${escapeHtml(media || '—')}</p>
      <p><strong>Selected Service:</strong> ${escapeHtml(service || '—')}</p>
      <p><strong>Budget:</strong> ${escapeHtml(budget || '—')}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `;

    const text =
      `New contact form submission\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Social Handle: ${social || '—'}\n` +
      `Media: ${media || '—'}\n` +
      `Selected Service: ${service || '—'}\n` +
      `Budget: ${budget || '—'}\n\n` +
      `Message:\n${message}`;

    const { data, error } = await resend.emails.send({
      // Resend's shared testing domain — swap for a verified sender domain
      // (e.g. contact@yourdomain.com) once one is set up in the Resend dashboard.
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: RECIPIENT,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      html,
      text,
    });

    if (error) {
      // Log full detail server-side, but also surface a short reason to the
      // client — Resend's error messages (e.g. "invalid API key", "domain
      // not verified") don't leak secrets and make the real cause obvious
      // without needing to dig through Vercel's log viewer.
      console.error('[contact] Resend error:', error);
      return res.status(502).json({
        success: false,
        error: `Failed to send the message${error.message ? `: ${error.message}` : '.'}`,
      });
    }

    return res.status(200).json({ success: true, id: data && data.id });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return res.status(500).json({ success: false, error: 'Something went wrong. Please try again later.' });
  }
};

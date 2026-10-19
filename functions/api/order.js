// Cloudflare Pages Function: POST /api/order
// Saves an order request (D1 binding `DB`) and pings your phone (NOTIFY_WEBHOOK).
// No payment is taken here: you reply with a PayPal link after confirming.
import { ITEMS } from '../../src/data/shop.mjs';
import { notify } from '../../src/lib/notify.mjs';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (v, n) => String(v ?? '').trim().slice(0, n);

function makeRef(date = new Date()) {
  const ymd = date.toISOString().slice(2, 10).replace(/-/g, '');
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const rnd = crypto.getRandomValues(new Uint8Array(4));
  return `MN${ymd}-${[...rnd].map((b) => abc[b % abc.length]).join('')}`;
}

export async function onRequestPost({ request, env }) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const reply = (body, code = 200) =>
    wantsJson
      ? new Response(JSON.stringify(body), { status: code, headers: { 'content-type': 'application/json' } })
      : Response.redirect(new URL(`/thanks/?s=${body.status === 'ok' ? 'order' : 'error'}${body.ref ? `&ref=${body.ref}` : ''}`, request.url).toString(), 303);

  let f;
  try {
    f = await request.formData();
  } catch {
    return reply({ status: 'invalid', message: 'The form could not be read.' }, 400);
  }
  if (f.get('website')) return reply({ status: 'ok', ref: makeRef() }); // honeypot

  const item = ITEMS.find((i) => i.key === f.get('item'));
  const o = {
    item: item?.key,
    qty: Math.min(10, Math.max(1, parseInt(f.get('qty') || '1', 10) || 1)),
    name: clip(f.get('name'), 80),
    email: clip(f.get('email'), 120).toLowerCase(),
    im: clip(f.get('im'), 80),
    country: clip(f.get('country'), 40),
    message: clip(f.get('message'), 1200),
  };
  if (!item || item.status === 'soon') return reply({ status: 'invalid', message: 'That item is not available to order.' }, 400);
  if (!o.name) return reply({ status: 'invalid', message: 'Add your name.' }, 400);
  if (!EMAIL.test(o.email)) return reply({ status: 'invalid', message: 'Check the email address.' }, 400);
  if (!o.country) return reply({ status: 'invalid', message: 'Choose a country.' }, 400);
  if (item.type === 'service' && !o.message) return reply({ status: 'invalid', message: 'Tell us briefly what you have.' }, 400);

  if (!env.DB && !env.NOTIFY_WEBHOOK) return reply({ status: 'closed' }, 503);

  const ref = makeRef();
  const now = new Date().toISOString();
  const visitorCountry = request.cf?.country || null;
  const amount = item.type === 'box' ? item.price * o.qty : null;
  let saved = false;

  if (env.DB) {
    try {
      await env.DB.prepare(
        `INSERT INTO orders (ref, item, qty, name, email, im, country, message, visitor_country, amount_usd, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`
      )
        .bind(ref, o.item, o.qty, o.name, o.email, o.im || null, o.country, o.message || null, visitorCountry, amount, now)
        .run();
      saved = true;
    } catch (err) {
      console.error('order insert failed', err);
    }
  }

  const lines = [
    `🧧 minnan.org new ${item.type === 'box' ? 'order' : 'enquiry'} ${ref}`,
    `${item.zh} ${item.name}${item.type === 'box' ? ` ×${o.qty} = US$${amount}` : ''}`,
    `${o.name} · ${o.country}`,
    `Email: ${o.email}`,
    o.im ? `IM: ${o.im}` : '',
    o.message ? `Message: ${o.message}` : '',
    saved ? '' : '(not saved to database)',
  ].filter(Boolean);
  const pinged = await notify(env, lines.join('\n'));

  if (!saved && !pinged) return reply({ status: 'error' }, 500);
  return reply({ status: 'ok', ref });
}

export function onRequest() {
  return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
}

// Cloudflare Pages Function: POST /api/subscribe
// Stores Chhun-hong letter sign-ups in a D1 database bound as `DB`.
// Until the database is bound, it answers "closed" so the page says sign-ups open shortly.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function onRequestPost({ request, env }) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const reply = (status, code = 200) =>
    wantsJson
      ? new Response(JSON.stringify({ status }), { status: code, headers: { 'content-type': 'application/json' } })
      : Response.redirect(new URL(`/thanks/?s=${status}`, request.url).toString(), 303);

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply('invalid', 400);
  }

  // Honeypot: real people never fill this field.
  if (form.get('website')) return reply('ok');

  const email = String(form.get('email') || '').trim().toLowerCase();
  const source = String(form.get('source') || '').slice(0, 60);
  if (!EMAIL.test(email) || email.length > 254) return reply('invalid', 400);

  if (!env.DB) return reply('closed', 503);

  try {
    const res = await env.DB.prepare(
      'INSERT INTO subscribers (email, source, country, created_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(email) DO NOTHING'
    )
      .bind(email, source, request.cf?.country || null, new Date().toISOString())
      .run();
    return reply(res.meta.changes ? 'ok' : 'already');
  } catch (err) {
    console.error('subscribe failed', err);
    return reply('error', 500);
  }
}

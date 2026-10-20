// Cloudflare Pages Function: POST /api/chat — the 問 · Ask panel.
//
// Which brain answers (first match wins; or force one with CHAT_PROVIDER):
//   1. ANTHROPIC_API_KEY                 → Claude (CHAT_MODEL, default claude-haiku-5-5)
//   2. CHAT_API_URL + CHAT_API_KEY       → any OpenAI-compatible API (DeepSeek, Qwen, OpenAI …), CHAT_MODEL required
//   3. Workers AI binding named `AI`     → CHAT_MODEL, default @cf/aisingapore/gemma-sea-lion-v4-27b-it
//   4. none of the above                 → scripted answers from the site's own data
// Limits (need the D1 binding `DB`): CHAT_HOURLY_LIMIT per visitor (default 30),
// CHAT_DAILY_LIMIT for the whole site (default 800). No conversation text is stored;
// only the first question of a conversation, unless CHAT_LOG_QUESTIONS=0.
import { ITEMS, SHOP } from '../../src/data/shop.mjs';
import { PILLARS } from '../../src/data/site.mjs';
import WORDS from '../../src/data/words.json';

const PERSON = '[[person]]';

/* ------------------------------------------------------------ knowledge */
function catalog() {
  return ITEMS.map((i) => {
    const bits = [
      `- ${i.name} (${i.zh}) — ${i.priceLabel}. ${i.priceNote}. Page: /shop/${i.key}/`,
      `  ${i.lead}`,
      i.contents ? `  Contains: ${i.contents.join('; ')}.` : '',
      i.preorder ? `  Pre-order: ${i.preorder}` : '',
      i.steps ? `  Steps: ${i.steps.map(([a, b]) => `${a} — ${b}`).join(' / ')}` : '',
      i.facts ? `  ${i.facts.map(([k, v]) => `${k}: ${v}`).join('; ')}.` : '',
    ];
    return bits.filter(Boolean).join('\n');
  }).join('\n');
}

const wordList = () =>
  WORDS.map((w) => `${w.said} = ${w.hanzi} ${w.poj}: ${w.meaning}${w.note ? ` (${w.note})` : ''}`).join('\n');

function systemPrompt(page = '/') {
  return `You are the assistant on minnan.org, an independent cultural project about Hokkien (閩南, Minnan) heritage, written for descendants in the Philippines, Malaysia, Singapore, Indonesia, Taiwan and beyond. Many of them no longer read Chinese.

Answer in the visitor's language (English, 中文, Tagalog, Malay, Indonesian …). Keep replies short — at most 120 words, plain text, no headings, no tables. Be warm, plain and exact.

You help with:
1. Hokkien words, customs, festivals, food, temples, houses and migration history. Give Hokkien in Traditional characters with Pe̍h-ōe-jī romanisation where you can, and say when pronunciation differs between ports. If you are not sure, say so plainly.
2. The shop "回批 · The reply from home": what is in each box, prices, where we ship, how ordering works.
3. Two services: reading old family writing, and finding the ancestral village.

Rules:
- Never state facts about the visitor's own family, clan, surname origin or village as if known. One surname comes from many villages. Share what is generally known, then suggest "Find our village".
- Quote prices, contents, countries and timings only from the catalogue below. Never promise that customs will clear a parcel.
- We never send meat (including pork floss or dried meat), eggs, fresh food or alcohol.
- Boxes ship with shipping included to: ${SHOP.boxCountries.join(', ')}. Any other country: a person checks the rules and quotes first.
- You cannot take orders, payments or addresses. Ordering: use the order form on the item's page, or message a person. No payment is taken until a person confirms; then a PayPal link is sent (card or PayPal). A person replies within ${SHOP.replyWithin}.
- When a person should take over — ordering, a custom request, a complaint, an existing order, or reading the visitor's own documents — end your reply with ${PERSON}
- Refer to pages by path, for example /shop/long-life-box/ or /tongue/#wordbook.
- No medical, legal, immigration or investment advice.

Site sections: ${PILLARS.map((p) => `${p.zi} ${p.name} /${p.key}/`).join(', ')}, shop /shop/, shipping and refunds /shop/policy/, contact /contact/.

Catalogue:
${catalog()}

Wordbook (Hokkien words in Southeast Asian languages):
${wordList()}

The visitor is reading: ${page}`;
}

/* -------------------------------------------------- links shown under a reply */
const TOPICS = [
  { key: 'long-life-box', re: /misua|mi-?sua|birthday|long[- ]life|麵線|面线|壽|寿|生日/i },
  { key: 'new-year-box', re: /new ?year|tikoy|lunar|cny|甜粿|年糕|春節|春节|過年|过年|年味|年貨|年货/i },
  { key: 'anxi-tea', re: /\btea\b|tieguanyin|tie guan yin|oolong|anxi|茶|鐵觀音|铁观音|安溪/i },
  { key: 'read-a-letter', re: /letter|qiaopi|tomb|grave|tablet|inscription|handwrit|translat|僑批|侨批|墓碑|神主|家書|家书|讀|看不懂/i },
  { key: 'find-our-village', re: /village|roots?\b|ancest|genealog|clan|surname|family tree|祖籍|尋根|寻根|族譜|族谱|宗親|宗亲|祖厝/i },
];
const ORDERISH = /\b(order|buy|purchase|pay|payment|paypal|price|cost|how much|ship|shipping|deliver|address|send to|custom|discount|bulk|wholesale|track)\b|訂|订|買|买|多少錢|多少钱|付款|寄到|運費|运费|價|价/i;

function actionsFor(text) {
  const acts = [];
  for (const t of TOPICS) {
    if (t.re.test(text)) {
      const it = ITEMS.find((i) => i.key === t.key);
      acts.push({ label: `${it.zh} ${it.name}`, href: `/shop/${it.key}/` });
    }
    if (acts.length === 2) break;
  }
  return acts;
}

/* ------------------------------------------------------- scripted fallback */
function scripted(q) {
  const text = q.toLowerCase();
  const word = WORDS.find((w) =>
    w.said.toLowerCase().split(/\s*\/\s*/).some((s) => s && text.includes(s)) || q.includes(w.hanzi) || text.includes(w.poj.toLowerCase())
  );
  if (word) {
    return {
      reply: `${word.said} is Hokkien: ${word.hanzi} (${word.poj}) — ${word.meaning}.${word.note ? ` ${word.note}` : ''} More words like it are in the wordbook: /tongue/#wordbook`,
    };
  }
  if (/ship|deliver|country|send to|寄|運|运/i.test(q)) {
    return {
      reply: `Boxes ship to ${SHOP.boxCountries.join(', ')} with shipping included, usually 7–12 days after payment, with tracking. For anywhere else, a person checks the rules and quotes first. We never send meat, eggs or fresh food. Details: /shop/policy/`,
      handoff: true,
    };
  }
  for (const t of TOPICS) {
    if (t.re.test(q)) {
      const it = ITEMS.find((i) => i.key === t.key);
      const inside = it.contents ? ` Inside: ${it.contents.join('; ')}.` : '';
      return { reply: `${it.name} (${it.zh}), ${it.priceLabel}. ${it.lead}${inside}${it.preorder ? ` ${it.preorder}` : ''} /shop/${it.key}/`, handoff: ORDERISH.test(q) };
    }
  }
  if (ORDERISH.test(q)) {
    return { reply: `Everything we send is at /shop/. To order, use the form on an item’s page — no payment until a person confirms with you — or message us directly below.`, handoff: true };
  }
  return {
    reply: `I can answer questions about Hokkien words, our boxes, shipping, and reading old family letters. For anything else, a person will reply — use a button below.`,
    handoff: true,
  };
}

/* ---------------------------------------------------------------- brains */
const TIMEOUT = 25000;

async function askAnthropic(env, system, messages) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: env.CHAT_MODEL || 'claude-haiku-5-5', max_tokens: 500, system, messages }),
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!r.ok) throw new Error(`anthropic ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  return (d.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
}

async function askOpenAICompatible(env, system, messages) {
  let url = env.CHAT_API_URL.replace(/\/+$/, '');
  if (!/\/chat\/completions$/.test(url)) url += url.endsWith('/v1') ? '/chat/completions' : '/v1/chat/completions';
  const r = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${env.CHAT_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: env.CHAT_MODEL, max_tokens: 500, temperature: 0.5, messages: [{ role: 'system', content: system }, ...messages] }),
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!r.ok) throw new Error(`chat api ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const d = await r.json();
  return d.choices?.[0]?.message?.content || '';
}

async function askWorkersAI(env, system, messages) {
  const model = env.CHAT_MODEL || '@cf/aisingapore/gemma-sea-lion-v4-27b-it';
  const d = await env.AI.run(model, { messages: [{ role: 'system', content: system }, ...messages], max_tokens: 500, temperature: 0.5 });
  return d?.response ?? d?.choices?.[0]?.message?.content ?? d?.result?.response ?? '';
}

function pickProvider(env) {
  const forced = (env.CHAT_PROVIDER || '').toLowerCase();
  if (forced === 'off' || forced === 'scripted') return null;
  if (forced === 'anthropic' || (!forced && env.ANTHROPIC_API_KEY)) return env.ANTHROPIC_API_KEY ? askAnthropic : null;
  if (forced === 'openai' || (!forced && env.CHAT_API_URL && env.CHAT_API_KEY)) return env.CHAT_API_URL && env.CHAT_API_KEY && env.CHAT_MODEL ? askOpenAICompatible : null;
  if (forced === 'workers-ai' || (!forced && env.AI)) return env.AI ? askWorkersAI : null;
  return null;
}

/* ------------------------------------------------------------ guard rails */
function cleanMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const msgs = raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  // Merge any repeated roles so the conversation alternates.
  const out = [];
  for (const m of msgs) {
    if (out.length && out[out.length - 1].role === m.role) out[out.length - 1].content += '\n' + m.content;
    else out.push({ ...m });
  }
  return out.length && out[out.length - 1].role === 'user' ? out : [];
}

async function bump(db, bucket) {
  const row = await db
    .prepare('INSERT INTO chat_usage (bucket, n) VALUES (?1, 1) ON CONFLICT(bucket) DO UPDATE SET n = n + 1 RETURNING n')
    .bind(bucket)
    .first();
  return row?.n ?? 1;
}

async function hashIp(ip) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`minnan:${ip}`));
  return [...new Uint8Array(buf)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

/* ---------------------------------------------------------------- handler */
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ reply: 'That message could not be read. Try again.' }, 400);
  }
  const messages = cleanMessages(body.messages);
  if (!messages.length) return json({ reply: 'Ask me anything about Hokkien words, customs or our boxes.' }, 400);
  const page = typeof body.page === 'string' ? body.page.slice(0, 120) : '/';
  const question = messages[messages.length - 1].content;

  if (env.DB) {
    try {
      const now = new Date().toISOString();
      const hour = now.slice(0, 13).replace(/\D/g, '');
      const ip = request.headers.get('cf-connecting-ip') || 'unknown';
      const mine = await bump(env.DB, `ip:${await hashIp(ip)}:${hour}`);
      const today = await bump(env.DB, `day:${now.slice(0, 10)}`);
      if (mine > Number(env.CHAT_HOURLY_LIMIT || 30)) {
        return json({ reply: 'You have asked a lot this hour — thank you! A person can continue with you directly.', handoff: true });
      }
      if (today > Number(env.CHAT_DAILY_LIMIT || 800)) {
        return json({ ...scripted(question), note: 'daily-limit' });
      }
      if (messages.length === 1 && env.CHAT_LOG_QUESTIONS !== '0') {
        await env.DB.prepare('INSERT INTO chat_questions (question, page, visitor_country, created_at) VALUES (?1, ?2, ?3, ?4)')
          .bind(question.slice(0, 500), page, request.cf?.country || null, now)
          .run();
      }
    } catch (err) {
      console.error('chat usage tracking failed', err);
    }
  }

  const brain = pickProvider(env);
  if (!brain) {
    const s = scripted(question);
    return json({ ...s, actions: actionsFor(question) });
  }

  try {
    let reply = (await brain(env, systemPrompt(page), messages)).trim();
    const handoff = reply.includes(PERSON) || ORDERISH.test(question);
    reply = reply.split(PERSON).join('').trim();
    if (!reply) throw new Error('empty reply');
    return json({ reply, handoff, actions: actionsFor(`${question}\n${reply}`) });
  } catch (err) {
    console.error('chat provider failed', err);
    const s = scripted(question);
    return json({ ...s, actions: actionsFor(question) });
  }
}

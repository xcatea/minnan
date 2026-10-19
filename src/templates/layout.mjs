// Shared page shell and reusable pieces.
import { SITE, PILLARS, CONTACT } from '../data/site.mjs';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Contact details: build variables override src/data/site.mjs.
export function contact() {
  const env = process.env;
  const c = {
    whatsapp: (env.CONTACT_WHATSAPP ?? CONTACT.whatsapp ?? '').replace(/\D/g, ''),
    wechat: env.CONTACT_WECHAT ?? CONTACT.wechat ?? '',
    wechatQr: env.CONTACT_WECHAT_QR ?? CONTACT.wechatQr ?? '',
    messenger: env.CONTACT_MESSENGER ?? CONTACT.messenger ?? '',
    email: env.CONTACT_EMAIL ?? CONTACT.email ?? '',
  };
  c.any = Boolean(c.whatsapp || c.wechat || c.messenger || c.email);
  return c;
}

export const waLink = (number, text = '') =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

// Buttons to reach a person. `text` pre-fills the WhatsApp message.
export function peopleLinks({ text = '', cls = 'im-links' } = {}) {
  const c = contact();
  const out = [];
  if (c.whatsapp) out.push(`<a class="im im-wa" href="${waLink(c.whatsapp, text)}" target="_blank" rel="noopener" data-wa-base="${c.whatsapp}">WhatsApp</a>`);
  if (c.wechat) out.push(`<a class="im im-wx" href="/contact/#wechat">WeChat</a>`);
  if (c.messenger) out.push(`<a class="im im-fb" href="https://m.me/${esc(c.messenger)}" target="_blank" rel="noopener">Messenger</a>`);
  if (c.email) out.push(`<a class="im im-mail" href="mailto:${esc(c.email)}${text ? `?subject=${encodeURIComponent('minnan.org')}&body=${encodeURIComponent(text)}` : ''}">Email</a>`);
  return out.length ? `<div class="${cls}">${out.join('')}</div>` : '';
}

const FONTS =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Gentium+Book+Plus:ital@0;1&family=Noto+Serif+TC:wght@400;600;700&display=swap';

export function layout({
  title,
  description = SITE.description,
  path = '/',
  ogTitle,
  ogImage = SITE.ogImage,
  ogType = 'website',
  current = '',
  bodyClass = '',
  head = '',
  jsonld = null,
  main,
  css,
  noindex = false,
}) {
  const canonical = SITE.url + path;
  const beacon = process.env.CF_BEACON_TOKEN
    ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(process.env.CF_BEACON_TOKEN)}"}'></script>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:site_name" content="minnan.org">
<meta property="og:title" content="${esc(ogTitle || title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.url}${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#8f382f">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="minnan.org stories" href="/rss.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="${css}">
${head}
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<a class="skip" href="#main">Skip to content</a>
${header(current)}
<main id="main">
${main}
</main>
${footer()}
${askPanel()}
<script src="/site.js" defer></script>
${beacon}
</body>
</html>
`;
}

function header(current) {
  const links = PILLARS.map(
    (p) =>
      `<li><a href="/${p.key}/"${p.key === current ? ' aria-current="page"' : ''}>${p.name}<span class="zi">${p.zi}</span></a></li>`
  ).join('\n      ');
  return `<header class="site">
  <nav class="nav" aria-label="Main navigation">
    <a class="logo" href="/"><span class="chop" aria-hidden="true">閩南</span><span><strong>MINNAN</strong><small>minnan.org</small></span></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="main-menu">Menu · 選單</button>
    <ul class="nav-links" id="main-menu">
      ${links}
      <li class="nav-send"><a href="/shop/"${current === 'shop' ? ' aria-current="page"' : ''}>Send<span class="zi">寄</span></a></li>
    </ul>
  </nav>
</header>`;
}

// The 問 button: an assistant for questions, and a way to reach a person.
function askPanel() {
  const chips = [
    'What’s in the long-life box?',
    'Do you ship to my country?',
    'Can you read my grandfather’s letter?',
    'What does Lán-nâng mean?',
  ];
  return `<div class="ask" data-ask>
  <button class="ask-fab" type="button" aria-expanded="false" aria-controls="ask-panel"><span class="ask-seal" aria-hidden="true">問</span><span class="ask-lbl">Ask</span></button>
  <section class="ask-panel" id="ask-panel" role="dialog" aria-labelledby="ask-title" hidden>
    <header class="ask-head">
      <div><h2 id="ask-title">問 · Ask minnan.org</h2><p>Words, customs, our boxes, shipping.</p></div>
      <button class="ask-close" type="button" aria-label="Close">×</button>
    </header>
    <div class="ask-log" data-ask-log aria-live="polite">
      <div class="msg bot"><p>Lí hó! Ask about a Hokkien word, a family custom, our boxes or shipping. To order, a person will answer you directly.</p></div>
    </div>
    <div class="ask-chips" data-ask-chips>${chips.map((c) => `<button type="button">${c}</button>`).join('')}</div>
    <form class="ask-form" data-ask-form>
      <label class="visually-hidden" for="ask-input">Your question</label>
      <textarea id="ask-input" name="q" rows="1" maxlength="800" placeholder="Type your question" required></textarea>
      <button type="submit">Send</button>
    </form>
    <div class="ask-people"><span>Talk to a person</span>${peopleLinks({ text: 'Hello minnan.org, ', cls: 'im-links small' })}</div>
  </section>
</div>`;
}

function footer() {
  const year = new Date().getFullYear();
  const pillarLinks = PILLARS.map((p) => `<a href="/${p.key}/">${p.name} · ${p.zi}</a>`).join('');
  return `<footer class="site">
  <div class="wrap">
    <p class="mission">minnan.org is an independent cultural project documenting Hokkien heritage — ancestral villages, language, faith, food, houses, migration, temples, family memory, and letters across the sea — for descendants across the Philippines, Malaysia, Singapore, Indonesia, Taiwan, and beyond.</p>
    <div class="motto">閩南的故事，仍在繼續。</div>
    <div class="poj">Lán-nâng ê le̍k-sú, lán-nâng ka-tī siá. — Our people’s history, written by our own people.</div>
    <nav class="foot-links" aria-label="Sections">${pillarLinks}</nav>
    <nav class="foot-links" aria-label="Shop"><a href="/shop/">回批 · Send a taste of home</a><a href="/shop/read-a-letter/">讀批 · Read a family letter</a><a href="/shop/find-our-village/">尋根 · Find our village</a></nav>
    <nav class="foot-links minor" aria-label="More"><a href="/stories/">All stories</a><a href="/tongue/#wordbook">Wordbook</a><a href="/ports/philippines/">Ports</a><a href="/about/">About &amp; sources</a><a href="/contact/">Contact</a><a href="/shop/policy/">Shipping &amp; refunds</a><a href="/rss.xml">RSS</a></nav>
    <div class="fine"><span>© ${year} minnan.org · MINNAN · Past, Present and Future</span><span>One language, a thousand ports. · 一句閩南話，行遍天下港。</span></div>
  </div>
</footer>`;
}

// The Chhun-hong weekly letter sign-up. Posts to /api/subscribe (Cloudflare Pages Function).
export function newsletter({ source = 'home', heading = 'The Chhun-hong letter.', eyebrow = '批 · 一週一批', id = 'subscribe' } = {}) {
  return `<section class="newsletter" id="${id}">
  <div class="wrap">
    <div class="eyebrow">${eyebrow}</div>
    <h2 class="sec">${heading}</h2>
    <div class="letter-card">
      <div class="stamp" aria-hidden="true">春風</div>
      <h3>One story a week.</h3>
      <div class="tc">一週一批 · 寄予故人</div>
      <p>A surname traced. A word decoded. A temple connected. A family dish remembered. A letter that once crossed the sea — written for the generation that may no longer read the old script, but still wants to know what it said.</p>
      <form class="sub-row" action="/api/subscribe" method="post" data-subscribe>
        <input type="email" name="email" placeholder="Your email address" aria-label="Email address" autocomplete="email" required>
        <input type="hidden" name="source" value="${esc(source)}">
        <label class="hp" aria-hidden="true">Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
        <button type="submit">Receive one letter a week</button>
      </form>
      <p class="sub-status" role="status" aria-live="polite"></p>
      <p class="privacy">No daily promotions. One carefully written cultural story each week. Unsubscribe from any letter.</p>
    </div>
  </div>
</section>`;
}

export function storyList(stories, { empty } = {}) {
  if (!stories.length) return `<p class="empty-note">${empty || 'The first story for this section is being written. Subscribe below and it will reach you first.'}</p>`;
  return `<ul class="story-list">
${stories
  .map(
    (s) => `  <li><a href="${s.url}"><span class="tag">${esc(s.tag)}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.standfirst)}</p><p class="meta">${fmtDate(s.date)} · ${s.minutes} min read</p></div></a></li>`
  )
  .join('\n')}
</ul>`;
}

export function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

// The swallow-tail roofline used as a section divider.
export const roof = (bg = '') =>
  `<svg class="roof-divider" viewBox="0 0 1200 55" preserveAspectRatio="none" aria-hidden="true"${bg ? ` style="background:${bg}"` : ''}><path d="M0 55V34Q86 46 165 18Q213 0 251 20Q413 44 600 31Q787 44 949 20Q987 0 1035 18Q1114 46 1200 34V55Z" fill="#f5ecdd"/></svg>`;

// Inner-page hero: the character is the hero.
export function glyphHero({ glyph, title, sub, lead, tone = 'ink', crumb = '' }) {
  const two = [...glyph].length > 1;
  return `<section class="glyph-hero ${tone}">
  <div class="wrap inner">
    <div class="glyph${two ? ' two' : ''}" aria-hidden="true">${two ? [...glyph].map((c) => `<i>${c}</i>`).join('') : glyph}</div>
    <div>
      ${crumb ? `<p class="crumb">${crumb}</p>` : ''}
      <h1>${title}</h1>
      ${sub ? `<p class="sub">${sub}</p>` : ''}
      ${lead ? `<p class="lead">${lead}</p>` : ''}
    </div>
  </div>
</section>
${roof(tone === 'brick' ? 'var(--brick)' : 'var(--ink)')}`;
}

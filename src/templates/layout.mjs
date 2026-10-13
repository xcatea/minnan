// Shared page shell and reusable pieces.
import { SITE, PILLARS } from '../data/site.mjs';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
    </ul>
  </nav>
</header>`;
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
    <nav class="foot-links minor" aria-label="More"><a href="/stories/">All stories</a><a href="/tongue/#wordbook">Wordbook</a><a href="/ports/philippines/">Ports</a><a href="/about/">About &amp; sources</a><a href="/rss.xml">RSS</a></nav>
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
    <div class="glyph${two ? ' two' : ''}" aria-hidden="true">${glyph}</div>
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

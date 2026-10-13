// Every page on the site. Each function returns { path, html }.
import { layout, newsletter, storyList, glyphHero, roof, esc, fmtDate } from './layout.mjs';
import { archGrid, homeQuote, houseGallery, registry, qiaopiGallery, portLinks, wordbook } from './sections.mjs';
import { SITE, PILLARS, PORTS, pillar } from '../data/site.mjs';

const page = (path, opts) => ({ path, html: layout({ path, ...opts }) });
const inPillar = (stories, key) => stories.filter((s) => s.pillar === key || s.also.includes(key));

/* ------------------------------------------------------------------ Home */
export function home({ stories, css }) {
  const [latest, ...rest] = stories;
  const featured = latest
    ? `<section class="featured">
  <div class="wrap">
    <div class="eyebrow">起讀 · START HERE</div>
    <h2 class="sec">${latest.pillar === 'taste' && latest.slug === 'lumpia-popiah' ? 'One roll, a thousand ports.' : 'The latest story.'}</h2>
    <a class="feat-card" href="${latest.url}">
      <div><span class="tag">${esc(latest.tag)}</span><h3>${esc(latest.title)}</h3><p>${esc(latest.summary || latest.standfirst)}</p></div>
      <span class="arrow">Read the story →</span>
    </a>
    ${rest.length ? storyList(rest.slice(0, 3)) : ''}
    <a class="text-link" href="/stories/">All stories</a>
  </div>
</section>`
    : '';

  const pillarCards = PILLARS.filter((p) => p.key !== 'houses')
    .map(
      (p) =>
        `<a class="pillar" href="/${p.key}/"><div class="zi-big">${p.zi}</div><h3>${p.name.toUpperCase()}</h3><div class="sub">${p.sub}</div><p>${p.card}</p><span class="go">${p.go} →</span></a>`
    )
    .join('\n      ');

  const main = `<section class="hero">
  <div class="hero-inner">
    <div class="hero-copy">
      <div class="kicker">MINNAN · THE CULTURAL HOME OF THE HOKKIEN WORLD</div>
      <h1>One language, a thousand ports.</h1>
      <p class="brand-question">Do you still remember where the story began?<span>你還記得，故事開始的地方嗎？</span></p>
      <p class="lead">Minnan is not only where our story began. It is where the story is still being written — in old houses and new homes, in family words, living faith, shared tables, letters across the sea, and the lives of every new generation.</p>
      <p class="home-line">真實的閩南。<br>過去，現在，未來。</p>
      <div class="cta-row">
        <a class="btn solid" href="/roots/">Find where your story began</a>
        <a class="btn" href="#living-minnan">See Minnan across time</a>
      </div>
    </div>
  </div>
</section>
${roof()}

<section class="time-section" id="living-minnan">
  <div class="wrap">
    <div class="eyebrow">真 · AUTHENTIC MINNAN</div>
    <h2 class="sec">Past. Present. Future.</h2>
    <p class="sec-lead">Minnan is not a scene frozen in the past. It is a living world—remembered, lived and continually renewed across villages and ports.</p>
    <div class="time-grid">
      <article class="time-card"><img src="/assets/images/qiaopi-chaoan-mother.webp" alt="A historic qiaopi letter" loading="lazy" decoding="async" width="1800" height="1011"><div class="time-copy"><div class="no">PAST · 過去</div><h3>故事從這裡開始</h3><p>祖厝、鄉音與僑批，留下遠行以前與跨海以後的真實記憶。</p></div></article>
      <article class="time-card"><img src="/assets/images/quanzhou-home-courtyard.webp" alt="A lived-in Minnan courtyard" loading="lazy" decoding="async" width="1280" height="853"><div class="time-copy"><div class="no">PRESENT · 現在</div><h3>閩南仍在生活</h3><p>它仍在家門、飯桌、香火與每天使用的語言裡，不只是被保存的遺產。</p></div></article>
      <article class="time-card"><img src="/assets/images/redbrick-lane.webp" alt="A red-brick Minnan lane leading forward" loading="lazy" decoding="async" width="1000" height="700"><div class="time-copy"><div class="no">FUTURE · 未來</div><h3>故事仍在繼續</h3><p>每一代人都會用自己的方式，重新理解、書寫並帶著閩南走向下一個港口。</p></div></article>
    </div>
    <div class="truth-line">我們記錄的，不是一個停留在過去的閩南。<br>我們記錄的是一個不斷生長、不斷遠航，也不斷回望來處的閩南。</div>
  </div>
</section>

<section class="speak" id="tongue">
  <div class="wrap">
    <div class="eyebrow">音 · 鄉音未改</div>
    <h2 class="sec">You may already know more Hokkien than you think.</h2>
    <p class="sec-lead">If you have ever said lumpia, popiah, bihon, misua, tikoy, hopia, or kway teow, you were already carrying words from the ports of southern Fujian. Many families no longer read the characters. Many were never formally taught the language. Yet the words survived in kitchens, markets, birthdays, weddings, and New Year tables.</p>
    <div class="loanwords">
      <div class="loanword"><b>lumpia</b><span>潤餅 · lūn-piáⁿ</span></div>
      <div class="loanword"><b>popiah</b><span>薄餅 · po̍h-piáⁿ</span></div>
      <div class="loanword"><b>bihon</b><span>米粉 · bí-hún</span></div>
      <div class="loanword"><b>misua</b><span>麵線 · mī-sòaⁿ</span></div>
      <div class="loanword"><b>tikoy</b><span>甜粿 · tiⁿ-kóe</span></div>
      <div class="loanword"><b>bak kut teh</b><span>肉骨茶 · bah-kut-tê</span></div>
      <div class="loanword"><b>kway teow</b><span>粿條 · kóe-tiâu</span></div>
      <div class="loanword"><b>hopia</b><span>好餅 · hó-piáⁿ</span></div>
    </div>
    <p class="language-note"><strong>The pronunciation changed from port to port. The memory remained.</strong><br>聲音隨港口而變，來處一直都在。</p>
    <a class="text-link" href="/tongue/#wordbook">Open the wordbook →</a>
  </div>
</section>

<section class="pillars" id="roots">
  <div class="wrap">
    <div class="eyebrow">四件行李 · 一封家書</div>
    <h2 class="sec">Four things they carried. One thing they sent home.</h2>
    <p class="sec-lead">They crossed the sea with almost nothing. They carried their roots, their language, their gods, and the taste of home. When they could, they sent letters back across the water. What remains today is not only memory. It is a living inheritance.</p>
    <div class="pillar-grid">
      ${pillarCards}
    </div>
  </div>
</section>

<section class="homes" id="homes">
  <div class="wrap">
    <div class="home-intro">
      <div>
        <div class="eyebrow">厝 · 故里的樣子</div>
        <h2 class="sec">The architecture of memory.</h2>
        <p class="sec-lead">Before many of us remember the language, we remember the house: the curve of a swallow-tail roof, the red of sun-warmed brick, the stone set between brickwork, the flower tiles by the doorway, the shaded hall, and the family altar. In the Hokkien world, architecture is not only design. It is memory made visible.</p>
      </div>
      ${homeQuote()}
    </div>
    ${archGrid()}
    ${houseGallery()}
    <a class="text-link" href="/houses/">Walk through the house →</a>
  </div>
</section>

<section class="bridge" aria-label="Qiaopi and ancestral homes">
  <div class="wrap">
    <blockquote>Some houses were built with bricks.<br>Some were built one letter at a time.</blockquote>
    <p>有些祖厝以磚石建成，有些祖厝，是一封一封僑批寄回來的。</p>
  </div>
</section>

<section class="ports" id="ports">
  <div class="wrap">
    <div class="eyebrow">埠 · 天下港</div>
    <h2 class="sec">Choose your port.</h2>
    <p class="sec-lead">One mother tongue, many harbors. Across Southeast Asia and beyond, Hokkien communities built new homes without completely leaving the old ones behind. Choose the port closest to your family’s story.</p>
    ${portLinks()}
  </div>
</section>

${featured}

<section class="qiaopi-section" id="letter">
  <div class="wrap">
    <div class="qiaopi-head">
      <div><div class="eyebrow">批 · 僑批傳家</div><h2 class="sec">One letter. Two shores. One family.</h2><p class="sec-lead">A qiaopi was never merely a document. It could hold a line reporting safety, money for parents and children, instructions for the household, and feelings too restrained to say directly. Distance was written into the paper — and so was the refusal to abandon home.</p></div>
      ${registry()}
    </div>
    ${qiaopiGallery()}
    <a class="text-link" href="/letters/">See the family letters →</a>
  </div>
</section>

${newsletter({ source: 'home', eyebrow: '批 · 僑批傳家' })}`;

  return page('/', {
    title: 'MINNAN — 過去、現在與未來的真實閩南 | minnan.org',
    ogTitle: 'MINNAN — Do you still remember where the story began?',
    description: SITE.description,
    head: '<link rel="preload" as="image" href="/assets/images/minnan-home-real.webp" fetchpriority="high">',
    bodyClass: 'home',
    css,
    main,
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'MINNAN',
      alternateName: '閩南',
      url: SITE.url + '/',
      description: SITE.description,
      inLanguage: ['en', 'zh-Hant'],
    },
  });
}

/* --------------------------------------------------------- Section pages */
const SECTION_COPY = {
  roots: {
    lead: 'Trace a surname to a clan hall, and a clan hall to a village in Jinjiang, Shishi, Nan’an, Hui’an, Quanzhou, Zhangzhou, or somewhere nearby. Most families hold more of the trail than they realise.',
    body: () => `<div class="page-section">
      <h2><span class="zi">尋根</span>Start with what your family already holds</h2>
      <p>You do not need a genealogy book to begin. These are the places the trail is usually hiding, roughly in the order most families find them.</p>
      <ol class="steps">
        <li><b>Ask for the name of the home village.</b><span>Older relatives often remember it as a sound rather than as characters — write it down exactly as it is said, with the county if they know it.</span></li>
        <li><b>Look at the stones and tablets.</b><span>Tombstones and ancestral tablets across Southeast Asia often carve the home county — 晉江, 南安, 惠安, 同安 — beside the family name.</span></li>
        <li><b>Find the clan or hometown association.</b><span>Surname associations (宗親會) and hometown associations (同鄉會) in Manila, Penang, Singapore and Medan keep member records, and some hold printed genealogies (族譜).</span></li>
        <li><b>Read the old papers.</b><span>Qiaopi envelopes, remittance receipts, passports and travel documents often carry a village address in full.</span></li>
        <li><b>Then write to the village.</b><span>With a county and a village name, the ancestral hall (祠堂) or the village committee can often confirm the family line.</span></li>
      </ol>
    </div>
    <div class="page-section">
      <h2><span class="zi">籌備中</span>Being gathered</h2>
      <div class="gathering">
        <h3>The surname index</h3>
        <p>Every Hokkien surname linked to the clan halls and ancestral villages it is known from — each entry with its source, and a clear note where the record is uncertain.</p>
        <p>Subscribers to the weekly letter will hear first when it opens.</p>
      </div>
    </div>`,
  },
  tongue: {
    lead: 'Compare Manila Lannang-uè, Penang Hokkien, Singapore Hokkien, Medan Hokkien, and the speech of southern Fujian. Start with the words you already use.',
    body: ({ words }) => `<div class="page-section" id="wordbook">
      <h2><span class="zi">詞簿</span>The wordbook</h2>
      <p>Hokkien words that sailed into the languages of Southeast Asia — the way you say them, the characters, the Pe̍h-ōe-jī romanisation, and where you will hear them.</p>
      ${wordbook(words)}
    </div>
    <div class="page-section">
      <h2><span class="zi">籌備中</span>Being gathered</h2>
      <div class="gathering">
        <h3>Port-by-port voices</h3>
        <p>Recordings of the same everyday words as they are said in Manila, Penang, Singapore, Medan, Xiamen and Quanzhou, so you can hear how your grandmother’s Hokkien differs from her cousin’s.</p>
        <ul><li>Family terms: what to call each aunt, uncle and grandparent</li><li>Kitchen and market words</li><li>Blessings for birthdays, weddings and New Year</li></ul>
      </div>
    </div>`,
  },
  faith: {
    lead: 'They carried their gods across the water. Many overseas temples still trace their incense back to a mother temple in Fujian, and still return to it.',
    body: () => `<div class="page-section">
      <h2><span class="zi">神明</span>Who watched over the voyage</h2>
      <div class="rows">
        <div class="row"><div class="zh">媽祖<small>Má-chó͘</small></div><div><h3>At the harbour</h3><p>Goddess of the sea and protector of sailors. Her mother temple is on Meizhou Island off Putian; harbour temples across the Hokkien world carry her incense.</p></div></div>
        <div class="row"><div class="zh">關公<small>Koan-kong</small></div><div><h3>In the shop</h3><p>Guardian of loyalty and honest dealing, kept on the altar of family businesses from Binondo to Penang.</p></div></div>
        <div class="row"><div class="zh">清水祖師<small>Chheng-chúi Chó͘-su</small></div><div><h3>From the home county</h3><p>The patron of Anxi, honoured at Qingshui Yan. Penang’s Snake Temple is dedicated to him.</p></div></div>
        <div class="row"><div class="zh">保生大帝<small>Pó-seng Tāi-tè</small></div><div><h3>For the sick at home</h3><p>A healer deity from Tong’an, worshipped across southern Fujian, Taiwan and Southeast Asia.</p></div></div>
      </div>
    </div>
    <div class="page-section">
      <h2><span class="zi">籌備中</span>Being gathered</h2>
      <div class="gathering">
        <h3>The incense map</h3>
        <p>Overseas temples linked to the mother temples their incense came from (分香), so a family can follow its gods home.</p>
      </div>
    </div>`,
  },
  taste: {
    lead: 'Misua for birthdays. Tikoy for New Year. Tea from Anxi. Food preserved memory long after a family forgot the road home — and kept the words alive with it.',
    body: () => `<div class="page-section">
      <h2><span class="zi">籌備中</span>Being gathered</h2>
      <div class="gathering">
        <h3>The next word stories</h3>
        <ul><li>Misua and the long-life noodle on every birthday table</li><li>Tikoy, tiⁿ-kóe and the sweet start to the year</li><li>Anxi tea and the shops that carried it overseas</li></ul>
        <p>Every food word on this site also lives in the <a class="text-link" style="margin:0" href="/tongue/#wordbook">wordbook</a>.</p>
      </div>
    </div>`,
  },
  houses: {
    lead: 'Before many of us remember the language, we remember the house: the curve of a swallow-tail roof, the red of sun-warmed brick, the shaded hall, and the family altar.',
    body: () => `<div class="page-section">
      <div class="home-intro">
        <div><h2><span class="zi">故里的樣子</span>Memory made visible</h2><p class="lede">In the Hokkien world, architecture is not only design. These are the details people recognise before they can name them.</p></div>
        ${homeQuote()}
      </div>
      ${archGrid()}
      ${houseGallery()}
    </div>
    <div class="page-section">
      <h2><span class="zi">籌備中</span>Being gathered</h2>
      <div class="gathering">
        <h3>Houses, then and now</h3>
        <p>Family houses photographed as they stand today — restored, rebuilt, lived in or empty — beside the old photographs and letters that remember them.</p>
      </div>
    </div>`,
  },
  letters: {
    lead: 'Qiaopi carried news, money, duty, worry, and love between a port city and an ancestral village. Some houses were built one letter at a time.',
    body: () => `<div class="page-section">
      <div class="qiaopi-head">
        <div><h2><span class="zi">僑批傳家</span>One letter. Two shores. One family.</h2><p class="lede">A qiaopi was never merely a document. It could hold a line reporting safety, money for parents and children, instructions for the household, and feelings too restrained to say directly.</p></div>
        ${registry()}
      </div>
      ${qiaopiGallery()}
    </div>
    <div class="page-section">
      <h2><span class="zi">籌備中</span>Being gathered</h2>
      <div class="gathering">
        <h3>Letters, read aloud</h3>
        <p>Clearly sourced qiaopi from Quanzhou, Jinjiang, Xiamen, Zhangzhou and the Southeast Asian ports — transcribed, translated and explained for a generation that may no longer read the old script.</p>
      </div>
    </div>`,
  },
};

export function sectionPage(key, { stories, words, css }) {
  const p = pillar(key);
  const copy = SECTION_COPY[key];
  const list = inPillar(stories, key);
  const main = `${glyphHero({ glyph: p.zi, title: p.name, sub: p.sub, lead: copy.lead })}
<div class="page-body">
  <div class="wrap">
    ${copy.body({ words })}
    <div class="page-section">
      <h2><span class="zi">故事</span>${p.name} stories</h2>
      ${storyList(list)}
    </div>
  </div>
</div>
${newsletter({ source: key })}`;
  return page(`/${key}/`, {
    title: `${p.name} · ${p.zi} — ${p.sub} | minnan.org`,
    description: copy.lead,
    current: key,
    css,
    main,
  });
}

/* ----------------------------------------------------------- Port pages */
export function portPage(pt, { stories, words, css }) {
  const portWords = pt.code === 'ALL' ? words.filter((w) => w.ports.includes('ALL')) : words.filter((w) => w.ports.includes(pt.code));
  const list = pt.key === 'everywhere' ? stories : stories.filter((s) => s.ports.includes(pt.key));
  const others = PORTS.filter((o) => o.key !== pt.key)
    .map((o) => `<a href="/ports/${o.key}/">${o.old} ${esc(o.short)}</a>`)
    .join(' · ');
  const main = `${glyphHero({ glyph: pt.old, title: esc(pt.name), lead: esc(pt.lead), tone: 'brick', crumb: `<a href="/#ports">Choose your port</a>` })}
<div class="page-body">
  <div class="wrap">
    <div class="page-section">
      <h2><span class="zi">鄉音</span>Words you will hear here</h2>
      ${portWords.length ? wordbook(portWords, { filters: false }) : '<p class="empty-note">Words from this port are being gathered for the wordbook.</p>'}
      <a class="text-link" href="/tongue/#wordbook">The full wordbook</a>
    </div>
    <div class="page-section">
      <h2><span class="zi">故事</span>Stories from this port</h2>
      ${storyList(list, { empty: 'The first story from this port is being written. Subscribe below and it will reach you first.' })}
    </div>
    <div class="page-section">
      <p class="measure">Other ports: ${others}</p>
    </div>
  </div>
</div>
${newsletter({ source: 'port-' + pt.key })}`;
  return page(`/ports/${pt.key}/`, {
    title: `${pt.name} · ${pt.old} — Hokkien heritage | minnan.org`,
    description: pt.lead,
    css,
    main,
  });
}

/* ------------------------------------------------------------- Stories */
export function storiesIndex({ stories, css }) {
  const main = `${glyphHero({ glyph: '讀', title: 'Stories', sub: 'One story a week, for every port.', lead: 'Surnames traced, words decoded, temples connected, dishes remembered, letters read aloud.' })}
<div class="page-body tight">
  <div class="wrap">
    <div class="page-section">${storyList(stories)}</div>
  </div>
</div>
${newsletter({ source: 'stories' })}`;
  return page('/stories/', { title: 'Stories | minnan.org', description: 'Every story on minnan.org — Hokkien roots, language, faith, food, houses and letters across the sea.', css, main });
}

export function storyPage(s, { stories, css }) {
  const p = pillar(s.pillar);
  const related = stories.filter((o) => o.url !== s.url && (o.pillar === s.pillar || o.ports.some((x) => s.ports.includes(x)))).slice(0, 3);
  const main = `<header class="story-hero">
  <div class="wrap">
    <div class="kicker">${p.zi} · ${esc(s.tag)}</div>
    <h1>${esc(s.title)}</h1>
    ${s.standfirst ? `<p class="standfirst">${esc(s.standfirst)}</p>` : ''}
    <p class="meta"><a href="/${p.key}/">${p.name}</a> · <time datetime="${s.date}">${fmtDate(s.date)}</time> · ${s.minutes} min read</p>
  </div>
</header>
<svg class="ridge" viewBox="0 0 1200 46" preserveAspectRatio="none" aria-hidden="true"><path d="M0,46 L0,30 Q60,2 130,26 L600,38 L1070,26 Q1140,2 1200,30 L1200,46 Z" fill="#8f382f"/><path d="M0,46 L0,34 Q60,8 130,30 L600,42 L1070,30 Q1140,8 1200,34 L1200,46 Z" fill="#f5ecdd"/></svg>
<article class="prose">
  <div class="wrap">
${s.html}
    <div class="endnote">
      <p><span class="tc">知影你對佗位來</span> — Know where you come from.</p>
      <p>Trace where your own family’s words came from — start with your surname at <a href="/roots/">Roots 根</a>, or look up what your grandmother was saying in the <a href="/tongue/#wordbook">wordbook 音</a>.</p>
    </div>
  </div>
</article>
${related.length ? `<section class="story-more"><div class="wrap"><h2>Keep reading</h2>${storyList(related)}</div></section>` : ''}
${newsletter({ source: 'story-' + s.slug })}`;
  return page(s.url, {
    title: `${s.seoTitle || s.title} | minnan.org`,
    ogTitle: s.title,
    description: s.description,
    ogType: 'article',
    ogImage: s.image || SITE.ogImage,
    current: s.pillar,
    css,
    main,
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: s.title,
      description: s.description,
      datePublished: s.date,
      dateModified: s.updated || s.date,
      mainEntityOfPage: SITE.url + s.url,
      image: SITE.url + (s.image || SITE.ogImage),
      publisher: { '@type': 'Organization', name: 'minnan.org', url: SITE.url },
      inLanguage: 'en',
    },
  });
}

/* --------------------------------------------------------------- About */
export function about({ credits, css }) {
  const rows = credits
    .map(
      (c) => `<tr><td>${esc(c.subject)}<br><code>${esc(c.local_file.replace(/^assets\//, '/assets/'))}</code></td><td>${esc(c.creator)}</td><td>${esc(c.source_platform)}<br>${esc(c.source_title)}</td><td>${esc(c.license)}</td><td>${esc(c.changes)}</td></tr>`
    )
    .join('\n');
  const main = `${glyphHero({ glyph: '咱', title: 'About minnan.org', sub: 'Lán-nâng ê le̍k-sú, lán-nâng ka-tī siá.', lead: 'Our people’s history, written by our own people. An independent cultural project for descendants of the Hokkien world, wherever the family landed.' })}
<div class="page-body">
  <div class="wrap">
    <div class="page-section">
      <h2><span class="zi">宗旨</span>What this is</h2>
      <p>minnan.org documents Hokkien heritage — ancestral villages, language, faith, food, houses, migration, temples, family memory, and letters across the sea — for descendants across the Philippines, Malaysia, Singapore, Indonesia, Taiwan, and beyond. It is written first for the generation that may no longer read the old script, but still wants to know what it said.</p>
    </div>
    <div class="page-section">
      <h2><span class="zi">守則</span>How we work</h2>
      <ol class="steps">
        <li><b>Every claim has a source.</b><span>Where scholars disagree — as they do about ketchup — we say so in the story.</span></li>
        <li><b>Every document keeps its real origin.</b><span>A qiaopi from Chao’an is labelled as Chao’an. We will not label a Chaoshan document as Minnan.</span></li>
        <li><b>Every image is credited.</b><span>We use our own artwork and openly licensed photographs, credited in full below.</span></li>
        <li><b>Minnan is living, not frozen.</b><span>We record the past, the present and the next generation together.</span></li>
      </ol>
      <p>Hokkien is written here in Traditional characters with Pe̍h-ōe-jī romanisation, the system most often found in older church, dictionary and family materials across Southeast Asia.</p>
    </div>
    <div class="page-section" id="credits">
      <h2><span class="zi">圖片</span>Image credits</h2>
      <div class="table-scroll">
      <table class="sources">
        <thead><tr><th>Image</th><th>Creator</th><th>Source</th><th>License</th><th>Changes</th></tr></thead>
        <tbody>
${rows}
        </tbody>
      </table>
      </div>
      <p>Derivatives of CC BY-SA images remain available under CC BY-SA 4.0.</p>
    </div>
  </div>
</div>
${newsletter({ source: 'about' })}`;
  return page('/about/', { title: 'About & sources | minnan.org', description: 'How minnan.org works: sourcing, origins, image credits and romanisation.', css, main });
}

/* --------------------------------------------------- Thanks and 404 */
export function thanks({ css }) {
  const main = `<section class="lost"><div class="wrap" data-thanks>
    <div class="eyebrow">春風 · 一週一批</div>
    <h1 class="sec" style="font-family:var(--serif-en);font-weight:500;font-size:clamp(2.4rem,5vw,3.8rem);line-height:1.05">You’re on the list.</h1>
    <p>The next Chhun-hong letter will come to your inbox.</p>
    <a class="text-link" href="/stories/">Read the stories while you wait</a>
  </div></section>`;
  return page('/thanks/', { title: 'Thank you | minnan.org', css, main, noindex: true });
}

export function notFound({ css }) {
  const main = `${glyphHero({ glyph: '迷', title: 'This road doesn’t lead home.', lead: 'The page you were looking for isn’t here. It may have moved when the site was rebuilt.' })}
<div class="page-body tight"><div class="wrap"><div class="page-section">
  <p>Try the <a class="text-link" style="margin:0" href="/">homepage</a>, the <a class="text-link" style="margin:0" href="/stories/">stories</a>, or the <a class="text-link" style="margin:0" href="/tongue/#wordbook">wordbook</a>.</p>
</div></div></div>`;
  return page('/404.html', { title: 'Page not found | minnan.org', css, main, noindex: true });
}

// minnan.org build: Markdown stories + page templates → static site in dist/.
//   node build.mjs           build once
//   node build.mjs --serve   build, serve on http://localhost:4321, rebuild on change
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Marked } from 'marked';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const p = (...x) => path.join(ROOT, ...x);

/* ---------- Front matter: a small, strict subset of YAML ---------- */
function parseFrontMatter(src, file) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: missing front matter (--- ... ---)`);
  const data = {};
  for (const raw of m[1].split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const i = line.indexOf(':');
    if (i < 1) throw new Error(`${file}: cannot read front matter line "${raw}"`);
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    } else {
      val = val.replace(/^["'](.*)["']$/, '$1');
      data[key] = val === 'true' ? true : val === 'false' ? false : val;
    }
  }
  return { data, body: m[2] };
}

/* ---------- Markdown ---------- */
const HAN = /^[\p{Script=Han}\s]+$/u;
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');

function makeMarked() {
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      // "## 字源 · The word before the roll" → small gold characters above the English heading
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const split = html.split(' · ');
        if (depth === 2 && split.length > 1 && HAN.test(split[0])) {
          const title = split.slice(1).join(' · ');
          return `<h2 id="${slugify(title)}"><span class="zi">${split[0]}</span>${title}</h2>\n`;
        }
        return `<h${depth} id="${slugify(html)}">${html}</h${depth}>\n`;
      },
    },
  });
  return marked;
}

/* ---------- Content ---------- */
const PILLAR_KEYS = ['roots', 'tongue', 'faith', 'taste', 'houses', 'letters'];
const PORT_KEYS = ['philippines', 'malaysia', 'singapore', 'indonesia', 'everywhere'];

function loadStories() {
  const dir = p('content', 'stories');
  const marked = makeMarked();
  const stories = [];
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.md') || name.startsWith('_')) continue;
    const file = path.join('content', 'stories', name);
    const { data, body } = parseFrontMatter(fs.readFileSync(path.join(dir, name), 'utf8'), file);
    if (data.draft === true) continue;
    for (const req of ['title', 'description', 'pillar', 'tag', 'date']) {
      if (!data[req]) throw new Error(`${file}: front matter needs "${req}"`);
    }
    if (!PILLAR_KEYS.includes(data.pillar)) throw new Error(`${file}: pillar must be one of ${PILLAR_KEYS.join(', ')}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error(`${file}: date must look like 2026-07-15`);
    const ports = data.ports || [];
    for (const pt of ports) if (!PORT_KEYS.includes(pt)) throw new Error(`${file}: unknown port "${pt}" (use ${PORT_KEYS.join(', ')})`);
    const slug = data.slug || name.replace(/\.md$/, '');
    let html = marked.parse(body);
    html = html.replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, '</table></div>');
    const words = body.replace(/[#>*_|`-]/g, ' ').split(/\s+/).filter(Boolean).length;
    stories.push({
      ...data,
      slug,
      also: data.also || [],
      ports,
      url: `/${data.pillar}/${slug}/`,
      html,
      minutes: Math.max(1, Math.round(words / 220)),
    });
  }
  return stories.sort((a, b) => b.date.localeCompare(a.date));
}

function loadCsv(file) {
  const text = fs.readFileSync(file, 'utf8').trim();
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    const cells = [];
    let cur = '', q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') q = false;
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ',') { cells.push(cur); cur = ''; }
      else cur += c;
    }
    cells.push(cur);
    rows.push(cells);
  }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

/* ---------- Output helpers ---------- */
function write(rel, content) {
  const out = rel.endsWith('/') ? path.join(DIST, rel, 'index.html') : path.join(DIST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
}

function copyDir(from, to) {
  for (const ent of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, ent.name), b = path.join(to, ent.name);
    if (ent.isDirectory()) { fs.mkdirSync(b, { recursive: true }); copyDir(a, b); }
    else fs.copyFileSync(a, b);
  }
}

const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- Build ---------- */
async function build() {
  const t0 = Date.now();
  // Fresh imports so --serve picks up template edits.
  const bust = `?t=${t0}`;
  const imp = (rel) => import(pathToFileURL(p(rel)).href + bust);
  const { SITE, PILLARS, PORTS } = await imp('src/data/site.mjs');
  const pages = await imp('src/templates/pages.mjs');
  const shop = await imp('src/templates/shop.mjs');
  const { ITEMS } = await imp('src/data/shop.mjs');

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  copyDir(p('public'), DIST);

  // Fingerprinted stylesheet so it can be cached forever.
  const cssText = fs.readFileSync(p('src', 'styles', 'site.css'), 'utf8');
  const hash = crypto.createHash('sha256').update(cssText).digest('hex').slice(0, 10);
  const css = `/styles/site.${hash}.css`;
  write(css.slice(1), cssText);

  const stories = loadStories();
  const words = JSON.parse(fs.readFileSync(p('src', 'data', 'words.json'), 'utf8'));
  const credits = loadCsv(p('src', 'data', 'image-rights.csv'));
  const ctx = { stories, words, credits, css };

  const out = [
    pages.home(ctx),
    ...PILLARS.map((pl) => pages.sectionPage(pl.key, ctx)),
    ...PORTS.map((pt) => pages.portPage(pt, ctx)),
    pages.storiesIndex(ctx),
    ...stories.map((s) => pages.storyPage(s, ctx)),
    shop.shopIndex(ctx),
    ...ITEMS.map((it) => shop.itemPage(it, ctx)),
    shop.policyPage(ctx),
    shop.contactPage(ctx),
    pages.about(ctx),
    pages.thanks(ctx),
    pages.notFound(ctx),
  ];
  for (const pg of out) write(pg.path === '/' ? '/' : pg.path.replace(/^\//, ''), pg.html);

  // Old address of the first story keeps working on any host.
  for (const s of stories) {
    write(`${s.pillar}/${s.slug}.html`, `<!DOCTYPE html><meta charset="utf-8"><title>${xml(s.title)}</title><link rel="canonical" href="${SITE.url}${s.url}"><meta http-equiv="refresh" content="0; url=${s.url}"><a href="${s.url}">${xml(s.title)}</a>`);
  }

  // Sitemap
  const today = new Date().toISOString().slice(0, 10);
  const urls = out
    .filter((pg) => !['/thanks/', '/404.html'].includes(pg.path))
    .map((pg) => {
      const s = stories.find((x) => x.url === pg.path);
      return `  <url><loc>${SITE.url}${pg.path}</loc><lastmod>${s ? s.updated || s.date : today}</lastmod></url>`;
    });
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);

  // RSS — also lets a newsletter service send each new story automatically.
  const items = stories
    .map(
      (s) => `  <item>
    <title>${xml(s.title)}</title>
    <link>${SITE.url}${s.url}</link>
    <guid>${SITE.url}${s.url}</guid>
    <pubDate>${new Date(s.date + 'T08:00:00+08:00').toUTCString()}</pubDate>
    <description>${xml(s.summary || s.description)}</description>
  </item>`
    )
    .join('\n');
  write('rss.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>minnan.org — stories</title>
  <link>${SITE.url}/</link>
  <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>
  <description>${xml(SITE.description)}</description>
  <language>en</language>
${items}
</channel>
</rss>
`);

  console.log(`Built ${out.length} pages (${stories.length} stories) in ${Date.now() - t0} ms → dist/`);
}

/* ---------- Dev server ---------- */
function serve() {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };
  http
    .createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      if (url.startsWith('/api/')) {
        res.writeHead(200, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ status: 'closed' }));
      }
      let file = path.join(DIST, url);
      if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file)) { res.writeHead(404, { 'content-type': types['.html'] }); return res.end(fs.readFileSync(path.join(DIST, '404.html'))); }
      res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    })
    .listen(4321, () => console.log('Preview at http://localhost:4321 (Ctrl+C to stop)'));
  let timer;
  for (const dir of ['content', 'src', 'public']) {
    fs.watch(p(dir), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => build().catch((e) => console.error('Build failed:', e.message)), 150);
    });
  }
}

await build();
if (process.argv.includes('--serve')) serve();

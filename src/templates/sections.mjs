// Content blocks shared between the homepage and the section pages.
import { esc } from './layout.mjs';
import { PORTS, portByCode } from '../data/site.mjs';

export const archGrid = () => `<div class="arch-grid">
      <article class="arch-card"><div class="mark">燕</div><h3>Swallow-tail rooflines</h3><p>Even those who do not know the name often recognise the rising roofline immediately — a remembered outline of southern Fujian.</p></article>
      <article class="arch-card"><div class="mark">磚</div><h3>Rouge-red brick</h3><p>Not a flat bright red, but a warm color shaped by clay, salt air, sunlight, repair, and time.</p></article>
      <article class="arch-card"><div class="mark">石</div><h3>Brick set into stone</h3><p>出磚入石 weaves red brick and pale stone into one wall — practical coastal masonry with an unmistakable rhythm.</p></article>
      <article class="arch-card"><div class="mark">花</div><h3>Flower tiles</h3><p>Patterns beside doors, windows, halls, and thresholds gave ordinary homes color, order, and quiet celebration.</p></article>
      <article class="arch-card"><div class="mark">厝</div><h3>Lived-in details</h3><p>Bird-resting details, eaves, stone thresholds, door courts, carved windows, altars, and traces of daily life made a house feel inhabited.</p></article>
    </div>`;

export const homeQuote = () =>
  `<blockquote class="home-quote">很多人還沒想起一句完整的鄉音，先想起的是房子的樣子。燕尾脊、胭脂磚、出磚入石、花磚、鳥踏、門埕與神龕。<strong>真正令人想家的，往往是祖厝裡那些熟悉的小地方。</strong></blockquote>`;

export const houseGallery = () => `<div class="house-gallery">
      <article class="media-card">
        <figure>
          <img src="/assets/images/quanzhou-home-courtyard.webp" alt="Courtyard of the historic home of Li Zhi in Quanzhou" loading="lazy" decoding="async" width="1280" height="853">
          <figcaption>Courtyard of the Home of Li Zhi, Quanzhou, Fujian. Photo: Zhangzhugang / Wikimedia Commons, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>. Resized for web display. <a href="https://commons.wikimedia.org/wiki/File:Quanzhou_Li_Zhi_Guju_20120229-2.jpg" target="_blank" rel="noopener">Original source</a>.</figcaption>
        </figure>
      </article>
      <div class="photo-stack">
        <article class="media-card">
          <figure>
            <img src="/assets/images/quanzhou-home-interior.webp" alt="Timber roof and family hall interior at the historic home of Li Zhi in Quanzhou" loading="lazy" decoding="async">
            <figcaption>Interior roof structure, Home of Li Zhi, Quanzhou. Photo: Zhangzhugang / Wikimedia Commons, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>. Resized and display-cropped. <a href="https://commons.wikimedia.org/wiki/File:Quanzhou_Li_Zhi_Guju_20120229-4.jpg" target="_blank" rel="noopener">Original source</a>.</figcaption>
          </figure>
        </article>
        <article class="media-card">
          <figure>
            <img src="/assets/images/minnan-house-hero.svg" alt="Designed illustration highlighting Minnan roof, red brick, stonework and flower tiles" loading="lazy" decoding="async">
            <figcaption>Original minnan.org illustration combining several recurring Minnan visual motifs: swallow-tail rooflines, rouge brick, brick-and-stone masonry, flower tiles, door couplets, and the family hall.</figcaption>
          </figure>
        </article>
      </div>
    </div>`;

export const registry = () =>
  `<aside class="registry"><strong>Documentary heritage:</strong> Qiaopi and Yinxin — letters, reports, account books and remittance receipts — were entered in UNESCO’s Memory of the World International Register in 2013. <a href="https://www.unesco.org/en/memory-world/qiaopi-and-yinxin-correspondence-and-remittance-documents-overseas-chinese" target="_blank" rel="noopener">Read the UNESCO record</a>.</aside>`;

export const qiaopiGallery = () => `<div class="qiaopi-gallery">
      <article class="qiaopi-card">
        <img src="/assets/images/qiaopi-chaoan-mother.webp" alt="Historic qiaopi remittance documents addressed to a mother in Chao'an" loading="lazy" decoding="async" width="1800" height="1011">
        <div class="caption"><h3>To Mother, across the sea</h3><p>An open-license photograph of qiaopi addressed to a mother in Bailian village, Chao’an, recording a remittance of HK$900. The paper bears the marks of handling, routing, annotation, and use — not an abstract history, but a family transaction that survived.</p><small class="credit">Collection photographed at Chaozhou Museum. Photo: 三猎 / Wikimedia Commons, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>. Resized and display-cropped; derivative image remains under CC BY-SA 4.0. <a href="https://commons.wikimedia.org/wiki/File:%E4%BE%A8%E6%89%B91.jpg" target="_blank" rel="noopener">Original file and metadata</a>.</small></div>
      </article>
      <article class="qiaopi-card portrait">
        <img src="/assets/images/qiaopi-singapore-wife.webp" alt="Historic qiaopi sent from Singapore to a wife in Chao'an" loading="lazy" decoding="async">
        <div class="caption"><h3>From 石叻 to a wife at home</h3><p>This qiaopi records a HK$50 remittance connected with Singapore — historically written 石叻 — and addressed to a wife in Houguo village, Chao’an. The recipient’s name dominates the worn paper: one person, one household, one waiting address.</p><small class="credit">Collection photographed at Chaozhou Museum. Photo: 三猎 / Wikimedia Commons, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>. Resized and display-cropped; derivative image remains under CC BY-SA 4.0. <a href="https://commons.wikimedia.org/wiki/File:%E4%BE%A8%E6%89%B92.jpg" target="_blank" rel="noopener">Original file and metadata</a>.</small></div>
      </article>
    </div>
    <p class="archive-caution"><strong>Archive note:</strong> These two openly licensed examples come from Chao’an and represent the wider qiaopi tradition of China’s southeastern coast. minnan.org will distinguish each document’s actual origin and will prioritize clearly sourced Fujian, Quanzhou, Jinjiang, Xiamen, Zhangzhou, and Southeast Asian materials as the archive grows. We will not label a Chaoshan document as Minnan.</p>`;

export const portLinks = () => `<div class="port-list">
${PORTS.map((p) => `      <a class="port" href="/ports/${p.key}/"><span class="tc">${p.old}</span><h3>${esc(p.name)}</h3><p>${esc(p.card)}</p></a>`).join('\n')}
    </div>`;

// The wordbook table. Filters are progressive: without JS every word shows.
export function wordbook(words, { filters = true } = {}) {
  const where = (codes) =>
    codes.map((c) => (c === 'ALL' ? 'Everywhere' : portByCode(c)?.short || c)).join(', ');
  const rows = words
    .map(
      (w) => `      <tr data-ports="${w.ports.join(' ')}">
        <td class="said">${esc(w.said)}</td>
        <td><span class="hz">${esc(w.hanzi)}</span><span class="poj">${esc(w.poj)}</span></td>
        <td>${esc(w.meaning)}${w.note ? `<span class="note">${esc(w.note)}</span>` : ''}${w.story ? `<span class="note"><a href="${w.story}">Read the story</a></span>` : ''}</td>
        <td class="where">${esc(where(w.ports))}</td>
      </tr>`
    )
    .join('\n');
  const tools = filters
    ? `<div class="wb-tools">
      <div class="wb-filter" role="group" aria-label="Filter by port">
        <button type="button" data-port-filter="all" aria-pressed="true">All ports</button>
        ${PORTS.filter((p) => p.code !== 'ALL').map((p) => `<button type="button" data-port-filter="${p.code}" aria-pressed="false">${p.short}</button>`).join('\n        ')}
      </div>
      <label class="visually-hidden" for="word-search">Search the wordbook</label>
      <input class="wb-search" id="word-search" type="search" placeholder="Search a word, character or meaning" data-word-search>
      <span class="wb-count" data-word-count aria-live="polite"></span>
    </div>`
    : '';
  return `${tools}
    <table class="wordbook"${filters ? ' data-wordbook' : ''}>
      <thead><tr><th scope="col">You say</th><th scope="col">In Hokkien</th><th scope="col">Meaning</th><th scope="col">Heard in</th></tr></thead>
      <tbody>
${rows}
      </tbody>
    </table>`;
}

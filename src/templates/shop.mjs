// 回批 · The reply from home — shop, item, policy and contact pages.
import { layout, esc, glyphHero, peopleLinks, contact } from './layout.mjs';
import { SHOP, ITEMS, boxes, services } from '../data/shop.mjs';
import { SITE } from '../data/site.mjs';

const page = (path, opts) => ({ path, html: layout({ path, ...opts }) });
const STATUS = { preorder: 'Pre-order', soon: 'Coming soon' };

/* An item drawn as a qiaopi envelope: the red-framed strip carries the Chinese name,
   the stamp carries the item's character. */
export function envelope(it, { link = true, big = false } = {}) {
  const tag = link ? 'a' : 'div';
  const href = link ? ` href="/shop/${it.key}/"` : '';
  return `<${tag} class="env${big ? ' big' : ''}"${href}>
  <span class="env-strip" aria-hidden="true"><span class="v">${[...it.zh].map((c) => `<i>${c}</i>`).join('')}</span></span>
  <span class="env-stamp" aria-hidden="true">${it.glyph}</span>
  <span class="env-body">
    ${big ? '' : `<span class="env-kind">${it.type === 'service' ? 'Service' : 'Sent from Fujian'}${STATUS[it.status] ? ` · ${STATUS[it.status]}` : ''}</span>`}
    ${big ? `<span class="env-post">回批 · MINNAN · ${it.type === 'service' ? 'WORLDWIDE' : 'SG · MY · PH'}</span>` : `<h3>${esc(it.name)}</h3>
    <span class="env-lead">${esc(it.lead)}</span>
    <span class="env-price">${esc(it.priceLabel)}</span>`}
  </span>
</${tag}>`;
}

export const envelopeRow = (items) => `<div class="env-grid">\n${items.map((i) => envelope(i)).join('\n')}\n</div>`;

/* Homepage section, placed right after "Some houses were built one letter at a time." */
export function homeReply() {
  return `<section class="reply" id="send">
  <div class="wrap">
    <div class="reply-head">
      <div>
        <div class="eyebrow">回批 · THE REPLY FROM HOME</div>
        <h2 class="sec">Now home writes back.</h2>
      </div>
      <p class="sec-lead">For a hundred years, letters and money went home across the sea. In return, the family sent a 回批 — a reply to say it had arrived, and that they were well. We pack the tastes of southern Fujian in the same spirit, with a red card carrying your words, and send them to the family overseas.</p>
    </div>
    ${envelopeRow(boxes())}
    <div class="reply-services">
      <p><strong>Also from the home side:</strong> we read the old writing your family kept, and we help you find the village.</p>
      <div class="reply-links">${services().map((s) => `<a href="/shop/${s.key}/"><span>${s.zh}</span>${esc(s.name)} · ${esc(s.priceLabel)}</a>`).join('')}</div>
    </div>
    <a class="text-link" href="/shop/">See everything we send →</a>
  </div>
</section>`;
}

/* Short block for section pages (taste, letters, roots). */
export function shopTeaser(keys, { heading, zi, text }) {
  const list = keys.map((k) => ITEMS.find((i) => i.key === k)).filter(Boolean);
  return `<div class="page-section">
      <h2><span class="zi">${zi}</span>${heading}</h2>
      ${text ? `<p>${text}</p>` : ''}
      ${envelopeRow(list)}
    </div>`;
}

/* ---------------------------------------------------------------- /shop/ */
export function shopIndex({ css }) {
  const main = `${glyphHero({
    glyph: '寄',
    title: 'The reply from home',
    sub: '回批 · Sent from southern Fujian to the family overseas.',
    lead: 'A 回批 was the letter the family at home sent back across the sea. Each box we send carries one: a red card with your words, written by hand in Chinese.',
    tone: 'brick',
  })}
<div class="page-body">
  <div class="wrap">
    <div class="page-section">
      <h2><span class="zi">家味</span>Boxes</h2>
      <p>Packed in Fujian. Shipping to Singapore, Malaysia and the Philippines is included. For anywhere else, ask first and we will quote.</p>
      ${envelopeRow(boxes())}
      <p class="fine-note">No meat, no eggs, no fresh food — only sealed, shelf-stable food sent in amounts for a family’s own table. <a href="/shop/policy/">What we send, and why</a>.</p>
    </div>
    <div class="page-section">
      <h2><span class="zi">家事</span>Services</h2>
      <p>For the family papers nobody can read any more, and for the village nobody remembers the name of.</p>
      ${envelopeRow(services())}
    </div>
    <div class="page-section">
      <h2><span class="zi">怎樣買</span>How ordering works</h2>
      <ol class="steps">
        <li><b>Send an order request</b><span>From any item page, or message us directly. No payment yet.</span></li>
        <li><b>We confirm within ${SHOP.replyWithin}</b><span>The address, the message for your card, and the delivery date — on WhatsApp, WeChat or email.</span></li>
        <li><b>Pay by PayPal link</b><span>With a card or a PayPal account. PayPal’s buyer protection applies.</span></li>
        <li><b>We pack, write your card and send it</b><span>You get the tracking number the day it ships.</span></li>
      </ol>
      ${peopleLinks({ text: 'Hello minnan.org, I would like to order: ' })}
    </div>
  </div>
</div>`;
  return page('/shop/', {
    title: '回批 · The reply from home — Hokkien food boxes and family services | minnan.org',
    description: 'Misua for a birthday, tikoy for New Year, tea from Anxi — packed in southern Fujian and sent to Hokkien families in Singapore, Malaysia and the Philippines. Plus readings of old family letters and help finding your village.',
    current: 'shop',
    css,
    main,
  });
}

/* --------------------------------------------------------- /shop/<item>/ */
function orderForm(it) {
  const isBox = it.type === 'box';
  const countries = [...SHOP.boxCountries, ...SHOP.askCountries];
  const waText = `Hello minnan.org, I would like to order: ${it.name} (${it.zh}).`;
  if (it.status === 'soon') {
    return `<div class="order-card"><p>Not ready yet. Subscribe to the weekly letter and you will hear first.</p><a class="text-link" href="#subscribe">Subscribe</a></div>`;
  }
  return `<form class="order-card" action="/api/order" method="post" data-order>
      <input type="hidden" name="item" value="${it.key}">
      <h2>${isBox ? 'Send an order request' : 'Ask for a reading'}</h2>
      <p class="order-sub">No payment now. We reply within ${SHOP.replyWithin} to confirm, then send a PayPal link (card or PayPal).</p>
      <div class="field-row">
        ${isBox ? `<label class="field narrow"><span>Boxes</span><select name="qty">${[1, 2, 3, 4, 5].map((n) => `<option>${n}</option>`).join('')}</select></label>` : ''}
        <label class="field"><span>${isBox ? 'Send to' : 'Where you live'}</span><select name="country" required>
          <option value="">Choose a country</option>
          ${countries.map((c) => `<option>${c}</option>`).join('')}
        </select></label>
      </div>
      <label class="field"><span>Your name</span><input name="name" autocomplete="name" required maxlength="80"></label>
      <label class="field"><span>Email</span><input type="email" name="email" autocomplete="email" required maxlength="120"><small>The PayPal link goes here.</small></label>
      <label class="field"><span>WhatsApp or WeChat <em>(optional)</em></span><input name="im" maxlength="80" placeholder="+65 9123 4567, or a WeChat ID"></label>
      ${isBox
        ? `<label class="field"><span>Your message for the red card <em>(optional)</em></span><textarea name="message" rows="3" maxlength="240" placeholder="e.g. Happy 80th birthday, Ama. From all of us in Manila."></textarea><small>We write it by hand in Chinese. Write it in any language.</small></label>`
        : `<label class="field"><span>What do you have?</span><textarea name="message" rows="4" maxlength="1200" required placeholder="${it.key === 'read-a-letter' ? 'e.g. Three letters from my great-grandfather in Manila to Jinjiang, around 1930. Two pages each.' : 'e.g. Surname Tan (陳). Grandfather came to Penang in 1948. His tombstone says 南安.'}"></textarea><small>You will send the photos on WhatsApp or by email after we reply.</small></label>`}
      <label class="hp" aria-hidden="true">Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
      <button type="submit">${isBox ? 'Send order request' : 'Ask for a reading'}</button>
      <p class="order-status" role="status" aria-live="polite"></p>
      ${it.paypal ? `<p class="order-alt">Already sure? <a href="${esc(it.paypal)}" target="_blank" rel="noopener">Pay now with PayPal · ${esc(it.priceLabel)}</a></p>` : ''}
      ${contact().any ? `<div class="order-alt"><span>Prefer to message?</span>${peopleLinks({ text: waText, cls: 'im-links small' })}</div>` : ''}
    </form>`;
}

export function itemPage(it, { css }) {
  const isBox = it.type === 'box';
  const others = ITEMS.filter((o) => o.key !== it.key && o.type === it.type);
  const main = `<section class="item-top">
  <div class="wrap item-grid">
    <div class="item-visual">
      ${envelope(it, { link: false, big: true })}
    </div>
    <div class="item-copy">
      <p class="crumb"><a href="/shop/">回批 · The reply from home</a></p>
      <h1>${esc(it.name)}</h1>
      <p class="item-zh">${it.zh}${it.poj ? ` · <i>${esc(it.poj)}</i>` : ''}</p>
      <p class="item-price">${esc(it.priceLabel)}${STATUS[it.status] ? ` <span class="badge">${STATUS[it.status]}</span>` : ''}</p>
      <p class="item-price-note">${esc(it.priceNote)}</p>
      ${it.preorder ? `<p class="item-preorder">${esc(it.preorder)}</p>` : ''}
      <p class="item-lead">${esc(it.lead)}</p>
      ${it.contents ? `<h2 class="mini">In the box</h2><ul class="contents">${it.contents.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
      <dl class="facts">${it.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    </div>
  </div>
</section>
<div class="page-body">
  <div class="wrap item-lower">
    <div class="item-story">
      <h2><span class="zi">${isBox ? '來歷' : '做法'}</span>${isBox ? 'Why this box' : 'How it works'}</h2>
      <p>${esc(it.story)}</p>
      ${it.steps ? `<ol class="steps">${it.steps.map(([b, s]) => `<li><b>${esc(b)}</b><span>${esc(s)}</span></li>`).join('')}</ol>` : ''}
      ${isBox ? `<p class="fine-note">No meat, no eggs, no fresh food — sealed, shelf-stable food in amounts for a family’s own table. <a href="/shop/policy/">Shipping, customs and refunds</a>.</p>` : `<p class="fine-note">If we cannot read it or trace it, we tell you before you pay. <a href="/shop/policy/">Refunds</a>.</p>`}
      ${it.word ? `<p class="fine-note">Where the word <i>${esc(it.word)}</i> comes from: <a href="/tongue/#wordbook">the wordbook</a>.</p>` : ''}
    </div>
    ${orderForm(it)}
  </div>
  ${others.length ? `<div class="wrap"><div class="page-section"><h2><span class="zi">也可以</span>Also ${isBox ? 'sent from home' : 'from the home side'}</h2>${`<div class="env-grid">${others.map((o) => envelope(o)).join('')}</div>`}</div></div>` : ''}
</div>`;
  return page(`/shop/${it.key}/`, {
    title: `${it.name} · ${it.zh} — ${it.priceLabel} | minnan.org`,
    description: it.lead,
    current: 'shop',
    css,
    main,
    jsonld: {
      '@context': 'https://schema.org',
      '@type': isBox ? 'Product' : 'Service',
      name: `${it.name} (${it.zh})`,
      description: it.lead,
      url: `${SITE.url}/shop/${it.key}/`,
      ...(isBox
        ? { brand: { '@type': 'Brand', name: 'minnan.org' }, offers: { '@type': 'Offer', price: String(it.price), priceCurrency: SHOP.currency, availability: it.status === 'preorder' ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock', url: `${SITE.url}/shop/${it.key}/` } }
        : { provider: { '@type': 'Organization', name: 'minnan.org', url: SITE.url }, offers: { '@type': 'Offer', price: String(it.price), priceCurrency: SHOP.currency } }),
    },
  });
}

/* ------------------------------------------------------------ /shop/policy/ */
export function policyPage({ css }) {
  const main = `${glyphHero({ glyph: '信', title: 'Shipping, customs and refunds', sub: 'What we send, where, and what happens if something goes wrong.', tone: 'ink' })}
<div class="page-body">
  <div class="wrap measure">
    <div class="page-section">
      <h2><span class="zi">寄什麼</span>What we send</h2>
      <p>Sealed, labelled, shelf-stable food from licensed producers in southern Fujian: dried noodles, sweets, rice cakes and tea. Each box is sized for a family’s own table — about 2 kg or less.</p>
      <p>We do not send meat or anything containing meat (including pork floss and dried meat), eggs, fresh or chilled food, or alcohol. Many countries do not allow these in parcels from China, so we leave them out.</p>
    </div>
    <div class="page-section">
      <h2><span class="zi">寄去哪</span>Where, and how long</h2>
      <p>Shipping to <strong>Singapore, Malaysia and the Philippines</strong> is included in the price and usually takes 7–12 days after payment. You get a tracking number the day the box ships. For other countries, ask first: we check the rules and quote before you pay.</p>
    </div>
    <div class="page-section">
      <h2><span class="zi">海關</span>Customs</h2>
      <p>Boxes are sent as gifts for the receiver’s own use, not for resale. Customs in any country may inspect a parcel. If a box is held, we help with the paperwork. If it is refused because of anything we chose to put in it, we refund you or send a new box.</p>
    </div>
    <div class="page-section">
      <h2><span class="zi">退款</span>Refunds</h2>
      <ul class="plain">
        <li><strong>Arrived damaged:</strong> send a photo within 7 days and we send a new box or refund you.</li>
        <li><strong>Lost in transit:</strong> if tracking shows no progress for 30 days, we refund you or send a new box.</li>
        <li><strong>Readings and village searches:</strong> we confirm before you pay that we can do it. If we then cannot deliver what we agreed, we refund you in full.</li>
        <li><strong>Changed your mind:</strong> before a box ships, we refund in full. Once it ships, we cannot take food back.</li>
      </ul>
    </div>
    <div class="page-section">
      <h2><span class="zi">付款</span>Payment and privacy</h2>
      <p>We take payment by PayPal link, with a card or a PayPal account; PayPal’s buyer protection applies. We use your address only to send your box, and your email and messages only to talk to you about your order.</p>
      ${peopleLinks({ text: 'Hello minnan.org, I have a question about shipping: ' })}
    </div>
  </div>
</div>`;
  return page('/shop/policy/', { title: 'Shipping, customs and refunds | minnan.org', description: 'What minnan.org sends, where, how long it takes, customs, and refunds.', current: 'shop', css, main });
}

/* --------------------------------------------------------------- /contact/ */
export function contactPage({ css }) {
  const c = contact();
  const main = `${glyphHero({ glyph: '問', title: 'Talk to us', sub: 'A person answers, usually within a day.', lead: 'Questions about a box, a reading, your family’s village, or a word your grandmother used. Write in English or 中文.', tone: 'ink' })}
<div class="page-body">
  <div class="wrap measure">
    <div class="page-section">
      <h2><span class="zi">傳話</span>Message us</h2>
      ${peopleLinks({ text: 'Hello minnan.org, ' }) || '<p class="empty-note">Contact details are being set up. Use the 問 button at the bottom of the page in the meantime.</p>'}
      ${c.email ? `<p>Email: <a class="text-link" style="margin:0" href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>` : ''}
    </div>
    ${c.wechat ? `<div class="page-section" id="wechat">
      <h2><span class="zi">微信</span>WeChat</h2>
      <p>Add us by WeChat ID: <strong class="copyable">${esc(c.wechat)}</strong> <button class="copy-btn" type="button" data-copy="${esc(c.wechat)}">Copy</button></p>
      ${c.wechatQr ? `<img class="wx-qr" src="${esc(c.wechatQr)}" alt="WeChat QR code for minnan.org" width="220" height="220" loading="lazy">` : ''}
    </div>` : ''}
    <div class="page-section">
      <h2><span class="zi">即問</span>Quick questions</h2>
      <p>The 問 button at the bottom right answers questions about Hokkien words, customs, boxes and shipping at any hour. For orders and anything about your own family, a person replies.</p>
    </div>
  </div>
</div>`;
  return page('/contact/', { title: 'Contact | minnan.org', description: 'Reach minnan.org on WhatsApp, WeChat, Messenger or email.', css, main });
}

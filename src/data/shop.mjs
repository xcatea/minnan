// 回批 · The reply from home — everything the shop sells.
// In the qiaopi tradition, a 回批 (hôe-phoe) was the reply letter the family at home
// sent back to the sender overseas. Every box here goes out with one.
//
// Prices are in US dollars and include shipping to the countries listed in `ships`.
// ⚠ Prices and box contents are DRAFTS — confirm with suppliers and shipping quotes before launch.
// `paypal`: optional PayPal payment link. When empty, customers send an order request
// and you reply with a payment link.
// `status`: 'available' | 'preorder' | 'soon' (soon = shown, but no order form).

export const SHOP = {
  currency: 'USD',
  // Countries boxes ship to without asking first.
  boxCountries: ['Singapore', 'Malaysia', 'Philippines'],
  // Shown in the country menu; orders to these get a quote first.
  askCountries: ['Indonesia', 'Taiwan', 'Brunei', 'Thailand', 'Australia', 'United States', 'Canada', 'United Kingdom', 'Other'],
  replyWithin: '24 hours',
};

export const ITEMS = [
  {
    key: 'long-life-box',
    type: 'box',
    glyph: '壽',
    name: 'The long-life box',
    zh: '長壽麵線盒',
    poj: 'tn̂g-siū mī-sòaⁿ',
    price: 39,
    priceLabel: 'US$39',
    priceNote: 'Shipping to Singapore, Malaysia and the Philippines included',
    status: 'available',
    lead: 'Hand-pulled misua from the Quanzhou coast, for an elder’s birthday — the way the family always did it.',
    story:
      'At a Hokkien birthday the noodles are never cut. Long misua means a long life, and in many families the eldest at the table is served first. This box sends the noodles themselves, and a red card with your message on it, written out by hand in Chinese.',
    contents: [
      'Hand-pulled misua (麵線), two bundles',
      'Xiamen peanut candy (貢糖)',
      'A red 回批 card with your message, handwritten in Chinese',
      'The story of misua, in English and Chinese',
    ],
    facts: [
      ['Weight', 'About 1 kg'],
      ['Arrives', 'About 7–12 days after payment'],
      ['Good for', 'Birthdays, especially an elder’s'],
    ],
    word: 'misua',
  },
  {
    key: 'new-year-box',
    type: 'box',
    glyph: '粿',
    name: 'The New Year box',
    zh: '年味盒',
    poj: 'nî-bī',
    price: 59,
    priceLabel: 'US$59',
    priceNote: 'Early price until 20 November. US$69 after. Shipping included',
    status: 'preorder',
    preorder: 'Order by 20 December. Ships the first week of January, in time for New Year on 6 February 2027.',
    lead: 'Sweet rice cake, Anxi tea, peanut candy and red envelopes — the New Year table, packed in Fujian and sent across the sea.',
    story:
      'Tikoy on the table, tea for the visitors, red envelopes for the children. In Manila, Penang and Singapore the Hokkien New Year still looks like this. The box carries the pieces that can travel, with a spring couplet for the door.',
    contents: [
      'Sweet rice cake (甜粿 · tikoy), vacuum-packed',
      'Anxi Tieguanyin tea, 50 g',
      'Xiamen peanut candy (貢糖)',
      'Hand-pulled misua',
      'Red envelopes and a spring couplet (春聯)',
      'A red 回批 card with your message',
    ],
    facts: [
      ['Weight', 'About 1.8 kg'],
      ['Order by', '20 December 2026'],
      ['Ships', 'First week of January 2027'],
    ],
    word: 'tikoy',
  },
  {
    key: 'anxi-tea',
    type: 'box',
    glyph: '茶',
    name: 'Anxi Tieguanyin',
    zh: '安溪鐵觀音',
    poj: 'An-khe thih-koan-im',
    price: 29,
    priceLabel: 'US$29',
    priceNote: 'Shipping included',
    status: 'available',
    lead: 'Oolong from the hills of Anxi, the county that sent its tea — and its people — to every Hokkien port.',
    story:
      'Anxi families carried tea shops to Southeast Asia along with their surnames. A tin of Tieguanyin is still the first thing many families put out for a guest. This one comes straight from Anxi, with a card on brewing it gongfu-style or simply in a mug.',
    contents: ['150 g Tieguanyin in a tin, from Anxi', 'A brewing card: gongfu style and mug style', 'A 回批 card with your message'],
    facts: [
      ['Weight', 'About 0.4 kg'],
      ['Arrives', 'About 7–12 days after payment'],
    ],
  },
  {
    key: 'read-a-letter',
    type: 'service',
    glyph: '讀',
    name: 'Read my family’s writing',
    zh: '讀批',
    poj: 'tha̍k-phoe',
    price: 25,
    priceLabel: 'From US$25',
    priceNote: 'Tombstone or ancestral tablet US$25 · Letter US$39 for the first page, US$15 for each page after',
    status: 'available',
    lead: 'A qiaopi, a letter, a tombstone, an ancestral tablet. Send a photo and we send back every word, in English, with what it tells you about your family.',
    story:
      'Many families keep papers nobody at home can read any more. Old handwriting, Hokkien phrasing and place names that have since changed make them hard even for Chinese readers. We transcribe the text, translate it, and explain the names, places and dates in it.',
    steps: [
      ['Send the photos', 'On WhatsApp or by email — both sides of every page, as sharp as you can.'],
      ['We confirm the price', 'Before you pay. If the writing is too damaged to read, we say so and you pay nothing.'],
      ['Pay with PayPal', 'Card or PayPal, by payment link.'],
      ['Receive your reading', 'Within 7 days: the original text, an English translation, and notes on names, places and dates.'],
    ],
    facts: [
      ['Delivered as', 'A PDF by email'],
      ['Turnaround', 'Within 7 days'],
      ['Available', 'Worldwide'],
    ],
  },
  {
    key: 'find-our-village',
    type: 'service',
    glyph: '根',
    name: 'Find our village',
    zh: '尋根',
    poj: 'chhōe-kin',
    price: 149,
    priceLabel: 'From US$149',
    priceNote: 'Written report. A visit to the village, with photographs, is quoted separately',
    status: 'available',
    lead: 'Tell us every fragment you have — a surname, a county, a temple, an old address. We trace it to a clan and a village and send a written report with sources and next steps.',
    story:
      'Most families hold more of the trail than they think: a county carved on a tombstone, an address on a qiaopi envelope, the name of the association a grandfather belonged to. We put the fragments together and check them against clan, county and association records.',
    steps: [
      ['Tell us what you have', 'Names, places, photos of documents and stones — anything.'],
      ['We tell you if it is enough', 'Before you pay. If there is not enough to go on, we say so.'],
      ['Pay with PayPal', 'By payment link.'],
      ['Receive your report', 'Within 3 weeks: the likely clan and village, the evidence for it, and who to contact next.'],
    ],
    facts: [
      ['Delivered as', 'A written report by email'],
      ['Turnaround', 'Within 3 weeks'],
      ['Available', 'Worldwide'],
    ],
  },
];

export const item = (key) => ITEMS.find((i) => i.key === key);
export const boxes = () => ITEMS.filter((i) => i.type === 'box');
export const services = () => ITEMS.filter((i) => i.type === 'service');

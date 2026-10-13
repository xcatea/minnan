// Site-wide data: the six pillars and the ports.
// Change wording here and every page that uses it updates on the next build.

export const SITE = {
  url: 'https://minnan.org',
  name: 'MINNAN',
  tagline: 'One language, a thousand ports.',
  description:
    'MINNAN reflects the authentic life of Minnan—past, present and future: roots, houses, language, faith, food, qiaopi and the stories carried across the seas.',
  ogImage: '/assets/images/minnan-home-real.webp',
};

export const PILLARS = [
  {
    key: 'roots', zi: '根', name: 'Roots', sub: 'Where you come from.',
    card: 'Trace a surname to a clan hall, and a clan hall to a village in Jinjiang, Shishi, Nan’an, Hui’an, Quanzhou, Zhangzhou, or somewhere nearby.',
    go: 'Start tracing',
  },
  {
    key: 'tongue', zi: '音', name: 'Tongue', sub: 'What your elders were saying.',
    card: 'Compare Manila Lannang-uè, Penang Hokkien, Singapore Hokkien, Medan Hokkien, and the speech of southern Fujian.',
    go: 'Open the wordbook',
  },
  {
    key: 'faith', zi: '信', name: 'Faith', sub: 'Who watched over the voyage.',
    card: 'Má-chó͘ 媽祖 at the harbour. Koan-kong 關公 in the shop. Chheng-chúi Chó͘-su 清水祖師 from the home county.',
    go: 'Meet the guardians',
  },
  {
    key: 'taste', zi: '味', name: 'Taste', sub: 'The flavor of the old country.',
    card: 'Misua for birthdays. Tikoy for New Year. Tea from Anxi. Food preserved memory long after a family forgot the road home.',
    go: 'Read the food stories',
  },
  {
    key: 'houses', zi: '厝', name: 'Houses', sub: 'The architecture of memory.',
    card: 'Swallow-tail roofs, rouge brick, stone set between brickwork, flower tiles and the family hall.',
    go: 'Walk through the house',
  },
  {
    key: 'letters', zi: '批', name: 'Letters', sub: 'What crossed the sea home.',
    card: 'Qiaopi carried news, money, duty, worry, and love between a port city and an ancestral village.',
    go: 'See the family letters',
  },
];

export const pillar = (key) => PILLARS.find((p) => p.key === key);

export const PORTS = [
  {
    key: 'philippines', code: 'PH', old: '呂宋', name: 'Lannang · Philippines', short: 'Philippines',
    card: 'Kinship, trade, faith, food, and language across Manila, Cebu, and ports throughout the Philippines.',
    lead: 'Most Chinese Filipinos trace their families to southern Fujian, and many still call themselves Lannang — 咱人, “our people.” Their Hokkien, Lannang-uè, lives on in Binondo’s streets, in family businesses, and in words every Filipino uses at the table.',
  },
  {
    key: 'malaysia', code: 'MY', old: '檳城', name: 'Penang & Malaysia', short: 'Malaysia',
    card: 'A Hokkien world of streets, wet markets, kitchens, temples, and neighborhood memory.',
    lead: 'In Penang, Hokkien was for generations the language of the street, the market and the clan jetty. Across Malaysia it lives on in kopitiam orders, temple festivals and family kitchens.',
  },
  {
    key: 'singapore', code: 'SG', old: '石叻', name: 'Singapore', short: 'Singapore',
    card: 'A multilingual city with Hokkien long woven into its Chinese associations, temples, food, and family life.',
    lead: 'Old letters wrote it 石叻. Hokkien families were among the largest Chinese communities in early Singapore, and their words still run through its hawker centres, temples and clan associations.',
  },
  {
    key: 'indonesia', code: 'ID', old: '棉蘭', name: 'Medan & Indonesia', short: 'Indonesia',
    card: 'A living Hokkien world shaped by northern Sumatra, trade networks, family, and local languages.',
    lead: 'In Medan, Hokkien is still heard at home and in the market. Across Java and beyond, Hokkien words settled so deeply into Indonesian that many no longer know where they came from.',
  },
  {
    key: 'everywhere', code: 'ALL', old: '四海', name: 'Everywhere else', short: 'Everywhere else',
    card: 'Second migrations. Third homes. The same search for remembered roots.',
    lead: 'Taiwan, Myanmar, Thailand, Vietnam, and the second and third migrations to Sydney, Vancouver, London and California. Wherever the family landed, the same questions followed.',
  },
];

export const port = (key) => PORTS.find((p) => p.key === key);
export const portByCode = (code) => PORTS.find((p) => p.code === code);

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  unit: string;
  emoji: string;
  price: number;
  change: number;
  description: string;
  tags: string[];
  bazarData: Array<{
    market: string;
    price: number;
    min: number;
    max: number;
    avg: number;
  }>;
};

export const categoryMeta: Record<
  string,
  { label: string; icon: string; description: string }
> = {
  chal: { label: "চাল", icon: "🍚", description: "ভাতের প্রধান উৎস" },
  dal: { label: "ডাল", icon: "🫘", description: "প্রোটিন সমৃদ্ধ ডাল" },
  sabji: { label: "সবজি", icon: "🥬", description: "সবজি ও শাকসবজি" },
  mach: { label: "মাছ", icon: "🐟", description: "তাজা মাছের বাজার" },
  fal: { label: "ফল", icon: "🍉", description: "ফল ও শস্য" },
  egg: { label: "ডিম", icon: "🥚", description: "ডিম ও দুগ্ধজাত" },
  tel: { label: "তেল", icon: "🫙", description: "করণ ও তেল" },
};

export const productCategories = Object.keys(categoryMeta);

export const products: Product[] = [
  {
    id: 1,
    slug: "swarna-machi-chal",
    name: "স্বর্ণমাছি চাল",
    category: "chal",
    unit: "প্রতি কেজি",
    emoji: "🍚",
    price: 1480,
    change: 2.1,
    description: "নির্বাচিত চাল, কোমলতা ও সুবাসে পূর্ণ।",
    tags: ["শস্য", "এখনকার সেরা"],
    bazarData: [
      { market: "খুলনা", price: 1480, min: 1400, max: 1540, avg: 1465 },
      { market: "ঢাকা", price: 1520, min: 1450, max: 1580, avg: 1510 },
      { market: "চট্টগ্রাম", price: 1495, min: 1430, max: 1560, avg: 1490 },
    ],
  },
  {
    id: 2,
    slug: "miniket-chal",
    name: "মিনিকেট চাল",
    category: "chal",
    unit: "প্রতি কেজি",
    emoji: "🍚",
    price: 1380,
    change: -1.4,
    description: "মৃদু সুগন্ধ ও নরম ভাতের জন্য জনপ্রিয়।",
    tags: ["সারাবছর", "প্রিয়"],
    bazarData: [
      { market: "রাজশাহী", price: 1380, min: 1300, max: 1450, avg: 1368 },
      { market: "সিলেট", price: 1425, min: 1340, max: 1480, avg: 1415 },
      { market: "বরিশাল", price: 1365, min: 1290, max: 1430, avg: 1352 },
    ],
  },
  {
    id: 3,
    slug: "ilish-mach",
    name: "ইলিশ মাছ",
    category: "mach",
    unit: "প্রতি কেজি",
    emoji: "🐟",
    price: 1850,
    change: 3.4,
    description: "স্বাদ ও মূল্যের ব্যালেন্সে সেরা মাছ।",
    tags: ["বিশেষ", "ফ্রেশ"],
    bazarData: [
      { market: "চট্টগ্রাম", price: 1850, min: 1750, max: 1960, avg: 1840 },
      { market: "ঢাকা", price: 1910, min: 1820, max: 2030, avg: 1905 },
      { market: "খুলনা", price: 1835, min: 1760, max: 1945, avg: 1830 },
    ],
  },
  {
    id: 4,
    slug: "piyaj",
    name: "পেঁয়াজ",
    category: "sabji",
    unit: "প্রতি কেজি",
    emoji: "🧅",
    price: 540,
    change: -2.9,
    description: "রান্নায় অপরিহার্য তাজা পেঁয়াজ।",
    tags: ["বাস্তব", "প্রয়োজনীয়"],
    bazarData: [
      { market: "ঢাকা", price: 540, min: 500, max: 605, avg: 528 },
      { market: "চট্টগ্রাম", price: 565, min: 510, max: 620, avg: 556 },
      { market: "রাজশাহী", price: 520, min: 490, max: 580, avg: 514 },
    ],
  },
  {
    id: 5,
    slug: "alu",
    name: "আলু",
    category: "sabji",
    unit: "প্রতি কেজি",
    emoji: "🥔",
    price: 420,
    change: 1.8,
    description: "সারা বছর ব্যবহৃত সাশ্রয়ী ও পুষ্টিকর সবজি।",
    tags: ["অত্যন্ত", "গৃহস্থালি"],
    bazarData: [
      { market: "কুমিল্লা", price: 420, min: 390, max: 470, avg: 415 },
      { market: "ময়মনসিংহ", price: 445, min: 410, max: 490, avg: 438 },
      { market: "ঢাকা", price: 432, min: 400, max: 480, avg: 427 },
    ],
  },
  {
    id: 6,
    slug: "mug-dal",
    name: "মুগ ডাল",
    category: "dal",
    unit: "প্রতি কেজি",
    emoji: "🫘",
    price: 1180,
    change: 0.0,
    description: "সুস্বাদু ডাল, পরিবারের জন্য আদর্শ।",
    tags: ["সুন্দর", "প্রোটিন"],
    bazarData: [
      { market: "ঢাকা", price: 1180, min: 1100, max: 1220, avg: 1165 },
      { market: "সিলেট", price: 1200, min: 1120, max: 1240, avg: 1188 },
      { market: "রাজশাহী", price: 1175, min: 1090, max: 1210, avg: 1164 },
    ],
  },
  {
    id: 7,
    slug: "soya-tel",
    name: "সয়াবিন তেল",
    category: "tel",
    unit: "প্রতি লিটার",
    emoji: "🫙",
    price: 1680,
    change: -0.8,
    description: "রান্নার জন্য হালকা ও সাশ্রয়ী তেল।",
    tags: ["প্রয়োজনীয়", "আধুনিক"],
    bazarData: [
      { market: "ঢাকা", price: 1680, min: 1600, max: 1750, avg: 1662 },
      { market: "চট্টগ্রাম", price: 1715, min: 1650, max: 1790, avg: 1698 },
      { market: "খুলনা", price: 1670, min: 1590, max: 1745, avg: 1652 },
    ],
  },
  {
    id: 8,
    slug: "dim",
    name: "দেশি ডিম",
    category: "egg",
    unit: "প্রতি ডজন",
    emoji: "🥚",
    price: 240,
    change: 2.7,
    description: "তাজা ডিমের অতুলনীয় গুণমান।",
    tags: ["প্রোটিন", "সুন্দর"],
    bazarData: [
      { market: "ঢাকা", price: 240, min: 220, max: 265, avg: 236 },
      { market: "চট্টগ্রাম", price: 255, min: 228, max: 280, avg: 250 },
      { market: "ময়মনসিংহ", price: 248, min: 226, max: 272, avg: 244 },
    ],
  },
  {
    id: 9,
    slug: "tomato",
    name: "টমেটো",
    category: "sabji",
    unit: "প্রতি কেজি",
    emoji: "🍅",
    price: 680,
    change: 4.2,
    description: "রঙিন ও স্বাদের জন্য জনপ্রিয় টমেটো।",
    tags: ["টারমিনাল", "স্বাদ"],
    bazarData: [
      { market: "ঢাকা", price: 680, min: 620, max: 720, avg: 667 },
      { market: "চট্টগ্রাম", price: 705, min: 640, max: 760, avg: 695 },
      { market: "ময়মনসিংহ", price: 670, min: 610, max: 715, avg: 664 },
    ],
  },
  {
    id: 10,
    slug: "khejur",
    name: "খেজুর",
    category: "fal",
    unit: "প্রতি কেজি",
    emoji: "🌴",
    price: 1320,
    change: -1.9,
    description: "স্বাদ ও পুষ্টির দিক থেকে সেরা ফল।",
    tags: ["ফল", "রসালো"],
    bazarData: [
      { market: "রাজশাহী", price: 1320, min: 1240, max: 1390, avg: 1308 },
      { market: "ঢাকা", price: 1365, min: 1270, max: 1420, avg: 1352 },
      { market: "বরিশাল", price: 1310, min: 1230, max: 1385, avg: 1298 },
    ],
  },
  {
    id: 11,
    slug: "leafy-spinach",
    name: "পালং শাক",
    category: "sabji",
    unit: "প্রতি বস্তা",
    emoji: "🥬",
    price: 280,
    change: 1.1,
    description: "স্বাস্থ্যকর সবুজ শাক, প্রতিদিনের খাবারে উপকারী।",
    tags: ["সবুজ", "স্বাস্থ্য"],
    bazarData: [
      { market: "ঢাকা", price: 280, min: 250, max: 310, avg: 274 },
      { market: "ময়মনসিংহ", price: 290, min: 255, max: 325, avg: 286 },
      { market: "কুমিল্লা", price: 272, min: 240, max: 305, avg: 268 },
    ],
  },
  {
    id: 12,
    slug: "mango",
    name: "আম",
    category: "fal",
    unit: "প্রতি কেজি",
    emoji: "🥭",
    price: 960,
    change: 5.1,
    description: "গরমের মরশুমে প্রাণবন্ত ও রসালো আম।",
    tags: ["গরম", "আসন্ন"],
    bazarData: [
      { market: "ঢাকা", price: 960, min: 900, max: 1030, avg: 955 },
      { market: "খুলনা", price: 980, min: 910, max: 1045, avg: 973 },
      { market: "চট্টগ্রাম", price: 945, min: 885, max: 1015, avg: 941 },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category);
}

export function formatBanglaNumber(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

export function formatBanglaCurrency(value: number) {
  return `${formatBanglaNumber(value)} টাকা`;
}

export function getChangeBadge(change: number) {
  if (change > 0) {
    return `▲ ${Math.abs(change).toFixed(1)}%`;
  }
  if (change < 0) {
    return `▼ ${Math.abs(change).toFixed(1)}%`;
  }
  return `— ০.০%`;
}

export function getChangeClass(change: number) {
  if (change > 0) return "bg-emerald-100 text-emerald-700";
  if (change < 0) return "bg-rose-100 text-rose-700";
  return "bg-slate-200 text-slate-700";
}

export function getCategoryList() {
  return Object.entries(categoryMeta).map(([slug, meta]) => ({
    slug,
    ...meta,
  }));
}

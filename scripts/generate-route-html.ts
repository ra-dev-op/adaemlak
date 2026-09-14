import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LIVE_MAIN_LISTINGS } from '../data/liveListings.generated';
import { NAV_MENU, NEWS_ITEMS, SLUG_TO_CATEGORIES } from '../constants';
import { DEFAULT_SEO_SETTINGS } from '../config/siteDefaults';
import { getListingUrl } from '../lib/seo';
import { stripHtmlTags } from '../lib/richText';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const templatePath = path.join(distDir, 'index.html');
const template = fs.readFileSync(templatePath, 'utf8');
const baseUrl = DEFAULT_SEO_SETTINGS.baseUrl.replace(/\/$/, '');

interface RouteMeta {
  route: string;
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  summaryItems?: string[];
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const normalizeDescription = (value: string) =>
  stripHtmlTags(value || DEFAULT_SEO_SETTINGS.siteDescription)
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 158);

const toAbsoluteListingImage = (listingId: string) => `${baseUrl}/listing-thumbs/${encodeURIComponent(listingId)}.jpg`;

const renderStaticContent = ({ title, description, summaryItems = [] }: RouteMeta) => {
  const safeHeading = escapeHtml(title);
  const safeDescription = escapeHtml(normalizeDescription(description));
  const listItems = summaryItems
    .filter(Boolean)
    .slice(0, 6)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  return [
    '<main class="seo-fallback-content" style="max-width:1120px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif;color:#202938">',
    `<h1 style="margin:0 0 12px;font-size:30px;line-height:1.2">${safeHeading}</h1>`,
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.6">${safeDescription}</p>`,
    listItems ? `<ul style="margin:0;padding-left:20px;font-size:15px;line-height:1.7">${listItems}</ul>` : '',
    '</main>',
  ].join('');
};

const renderHtml = (meta: RouteMeta) => {
  const { route, title, description, image, type = 'website' } = meta;
  const fullTitle = title === DEFAULT_SEO_SETTINGS.siteTitle || title.includes(DEFAULT_SEO_SETTINGS.siteTitle)
    ? title
    : `${title} | ${DEFAULT_SEO_SETTINGS.siteTitle}`;
  const canonical = `${baseUrl}${route === '/' ? '/' : route}`;
  const finalImage = image || DEFAULT_SEO_SETTINGS.logoUrl;
  const safeTitle = escapeHtml(fullTitle);
  const safeDescription = escapeHtml(normalizeDescription(description));
  const safeCanonical = escapeHtml(canonical);
  const safeImage = escapeHtml(finalImage);

  return template
    .replace(/<title>.*?<\/title>/s, `<title>${safeTitle}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${safeDescription}" />`)
    .replace(/<meta property="og:type" content="[^"]*"\s*\/>/, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${safeTitle}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s, `<meta property="og:description" content="${safeDescription}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${safeCanonical}" />`)
    .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${safeImage}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${safeTitle}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:description" content="${safeDescription}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${safeImage}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${safeCanonical}" />`)
    .replace(/<link rel="alternate" hreflang="tr-TR" href="[^"]*"\s*\/>/, `<link rel="alternate" hreflang="tr-TR" href="${safeCanonical}" />`)
    .replace(/<link rel="alternate" hreflang="x-default" href="[^"]*"\s*\/>/, `<link rel="alternate" hreflang="x-default" href="${safeCanonical}" />`)
    .replace('<div id="root"></div>', `<div id="root">${renderStaticContent(meta)}</div>`);
};

const homeRoute: RouteMeta = {
  route: '/',
  title: 'Ada Emlak | İstanbul Ticari Gayrimenkul ve Yatırım Danışmanlığı',
  description: DEFAULT_SEO_SETTINGS.siteDescription,
  image: DEFAULT_SEO_SETTINGS.logoUrl,
  summaryItems: [
    'Satılık arsa, bina, plaza, fabrika, depo-antrepo ve konut portföyleri',
    'İstanbul ve çevresinde yatırım odaklı ticari gayrimenkul danışmanlığı',
    'Güncel ilanlar, detaylı portföy bilgileri ve doğrudan iletişim',
  ],
};

const staticRoutes: RouteMeta[] = [
  { route: '/hakkimizda', title: 'Hakkımızda', description: 'Ada Emlak kurumsal geçmişi, uzmanlığı ve gayrimenkul yatırım danışmanlığı yaklaşımı.' },
  { route: '/referanslar', title: 'Referanslarımız', description: 'Ada Emlak ile çalışan kurumlar ve tamamlanan gayrimenkul danışmanlığı çalışmaları.' },
  { route: '/iletisim', title: 'İletişim', description: 'Ada Emlak Bakırköy ofisi, telefon, e-posta ve iletişim bilgileri.' },
  { route: '/blog', title: 'Gayrimenkul Haberleri ve Rehberler', description: 'Gayrimenkul yatırımı, tapu işlemleri ve piyasa gelişmeleri hakkında uzman içerikler.' },
];

const categoryRouteMap = new Map<string, RouteMeta>();

Object.keys(SLUG_TO_CATEGORIES).forEach((slug) => {
  const menuLabel = NAV_MENU.find((item) => item.slug === slug)?.label;
  const title = menuLabel || slug.split('-').map((part) => part.charAt(0).toLocaleUpperCase('tr-TR') + part.slice(1)).join(' ');

  categoryRouteMap.set(`/${slug}`, {
    route: `/${slug}`,
    title: `${title} İlanları`,
    description: `Ada Emlak güncel ${title.toLocaleLowerCase('tr-TR')} portföylerini, konum ve fiyat bilgileriyle inceleyin.`,
  });
});

NAV_MENU.forEach((item) => {
  if (item.externalUrl) return;

  item.subItems.forEach((subItem) => {
    categoryRouteMap.set(subItem.link, {
      route: subItem.link,
      title: `${subItem.label} İlanları`,
      description: `Ada Emlak güncel ${subItem.label.toLocaleLowerCase('tr-TR')} portföylerini, konum ve fiyat bilgileriyle inceleyin.`,
    });
  });
});

const categoryRoutes: RouteMeta[] = [...categoryRouteMap.values()];

const listingRoutes: RouteMeta[] = LIVE_MAIN_LISTINGS.filter((listing) => listing.status === 'active').map((listing) => ({
  route: getListingUrl(listing),
  title: listing.title,
  description: listing.description,
  image: toAbsoluteListingImage(listing.id),
  type: 'product',
  summaryItems: [
    listing.ilanNo,
    listing.location,
    listing.category,
    listing.price,
  ],
}));

const blogRoutes: RouteMeta[] = NEWS_ITEMS.filter((item) => item.status !== 'draft' && item.slug).map((item) => ({
  route: `/blog/${item.slug}`,
  title: item.title,
  description: item.metaDescription || item.summary,
  image: item.imageUrl,
  type: 'article',
}));

for (const meta of [homeRoute, ...staticRoutes, ...categoryRoutes, ...listingRoutes, ...blogRoutes]) {
  const outputDir = path.join(distDir, meta.route.replace(/^\//, ''));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), renderHtml(meta), 'utf8');
}

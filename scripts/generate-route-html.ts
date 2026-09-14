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

const renderHtml = ({ route, title, description, image, type = 'website' }: RouteMeta) => {
  const fullTitle = title === DEFAULT_SEO_SETTINGS.siteTitle ? title : `${title} | ${DEFAULT_SEO_SETTINGS.siteTitle}`;
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
    .replace(/<link rel="alternate" hreflang="x-default" href="[^"]*"\s*\/>/, `<link rel="alternate" hreflang="x-default" href="${safeCanonical}" />`);
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
  image: listing.imageUrls?.[0],
  type: 'product',
}));

const blogRoutes: RouteMeta[] = NEWS_ITEMS.filter((item) => item.status !== 'draft' && item.slug).map((item) => ({
  route: `/blog/${item.slug}`,
  title: item.title,
  description: item.metaDescription || item.summary,
  image: item.imageUrl,
  type: 'article',
}));

for (const meta of [...staticRoutes, ...categoryRoutes, ...listingRoutes, ...blogRoutes]) {
  const outputDir = path.join(distDir, meta.route.replace(/^\//, ''));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), renderHtml(meta), 'utf8');
}

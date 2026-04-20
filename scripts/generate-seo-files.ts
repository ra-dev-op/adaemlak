import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NAV_MENU, NEWS_ITEMS, SLUG_TO_CATEGORIES } from '../constants';
import { LIVE_MAIN_LISTINGS } from '../data/liveListings.generated';
import { DEFAULT_SEO_SETTINGS } from '../config/siteDefaults';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

const baseUrl = DEFAULT_SEO_SETTINGS.baseUrl.replace(/\/$/, '');
const basePath = new URL(baseUrl).pathname.replace(/\/$/, '');

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/hakkimizda', priority: '0.8', changefreq: 'monthly' },
  { path: '/referanslar', priority: '0.7', changefreq: 'monthly' },
  { path: '/iletisim', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/kvkk', priority: '0.4', changefreq: 'yearly' },
  { path: '/gizlilik-politikasi', priority: '0.4', changefreq: 'yearly' },
  { path: '/cerez-politikasi', priority: '0.4', changefreq: 'yearly' },
  { path: '/acik-riza-metni', priority: '0.4', changefreq: 'yearly' },
  { path: '/veri-sahibi-basvuru-formu', priority: '0.4', changefreq: 'yearly' },
  { path: '/kullanim-kosullari', priority: '0.4', changefreq: 'yearly' },
];

const categoryRoutes = [
  ...Object.keys(SLUG_TO_CATEGORIES).map((slug) => ({
    path: `/${slug}`,
    priority: '0.7',
    changefreq: 'weekly',
  })),
  ...NAV_MENU.flatMap((menu) =>
    menu.externalUrl
      ? []
      : menu.subItems.map((subItem) => ({
          path: subItem.link,
          priority: '0.7',
          changefreq: 'weekly',
        })),
  ),
];

const blogRoutes = NEWS_ITEMS.filter((item) => item.status !== 'draft' && item.slug).map((item) => ({
  path: `/blog/${item.slug}`,
  priority: '0.7',
  changefreq: 'monthly',
  lastmod: item.publishedDateIso,
}));

const listingRoutes = LIVE_MAIN_LISTINGS.filter((listing) => listing.status === 'active').map((listing) => ({
  path: `/listing/${listing.id}`,
  priority: '0.8',
  changefreq: 'weekly',
  lastmod: listing.createdDate || undefined,
}));

const uniqueEntries = Array.from(
  new Map(
    [...staticRoutes, ...categoryRoutes, ...blogRoutes, ...listingRoutes].map((entry) => [entry.path, entry]),
  ).values(),
);

const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueEntries.map((entry) => {
    const parts = [
      '  <url>',
      `    <loc>${baseUrl}${entry.path}</loc>`,
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority}</priority>`,
    ];
    if (entry.lastmod) {
      parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    }
    parts.push('  </url>');
    return parts.join('\n');
  }),
  '</urlset>',
];

const robotsTxt = [
  'User-agent: *',
  'Allow: /',
  `Disallow: ${basePath}/admin`,
  `Disallow: ${basePath}/arama`,
  '',
  `Sitemap: ${baseUrl}/sitemap.xml`,
  '',
].join('\n');

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xmlLines.join('\n'), 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');

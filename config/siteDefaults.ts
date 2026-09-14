import { GeneralSettings, SeoSettings } from '../types';

export const SITE_BASE_URL = (import.meta.env?.VITE_PUBLIC_SITE_URL || 'https://www.adaemlak.com.tr').replace(/\/$/, '');

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  siteTitle: 'ADA EMLAK',
  titleSeparator: '|',
  siteDescription:
    'İstanbul genelinde satılık arsa, bina, plaza, fabrika, depo ve lüks konut portföyleri için Ada Emlak uzmanlığıyla güvenli gayrimenkul çözümleri.',
  siteKeywords:
    'ada emlak, istanbul emlak, satılık arsa, satılık bina, ticari gayrimenkul, depo antrepo, lüks konut, yatırım gayrimenkul',
  baseUrl: SITE_BASE_URL,
  faviconUrl: `${SITE_BASE_URL}/favicon.svg`,
  logoUrl: `${SITE_BASE_URL}/ada-emlak-logo.png`,
  contactAddress: 'Özkul Sokak Köşem Apt. A Blok Daire:4 34740 Bakırköy / İSTANBUL',
  contactPhone: '+90 532 243 55 22',
  socialFacebook: 'https://facebook.com/adaemlak',
  socialInstagram: 'https://instagram.com/adaemlak',
  socialTwitter: 'https://twitter.com/adaemlak',
  robotsTxt: `User-agent: *
Allow: /
Disallow: /admin
Disallow: /yk-panel-giris
Disallow: /arama

Sitemap: ${SITE_BASE_URL}/sitemap.xml`,
  sitemapUrl: `${SITE_BASE_URL}/sitemap.xml`,
};

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  companyName: 'ADA EMLAK İNŞAAT SANAYİ ve DIŞ. TİC. LTD. ŞTİ.',
  headerPhone: '44 44 232',
  footerText: 'COPYRIGHT 2026 ADA EMLAK',
  contactEmail: 'info@adaemlak.com.tr',
  contactAddress: 'Özkul Sokak Köşem Apt. A Blok Daire:4\n34740 Bakırköy / İSTANBUL',
  contactPhone: '0212 466 32 11',
  contactFax: '0212 543 37 04',
  mapEmbedUrl: 'https://mapsengine.google.com/map/u/0/embed?mid=z5wnDWHlmsRg.kjqW14my2xoY&z=16',
  workingHours: 'Hafta İçi: 09:00 - 19:00',
  chamberName: '',
  chamberRegistrationNo: '',
  mersisNo: '',
};

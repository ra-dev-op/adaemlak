import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAIN_LISTINGS, NEWS_ITEMS } from '../constants';
import { DEFAULT_GENERAL_SETTINGS, DEFAULT_SEO_SETTINGS, SEARCH_CONSOLE_META } from '../config/siteDefaults';
import { AdminState } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const serverDir = path.join(projectRoot, 'server');

const seedState: AdminState = {
  listings: MAIN_LISTINGS,
  news: NEWS_ITEMS,
  messages: [],
  googleSettings: {
    analyticsId: 'UA-28215240-1',
    tagManagerId: '',
    searchConsoleMeta: SEARCH_CONSOLE_META,
    adsConversionId: '',
    adsLabel: '',
  },
  seoSettings: DEFAULT_SEO_SETTINGS,
  generalSettings: DEFAULT_GENERAL_SETTINGS,
  adSettings: {
    imageUrl: null,
    linkUrl: '',
    isActive: false,
  },
};

fs.mkdirSync(serverDir, { recursive: true });
fs.writeFileSync(path.join(serverDir, 'seed-state.json'), JSON.stringify(seedState, null, 2), 'utf8');

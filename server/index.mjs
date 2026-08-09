import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3205);
const DB_DIR = process.env.ADAEMLAK_DB_DIR || path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'adaemlak.sqlite');
const SEED_PATH = path.join(__dirname, 'seed-state.json');

const ADMIN_USERNAME = process.env.ADAEMLAK_ADMIN_USERNAME || 'adaemlakyk';
const ADMIN_PASSWORD = process.env.ADAEMLAK_ADMIN_PASSWORD || '60729663.Yk';
const TOKEN_SECRET = process.env.ADAEMLAK_TOKEN_SECRET || 'adaemlak-server-token-secret';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

fs.mkdirSync(DB_DIR, { recursive: true });

const db = new sqlite3.Database(DB_PATH);

const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve(this);
    });
  });

const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });

const loadSeedState = () => JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

const normalizeState = (payload, fallback) => ({
  listings: Array.isArray(payload?.listings) ? payload.listings : fallback.listings,
  news: Array.isArray(payload?.news) ? payload.news : fallback.news,
  messages: Array.isArray(payload?.messages) ? payload.messages : fallback.messages,
  googleSettings: payload?.googleSettings && typeof payload.googleSettings === 'object' ? payload.googleSettings : fallback.googleSettings,
  seoSettings: payload?.seoSettings && typeof payload.seoSettings === 'object' ? payload.seoSettings : fallback.seoSettings,
  generalSettings: payload?.generalSettings && typeof payload.generalSettings === 'object' ? payload.generalSettings : fallback.generalSettings,
  adSettings: payload?.adSettings && typeof payload.adSettings === 'object' ? payload.adSettings : fallback.adSettings,
});

const mergeListingDetailsFromSeed = (currentState, seedState) => {
  const seedListingMap = new Map((seedState?.listings || []).map((listing) => [listing.id, listing]));
  let hasChanged = false;

  const mergedListings = (currentState?.listings || []).map((listing) => {
    const seededListing = seedListingMap.get(listing.id);
    if (!seededListing) {
      return listing;
    }

    const mergedDetails = {
      ...(seededListing.details || {}),
      ...(listing.details || {}),
    };

    const nextListing = {
      ...seededListing,
      ...listing,
      details: mergedDetails,
      detailRows:
        Array.isArray(listing.detailRows) && listing.detailRows.length > 0
          ? listing.detailRows
          : (seededListing.detailRows || []),
      mapLat:
        typeof listing.mapLat === 'number'
          ? listing.mapLat
          : seededListing.mapLat,
      mapLng:
        typeof listing.mapLng === 'number'
          ? listing.mapLng
          : seededListing.mapLng,
    };

    const currentDetailRowsLength = Array.isArray(listing.detailRows) ? listing.detailRows.length : 0;
    const nextDetailRowsLength = Array.isArray(nextListing.detailRows) ? nextListing.detailRows.length : 0;
    if (
      currentDetailRowsLength !== nextDetailRowsLength ||
      (typeof listing.mapLat !== 'number' && typeof nextListing.mapLat === 'number') ||
      (typeof listing.mapLng !== 'number' && typeof nextListing.mapLng === 'number') ||
      JSON.stringify(listing.details || {}) !== JSON.stringify(nextListing.details || {})
    ) {
      hasChanged = true;
    }

    return nextListing;
  });

  return {
    hasChanged,
    state: {
      ...currentState,
      listings: mergedListings,
    },
  };
};

const ensureState = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS app_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  const existing = await dbGet('SELECT id FROM app_state WHERE id = 1');
  if (existing) {
    const row = await dbGet('SELECT payload FROM app_state WHERE id = 1');
    const currentState = JSON.parse(row.payload);
    const seedState = normalizeState(loadSeedState(), loadSeedState());
    const merged = mergeListingDetailsFromSeed(currentState, seedState);

    if (merged.hasChanged) {
      await dbRun('UPDATE app_state SET payload = ?, updated_at = ? WHERE id = 1', [
        JSON.stringify(merged.state),
        new Date().toISOString(),
      ]);
    }

    await dbRun(`
      CREATE TABLE IF NOT EXISTS listing_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id TEXT NOT NULL,
        viewed_at TEXT NOT NULL
      )
    `);

    await ensureAnalyticsEventsTable();

    await dbRun(`
      CREATE TABLE IF NOT EXISTS entry_leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        company TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
    return;
  }

  const seedState = normalizeState(loadSeedState(), loadSeedState());
  await dbRun('INSERT INTO app_state (id, payload, updated_at) VALUES (1, ?, ?)', [
    JSON.stringify(seedState),
    new Date().toISOString(),
  ]);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS listing_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id TEXT NOT NULL,
      viewed_at TEXT NOT NULL
    )
  `);

  await ensureAnalyticsEventsTable();

  await dbRun(`
      CREATE TABLE IF NOT EXISTS entry_leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        company TEXT NOT NULL,
        email TEXT NOT NULL,
      phone TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
};

const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });

const buildListingAnalytics = async (listings) => {
  await ensureState();
  await ensureAnalyticsEventsTable();
  const legacyRows = await dbAll('SELECT listing_id, viewed_at FROM listing_views ORDER BY viewed_at DESC');
  const eventRows = await dbAll('SELECT listing_id, event_type, visitor_hash, created_at FROM analytics_events ORDER BY created_at DESC');
  const now = Date.now();
  const dayStart = now - 1000 * 60 * 60 * 24;
  const weekStart = now - 1000 * 60 * 60 * 24 * 7;
  const monthStart = now - 1000 * 60 * 60 * 24 * 30;
  const previousMonthStart = now - 1000 * 60 * 60 * 24 * 60;

  const grouped = new Map();
  const visitorSets = new Map();
  const previousMonthViews = new Map();

  listings.forEach((listing) => {
    grouped.set(listing.id, {
      listingId: listing.id,
      dailyViews: 0,
      weeklyViews: 0,
      monthlyViews: 0,
      totalViews: 0,
      dailyCardClicks: 0,
      weeklyCardClicks: 0,
      monthlyCardClicks: 0,
      totalCardClicks: 0,
      dailyPhoneClicks: 0,
      weeklyPhoneClicks: 0,
      monthlyPhoneClicks: 0,
      totalPhoneClicks: 0,
      dailyGalleryOpens: 0,
      weeklyGalleryOpens: 0,
      monthlyGalleryOpens: 0,
      totalGalleryOpens: 0,
      dailyUniqueVisitors: 0,
      weeklyUniqueVisitors: 0,
      monthlyUniqueVisitors: 0,
      totalUniqueVisitors: 0,
      interestScore: 0,
      phoneConversionRate: 0,
      trend: 'stable',
      trendPercentage: 0,
    });
    visitorSets.set(listing.id, {
      daily: new Set(),
      weekly: new Set(),
      monthly: new Set(),
      total: new Set(),
    });
    previousMonthViews.set(listing.id, 0);
  });

  const applyEvent = (row) => {
    const bucket = grouped.get(row.listing_id);
    if (!bucket) return;

    const createdAt = new Date(row.created_at).getTime();
    if (Number.isNaN(createdAt)) return;

    const eventType = row.event_type;
    const isDaily = createdAt >= dayStart;
    const isWeekly = createdAt >= weekStart;
    const isMonthly = createdAt >= monthStart;
    const visitorHash = row.visitor_hash || `legacy-${row.listing_id}-${createdAt}`;
    const sets = visitorSets.get(row.listing_id);

    if (eventType === 'view') {
      bucket.totalViews += 1;
      if (isMonthly) bucket.monthlyViews += 1;
      if (isWeekly) bucket.weeklyViews += 1;
      if (isDaily) bucket.dailyViews += 1;

      if (createdAt >= previousMonthStart && createdAt < monthStart) {
        previousMonthViews.set(row.listing_id, (previousMonthViews.get(row.listing_id) || 0) + 1);
      }

      if (sets) {
        sets.total.add(visitorHash);
        if (isMonthly) sets.monthly.add(visitorHash);
        if (isWeekly) sets.weekly.add(visitorHash);
        if (isDaily) sets.daily.add(visitorHash);
      }
    }

    if (eventType === 'card_click') {
      bucket.totalCardClicks += 1;
      if (isMonthly) bucket.monthlyCardClicks += 1;
      if (isWeekly) bucket.weeklyCardClicks += 1;
      if (isDaily) bucket.dailyCardClicks += 1;
    }

    if (eventType === 'phone_click') {
      bucket.totalPhoneClicks += 1;
      if (isMonthly) bucket.monthlyPhoneClicks += 1;
      if (isWeekly) bucket.weeklyPhoneClicks += 1;
      if (isDaily) bucket.dailyPhoneClicks += 1;
    }

    if (eventType === 'gallery_open') {
      bucket.totalGalleryOpens += 1;
      if (isMonthly) bucket.monthlyGalleryOpens += 1;
      if (isWeekly) bucket.weeklyGalleryOpens += 1;
      if (isDaily) bucket.dailyGalleryOpens += 1;
    }
  };

  legacyRows.forEach((row) => {
    applyEvent({
      listing_id: row.listing_id,
      event_type: 'view',
      visitor_hash: '',
      created_at: row.viewed_at,
    });
  });

  eventRows.forEach(applyEvent);

  return Array.from(grouped.values()).map((item) => {
    const sets = visitorSets.get(item.listingId);
    if (sets) {
      item.dailyUniqueVisitors = sets.daily.size;
      item.weeklyUniqueVisitors = sets.weekly.size;
      item.monthlyUniqueVisitors = sets.monthly.size;
      item.totalUniqueVisitors = sets.total.size;
    }

    item.interestScore =
      item.monthlyViews +
      item.monthlyCardClicks * 2 +
      item.monthlyGalleryOpens * 3 +
      item.monthlyPhoneClicks * 8;
    item.phoneConversionRate = item.monthlyViews > 0 ? Math.round((item.monthlyPhoneClicks / item.monthlyViews) * 100) : 0;

    const previousViews = previousMonthViews.get(item.listingId) || 0;
    if (item.monthlyViews > previousViews) {
      return {
        ...item,
        trend: 'up',
        trendPercentage: previousViews > 0 ? Math.round(((item.monthlyViews - previousViews) / previousViews) * 100) : item.monthlyViews * 100,
      };
    }

    if (previousViews > item.monthlyViews) {
      return {
        ...item,
        trend: 'down',
        trendPercentage: Math.round(((previousViews - item.monthlyViews) / previousViews) * 100),
      };
    }

    return { ...item, trend: 'stable', trendPercentage: 0 };
  });
};

const analyticsEventLabelMap = {
  view: 'Görüntüleme',
  card_click: 'Kart Tıklama',
  phone_click: 'Ara Tıklama',
  gallery_open: 'Galeri Açma',
};

const buildListingAnalyticsDetail = async (listingId, listings) => {
  await ensureState();
  await ensureAnalyticsEventsTable();

  const listing = listings.find((item) => item.id === listingId || item.ilanNo === listingId);
  if (!listing) {
    return null;
  }

  const analytics = await buildListingAnalytics(listings);
  const summary = analytics.find((item) => item.listingId === listing.id);
  const events = await dbAll(
    'SELECT listing_id, event_type, source, visitor_hash, created_at FROM analytics_events WHERE listing_id = ? ORDER BY created_at DESC',
    [listing.id],
  );
  const legacyRows = await dbAll('SELECT viewed_at FROM listing_views WHERE listing_id = ? ORDER BY viewed_at DESC', [listing.id]);
  const leads = await dbAll(
    `SELECT ip_hash, name, company, email, phone, created_at
     FROM entry_leads
     WHERE ip_hash IN (${events.length > 0 ? events.map(() => '?').join(',') : "''"})`,
    events.map((event) => event.visitor_hash),
  );
  const leadMap = new Map(leads.map((lead) => [lead.ip_hash, lead]));
  const visitorMap = new Map();

  events.forEach((event) => {
    const visitorKey = event.visitor_hash;
    const lead = leadMap.get(visitorKey);
    const current = visitorMap.get(visitorKey) || {
      visitorKey: visitorKey.slice(0, 10),
      name: lead?.name,
      company: lead?.company,
      email: lead?.email,
      phone: lead?.phone,
      formDate: lead?.created_at,
      firstSeen: event.created_at,
      lastSeen: event.created_at,
      views: 0,
      cardClicks: 0,
      phoneClicks: 0,
      galleryOpens: 0,
      totalEvents: 0,
    };

    current.totalEvents += 1;
    if (event.event_type === 'view') current.views += 1;
    if (event.event_type === 'card_click') current.cardClicks += 1;
    if (event.event_type === 'phone_click') current.phoneClicks += 1;
    if (event.event_type === 'gallery_open') current.galleryOpens += 1;

    if (new Date(event.created_at).getTime() < new Date(current.firstSeen).getTime()) {
      current.firstSeen = event.created_at;
    }
    if (new Date(event.created_at).getTime() > new Date(current.lastSeen).getTime()) {
      current.lastSeen = event.created_at;
    }

    visitorMap.set(visitorKey, current);
  });

  const visitors = Array.from(visitorMap.values()).sort(
    (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime(),
  );

  const recentEvents = events.slice(0, 50).map((event) => {
    const lead = leadMap.get(event.visitor_hash);
    return {
      eventType: event.event_type,
      eventLabel: analyticsEventLabelMap[event.event_type] || event.event_type,
      source: event.source || '',
      createdAt: event.created_at,
      visitorName: lead?.name,
      visitorCompany: lead?.company,
    };
  });

  return {
    listing,
    summary,
    visitors,
    recentEvents,
    legacyViews: legacyRows.length,
  };
};

const getState = async () => {
  await ensureState();
  const row = await dbGet('SELECT payload FROM app_state WHERE id = 1');
  return JSON.parse(row.payload);
};

const saveState = async (state) => {
  await dbRun('UPDATE app_state SET payload = ?, updated_at = ? WHERE id = 1', [
    JSON.stringify(state),
    new Date().toISOString(),
  ]);
};

const createToken = (username) => {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      exp: Date.now() + TOKEN_TTL_MS,
    }),
  ).toString('base64url');

  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
};

const verifyToken = (token) => {
  if (!token || !token.includes('.')) {
    return false;
  }

  const [payload, signature] = token.split('.');
  const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');

  if (signature !== expectedSignature) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return decoded?.username === ADMIN_USERNAME && decoded?.exp > Date.now();
  } catch {
    return false;
  }
};

const sanitizePublicState = (state) => ({
  listings: state.listings,
  news: state.news,
  googleSettings: state.googleSettings,
  seoSettings: state.seoSettings,
  generalSettings: state.generalSettings,
  adSettings: state.adSettings,
});

const app = express();

app.set('trust proxy', true);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'AdaEmlak-API');
  next();
});

const getClientIp = (req) => {
  const forwardedFor = String(req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim();

  return forwardedFor || req.ip || req.socket?.remoteAddress || 'unknown';
};

const hashIp = (ip) => crypto.createHash('sha256').update(`${TOKEN_SECRET}:${ip}`).digest('hex');

const normalizeText = (value) => String(value || '').trim();

const ANALYTICS_EVENT_TYPES = new Set(['view', 'card_click', 'phone_click', 'gallery_open']);

const ensureAnalyticsEventsTable = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      source TEXT,
      visitor_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  await dbRun('CREATE INDEX IF NOT EXISTS idx_analytics_events_listing ON analytics_events (listing_id)');
  await dbRun('CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events (event_type)');
  await dbRun('CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events (created_at)');
};

const recordAnalyticsEvent = async (req, listingId, eventType, source = '') => {
  await ensureAnalyticsEventsTable();
  await dbRun(
    'INSERT INTO analytics_events (listing_id, event_type, source, visitor_hash, created_at) VALUES (?, ?, ?, ?, ?)',
    [listingId, eventType, normalizeText(source).slice(0, 80), hashIp(getClientIp(req)), new Date().toISOString()],
  );
};

const ensureEntryLeadsAllowsRepeatIps = async () => {
  const row = await dbGet("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'entry_leads'");
  if (!row?.sql || !/ip_hash\s+TEXT\s+NOT NULL\s+UNIQUE/i.test(row.sql)) {
    return;
  }

  await dbRun('ALTER TABLE entry_leads RENAME TO entry_leads_legacy');
  await dbRun(`
    CREATE TABLE entry_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  await dbRun(`
    INSERT INTO entry_leads (id, ip_hash, name, company, email, phone, created_at)
    SELECT id, ip_hash, name, company, email, phone, created_at
    FROM entry_leads_legacy
  `);
  await dbRun('DROP TABLE entry_leads_legacy');
};

const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!verifyToken(token)) {
    res.status(401).json({ message: 'Yetkisiz işlem.' });
    return;
  }

  next();
};

app.get('/api/health', async (_req, res) => {
  await ensureState();
  res.json({ ok: true });
});

app.get('/api/bootstrap', async (_req, res) => {
  const state = await getState();
  res.json(sanitizePublicState(state));
});

app.get('/api/entry-lead/status', async (req, res) => {
  await ensureState();
  await ensureEntryLeadsAllowsRepeatIps();
  const ipHash = hashIp(getClientIp(req));
  const existing = await dbGet('SELECT id FROM entry_leads WHERE ip_hash = ? LIMIT 1', [ipHash]);

  res.json({ required: !existing });
});

app.post('/api/entry-lead', async (req, res) => {
  await ensureState();
  await ensureEntryLeadsAllowsRepeatIps();

  const incoming = req.body || {};
  const name = normalizeText(incoming.name);
  const company = normalizeText(incoming.company);
  const email = normalizeText(incoming.email);
  const phone = normalizeText(incoming.phone);

  if (!name || !company || !email || !phone) {
    res.status(400).json({ message: 'Lütfen isim soyisim, şirket, e-posta ve telefon bilgilerini doldurunuz.' });
    return;
  }

  const ipHash = hashIp(getClientIp(req));
  const existing = await dbGet('SELECT id FROM entry_leads WHERE ip_hash = ? LIMIT 1', [ipHash]);

  if (existing) {
    res.json({ success: true, alreadySubmitted: true });
    return;
  }

  const createdAt = new Date();
  await dbRun(
    'INSERT INTO entry_leads (ip_hash, name, company, email, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [ipHash, name, company, email, phone, createdAt.toISOString()],
  );

  const currentState = await getState();
  const nextMessage = {
    id: `entry-${Date.now()}`,
    name,
    email,
    phone,
    subject: 'Site Giriş Formu',
    message: `Şirket Bilgisi: ${company}\nZiyaretçi siteye giriş formunu doldurdu.`,
    date: createdAt.toLocaleDateString('tr-TR'),
    read: false,
  };

  await saveState({
    ...currentState,
    messages: [nextMessage, ...(currentState.messages || [])],
  });

  res.status(201).json({ success: true, message: nextMessage });
});

app.post('/api/listings/:id/view', async (req, res) => {
  const { id } = req.params;
  const state = await getState();
  const exists = state.listings.some((listing) => listing.id === id);

  if (!exists) {
    res.status(404).json({ message: 'İlan bulunamadı.' });
    return;
  }

  await recordAnalyticsEvent(req, id, 'view', 'detail');
  res.status(201).json({ success: true });
});

app.post('/api/listings/:id/events', async (req, res) => {
  const { id } = req.params;
  const eventType = normalizeText(req.body?.eventType);
  const source = normalizeText(req.body?.source);
  const state = await getState();
  const exists = state.listings.some((listing) => listing.id === id);

  if (!exists) {
    res.status(404).json({ message: 'İlan bulunamadı.' });
    return;
  }

  if (!ANALYTICS_EVENT_TYPES.has(eventType)) {
    res.status(400).json({ message: 'Geçersiz analitik olayı.' });
    return;
  }

  await recordAnalyticsEvent(req, id, eventType, source);
  res.status(201).json({ success: true });
});

app.post('/api/messages', async (req, res) => {
  const currentState = await getState();
  const incoming = req.body || {};

  if (!incoming.name || !incoming.phone || !incoming.email) {
    res.status(400).json({ message: 'Zorunlu alanlar eksik.' });
    return;
  }

  const nextMessage = {
    id: incoming.id || Date.now().toString(),
    name: incoming.name,
    email: incoming.email,
    phone: incoming.phone,
    subject: incoming.subject || '',
    message: incoming.message || '',
    date: incoming.date || new Date().toLocaleDateString('tr-TR'),
    read: Boolean(incoming.read),
  };

  const nextState = {
    ...currentState,
    messages: [nextMessage, ...currentState.messages],
  };

  await saveState(nextState);
  res.status(201).json({ success: true, message: nextMessage });
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ message: 'Hatalı kullanıcı adı veya şifre.' });
    return;
  }

  res.json({ token: createToken(username) });
});

app.get('/api/admin/bootstrap', requireAdminAuth, async (_req, res) => {
  const state = await getState();
  res.json(state);
});

app.get('/api/admin/listing-analytics', requireAdminAuth, async (_req, res) => {
  const state = await getState();
  const analytics = await buildListingAnalytics(state.listings || []);
  res.json({ analytics });
});

app.get('/api/admin/listing-analytics/:id', requireAdminAuth, async (req, res) => {
  const state = await getState();
  const detail = await buildListingAnalyticsDetail(req.params.id, state.listings || []);

  if (!detail) {
    res.status(404).json({ message: 'İlan bulunamadı.' });
    return;
  }

  res.json(detail);
});

app.put('/api/admin/state', requireAdminAuth, async (req, res) => {
  const fallback = await getState();
  const nextState = normalizeState(req.body, fallback);
  await saveState(nextState);
  res.json({ success: true });
});

app.listen(PORT, async () => {
  await ensureState();
  console.log(`Ada Emlak API running on port ${PORT}`);
});

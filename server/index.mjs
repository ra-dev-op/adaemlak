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
  const rows = await dbAll('SELECT listing_id, viewed_at FROM listing_views ORDER BY viewed_at DESC');
  const now = Date.now();
  const dayStart = now - 1000 * 60 * 60 * 24;
  const weekStart = now - 1000 * 60 * 60 * 24 * 7;
  const monthStart = now - 1000 * 60 * 60 * 24 * 30;

  const grouped = new Map();

  listings.forEach((listing) => {
    grouped.set(listing.id, {
      listingId: listing.id,
      dailyViews: 0,
      weeklyViews: 0,
      monthlyViews: 0,
      totalViews: 0,
      trend: 'stable',
      trendPercentage: 0,
    });
  });

  rows.forEach((row) => {
    const bucket = grouped.get(row.listing_id);
    if (!bucket) return;

    const viewedAt = new Date(row.viewed_at).getTime();
    if (Number.isNaN(viewedAt)) return;

    bucket.totalViews += 1;
    if (viewedAt >= monthStart) bucket.monthlyViews += 1;
    if (viewedAt >= weekStart) bucket.weeklyViews += 1;
    if (viewedAt >= dayStart) bucket.dailyViews += 1;
  });

  return Array.from(grouped.values()).map((item) => {
    const baseline = item.monthlyViews > 0 ? item.monthlyViews : item.totalViews;
    const weeklyShare = item.weeklyViews;

    if (weeklyShare === 0 && baseline === 0) {
      return item;
    }

    const ratio = baseline > 0 ? Math.round((weeklyShare / baseline) * 100) : 0;
    if (ratio >= 35) {
      return { ...item, trend: 'up', trendPercentage: ratio };
    }
    if (ratio <= 12) {
      return { ...item, trend: 'down', trendPercentage: Math.max(1, 12 - ratio) };
    }

    return { ...item, trend: 'stable', trendPercentage: ratio };
  });
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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'AdaEmlak-API');
  next();
});

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

app.post('/api/listings/:id/view', async (req, res) => {
  const { id } = req.params;
  const state = await getState();
  const exists = state.listings.some((listing) => listing.id === id);

  if (!exists) {
    res.status(404).json({ message: 'İlan bulunamadı.' });
    return;
  }

  await dbRun('INSERT INTO listing_views (listing_id, viewed_at) VALUES (?, ?)', [id, new Date().toISOString()]);
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

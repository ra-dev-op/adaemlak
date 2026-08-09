import { Listing, SidebarListing } from '../types';

const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
  Ç: 'c',
  Ğ: 'g',
  İ: 'i',
  I: 'i',
  Ö: 'o',
  Ş: 's',
  Ü: 'u',
};

export const createSlug = (value: string) =>
  value
    .trim()
    .replace(/[çğıöşüÇĞİIÖŞÜ]/g, (char) => TURKISH_CHAR_MAP[char] || char)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

export const getListingSeoSlug = (listing: Pick<Listing, 'id' | 'title' | 'ilanNo'> | SidebarListing) => {
  const readableTitle = createSlug(listing.title);
  const rawId = 'ilanNo' in listing && listing.ilanNo ? listing.ilanNo : listing.id;
  const readableId = createSlug(rawId);

  return [readableId, readableTitle].filter(Boolean).join('-');
};

export const getListingUrl = (listing: Pick<Listing, 'id' | 'title' | 'ilanNo'> | SidebarListing) =>
  `/ilan/${getListingSeoSlug(listing)}`;

export const getListingIdFromSlug = (slugOrId = '') => {
  const normalized = slugOrId.trim();
  const adaMatch = normalized.match(/ada-(\d+)/i);

  if (adaMatch) {
    return adaMatch[1];
  }

  const numericMatch = normalized.match(/^(\d+)(?:-|$)/);
  return numericMatch ? numericMatch[1] : normalized;
};

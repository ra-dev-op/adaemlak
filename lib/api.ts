import { getAdminToken } from '../config/adminAuth';
import { AdminState, ListingAnalytics, ListingAnalyticsDetail, Message, PublicBootstrap } from '../types';

const API_BASE = `${import.meta.env.BASE_URL}api`.replace(/\/$/, '');
export type ListingAnalyticsEventType = 'view' | 'card_click' | 'phone_click' | 'gallery_open';

const parseResponse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    let message = 'İşlem başarısız oldu.';

    try {
      const payload = await response.json();
      message = payload?.message || message;
    } catch {
      // noop
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

const buildHeaders = (options?: { auth?: boolean }) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.auth) {
    const token = getAdminToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

export const fetchPublicBootstrap = async () => {
  const response = await fetch(`${API_BASE}/bootstrap`);
  return parseResponse<PublicBootstrap>(response);
};

export const fetchAdminBootstrap = async () => {
  const response = await fetch(`${API_BASE}/admin/bootstrap`, {
    headers: buildHeaders({ auth: true }),
  });

  return parseResponse<AdminState>(response);
};

export const loginAdmin = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ username, password }),
  });

  return parseResponse<{ token: string }>(response);
};

export const persistAdminState = async (state: AdminState) => {
  const response = await fetch(`${API_BASE}/admin/state`, {
    method: 'PUT',
    headers: buildHeaders({ auth: true }),
    body: JSON.stringify(state),
  });

  return parseResponse<{ success: boolean }>(response);
};

export const fetchListingAnalytics = async () => {
  const response = await fetch(`${API_BASE}/admin/listing-analytics`, {
    headers: buildHeaders({ auth: true }),
  });

  return parseResponse<{ analytics: ListingAnalytics[] }>(response);
};

export const fetchListingAnalyticsDetail = async (listingId: string) => {
  const response = await fetch(`${API_BASE}/admin/listing-analytics/${listingId}`, {
    headers: buildHeaders({ auth: true }),
  });

  return parseResponse<ListingAnalyticsDetail>(response);
};

export const trackListingView = async (listingId: string) => {
  const response = await fetch(`${API_BASE}/listings/${listingId}/events`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ eventType: 'view', source: 'detail' }),
  });

  return parseResponse<{ success: boolean }>(response);
};

export const trackListingEvent = async (listingId: string, eventType: ListingAnalyticsEventType, source = '') => {
  const response = await fetch(`${API_BASE}/listings/${listingId}/events`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ eventType, source }),
  });

  return parseResponse<{ success: boolean }>(response);
};

export const submitContactMessage = async (message: Message) => {
  const response = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(message),
  });

  return parseResponse<{ success: boolean; message: Message }>(response);
};

export interface EntryLeadPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
}

export const fetchEntryLeadStatus = async () => {
  const response = await fetch(`${API_BASE}/entry-lead/status`);
  return parseResponse<{ required: boolean }>(response);
};

export const submitEntryLead = async (payload: EntryLeadPayload) => {
  const response = await fetch(`${API_BASE}/entry-lead`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse<{ success: boolean; alreadySubmitted?: boolean; message?: Message }>(response);
};

import { getAdminToken } from '../config/adminAuth';
import { AdminState, ListingAnalytics, Message, PublicBootstrap } from '../types';

const API_BASE = import.meta.env.PROD ? '/adaemlak/api' : '/api';

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

export const trackListingView = async (listingId: string) => {
  const response = await fetch(`${API_BASE}/listings/${listingId}/view`, {
    method: 'POST',
    headers: buildHeaders(),
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

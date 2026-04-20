export const ADMIN_LOGIN_PATH = '/yk-panel-giris';
export const ADMIN_TOKEN_KEY = 'adaemlak_admin_token';

export const getAdminToken = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(ADMIN_TOKEN_KEY) || '';
};

export const setAdminToken = (token: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminToken = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const isAdminAuthenticated = () => Boolean(getAdminToken());

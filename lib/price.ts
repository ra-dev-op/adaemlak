export const PRICE_CURRENCY_OPTIONS = [
  { value: 'TL', label: 'Türk Lirası (TL)' },
  { value: 'USD', label: 'Dolar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'Sterlin (GBP)' },
] as const;

export type PriceCurrency = (typeof PRICE_CURRENCY_OPTIONS)[number]['value'];

const PRICE_SUFFIX_MAP: Record<string, PriceCurrency> = {
  TL: 'TL',
  TRY: 'TL',
  '₺': 'TL',
  USD: 'USD',
  '$': 'USD',
  EUR: 'EUR',
  '€': 'EUR',
  GBP: 'GBP',
  '£': 'GBP',
};

export const formatPriceInput = (value: string = '') => {
  const digits = value.replace(/\D/g, '');
  if (!digits) {
    return '';
  }

  return new Intl.NumberFormat('tr-TR').format(Number(digits));
};

export const parsePrice = (value: string = '') => {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '-') {
    return { amount: '', currency: 'TL' as PriceCurrency };
  }

  const match = trimmed.match(/(.+?)\s*(TL|TRY|₺|USD|\$|EUR|€|GBP|£)$/i);
  if (!match) {
    return { amount: trimmed, currency: 'TL' as PriceCurrency };
  }

  const [, amount, suffix] = match;
  return {
    amount: amount.trim(),
    currency: PRICE_SUFFIX_MAP[suffix.toUpperCase()] || 'TL',
  };
};

export const buildListingPrice = (amount: string = '', currency: PriceCurrency = 'TL') => {
  const formattedAmount = formatPriceInput(amount);
  if (!formattedAmount) {
    return '';
  }

  return `${formattedAmount} ${currency}`;
};

export const getPriceParts = (price: string = '') => {
  const { amount, currency } = parsePrice(price);
  return {
    amount,
    currency,
    schemaCurrency: currency === 'TL' ? 'TRY' : currency,
  };
};

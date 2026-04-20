import { ListingDetails } from '../types';

export interface PropertyFieldDefinition {
  key: keyof ListingDetails;
  label: string;
  placeholder?: string;
  kind?: 'text' | 'select';
  options?: string[];
}

const YES_NO_OPTIONS = ['Evet', 'Hayır'];
const CREDIT_OPTIONS = ['Uygun', 'Uygun Değil'];

export const LOCATION_FIELDS: PropertyFieldDefinition[] = [
  { key: 'city', label: 'İl' },
  { key: 'district', label: 'İlçe' },
  { key: 'neighborhood', label: 'Mahalle', placeholder: 'Örn: Harmandere Mah.' },
];

const LAND_FIELDS: PropertyFieldDefinition[] = [
  { key: 'm2', label: 'M²', placeholder: 'Örn: 6.108 m²' },
  { key: 'credit', label: 'Kredi Durumu', kind: 'select', options: CREDIT_OPTIONS },
  { key: 'swap', label: 'Takas', kind: 'select', options: ['Hayır', 'Evet', 'Kısmi'] },
  { key: 'zoningStatus', label: 'İmar Durumu', placeholder: 'Örn: Ticari İmarlı' },
  { key: 'kaks', label: 'Kaks (Emsal)', placeholder: 'Örn: 1.50' },
  { key: 'taks', label: 'Taks', placeholder: 'Örn: 0.60' },
  { key: 'gabari', label: 'Yükseklik', placeholder: 'Örn: Serbest / 12.50' },
  { key: 'katKarsiligi', label: 'Kat Karşılığı', kind: 'select', options: YES_NO_OPTIONS },
  { key: 'usageStatus', label: 'Mevcut Hali', kind: 'select', options: ['Boş', 'Kiracılı', 'Kullanımda'] },
  { key: 'unitPrice', label: 'Metrekare Birim Fiyat', placeholder: 'Örn: 25.458 TL' },
  { key: 'deedType', label: 'Tapu Tipi', placeholder: 'Örn: Arsa Tapusu' },
  { key: 'adaNo', label: 'Ada No', placeholder: 'Örn: 245' },
  { key: 'parselNo', label: 'Parsel No', placeholder: 'Örn: 12' },
  { key: 'paftaNo', label: 'Pafta No', placeholder: 'Örn: F23' },
];

const RESIDENTIAL_FIELDS: PropertyFieldDefinition[] = [
  { key: 'grossM2', label: 'Brüt M²', placeholder: 'Örn: 240 m²' },
  { key: 'netM2', label: 'Net M²', placeholder: 'Örn: 210 m²' },
  { key: 'roomCount', label: 'Oda Sayısı', placeholder: 'Örn: 4+1' },
  { key: 'salonCount', label: 'Salon Sayısı', placeholder: 'Örn: 1' },
  { key: 'buildingAge', label: 'Bina Yaşı', placeholder: 'Örn: 5' },
  { key: 'floorLocation', label: 'Bulunduğu Kat', placeholder: 'Örn: Bahçe Dubleksi' },
  { key: 'floorCount', label: 'Kat Sayısı', placeholder: 'Örn: 3' },
  { key: 'heating', label: 'Isıtma', kind: 'select', options: ['Merkezi', 'Kombi (Doğalgaz)', 'VRF', 'Klima', 'Yerden Isıtma', 'Yok'] },
  { key: 'bathroomCount', label: 'Banyo Sayısı', placeholder: 'Örn: 3' },
  { key: 'balcony', label: 'Balkon', kind: 'select', options: YES_NO_OPTIONS },
  { key: 'parking', label: 'Otopark', kind: 'select', options: ['Yok', 'Açık Otopark', 'Kapalı Otopark', 'Açık ve Kapalı Otopark'] },
  { key: 'furnished', label: 'Eşyalı', kind: 'select', options: YES_NO_OPTIONS },
  { key: 'siteWithin', label: 'Site İçinde', kind: 'select', options: YES_NO_OPTIONS },
  { key: 'housingType', label: 'Konut Tipi', placeholder: 'Örn: Villa' },
  { key: 'housingShape', label: 'Konut Şekli', placeholder: 'Örn: Dublex' },
  { key: 'buildingCondition', label: 'Yapının Durumu', placeholder: 'Örn: İkinci El' },
  { key: 'deedType', label: 'Tapu Tipi', placeholder: 'Örn: Kat Mülkiyeti' },
  { key: 'credit', label: 'Kredi Durumu', kind: 'select', options: CREDIT_OPTIONS },
  { key: 'swap', label: 'Takas', kind: 'select', options: ['Hayır', 'Evet', 'Kısmi'] },
];

const COMMERCIAL_FIELDS: PropertyFieldDefinition[] = [
  { key: 'grossM2', label: 'Brüt M²', placeholder: 'Örn: 1.200 m²' },
  { key: 'netM2', label: 'Net M²', placeholder: 'Örn: 950 m²' },
  { key: 'm2', label: 'M²', placeholder: 'Örn: 120 m²' },
  { key: 'workplaceType', label: 'İşyeri Tipi', kind: 'select', options: ['Ofis', 'Dükkan', 'Mağaza', 'Plaza', 'Bina', 'Showroom'] },
  { key: 'usageStatus', label: 'Kullanım Durumu', kind: 'select', options: ['Boş', 'Kiracılı', 'Mal Sahibi Kullanıyor', 'Yapım Aşamasında'] },
  { key: 'roomOrSectionCount', label: 'Bölüm Sayısı', placeholder: 'Örn: 2' },
  { key: 'roomCount', label: 'Oda Sayısı', placeholder: 'Örn: 4+1' },
  { key: 'buildingAge', label: 'Bina Yaşı', placeholder: 'Örn: 10' },
  { key: 'floorLocation', label: 'Bulunduğu Kat', placeholder: 'Örn: Giriş Kat / 12. Kat' },
  { key: 'floorCount', label: 'Kat Sayısı', placeholder: 'Örn: 2' },
  { key: 'heating', label: 'Isıtma', kind: 'select', options: ['Merkezi', 'VRF', 'Klima', 'Yok'] },
  { key: 'bathroomCount', label: 'Banyo Sayısı', placeholder: 'Örn: 2' },
  { key: 'parking', label: 'Otopark', kind: 'select', options: ['Yok', 'Açık Otopark', 'Kapalı Otopark', 'Açık ve Kapalı Otopark'] },
  { key: 'aidat', label: 'Aidat', placeholder: 'Örn: 15.000 TL' },
  { key: 'deposit', label: 'Depozito', placeholder: 'Örn: 2 kira bedeli' },
  { key: 'buildingCondition', label: 'Yapının Durumu', placeholder: 'Örn: İkinci El' },
  { key: 'devren', label: 'Devren', kind: 'select', options: YES_NO_OPTIONS },
  { key: 'elevator', label: 'Asansör', kind: 'select', options: YES_NO_OPTIONS },
  { key: 'deedType', label: 'Tapu Tipi', placeholder: 'Örn: Kat İrtifakı' },
  { key: 'credit', label: 'Kredi Durumu', kind: 'select', options: CREDIT_OPTIONS },
  { key: 'swap', label: 'Takas', kind: 'select', options: ['Hayır', 'Evet', 'Kısmi'] },
];

const INDUSTRIAL_FIELDS: PropertyFieldDefinition[] = [
  { key: 'm2', label: 'Toplam M²', placeholder: 'Örn: 11.000 m²' },
  { key: 'openAreaM2', label: 'Açık Alan M²', placeholder: 'Örn: 8.500 m²' },
  { key: 'closedAreaM2', label: 'Kapalı Alan M²', placeholder: 'Örn: 2.500 m²' },
  { key: 'ceilingHeight', label: 'Tavan Yüksekliği', placeholder: 'Örn: 9.50 m' },
  { key: 'officeArea', label: 'Ofis Alanı', placeholder: 'Örn: 350 m²' },
  { key: 'loadingArea', label: 'Yükleme Alanı', placeholder: 'Örn: 4 yükleme rampası' },
  { key: 'workplaceType', label: 'İşyeri Tipi', kind: 'select', options: ['Depo', 'Antrepo', 'Fabrika', 'Üretim Tesisi'] },
  { key: 'usageStatus', label: 'Kullanım Durumu', kind: 'select', options: ['Boş', 'Kiracılı', 'Faaliyette', 'Yapım Aşamasında'] },
  { key: 'buildingAge', label: 'Bina Yaşı', placeholder: 'Örn: 20' },
  { key: 'floorLocation', label: 'Bulunduğu Kat', placeholder: 'Örn: Zemin Kat' },
  { key: 'heating', label: 'Isıtma', kind: 'select', options: ['Yok', 'Merkezi', 'Doğalgaz', 'Klima'] },
  { key: 'parking', label: 'Otopark', kind: 'select', options: ['Yok', 'Açık Otopark', 'Kapalı Otopark', 'Açık ve Kapalı Otopark'] },
  { key: 'buildingCondition', label: 'Yapının Durumu', placeholder: 'Örn: İkinci El' },
  { key: 'deedType', label: 'Tapu Tipi', placeholder: 'Örn: Müstakil Tapu' },
  { key: 'credit', label: 'Kredi Durumu', kind: 'select', options: CREDIT_OPTIONS },
  { key: 'swap', label: 'Takas', kind: 'select', options: ['Hayır', 'Evet', 'Kısmi'] },
];

const HOTEL_FIELDS: PropertyFieldDefinition[] = [
  { key: 'm2', label: 'Toplam M²', placeholder: 'Örn: 9.000 m²' },
  { key: 'closedAreaM2', label: 'Kapalı Alan M²', placeholder: 'Örn: 550 m²' },
  { key: 'roomOrSectionCount', label: 'Oda / Bölüm Sayısı', placeholder: 'Örn: 6 oda + 2 bahçe odası' },
  { key: 'roomCount', label: 'Oda Sayısı', placeholder: 'Örn: 60' },
  { key: 'salonCount', label: 'Salon Sayısı', placeholder: 'Örn: 6' },
  { key: 'buildingAge', label: 'Bina Yaşı', placeholder: 'Örn: 12' },
  { key: 'floorLocation', label: 'Bulunduğu Kat', placeholder: 'Örn: Müstakil' },
  { key: 'floorCount', label: 'Kat Sayısı', placeholder: 'Örn: 2' },
  { key: 'heating', label: 'Isıtma', kind: 'select', options: ['Merkezi', 'Klima', 'Yerden Isıtma', 'Yok'] },
  { key: 'bathroomCount', label: 'Banyo Sayısı', placeholder: 'Örn: 8' },
  { key: 'parking', label: 'Otopark', kind: 'select', options: ['Yok', 'Açık Otopark', 'Kapalı Otopark'] },
  { key: 'usageStatus', label: 'Kullanım Durumu', kind: 'select', options: ['Faaliyette', 'Boş', 'Kiracılı'] },
  { key: 'workplaceType', label: 'İşyeri Tipi', placeholder: 'Örn: Turistik İşletme' },
  { key: 'furnished', label: 'Eşyalı', kind: 'select', options: YES_NO_OPTIONS },
  { key: 'housingType', label: 'Konut Tipi', placeholder: 'Örn: Villa' },
  { key: 'housingShape', label: 'Konut Şekli', placeholder: 'Örn: Dublex' },
  { key: 'buildingCondition', label: 'Yapının Durumu', placeholder: 'Örn: İkinci El' },
  { key: 'deedType', label: 'Tapu Tipi', placeholder: 'Örn: Turizm Tesisi Tapusu' },
  { key: 'credit', label: 'Kredi Durumu', kind: 'select', options: CREDIT_OPTIONS },
  { key: 'swap', label: 'Takas', kind: 'select', options: ['Hayır', 'Evet', 'Kısmi'] },
];

export const PROPERTY_FIELD_LABELS: Partial<Record<keyof ListingDetails, string>> = {
  city: 'İl',
  district: 'İlçe',
  neighborhood: 'Mahalle',
  m2: 'M²',
  zoningStatus: 'İmar Durumu',
  kaks: 'Kaks (Emsal)',
  taks: 'Taks',
  gabari: 'Yükseklik',
  deedType: 'Tapu Tipi',
  credit: 'Kredi Durumu',
  swap: 'Takas',
  katKarsiligi: 'Kat Karşılığı',
  grossM2: 'Brüt M²',
  netM2: 'Net M²',
  roomCount: 'Oda Sayısı',
  salonCount: 'Salon Sayısı',
  buildingAge: 'Bina Yaşı',
  floorLocation: 'Bulunduğu Kat',
  floorCount: 'Kat Sayısı',
  heating: 'Isıtma',
  bathroomCount: 'Banyo Sayısı',
  balcony: 'Balkon',
  parking: 'Otopark',
  furnished: 'Eşyalı',
  siteWithin: 'Site İçinde',
  usageStatus: 'Mevcut Hali',
  workplaceType: 'İşyeri Tipi',
  aidat: 'Aidat',
  deposit: 'Depozito',
  openAreaM2: 'Açık Alan M²',
  closedAreaM2: 'Kapalı Alan M²',
  ceilingHeight: 'Tavan Yüksekliği',
  officeArea: 'Ofis Alanı',
  loadingArea: 'Yükleme Alanı',
  roomOrSectionCount: 'Bölüm Sayısı',
  buildingCondition: 'Yapının Durumu',
  housingType: 'Konut Tipi',
  housingShape: 'Konut Şekli',
  unitPrice: 'Metrekare Birim Fiyat',
  devren: 'Devren',
  adaNo: 'Ada No',
  parselNo: 'Parsel No',
  paftaNo: 'Pafta No',
  elevator: 'Asansör',
};

export const getPropertyFieldSet = (category = '', type = ''): PropertyFieldDefinition[] => {
  const normalized = `${category} ${type}`.toLocaleUpperCase('tr-TR');
  const isRental = normalized.includes('KİRALIK');
  const isSale = normalized.includes('SATILIK');

  if (normalized.includes('ARSA')) {
    return isRental
      ? [
          ...LOCATION_FIELDS,
          { key: 'm2', label: 'M²', placeholder: 'Örn: 4.257 m²' },
          { key: 'zoningStatus', label: 'İmar Durumu', placeholder: 'Örn: Ticari İmarlı' },
          { key: 'kaks', label: 'Kaks (Emsal)', placeholder: 'Örn: 1.50' },
          { key: 'gabari', label: 'Yükseklik', placeholder: 'Örn: Serbest / 12.50' },
          { key: 'deedType', label: 'Tapu Tipi', placeholder: 'Örn: Arsa Tapusu' },
          { key: 'usageStatus', label: 'Mevcut Hali', kind: 'select', options: ['Boş', 'Kiracılı', 'Kullanımda'] },
          { key: 'deposit', label: 'Depozito', placeholder: 'Örn: 3 aylık kira' },
          { key: 'adaNo', label: 'Ada No', placeholder: 'Örn: 245' },
          { key: 'parselNo', label: 'Parsel No', placeholder: 'Örn: 12' },
          { key: 'paftaNo', label: 'Pafta No', placeholder: 'Örn: F23' },
        ]
      : [...LOCATION_FIELDS, ...LAND_FIELDS];
  }

  if (normalized.includes('VİLLA') || normalized.includes('VILLA') || normalized.includes('KONUT')) {
    return isRental
      ? [
          ...LOCATION_FIELDS,
          { key: 'grossM2', label: 'Brüt M²', placeholder: 'Örn: 240 m²' },
          { key: 'netM2', label: 'Net M²', placeholder: 'Örn: 210 m²' },
          { key: 'roomCount', label: 'Oda Sayısı', placeholder: 'Örn: 4+1' },
          { key: 'buildingAge', label: 'Bina Yaşı', placeholder: 'Örn: 5' },
          { key: 'floorLocation', label: 'Bulunduğu Kat', placeholder: 'Örn: Bahçe Dubleksi' },
          { key: 'floorCount', label: 'Kat Sayısı', placeholder: 'Örn: 3' },
          { key: 'heating', label: 'Isıtma', kind: 'select', options: ['Merkezi', 'Kombi (Doğalgaz)', 'VRF', 'Klima', 'Yerden Isıtma', 'Yok'] },
          { key: 'bathroomCount', label: 'Banyo Sayısı', placeholder: 'Örn: 3' },
          { key: 'balcony', label: 'Balkon', kind: 'select', options: YES_NO_OPTIONS },
          { key: 'parking', label: 'Otopark', kind: 'select', options: ['Yok', 'Açık Otopark', 'Kapalı Otopark', 'Açık ve Kapalı Otopark'] },
          { key: 'furnished', label: 'Eşyalı', kind: 'select', options: YES_NO_OPTIONS },
          { key: 'siteWithin', label: 'Site İçinde', kind: 'select', options: YES_NO_OPTIONS },
          { key: 'usageStatus', label: 'Kullanım Durumu', kind: 'select', options: ['Boş', 'Kiracılı', 'Mal Sahibi Kullanıyor'] },
          { key: 'aidat', label: 'Aidat', placeholder: 'Örn: 12.500 TL' },
          { key: 'deposit', label: 'Depozito', placeholder: 'Örn: 2 kira bedeli' },
        ]
      : [...LOCATION_FIELDS, ...RESIDENTIAL_FIELDS];
  }

  if (normalized.includes('OTEL')) {
    return isRental
      ? [
          ...LOCATION_FIELDS,
          { key: 'm2', label: 'Toplam M²', placeholder: 'Örn: 9.000 m²' },
          { key: 'closedAreaM2', label: 'Kapalı Alan M²', placeholder: 'Örn: 550 m²' },
          { key: 'roomOrSectionCount', label: 'Oda / Bölüm Sayısı', placeholder: 'Örn: 60 oda / 120 yatak' },
          { key: 'buildingAge', label: 'Bina Yaşı', placeholder: 'Örn: 12' },
          { key: 'heating', label: 'Isıtma', kind: 'select', options: ['Merkezi', 'Klima', 'Yerden Isıtma', 'Yok'] },
          { key: 'parking', label: 'Otopark', kind: 'select', options: ['Yok', 'Açık Otopark', 'Kapalı Otopark'] },
          { key: 'usageStatus', label: 'Kullanım Durumu', kind: 'select', options: ['Faaliyette', 'Boş', 'Kiracılı'] },
          { key: 'furnished', label: 'Eşyalı', kind: 'select', options: YES_NO_OPTIONS },
          { key: 'deposit', label: 'Depozito', placeholder: 'Örn: 6 aylık kira' },
        ]
      : [...LOCATION_FIELDS, ...HOTEL_FIELDS];
  }

  if (
    normalized.includes('FABRİKA') ||
    normalized.includes('DEPO') ||
    normalized.includes('ANTREPO')
  ) {
    return isRental
      ? [
          ...LOCATION_FIELDS,
          { key: 'm2', label: 'Toplam M²', placeholder: 'Örn: 11.000 m²' },
          { key: 'openAreaM2', label: 'Açık Alan M²', placeholder: 'Örn: 8.500 m²' },
          { key: 'closedAreaM2', label: 'Kapalı Alan M²', placeholder: 'Örn: 2.500 m²' },
          { key: 'ceilingHeight', label: 'Tavan Yüksekliği', placeholder: 'Örn: 9.50 m' },
          { key: 'officeArea', label: 'Ofis Alanı', placeholder: 'Örn: 350 m²' },
          { key: 'loadingArea', label: 'Yükleme Alanı', placeholder: 'Örn: 4 yükleme rampası' },
          { key: 'usageStatus', label: 'Mevcut Hali', kind: 'select', options: ['Boş', 'Kiracılı', 'Faaliyette'] },
          { key: 'heating', label: 'Isıtma', kind: 'select', options: ['Yok', 'Merkezi', 'Doğalgaz', 'Klima'] },
          { key: 'parking', label: 'Otopark', kind: 'select', options: ['Yok', 'Açık Otopark', 'Kapalı Otopark', 'Açık ve Kapalı Otopark'] },
          { key: 'deposit', label: 'Depozito', placeholder: 'Örn: 3 aylık kira' },
        ]
      : [...LOCATION_FIELDS, ...INDUSTRIAL_FIELDS];
  }

  if (
    normalized.includes('BİNA') ||
    normalized.includes('PLAZA') ||
    normalized.includes('OFİS') ||
    normalized.includes('İŞ YERİ') ||
    normalized.includes('MAĞAZA')
  ) {
    return isRental
      ? [
          ...LOCATION_FIELDS,
          { key: 'grossM2', label: 'Brüt M²', placeholder: 'Örn: 1.200 m²' },
          { key: 'netM2', label: 'Net M²', placeholder: 'Örn: 950 m²' },
          { key: 'workplaceType', label: 'İşyeri Tipi', kind: 'select', options: ['Ofis', 'Dükkan', 'Mağaza', 'Plaza', 'Bina', 'Showroom'] },
          { key: 'usageStatus', label: 'Mevcut Hali', kind: 'select', options: ['Boş', 'Kiracılı', 'Mal Sahibi Kullanıyor'] },
          { key: 'buildingAge', label: 'Binanın Yaşı', placeholder: 'Örn: 0 / 12' },
          { key: 'floorLocation', label: 'Bulunduğu Kat', placeholder: 'Örn: Giriş Kat / 12. Kat' },
          { key: 'floorCount', label: 'Kat Sayısı', placeholder: 'Örn: 5' },
          { key: 'heating', label: 'Isınma Tipi', kind: 'select', options: ['Merkezi', 'Merkezi-Doğalgaz', 'VRF', 'Klima', 'Yok'] },
          { key: 'parking', label: 'Otopark', kind: 'select', options: ['Yok', 'Açık Otopark', 'Kapalı Otopark', 'Açık ve Kapalı Otopark'] },
          { key: 'aidat', label: 'Aidat', placeholder: 'Örn: 15.000 TL' },
          { key: 'deposit', label: 'Depozito', placeholder: 'Örn: 2 kira bedeli' },
          { key: 'elevator', label: 'Asansör', kind: 'select', options: YES_NO_OPTIONS },
        ]
      : [...LOCATION_FIELDS, ...COMMERCIAL_FIELDS];
  }

  return [...LOCATION_FIELDS, ...LAND_FIELDS];
};

export const EMPTY_LISTING_DETAILS: ListingDetails = {
  city: '',
  district: '',
  neighborhood: '',
  m2: '',
  zoningStatus: '',
  kaks: '',
  gabari: '',
  deedType: '',
  credit: '',
  swap: '',
  katKarsiligi: '',
  grossM2: '',
  netM2: '',
  roomCount: '',
  salonCount: '',
  buildingAge: '',
  floorLocation: '',
  floorCount: '',
  heating: '',
  bathroomCount: '',
  balcony: '',
  parking: '',
  furnished: '',
  siteWithin: '',
  usageStatus: '',
  workplaceType: '',
  aidat: '',
  deposit: '',
  openAreaM2: '',
  closedAreaM2: '',
  ceilingHeight: '',
  officeArea: '',
  loadingArea: '',
  roomOrSectionCount: '',
  buildingCondition: '',
  housingType: '',
  housingShape: '',
  taks: '',
  unitPrice: '',
  devren: '',
  adaNo: '',
  parselNo: '',
  paftaNo: '',
  elevator: '',
};

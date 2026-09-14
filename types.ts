
export interface ListingDetails {
  city: string;
  district: string;
  neighborhood: string;
  m2: string;
  zoningStatus: string; // İmar Durumu
  kaks: string;         // Emsal
  gabari: string;       // Yükseklik
  deedType: string;     // Tapu Tipi
  credit: string;       // Kredi Uygunluğu (Evet/Hayır)
  swap: string;         // Takas (Evet/Hayır)
  katKarsiligi?: string;
  grossM2?: string;
  netM2?: string;
  roomCount?: string;
  salonCount?: string;
  buildingAge?: string;
  floorLocation?: string;
  floorCount?: string;
  heating?: string;
  bathroomCount?: string;
  balcony?: string;
  parking?: string;
  furnished?: string;
  siteWithin?: string;
  usageStatus?: string;
  workplaceType?: string;
  aidat?: string;
  deposit?: string;
  openAreaM2?: string;
  closedAreaM2?: string;
  ceilingHeight?: string;
  officeArea?: string;
  loadingArea?: string;
  roomOrSectionCount?: string;
  buildingCondition?: string;
  housingType?: string;
  housingShape?: string;
  taks?: string;
  unitPrice?: string;
  devren?: string;
  adaNo?: string;
  parselNo?: string;
  paftaNo?: string;
  elevator?: string;
}

export interface Listing {
  id: string;
  type: string; // e.g., "SATILIK ARSA", "SATILIK BİNA"
  title: string;
  description: string;
  location: string; // Display string e.g. "Pendik / İSTANBUL"
  ilanNo: string;
  updateDate: string;
  createdDate?: string; // Added for sort logic
  price: string;
  priceCurrency?: 'TL' | 'USD' | 'EUR' | 'GBP';
  imageUrls: string[]; // Changed from single imageUrl to array
  mapUrl?: string; // Google Maps Embed URL
  mapLat?: number;
  mapLng?: number;
  category: string; // Used for the bottom bar label
  status?: 'active' | 'archived';
  homepage_featured?: boolean; // New: Admin control
  homepage_order?: number; // New: 1-10
  details?: ListingDetails; // New details object
  detailRows?: { label: string; value: string }[];
}

export interface ListingAnalytics {
  listingId: string;
  dailyViews: number;
  weeklyViews: number;
  monthlyViews: number;
  totalViews: number;
  dailyCardClicks: number;
  weeklyCardClicks: number;
  monthlyCardClicks: number;
  totalCardClicks: number;
  dailyPhoneClicks: number;
  weeklyPhoneClicks: number;
  monthlyPhoneClicks: number;
  totalPhoneClicks: number;
  dailyGalleryOpens: number;
  weeklyGalleryOpens: number;
  monthlyGalleryOpens: number;
  totalGalleryOpens: number;
  dailyUniqueVisitors: number;
  weeklyUniqueVisitors: number;
  monthlyUniqueVisitors: number;
  totalUniqueVisitors: number;
  interestScore: number;
  phoneConversionRate: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface ListingAnalyticsVisitor {
  visitorKey: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  formDate?: string;
  firstSeen: string;
  lastSeen: string;
  views: number;
  cardClicks: number;
  phoneClicks: number;
  galleryOpens: number;
  totalEvents: number;
}

export interface ListingAnalyticsEventLog {
  eventType: 'view' | 'card_click' | 'phone_click' | 'gallery_open';
  source?: string;
  createdAt: string;
  visitorName?: string;
  visitorCompany?: string;
}

export interface ListingAnalyticsDetail {
  listing: Listing;
  summary: ListingAnalytics;
  visitors: ListingAnalyticsVisitor[];
  recentEvents: ListingAnalyticsEventLog[];
  legacyViews: number;
}

export interface SidebarListing {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
}

export interface NavItem {
  label: string;
  slug: string; // Base slug for the menu group
  externalUrl?: string;
  subItems: {
      label: string;
      link: string; // Full client-side route
      categoryKey: string; // Maps to DB category
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  slug?: string; // SEO URL
  date: string;
  publishedDateIso?: string;
  summary: string;
  content?: string; // Full HTML content
  imageUrl: string;
  metaDescription?: string; // SEO Description
  keywords?: string; // SEO Keywords
  status?: 'published' | 'draft';
  author?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface GoogleSettings {
  analyticsId: string; // G-XXXXXXXXXX or UA-XXXXXXXX-X
  tagManagerId?: string; // GTM-XXXXXXX
  searchConsoleMeta: string; // meta content tag
  adsConversionId: string; // AW-XXXXXXXXXX
  adsLabel: string; // Conversion Label
}

export interface SeoSettings {
  siteTitle: string;
  titleSeparator: string; // e.g. | or -
  siteDescription: string;
  siteKeywords: string;
  baseUrl: string; // https://www.adaemlak.com.tr
  faviconUrl: string;
  logoUrl: string; // For Schema.org
  contactAddress: string; // For Schema.org
  contactPhone: string; // For Schema.org
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  robotsTxt: string;
  sitemapUrl: string;
}

export interface GeneralSettings {
  companyName: string;
  headerPhone: string;
  footerText: string;
  contactEmail: string;
  contactAddress: string;
  contactPhone: string;
  contactFax: string;
  mapEmbedUrl: string;
  workingHours: string;
  // Corporate Info
  chamberName?: string; // e.g. İstanbul Ticaret Odası
  chamberRegistrationNo?: string; // Sicil No
  mersisNo?: string; // MERSİS No
}

export interface AdSettings {
  imageUrl: string | null;
  linkUrl: string;
  isActive: boolean;
}

export interface PublicBootstrap {
  listings: Listing[];
  news: NewsItem[];
  googleSettings: GoogleSettings;
  seoSettings: SeoSettings;
  generalSettings: GeneralSettings;
  adSettings: AdSettings;
}

export interface AdminState extends PublicBootstrap {
  messages: Message[];
}

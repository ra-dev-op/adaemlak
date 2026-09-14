import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Listing, ListingAnalytics, ListingAnalyticsDetail } from '../../types';
import { fetchListingAnalytics, fetchListingAnalyticsDetail } from '../../lib/api';

type RangeKey = 'daily' | 'weekly' | 'monthly' | 'total';
type SortKey = 'interest' | 'views' | 'phone' | 'conversion' | 'gallery' | 'trend';
type AnalyticsRow = ListingAnalytics & { listing: Listing };

const rangeLabelMap: Record<RangeKey, string> = {
  daily: 'Bugün',
  weekly: 'Son 7 Gün',
  monthly: 'Son 30 Gün',
  total: 'Toplam',
};

const sortLabelMap: Record<SortKey, string> = {
  interest: 'İlgi skoruna göre',
  views: 'Görüntülenmeye göre',
  phone: 'Arama tıklamasına göre',
  conversion: 'Ara dönüşümüne göre',
  gallery: 'Galeri açmaya göre',
  trend: 'Trende göre',
};

const eventLabelMap: Record<string, string> = {
  view: 'İlan görüntülendi',
  card_click: 'Karttan ilana geçildi',
  phone_click: 'Telefon/ara tıklandı',
  gallery_open: 'Galeri açıldı',
};

const eventColorMap: Record<string, string> = {
  view: 'bg-blue-50 text-blue-700',
  card_click: 'bg-purple-50 text-purple-700',
  phone_click: 'bg-emerald-50 text-emerald-700',
  gallery_open: 'bg-amber-50 text-amber-700',
};

const formatNumber = (value = 0) => value.toLocaleString('tr-TR');

const formatDateTime = (value = '') => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getRangeMetricValue = (
  item: ListingAnalytics,
  range: RangeKey,
  metric: 'views' | 'uniqueVisitors' | 'cardClicks' | 'phoneClicks' | 'galleryOpens',
) => {
  const metricMap = {
    views: {
      daily: item.dailyViews,
      weekly: item.weeklyViews,
      monthly: item.monthlyViews,
      total: item.totalViews,
    },
    uniqueVisitors: {
      daily: item.dailyUniqueVisitors,
      weekly: item.weeklyUniqueVisitors,
      monthly: item.monthlyUniqueVisitors,
      total: item.totalUniqueVisitors,
    },
    cardClicks: {
      daily: item.dailyCardClicks,
      weekly: item.weeklyCardClicks,
      monthly: item.monthlyCardClicks,
      total: item.totalCardClicks,
    },
    phoneClicks: {
      daily: item.dailyPhoneClicks,
      weekly: item.weeklyPhoneClicks,
      monthly: item.monthlyPhoneClicks,
      total: item.totalPhoneClicks,
    },
    galleryOpens: {
      daily: item.dailyGalleryOpens,
      weekly: item.weeklyGalleryOpens,
      monthly: item.monthlyGalleryOpens,
      total: item.totalGalleryOpens,
    },
  };

  return metricMap[metric][range];
};

const getListingCity = (listing: Listing) => listing.details?.city || listing.location.split('/')[1]?.trim() || '';

const getTrendText = (item: ListingAnalytics) => {
  if (item.trend === 'up') return `Yükseliş %${item.trendPercentage}`;
  if (item.trend === 'down') return `Düşüş %${item.trendPercentage}`;
  return 'Sabit';
};

const getTrendClassName = (trend: ListingAnalytics['trend']) => {
  if (trend === 'up') return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
  if (trend === 'down') return 'bg-red-50 text-red-700 ring-red-100';
  return 'bg-gray-50 text-gray-600 ring-gray-100';
};

const getInsightLabel = (item: ListingAnalytics) => {
  if (item.monthlyPhoneClicks >= 5 || item.phoneConversionRate >= 20) {
    return { label: 'Sıcak lead', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
  }
  if (item.monthlyGalleryOpens >= 8 || item.interestScore >= 70) {
    return { label: 'Yüksek ilgi', className: 'bg-amber-50 text-amber-700 border-amber-100' };
  }
  if (item.monthlyViews > 0 && item.monthlyPhoneClicks === 0) {
    return { label: 'Takip edilmeli', className: 'bg-blue-50 text-blue-700 border-blue-100' };
  }
  return { label: 'Veri birikiyor', className: 'bg-gray-50 text-gray-600 border-gray-100' };
};

const Icon = ({ path, className = 'h-5 w-5' }: { path: string; className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const AdminPerformance: React.FC = () => {
  const { listings } = useData();
  const [analytics, setAnalytics] = useState<ListingAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<ListingAnalyticsDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [range, setRange] = useState<RangeKey>('monthly');
  const [sortKey, setSortKey] = useState<SortKey>('interest');

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await fetchListingAnalytics();
        if (isMounted) {
          setAnalytics(response.analytics || []);
        }
      } catch (error) {
        console.error('Listing analytics could not be loaded:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  const openListingDetail = async (listingId: string) => {
    setIsDetailLoading(true);
    setDetailError('');
    setSelectedDetail(null);

    try {
      const detail = await fetchListingAnalyticsDetail(listingId);
      setSelectedDetail(detail);
    } catch (error) {
      console.error('Listing analytics detail could not be loaded:', error);
      setDetailError(error instanceof Error ? error.message : 'İlan performans detayı yüklenemedi.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeListingDetail = () => {
    setSelectedDetail(null);
    setDetailError('');
    setIsDetailLoading(false);
  };

  const mergedData = useMemo<AnalyticsRow[]>(() => {
    return analytics
      .map((stat) => {
        const listing = listings.find((item) => item.id === stat.listingId);
        return listing ? { ...stat, listing } : null;
      })
      .filter((item): item is AnalyticsRow => item !== null);
  }, [analytics, listings]);

  const cityOptions = useMemo(() => {
    return Array.from(new Set(listings.map(getListingCity).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'tr'));
  }, [listings]);

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(listings.map((listing) => listing.category).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b, 'tr'),
    );
  }, [listings]);

  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('tr-TR');

    return mergedData.filter((item) => {
      const listingCity = getListingCity(item.listing);
      const matchesCity = filterCity ? listingCity === filterCity : true;
      const matchesCategory = filterCategory ? item.listing.category === filterCategory : true;
      const matchesSearch = normalizedSearch
        ? `${item.listing.title} ${item.listing.ilanNo} ${item.listing.location} ${item.listing.category}`
            .toLocaleLowerCase('tr-TR')
            .includes(normalizedSearch)
        : true;

      return matchesCity && matchesCategory && matchesSearch;
    });
  }, [filterCategory, filterCity, mergedData, searchTerm]);

  const sortedData = useMemo(() => {
    const getSortValue = (item: AnalyticsRow) => {
      if (sortKey === 'views') return getRangeMetricValue(item, range, 'views');
      if (sortKey === 'phone') return getRangeMetricValue(item, range, 'phoneClicks');
      if (sortKey === 'conversion') return item.phoneConversionRate;
      if (sortKey === 'gallery') return getRangeMetricValue(item, range, 'galleryOpens');
      if (sortKey === 'trend') return item.trend === 'up' ? item.trendPercentage + 100 : item.trend === 'down' ? -item.trendPercentage : 0;
      return item.interestScore;
    };

    return [...filteredData].sort(
      (a, b) =>
        getSortValue(b) - getSortValue(a) ||
        getRangeMetricValue(b, range, 'views') - getRangeMetricValue(a, range, 'views') ||
        a.listing.title.localeCompare(b.listing.title, 'tr'),
    );
  }, [filteredData, range, sortKey]);

  const rangeTotals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        views: acc.views + getRangeMetricValue(item, range, 'views'),
        uniqueVisitors: acc.uniqueVisitors + getRangeMetricValue(item, range, 'uniqueVisitors'),
        cardClicks: acc.cardClicks + getRangeMetricValue(item, range, 'cardClicks'),
        phoneClicks: acc.phoneClicks + getRangeMetricValue(item, range, 'phoneClicks'),
        galleryOpens: acc.galleryOpens + getRangeMetricValue(item, range, 'galleryOpens'),
      }),
      { views: 0, uniqueVisitors: 0, cardClicks: 0, phoneClicks: 0, galleryOpens: 0 },
    );
  }, [filteredData, range]);

  const topItems = useMemo(() => {
    const byViews = [...filteredData].sort((a, b) => getRangeMetricValue(b, range, 'views') - getRangeMetricValue(a, range, 'views'))[0];
    const byPhone = [...filteredData].sort((a, b) => getRangeMetricValue(b, range, 'phoneClicks') - getRangeMetricValue(a, range, 'phoneClicks'))[0];
    const byInterest = [...filteredData].sort((a, b) => b.interestScore - a.interestScore)[0];
    const byGallery = [...filteredData].sort((a, b) => getRangeMetricValue(b, range, 'galleryOpens') - getRangeMetricValue(a, range, 'galleryOpens'))[0];
    return { byViews, byPhone, byInterest, byGallery };
  }, [filteredData, range]);

  const decisionItems = useMemo(() => {
    const hotLeads = filteredData.filter((item) => getRangeMetricValue(item, range, 'phoneClicks') > 0).length;
    const watchedNoCalls = filteredData.filter(
      (item) => getRangeMetricValue(item, range, 'views') >= 5 && getRangeMetricValue(item, range, 'phoneClicks') === 0,
    ).length;
    const risingListings = filteredData.filter((item) => item.trend === 'up').length;

    return [
      {
        label: 'Arama alan ilan',
        value: hotLeads,
        helper: 'Doğrudan telefon/WhatsApp niyeti oluşan portföyler.',
        color: 'text-emerald-700 bg-emerald-50',
      },
      {
        label: 'İlgi var, arama yok',
        value: watchedNoCalls,
        helper: 'Fiyat, başlık veya açıklama yeniden gözden geçirilebilir.',
        color: 'text-amber-700 bg-amber-50',
      },
      {
        label: 'Yükselişte olan',
        value: risingListings,
        helper: 'Son dönemde ivme alan ilanlar.',
        color: 'text-blue-700 bg-blue-50',
      },
    ];
  }, [filteredData, range]);

  const exportCsv = () => {
    if (sortedData.length === 0) return;

    const header = [
      'İlan No',
      'Başlık',
      'Kategori',
      'Şehir',
      'Görüntülenme',
      'Tekil Ziyaretçi',
      'Kart Tıklama',
      'Ara Tıklama',
      'Galeri Açma',
      'Ara Dönüşüm Oranı',
      'İlgi Skoru',
      'Trend',
    ];
    const rows = sortedData.map((item) => [
      item.listing.ilanNo || '',
      item.listing.title || '',
      item.listing.category || '',
      getListingCity(item.listing),
      getRangeMetricValue(item, range, 'views'),
      getRangeMetricValue(item, range, 'uniqueVisitors'),
      getRangeMetricValue(item, range, 'cardClicks'),
      getRangeMetricValue(item, range, 'phoneClicks'),
      getRangeMetricValue(item, range, 'galleryOpens'),
      `%${item.phoneConversionRate}`,
      item.interestScore,
      getTrendText(item),
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `adaemlak-performans-${range}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const MetricCard = ({
    label,
    value,
    helper,
    icon,
    tone = 'gold',
  }: {
    label: string;
    value: number | string;
    helper: string;
    icon: string;
    tone?: 'gold' | 'blue' | 'green' | 'slate';
  }) => {
    const toneMap = {
      gold: 'from-[#fff8e6] to-white text-gold-700 ring-gold-100',
      blue: 'from-blue-50 to-white text-blue-700 ring-blue-100',
      green: 'from-emerald-50 to-white text-emerald-700 ring-emerald-100',
      slate: 'from-slate-50 to-white text-slate-700 ring-slate-100',
    };

    return (
      <div className={`rounded-[22px] bg-gradient-to-br ${toneMap[tone]} p-[1px] shadow-sm`}>
        <div className="h-full rounded-[21px] bg-white/90 p-5 ring-1 ring-inset ring-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-gray-400">{label}</div>
              <div className="mt-3 text-3xl font-extrabold tracking-tight text-[#202938]">{typeof value === 'number' ? formatNumber(value) : value}</div>
            </div>
            <div className={`rounded-2xl p-3 ring-1 ${toneMap[tone]}`}>
              <Icon path={icon} />
            </div>
          </div>
          <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500">{helper}</p>
        </div>
      </div>
    );
  };

  const HighlightCard = ({ title, item, metricLabel, metricValue }: { title: string; item?: AnalyticsRow; metricLabel: string; metricValue?: number }) => {
    if (!item) {
      return (
        <div className="rounded-[22px] border border-dashed border-gray-200 bg-white p-5 text-sm font-semibold text-gray-400">
          {title} için henüz veri yok.
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => openListingDetail(item.listingId)}
        className="group overflow-hidden rounded-[22px] border border-gray-100 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gold-200 hover:shadow-lg"
      >
        <div className="relative h-32 overflow-hidden bg-gray-100">
          <img src={item.listing.imageUrls[0] || 'https://via.placeholder.com/400x260'} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-200">{title}</div>
            <div className="mt-1 line-clamp-2 text-sm font-extrabold leading-tight text-white">{item.listing.title}</div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">{metricLabel}</div>
              <div className="mt-1 text-2xl font-extrabold tracking-tight text-[#202938]">{formatNumber(metricValue ?? item.interestScore)}</div>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ring-1 ${getTrendClassName(item.trend)}`}>
              {getTrendText(item)}
            </span>
          </div>
          <div className="mt-3 text-xs font-semibold text-gray-500">{item.listing.location}</div>
        </div>
      </button>
    );
  };

  const clearFilters = () => {
    setFilterCity('');
    setFilterCategory('');
    setSearchTerm('');
    setSortKey('interest');
    setRange('monthly');
  };

  return (
    <>
      <div className="space-y-7">
        <section className="overflow-hidden rounded-[28px] border border-gray-100 bg-[#18202d] shadow-sm">
          <div className="relative p-6 text-white md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,169,4,0.28),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)]" />
            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-100">
                  <span className="h-2 w-2 rounded-full bg-gold-400" />
                  Portföy Davranış Analizi
                </div>
                <h1 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl">İlan Performansı</h1>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-300">
                  Hangi ilan ilgi çekiyor, hangisi arama getiriyor, hangi portföy takip edilmeli? Bu ekran ziyaretçi davranışını satış aksiyonuna çevirmek için hazırlandı.
                </p>
              </div>
              <div className="grid min-w-[300px] grid-cols-3 gap-3 rounded-[22px] bg-white/10 p-3 backdrop-blur">
                {decisionItems.map((item) => (
                  <div key={item.label} className="rounded-[18px] bg-white p-4 text-[#202938]">
                    <div className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${item.color}`}>
                      {item.label}
                    </div>
                    <div className="text-3xl font-extrabold">{formatNumber(item.value)}</div>
                    <p className="mt-2 text-[11px] font-medium leading-5 text-gray-500">{item.helper}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.2fr)_repeat(4,minmax(150px,0.65fr))_auto]">
            <label className="relative block">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="h-4 w-4" />
              </span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="İlan no, başlık, lokasyon ara..."
                className="h-12 w-full rounded-[16px] border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none transition focus:border-gold-400 focus:bg-white"
              />
            </label>

            <select
              className="h-12 rounded-[16px] border border-gray-200 bg-gray-50 px-4 text-xs font-extrabold uppercase tracking-[0.08em] text-gray-600 outline-none transition focus:border-gold-400 focus:bg-white"
              value={filterCity}
              onChange={(event) => setFilterCity(event.target.value)}
            >
              <option value="">Tüm Şehirler</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              className="h-12 rounded-[16px] border border-gray-200 bg-gray-50 px-4 text-xs font-extrabold uppercase tracking-[0.08em] text-gray-600 outline-none transition focus:border-gold-400 focus:bg-white"
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value)}
            >
              <option value="">Tüm Kategoriler</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="h-12 rounded-[16px] border border-gray-200 bg-gray-50 px-4 text-xs font-extrabold uppercase tracking-[0.08em] text-gray-600 outline-none transition focus:border-gold-400 focus:bg-white"
              value={range}
              onChange={(event) => setRange(event.target.value as RangeKey)}
            >
              {Object.entries(rangeLabelMap).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <select
              className="h-12 rounded-[16px] border border-gray-200 bg-gray-50 px-4 text-xs font-extrabold uppercase tracking-[0.08em] text-gray-600 outline-none transition focus:border-gold-400 focus:bg-white"
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
            >
              {Object.entries(sortLabelMap).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="h-12 rounded-[16px] border border-gray-200 px-5 text-xs font-extrabold uppercase tracking-[0.12em] text-gray-500 transition hover:border-gold-300 hover:text-gold-700"
            >
              Temizle
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label={`${rangeLabelMap[range]} Görüntülenme`}
            value={rangeTotals.views}
            helper="Seçili dönemde ilan detay/kart görüntülenme toplamı."
            icon="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            tone="slate"
          />
          <MetricCard
            label="Tekil Ziyaretçi"
            value={rangeTotals.uniqueVisitors}
            helper="Aynı kişinin tekrarları ayrıştırılarak hesaplanır."
            icon="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z M4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            tone="blue"
          />
          <MetricCard
            label="Kart Tıklama"
            value={rangeTotals.cardClicks}
            helper="Vitrin/kategori kartından ilana geçiş sayısı."
            icon="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z M8.25 8.25h7.5m-7.5 3.75h7.5m-7.5 3.75h4.5"
            tone="gold"
          />
          <MetricCard
            label="Ara Tıklama"
            value={rangeTotals.phoneClicks}
            helper="Telefon veya WhatsApp niyeti gösteren en kritik metrik."
            icon="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a1.125 1.125 0 01-1.21.38 12.035 12.035 0 01-7.143-7.143 1.125 1.125 0 01.38-1.21l1.293-.97c.363-.272.527-.739.417-1.173L6.963 3.102A1.125 1.125 0 005.872 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            tone="green"
          />
          <MetricCard
            label="Galeri Açma"
            value={rangeTotals.galleryOpens}
            helper="İlan görselleriyle derin etkileşim kuran ziyaretçiler."
            icon="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5A2.25 2.25 0 0022.5 17.25V6.75A2.25 2.25 0 0020.25 4.5H3.75A2.25 2.25 0 001.5 6.75v10.5A2.25 2.25 0 003.75 19.5z"
            tone="gold"
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-4">
          <HighlightCard title="En Çok Görüntülenen" item={topItems.byViews} metricLabel="Görüntülenme" metricValue={topItems.byViews ? getRangeMetricValue(topItems.byViews, range, 'views') : 0} />
          <HighlightCard title="En Çok Aranan" item={topItems.byPhone} metricLabel="Ara Tıklama" metricValue={topItems.byPhone ? getRangeMetricValue(topItems.byPhone, range, 'phoneClicks') : 0} />
          <HighlightCard title="En Yüksek İlgi" item={topItems.byInterest} metricLabel="İlgi Skoru" metricValue={topItems.byInterest?.interestScore} />
          <HighlightCard title="Galerisi Açılan" item={topItems.byGallery} metricLabel="Galeri Açma" metricValue={topItems.byGallery ? getRangeMetricValue(topItems.byGallery, range, 'galleryOpens') : 0} />
        </section>

        <section className="overflow-hidden rounded-[26px] border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/70 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#202938]">İlan Bazlı Performans Tablosu</h2>
              <p className="mt-1 text-xs font-medium text-gray-500">
                {rangeLabelMap[range]} döneminde {formatNumber(sortedData.length)} ilan listeleniyor. Satıra tıklayınca ziyaretçi ve olay detayı açılır.
              </p>
            </div>
            <button
              type="button"
              onClick={exportCsv}
              disabled={sortedData.length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#202938] px-5 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-gold-600 disabled:cursor-not-allowed disabled:bg-gray-200"
            >
              <Icon path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 10.5L12 15m0 0l4.5-4.5M12 15V3" className="h-4 w-4" />
              Excel İndir
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-white text-[11px] uppercase tracking-[0.16em] text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-extrabold">İlan</th>
                  <th className="px-4 py-4 text-center font-extrabold">Görüntüleme</th>
                  <th className="px-4 py-4 text-center font-extrabold">Tekil</th>
                  <th className="px-4 py-4 text-center font-extrabold">Kart</th>
                  <th className="px-4 py-4 text-center font-extrabold">Ara</th>
                  <th className="px-4 py-4 text-center font-extrabold">Galeri</th>
                  <th className="px-4 py-4 text-center font-extrabold">Dönüşüm</th>
                  <th className="px-4 py-4 text-center font-extrabold">Skor</th>
                  <th className="px-6 py-4 text-center font-extrabold">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-14 text-center text-sm font-semibold text-gray-400">
                      Performans verileri yükleniyor...
                    </td>
                  </tr>
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-14 text-center text-sm font-semibold text-gray-400">
                      Seçili filtrelerle eşleşen performans verisi bulunamadı.
                    </td>
                  </tr>
                ) : (
                  sortedData.map((item, index) => {
                    const insight = getInsightLabel(item);
                    const views = getRangeMetricValue(item, range, 'views');
                    const uniqueVisitors = getRangeMetricValue(item, range, 'uniqueVisitors');
                    const cardClicks = getRangeMetricValue(item, range, 'cardClicks');
                    const phoneClicks = getRangeMetricValue(item, range, 'phoneClicks');
                    const galleryOpens = getRangeMetricValue(item, range, 'galleryOpens');

                    return (
                      <tr
                        key={item.listingId}
                        onClick={() => openListingDetail(item.listingId)}
                        className="group cursor-pointer transition hover:bg-[#fff9ea]"
                        title="İlan performans detayını aç"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-extrabold text-gray-500 group-hover:bg-gold-500 group-hover:text-white">
                              {index + 1}
                            </div>
                            <img src={item.listing.imageUrls[0] || 'https://via.placeholder.com/150'} className="h-14 w-20 rounded-[14px] border border-gray-100 object-cover" alt="" />
                            <div className="min-w-0">
                              <div className="max-w-[420px] truncate text-sm font-extrabold text-[#202938]" title={item.listing.title}>
                                {item.listing.title}
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold text-gray-500">
                                <span>{item.listing.ilanNo}</span>
                                <span className="h-1 w-1 rounded-full bg-gray-300" />
                                <span>{item.listing.category}</span>
                                <span className="h-1 w-1 rounded-full bg-gray-300" />
                                <span>{item.listing.location}</span>
                              </div>
                              <div className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold-600">Detayı Aç</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center text-lg font-extrabold text-[#202938]">{formatNumber(views)}</td>
                        <td className="px-4 py-5 text-center font-bold text-gray-600">{formatNumber(uniqueVisitors)}</td>
                        <td className="px-4 py-5 text-center font-bold text-gray-600">{formatNumber(cardClicks)}</td>
                        <td className="px-4 py-5 text-center">
                          <div className="text-lg font-extrabold text-[#202938]">{formatNumber(phoneClicks)}</div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">arama</div>
                        </td>
                        <td className="px-4 py-5 text-center font-bold text-gray-600">{formatNumber(galleryOpens)}</td>
                        <td className="px-4 py-5 text-center">
                          <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-extrabold text-gray-700">%{item.phoneConversionRate}</span>
                        </td>
                        <td className="px-4 py-5 text-center text-lg font-extrabold text-gold-600">{formatNumber(item.interestScore)}</td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <span className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${insight.className}`}>
                              {insight.label}
                            </span>
                            <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ring-1 ${getTrendClassName(item.trend)}`}>
                              {getTrendText(item)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {(isDetailLoading || detailError || selectedDetail) && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#111827]/72 px-4 py-6 backdrop-blur-[2px]" onClick={closeListingDetail}>
          <div
            className="max-h-[92vh] w-full max-w-[1180px] overflow-hidden rounded-[28px] border border-white/20 bg-[#f7f8fb] shadow-[0_30px_90px_rgba(0,0,0,0.38)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold-600">İlan Performans Detayı</div>
                <h3 className="mt-1 line-clamp-1 text-xl font-extrabold tracking-tight text-[#202938]">
                  {selectedDetail?.listing.title || 'Detay yükleniyor'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeListingDetail}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900"
                aria-label="Kapat"
              >
                <Icon path="M6 18L18 6M6 6l12 12" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-82px)] overflow-y-auto p-6">
              {isDetailLoading ? (
                <div className="flex min-h-[360px] items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                </div>
              ) : detailError ? (
                <div className="rounded-[18px] border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">{detailError}</div>
              ) : selectedDetail ? (
                <div className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
                    <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm">
                      <img src={selectedDetail.listing.imageUrls[0] || 'https://via.placeholder.com/400x260'} alt={selectedDetail.listing.title} className="h-[230px] w-full object-cover" />
                      <div className="space-y-3 p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-gold-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-gold-700">{selectedDetail.listing.ilanNo}</span>
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-gray-600">{selectedDetail.listing.category}</span>
                        </div>
                        <h4 className="text-lg font-extrabold leading-snug text-[#202938]">{selectedDetail.listing.title}</h4>
                        <div className="text-sm font-semibold text-gray-500">{selectedDetail.listing.location}</div>
                        <div className="text-3xl font-extrabold tracking-tight text-[#202938]">{selectedDetail.listing.price}</div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <MetricCard label="Toplam Görüntülenme" value={selectedDetail.summary.totalViews} helper="İlana ait tüm görüntülenmeler." icon="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" tone="slate" />
                      <MetricCard label="Tekil Ziyaretçi" value={selectedDetail.summary.totalUniqueVisitors} helper="Tekil kişi/cihaz sayısı." icon="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z M4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" tone="blue" />
                      <MetricCard label="Ara Tıklama" value={selectedDetail.summary.totalPhoneClicks} helper="Telefon/WhatsApp tıklaması." icon="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293a1.125 1.125 0 01-1.21.38 12.035 12.035 0 01-7.143-7.143 1.125 1.125 0 01.38-1.21l1.293-.97c.363-.272.527-.739.417-1.173L6.963 3.102A1.125 1.125 0 005.872 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z" tone="green" />
                      <MetricCard label="Kart Tıklama" value={selectedDetail.summary.totalCardClicks} helper="Karttan detaya geçiş." icon="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z M8.25 8.25h7.5m-7.5 3.75h7.5m-7.5 3.75h4.5" />
                      <MetricCard label="Galeri Açma" value={selectedDetail.summary.totalGalleryOpens} helper="Fotoğraf inceleme aksiyonu." icon="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5A2.25 2.25 0 0022.5 17.25V6.75A2.25 2.25 0 0020.25 4.5H3.75A2.25 2.25 0 001.5 6.75v10.5A2.25 2.25 0 003.75 19.5z" />
                      <MetricCard label="Ara Dönüşüm" value={`%${selectedDetail.summary.phoneConversionRate}`} helper="Görüntülenmeden aramaya dönüşüm." icon="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z M16.5 4.125C16.5 3.504 17.004 3 17.625 3h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" tone="green" />
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                    <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm">
                      <div className="border-b border-gray-100 px-5 py-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#202938]">Form Bilgisi Olan Ziyaretçiler</h4>
                        <p className="mt-1 text-xs text-gray-500">Giriş formunu dolduran ve bu ilanla etkileşime giren kişiler.</p>
                      </div>
                      <div className="max-h-[390px] overflow-y-auto">
                        {selectedDetail.visitors.length === 0 ? (
                          <div className="px-5 py-10 text-center text-sm font-semibold text-gray-400">Bu ilan için henüz ziyaretçi etkileşimi yok.</div>
                        ) : (
                          selectedDetail.visitors.map((visitor) => (
                            <div key={visitor.visitorKey} className="border-b border-gray-100 px-5 py-4 last:border-b-0">
                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div className="min-w-0">
                                  <div className="font-extrabold text-[#202938]">{visitor.name || 'Form bilgisi yok'}</div>
                                  <div className="mt-1 text-sm text-gray-500">{visitor.company || 'Anonim ziyaretçi'}</div>
                                  {visitor.email && <div className="mt-2 break-all text-xs font-semibold text-gray-600">{visitor.email}</div>}
                                  {visitor.phone && <div className="mt-1 text-xs font-semibold text-gray-600">{visitor.phone}</div>}
                                </div>
                                <div className="rounded-[14px] bg-gray-50 px-3 py-2 text-right text-[11px] font-semibold text-gray-500">
                                  <div>Son: {formatDateTime(visitor.lastSeen)}</div>
                                  <div>İlk: {formatDateTime(visitor.firstSeen)}</div>
                                </div>
                              </div>
                              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px] font-extrabold text-gray-600">
                                <div className="rounded-lg bg-gray-50 py-2">View {visitor.views}</div>
                                <div className="rounded-lg bg-gray-50 py-2">Kart {visitor.cardClicks}</div>
                                <div className="rounded-lg bg-gray-50 py-2">Ara {visitor.phoneClicks}</div>
                                <div className="rounded-lg bg-gray-50 py-2">Galeri {visitor.galleryOpens}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm">
                      <div className="border-b border-gray-100 px-5 py-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#202938]">Son Etkileşimler</h4>
                        <p className="mt-1 text-xs text-gray-500">Bu ilana ait en yeni 50 davranış kaydı.</p>
                      </div>
                      <div className="max-h-[390px] overflow-y-auto">
                        {selectedDetail.recentEvents.length === 0 ? (
                          <div className="px-5 py-10 text-center text-sm font-semibold text-gray-400">Henüz etkileşim yok.</div>
                        ) : (
                          selectedDetail.recentEvents.map((event, index) => (
                            <div key={`${event.createdAt}-${index}`} className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 last:border-b-0">
                              <div>
                                <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${eventColorMap[event.eventType] || 'bg-gray-50 text-gray-600'}`}>
                                  {eventLabelMap[event.eventType] || event.eventType}
                                </span>
                                <div className="mt-2 text-xs font-semibold text-gray-500">
                                  {event.visitorName ? `${event.visitorName}${event.visitorCompany ? ` - ${event.visitorCompany}` : ''}` : 'Form bilgisi olmayan ziyaretçi'}
                                </div>
                                {event.source && <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-gray-400">{event.source}</div>}
                              </div>
                              <div className="whitespace-nowrap text-right text-[11px] font-semibold text-gray-400">{formatDateTime(event.createdAt)}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPerformance;

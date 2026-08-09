import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { ListingAnalytics, ListingAnalyticsDetail } from '../../types';
import { fetchListingAnalytics, fetchListingAnalyticsDetail } from '../../lib/api';

type RangeKey = 'daily' | 'weekly' | 'monthly' | 'total';

const rangeLabelMap: Record<RangeKey, string> = {
  daily: 'Bugün',
  weekly: 'Son 7 Gün',
  monthly: 'Son 30 Gün',
  total: 'Toplam',
};

const eventLabelMap: Record<string, string> = {
  view: 'Görüntüleme',
  card_click: 'Kart Tıklama',
  phone_click: 'Ara Tıklama',
  gallery_open: 'Galeri Açma',
};

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

const getRangeValue = (item: ListingAnalytics, range: RangeKey) => {
  if (range === 'daily') return item.dailyViews;
  if (range === 'weekly') return item.weeklyViews;
  if (range === 'monthly') return item.monthlyViews;
  return item.totalViews;
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

const AdminPerformance: React.FC = () => {
  const { listings } = useData();
  const [analytics, setAnalytics] = useState<ListingAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<ListingAnalyticsDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [range, setRange] = useState<RangeKey>('monthly');

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await fetchListingAnalytics();
        if (!isMounted) return;
        setAnalytics(response.analytics || []);
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

  const mergedData = useMemo(() => {
    return analytics
      .map((stat) => {
        const listing = listings.find((item) => item.id === stat.listingId);
        return { ...stat, listing };
      })
      .filter((item) => item.listing !== undefined);
  }, [analytics, listings]);

  const cityOptions = useMemo(() => {
    return Array.from(
      new Set(
        listings
          .map((listing) => listing.details?.city || listing.location.split('/')[1]?.trim() || '')
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b, 'tr'));
  }, [listings]);

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(listings.map((listing) => listing.category).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b, 'tr'),
    );
  }, [listings]);

  const filteredData = useMemo(() => {
    return mergedData.filter((item) => {
      if (!item.listing) return false;

      const listingCity = item.listing.details?.city || item.listing.location.split('/')[1]?.trim() || '';
      const matchesCity = filterCity ? listingCity === filterCity : true;
      const matchesCategory = filterCategory ? item.listing.category === filterCategory : true;

      return matchesCity && matchesCategory;
    });
  }, [filterCategory, filterCity, mergedData]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => b.interestScore - a.interestScore || getRangeValue(b, range) - getRangeValue(a, range));
  }, [filteredData, range]);

  const topDaily = [...filteredData].sort((a, b) => b.dailyViews - a.dailyViews)[0];
  const topWeekly = [...filteredData].sort((a, b) => b.weeklyViews - a.weeklyViews)[0];
  const topMonthly = [...filteredData].sort((a, b) => b.monthlyViews - a.monthlyViews)[0];
  const topInterest = [...filteredData].sort((a, b) => b.interestScore - a.interestScore)[0];
  const topPhone = [...filteredData].sort((a, b) => b.monthlyPhoneClicks - a.monthlyPhoneClicks)[0];
  const rangeTotals = filteredData.reduce(
    (acc, item) => ({
      views: acc.views + getRangeMetricValue(item, range, 'views'),
      uniqueVisitors: acc.uniqueVisitors + getRangeMetricValue(item, range, 'uniqueVisitors'),
      cardClicks: acc.cardClicks + getRangeMetricValue(item, range, 'cardClicks'),
      phoneClicks: acc.phoneClicks + getRangeMetricValue(item, range, 'phoneClicks'),
      galleryOpens: acc.galleryOpens + getRangeMetricValue(item, range, 'galleryOpens'),
    }),
    { views: 0, uniqueVisitors: 0, cardClicks: 0, phoneClicks: 0, galleryOpens: 0 },
  );

  const exportCsv = () => {
    if (sortedData.length === 0) {
      return;
    }

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
      item.listing?.ilanNo || '',
      item.listing?.title || '',
      item.listing?.category || '',
      item.listing?.details?.city || '',
      getRangeMetricValue(item, range, 'views'),
      getRangeMetricValue(item, range, 'uniqueVisitors'),
      getRangeMetricValue(item, range, 'cardClicks'),
      getRangeMetricValue(item, range, 'phoneClicks'),
      getRangeMetricValue(item, range, 'galleryOpens'),
      `%${item.phoneConversionRate}`,
      item.interestScore,
      item.trend === 'stable' ? 'Sabit' : `${item.trend === 'up' ? 'Yükseliş' : 'Düşüş'} %${item.trendPercentage}`,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(','),
      )
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

  const MetricPill = ({ label, value }: { label: string; value: number | string }) => (
    <div className="rounded-[14px] border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">{label}</div>
      <div className="mt-1 font-price text-2xl font-bold tracking-tight text-[#253041]">{typeof value === 'number' ? value.toLocaleString('tr-TR') : value}</div>
    </div>
  );

  const PerformanceCard = ({
    title,
    data,
    type,
  }: {
    title: string;
    data: (ListingAnalytics & { listing?: typeof listings[number] }) | undefined;
    type: RangeKey;
  }) => {
    if (!data || !data.listing) {
      return (
        <div className="flex h-full items-center justify-center rounded-[18px] border border-gray-200/60 bg-white p-6 text-sm text-gray-400 shadow-sm">
          Veri Yok
        </div>
      );
    }

    const viewCount = getRangeValue(data, type);
    const imageUrl = data.listing.imageUrls[0] || 'https://via.placeholder.com/150';

    return (
      <div className="relative overflow-hidden rounded-[18px] border border-gray-200/60 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</span>
            <span className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{viewCount.toLocaleString('tr-TR')}</span>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">Görüntülenme</span>
          </div>
          <div
            className={`flex items-center rounded px-2 py-1 text-xs font-bold ${
              data.trend === 'up'
                ? 'bg-green-100 text-green-700'
                : data.trend === 'down'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : '•'}{' '}
            {data.trend !== 'stable' ? `%${data.trendPercentage}` : 'Sabit'}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-gray-50 pt-4">
          <img src={imageUrl} alt="" className="h-12 w-16 rounded border border-gray-100 object-cover" />
          <div className="min-w-0">
            <h4 className="mb-1 truncate text-sm font-bold leading-tight text-gray-800" title={data.listing.title}>
              {data.listing.title}
            </h4>
            <div className="flex items-center text-xs text-gray-500">
              <svg className="mr-1 h-3 w-3 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {data.listing.location}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
              <span>Ara: {data.monthlyPhoneClicks}</span>
              <span>Galeri: {data.monthlyGalleryOpens}</span>
              <span>Skor: {data.interestScore}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">İlan Performansı</h1>
          <p className="mt-1 text-sm text-gray-500">İlan görüntülenmeleri, kart tıklamaları, arama niyeti ve galeri etkileşimleri.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            className="rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-gold-500"
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
          >
            <option value="">Tüm Şehirler</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            className="rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-gold-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Tüm Kategoriler</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:border-gold-500"
            value={range}
            onChange={(e) => setRange(e.target.value as RangeKey)}
          >
            {Object.entries(rangeLabelMap).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <MetricPill label={`${rangeLabelMap[range]} Görüntülenme`} value={rangeTotals.views} />
        <MetricPill label="Tekil Ziyaretçi" value={rangeTotals.uniqueVisitors} />
        <MetricPill label="Kart Tıklama" value={rangeTotals.cardClicks} />
        <MetricPill label="Ara Tıklama" value={rangeTotals.phoneClicks} />
        <MetricPill label="Galeri Açma" value={rangeTotals.galleryOpens} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-5">
        <PerformanceCard title="GÜNLÜK EN ÇOK ZİYARET" data={topDaily} type="daily" />
        <PerformanceCard title="HAFTALIK EN ÇOK ZİYARET" data={topWeekly} type="weekly" />
        <PerformanceCard title="AYLIK EN ÇOK ZİYARET" data={topMonthly} type="monthly" />
        <PerformanceCard title="EN YÜKSEK İLGİ SKORU" data={topInterest} type="monthly" />
        <PerformanceCard title="EN ÇOK ARANAN İLAN" data={topPhone} type="monthly" />
      </div>

      <div className="overflow-hidden rounded-[18px] border border-gray-200/60 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/30 px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-gray-800">Detaylı İlan İstatistikleri</h2>
            <p className="mt-1 text-xs text-gray-500">Seçili dönem: {rangeLabelMap[range]}</p>
          </div>
          <button
            type="button"
            onClick={exportCsv}
            disabled={sortedData.length === 0}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-gold-500 transition-colors hover:text-gold-600 disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Excel İndir
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">İlan Detayı</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Görüntülenme</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Tekil</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Kart</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Ara</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Galeri</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Skor</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    Performans verileri yükleniyor...
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    Veri bulunamadı.
                  </td>
                </tr>
              ) : (
                sortedData.map((item) => (
                  <tr
                    key={item.listingId}
                    onClick={() => openListingDetail(item.listingId)}
                    className="cursor-pointer transition-colors hover:bg-gold-50/40"
                    title="İlan performans detayını aç"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.listing?.imageUrls[0] || 'https://via.placeholder.com/150'}
                          className="h-10 w-12 rounded border border-gray-100 object-cover"
                          alt=""
                        />
                        <div>
                          <div className="max-w-xs truncate text-xs font-bold text-gray-900 lg:text-sm" title={item.listing?.title}>
                            {item.listing?.title}
                          </div>
                          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-500">
                            {item.listing?.ilanNo} • {item.listing?.category}
                          </div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-600">
                            Detayı Gör
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">{getRangeMetricValue(item, range, 'views').toLocaleString('tr-TR')}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{getRangeMetricValue(item, range, 'uniqueVisitors').toLocaleString('tr-TR')}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{getRangeMetricValue(item, range, 'cardClicks').toLocaleString('tr-TR')}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-gray-900">{getRangeMetricValue(item, range, 'phoneClicks').toLocaleString('tr-TR')}</div>
                      <div className="mt-1 text-[10px] font-semibold text-gray-400">%{item.phoneConversionRate}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{getRangeMetricValue(item, range, 'galleryOpens').toLocaleString('tr-TR')}</td>
                    <td className="px-6 py-4 text-center font-bold text-gold-600">{item.interestScore.toLocaleString('tr-TR')}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold ${
                          item.trend === 'up'
                            ? 'bg-green-50 text-green-600'
                            : item.trend === 'down'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-gray-50 text-gray-500'
                        }`}
                      >
                        {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '•'}
                        {item.trend !== 'stable' ? ` %${item.trendPercentage}` : ' Sabit'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {(isDetailLoading || detailError || selectedDetail) && (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#111827]/70 px-4 py-6 backdrop-blur-[2px]" onClick={closeListingDetail}>
        <div
          className="max-h-[92vh] w-full max-w-[1180px] overflow-hidden rounded-[24px] border border-white/20 bg-[#f8fafc] shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600">İlan Performans Detayı</div>
              <h3 className="mt-1 text-xl font-bold tracking-tight text-[#253041]">
                {selectedDetail?.listing.title || 'Detay yükleniyor'}
              </h3>
            </div>
            <button
              type="button"
              onClick={closeListingDetail}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900"
              aria-label="Kapat"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="max-h-[calc(92vh-82px)] overflow-y-auto p-6">
            {isDetailLoading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
              </div>
            ) : detailError ? (
              <div className="rounded-[18px] border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">
                {detailError}
              </div>
            ) : selectedDetail ? (
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
                  <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm">
                    <img
                      src={selectedDetail.listing.imageUrls[0] || 'https://via.placeholder.com/400x260'}
                      alt={selectedDetail.listing.title}
                      className="h-[220px] w-full object-cover"
                    />
                    <div className="space-y-3 p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-gold-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-700">
                          {selectedDetail.listing.ilanNo}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-600">
                          {selectedDetail.listing.category}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold leading-snug text-[#253041]">{selectedDetail.listing.title}</h4>
                      <div className="text-sm font-semibold text-gray-500">{selectedDetail.listing.location}</div>
                      <div className="font-price text-3xl font-bold tracking-tight text-[#253041]">{selectedDetail.listing.price}</div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <MetricPill label="Toplam Görüntülenme" value={selectedDetail.summary.totalViews} />
                    <MetricPill label="Tekil Ziyaretçi" value={selectedDetail.summary.totalUniqueVisitors} />
                    <MetricPill label="Kart Tıklama" value={selectedDetail.summary.totalCardClicks} />
                    <MetricPill label="Ara Tıklama" value={selectedDetail.summary.totalPhoneClicks} />
                    <MetricPill label="Galeri Açma" value={selectedDetail.summary.totalGalleryOpens} />
                    <MetricPill label="İlgi Skoru" value={selectedDetail.summary.interestScore} />
                    <MetricPill label="Ara Dönüşüm" value={`%${selectedDetail.summary.phoneConversionRate}`} />
                    <MetricPill label="Bugün Görüntüleme" value={selectedDetail.summary.dailyViews} />
                    <MetricPill label="Eski View Kaydı" value={selectedDetail.legacyViews} />
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                  <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-5 py-4">
                      <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-[#253041]">Form Bilgisi Olan Ziyaretçiler</h4>
                      <p className="mt-1 text-xs text-gray-500">Giriş formunu dolduran ve bu ilanla etkileşime giren kişiler.</p>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto">
                      {selectedDetail.visitors.length === 0 ? (
                        <div className="px-5 py-8 text-center text-sm text-gray-400">Bu ilan için henüz ziyaretçi etkileşimi yok.</div>
                      ) : (
                        selectedDetail.visitors.map((visitor) => (
                          <div key={visitor.visitorKey} className="border-b border-gray-100 px-5 py-4 last:border-b-0">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div className="min-w-0">
                                <div className="font-bold text-[#253041]">{visitor.name || 'Form bilgisi yok'}</div>
                                <div className="mt-1 text-sm text-gray-500">{visitor.company || 'Anonim ziyaretçi'}</div>
                                {visitor.email && <div className="mt-2 text-xs font-semibold text-gray-600">{visitor.email}</div>}
                                {visitor.phone && <div className="mt-1 text-xs font-semibold text-gray-600">{visitor.phone}</div>}
                              </div>
                              <div className="rounded-[14px] bg-gray-50 px-3 py-2 text-right text-[11px] font-semibold text-gray-500">
                                <div>Son: {formatDateTime(visitor.lastSeen)}</div>
                                <div>İlk: {formatDateTime(visitor.firstSeen)}</div>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px] font-bold text-gray-600">
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

                  <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-5 py-4">
                      <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-[#253041]">Son Etkileşimler</h4>
                      <p className="mt-1 text-xs text-gray-500">Bu ilana ait en yeni 50 davranış kaydı.</p>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto">
                      {selectedDetail.recentEvents.length === 0 ? (
                        <div className="px-5 py-8 text-center text-sm text-gray-400">Henüz etkileşim yok.</div>
                      ) : (
                        selectedDetail.recentEvents.map((event, index) => (
                          <div key={`${event.createdAt}-${index}`} className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 last:border-b-0">
                            <div>
                              <div className="text-sm font-bold text-[#253041]">{eventLabelMap[event.eventType] || event.eventType}</div>
                              <div className="mt-1 text-xs text-gray-500">
                                {event.visitorName ? `${event.visitorName}${event.visitorCompany ? ` - ${event.visitorCompany}` : ''}` : 'Form bilgisi olmayan ziyaretçi'}
                              </div>
                              {event.source && <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">{event.source}</div>}
                            </div>
                            <div className="whitespace-nowrap text-right text-[11px] font-semibold text-gray-400">
                              {formatDateTime(event.createdAt)}
                            </div>
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

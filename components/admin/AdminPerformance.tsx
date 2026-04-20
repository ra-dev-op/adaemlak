import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { ListingAnalytics } from '../../types';
import { fetchListingAnalytics } from '../../lib/api';

type RangeKey = 'daily' | 'weekly' | 'monthly' | 'total';

const rangeLabelMap: Record<RangeKey, string> = {
  daily: 'Bugün',
  weekly: 'Son 7 Gün',
  monthly: 'Son 30 Gün',
  total: 'Toplam',
};

const getRangeValue = (item: ListingAnalytics, range: RangeKey) => {
  if (range === 'daily') return item.dailyViews;
  if (range === 'weekly') return item.weeklyViews;
  if (range === 'monthly') return item.monthlyViews;
  return item.totalViews;
};

const AdminPerformance: React.FC = () => {
  const { listings } = useData();
  const [analytics, setAnalytics] = useState<ListingAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    return [...filteredData].sort((a, b) => getRangeValue(b, range) - getRangeValue(a, range));
  }, [filteredData, range]);

  const topDaily = [...filteredData].sort((a, b) => b.dailyViews - a.dailyViews)[0];
  const topWeekly = [...filteredData].sort((a, b) => b.weeklyViews - a.weeklyViews)[0];
  const topMonthly = [...filteredData].sort((a, b) => b.monthlyViews - a.monthlyViews)[0];

  const exportCsv = () => {
    if (sortedData.length === 0) {
      return;
    }

    const header = ['İlan No', 'Başlık', 'Kategori', 'Şehir', 'Günlük', 'Haftalık', 'Aylık', 'Toplam', 'Trend'];
    const rows = sortedData.map((item) => [
      item.listing?.ilanNo || '',
      item.listing?.title || '',
      item.listing?.category || '',
      item.listing?.details?.city || '',
      item.dailyViews,
      item.weeklyViews,
      item.monthlyViews,
      item.totalViews,
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
        <div className="flex h-full items-center justify-center rounded-lg border border-gray-200/60 bg-white p-6 text-sm text-gray-400 shadow-sm">
          Veri Yok
        </div>
      );
    }

    const viewCount = getRangeValue(data, type);
    const imageUrl = data.listing.imageUrls[0] || 'https://via.placeholder.com/150';

    return (
      <div className="relative overflow-hidden rounded-lg border border-gray-200/60 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</span>
            <span className="mt-1 text-3xl font-bold tracking-tight text-gray-900">{viewCount.toLocaleString('tr-TR')}</span>
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
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">İlan Performansı</h1>
          <p className="mt-1 text-sm text-gray-500">İlan ziyaretleri, kategori filtreleri ve dışa aktarılabilir performans raporu.</p>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <PerformanceCard title="GÜNLÜK EN ÇOK ZİYARET" data={topDaily} type="daily" />
        <PerformanceCard title="HAFTALIK EN ÇOK ZİYARET" data={topWeekly} type="weekly" />
        <PerformanceCard title="AYLIK EN ÇOK ZİYARET" data={topMonthly} type="monthly" />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200/60 bg-white shadow-sm">
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
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Günlük</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Haftalık</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Aylık</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Toplam</th>
                <th className="px-6 py-4 text-center font-semibold tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    Performans verileri yükleniyor...
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    Veri bulunamadı.
                  </td>
                </tr>
              ) : (
                sortedData.map((item) => (
                  <tr key={item.listingId} className="transition-colors hover:bg-gray-50/80">
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
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{item.dailyViews}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{item.weeklyViews}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{item.monthlyViews}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">{item.totalViews.toLocaleString('tr-TR')}</td>
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
  );
};

export default AdminPerformance;

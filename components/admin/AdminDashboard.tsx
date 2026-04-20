import React from 'react';
import { Building2, FileText, Inbox, Landmark, ShieldCheck, TrendingUp, WalletCards } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { parsePrice } from '../../lib/price';

const AdminDashboard: React.FC = () => {
  const { listings, news, messages } = useData();
  const activeListingsData = listings.filter((listing) => listing.status === 'active');
  const publishedNews = news.filter((item) => (item.status || 'published') === 'published');
  const unreadMessages = messages.filter(m => !m.read).length;
  const saleListings = activeListingsData.filter((listing) => listing.type?.toLowerCase().includes('satılık')).length;
  const rentListings = activeListingsData.filter((listing) => listing.type?.toLowerCase().includes('kiralık')).length;
  const activeListings = activeListingsData.length;
  const featuredListings = activeListingsData.filter((listing) => listing.homepage_featured === true).length;
  const saleRatio = activeListings ? Math.round((saleListings / activeListings) * 100) : 0;
  const rentRatio = activeListings ? Math.round((rentListings / activeListings) * 100) : 0;

  const calculatePriceTotals = (items: typeof listings) => {
    return items.reduce(
      (acc, listing) => {
        const { amount, currency } = parsePrice(listing.price || '');
        const normalized = Number((amount || '').replace(/\./g, '').replace(/,/g, '.'));
        if (!Number.isFinite(normalized) || normalized <= 0) {
          return acc;
        }

        acc[currency] += normalized;
        return acc;
      },
      { TL: 0, USD: 0, EUR: 0, GBP: 0 }
    );
  };

  const formatMoneySummary = (totals: { TL: number; USD: number; EUR: number; GBP: number }) => {
    const formatter = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });
    const parts = [
      totals.TL ? `${formatter.format(totals.TL)} TL` : null,
      totals.USD ? `${formatter.format(totals.USD)} USD` : null,
      totals.EUR ? `${formatter.format(totals.EUR)} EUR` : null,
      totals.GBP ? `${formatter.format(totals.GBP)} GBP` : null,
    ].filter(Boolean);

    return parts.length ? parts.join(' · ') : 'Henüz fiyat verisi yok';
  };

  const overallPriceSummary = formatMoneySummary(calculatePriceTotals(activeListingsData));
  const salePriceSummary = formatMoneySummary(
    calculatePriceTotals(activeListingsData.filter((listing) => listing.type?.toLowerCase().includes('satılık')))
  );
  const rentPriceSummary = formatMoneySummary(
    calculatePriceTotals(activeListingsData.filter((listing) => listing.type?.toLowerCase().includes('kiralık')))
  );

  const StatCard = ({
    title,
    value,
    note,
    accent,
    icon,
  }: {
    title: string;
    value: number | string;
    note: string;
    accent: string;
    icon: React.ReactNode;
  }) => (
    <div className="group relative overflow-hidden rounded-[26px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] p-6 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_70px_-32px_rgba(15,23,42,0.42)]">
      <div className={`absolute inset-x-0 top-0 h-1.5 ${accent}`} />
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-slate-100/80 blur-3xl transition-transform duration-300 group-hover:scale-125" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.9),transparent_38%)] opacity-80" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">{title}</div>
          <div className="text-4xl font-black tracking-tight text-slate-900">{value}</div>
          <div className="mt-2 text-sm font-medium text-slate-500">{note}</div>
        </div>
        <div className="relative flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/90 bg-white/95 shadow-[0_16px_35px_-20px_rgba(15,23,42,0.35)]">
          <div className={`absolute inset-0 rounded-[22px] bg-gradient-to-br ${accent.replace('bg-gradient-to-r', 'from-white/0 via-white/0 to-white/0')} opacity-10`} />
          <div className="absolute inset-[1px] rounded-[21px] border border-slate-100/80" />
          <div className="relative text-slate-700">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
        <div className="relative overflow-hidden rounded-[30px] border border-gold-200/70 bg-[linear-gradient(135deg,#fffaf0_0%,#ffffff_45%,#f8fafc_100%)] p-8 shadow-[0_28px_70px_-40px_rgba(180,132,22,0.35)]">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gold-200/25 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-slate-200/30 blur-3xl" />
            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-2xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-white/85 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.26em] text-gold-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-gold-500" />
                        Dashboard
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Panel Özeti</h1>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                        Gayrimenkul portföyü, son içerik hareketleri ve mesaj trafiği tek ekranda daha net ve daha canlı görünür.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Aktif Portföy</div>
                        <div className="mt-2 text-2xl font-black text-slate-900">{activeListings}</div>
                    </div>
                    <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Vitrin</div>
                        <div className="mt-2 text-2xl font-black text-slate-900">{featuredListings}</div>
                    </div>
                    <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Satılık Payı</div>
                        <div className="mt-2 text-2xl font-black text-slate-900">%{saleRatio}</div>
                    </div>
                    <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Kiralık Payı</div>
                        <div className="mt-2 text-2xl font-black text-slate-900">%{rentRatio}</div>
                    </div>
                </div>
            </div>
            <div className="relative mt-6 flex flex-wrap items-center gap-3 border-t border-gold-100/80 pt-5 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 font-semibold text-white shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Panel canlı
                </span>
                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 font-medium">
                    Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
                </span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            <StatCard 
                title="Toplam İlan" 
                value={activeListings} 
                note="Yayında olan aktif ilanlar"
                accent="bg-gradient-to-r from-gold-400 via-amber-500 to-gold-600"
                icon={<Building2 className="h-7 w-7" strokeWidth={1.9} />} 
            />
            <StatCard 
                title="Satılık İlan" 
                value={saleListings} 
                note="Satış portföyünde aktif ve arşiv kayıtları"
                accent="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600"
                icon={<TrendingUp className="h-7 w-7" strokeWidth={1.9} />} 
            />
            <StatCard 
                title="Kiralık İlan" 
                value={rentListings} 
                note="Kiralama odaklı güncel ilanlar"
                accent="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500"
                icon={<Landmark className="h-7 w-7" strokeWidth={1.9} />} 
            />
            <StatCard 
                title="Aktif Haberler" 
                value={publishedNews.length} 
                note="Yayındaki blog ve haber içerikleri"
                accent="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"
                icon={<FileText className="h-7 w-7" strokeWidth={1.9} />} 
            />
            <StatCard 
                title="Okunmamış Mesaj" 
                value={unreadMessages} 
                note="Hızlı geri dönüş bekleyen yeni talepler"
                accent="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500"
                icon={<Inbox className="h-7 w-7" strokeWidth={1.9} />} 
            />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-[26px] border border-slate-200/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.35)]">
                <div className="mb-4 flex items-center justify-between">
                    <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Toplam Portföy Değeri</div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <WalletCards className="h-5 w-5 text-slate-700" strokeWidth={1.9} />
                    </div>
                </div>
                <div className="text-xl font-black leading-8 tracking-tight text-slate-900">{overallPriceSummary}</div>
                <div className="mt-2 text-sm text-slate-500">Tüm ilanların para birimine göre ayrılmış toplam fiyatı.</div>
            </div>
            <div className="rounded-[26px] border border-slate-200/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.35)]">
                <div className="mb-4 flex items-center justify-between">
                    <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Satılık Toplam Fiyat</div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <TrendingUp className="h-5 w-5 text-slate-700" strokeWidth={1.9} />
                    </div>
                </div>
                <div className="text-xl font-black leading-8 tracking-tight text-slate-900">{salePriceSummary}</div>
                <div className="mt-2 text-sm text-slate-500">Satılık ilanların toplam portföy değeri.</div>
            </div>
            <div className="rounded-[26px] border border-slate-200/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.35)]">
                <div className="mb-4 flex items-center justify-between">
                    <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Kiralık Toplam Fiyat</div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <ShieldCheck className="h-5 w-5 text-slate-700" strokeWidth={1.9} />
                    </div>
                </div>
                <div className="text-xl font-black leading-8 tracking-tight text-slate-900">{rentPriceSummary}</div>
                <div className="mt-2 text-sm text-slate-500">Kiralık ilanların toplam fiyat dağılımı.</div>
            </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between border-b border-slate-100 bg-[linear-gradient(180deg,#fcfcfd_0%,#f8fafc_100%)] px-6 py-5">
                <div>
                    <h2 className="text-lg font-black tracking-tight text-slate-900">Son Mesajlar</h2>
                    <p className="mt-1 text-sm text-slate-500">İletişim formundan gelen son talepler ve durumları.</p>
                </div>
                <button className="rounded-full border border-gold-200 bg-gold-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-gold-700 transition hover:bg-gold-100">
                    Tümünü Gör
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-semibold tracking-wider">Gönderen</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">Konu</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">Tarih</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {messages.slice(0, 5).map(m => (
                            <tr key={m.id} className="bg-white transition-colors hover:bg-slate-50/80">
                                <td className="px-6 py-4 font-semibold text-slate-900">{m.name}</td>
                                <td className="px-6 py-4 text-slate-600">{m.subject}</td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-500">{m.date}</td>
                                <td className="px-6 py-4">
                                    {m.read ? (
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                            Okundu
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-600">
                                            Yeni
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {messages.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                                    Henüz gösterilecek mesaj bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;

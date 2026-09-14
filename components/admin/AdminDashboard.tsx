import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  Home,
  Inbox,
  Megaphone,
  Plus,
  Star,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const AdminDashboard: React.FC = () => {
  const { listings, news, messages } = useData();

  const activeListings = listings.filter((listing) => (listing.status || 'active') === 'active');
  const archivedListings = listings.filter((listing) => listing.status === 'archived');
  const featuredListings = activeListings.filter((listing) => listing.homepage_featured === true);
  const publishedNews = news.filter((item) => (item.status || 'published') === 'published');
  const unreadMessages = messages.filter((message) => !message.read);

  const saleCount = activeListings.filter((listing) => listing.type?.toLocaleLowerCase('tr-TR').includes('satılık')).length;
  const rentCount = activeListings.filter((listing) => listing.type?.toLocaleLowerCase('tr-TR').includes('kiralık')).length;
  const salePercent = activeListings.length ? Math.round((saleCount / activeListings.length) * 100) : 0;
  const rentPercent = activeListings.length ? Math.round((rentCount / activeListings.length) * 100) : 0;

  const recentListings = [...listings]
    .sort((a, b) => {
      const dateA = new Date(a.createdDate || a.updateDate).getTime();
      const dateB = new Date(b.createdDate || b.updateDate).getTime();
      return dateB - dateA;
    })
    .slice(0, 4);

  const priorityItems = [
    unreadMessages.length > 0
      ? {
          title: `${unreadMessages.length} yeni mesaj var`,
          note: 'Müşteri taleplerine hızlı dönüş için mesajları kontrol edin.',
          to: '/admin/messages',
          action: 'Mesajlara Git',
          tone: 'urgent' as const,
        }
      : {
          title: 'Yeni mesaj yok',
          note: 'İletişim kutusu şu an temiz görünüyor.',
          to: '/admin/messages',
          action: 'Mesajları Gör',
          tone: 'calm' as const,
        },
    featuredListings.length < 3
      ? {
          title: 'Vitrin sayısı düşük',
          note: 'Ana sayfayı güçlü göstermek için vitrine birkaç ilan daha eklenebilir.',
          to: '/admin/listings',
          action: 'Vitrini Düzenle',
          tone: 'warn' as const,
        }
      : {
          title: 'Vitrin hazır',
          note: `${featuredListings.length} ilan ana sayfada öne çıkarılıyor.`,
          to: '/admin/listings',
          action: 'İlanları Gör',
          tone: 'calm' as const,
        },
  ];

  const StatCard = ({
    title,
    value,
    note,
    icon,
  }: {
    title: string;
    value: number | string;
    note: string;
    icon: React.ReactNode;
  }) => (
    <div className="rounded-[22px] border border-[#ece4d4] bg-white p-5 shadow-[0_14px_34px_rgba(32,41,56,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-[0.20em] text-[#9a8a67]">{title}</div>
          <div className="mt-3 text-[34px] font-black leading-none tracking-tight text-[#202938]">{value}</div>
          <div className="mt-2 text-sm font-medium leading-5 text-[#6b7280]">{note}</div>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff6df] text-[#d99b00] ring-1 ring-[#f1dfb4]">
          {icon}
        </div>
      </div>
    </div>
  );

  const ActionCard = ({
    title,
    note,
    to,
    action,
    tone,
  }: {
    title: string;
    note: string;
    to: string;
    action: string;
    tone: 'urgent' | 'warn' | 'calm';
  }) => {
    const toneClass = {
      urgent: 'border-rose-200 bg-rose-50/70 text-rose-700',
      warn: 'border-amber-200 bg-amber-50/80 text-amber-700',
      calm: 'border-emerald-200 bg-emerald-50/70 text-emerald-700',
    }[tone];

    return (
      <div className={`rounded-[22px] border p-5 ${toneClass}`}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2} />
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-[#202938]">{title}</h3>
            <p className="mt-1 text-sm font-medium leading-5 text-[#6b7280]">{note}</p>
            <Link to={to} className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#a97700]">
              {action}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-7">
      <section className="rounded-[28px] border border-[#eadfca] bg-[linear-gradient(135deg,#fffaf0_0%,#ffffff_60%,#f7f3eb_100%)] p-6 shadow-[0_20px_55px_rgba(32,41,56,0.07)] lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#b8860b]">Yönetim Özeti</div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#202938] lg:text-3xl">Bugünkü Durum</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#6b7280]">
              En önemli sayılar, takip edilmesi gereken işler ve son kayıtlar tek ekranda sadeleştirildi.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/listings" className="inline-flex items-center gap-2 rounded-full bg-[#202938] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-sm transition hover:bg-[#111827]">
              <Plus className="h-4 w-4" />
              İlan Ekle
            </Link>
            <Link to="/admin/performance" className="inline-flex items-center gap-2 rounded-full border border-[#eadfca] bg-white px-5 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#202938] shadow-sm transition hover:border-[#d99b00]">
              Performans
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Aktif İlan" value={activeListings.length} note="Sitede yayında olan portföy" icon={<Building2 className="h-6 w-6" strokeWidth={1.9} />} />
        <StatCard title="Vitrindeki İlan" value={featuredListings.length} note="Ana sayfada öne çıkan ilan" icon={<Star className="h-6 w-6" strokeWidth={1.9} />} />
        <StatCard title="Yeni Mesaj" value={unreadMessages.length} note="Okunmamış müşteri talebi" icon={<Inbox className="h-6 w-6" strokeWidth={1.9} />} />
        <StatCard title="Yayındaki Haber" value={publishedNews.length} note="Aktif blog ve haber içeriği" icon={<FileText className="h-6 w-6" strokeWidth={1.9} />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[26px] border border-[#ece4d4] bg-white p-5 shadow-[0_14px_34px_rgba(32,41,56,0.06)] lg:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-[#202938]">Öncelikli İşler</h2>
              <p className="mt-1 text-sm font-medium text-[#6b7280]">Panel açıldığında ilk bakılacak konular.</p>
            </div>
            <Megaphone className="h-6 w-6 text-[#d99b00]" strokeWidth={1.9} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {priorityItems.map((item) => (
              <ActionCard key={item.title} {...item} />
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-[#ece4d4] bg-white p-5 shadow-[0_14px_34px_rgba(32,41,56,0.06)] lg:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-black text-[#202938]">İlan Dağılımı</h2>
            <p className="mt-1 text-sm font-medium text-[#6b7280]">Aktif ilanların satış/kiralama özeti.</p>
          </div>
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#202938]">
                <span>Satılık</span>
                <span>{saleCount} ilan</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#f0eadf]">
                <div className="h-full rounded-full bg-[#d99b00]" style={{ width: `${salePercent}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-bold text-[#202938]">
                <span>Kiralık</span>
                <span>{rentCount} ilan</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#f0eadf]">
                <div className="h-full rounded-full bg-[#202938]" style={{ width: `${rentPercent}%` }} />
              </div>
            </div>
            <div className="rounded-[18px] bg-[#fbf8f1] px-4 py-3 text-sm font-semibold text-[#6b7280]">
              Arşivde bekleyen ilan: <span className="font-black text-[#202938]">{archivedListings.length}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-[26px] border border-[#ece4d4] bg-white shadow-[0_14px_34px_rgba(32,41,56,0.06)]">
          <div className="flex items-center justify-between border-b border-[#f0eadf] px-5 py-4 lg:px-6">
            <div>
              <h2 className="text-lg font-black text-[#202938]">Son İlanlar</h2>
              <p className="mt-1 text-sm font-medium text-[#6b7280]">En son eklenen veya güncellenen kayıtlar.</p>
            </div>
            <Link to="/admin/listings" className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#a97700]">Tümü</Link>
          </div>
          <div className="divide-y divide-[#f0eadf]">
            {recentListings.map((listing) => (
              <Link key={listing.id} to="/admin/listings" className="flex items-center gap-4 px-5 py-4 transition hover:bg-[#fbf8f1] lg:px-6">
                <img src={listing.imageUrls[0] || 'https://via.placeholder.com/120'} alt="" className="h-14 w-16 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-extrabold text-[#202938]">{listing.title}</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs font-bold text-[#8b95a7]">
                    <span>{listing.category}</span>
                    <span>{listing.updateDate}</span>
                  </div>
                </div>
                {listing.homepage_featured && <Home className="h-4 w-4 shrink-0 text-[#d99b00]" />}
              </Link>
            ))}
            {recentListings.length === 0 && (
              <div className="px-6 py-10 text-center text-sm font-medium text-[#6b7280]">Henüz ilan bulunmuyor.</div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-[26px] border border-[#ece4d4] bg-white shadow-[0_14px_34px_rgba(32,41,56,0.06)]">
          <div className="flex items-center justify-between border-b border-[#f0eadf] px-5 py-4 lg:px-6">
            <div>
              <h2 className="text-lg font-black text-[#202938]">Son Mesajlar</h2>
              <p className="mt-1 text-sm font-medium text-[#6b7280]">Yeni talepler hızlıca takip edilsin.</p>
            </div>
            <Link to="/admin/messages" className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#a97700]">Tümü</Link>
          </div>
          <div className="divide-y divide-[#f0eadf]">
            {messages.slice(0, 4).map((message) => (
              <Link key={message.id} to="/admin/messages" className="flex items-center gap-4 px-5 py-4 transition hover:bg-[#fbf8f1] lg:px-6">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${message.read ? 'bg-[#f3f4f6] text-[#6b7280]' : 'bg-[#fff1f2] text-[#e11d48]'}`}>
                  {message.name.slice(0, 1).toLocaleUpperCase('tr-TR')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-extrabold text-[#202938]">{message.name}</div>
                  <div className="mt-1 truncate text-xs font-semibold text-[#6b7280]">{message.subject}</div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${message.read ? 'bg-[#f3f4f6] text-[#6b7280]' : 'bg-[#fff1f2] text-[#e11d48]'}`}>
                  {message.read ? 'Okundu' : 'Yeni'}
                </span>
              </Link>
            ))}
            {messages.length === 0 && (
              <div className="px-6 py-10 text-center text-sm font-medium text-[#6b7280]">Henüz mesaj bulunmuyor.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

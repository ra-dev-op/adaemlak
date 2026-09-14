
import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import SeoHead from '../SeoHead';
import { ADMIN_LOGIN_PATH, clearAdminToken, isAdminAuthenticated } from '../../config/adminAuth';
import { useData } from '../../context/DataContext';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshAdminState } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate(ADMIN_LOGIN_PATH);
      return;
    }

    void refreshAdminState();
  }, [location.pathname, navigate, refreshAdminState]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAdminToken();
    navigate(ADMIN_LOGIN_PATH);
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'İlan Performansı', path: '/admin/performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: 'İlanlar', path: '/admin/listings', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Haberler', path: '/admin/news', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { label: 'Mesajlar', path: '/admin/messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'SEO Ayarları', path: '/admin/seo', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { label: 'Google', path: '/admin/google', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Ayarlar', path: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  return (
    <>
      <SeoHead title="Yönetim Paneli" description="Ada Emlak yönetim paneli giriş sonrası içerik yönetim ekranı." noIndex />
      <div className="flex min-h-screen bg-gray-50/50 font-sans text-gray-800">
      <div className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
        <Link to="/" className="font-bold tracking-tight text-gray-900">ADA PANEL</Link>
        <button
          type="button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm"
          aria-label="Menüyü aç"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-20 bg-slate-900/35 backdrop-blur-[2px] lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <div className={`fixed z-30 flex h-full w-72 flex-col border-r border-[#eadfca] bg-[#fbf8f1] text-[#243041] shadow-[18px_0_55px_rgba(32,41,56,0.08)] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="relative flex h-24 items-center justify-center border-b border-[#eadfca] bg-[linear-gradient(135deg,#fffaf0_0%,#ffffff_55%,#f6efe0_100%)]">
            <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent" />
            <Link to="/" className="flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
               <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-500 text-xl font-extrabold text-white shadow-[0_12px_26px_rgba(238,169,4,0.28)]">A</div>
               <div>
                <span className="block text-lg font-extrabold tracking-tight text-[#202938]">ADA PANEL</span>
                <span className="mt-0.5 block text-[9px] font-extrabold uppercase tracking-[0.28em] text-gold-600">Yönetim</span>
               </div>
            </Link>
        </div>
        
        <nav className="flex-1 space-y-2 px-4 py-7">
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-[#a9905a]">Menü</span>
              <span className="h-px flex-1 bg-[#eadfca] ml-4" />
            </div>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`group relative flex items-center rounded-2xl px-4 py-3.5 transition-all duration-200
                            ${isActive 
                                ? 'bg-white text-[#202938] shadow-[0_14px_28px_rgba(32,41,56,0.08)] ring-1 ring-[#f0dfb6]' 
                                : 'text-[#6b7280] hover:bg-white/70 hover:text-[#202938]'
                            }
                        `}
                    >
                        {/* Active Indicator Bar */}
                        {isActive && <div className="absolute -left-4 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r-full bg-gold-500 shadow-[0_0_16px_rgba(238,169,4,0.42)]"></div>}
                        
                        <span className={`mr-3 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isActive ? 'bg-gold-50 text-gold-600 ring-1 ring-gold-100' : 'bg-white/70 text-[#9aa3b2] ring-1 ring-[#eee5d4] group-hover:text-gold-600'}`}>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2 : 1.6}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                          </svg>
                        </span>
                        <span className={`text-[13px] tracking-wide ${isActive ? 'font-extrabold' : 'font-semibold'}`}>{item.label}</span>
                        {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-gold-500" />}
                    </Link>
                );
            })}
        </nav>
        
        <div className="border-t border-[#eadfca] p-4">
            <button onClick={handleLogout} className="group flex w-full items-center rounded-2xl px-4 py-3 text-[#6b7280] transition-colors hover:bg-red-50 hover:text-red-600">
                <span className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-[#eee5d4] transition-transform group-hover:-translate-x-1">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </span>
                <span className="text-sm font-bold">Çıkış Yap</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-6 lg:ml-72 lg:max-w-[1600px] lg:px-10 lg:pb-10 lg:pt-10">
        <Outlet />
      </div>
    </div>
    </>
  );
};

export default AdminLayout;

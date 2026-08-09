
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
    { label: 'Reklam', path: '/admin/ads', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
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

      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <div className={`fixed z-30 flex h-full w-72 flex-col border-r border-gray-800 bg-[#1a1a1a] text-gray-300 shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-20 flex items-center justify-center border-b border-gray-800/80">
            <Link to="/" className="flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
               <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center text-[#1a1a1a] font-bold text-xl">A</div>
               <span className="font-sans font-bold text-lg tracking-tight text-white">ADA PANEL</span>
            </Link>
        </div>
        
        <nav className="flex-1 py-8 px-0 space-y-1">
            <div className="px-6 mb-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Menü</div>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`flex items-center px-6 py-3.5 transition-all duration-200 group relative
                            ${isActive 
                                ? 'bg-white/5 text-white' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }
                        `}
                    >
                        {/* Active Indicator Bar */}
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500 shadow-[0_0_10px_rgba(232,175,54,0.5)]"></div>}
                        
                        <svg className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-gold-500 fill-current/10' : 'text-gray-500 group-hover:text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        <span className={`text-[13px] font-medium tracking-wide ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
        
        <div className="p-6 border-t border-gray-800/80">
            <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-red-400 transition-colors w-full px-2 group">
                <svg className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span className="font-medium text-sm">Çıkış Yap</span>
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

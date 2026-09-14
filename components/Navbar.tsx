
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_MENU, MOBILE_NAV_ITEMS, MOBILE_CATEGORY_ITEMS } from '../constants';
import MobileDrawer from './MobileDrawer';
import MobileBottomNav from './MobileBottomNav';

const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches;

const Navbar: React.FC = () => {
  const [drawerType, setDrawerType] = useState<'none' | 'category' | 'menu'>('none');
  const [isMobile, setIsMobile] = useState(isMobileViewport);
  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const syncViewport = () => {
      const nextIsMobile = mediaQuery.matches;
      setIsMobile(nextIsMobile);

      if (!nextIsMobile) {
        setDrawerType('none');
      }
    };

    syncViewport();
    mediaQuery.addEventListener('change', syncViewport);
    window.addEventListener('resize', syncViewport);

    return () => {
      mediaQuery.removeEventListener('change', syncViewport);
      window.removeEventListener('resize', syncViewport);
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== '/' || !isMobile) return;

    const storageKey = 'adaemlak-mobile-category-intro';
    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, 'shown');
    } catch {
      // The category screen should still open when browser storage is unavailable.
    }

    setDrawerType('category');
  }, [isMobile, location.pathname]);

  return (
    <>
    <div className="sticky top-0 z-40 bg-white/10 pt-2 pb-1 backdrop-blur-[1px]">
      <div className="container mx-auto max-w-[1320px] px-4">
        {/* DESKTOP MENU (Visible >= 1024px) */}
        <div
          className="relative z-50 hidden border border-gray-200 bg-[#f4f4f4] shadow-md transition-all duration-500 hover:border-gray-300 hover:shadow-xl lg:block"
          style={{
            backgroundImage: 'linear-gradient(180deg, #fafafa 0%, #f1f1f1 100%)',
          }}
        >
          <div
            className="flex flex-wrap items-center justify-center px-2 py-[17px] text-[17px] font-bold tracking-[0.01em] text-[#6f6e73]"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            {NAV_MENU.map((item, index) => (
              <React.Fragment key={item.slug}>
                <div className="group relative">
                    {item.externalUrl ? (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 transition-all duration-300 relative block transform hover:-translate-y-0.5 hover:text-gold-500 active:scale-95 lg:px-5 xl:px-6 uppercase"
                      >
                        <span className={`relative z-10 drop-shadow-none group-hover:drop-shadow-sm transition-all duration-300 ${item.slug === 'depo-antrepo' ? 'ada-depo-menu-blink' : ''}`}>{item.label}</span>
                        <span className="absolute bottom-0 left-1/2 w-0 h-[3px] bg-gold-500 transition-all duration-300 group-hover:w-3/4 group-hover:-translate-x-1/2 opacity-0 group-hover:opacity-100 ease-out rounded-full shadow-[0_1px_6px_rgba(232,175,54,0.5)]"></span>
                      </a>
                    ) : (
                      <a 
                        href="#" 
                        onClick={(e) => e.preventDefault()}
                        className="min-h-11 px-3 py-3 transition-all duration-300 relative block transform cursor-default hover:-translate-y-0.5 hover:text-gold-500 active:scale-95 lg:px-5 xl:px-6 uppercase"
                      >
                        <span className="relative z-10 drop-shadow-none group-hover:drop-shadow-sm transition-all duration-300">{item.label}</span>
                        <span className="absolute bottom-0 left-1/2 w-0 h-[3px] bg-gold-500 transition-all duration-300 group-hover:w-3/4 group-hover:-translate-x-1/2 opacity-0 group-hover:opacity-100 ease-out rounded-full shadow-[0_1px_6px_rgba(232,175,54,0.5)]"></span>
                      </a>
                    )}

                    {/* Dropdown Menu */}
                    <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50 w-48 ${item.externalUrl ? 'hidden' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                        <div className="bg-white rounded-md shadow-premium border-t-4 border-gold-500 overflow-hidden py-2">
                             {item.subItems.map((sub, subIndex) => (
                                 <Link 
                                    key={subIndex} 
                                    to={sub.link} 
                                    className="block px-5 py-3 text-[15px] font-bold text-gray-600 hover:text-gold-500 hover:bg-gray-50 transition-colors uppercase"
                                 >
                                     {sub.label}
                                 </Link>
                             ))}
                        </div>
                    </div>
                </div>

                {index < NAV_MENU.length - 1 && (
                  <span className="text-gray-300 select-none text-xs scale-y-125 font-light opacity-60">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </div>

    {/* --- MOBILE DRAWERS (Portal Based) --- */}
    {isMobile && (
      <>
        <MobileDrawer
            isOpen={drawerType === 'menu'}
            onClose={() => setDrawerType('none')}
            title="MENÜ"
            items={MOBILE_NAV_ITEMS}
        />

        <MobileDrawer
            isOpen={drawerType === 'category'}
            onClose={() => setDrawerType('none')}
            title="KATEGORİLER"
            items={MOBILE_CATEGORY_ITEMS}
        />

        <MobileBottomNav
            onOpenCategories={() => setDrawerType('category')}
            onOpenMenu={() => setDrawerType('menu')}
        />
      </>
    )}
    </>
  );
};

export default Navbar;

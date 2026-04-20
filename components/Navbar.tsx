
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_MENU, MOBILE_NAV_ITEMS, MOBILE_CATEGORY_ITEMS } from '../constants';
import MobileDrawer from './MobileDrawer';
import MobileBottomNav from './MobileBottomNav';

const Navbar: React.FC = () => {
  const [drawerType, setDrawerType] = useState<'none' | 'category' | 'menu'>('none');
  const location = useLocation();

  return (
    <>
    <div className="sticky top-0 z-40 backdrop-blur-sm bg-white/50 pt-2 pb-1">
      <div className="container mx-auto max-w-[1320px] px-4">
        {/* DESKTOP MENU (Visible >= 1024px) */}
        <div className="hidden lg:block bg-[#f4f4f4] border border-gray-200 rounded-full shadow-md hover:shadow-xl transition-all duration-500 ease-out hover:border-gray-300 relative z-50">
          <div className="flex flex-wrap justify-center items-center py-4 px-2 text-[15px] font-extrabold text-[#3a3a3a] font-sans tracking-wide">
            {NAV_MENU.map((item, index) => (
              <React.Fragment key={item.slug}>
                <div className="group relative">
                    {item.externalUrl ? (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 lg:px-6 py-2 hover:text-gold-500 transition-all duration-300 uppercase relative block transform hover:-translate-y-0.5 active:scale-95"
                      >
                        <span className="relative z-10 drop-shadow-none group-hover:drop-shadow-sm transition-all duration-300">{item.label}</span>
                        <span className="absolute bottom-0 left-1/2 w-0 h-[3px] bg-gold-500 transition-all duration-300 group-hover:w-3/4 group-hover:-translate-x-1/2 opacity-0 group-hover:opacity-100 ease-out rounded-full shadow-[0_1px_6px_rgba(232,175,54,0.5)]"></span>
                      </a>
                    ) : (
                      <a 
                        href="#" 
                        onClick={(e) => e.preventDefault()}
                        className="px-3 lg:px-6 py-2 hover:text-gold-500 transition-all duration-300 uppercase relative block transform hover:-translate-y-0.5 active:scale-95 cursor-default"
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
                                    className="block px-5 py-3 text-sm font-bold text-gray-600 hover:text-gold-500 hover:bg-gray-50 transition-colors uppercase"
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
  );
};

export default Navbar;

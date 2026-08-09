import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const directMobileHref = 'tel:+905322435522';

  return (
    <div className="bg-white relative shadow-sm z-50 font-sans w-full overflow-hidden">
      <style>{`
        @keyframes intermittentPulse {
            0%, 90% { transform: scale(1); }
            95% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .animate-intermittent-pulse {
            animation: intermittentPulse 5s ease-in-out infinite;
        }
      `}</style>
      
      {/* Top Bar Spacer */}
      <div className="container mx-auto max-w-[1320px] relative h-2"></div>

      <div className="container mx-auto max-w-[1320px] px-4 pb-4 lg:pb-6">
        
        {/* Navigation (Desktop Only) & Phone Area */}
        <div className="mb-2 rounded-full border border-[#ece8dd] bg-[linear-gradient(180deg,#ffffff_0%,#fbf9f4_100%)] px-4 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.04)] lg:mb-5 lg:px-5">
        <div className="flex justify-between lg:justify-end items-center">
          
          {/* Mobile Logo Placement (Hidden on Desktop, used for alignment if needed, but here we keep structure) 
              Actually, for mobile, we want Logo Left, Phone Right.
              We will restructure the main container to handle this responsive switch.
          */}

          {/* Desktop Nav Links (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center">
            {[
              { label: 'Ana Sayfa', path: '/' },
              { label: 'Hakkımızda', path: '/hakkimizda' },
              { label: 'Haberler', path: '/blog' },
              { label: 'Referanslarımız', path: '/referanslar' },
              { label: 'İletişim', path: '/iletisim' }
            ].map((link, index, arr) => (
              <React.Fragment key={link.path}>
                <Link 
                  to={link.path} 
                  className="relative group rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-[#6c7480] tracking-[0.08em] hover:bg-white hover:text-gold-600 transition-all duration-200 ease-out uppercase"
                >
                  {link.label}
                  <span className="absolute bottom-[2px] left-2.5 right-2.5 h-[1.5px] bg-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-left"></span>
                </Link>
                {index < arr.length - 1 && (
                   <span className="text-[#d7dbe2] mx-1.5 select-none font-light text-[10px]">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Phone Number (Visible on All, Styled for Mobile) */}
          <div className="hidden lg:block ml-4 pl-4 border-l border-[#ebe5d8] py-0.5">
             <a href={directMobileHref} className="flex items-center gap-2.5 rounded-full bg-white px-3 py-1.5 group/phone cursor-pointer animate-intermittent-pulse origin-right shadow-[0_8px_18px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(232,175,54,0.15)]">
                <div className="bg-gold-50 p-1.5 rounded-full group-hover/phone:bg-gold-500 transition-colors duration-200">
                    <svg className="w-3.5 h-3.5 text-gold-600 stroke-current stroke-[2]" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                </div>
                <span className="font-sans font-bold text-[15px] tracking-wide text-gray-700 group-hover/phone:text-gold-600 transition-all duration-200">
                    44 44 232
                </span>
             </a>
          </div>
        </div>
        </div>

        {/* Logo and Phone Area (Responsive Layout) */}
        <div className="flex flex-row justify-between items-center lg:items-end pb-1 lg:border-b lg:border-gray-100/50">
          
          {/* Logo Section */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="block group">
                <img 
                  src="https://www.adaemlak.com.tr/UserFiles/images/Logolar/adaemlakcomtr.png" 
                  alt="Ada Emlak" 
                  className="h-16 w-auto md:h-20 lg:h-[100px] object-contain transition-transform duration-300 group-hover:scale-[1.02] origin-bottom-left drop-shadow-sm"
                  decoding="async"
                  fetchPriority="high"
                />
            </Link>
          </div>

          {/* Mobile Phone (Right Aligned) */}
          <div className="lg:hidden flex items-center">
             <a href={directMobileHref} className="flex items-center gap-2 bg-gold-50/50 px-3 py-1.5 rounded-full border border-gold-100 animate-intermittent-pulse">
                <svg className="w-4 h-4 text-gold-600 fill-current" viewBox="0 0 24 24">
                    <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="text-sm font-bold text-gray-800 tracking-wide">44 44 232</span>
             </a>
          </div>

          {/* Banner Section (Desktop Only) */}
          <div className="hidden lg:flex w-full md:w-auto flex-col items-end md:ml-4 flex-grow justify-end">
              <div className="mb-0 w-full flex justify-end">
                  <img 
                    src="/header-banner.gif" 
                    alt="Ada Emlak 44 44 232" 
                    className="h-auto w-full max-w-[850px] object-contain opacity-100 hover:opacity-100 transition-opacity"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Header;

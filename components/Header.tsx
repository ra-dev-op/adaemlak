import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const directMobileHref = 'tel:+905322435522';
  const headerBannerSrc = `${import.meta.env.BASE_URL}ada-emlak-top-banner.gif`;
  const topPhoneGifSrc = `${import.meta.env.BASE_URL}top-phone.gif`;

  return (
    <div className="relative z-50 w-full overflow-hidden bg-transparent font-sans">
      <style>{`
        @keyframes intermittentPulse {
            0%, 90% { transform: scale(1); }
            95% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .animate-intermittent-pulse {
            animation: intermittentPulse 5s ease-in-out infinite;
        }
        @keyframes phoneTextPulse {
            0%, 100% {
                color: #424851;
                text-shadow: none;
            }
            45% {
                color: #c88900;
                text-shadow: 0 0 8px rgba(238,169,4,0.22);
            }
        }
        @keyframes phoneCardBreath {
            0%, 100% {
                transform: translateY(0);
                box-shadow: 0 1px 0 rgba(255,255,255,0.52) inset, 0 7px 18px rgba(70,70,70,0.05);
                border-color: rgba(238,169,4,0.18);
            }
            50% {
                transform: translateY(-1px);
                box-shadow: 0 1px 0 rgba(255,255,255,0.7) inset, 0 10px 24px rgba(238,169,4,0.11);
                border-color: rgba(238,169,4,0.34);
            }
        }
        @keyframes phoneIconRing {
            0%, 78%, 100% { transform: rotate(0deg) scale(1); }
            82% { transform: rotate(-10deg) scale(1.08); }
            86% { transform: rotate(9deg) scale(1.08); }
            90% { transform: rotate(-6deg) scale(1.04); }
            94% { transform: rotate(4deg) scale(1.02); }
        }
        .ada-phone-text {
            animation: phoneTextPulse 4.8s ease-in-out infinite;
        }
        .ada-phone-icon {
            transform-origin: 50% 50%;
            animation: phoneIconRing 4.8s ease-in-out infinite;
        }
        .ada-phone-card {
            animation: phoneCardBreath 4.8s ease-in-out infinite;
        }
      `}</style>
      
      {/* Top Bar Spacer */}
      <div className="container mx-auto max-w-[1320px] relative h-2"></div>

      <div className="container mx-auto max-w-[1320px] px-4 pb-4 lg:pb-5">
        
        {/* Navigation (Desktop Only) & Phone Area */}
        <div className="mb-2 px-4 py-2 lg:mx-auto lg:mb-4 lg:max-w-[1100px] lg:px-5">
        <div className="flex justify-between lg:justify-end items-center">
          
          {/* Mobile Logo Placement (Hidden on Desktop, used for alignment if needed, but here we keep structure) 
              Actually, for mobile, we want Logo Left, Phone Right.
              We will restructure the main container to handle this responsive switch.
          */}

          {/* Desktop Nav Links (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-1.5">
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
                  className={`relative px-3 py-2 text-[12px] font-semibold uppercase leading-none text-[#62666c] transition-colors duration-200 ease-out hover:text-[#eea904] ${link.label === 'İletişim' ? 'text-[#333333]' : ''}`}
                >
                  {link.label}
                </Link>
                {index < arr.length - 1 && (
                   <span className="h-3 w-px select-none bg-[#d8d1c4]"></span>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Phone Number (Visible on All, Styled for Mobile) */}
          <div className="hidden lg:block ml-5 pl-4 py-0.5">
             <a href={directMobileHref} className="ada-phone-card relative flex origin-right cursor-pointer items-center gap-2.5 rounded-full border bg-white/42 px-4 py-2 transition-all duration-300 hover:-translate-y-0.5 group/phone">
                <div className="relative z-10 rounded-full bg-transparent p-1 transition-colors duration-200 group-hover/phone:text-[#c88900]">
                    <svg className="ada-phone-icon w-3.5 h-3.5 text-gold-600 stroke-current stroke-[2]" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                </div>
                <img
                  src={topPhoneGifSrc}
                  alt="44 44 232"
                  className="relative z-10 h-[20px] w-auto object-contain"
                  width="246"
                  height="40"
                  loading="eager"
                  decoding="async"
                />
             </a>
          </div>
        </div>
        </div>

        {/* Logo and Phone Area (Responsive Layout) */}
        <div className="flex items-center justify-between gap-3 pb-3 lg:mx-auto lg:max-w-[1100px] lg:items-end lg:justify-start lg:gap-0 lg:border-b lg:border-gray-100/50 lg:pb-1">
          
          {/* Logo Section */}
          <div className="flex w-[94px] shrink-0 items-center justify-start sm:w-[112px] lg:w-[216px]">
            <Link to="/" className="block" aria-label="Ada Emlak ana sayfa">
                <img 
                  src={`${import.meta.env.BASE_URL}ada-emlak-logo.png`}
                  alt="Ada Emlak" 
                  className="h-[56px] w-auto object-contain sm:h-[64px] lg:h-[96px]"
                  width="151"
                  height="81"
                  decoding="async"
                  fetchPriority="high"
                />
            </Link>
          </div>

          {/* Mobile Banner */}
          <div className="flex min-w-0 flex-1 justify-end lg:hidden">
             <a href={directMobileHref} className="block min-w-0 flex-1" aria-label="44 44 232 numarasını ara">
                <img
                  src={`${import.meta.env.BASE_URL}ada-emlak-mobile-top-banner.gif`}
                  alt="Ada Emlak 44 44 232"
                  className="h-auto w-full object-contain object-right"
                  width="850"
                  height="59"
                  loading="eager"
                  decoding="async"
                />
             </a>
          </div>

          {/* Banner Section (Desktop Only) */}
          <div className="hidden min-w-0 flex-1 flex-col justify-end lg:flex">
              <div className="mb-[2px] flex w-full justify-start">
                  <img 
                    src={headerBannerSrc} 
                    alt="Ada Emlak 44 44 232" 
                    className="h-auto w-full max-w-[884px] object-contain object-left-bottom opacity-100 transition-opacity hover:opacity-100"
                    width="850"
                    height="59"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Header;

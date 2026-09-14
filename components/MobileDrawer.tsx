
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import {
  House,
  Building2,
  Newspaper,
  Users,
  Mail,
  Lock,
  Map,
  Landmark,
  Factory,
  Warehouse,
  BriefcaseBusiness,
  Gem,
  ChevronRight,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: { label: string; path: string; icon?: string; iconKey?: string; externalUrl?: string }[];
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, title, items }) => {
  const directMobileHref = 'tel:+905322435522';
  const isCategoryDrawer = title === 'KATEGORİLER';
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const renderIcon = (key: string | undefined) => {
    const className = 'h-5 w-5 stroke-[1.9]';

    switch (key) {
      case 'home':
        return <House className={className} />;
      case 'about':
        return <Building2 className={className} />;
      case 'news':
        return <Newspaper className={className} />;
      case 'refs':
        return <Users className={className} />;
      case 'contact':
        return <Mail className={className} />;
      case 'admin':
        return <Lock className={className} />;
      case 'arsa':
        return <Map className={className} />;
      case 'bina':
        return <Building2 className={className} />;
      case 'plaza':
        return <Landmark className={className} />;
      case 'fabrika':
        return <Factory className={className} />;
      case 'depo-antrepo':
        return <Warehouse className={className} />;
      case 'is-yeri':
        return <BriefcaseBusiness className={className} />;
      case 'luks-konut':
        return <Gem className={className} />;
      default:
        return <ChevronRight className={className} />;
    }
  };

  const drawerContent = (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${isCategoryDrawer ? 'bg-[#172d31]/72' : 'bg-black/60 backdrop-blur-sm'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Drawer Panel */}
      <div className={`relative flex h-full w-full flex-col bg-white transform transition-transform duration-300 animate-slide-in-right ${isCategoryDrawer ? 'max-w-none shadow-[0_0_45px_rgba(10,28,32,0.30)] sm:max-w-[430px]' : 'max-w-[340px] shadow-2xl'}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between border-b border-gray-100 ${isCategoryDrawer ? 'min-h-[64px] px-5 py-3' : 'p-5 bg-gray-50/50'}`}>
            <h2 className={`${isCategoryDrawer ? 'text-[18px] font-sans tracking-[0.035em]' : 'text-lg font-serif tracking-wide'} flex items-center gap-2.5 font-bold text-gray-800`}>
            <span className={`${isCategoryDrawer ? 'h-5 w-[3px]' : 'h-4 w-[2px]'} bg-gold-500`}></span>
            {title}
            </h2>
            <button onClick={onClose} className={`${isCategoryDrawer ? 'h-10 w-10' : 'w-10 h-10'} rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm outline-none active:scale-95`} aria-label={`${title} panelini kapat`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {isCategoryDrawer && (
          <Link
            to="/"
            onClick={onClose}
            className="shrink-0 border-b border-[#ece8de] bg-white px-5 pb-4 pt-4 text-center"
            aria-label="Ada Emlak ana sayfa - Gayrimenkul Yatırım Danışmanlığı"
          >
            <img
              src={`${import.meta.env.BASE_URL}ada-emlak-logo.png`}
              alt="Ada Emlak"
              className="mx-auto h-[64px] w-auto object-contain"
              width="151"
              height="81"
              decoding="async"
            />
            <img
              src={`${import.meta.env.BASE_URL}ada-emlak-mobile-top-banner.gif`}
              alt="Ada Emlak 44 44 232"
              className="mx-auto mt-3 h-auto w-full max-w-[340px] object-contain"
              width="862"
              height="90"
              decoding="async"
            />
          </Link>
        )}

        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto ${isCategoryDrawer ? 'space-y-2.5 bg-[#fbfbfa] px-4 py-4' : 'p-4 space-y-3'}`}>
            {items.map((item, index) => {
                const commonClasses = `flex items-center justify-between border border-[#e3e6e9] bg-white transition-all duration-200 active:scale-[0.99] group hover:border-[#e4bd58] hover:bg-[#fffdf8] ${isCategoryDrawer ? 'min-h-[72px] px-4 py-3.5 shadow-[0_4px_14px_rgba(15,23,42,0.035)]' : 'rounded-[18px] px-4 py-4 shadow-[0_6px_18px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_28px_rgba(217,162,26,0.10)]'}`;
                const content = (
                  <>
                    <div className="flex min-w-0 items-center gap-4">
                        <div className={`flex shrink-0 items-center justify-center border border-[#efdfb9] bg-[#fffaf0] text-[#c69012] transition-all duration-200 group-hover:border-[#e1bf66] group-hover:bg-[#eea904] group-hover:text-white ${isCategoryDrawer ? 'h-12 w-12' : 'h-11 w-11 rounded-[14px] shadow-[0_6px_14px_rgba(217,162,26,0.10)]'}`}>
                            {renderIcon(item.iconKey || item.icon)}
                        </div>
                        <span className={`${isCategoryDrawer ? 'text-[15px] tracking-[0.075em]' : 'text-sm tracking-[0.08em]'} truncate font-extrabold uppercase text-gray-700 transition-colors group-hover:text-[#b57906]`}>{item.label}</span>
                    </div>
                    <div className="text-[#c4c9d2] group-hover:text-[#c69012] transition-colors">
                        <ChevronRight className="h-5 w-5 stroke-[1.9]" />
                    </div>
                  </>
                );

                if (item.externalUrl) {
                  return (
                    <a
                      key={index}
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className={commonClasses}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <Link 
                      key={index}
                      to={item.path}
                      onClick={onClose}
                      className={commonClasses}
                  >
                      {content}
                  </Link>
                );
            })}
        </div>

        {!isCategoryDrawer && (
          <div className="border-t border-gray-100 bg-gray-50 p-5">
              <a href={directMobileHref} className="block w-full bg-gold-500 text-white font-bold uppercase text-center py-3 rounded-lg shadow-sm hover:bg-gold-600 transition-colors">
                  Hemen Ara: 44 44 232
              </a>
          </div>
        )}

      </div>
      <style>{`
        @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        .animate-slide-in-right {
            animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );

  return ReactDOM.createPortal(drawerContent, document.body);
};

export default MobileDrawer;

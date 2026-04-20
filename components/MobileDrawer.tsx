
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Drawer Panel */}
      <div className="relative w-[85%] max-w-[340px] bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-slide-in-right">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-serif font-bold text-gray-800 tracking-wide flex items-center gap-2">
            <span className="w-1 h-5 bg-gold-500 rounded-full"></span>
            {title}
            </h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm outline-none active:scale-95">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map((item, index) => {
                const commonClasses = "flex items-center justify-between rounded-[18px] border border-[#eef1f4] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] px-4 py-4 shadow-[0_6px_18px_rgba(15,23,42,0.04)] transition-all duration-200 active:scale-[0.98] group hover:border-[#ead18f] hover:shadow-[0_12px_28px_rgba(217,162,26,0.10)]";
                const content = (
                  <>
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[#efe5cb] bg-[linear-gradient(180deg,#fffaf0_0%,#f9f1df_100%)] text-[#c69012] shadow-[0_6px_14px_rgba(217,162,26,0.10)] transition-all duration-200 group-hover:border-[#e1bf66] group-hover:bg-[linear-gradient(180deg,#f4c958_0%,#e2a921_100%)] group-hover:text-white">
                            {renderIcon(item.iconKey || item.icon)}
                        </div>
                        <span className="font-bold text-sm text-gray-700 uppercase tracking-[0.08em] group-hover:text-[#b57906] transition-colors">{item.label}</span>
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

        {/* Footer (Optional Call To Action) */}
        <div className="p-5 border-t border-gray-100 bg-gray-50">
            <a href={directMobileHref} className="block w-full bg-gold-500 text-white font-bold uppercase text-center py-3 rounded-lg shadow-sm hover:bg-gold-600 transition-colors">
                Hemen Ara: 44 44 232
            </a>
        </div>

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

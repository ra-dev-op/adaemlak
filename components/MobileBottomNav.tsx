import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Phone, Menu, LayoutGrid, Award } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenCategories: () => void;
  onOpenMenu: () => void;
}

const CATEGORY_PATHS = ['/arsa', '/bina', '/plaza', '/fabrika', '/depo-antrepo', '/is-yeri', '/luks-konut'];

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenCategories, onOpenMenu }) => {
  const location = useLocation();

  const itemClassName = (isActive: boolean) =>
    `group relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-[16px] px-0.5 py-1.5 transition-all duration-200 ${
      isActive ? 'text-[#b57906]' : 'text-[#727b84]'
    }`;

  const iconWrapClassName = (isActive: boolean) =>
    `relative flex h-10 w-10 items-center justify-center rounded-[14px] border transition-all duration-200 ${
      isActive
        ? 'border-[#f0d28a] bg-[linear-gradient(180deg,#fff6dd_0%,#f5dfaa_100%)] text-[#9c6800] shadow-[0_10px_24px_rgba(217,162,26,0.18)]'
        : 'border-[#edf0f3] bg-[#f7f8fa] text-[#667085] group-hover:border-[#f0d28a] group-hover:bg-[#fff8e8] group-hover:text-[#c69012]'
    }`;

  const labelClassName = (isActive: boolean) =>
    `max-w-full truncate text-[9px] font-semibold leading-none tracking-[0.06em] ${isActive ? 'text-[#9d6b00]' : 'text-[#727b8c]'}`;

  const isHome = location.pathname === '/';
  const isReferences = location.pathname === '/referanslar';
  const isContact = location.pathname === '/iletisim';
  const isPortfolio = location.pathname.startsWith('/kategori') || CATEGORY_PATHS.includes(location.pathname);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[max(env(safe-area-inset-bottom),10px)] lg:hidden">
      <div className="mx-auto max-w-[430px] rounded-[26px] border border-[#ece5d7] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,246,240,0.97)_100%)] px-2.5 pb-2 pt-2 shadow-[0_14px_34px_rgba(15,23,42,0.16)] backdrop-blur-2xl">
        <div className="grid grid-cols-5 items-center gap-1">
          <Link to="/" className={itemClassName(isHome)} aria-label="Ana Sayfa">
            <span className={iconWrapClassName(isHome)}>
              <House className="h-[18px] w-[18px] stroke-[2]" />
            </span>
            <span className={labelClassName(isHome)}>Ana Sayfa</span>
          </Link>

          <Link to="/referanslar" className={itemClassName(isReferences)} aria-label="Referanslarımız">
            <span className={iconWrapClassName(isReferences)}>
              <Award className="h-[18px] w-[18px] stroke-[2]" />
            </span>
            <span className={labelClassName(isReferences)}>Referans</span>
          </Link>

          <button
            type="button"
            onClick={onOpenCategories}
            className="group flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 py-0.5"
            aria-label="Portföy"
          >
            <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-[18px] border border-[#f4d78e] bg-[linear-gradient(180deg,#f3c75a_0%,#d89c13_100%)] text-white shadow-[0_14px_26px_rgba(215,155,17,0.30)] transition-transform duration-200 group-active:scale-95">
              <span className="absolute inset-[5px] rounded-[14px] border border-white/18" />
              <LayoutGrid className="relative h-6 w-6 stroke-[2.1]" />
            </span>
            <span className={`max-w-full truncate text-[9px] font-bold leading-none tracking-[0.08em] ${isPortfolio ? 'text-[#a16e00]' : 'text-[#727b8c]'}`}>Portföy</span>
          </button>

          <Link to="/iletisim" className={itemClassName(isContact)} aria-label="İletişim">
            <span className={iconWrapClassName(isContact)}>
              <Phone className="h-[18px] w-[18px] stroke-[2]" />
            </span>
            <span className={labelClassName(isContact)}>İletişim</span>
          </Link>

          <button type="button" onClick={onOpenMenu} className={itemClassName(false)} aria-label="Menü">
            <span className={iconWrapClassName(false)}>
              <Menu className="h-[18px] w-[18px] stroke-[2]" />
            </span>
            <span className={labelClassName(false)}>Menü</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;

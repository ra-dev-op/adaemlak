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
    `group relative flex flex-1 flex-col items-center justify-center gap-1 rounded-[18px] px-1 py-2 transition-all duration-200 ${
      isActive ? 'text-[#b57906]' : 'text-[#727b84]'
    }`;

  const iconWrapClassName = (isActive: boolean) =>
    `relative flex h-11 w-11 items-center justify-center rounded-[16px] border transition-all duration-200 ${
      isActive
        ? 'border-[#f0d28a] bg-[linear-gradient(180deg,#fff6dd_0%,#f5dfaa_100%)] text-[#9c6800] shadow-[0_10px_24px_rgba(217,162,26,0.18)]'
        : 'border-[#edf0f3] bg-[#f7f8fa] text-[#667085] group-hover:border-[#f0d28a] group-hover:bg-[#fff8e8] group-hover:text-[#c69012]'
    }`;

  const labelClassName = (isActive: boolean) =>
    `text-[10px] font-semibold tracking-[0.08em] ${isActive ? 'text-[#9d6b00]' : 'text-[#727b8c]'}`;

  const isHome = location.pathname === '/';
  const isReferences = location.pathname === '/referanslar';
  const isContact = location.pathname === '/iletisim';
  const isPortfolio = location.pathname.startsWith('/kategori') || CATEGORY_PATHS.includes(location.pathname);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-3 pb-[max(env(safe-area-inset-bottom),14px)] lg:hidden">
      <div className="mx-auto max-w-[1320px] rounded-[30px] border border-[#ece5d7] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,244,237,0.97)_100%)] px-3 pb-2 pt-2.5 shadow-[0_16px_40px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
        <div className="grid grid-cols-5 items-end gap-1.5">
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
            className="group -mt-7 flex flex-col items-center justify-end gap-2 px-1 pb-1"
            aria-label="Portföy"
          >
            <span className="relative flex h-[62px] w-[62px] items-center justify-center rounded-[22px] border border-[#f4d78e] bg-[linear-gradient(180deg,#f3c75a_0%,#d89c13_100%)] text-white shadow-[0_18px_34px_rgba(215,155,17,0.34)] transition-transform duration-200 group-active:scale-95">
              <span className="absolute inset-[5px] rounded-[18px] border border-white/18" />
              <LayoutGrid className="relative h-7 w-7 stroke-[2.1]" />
            </span>
            <span className={`text-[10px] font-bold tracking-[0.1em] ${isPortfolio ? 'text-[#a16e00]' : 'text-[#727b8c]'}`}>Portföy</span>
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

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Award, Building2, House, Menu, Phone } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenCategories: () => void;
  onOpenMenu: () => void;
}

const CATEGORY_PATHS = ['/arsa', '/bina', '/plaza', '/fabrika', '/depo-antrepo', '/is-yeri', '/konut', '/luks-konut'];

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenCategories, onOpenMenu }) => {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isReferences = location.pathname === '/referanslar';
  const isContact = location.pathname === '/iletisim';
  const isPortfolio = location.pathname.startsWith('/kategori') || CATEGORY_PATHS.includes(location.pathname);

  const itemClassName = (isActive: boolean) =>
    `group relative flex min-w-0 flex-col items-center justify-center gap-1.5 py-2 transition-colors duration-200 ${
      isActive ? 'text-[#f3b51b]' : 'text-[#aeb4bd] active:text-white'
    }`;

  const labelClassName = (isActive: boolean) =>
    `max-w-full truncate text-[9px] font-bold leading-none tracking-[0.08em] ${
      isActive ? 'text-[#f3b51b]' : 'text-[#c8ccd2]'
    }`;

  const activeMarker = (isActive: boolean) =>
    isActive ? <span className="absolute -top-[2px] h-[3px] w-8 bg-[#eea904] shadow-[0_2px_8px_rgba(238,169,4,0.65)]" /> : null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[80] px-2 pb-[max(env(safe-area-inset-bottom),8px)] lg:hidden"
      aria-label="Mobil hızlı menü"
    >
      <div className="mx-auto max-w-[440px] border border-white/10 border-t-[#d99b00] bg-[linear-gradient(180deg,#2d3035_0%,#202328_100%)] px-2 shadow-[0_-8px_30px_rgba(15,23,42,0.20),0_14px_35px_rgba(15,23,42,0.32)]">
        <div className="grid h-[70px] grid-cols-5 items-stretch">
          <Link to="/" className={itemClassName(isHome)} aria-label="Ana Sayfa">
            {activeMarker(isHome)}
            <House className="h-[21px] w-[21px] stroke-[1.8]" />
            <span className={labelClassName(isHome)}>Ana Sayfa</span>
          </Link>

          <Link to="/referanslar" className={itemClassName(isReferences)} aria-label="Referanslarımız">
            {activeMarker(isReferences)}
            <Award className="h-[21px] w-[21px] stroke-[1.8]" />
            <span className={labelClassName(isReferences)}>Referans</span>
          </Link>

          <button
            type="button"
            onClick={onOpenCategories}
            className="group relative flex min-w-0 flex-col items-center justify-end gap-1.5 pb-2 text-[#f3b51b]"
            aria-label="Portföy kategorilerini aç"
          >
            <span className="absolute -top-4 flex h-[52px] w-[52px] items-center justify-center rounded-full border-[3px] border-[#292c31] bg-[#eea904] text-white shadow-[0_8px_20px_rgba(238,169,4,0.35)] transition-transform duration-200 group-active:scale-95">
              <Building2 className="h-6 w-6 stroke-[1.9]" />
            </span>
            <span className={`max-w-full truncate text-[9px] font-extrabold leading-none tracking-[0.09em] ${isPortfolio ? 'text-[#f3b51b]' : 'text-white'}`}>
              Portföy
            </span>
          </button>

          <Link to="/iletisim" className={itemClassName(isContact)} aria-label="İletişim">
            {activeMarker(isContact)}
            <Phone className="h-[21px] w-[21px] stroke-[1.8]" />
            <span className={labelClassName(isContact)}>İletişim</span>
          </Link>

          <button type="button" onClick={onOpenMenu} className={itemClassName(false)} aria-label="Menüyü aç">
            <Menu className="h-[22px] w-[22px] stroke-[1.8]" />
            <span className={labelClassName(false)}>Menü</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;

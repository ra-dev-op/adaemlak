import React from 'react';
import { SidebarListing } from '../types';
import SidebarItem from './SidebarItem';

interface DesktopRecentListingsProps {
  items: SidebarListing[];
}

const DesktopRecentListings: React.FC<DesktopRecentListingsProps> = ({ items }) => (
  <section className="hidden lg:block" aria-label="Son eklenen ilanlar">
    <div
      className="flex h-[43px] items-center bg-[#eea904] px-5 text-[21px] font-bold uppercase leading-none text-white"
      style={{ fontFamily: "var(--font-primary)" }}
    >
      SON EKLENENLER
    </div>

    <div
      className="border border-t-0 border-[#e5ded3] px-5 pb-0 pt-5"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}textures/detaybg.webp)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
        backgroundSize: '100% 100%',
      }}
    >
      {items.map((item) => (
        <SidebarItem key={item.id} item={item} largeImage />
      ))}
      <div aria-hidden="true" className="-mx-5 mt-1 h-[40px] bg-[#eea904]" />
    </div>
  </section>
);

export default DesktopRecentListings;

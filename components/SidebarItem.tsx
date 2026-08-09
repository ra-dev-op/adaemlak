import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarListing } from '../types';
import { getListingUrl } from '../lib/seo';
import { trackListingEvent } from '../lib/api';

interface SidebarItemProps {
  item: SidebarListing;
  flushSpacing?: boolean;
  largeImage?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, flushSpacing = false, largeImage = false }) => {
  const hasLargeImage = flushSpacing || largeImage;
  const listingUrl = getListingUrl(item);
  const handleClick = (source: string) => {
    void trackListingEvent(item.id, 'card_click', source).catch((error) => {
      console.error('Sidebar listing click could not be tracked:', error);
    });
  };

  return (
    <div className={`group ${flushSpacing ? 'h-full' : 'mb-5 last:mb-0'}`}>
      <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[#eceff3] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(15,23,42,0.10)]">
        <Link to={listingUrl} className="block relative overflow-hidden" onClick={() => handleClick('sidebar_image')}>
          <div className="relative w-full">
            <img src={item.imageUrl} alt={item.title} className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${hasLargeImage ? 'h-[250px] xl:h-[270px]' : 'h-44'}`} loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
        </Link>
        
        <div className="flex flex-1 flex-col p-4">
           <Link to={listingUrl} onClick={() => handleClick('sidebar_title')}>
             <h4 className={`text-[15px] font-semibold text-[#2f3744] leading-snug mb-4 line-clamp-2 cursor-pointer transition-colors duration-300 group-hover:text-gold-600 ${hasLargeImage ? 'min-h-0' : 'min-h-[2.8em]'}`}>
               {item.title}
             </h4>
           </Link>
           
           <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#eef1f4] pt-4">
              <div className="min-w-0 flex-1 font-price text-[22px] font-bold leading-[1.05] tracking-tight text-[#27303d] sm:text-[25px]">
                 {item.price}
              </div>
              
              <Link to={listingUrl} onClick={() => handleClick('sidebar_incele')} className="shrink-0 inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#667085] transition-all duration-300 hover:border-gold-500/40 hover:bg-gold-50 hover:text-gold-700">
                 İncele
                 <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                 </svg>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarItem;

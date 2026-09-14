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
  const cardImageUrl = `${import.meta.env.BASE_URL}listing-thumbs/${item.id}.webp`;
  const fallbackImageUrl = `${import.meta.env.BASE_URL}listing-thumbs/${item.id}.jpg`;
  const listingUrl = getListingUrl(item);
  const handleClick = (source: string) => {
    void trackListingEvent(item.id, 'card_click', source).catch((error) => {
      console.error('Sidebar listing click could not be tracked:', error);
    });
  };

  return (
    <div
      className={`group border-b border-[#bdb7ad] pb-7 ${flushSpacing ? 'h-full' : 'mb-7 last:mb-0'}`}
      style={{ fontFamily: "var(--font-primary)" }}
    >
      <Link
        to={listingUrl}
        className="block overflow-hidden border border-[#777] bg-white p-[4px]"
        onClick={() => handleClick('sidebar_image')}
      >
        <img
          src={cardImageUrl}
          alt={item.title}
          className={`w-full object-cover transition-opacity duration-300 group-hover:opacity-90 ${hasLargeImage ? 'h-[210px] xl:h-[230px]' : 'h-[160px] xl:h-[175px]'}`}
          width="1600"
          height="800"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            if (event.currentTarget.dataset.fallbackApplied !== 'true') {
              event.currentTarget.dataset.fallbackApplied = 'true';
              event.currentTarget.src = fallbackImageUrl;
            }
          }}
        />
      </Link>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <Link to={listingUrl} onClick={() => handleClick('sidebar_title')}>
          <h3 className="line-clamp-4 cursor-pointer text-[14px] font-bold leading-[1.08] text-[#666]">
            {item.title}
          </h3>
        </Link>

        <div className="min-w-[132px] whitespace-nowrap text-right text-[clamp(16px,1.2vw,19px)] font-bold leading-none tracking-normal text-[#8b8a8f] [word-break:keep-all]">
          {item.price}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={listingUrl}
          onClick={() => handleClick('sidebar_incele')}
          className="inline-flex h-[24px] min-w-[78px] items-center justify-center border border-[#a9a9a9] bg-[#f4f4f4] px-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#555] transition-colors duration-300 hover:border-[#7d7d7d] hover:bg-white hover:text-[#333]"
        >
          İncele
        </Link>
      </div>
    </div>
  );
};

export default SidebarItem;

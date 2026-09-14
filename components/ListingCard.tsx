import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../types';
import { getPriceParts } from '../lib/price';
import { getListingUrl } from '../lib/seo';
import { trackListingEvent } from '../lib/api';

interface ListingCardProps {
  listing: Listing;
  flushSpacing?: boolean;
  priority?: boolean;
  stretchHeight?: boolean;
  compactHeight?: boolean;
  bottomPad?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, flushSpacing = false, priority = false, stretchHeight = false, compactHeight = false, bottomPad = false }) => {
  const cardImageUrl = `${import.meta.env.BASE_URL}listing-thumbs/${listing.id}.jpg`;
  const { amount: displayPriceAmount, currency: displayPriceCurrency } = getPriceParts(listing.price);
  const listingUrl = getListingUrl(listing);
  const normalizedTitle = listing.title.toLocaleLowerCase('tr-TR');
  const normalizedType = listing.type.toLocaleLowerCase('tr-TR');
  const [ilanPrefix, ilanSuffix] = listing.ilanNo.split('-');
  const consultantPhoneHref = 'tel:+905322435522';
  const whatsappHref = `https://wa.me/905322435522?text=${encodeURIComponent(`${listing.ilanNo} numaralı ilan hakkında bilgi almak istiyorum.`)}`;

  const displayCategory = (() => {
    if (normalizedType.includes('satılık tarla') || normalizedTitle.includes('satılık tarla')) return 'SATILIK TARLA';
    if (normalizedType.includes('kiralık tarla') || normalizedTitle.includes('kiralık tarla')) return 'KİRALIK TARLA';
    return listing.category;
  })();

  const handleCardClick = (source: string) => {
    void trackListingEvent(listing.id, 'card_click', source).catch((error) => {
      console.error('Listing card click could not be tracked:', error);
    });
  };

  const renderPrice = (amountClassName: string, currencyClassName: string) => {
    if (!displayPriceAmount) {
      return <span className={amountClassName}>{listing.price}</span>;
    }

    return (
      <>
        <span className={amountClassName}>{displayPriceAmount}</span>
        <span className={currencyClassName}> {displayPriceCurrency}</span>
      </>
    );
  };

  return (
    <div
      className={`group relative w-full overflow-hidden bg-[#ddd] text-[#575757] shadow-[0_10px_24px_rgba(30,30,30,0.06)] transition-colors duration-300 ${flushSpacing ? `mb-0 flex flex-col ${stretchHeight ? 'h-full' : ''}` : 'mb-6 lg:mb-8'}`}
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}textures/boxbg.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 0',
        backgroundSize: '100% 100%',
        fontFamily: "var(--font-primary)",
      }}
    >
      <div className={`flex-1 px-4 pb-5 pt-5 sm:px-5 lg:px-6 lg:pb-0 ${compactHeight ? 'lg:pt-3' : ''} ${bottomPad ? 'lg:pb-8' : ''}`}>
        <Link to={listingUrl} className="block" onClick={() => handleCardClick('listing_card_title')}>
          <h2 className="line-clamp-2 overflow-hidden pb-3 text-[18px] font-bold leading-[22px] text-[#606060] lg:line-clamp-1">
            {listing.title}
          </h2>
        </Link>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,540px)_190px] lg:items-start lg:justify-between lg:gap-0">
          <Link
            to={listingUrl}
            className="grid min-w-0 gap-4 lg:grid-cols-[360px_minmax(0,175px)] lg:gap-5"
            onClick={() => handleCardClick('listing_card_image')}
          >
            <div className={`h-[210px] min-w-0 overflow-hidden border border-[#b5b5b5] bg-white p-[5px] sm:h-[280px] ${compactHeight ? 'lg:h-[196px]' : 'lg:h-[230px]'}`}>
              <img
                src={cardImageUrl}
                alt={listing.title}
                className="h-full w-full object-cover"
                width="1600"
                height="800"
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={priority ? 'high' : 'auto'}
              />
            </div>

            <div className="min-w-0 pt-0.5 text-[#6a6a6a]">
              <p className="line-clamp-4 text-[14px] font-bold leading-[1.08] text-[#606060]">
                {listing.title}
              </p>
              <div className="mt-4 text-[17px] font-extrabold leading-[1.2] text-[#666]">
                {listing.location}
              </div>
            </div>
          </Link>

          <div
            className="grid min-w-0 grid-cols-2 gap-0 border-t border-[#b0b0b0] pt-4 text-center lg:block lg:border-t-0 lg:pt-0"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            <div className="min-w-0 border-b border-[#c8c3bb] pb-4 lg:min-h-[102px]">
              <div className="text-[14px] font-bold uppercase leading-[18px] tracking-[-0.02em] text-[#575757] lg:text-[20px] lg:leading-[0.95] lg:tracking-[-0.03em]">
                <span className="grid w-full grid-cols-[88px_auto] items-baseline gap-x-2.5 lg:hidden">
                  <span className="text-left">İLAN NO:</span>
                  <span className="text-left">{listing.ilanNo}</span>
                </span>
                <span className="hidden lg:inline">
                  İLAN NO: {ilanPrefix}-
                  <br />
                  {ilanSuffix || ''}
                </span>
              </div>
              <div className="mt-3 text-[14px] font-bold leading-[18px] tracking-[-0.02em] text-[#555]">
                <span className="grid w-full grid-cols-[88px_auto] items-baseline gap-x-2.5 lg:hidden">
                  <span className="text-left">Güncelleme:</span>
                  <span className="text-left">{listing.updateDate}</span>
                </span>
                <span className="hidden lg:inline">Güncelleme: {listing.updateDate}</span>
              </div>
            </div>

            <Link
              to={listingUrl}
              className="flex min-w-0 items-center justify-center border-b border-[#c8c3bb] py-4 lg:min-h-[112px]"
              onClick={() => handleCardClick('listing_card_price')}
            >
              <div className="w-full px-0 text-center font-bold leading-none text-[#8b8a8f]">
                {renderPrice('inline whitespace-nowrap text-[clamp(24px,1.75vw,29px)] font-bold leading-[0.92] text-[#8b8a8f] [word-break:keep-all]', 'inline whitespace-nowrap text-[clamp(15px,0.82vw,17px)] font-bold leading-none text-[#8b8a8f]')}
              </div>
            </Link>

            <div className={`col-span-2 flex items-center justify-center gap-5 pt-4 ${compactHeight ? 'min-h-[36px] lg:pt-2' : 'min-h-[54px]'}`}>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  event.stopPropagation();
                  handleCardClick('listing_card_whatsapp');
                }}
                className="group/wa inline-flex h-10 w-10 items-center justify-center text-[#6f756f] transition-all duration-300 hover:-translate-y-0.5 hover:text-[#128c4a]"
                aria-label="WhatsApp ile bilgi al"
              >
                <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.9 11.9 0 0 0 5.78 1.48h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.23-6.17-3.47-8.45ZM12.09 21.82h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.22-3.74.98 1-3.64-.24-.37a9.82 9.82 0 0 1-1.51-5.3c0-5.45 4.43-9.88 9.89-9.88 2.64 0 5.13 1.03 7 2.9a9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.89-9.9 9.89Zm5.42-7.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
                </svg>
              </a>
              <a
                href={consultantPhoneHref}
                onClick={(event) => {
                  event.stopPropagation();
                  handleCardClick('listing_card_phone');
                }}
                className="group/call inline-flex h-10 w-10 items-center justify-center text-[#6f756f] transition-all duration-300 hover:-translate-y-0.5 hover:text-[#c88900]"
                aria-label="Telefon ile ara"
              >
                <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102A1.125 1.125 0 0 0 5.872 2.25H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full">
        <div className="relative h-[58px] w-full">
          <div className="absolute left-0 top-0 h-[22px] w-[86px] bg-[#eea904] [clip-path:polygon(0_0,78%_0,100%_100%,0_100%)]"></div>
          <div
            className="ada-listing-band absolute inset-x-0 bottom-0 flex h-[48px] min-w-0 items-center justify-between rounded-[4px] bg-[#eea904] pl-4 pr-3 text-[#202938] sm:pl-5 sm:pr-4 lg:pl-7 lg:pr-7"
            style={{ color: '#202938' }}
          >
            <div className="min-w-0 truncate pr-2 text-[18px] font-bold uppercase leading-none sm:text-[21px]" style={{ fontFamily: "var(--font-primary)", color: '#202938' }}>
              {displayCategory}
            </div>
            <div className="flex shrink-0 items-center gap-2 text-[12px] font-bold sm:text-[13px] lg:gap-3 lg:text-[16px]" style={{ fontFamily: "var(--font-primary)", color: '#202938' }}>
              <span className="uppercase">ADA EMLAK</span>
              <span className="text-[#202938]/45">|</span>
              <span className="hidden lg:inline">www.adaemlak.com.tr</span>
              <span className="lg:hidden">Web</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;


import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../types';
import { stripHtmlTags } from '../lib/richText';
import { getPriceParts } from '../lib/price';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const consultantPhoneHref = 'tel:+905322435522';
  const thumbUrl = listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls[0] : 'https://via.placeholder.com/400x250';
  const plainDescription = stripHtmlTags(listing.description);
  const { amount: displayPriceAmount, currency: displayPriceCurrency } = getPriceParts(listing.price);
  const normalizedTitle = listing.title.toLocaleLowerCase('tr-TR');
  const normalizedType = listing.type.toLocaleLowerCase('tr-TR');
  const normalizedCategory = listing.category.toLocaleLowerCase('tr-TR');
  const normalizedZoningStatus = listing.details?.zoningStatus?.toLocaleLowerCase('tr-TR') || '';

  const listingBadge = (() => {
    if (normalizedTitle.includes('tarla') || normalizedType.includes('tarla')) return 'Tarla';
    if (normalizedCategory.includes('arsa') || normalizedType.includes('arsa')) {
      return normalizedZoningStatus.includes('imar') || normalizedTitle.includes('imar') ? 'İmarlı' : 'Arsa';
    }
    if (normalizedCategory.includes('bina') || normalizedType.includes('bina')) return 'Müstakil';
    if (normalizedCategory.includes('otel') || normalizedType.includes('otel')) return 'Otel';
    if (normalizedCategory.includes('villa') || normalizedType.includes('villa')) return 'Villa';
    if (normalizedCategory.includes('plaza') || normalizedType.includes('plaza')) return 'Plaza';
    if (normalizedCategory.includes('fabrika') || normalizedType.includes('fabrika')) return 'Fabrika';
    if (normalizedCategory.includes('depo') || normalizedType.includes('depo')) return 'Depo';
    return 'Portföy';
  })();

  const displayCategory = (() => {
    if (normalizedType.includes('satılık tarla') || normalizedTitle.includes('satılık tarla')) return 'SATILIK TARLA';
    if (normalizedType.includes('kiralık tarla') || normalizedTitle.includes('kiralık tarla')) return 'KİRALIK TARLA';
    return listing.category;
  })();

  const renderPrice = (amountClassName: string, currencyClassName: string) => {
    if (!displayPriceAmount) {
      return <span className={amountClassName}>{listing.price}</span>;
    }

    return (
      <>
        <span className={amountClassName}>{displayPriceAmount}</span>
        <span className={currencyClassName}>{displayPriceCurrency}</span>
      </>
    );
  };

  return (
    <div className="bg-white mb-6 lg:mb-8 shadow-card hover:shadow-premium transition-all duration-500 border-t-4 border-transparent hover:border-gold-500/30 relative group rounded-[12px] overflow-hidden w-full">
      <div className="p-4 lg:p-6 lg:pb-2">
        <Link to={`/listing/${listing.id}`} className="mb-4 block">
          <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-serif font-bold leading-tight tracking-tight text-[#253041] transition-colors duration-300 group-hover:text-gold-600 lg:text-[22px]">
            {listing.title}
          </h3>
        </Link>

        <div className="grid gap-4 lg:gap-6 md:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          
          {/* Left: Image (Full width on mobile, Fixed width on Desktop) */}
          <div className="w-full min-w-0">
            <Link to={`/listing/${listing.id}`} className="block">
              <div className="border-[4px] lg:border-[6px] border-[#f8f8f8] shadow-inner relative overflow-hidden rounded-[10px] group-hover:border-white transition-colors duration-500 cursor-pointer aspect-video md:aspect-auto md:h-[200px]">
                 <img src={thumbUrl} alt={listing.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 saturate-[0.95] group-hover:saturate-100 contrast-[1.05]" loading="lazy" decoding="async" />
              </div>
            </Link>
          </div>

          {/* Right: Details / Meta / Price */}
          <div className="min-w-0 pt-1 flex min-h-0 md:min-h-[200px] flex-col justify-between">
             <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-gray-500 text-sm font-sans leading-relaxed font-medium">
                    <p className="line-clamp-3 lg:line-clamp-4 mb-2">{plainDescription}</p>
                    <span className="inline-block px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] lg:text-[11px] font-bold uppercase tracking-wider rounded-sm border border-gray-100">
                       {listingBadge}
                    </span>
                  </div>
                </div>

                <div className="hidden shrink-0 rounded-[10px] border border-dashed border-gray-100 bg-[#fcfcfc] px-4 py-3 text-left lg:block lg:min-w-[155px] lg:text-right">
                  <div className="text-[#666666] font-sans font-bold text-[10px] mb-1 tracking-widest uppercase opacity-80">
                     İLAN NO
                  </div>
                  <div className="text-[#333333] font-price font-semibold text-base md:text-lg leading-none">
                     {listing.ilanNo.split('-')[0]}-{listing.ilanNo.split('-')[1]}
                  </div>
                  <div className="text-gray-400 text-[10px] font-sans font-medium mt-2">
                     {listing.updateDate}
                  </div>
                </div>
             </div>

             <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 rounded-[12px] border border-gray-100 bg-[#fcfcfc] px-4 py-3 md:hidden">
               <div className="min-w-0">
                 <div className="mb-1 text-[#666666] font-sans text-[10px] font-bold uppercase tracking-widest opacity-80">
                   İLAN NO
                 </div>
                 <div className="text-[#333333] font-price text-lg font-semibold leading-none">
                   {listing.ilanNo.split('-')[0]}-{listing.ilanNo.split('-')[1]}
                 </div>
                 <div className="mt-2 text-[10px] font-medium text-gray-400">
                   {listing.updateDate}
                 </div>
               </div>

               <div className="flex flex-col items-end gap-3">
                 <Link to={`/listing/${listing.id}`} className="block">
                    <div className="whitespace-nowrap text-right font-price text-[28px] font-bold leading-none tracking-tight text-[#27303d] drop-shadow-sm">
                     {renderPrice('text-[28px] font-bold leading-none tracking-tight text-[#27303d]', 'ml-1 text-base font-medium text-gray-400')}
                   </div>
                 </Link>

                 <a
                   href={consultantPhoneHref}
                   className="group/btn flex items-center gap-2 rounded-full border border-gold-200 bg-[linear-gradient(135deg,#fff7e2_0%,#fffdf8_55%,#fff1c7_100%)] px-4 py-2 shadow-[0_10px_20px_rgba(232,175,54,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-[0_16px_28px_rgba(232,175,54,0.18)]"
                 >
                   <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.8}
                     stroke="currentColor"
                     className="h-3.5 w-3.5 text-gold-500 transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-6"
                   >
                     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                   </svg>
                   <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-700 transition-all duration-300 group-hover/btn:tracking-[0.24em]">
                     ARA
                   </span>
                 </a>
               </div>
             </div>
             
             <div className="mt-4 hidden gap-4 border-t border-gray-100 pt-4 md:flex md:flex-row md:items-end md:justify-between">
               <div className="flex min-w-0 items-center text-[#444444] font-serif font-semibold text-sm lg:text-lg tracking-tight truncate">
                 <svg className="w-4 h-4 text-gold-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                 </svg>
                 <span className="truncate">{listing.location}</span>
               </div>

               <div className="flex flex-col items-start gap-3 md:items-end">
                  <Link to={`/listing/${listing.id}`} className="block group-hover:translate-x-1 transition-transform duration-300">
                    <div className="font-price cursor-pointer whitespace-nowrap text-2xl font-bold leading-none tracking-tight text-[#27303d] drop-shadow-sm md:text-3xl">
                       {renderPrice('text-2xl font-bold leading-none tracking-tight text-[#27303d] md:text-3xl', 'ml-1 text-sm font-medium text-gray-400 md:text-lg')}
                    </div>
                  </Link>

                  <a 
                    href={consultantPhoneHref} 
                    className="group/btn flex items-center gap-2 rounded-full border border-gold-200 bg-[linear-gradient(135deg,#fff7e2_0%,#fffdf8_55%,#fff1c7_100%)] px-4 py-2 lg:px-5 lg:py-2.5 shadow-[0_10px_20px_rgba(232,175,54,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-[0_16px_28px_rgba(232,175,54,0.18)]"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.8} 
                      stroke="currentColor" 
                      className="w-3.5 h-3.5 text-gold-500 transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <span className="text-[10px] lg:text-xs font-extrabold text-gold-700 transition-all duration-300 uppercase tracking-[0.2em] group-hover/btn:tracking-[0.24em]">
                      ARA
                    </span>
                  </a>
               </div>
             </div>

             <div className="mt-4 border-t border-gray-100 pt-4 md:hidden">
               <div className="flex min-w-0 items-center truncate font-serif text-sm font-semibold tracking-tight text-[#444444]">
                 <svg className="mr-2 h-4 w-4 shrink-0 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                 </svg>
                 <span className="truncate">{listing.location}</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 mt-3 w-full overflow-hidden rounded-b-[12px] drop-shadow-sm">
         <div className="relative h-[44px] w-full md:h-[50px]">
            <div className="absolute left-0 top-0 h-[16px] w-[84px] bg-gold-500 [clip-path:polygon(0_0,78%_0,100%_100%,0_100%)] md:h-[18px] md:w-[96px]"></div>

            <div className="absolute inset-x-0 bottom-0 flex h-[38px] items-center justify-between bg-gold-500 pl-7 pr-4 text-white md:h-[42px] md:pl-8 md:pr-6">
               <div className="font-sans text-[16px] font-extrabold uppercase tracking-[0.03em] md:text-[18px]">
                  {displayCategory}
               </div>
               
               <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.02em] md:gap-3 md:text-[14px]">
                  <span className="font-sans font-bold uppercase tracking-[0.03em]">ADA EMLAK</span>
                  <span className="pb-0.5 text-[12px] font-light opacity-70 md:text-[15px]">|</span>
                  <span className="hidden font-sans tracking-[0.01em] opacity-95 md:inline">www.adaemlak.com.tr</span>
                  <span className="font-sans tracking-[0.01em] opacity-95 md:hidden">Web</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ListingCard;

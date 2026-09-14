
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CompanyCard from './CompanyCard';
import { useData } from '../context/DataContext';
import SeoHead from './SeoHead';
import { EMPTY_LISTING_DETAILS, getPropertyFieldSet, PROPERTY_FIELD_LABELS } from '../config/propertyFields';
import { getRichDescriptionHtml, stripHtmlTags } from '../lib/richText';
import { getPriceParts } from '../lib/price';
import { trackListingEvent, trackListingView } from '../lib/api';
import { getListingIdFromSlug, getListingUrl } from '../lib/seo';
import ListingImage from './ListingImage';

const ImageWatermark: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
    <span
      className={`select-none whitespace-nowrap font-black uppercase tracking-[0.34em] text-white/[0.14] ${
        compact ? 'text-[16px]' : 'text-[34px] md:text-[54px]'
      }`}
      style={{ transform: 'rotate(-28deg)' }}
    >
      ADA EMLAK
    </span>
  </div>
);

const normalizeDetailLabel = (label: string = '') => {
  const normalized = label
    .toLocaleUpperCase('tr-TR')
    .replace(/\s+/g, ' ')
    .trim();

  const exactLabelMap: Record<string, string> = {
    'İL': 'İl',
    'IL': 'İl',
    'İLÇE': 'İlçe',
    'ILCE': 'İlçe',
    'MAHALLE': 'Mahalle',
    'M²': 'M²',
    'M2': 'M²',
    'FİYAT': 'Fiyat',
    'FIYAT': 'Fiyat',
    'TAKAS': 'Takas',
    'İMAR DURUMU': 'İmar Durumu',
    'IMAR DURUMU': 'İmar Durumu',
    'KAKS (EMSAL)': 'Kaks (Emsal)',
    'TAKS': 'Taks',
    'KAT KARŞILIĞI': 'Kat Karşılığı',
    'KAT KARSILIGI': 'Kat Karşılığı',
    'TAPU TİPİ': 'Tapu Tipi',
    'TAPU TIPI': 'Tapu Tipi',
    'İŞYERİ TİPİ': 'İşyeri Tipi',
    'ISYERI TIPI': 'İşyeri Tipi',
    'BİNANIN YAŞI': 'Binanın Yaşı',
    'BINANIN YASI': 'Binanın Yaşı',
    'KAT SAYISI': 'Kat Sayısı',
    'YAPININ DURUMU': 'Yapının Durumu',
    'ISINMA TİPİ': 'Isınma Tipi',
    'ISINMA TIPI': 'Isınma Tipi',
    'MEVCUT HALİ': 'Mevcut Hali',
    'MEVCUT HALI': 'Mevcut Hali',
    'BÖLÜM SAYISI': 'Bölüm Sayısı',
    'BOLUM SAYISI': 'Bölüm Sayısı',
  };

  if (exactLabelMap[normalized]) {
    return exactLabelMap[normalized];
  }

  if (normalized === 'GABARİ' || normalized === 'GABARI') {
    return 'Yükseklik';
  }

  if (
    normalized === 'KREDİYE UYGUNLUK' ||
    normalized === 'KREDIYE UYGUNLUK' ||
    normalized === 'KREDİ UYGUNLUĞU' ||
    normalized === 'KREDI UYGUNLUGU' ||
    normalized === 'KREDİ UYGUNLUK' ||
    normalized === 'KREDI UYGUNLUK'
  ) {
    return 'Kredi Durumu';
  }

  return normalized
    .toLocaleLowerCase('tr-TR')
    .replace(/(^|[\s(/-])([a-zçğıöşü])/g, (_, prefix: string, char: string) => `${prefix}${char.toLocaleUpperCase('tr-TR')}`);
};

const normalizeListingLookupId = (value = '') =>
  String(value)
    .trim()
    .replace(/^ADA-/i, '');

const splitDetailsIntoColumns = <T,>(items: T[]) => {
  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)];
};

const ListingDetail: React.FC = () => {
  const { id } = useParams();
  const { listings, sidebarListings, seoSettings } = useData();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [thumbnailPage, setThumbnailPage] = useState(0);

  const requestedListingId = normalizeListingLookupId(getListingIdFromSlug(id));
  let listing: any = listings.find((item) =>
    normalizeListingLookupId(item.id) === requestedListingId ||
    normalizeListingLookupId(item.ilanNo) === requestedListingId
  );
  if (!listing) {
      const sidebarItem = sidebarListings.find((item) => normalizeListingLookupId(item.id) === requestedListingId);
      if (sidebarItem) {
          listing = {
            id: sidebarItem.id,
            title: sidebarItem.title,
            price: sidebarItem.price,
            imageUrls: [sidebarItem.imageUrl],
            description: sidebarItem.title,
            location: 'İstanbul',
            ilanNo: `ADA-${sidebarItem.id}`,
            updateDate: 'Bugün',
            type: 'Gayrimenkul',
            category: 'GENEL',
            details: {}
          };
      }
  }

  if (!listing) return <div className="container mx-auto py-20 text-center font-serif text-xl">İlan bulunamadı.</div>;

  const galleryImages = listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls : [
    `https://picsum.photos/800/600?random=${listing.id}1`
  ];
  const thumbnailsPerPage = 8;
  const totalThumbnailPages = Math.max(1, Math.ceil(galleryImages.length / thumbnailsPerPage));
  const visibleThumbnails = useMemo(
    () => galleryImages.slice(thumbnailPage * thumbnailsPerPage, (thumbnailPage + 1) * thumbnailsPerPage),
    [galleryImages, thumbnailPage],
  );
  const plainDescription = stripHtmlTags(listing.description);
  const richDescriptionHtml = getRichDescriptionHtml(listing.description);
  const { schemaCurrency } = getPriceParts(listing.price);
  const listingCanonicalUrl = `${seoSettings.baseUrl.replace(/\/$/, '')}${getListingUrl(listing)}`;
  const listingSocialImage = `${import.meta.env.BASE_URL}listing-thumbs/${encodeURIComponent(listing.id)}.jpg`;

  // Helper for Schema
  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "Product", // or Residence/SingleFamilyResidence based on category
    "name": listing.title,
    "image": [`${seoSettings.baseUrl.replace(/\/$/, '')}${listingSocialImage}`],
    "description": plainDescription,
    "sku": listing.ilanNo,
    "offers": {
      "@type": "Offer",
      "url": listingCanonicalUrl,
      "priceCurrency": schemaCurrency,
      "price": listing.price.replace(/[^0-9]/g, ''),
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition" // or UsedCondition
    }
  };

  const details = {
    ...EMPTY_LISTING_DETAILS,
    ...(listing.details || {}),
  };

  const basePropertyDetails = getPropertyFieldSet(listing.category, listing.type)
    .map((field) => ({
      key: field.key,
      label: field.label,
      value: details[field.key] || '',
    }))
    .filter((detail) => {
      const value = String(detail.value).trim();
      return value !== '' && value !== '-' && value !== '0';
    });

  const mappedKeys = new Set<string>(basePropertyDetails.map((detail) => String(detail.key)));
  const extraPropertyDetails = (Object.entries(details) as [keyof typeof details, string][])
    .filter(([key, value]) => {
      const normalized = String(value || '').trim();
      return !mappedKeys.has(String(key)) && normalized !== '' && normalized !== '-' && normalized !== '0' && PROPERTY_FIELD_LABELS[key];
    })
    .map(([key, value]) => ({
      key,
      label: PROPERTY_FIELD_LABELS[key] as string,
      value,
    }));

  const propertyDetails: Array<{ label: string; value: string }> = listing.detailRows && listing.detailRows.length > 0
    ? listing.detailRows
        .filter((detail: { label: string; value: string }) => {
          const value = String(detail.value || '').trim();
          return value !== '' && value !== '-' && value !== '0';
        })
        .map((detail: { label: string; value: string }) => ({
          key: detail.label,
          label: normalizeDetailLabel(detail.label),
          value: detail.value,
        }))
    : [...basePropertyDetails, ...extraPropertyDetails];
  const [leftPropertyDetails, rightPropertyDetails] = splitDetailsIntoColumns(propertyDetails);

  const consultantPhone = '+90 532 243 55 22';
  const consultantPhoneHref = 'tel:+905322435522';
  const consultantWhatsappHref = `https://wa.me/905322435522?text=${encodeURIComponent(`${listing.ilanNo} numaralı ilan hakkında bilgi almak istiyorum.`)}`;

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false);
      }
      if (event.key === 'ArrowRight') {
        handleImageChange(activeImageIndex + 1);
      }
      if (event.key === 'ArrowLeft') {
        handleImageChange(activeImageIndex - 1);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeImageIndex, isLightboxOpen, galleryImages.length]);

  useEffect(() => {
    setThumbnailPage(Math.floor(activeImageIndex / thumbnailsPerPage));
  }, [activeImageIndex]);

  useEffect(() => {
    if (!listing?.id) {
      return;
    }

    void trackListingView(listing.id).catch((error) => {
      console.error('Listing view could not be tracked:', error);
    });
  }, [listing?.id]);

  const handleImageChange = (nextIndex: number) => {
    const boundedIndex = (nextIndex + galleryImages.length) % galleryImages.length;
    setActiveImageIndex(boundedIndex);
  };

  const handlePhoneClick = (source: string) => {
    void trackListingEvent(listing.id, 'phone_click', source).catch((error) => {
      console.error('Listing phone click could not be tracked:', error);
    });
  };

  const handleGalleryOpen = (source: string) => {
    void trackListingEvent(listing.id, 'gallery_open', source).catch((error) => {
      console.error('Listing gallery open could not be tracked:', error);
    });
    setIsLightboxOpen(true);
  };

  return (
    <>
    <div className="container mx-auto max-w-[1320px] px-4 py-8">
       <SeoHead 
         title={listing.title} 
         description={plainDescription.substring(0, 150)}
         keywords={`${listing.type}, ${listing.location}, ${listing.category}, ${listing.ilanNo}`}
         image={listingSocialImage}
         type="product"
         canonicalUrl={listingCanonicalUrl}
         schema={listingSchema}
       />

       {/* Breadcrumb */}
       <div className="mb-6 flex items-center overflow-x-auto whitespace-nowrap font-sans text-[14px] font-medium uppercase leading-5 tracking-[0.06em] text-gray-500">
          <Link to="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-500">
            <svg className="h-4 w-4 text-[#eea904] lg:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span>Ana Sayfa</span>
          </Link> 
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-600 font-bold">{listing.category}</span>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gold-500 font-semibold">{listing.ilanNo}</span>
       </div>

       <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-[66%]">
             <div
               className="mb-8 overflow-hidden text-[#666]"
               style={{
                 backgroundImage: `url(${import.meta.env.BASE_URL}textures/detaybg.webp)`,
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: 'center center',
                 backgroundSize: '100% 100%',
                 fontFamily: "var(--font-primary)",
               }}
             >
                <div className="flex min-h-[50px] min-w-0 flex-col bg-[#eea904] px-4 py-3 text-white sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                   <div className="flex min-w-0 flex-col gap-2 text-[18px] font-bold leading-tight sm:text-[20px] lg:flex-row lg:items-center lg:gap-5 lg:text-[21px]">
                      <span>{listing.type || listing.category}</span>
                      <span className="min-w-0">{listing.location}</span>
                   </div>
                   <div className="mt-2 shrink-0 whitespace-nowrap text-[clamp(20px,2.2vw,25px)] font-bold leading-none sm:text-[24px] lg:mt-0 [word-break:keep-all]">
                      {listing.price}
                   </div>
                </div>

                <div className="px-5 pb-4 pt-6 md:px-6">
                  <h1 className="mb-5 text-[20px] font-bold leading-tight text-[#6a6a6a] md:text-[21px]">
                    {listing.title}
                  </h1>

                  <div
                    className="relative h-[260px] cursor-zoom-in overflow-hidden border border-[#666] bg-[#e9e9e9] p-[5px] md:h-[335px]"
                    onClick={() => handleGalleryOpen('detail_main_image')}
                  >
                    <ListingImage
                      listing={listing}
                      source={galleryImages[activeImageIndex]}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                    <ImageWatermark />
                  </div>

                  <div className="mt-3 flex items-center gap-2 bg-[#efefef] px-2 py-2">
                    <button
                      type="button"
                      onClick={() => setThumbnailPage((prev) => Math.max(prev - 1, 0))}
                      disabled={thumbnailPage === 0}
                      className="flex h-[54px] w-5 items-center justify-center text-[#b8b8b8] transition-colors hover:text-[#555] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Önceki küçük görseller"
                    >
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    <div className="grid min-w-0 flex-1 grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                      {visibleThumbnails.map((img: string, idx: number) => {
                        const actualIndex = thumbnailPage * thumbnailsPerPage + idx;
                        const isActive = actualIndex === activeImageIndex;

                        return (
                          <button
                            key={`${img}-${actualIndex}`}
                            type="button"
                            onClick={() => setActiveImageIndex(actualIndex)}
                            className={`h-[54px] overflow-hidden border bg-white p-[4px] transition-colors ${
                              isActive ? 'border-[#666]' : 'border-[#d1d1d1] hover:border-[#8b8b8b]'
                            }`}
                          >
                            <ListingImage listing={listing} source={img} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setThumbnailPage((prev) => Math.min(prev + 1, totalThumbnailPages - 1))}
                      disabled={thumbnailPage === totalThumbnailPages - 1}
                      className="flex h-[54px] w-5 items-center justify-center text-[#444] transition-colors hover:text-[#000] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Sonraki küçük görseller"
                    >
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>
             </div>
             
             {/* Header */}
             <div className="hidden">
                <h1 className="text-[#2c2c2c] font-serif font-bold text-2xl md:text-3xl leading-tight mb-2">{listing.title}</h1>
                <div className="flex items-center text-gray-500 text-sm font-medium mt-2">
                   <svg className="mr-2 h-4 w-4 shrink-0 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-4.35 6-10a6 6 0 10-12 0c0 5.65 6 10 6 10z" />
                      <circle cx="12" cy="11" r="2.25" />
                   </svg>
                   {listing.location}
                   <span className="mx-3 text-gray-300">|</span>
                   <span className="text-gray-400">İlan No: {listing.ilanNo}</span>
                </div>
             </div>

             <div className="hidden">
                <div className="flex flex-col gap-4 px-5 py-4 text-white md:flex-row md:items-center md:justify-between md:px-6">
                   <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                      <span className="inline-flex w-fit items-center rounded-full bg-white/14 px-4 py-1.5 text-base font-bold uppercase tracking-[0.045em] backdrop-blur-sm md:text-[17px]">
                         {listing.type || listing.category}
                      </span>
                      <span className="hidden h-5 w-px bg-white/30 md:block"></span>
                      <div className="flex items-center gap-2 text-base font-semibold tracking-tight text-white/95 md:text-[17px]">
                         <svg className="h-4 w-4 shrink-0 text-white/85" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-4.35 6-10a6 6 0 10-12 0c0 5.65 6 10 6 10z" />
                            <circle cx="12" cy="11" r="2.25" />
                         </svg>
                         <span>{listing.location}</span>
                      </div>
                   </div>

                   <div className="text-left md:min-w-[360px] md:text-right">
                      <div className="flex flex-wrap items-end gap-3 md:justify-end">
                         <div className="flex flex-col items-start md:items-end">
                            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#3f3321]/70">Satış Fiyatı</div>
                            <div className="mt-1 whitespace-nowrap font-price text-[clamp(26px,3vw,38px)] font-bold leading-none tracking-normal text-[#2a241c] [word-break:keep-all]">
                               {listing.price}
                            </div>
                         </div>
                         <a
                            href={consultantPhoneHref}
                            onClick={() => handlePhoneClick('detail_price_bar')}
                            className="group/btn inline-flex shrink-0 items-center gap-2 rounded-full border border-white/30 bg-white/12 px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8f5c03] hover:bg-[#8f5c03] hover:text-white hover:shadow-[0_16px_28px_rgba(125,79,5,0.22)]"
                          >
                           <svg
                             xmlns="http://www.w3.org/2000/svg"
                             fill="none"
                             viewBox="0 0 24 24"
                             strokeWidth={1.9}
                             stroke="currentColor"
                             className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-6"
                           >
                             <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                           </svg>
                           ARA
                         </a>
                      </div>
                   </div>
                </div>
             </div>

             {/* Gallery */}
             <div className="hidden">
                <div
                  className="relative aspect-[16/10] overflow-hidden border-b border-[#dfe4ea] bg-[#eef2f6] cursor-zoom-in group"
                  onClick={() => handleGalleryOpen('detail_main_image')}
                >
                   <ListingImage
                     listing={listing}
                     source={galleryImages[activeImageIndex]}
                     alt={listing.title}
                     className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                     decoding="async"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-transparent"></div>
                   <ImageWatermark />
                   <div className="absolute left-4 top-4 rounded-md bg-white/72 px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#667282] backdrop-blur-sm">
                     {listing.ilanNo}
                   </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#e5e7eb] bg-[linear-gradient(180deg,#f9fafb_0%,#f2f4f7_100%)] px-4 py-3 text-[13px] font-semibold text-[#6a7584]">
                   <button
                     type="button"
                     onClick={() => handleGalleryOpen('detail_large_photo_button')}
                     className="inline-flex items-center gap-2 text-[#23408f] transition-colors hover:text-[#1d3271]"
                   >
                     <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                     Büyük Fotoğraf
                   </button>
                </div>

                <div className="grid grid-cols-4 gap-[2px] bg-[#dfe4ea] p-[2px]">
                   {visibleThumbnails.map((img: string, idx: number) => {
                     const actualIndex = thumbnailPage * thumbnailsPerPage + idx;
                     const isActive = actualIndex === activeImageIndex;

                     return (
                       <button
                         key={`${img}-${actualIndex}`}
                         type="button"
                         onClick={() => setActiveImageIndex(actualIndex)}
                         className={`relative aspect-[4/3] overflow-hidden bg-white transition-all ${
                           isActive ? 'ring-2 ring-[#2a4ca0] ring-inset' : 'hover:opacity-90'
                         }`}
                       >
                         <ListingImage listing={listing} source={img} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                         <ImageWatermark compact />
                       </button>
                     );
                   })}
                </div>

                <div className="flex items-center justify-between gap-4 bg-white px-4 py-3">
                   <div className="text-[14px] font-medium text-[#4c5564]">
                     {activeImageIndex + 1}/{galleryImages.length} Fotoğraf
                   </div>

                   <div className="flex items-center gap-3">
                     <button
                       type="button"
                       onClick={() => setThumbnailPage((prev) => Math.max(prev - 1, 0))}
                       disabled={thumbnailPage === 0}
                       className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#d4dae2] bg-[#f4f6f8] text-[#93a0b1] transition-colors hover:border-[#b8c2cf] hover:text-[#5b697c] disabled:cursor-not-allowed disabled:opacity-50"
                     >
                       <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                       </svg>
                     </button>

                     <div className="flex items-center gap-2">
                       {Array.from({ length: totalThumbnailPages }).map((_, index) => (
                         <button
                           key={index}
                           type="button"
                           onClick={() => setThumbnailPage(index)}
                           className={`h-2.5 w-2.5 rounded-full transition-all ${
                             index === thumbnailPage ? 'bg-[#6f89b4]' : 'bg-[#d0d6df] hover:bg-[#b7c0cd]'
                           }`}
                           aria-label={`Galeri sayfası ${index + 1}`}
                         />
                       ))}
                     </div>

                     <button
                       type="button"
                       onClick={() => setThumbnailPage((prev) => Math.min(prev + 1, totalThumbnailPages - 1))}
                       disabled={thumbnailPage === totalThumbnailPages - 1}
                       className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#d4dae2] bg-[#f4f6f8] text-[#93a0b1] transition-colors hover:border-[#b8c2cf] hover:text-[#5b697c] disabled:cursor-not-allowed disabled:opacity-50"
                     >
                       <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                       </svg>
                     </button>
                   </div>
                </div>
             </div>

             <div className="mb-8 min-w-0 overflow-hidden rounded-[18px] border border-[#ece6d6] bg-[linear-gradient(135deg,#fffdf8_0%,#f8f4ea_100%)] shadow-[0_16px_32px_rgba(15,23,42,0.06)]">
                <div className="flex min-w-0 flex-col gap-4 px-4 py-5 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">
                   <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d9a21a_0%,#f0bc3c_100%)] text-lg font-bold tracking-[0.08em] text-white shadow-[0_10px_20px_rgba(217,162,26,0.28)]">
                         YK
                      </div>
                      <div className="min-w-0">
                         <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a08c62]">Tek Yetkili</div>
                         <div className="mt-1 text-[23px] font-semibold tracking-tight text-[#2b2f36] sm:text-[26px]">Yakup Kasa</div>
                         <div className="mt-1 break-words text-[14px] font-medium text-[#7b8088]">İlan hakkında doğrudan bilgi ve hızlı geri dönüş</div>
                      </div>
                   </div>

                   <div className="grid min-w-0 w-full gap-3 lg:max-w-[330px] lg:justify-items-end xl:max-w-none xl:grid-cols-2">
                      <a
                        href={consultantPhoneHref}
                        onClick={() => handlePhoneClick('detail_consultant_card')}
                        className="group flex w-full min-w-0 items-center gap-3 rounded-full border border-[#e7d7ab] bg-white px-4 py-3 text-left shadow-[0_10px_22px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/60 hover:shadow-[0_16px_28px_rgba(217,162,26,0.14)] xl:min-w-[250px]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-white">
                           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                           </svg>
                        </span>
                        <span>
                           <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#a08c62]">Telefon</span>
                           <span className="mt-0.5 block text-[17px] font-semibold tracking-tight text-[#27303d]">{consultantPhone}</span>
                        </span>
                      </a>

                      <a
                        href={consultantWhatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handlePhoneClick('detail_consultant_whatsapp')}
                        className="group flex w-full min-w-0 items-center gap-3 rounded-full border border-[#e7d7ab] bg-white px-4 py-3 text-left shadow-[0_10px_22px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/60 hover:shadow-[0_16px_28px_rgba(217,162,26,0.14)] xl:min-w-[250px]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-white">
                           <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.26-1.38a9.9 9.9 0 0 0 4.73 1.2h.01c5.46 0 9.91-4.45 9.91-9.91a9.84 9.84 0 0 0-2.91-7Zm-7 15.23h-.01a8.22 8.22 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.25-4.37c0-4.54 3.7-8.23 8.24-8.23a8.18 8.18 0 0 1 5.82 2.41 8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23Zm4.51-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
                           </svg>
                        </span>
                        <span className="min-w-0 flex-1">
                           <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#a08c62]">WhatsApp</span>
                           <span className="mt-0.5 block whitespace-nowrap text-[17px] font-semibold leading-snug tracking-tight text-[#27303d] [word-break:keep-all]">{consultantPhone}</span>
                        </span>
                      </a>
                   </div>
                </div>
             </div>

             {/* Legacy Details + Description */}
             <div
               className="mb-10 overflow-hidden text-[#333]"
               style={{
                 backgroundImage: `url(${import.meta.env.BASE_URL}textures/detaybg.webp)`,
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: 'center center',
                 backgroundSize: '100% 100%',
                 fontFamily: "var(--font-primary)",
               }}
             >
                {propertyDetails.length > 0 ? (
                  <div className="grid min-w-0 grid-cols-1 gap-x-12 border-b-[5px] border-white px-4 py-5 text-[13px] font-medium leading-[1.42] text-[#2f2f2f] sm:px-5 sm:text-[14px] lg:grid-cols-2 lg:px-6">
                    {[leftPropertyDetails, rightPropertyDetails].map((column, columnIndex) => (
                      <div key={columnIndex} className="space-y-[3px]">
                        {column.map((detail, index) => (
                          <div
                            key={`${detail.label}-${index}`}
                            className="grid grid-cols-[118px_10px_minmax(0,1fr)] items-start gap-0 sm:grid-cols-[165px_12px_minmax(0,1fr)] md:grid-cols-[130px_12px_minmax(0,1fr)] xl:grid-cols-[165px_12px_minmax(0,1fr)]"
                          >
                            <span className="font-semibold uppercase text-[#343434]">{detail.label}</span>
                            <span className="font-medium text-[#444]">:</span>
                            <span className="min-w-0 break-words font-bold text-[#242424]">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="min-w-0 px-4 py-5 text-[18px] font-semibold leading-[1.18] text-[#333] sm:px-5 sm:text-[20px] lg:px-6 lg:leading-[1.08]">
                    <div
                      className="min-w-0 max-w-full [overflow-wrap:anywhere] [&_*]:max-w-full [&_a]:break-all [&_a]:font-semibold [&_a]:text-[#333] [&_a]:underline [&_br]:block [&_h1]:mb-4 [&_h1]:text-[20px] [&_h1]:font-bold [&_h1]:leading-[1.15] [&_h2]:mb-4 [&_h2]:text-[20px] [&_h2]:font-bold [&_h2]:leading-[1.15] [&_h3]:mb-4 [&_h3]:text-[19px] [&_h3]:font-bold [&_h3]:leading-[1.15] [&_h4]:mb-4 [&_h4]:text-[18px] [&_h4]:font-bold [&_h4]:leading-[1.15] [&_li]:ml-5 [&_li]:list-disc [&_li]:font-semibold [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_p]:font-semibold [&_p]:leading-[1.18] [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:font-semibold [&_span[style*='red']]:font-extrabold [&_span[style*='red']]:text-red-600 [&_strong]:font-extrabold sm:[&_h1]:text-[22px] sm:[&_h2]:text-[22px] sm:[&_h3]:text-[21px] sm:[&_h4]:text-[20px] lg:[&_h1]:leading-[1.08] lg:[&_h2]:leading-[1.08] lg:[&_h3]:leading-[1.08] lg:[&_h4]:leading-[1.08] lg:[&_p]:leading-[1.08]"
                      dangerouslySetInnerHTML={{ __html: richDescriptionHtml }}
                    />
                </div>
             </div>

             {/* Map */}
             <div className="mb-10">
                <h3 className="text-lg font-serif font-bold text-[#333] mb-4 border-b border-gray-100 pb-2">Konum</h3>
                <div className="w-full h-[350px] bg-gray-200 rounded-sm overflow-hidden shadow-card border border-gray-200 relative">
                   {listing.mapUrl ? (
                       <iframe src={listing.mapUrl} width="100%" height="100%" style={{border: 0}} allowFullScreen loading="lazy" title="Map"></iframe>
                   ) : (
                       <div className="flex items-center justify-center h-full text-gray-400">Harita bilgisi yok.</div>
                   )}
                </div>
             </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full lg:w-[34%]">
             <div className="sticky top-24 space-y-6">
                <CompanyCard />
             </div>
          </div>
       </div>
    </div>

    {isLightboxOpen && (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#151515]/88 p-2 backdrop-brightness-[0.42] md:p-4" onClick={() => setIsLightboxOpen(false)}>
        <button
          type="button"
          onClick={() => setIsLightboxOpen(false)}
          className="absolute right-5 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-black/80"
          aria-label="Kapat"
        >
          <span>Kapat</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleImageChange(activeImageIndex - 1);
              }}
              className="absolute left-3 top-1/2 z-10 inline-flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/65"
              aria-label="Önceki resim"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleImageChange(activeImageIndex + 1);
              }}
              className="absolute right-3 top-1/2 z-10 inline-flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/65"
              aria-label="Sonraki resim"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        <div className="relative max-h-[96vh] w-[calc(100vw-16px)] max-w-[1760px] overflow-hidden border border-white/10 bg-black/35 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:w-[calc(100vw-32px)]" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-white/10 bg-black/70 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/80">
            <span>{listing.ilanNo}</span>
            <span>{activeImageIndex + 1}/{galleryImages.length}</span>
          </div>
          <ListingImage
            listing={listing}
            source={galleryImages[activeImageIndex]}
            alt={listing.title}
            className="h-[calc(94vh-44px)] w-full cursor-pointer bg-[#111] object-contain md:h-[calc(96vh-44px)]"
            decoding="async"
            onClick={() => {
              if (galleryImages.length > 1) {
                handleImageChange(activeImageIndex + 1);
              }
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[44px] bg-gradient-to-t from-black/14 via-transparent to-black/8"></div>
          <ImageWatermark />
          <div className="absolute bottom-5 left-5 rounded-sm bg-black/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
            {activeImageIndex + 1} / {galleryImages.length}
          </div>
          {galleryImages.length > 1 && (
            <div className="absolute bottom-5 right-5 rounded-sm bg-black/45 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm">
              Görsele tıkla: sonraki fotoğraf
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
};

export default ListingDetail;

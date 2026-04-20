
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { useData } from '../context/DataContext';
import SeoHead from './SeoHead';
import { EMPTY_LISTING_DETAILS, getPropertyFieldSet, PROPERTY_FIELD_LABELS } from '../config/propertyFields';
import { getRichDescriptionHtml, stripHtmlTags } from '../lib/richText';
import { getPriceParts } from '../lib/price';
import { trackListingView } from '../lib/api';

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

const ListingDetail: React.FC = () => {
  const { id } = useParams();
  const { listings, sidebarListings } = useData();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [thumbnailPage, setThumbnailPage] = useState(0);

  let listing: any = listings.find(l => l.id === id);
  if (!listing) {
      const sidebarItem = sidebarListings.find(l => l.id === id);
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

  // Helper for Schema
  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "Product", // or Residence/SingleFamilyResidence based on category
    "name": listing.title,
    "image": galleryImages,
    "description": plainDescription,
    "sku": listing.ilanNo,
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
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

  const mappedKeys = new Set(basePropertyDetails.map((detail) => detail.key));
  const extraPropertyDetails = (Object.entries(details) as [keyof typeof details, string][])
    .filter(([key, value]) => {
      const normalized = String(value || '').trim();
      return !mappedKeys.has(key) && normalized !== '' && normalized !== '-' && normalized !== '0' && PROPERTY_FIELD_LABELS[key];
    })
    .map(([key, value]) => ({
      key,
      label: PROPERTY_FIELD_LABELS[key] as string,
      value,
    }));

  const propertyDetails = listing.detailRows && listing.detailRows.length > 0
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

  const consultantPhone = '+90 532 243 55 22';
  const consultantPhoneHref = 'tel:+905322435522';
  const consultantEmail = 'ykasa@adaemlak.com.tr';

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

  return (
    <>
    <div className="container mx-auto max-w-[1320px] px-4 py-8">
       <SeoHead 
         title={listing.title} 
         description={plainDescription.substring(0, 150)}
         keywords={`${listing.type}, ${listing.location}, ${listing.category}, ${listing.ilanNo}`}
         image={galleryImages[0]}
         type="product"
         canonicalUrl={`${window.location.origin}/listing/${listing.id}`}
         schema={listingSchema}
       />

       {/* Breadcrumb */}
       <div className="flex items-center text-xs text-gray-500 mb-6 font-sans uppercase tracking-wider overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-gold-500 transition-colors">Ana Sayfa</Link> 
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-600 font-bold">{listing.category}</span>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gold-500 font-semibold">{listing.ilanNo}</span>
       </div>

       <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-[66%]">
             
             {/* Header */}
             <div className="mb-6">
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

             <div className="mb-6 overflow-hidden rounded-[16px] border border-[#ebcf8d] bg-[linear-gradient(135deg,#d99e11_0%,#efb126_46%,#d5960d_100%)] shadow-[0_16px_34px_rgba(205,150,16,0.18)]">
                <div className="flex flex-col gap-4 px-5 py-4 text-white md:flex-row md:items-center md:justify-between md:px-6">
                   <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                      <span className="inline-flex w-fit items-center rounded-full bg-white/14 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.05em] backdrop-blur-sm">
                         {listing.type || listing.category}
                      </span>
                      <span className="hidden h-5 w-px bg-white/30 md:block"></span>
                      <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-white/95">
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
                            <div className="mt-1 font-price text-[30px] font-bold leading-none tracking-tight text-[#2a241c] md:text-[38px]">
                               {listing.price}
                            </div>
                         </div>
                         <a
                            href={consultantPhoneHref}
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
             <div className="mb-8 overflow-hidden rounded-[8px] border border-[#d9dde3] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
                <div
                  className="relative aspect-[16/10] overflow-hidden border-b border-[#dfe4ea] bg-[#eef2f6] cursor-zoom-in group"
                  onClick={() => setIsLightboxOpen(true)}
                >
                   <img
                     src={galleryImages[activeImageIndex]}
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
                     onClick={() => setIsLightboxOpen(true)}
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
                         <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
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

             <div className="mb-8 overflow-hidden rounded-[18px] border border-[#ece6d6] bg-[linear-gradient(135deg,#fffdf8_0%,#f8f4ea_100%)] shadow-[0_16px_32px_rgba(15,23,42,0.06)]">
                <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                   <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d9a21a_0%,#f0bc3c_100%)] text-lg font-bold tracking-[0.08em] text-white shadow-[0_10px_20px_rgba(217,162,26,0.28)]">
                         YK
                      </div>
                      <div>
                         <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a08c62]">Tek Yetkili</div>
                         <div className="mt-1 text-[26px] font-semibold tracking-tight text-[#2b2f36]">Yakup Kasa</div>
                         <div className="mt-1 text-[14px] font-medium text-[#7b8088]">İlan hakkında doğrudan bilgi ve hızlı geri dönüş</div>
                      </div>
                   </div>

                   <div className="grid w-full gap-3 md:max-w-[330px] md:justify-items-end xl:max-w-none xl:grid-cols-2">
                      <a
                        href={consultantPhoneHref}
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
                        href={`mailto:${consultantEmail}`}
                        className="group flex w-full min-w-0 items-center gap-3 rounded-full border border-[#e7d7ab] bg-white px-4 py-3 text-left shadow-[0_10px_22px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/60 hover:shadow-[0_16px_28px_rgba(217,162,26,0.14)] xl:min-w-[250px]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-white">
                           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5v9a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 16.5v-9m19.5 0A2.25 2.25 0 0019.5 5.25h-15A2.25 2.25 0 002.25 7.5m19.5 0v.243a2.25 2.25 0 01-.99 1.87l-7.5 5a2.25 2.25 0 01-2.52 0l-7.5-5a2.25 2.25 0 01-.99-1.87V7.5" />
                           </svg>
                        </span>
                        <span className="min-w-0">
                           <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#a08c62]">E-Posta</span>
                           <span className="mt-0.5 block truncate text-[15px] font-semibold tracking-tight text-[#27303d]">{consultantEmail}</span>
                        </span>
                      </a>
                   </div>
                </div>
             </div>

             {/* Details Table */}
             <div className="mb-10">
                <h3 className="mb-4 border-b border-gray-100 pb-2 text-xl font-bold tracking-tight text-[#2f2f2f]">Özellikler</h3>
                {propertyDetails.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-8 gap-y-0 bg-white p-6 rounded-sm shadow-card border border-gray-100 md:grid-cols-2">
                    {propertyDetails.map((detail, index) => (
                      <div
                        key={index}
                        className="border-b border-[#f0f1f3] px-2 py-4 transition-colors hover:bg-gray-50/60"
                      >
                         <div className="grid grid-cols-[118px_auto_minmax(0,1fr)] items-center gap-x-2 sm:grid-cols-[148px_auto_minmax(0,1fr)]">
                           <span className="text-[15px] font-medium tracking-tight text-[#6b7280]">{detail.label}</span>
                           <span className="text-[15px] font-medium text-[#9aa1ab]">:</span>
                           <span className="min-w-0 text-[17px] font-semibold tracking-tight text-[#1f2937]">
                             {detail.value}
                           </span>
                         </div>
                      </div>
                    ))}
                </div>
                ) : (
                <div className="rounded-sm border border-gray-100 bg-white p-6 text-sm text-gray-500 shadow-card">
                    Bu ilan için detay bilgisi girilmemiş.
                </div>
                )}
             </div>

             {/* Description */}
             <div className="mb-10">
                <h3 className="text-lg font-serif font-bold text-[#333] mb-4 border-b border-gray-100 pb-2">Açıklama</h3>
                <div className="bg-white p-6 rounded-sm shadow-card border border-gray-100">
                    <div
                      className="text-gray-600 font-sans leading-relaxed text-[15px] [&_a]:font-medium [&_a]:text-[#23408f] [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gold-400 [&_blockquote]:bg-[#fffaf0] [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-[16px] [&_blockquote]:font-medium [&_blockquote]:text-[#5b4a27] [&_code]:rounded [&_code]:bg-[#f3f4f6] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[14px] [&_code]:text-[#1f2937] [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-[30px] [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-[#243041] [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-[28px] [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-[#243041] [&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-[25px] [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:text-[#243041] [&_h4]:mb-2 [&_h4]:mt-4 [&_h4]:text-[20px] [&_h4]:font-semibold [&_h4]:leading-snug [&_h4]:text-[#374355] [&_li]:ml-5 [&_li]:list-disc [&_mark]:rounded-[2px] [&_mark]:px-1 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[#1f2937] [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[14px] [&_pre]:text-white [&_s]:line-through [&_strong]:font-semibold"
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
                <div className="rounded-[18px] border border-[#eceef2] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-4 shadow-[0_16px_34px_rgba(15,23,42,0.06)]">
                   {sidebarListings.slice(0, 3).map((item) => (
                      <SidebarItem key={item.id} item={item} />
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>

    {isLightboxOpen && (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#191a1c]/94 p-4 backdrop-brightness-[0.34]" onClick={() => setIsLightboxOpen(false)}>
        <button
          type="button"
          onClick={() => setIsLightboxOpen(false)}
          className="absolute right-5 top-4 inline-flex items-center gap-2 rounded-sm bg-black/55 px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-black/75"
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
              className="absolute left-3 top-1/2 inline-flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-sm bg-black/38 text-white transition-colors hover:bg-black/58"
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
              className="absolute right-3 top-1/2 inline-flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-sm bg-black/38 text-white transition-colors hover:bg-black/58"
              aria-label="Sonraki resim"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        <div className="relative max-h-[90vh] w-full max-w-[1180px] overflow-hidden border border-white/10 bg-black/35 shadow-[0_30px_80px_rgba(0,0,0,0.45)]" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-white/10 bg-black/70 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/80">
            <span>{listing.ilanNo}</span>
            <span>{activeImageIndex + 1}/{galleryImages.length}</span>
          </div>
          <img
            src={galleryImages[activeImageIndex]}
            alt={listing.title}
            className="max-h-[calc(90vh-44px)] w-full cursor-pointer object-contain bg-[#111]"
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

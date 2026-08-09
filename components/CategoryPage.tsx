import React, { useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import FilterBar from './FilterBar';
import ListingCard from './ListingCard';
import SidebarItem from './SidebarItem';
import { useData } from '../context/DataContext';
import { NAV_MENU, SLUG_TO_CATEGORIES } from '../constants';
import SeoHead from './SeoHead';
import { stripHtmlTags } from '../lib/richText';

const CategoryPage: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const { listings, recentListings, adSettings, seoSettings } = useData();
  const searchQuery = new URLSearchParams(location.search).get('q')?.trim() ?? '';

  const pageData = useMemo(() => {
    const baseUrl = seoSettings.baseUrl.replace(/\/$/, '');

    if (location.pathname === '/arama') {
      const normalizedQuery = searchQuery.toLocaleLowerCase('tr-TR');
      const filteredListings = normalizedQuery
        ? listings.filter((listing) => {
            if (listing.status !== 'active') return false;

            const searchableText = [
              listing.title,
              stripHtmlTags(listing.description),
              listing.location,
              listing.ilanNo,
              listing.type,
              listing.category,
              listing.details?.city,
              listing.details?.district,
              listing.details?.neighborhood,
              listing.details?.zoningStatus,
            ]
              .filter(Boolean)
              .join(' ')
              .toLocaleLowerCase('tr-TR');

            return searchableText.includes(normalizedQuery);
          })
        : [];

      return {
        pageTitle: searchQuery ? `"${searchQuery}" için arama sonuçları` : 'Arama Sonuçları',
        filteredListings,
        description: searchQuery
          ? `"${searchQuery}" araması için Ada Emlak portföyünde bulunan ilan sonuçları.`
          : 'Ada Emlak portföyünde arama yapın.',
        keywords: searchQuery ? `${searchQuery}, ${seoSettings.siteKeywords}` : seoSettings.siteKeywords,
        noIndex: true,
        canonicalUrl: `${baseUrl}/arama`,
      };
    }

    if (params.group && params.type) {
      const targetLink = `/kategori/${params.group}/${params.type}`;
      let foundCategoryKey = '';
      let foundLabel = '';

      for (const menuGroup of NAV_MENU) {
        const subItem = menuGroup.subItems.find((item) => item.link === targetLink);
        if (subItem) {
          foundCategoryKey = subItem.categoryKey;
          foundLabel = subItem.label;
          break;
        }
      }

      const pageTitle = foundLabel || `${params.group.toUpperCase()} ${params.type.toUpperCase()}`;
      const filteredListings = foundCategoryKey
        ? listings.filter((listing) => listing.category === foundCategoryKey && listing.status === 'active')
        : [];

      return {
        pageTitle,
        filteredListings,
        description: `${pageTitle} ilanları. Ada Emlak portföyündeki güncel gayrimenkul fırsatlarını inceleyin.`,
        keywords: `${pageTitle}, ${seoSettings.siteKeywords}`,
        noIndex: false,
        canonicalUrl: `${baseUrl}${targetLink}`,
      };
    }

    if (params.categorySlug) {
      const slug = params.categorySlug.toLowerCase();
      const targetCategories = SLUG_TO_CATEGORIES[slug];
      const humanLabel = NAV_MENU.find((item) => item.slug === slug)?.label || slug.replace(/-/g, ' ').toUpperCase();

      return {
        pageTitle: targetCategories ? humanLabel : 'Kategori Bulunamadı',
        filteredListings: targetCategories
          ? listings.filter((listing) => targetCategories.includes(listing.category) && listing.status === 'active')
          : [],
        description: targetCategories
          ? `${humanLabel} kategorisindeki satılık ve kiralık Ada Emlak ilanlarını keşfedin.`
          : 'Talep ettiğiniz kategori bulunamadı.',
        keywords: `${humanLabel}, ${seoSettings.siteKeywords}`,
        noIndex: !targetCategories,
        canonicalUrl: `${baseUrl}/${slug}`,
      };
    }

    return {
      pageTitle: 'Kategori',
      filteredListings: [],
      description: seoSettings.siteDescription,
      keywords: seoSettings.siteKeywords,
      noIndex: true,
      canonicalUrl: `${baseUrl}${location.pathname}`,
    };
  }, [params, location.pathname, searchQuery, listings, seoSettings]);

  const sidebarRecentListings = recentListings.slice(0, 12);
  const categoryPairedRows = Array.from({
    length: Math.max(pageData.filteredListings.length || 1, sidebarRecentListings.length),
  });

  const emptyState = (
    <div className="rounded-[14px] border border-gray-100 bg-white p-10 text-center text-gray-500 shadow-card">
      <svg className="mx-auto mb-3 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      {location.pathname === '/arama'
        ? 'Aramanıza uygun ilan bulunamadı.'
        : 'Bu kategoride henüz ilan bulunmamaktadır.'}
    </div>
  );

  return (
    <>
      <SeoHead
        title={pageData.pageTitle}
        description={pageData.description}
        keywords={pageData.keywords}
        noIndex={pageData.noIndex}
        canonicalUrl={pageData.canonicalUrl}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: pageData.pageTitle,
          description: pageData.description,
          url: pageData.canonicalUrl,
        }}
      />
      <FilterBar />
      <div className="container mx-auto max-w-[1320px] px-4 py-8">
        <div className="mb-6 flex items-center text-xs font-sans uppercase tracking-wider text-gray-500">
          <Link to="/" className="transition-colors hover:text-gold-500">Ana Sayfa</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="font-bold text-gold-500">{pageData.pageTitle}</span>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,66fr)_minmax(0,34fr)] lg:grid-rows-[68px_auto] lg:gap-x-8 lg:gap-y-6">
          <div className="mb-6 flex items-end justify-between border-b border-gray-200 pb-2 lg:col-start-1 lg:row-start-1 lg:mb-0 lg:h-[68px]">
            <h1 className="text-2xl font-serif font-bold leading-tight text-[#2c2c2c]">
              {pageData.pageTitle}
            </h1>
            <span className="text-sm font-bold text-gray-400">{pageData.filteredListings.length} İlan</span>
          </div>

          <div className="mb-0 flex h-[68px] items-center justify-between bg-[linear-gradient(135deg,#e5a61b_0%,#f0b52f_55%,#de9f14_100%)] px-6 py-5 font-sans text-xl font-bold uppercase tracking-[0.06em] text-white shadow-[0_14px_28px_rgba(232,175,54,0.22)] lg:col-start-2 lg:row-start-1">
            <span>SON EKLENENLER</span>
            <span className="text-sm font-medium normal-case tracking-normal text-white/75">Güncel</span>
          </div>

          <div className="w-full lg:hidden">
            {pageData.filteredListings.length > 0 ? (
              <div className="space-y-6">
                {pageData.filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              emptyState
            )}
          </div>

          <div className="mt-8 w-full lg:hidden">
            <div className="border border-t-0 border-[#eceff3] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-5 shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
              {sidebarRecentListings.map((item) => (
                <SidebarItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="hidden lg:col-span-2 lg:row-start-2 lg:grid lg:gap-y-8">
            {categoryPairedRows.map((_, index) => {
              const listing = pageData.filteredListings[index];
              const recentListing = sidebarRecentListings[index];

              return (
                <div key={`${listing?.id ?? 'empty'}-${recentListing?.id ?? 'empty'}-${index}`} className="grid grid-cols-[minmax(0,66fr)_minmax(0,34fr)] items-stretch gap-x-8">
                  <div>
                    {listing ? (
                      <ListingCard listing={listing} flushSpacing />
                    ) : index === 0 && pageData.filteredListings.length === 0 ? (
                      <div className="h-full">{emptyState}</div>
                    ) : (
                      <div className="h-full" />
                    )}
                  </div>

                  <div>
                    {recentListing ? (
                      <SidebarItem item={recentListing} flushSpacing />
                    ) : (
                      <div className="h-full" />
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        <div className="mt-8">
          {adSettings.isActive && adSettings.imageUrl ? (
            <div className="overflow-hidden border border-gray-100 bg-white shadow-sm">
              {adSettings.linkUrl ? (
                <a href={adSettings.linkUrl} target="_blank" rel="noopener noreferrer" className="group relative block">
                  <img src={adSettings.imageUrl} alt="Reklam" className="h-[120px] w-full object-cover md:h-[150px]" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5"></div>
                </a>
              ) : (
                <img src={adSettings.imageUrl} alt="Reklam" className="h-[120px] w-full object-cover md:h-[150px]" loading="lazy" decoding="async" />
              )}
              <div className="bg-gray-50 px-3 py-1 text-right font-sans text-[9px] text-gray-300">REKLAM</div>
            </div>
          ) : (
            <div className="flex h-[120px] items-center justify-center border border-gray-100 bg-white p-4 font-serif italic text-gray-300 shadow-sm md:h-[150px]">
              Reklam Alanı
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;

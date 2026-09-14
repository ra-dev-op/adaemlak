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
  const { listings, recentListings, seoSettings } = useData();
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

  const sidebarRecentListings = recentListings.slice(0, pageData.filteredListings.length || 1);
  const categoryPairedRows = Array.from({
    length: sidebarRecentListings.length,
  });
  const remainingCategoryListings = pageData.filteredListings.slice(sidebarRecentListings.length);

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
        <div className="mb-6 flex items-center font-sans text-[14px] font-medium uppercase leading-5 tracking-[0.06em] text-gray-500">
          <Link to="/" className="transition-colors hover:text-gold-500">Ana Sayfa</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="font-bold text-gold-500">{pageData.pageTitle}</span>
        </div>

        <div>
          <div className="mb-6 flex items-end justify-between border-b border-gray-200 pb-2">
            <h1 className="text-2xl font-serif font-bold leading-tight text-[#2c2c2c]">
              {pageData.pageTitle}
            </h1>
            <span className="text-sm font-bold text-gray-400">{pageData.filteredListings.length} İlan</span>
          </div>

          <div className="lg:hidden">
            <div className="w-full">
              {pageData.filteredListings.length > 0 ? (
                <div className="space-y-6">
                  {pageData.filteredListings.map((listing, index) => (
                    <ListingCard key={listing.id} listing={listing} priority={index === 0} />
                  ))}
                </div>
              ) : (
                emptyState
              )}
            </div>

          </div>

          <div className="relative hidden space-y-8 lg:block">
            {sidebarRecentListings.length > 0 && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 top-[43px] w-[calc(34%-10.88px)] border border-t-0 border-[#e5ded3]"
                style={{
                  backgroundImage: `url(${import.meta.env.BASE_URL}textures/detaybg.webp)`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center top',
                  backgroundSize: '100% 100%',
                }}
              />
            )}

            {categoryPairedRows.map((_, index) => {
              const listing = pageData.filteredListings[index];
              const recentListing = sidebarRecentListings[index];

              return (
                <div key={`${listing?.id ?? 'empty'}-${recentListing?.id ?? 'empty'}-${index}`} className="grid grid-cols-[minmax(0,66fr)_minmax(0,34fr)] items-stretch gap-x-8">
                  <div>
                    {listing ? (
                      <ListingCard listing={listing} flushSpacing priority={index === 0} />
                    ) : index === 0 && pageData.filteredListings.length === 0 ? (
                      <div className="h-full">{emptyState}</div>
                    ) : (
                      <div className="h-full" />
                    )}
                  </div>

                  <aside className="relative z-10 flex h-full flex-col">
                    {recentListing ? (
                      <>
                        {index === 0 && (
                          <div
                            className="flex h-[43px] shrink-0 items-center bg-[#eea904] px-5 text-[21px] font-bold uppercase leading-none text-[#202938]"
                            style={{ fontFamily: "var(--font-primary)" }}
                          >
                            SON EKLENENLER
                          </div>
                        )}
                        <div
                          className="flex-1 border border-t-0 border-[#e5ded3] px-5 py-5 lg:!border-0 lg:!bg-none"
                          style={{
                            backgroundImage: `url(${import.meta.env.BASE_URL}textures/detaybg.webp)`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center top',
                            backgroundSize: '100% 100%',
                          }}
                        >
                          <SidebarItem item={recentListing} flushSpacing />
                        </div>
                        {index === sidebarRecentListings.length - 1 && (
                          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-20 h-[40px] bg-[#eea904]" />
                        )}
                      </>
                    ) : (
                      <div className="h-full" />
                    )}
                  </aside>
                </div>
              );
            })}
          </div>

          {remainingCategoryListings.length > 0 && (
            <div className={`hidden space-y-8 lg:block ${sidebarRecentListings.length > 0 ? 'mt-8' : ''}`}>
              {remainingCategoryListings.map((listing) => (
                <div key={listing.id} className="grid grid-cols-[minmax(0,66fr)_minmax(0,34fr)] gap-x-8">
                  <ListingCard listing={listing} flushSpacing />
                  <div aria-hidden="true" />
                </div>
              ))}
            </div>
          )}

          {pageData.filteredListings.length === 0 && sidebarRecentListings.length === 0 && (
            <div className="hidden lg:grid lg:grid-cols-[minmax(0,66fr)_minmax(0,34fr)] lg:gap-x-8">
              {emptyState}
              <div aria-hidden="true" />
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default CategoryPage;


import React from 'react';
import FilterBar from './FilterBar';
import ListingCard from './ListingCard';
import SidebarItem from './SidebarItem';
import { useData } from '../context/DataContext';
import SeoHead from './SeoHead';

const Home: React.FC = () => {
  const { featuredListings, recentListings, seoSettings } = useData();
  const homepageFeaturedListings = featuredListings.slice(0, 10);
  const homepageRecentListings = recentListings.slice(0, homepageFeaturedListings.length || 10);

  return (
    <>
      <h1 className="sr-only">İstanbul Ticari Gayrimenkul ve Yatırım Danışmanlığı</h1>
      <SeoHead 
        title="İstanbul Ticari Gayrimenkul ve Yatırım Danışmanlığı"
        description={seoSettings.siteDescription}
        keywords={seoSettings.siteKeywords}
        schema={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": seoSettings.baseUrl,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${seoSettings.baseUrl}/arama?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        }}
      />
      <FilterBar />
      <div className="container mx-auto max-w-[1320px] px-4">
        <div className="relative space-y-6 lg:space-y-8">
          {homepageRecentListings.length > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 top-[43px] hidden w-[calc(34%-10.88px)] border border-t-0 border-[#e5ded3] lg:block"
              style={{
                backgroundImage: `url(${import.meta.env.BASE_URL}textures/detaybg.webp)`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center top',
                backgroundSize: '100% 100%',
              }}
            />
          )}

          {homepageFeaturedListings.map((listing, index) => {
            const recentListing = homepageRecentListings[index];

            return (
              <div
                key={listing.id}
                className="grid gap-6 lg:grid-cols-[minmax(0,66fr)_minmax(0,34fr)] lg:gap-x-8"
              >
                <div className={`w-full ${index === 0 ? 'lg:pt-2' : ''}`}>
                  <ListingCard listing={listing} flushSpacing priority={index === 0} bottomPad={index === 0} />
                </div>

                {recentListing && (
                  <aside className="relative z-10 hidden h-full w-full flex-col lg:flex">
                    {index === 0 && (
                      <div
                        className="mb-0 flex h-[43px] shrink-0 items-center justify-between bg-[#eea904] px-5 text-[21px] font-bold uppercase leading-none text-[#202938]"
                        style={{ fontFamily: "var(--font-primary)" }}
                      >
                        <span>SON EKLENENLER</span>
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

                    {index === homepageRecentListings.length - 1 && (
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 z-20 h-[40px] bg-[#eea904]"
                      />
                    )}

                  </aside>
                )}
              </div>
            );
          })}

          {homepageFeaturedListings.length === 0 && (
            <div className="bg-white p-10 text-center text-gray-500 shadow-card lg:col-span-2">
              Henüz vitrin ilanı bulunmamaktadır.
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Home;

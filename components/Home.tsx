
import React from 'react';
import FilterBar from './FilterBar';
import ListingCard from './ListingCard';
import SidebarItem from './SidebarItem';
import { useData } from '../context/DataContext';
import SeoHead from './SeoHead';

const Home: React.FC = () => {
  const { featuredListings, recentListings, adSettings, seoSettings } = useData();
  const homepageFeaturedListings = featuredListings.slice(0, 10);
  const homepageRecentListings = recentListings.slice(0, 12);
  const defaultHomeAdImage = '/ads/ikog-banner.png';
  const homeAdImage = adSettings.isActive && adSettings.imageUrl ? adSettings.imageUrl : defaultHomeAdImage;
  const homeAdLink = adSettings.isActive && adSettings.linkUrl ? adSettings.linkUrl : 'https://www.ikog.com/';

  return (
    <>
      <SeoHead 
        title="İstanbul Gayrimenkul Yatırım Danışmanlığı"
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
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,66fr)_minmax(0,34fr)] lg:items-start lg:gap-x-8">
          {/* Main Column */}
          <div className="w-full">
            <div className="space-y-6 lg:space-y-8">
              {homepageFeaturedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} flushSpacing />
              ))}
            </div>
            
            {homepageFeaturedListings.length === 0 && (
              <div className="bg-white p-10 text-center text-gray-500 shadow-card">
                Henüz vitrin ilanı bulunmamaktadır.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full">
            <div className="mb-0 flex h-[50px] items-center justify-between bg-[linear-gradient(135deg,#e5a61b_0%,#f0b52f_55%,#de9f14_100%)] px-5 font-sans text-xl font-bold uppercase tracking-[0.03em] text-white shadow-[0_10px_22px_rgba(232,175,54,0.18)] lg:h-[52px]">
              <span>SON EKLENENLER</span>
              <span className="text-sm font-medium normal-case tracking-normal text-white/75">Güncel</span>
            </div>

            <div className="border border-t-0 border-[#eceff3] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-5 shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
              {homepageRecentListings.map((item) => (
                <SidebarItem key={item.id} item={item} />
              ))}
               
              <div className="mt-6 border-t border-gray-100 pt-2"></div>
            </div>
          </aside>
        </div>

        <div className="mt-8">
          <div className="overflow-hidden border border-gray-100 bg-white px-6 py-4 shadow-sm">
            {homeAdLink ? (
                <a href={homeAdLink} target="_blank" rel="noopener noreferrer" className="group relative block">
                  <img src={homeAdImage} alt="Reklam" className="mx-auto h-[90px] w-full object-contain md:h-[118px]" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5"></div>
                </a>
              ) : (
                <img src={homeAdImage} alt="Reklam" className="mx-auto h-[90px] w-full object-contain md:h-[118px]" loading="lazy" />
              )}
            <div className="bg-gray-50 px-3 py-1 text-right font-sans text-[9px] text-gray-300">REKLAM</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

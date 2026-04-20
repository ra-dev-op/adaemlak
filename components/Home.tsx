
import React from 'react';
import FilterBar from './FilterBar';
import ListingCard from './ListingCard';
import SidebarItem from './SidebarItem';
import { useData } from '../context/DataContext';
import SeoHead from './SeoHead';

const Home: React.FC = () => {
  const { featuredListings, recentListings, adSettings, seoSettings } = useData();

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
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Column - Listings (Admin Selected Featured 10) */}
          <div className="w-full lg:w-[66%]">
            <div className="mb-4 flex items-center gap-2">
                 <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                 <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Gayrimenkul Vitrini</h2>
            </div>
            
            <div className="space-y-6 lg:space-y-8">
                {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>
            
            {featuredListings.length === 0 && (
                <div className="p-10 text-center bg-white shadow-card text-gray-500">
                    Henüz vitrin ilanı bulunmamaktadır.
                </div>
            )}
          </div>
          
          {/* Sidebar - Recently Added (Automatic by Date) */}
          <div className="w-full lg:w-[34%]">
            <div className="rounded-[16px] bg-[linear-gradient(135deg,#e5a61b_0%,#f0b52f_55%,#de9f14_100%)] text-white font-sans font-bold text-xl py-5 px-6 mb-6 uppercase shadow-[0_14px_28px_rgba(232,175,54,0.22)] tracking-[0.06em] flex items-center justify-between">
              <span>SON EKLENENLER</span>
              <span className="text-white/75 text-sm normal-case font-medium tracking-normal">Güncel</span>
            </div>
            
            <div className="rounded-[20px] border border-[#eceff3] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-5 shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
               {recentListings.map((item) => (
                 <SidebarItem key={item.id} item={item} />
               ))}
               
               <div className="border-t border-gray-100 mt-6 pt-2"></div>
            </div>

             {/* Right Column Ad Area */}
             <div className="mt-6">
                {adSettings.isActive && adSettings.imageUrl ? (
                    <div className="shadow-sm rounded-sm overflow-hidden border border-gray-100 bg-white">
                        {adSettings.linkUrl ? (
                            <a href={adSettings.linkUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
                                <img src={adSettings.imageUrl} alt="Reklam" className="w-full h-auto object-cover" loading="lazy" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                            </a>
                        ) : (
                            <img src={adSettings.imageUrl} alt="Reklam" className="w-full h-auto object-cover" loading="lazy" />
                        )}
                        <div className="text-[9px] text-gray-300 text-right px-2 py-1 bg-gray-50 font-sans">REKLAM</div>
                    </div>
                ) : (
                    <div className="bg-white shadow-sm p-4 h-32 flex items-center justify-center text-gray-300 font-serif italic border border-gray-100">
                        Reklam Alanı
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

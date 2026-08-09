
import React from 'react';
import { Link } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { useData } from '../context/DataContext';
import CompanyCard from './CompanyCard';
import SeoHead from './SeoHead';

const News: React.FC = () => {
  const { news, sidebarListings, seoSettings } = useData();
  const canonicalUrl = `${seoSettings.baseUrl.replace(/\/$/, '')}/blog`;

  return (
    <>
    <SeoHead
      title="Gayrimenkul Blog Yazıları"
      description="Gayrimenkul yatırımı, ticari arsa, satılık bina ve lokasyon analizi gibi konularda Ada Emlak blog yazılarını inceleyin."
      keywords="gayrimenkul blog, emlak yatırım yazıları, ticari arsa rehberi, satılık bina analizi, ada emlak blog"
      canonicalUrl={canonicalUrl}
      type="website"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Ada Emlak Blog',
        url: canonicalUrl,
        description: 'Gayrimenkul yatırımı ve emlak piyasasına dair rehber yazılar',
      }}
    />

    <div className="container mx-auto max-w-[1320px] px-4 py-8">
       {/* Breadcrumb */}
       <div className="flex items-center text-xs text-gray-500 mb-6 font-sans uppercase tracking-wider">
          <Link to="/" className="hover:text-gold-500 transition-colors">Ana Sayfa</Link> 
          <span className="mx-2 text-gray-300">/</span>
          {/* Label remains 'Haberler' but links to '/blog' */}
          <Link to="/blog" className="text-gold-500 font-bold">Haberler</Link>
       </div>

       <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN - NEWS LIST */}
          <div className="w-full lg:w-[66%]">
             
             {/* Header Section */}
             <div className="mb-6 pb-2 border-b border-gray-200">
                <h1 className="text-[#2c2c2c] font-serif font-bold text-2xl md:text-3xl leading-tight mb-2">
                   Haberler & Blog
                </h1>
                <div className="w-20 h-1 bg-gold-500 rounded-full mt-2"></div>
             </div>

             {/* Content */}
             <div className="space-y-8">
                {news.map((item) => (
                    <div key={item.id} className="bg-white p-6 shadow-card rounded-sm border border-gray-100 hover:shadow-premium transition-shadow duration-300">
                        <div className="flex flex-col md:flex-row gap-6">
                            
                            {/* Image */}
                            <div className="w-full md:w-[240px] shrink-0 h-[160px] relative overflow-hidden group">
                                    <Link to={`/blog/${item.slug}`} className="block w-full h-full">
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                                </Link>
                            </div>

                            {/* Text Content */}
                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="text-xs text-gold-500 font-bold uppercase tracking-wider mb-2 flex items-center">
                                        <svg className="w-3 h-3 mr-1 fill-current" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
                                        {item.date}
                                    </div>
                                    <Link to={`/blog/${item.slug}`} className="block">
                                        <h2 className="text-xl text-[#333] font-serif font-bold mb-3 hover:text-gold-500 transition-colors leading-tight cursor-pointer">
                                            {item.title}
                                        </h2>
                                    </Link>
                                    <p className="text-gray-500 font-sans text-sm leading-relaxed line-clamp-3">
                                        {item.summary}
                                    </p>
                                </div>
                                
                                <div className="mt-4 flex justify-end">
                                    <Link to={`/blog/${item.slug}`} className="text-[11px] font-bold uppercase tracking-widest text-gold-500 border border-gold-500 hover:bg-gold-500 hover:text-white px-4 py-2 rounded-[2px] transition-all duration-300 flex items-center group">
                                        Devamını Oku
                                        <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/></svg>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="w-full lg:w-[34%]">
             <div className="sticky top-24 space-y-6">
                
                <CompanyCard />

                <div className="rounded-[16px] bg-[linear-gradient(135deg,#e5a61b_0%,#f0b52f_55%,#de9f14_100%)] text-white font-sans font-bold text-xl py-5 px-6 uppercase shadow-[0_14px_28px_rgba(232,175,54,0.22)] tracking-[0.06em] flex items-center justify-between">
                   <span>SON EKLENENLER</span>
                   <span className="text-white/75 text-sm normal-case font-medium tracking-normal">Güncel</span>
                </div>
                
                <div className="rounded-[20px] border border-[#eceff3] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-5 shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
                   {sidebarListings.slice(0, 3).map((item) => (
                      <SidebarItem key={item.id} item={item} largeImage />
                   ))}
                </div>

             </div>
          </div>
       </div>
    </div>
    </>
  );
};

export default News;

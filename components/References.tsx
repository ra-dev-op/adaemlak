
import React from 'react';
import { Link } from 'react-router-dom';
import CompanyCard from './CompanyCard';
import SeoHead from './SeoHead';

const References: React.FC = () => {
  return (
    <>
    <SeoHead
      title="Referanslarımız"
      description="Ada Emlak'ın güven odaklı referans yaklaşımını ve müşteri ilişkilerinde benimsediği kurumsal iletişim anlayışını inceleyin."
      keywords="ada emlak referanslar, güvenilir emlak danışmanlığı, kurumsal gayrimenkul hizmeti"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Referanslarımız',
        description:
          'Ada Emlak’ın referans paylaşımına ve güven ilişkisine bakışını anlatan kurumsal sayfa.',
      }}
    />
    <div className="container mx-auto max-w-[1320px] px-4 py-8">
       {/* Breadcrumb */}
       <div className="flex items-center text-xs text-gray-500 mb-6 font-sans uppercase tracking-wider">
          <Link to="/" className="hover:text-gold-500 transition-colors">Ana Sayfa</Link> 
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gold-500 font-bold">Referanslarımız</span>
       </div>

       <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN - MAIN CONTENT */}
          <div className="w-full lg:w-[70%]">
             
             {/* Header Section */}
             <div className="mb-6 overflow-hidden rounded-[24px] border border-[#ece6d9] bg-[linear-gradient(135deg,#fffdfa_0%,#f6f1e7_100%)] p-7 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-600">Kurumsal Yaklaşım</div>
                        <h1 className="mt-3 text-[#2c2c2c] font-serif font-bold text-3xl md:text-[40px] leading-tight">
                           Referanslarımız
                        </h1>
                        <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-[#667085]">
                           Güven ilişkisini ön planda tutan yaklaşımımız gereği referans paylaşımını değil, birebir tanışmayı ve doğru iletişim kurmayı daha değerli buluyoruz.
                        </p>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-gold-600 shadow-[0_10px_24px_rgba(217,162,26,0.16)]">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-1.5 0h12a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 014.5 18v-6a1.5 1.5 0 011.5-1.5z" />
                        </svg>
                    </div>
                </div>
             </div>

             {/* Content */}
             <div className="relative min-h-[400px] overflow-hidden rounded-[24px] border border-[#eceef2] bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gold-100/40 blur-2xl"></div>
                <div className="relative z-10 text-[#566070] font-sans leading-loose text-[15px] space-y-6 text-justify">
                    
                    <div className="mb-8 rounded-[22px] border border-[#eadfca] bg-[linear-gradient(135deg,#fffdfa_0%,#fbf6ec_100%)] p-6 shadow-[0_12px_24px_rgba(217,162,26,0.08)]">
                        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-600">Güven İlkesi</div>
                        <p className="font-serif italic text-[22px] leading-relaxed text-[#404857]">
                           <span className="text-gold-500 font-bold">“%100 Güvenilir Olma”</span> prensibine bağlı kalarak kimlerle çalıştığımızı, bizi kimlerin tanıdığını ve kimlerle ne yaptığımızı paylaşmayı doğru bulmuyoruz.
                        </p>
                    </div>

                    <p>
                        Referanslarımız planladığınız alım, satım veya kiralama operasyonları için{' '}
                        <span className="rounded-[8px] bg-gold-100/80 px-2 py-0.5 font-semibold text-[#8a6310] shadow-[inset_0_-1px_0_rgba(217,162,26,0.18)]">
                            Ada Emlak ile çalışıp çalışmama kararınızda
                        </span>{' '}
                        etkili olacaksa, bunun yerine sizinle tanışıp bir kahve içerek yapacağımız sohbet dahilinde alacağınız kararlar doğrultusunda hareket etmenizi tercih ederiz.
                    </p>

                    <div className="mt-12 flex justify-center opacity-90">
                         <div className="flex h-28 w-28 items-center justify-center rounded-full border border-gold-100 bg-[linear-gradient(180deg,#fffdfa_0%,#fff4d9_100%)] text-gold-500 shadow-[0_14px_28px_rgba(217,162,26,0.12)]">
                            <svg className="h-12 w-12 fill-current opacity-70" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.18 5.75l-3.32 6.13-1.66-2.58c-.14-.21-.4-.28-.62-.16l-1.15.61c-.22.12-.31.39-.21.61l2.51 5.37c.18.39.66.54 1.05.34l.21-.11c.21-.11.34-.33.34-.57v-.03c0-.02.01-.03.01-.05l3.77-8.52c.15-.34-.01-.74-.35-.89l-1.07-.47c-.24-.11-.53 0-.66.24zM7 14c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0-3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
                            </svg>
                         </div>
                    </div>

                </div>
             </div>
          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="w-full lg:w-[30%]">
             <div className="sticky top-24 space-y-6">
                <CompanyCard />
             </div>
          </div>
       </div>
    </div>
    </>
  );
};

export default References;

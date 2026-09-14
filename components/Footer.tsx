
import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { useData } from '../context/DataContext';

const Footer: React.FC = () => {
  const { generalSettings } = useData();

  const hasCorporateInfo = generalSettings.chamberRegistrationNo || generalSettings.mersisNo;

  return (
    <footer className="mt-16 border-t border-[#c8c8c8] bg-[#d1d1d1] pb-7 pt-12 font-sans text-[16px] font-normal text-black">
      <div className="container mx-auto max-w-[1320px] px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            
            {/* Column 1: Kurumsal */}
            <div>
                <Link to="/" className="mb-6 inline-flex">
                    <img
                        src={`${import.meta.env.BASE_URL}ada-emlak-logo.png`}
                        alt="Ada Emlak"
                        className="h-14 w-auto object-contain opacity-95 transition-transform duration-300 hover:scale-[1.02]"
                        width="151"
                        height="81"
                        loading="lazy"
                        decoding="async"
                    />
                </Link>
                <h3 className="mb-6 flex items-center font-serif text-[20px] font-bold text-[#252b34]">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></span>
                    KURUMSAL
                </h3>
                <ul className="space-y-3">
                    <li>
                        <Link to="/" className="group flex items-center text-[16px] leading-6 text-[#525a66] transition-colors hover:text-gold-500">
                            <svg className="mr-2.5 h-[17px] w-[17px] text-[#89919c] transition-colors group-hover:text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            Ana Sayfa
                        </Link>
                    </li>
                    <li>
                        <Link to="/hakkimizda" className="group flex items-center text-[16px] leading-6 text-[#525a66] transition-colors hover:text-gold-500">
                            <svg className="mr-2.5 h-[17px] w-[17px] text-[#89919c] transition-colors group-hover:text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            Hakkımızda
                        </Link>
                    </li>
                    <li>
                        <Link to="/iletisim" className="group flex items-center text-[16px] leading-6 text-[#525a66] transition-colors hover:text-gold-500">
                            <svg className="mr-2.5 h-[17px] w-[17px] text-[#89919c] transition-colors group-hover:text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            İletişim
                        </Link>
                    </li>
                </ul>
                
                {/* Sahibinden Badge */}
                <div className="mt-8">
                    <a 
                        href="https://adabakirkoy.sahibinden.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-sm hover:border-gold-500 group transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <div className="bg-gold-100 p-1.5 rounded-full text-gold-600 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="mb-1 text-[10px] font-bold uppercase leading-none tracking-wider text-[#5f6670]">Kurumsal Mağaza</span>
                            <span className="text-sm font-bold text-gray-700 group-hover:text-gold-500 transition-colors">sahibinden.com</span>
                        </div>
                    </a>
                </div>
            </div>

            {/* Column 2: Portföy */}
            <div>
                <h3 className="mb-6 flex items-center font-serif text-[20px] font-bold text-[#252b34]">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></span>
                    PORTFÖY
                </h3>
                <ul className="grid grid-cols-1 gap-3">
                    {NAV_ITEMS.map((item) => (
                         <li key={item.label}>
                            {item.externalUrl ? (
                                <a
                                    href={item.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center text-[16px] leading-6 text-[#525a66] transition-colors hover:text-gold-500"
                                >
                                    <svg className="w-3.5 h-3.5 mr-2 text-gray-400 group-hover:text-gold-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    {item.label}
                                </a>
                            ) : (
                                <Link to={item.path} className="group flex items-center text-[16px] leading-6 text-[#525a66] transition-colors hover:text-gold-500">
                                    <svg className="w-3.5 h-3.5 mr-2 text-gray-400 group-hover:text-gold-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Column 3: Yasal */}
            <div>
                <h3 className="mb-6 flex items-center font-serif text-[20px] font-bold text-[#252b34]">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></span>
                    YASAL & BİLGİ
                </h3>
                <ul className="space-y-3">
                    <li>
                        <Link to="/kvkk" className="group flex items-center text-[16px] leading-6 text-[#525a66] transition-colors hover:text-gold-500">
                            <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gold-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            KVKK Aydınlatma Metni
                        </Link>
                    </li>
                    <li>
                        <Link to="/gizlilik-politikasi" className="group flex items-center text-[16px] leading-6 text-[#525a66] transition-colors hover:text-gold-500">
                             <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gold-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            Gizlilik Politikası
                        </Link>
                    </li>
                    <li>
                        <Link to="/cerez-politikasi" className="group flex items-center text-[16px] leading-6 text-[#525a66] transition-colors hover:text-gold-500">
                            <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gold-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            Çerez Politikası
                        </Link>
                    </li>
                    <li>
                        <Link to="/acik-riza-metni" className="group flex items-center text-[16px] leading-6 text-[#525a66] transition-colors hover:text-gold-500">
                            <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gold-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            Açık Rıza Metni
                        </Link>
                    </li>
                    <li>
                        <Link to="/veri-sahibi-basvuru-formu" className="group flex items-center text-[16px] leading-6 text-[#525a66] transition-colors hover:text-gold-500">
                             <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gold-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Veri Sahibi Başvuru Formu
                        </Link>
                    </li>
                    <li>
                        <Link to="/kullanim-kosullari" className="group flex items-center text-[16px] leading-6 text-[#525a66] transition-colors hover:text-gold-500">
                             <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gold-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                            Kullanım Koşulları
                        </Link>
                    </li>
                </ul>
            </div>

        </div>

        {/* Separator */}
        <div className="border-t border-[#dcdcdc] mb-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-y-4 font-sans text-[12px] font-semibold uppercase tracking-tight text-[#505761] md:flex-row">
            <div className="mb-2 md:mb-0">
                {generalSettings.footerText}
            </div>
            
            {hasCorporateInfo && (
                <div className="flex flex-col md:flex-row gap-y-1 md:gap-x-4 text-center md:text-right">
                    {generalSettings.chamberRegistrationNo && (
                        <span>
                            {generalSettings.chamberName ? `${generalSettings.chamberName} ` : ''} 
                            SİCİL NO: {generalSettings.chamberRegistrationNo}
                        </span>
                    )}
                    {generalSettings.mersisNo && (
                        <>
                            <span className="hidden md:inline text-gray-300">|</span>
                            <span>MERSİS: {generalSettings.mersisNo}</span>
                        </>
                    )}
                </div>
            )}
        </div>

      </div>
    </footer>
  );
};

export default Footer;

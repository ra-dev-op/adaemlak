
import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const CompanyCard: React.FC = () => {
  const { generalSettings } = useData();
  const directMobileHref = 'tel:+905322435522';
  
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-[#ece6d8] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f4eb_100%)] p-6 shadow-[0_18px_38px_rgba(15,23,42,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_46px_rgba(15,23,42,0.10)] animate-fade-in-up">
        <div className="absolute inset-x-0 top-0 h-[4px] bg-[linear-gradient(90deg,#d4a33a_0%,#efb73b_50%,#d59d27_100%)]"></div>
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold-100/40 blur-2xl transition-transform duration-700 group-hover:scale-125"></div>

        <div className="relative z-10">
            <div className="rounded-[20px] border border-white/80 bg-white/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                    <Link to="/" className="inline-flex rounded-[20px] border border-[#f1ede4] bg-white px-6 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:scale-[1.02]">
                        <img 
                            src={`${import.meta.env.BASE_URL}ada-emlak-logo.png`}
                            alt="Ada Emlak" 
                            className="h-[72px] object-contain"
                        />
                    </Link>

                    <div className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-gold-600">Kurumsal İletişim</div>
                    <div className="mt-2 text-[34px] font-semibold tracking-tight text-[#252f3d]">ADA EMLAK</div>
                    <div className="mt-2 max-w-[260px] text-[13px] font-medium uppercase tracking-[0.2em] text-[#9f8a61]">
                        Gayrimenkul Yatırım Danışmanlığı
                    </div>
                </div>
            </div>

            <div className="mt-5 space-y-3">
                <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(generalSettings.contactAddress)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 rounded-[18px] border border-[#efe8d8] bg-white/90 px-4 py-4 text-left shadow-[0_12px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-[0_18px_28px_rgba(217,162,26,0.12)]"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-100 bg-[linear-gradient(180deg,#fffdfa_0%,#fff4d9_100%)] text-gold-600 shadow-sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    </div>
                    <div className="min-w-0">
                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a18d65]">Adres</div>
                        <div className="mt-1 whitespace-pre-line text-[14px] font-medium leading-relaxed text-[#566070]">{generalSettings.contactAddress}</div>
                    </div>
                </a>

                <a 
                    href={`mailto:${generalSettings.contactEmail}`}
                    className="flex items-center gap-4 rounded-[18px] border border-[#efe8d8] bg-white/90 px-4 py-4 text-left shadow-[0_12px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-[0_18px_28px_rgba(217,162,26,0.12)]"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-100 bg-[linear-gradient(180deg,#fffdfa_0%,#fff4d9_100%)] text-gold-600 shadow-sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a18d65]">E-Posta</div>
                        <div className="mt-1 whitespace-nowrap text-[clamp(12px,1.05vw,14px)] font-semibold leading-snug tracking-normal text-[#2d3746] [word-break:keep-all]">{generalSettings.contactEmail}</div>
                    </div>
                </a>

                <a 
                    href={directMobileHref}
                    className="flex items-center gap-4 rounded-[18px] border border-[#efe8d8] bg-white/90 px-4 py-4 text-left shadow-[0_12px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-[0_18px_28px_rgba(217,162,26,0.12)]"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-100 bg-[linear-gradient(180deg,#fffdfa_0%,#fff4d9_100%)] text-gold-600 shadow-sm">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    </div>
                    <div className="min-w-0">
                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a18d65]">Telefon</div>
                        <div className="mt-1 text-[28px] font-semibold leading-none tracking-tight text-[#2d3746]">{generalSettings.headerPhone}</div>
                    </div>
                </a>
            </div>
        </div>
    </div>
  );
};

export default CompanyCard;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import CompanyCard from './CompanyCard';
import SeoHead from './SeoHead';

const Contact: React.FC = () => {
  const { addMessage, generalSettings, seoSettings } = useData();
  const directMobileHref = 'tel:+905322435522';
  const siteUrl = seoSettings.baseUrl.replace(/\/$/, '');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.name || !formData.phone || !formData.email) return alert('Lütfen zorunlu alanları doldurunuz.');

    addMessage({
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toLocaleDateString('tr-TR'),
        read: false
    });

    setSuccess(true);
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <>
    <SeoHead
      title="İletişim"
      description="Ada Emlak ile telefon, e-posta veya iletişim formu üzerinden hızlıca iletişime geçin. Ofis adresi, çalışma saatleri ve konum bilgileri burada."
      keywords="ada emlak iletişim, bakırköy emlak ofisi, emlak danışmanı telefon, ada emlak adres"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'İletişim',
        description:
          'Ada Emlak iletişim bilgileri, ofis adresi, telefon ve iletişim formunu içeren sayfa.',
      }}
    />
    <div className="container mx-auto max-w-[1320px] px-4 py-8">
       {/* Breadcrumb */}
       <div className="flex items-center text-xs text-gray-500 mb-6 font-sans uppercase tracking-wider">
          <Link to="/" className="hover:text-gold-500 transition-colors">Ana Sayfa</Link> 
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gold-500 font-bold">İletişim</span>
       </div>

       <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN - MAIN CONTENT */}
          <div className="w-full lg:w-[70%]">
             
             {/* Header Section */}
             <div className="mb-6 overflow-hidden rounded-[24px] border border-[#ece6d9] bg-[linear-gradient(135deg,#fffdfa_0%,#f6f1e7_100%)] p-7 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-600">Bizimle İletişime Geçin</div>
                        <h1 className="mt-3 text-[#2c2c2c] font-serif font-bold text-3xl md:text-[40px] leading-tight">
                           İletişim
                        </h1>
                        <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-[#667085]">
                           Satılık ve kiralık portföylerimiz hakkında bilgi almak, randevu oluşturmak veya yatırım sürecinizi birlikte planlamak için bize ulaşabilirsiniz.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 md:min-w-[320px]">
                        <a
                            href={directMobileHref}
                            className="rounded-[18px] border border-[#efe5d0] bg-white/90 px-4 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(217,162,26,0.12)]"
                        >
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a18d65]">Telefon</div>
                            <div className="mt-2 text-[24px] font-semibold leading-none tracking-tight text-[#2d3746]">{generalSettings.headerPhone}</div>
                        </a>
                        <a
                            href={`mailto:${generalSettings.contactEmail}`}
                            className="rounded-[18px] border border-[#efe5d0] bg-white/90 px-4 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(217,162,26,0.12)]"
                        >
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a18d65]">E-Posta</div>
                            <div className="mt-2 truncate text-[15px] font-semibold tracking-tight text-[#2d3746]">{generalSettings.contactEmail}</div>
                        </a>
                    </div>
                </div>
             </div>

             {/* Content */}
             <div className="rounded-[24px] border border-[#eceef2] bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                
                {/* Company Info Block */}
                <div className="mb-10">
                    <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#eef1f4] pb-4">
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-600">Ofis Bilgileri</div>
                            <h2 className="mt-2 text-2xl font-serif font-bold text-[#333]">{generalSettings.companyName}</h2>
                        </div>
                        <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-gold-50 text-gold-600 md:flex">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75L12 3l8.25 6.75v9a2.25 2.25 0 01-2.25 2.25h-12A2.25 2.25 0 013.75 18.75v-9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21v-6h4.5v6" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 font-sans">
                        <div className="rounded-[18px] border border-[#eef1f4] bg-[linear-gradient(180deg,#ffffff_0%,#fafbfd_100%)] p-5 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-500 shrink-0 border border-gold-100">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#a18d65] mb-1">Adres</span>
                                <p className="whitespace-pre-line leading-relaxed">{generalSettings.contactAddress}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[18px] border border-[#eef1f4] bg-[linear-gradient(180deg,#ffffff_0%,#fafbfd_100%)] p-5 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-500 shrink-0 border border-gold-100">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#a18d65] mb-1">Telefon & Fax</span>
                                <p>Tel: {generalSettings.contactPhone}</p>
                                <p>Fax: {generalSettings.contactFax}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[18px] border border-[#eef1f4] bg-[linear-gradient(180deg,#ffffff_0%,#fafbfd_100%)] p-5 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-500 shrink-0 border border-gold-100">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#a18d65] mb-1">E-Mail</span>
                                <p>{generalSettings.contactEmail}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[18px] border border-[#eef1f4] bg-[linear-gradient(180deg,#ffffff_0%,#fafbfd_100%)] p-5 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center text-gold-500 shrink-0 border border-gold-100">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                            </div>
                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#a18d65] mb-1">Web Site</span>
                                <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors">
                                    {siteUrl}/
                                </a>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>

                <div className="my-8 border-t border-[#eef1f4]"></div>

                {/* Contact Form */}
                <div className="mb-10">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <h3 className="text-lg font-serif font-bold text-[#333] flex items-center">
                            <svg className="w-5 h-5 text-gold-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            İletişim Formu
                        </h3>
                        <div className="hidden rounded-full bg-gold-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700 md:block">
                            Hızlı Dönüş
                        </div>
                    </div>
                    
                    {success && (
                        <div className="mb-4 flex items-center rounded-[14px] border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Mesajınız başarıyla gönderildi!
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4 rounded-[22px] border border-[#eef1f4] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-6 shadow-[0_12px_26px_rgba(15,23,42,0.04)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ad Soyad</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full rounded-[14px] border border-gray-200 bg-white p-3 text-sm outline-none transition-all focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/10" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefon</label>
                                <input 
                                    type="tel" 
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full rounded-[14px] border border-gray-200 bg-white p-3 text-sm outline-none transition-all focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/10" 
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-Mail</label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full rounded-[14px] border border-gray-200 bg-white p-3 text-sm outline-none transition-all focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/10" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Konu</label>
                                <input 
                                    type="text" 
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                    className="w-full rounded-[14px] border border-gray-200 bg-white p-3 text-sm outline-none transition-all focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/10" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mesajınız</label>
                            <textarea 
                                rows={5} 
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                                className="w-full resize-none rounded-[14px] border border-gray-200 bg-white p-3 text-sm outline-none transition-all focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/10"
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#d9a21a_0%,#f0bc3c_100%)] px-8 py-3 text-sm font-bold uppercase text-white shadow-[0_12px_24px_rgba(217,162,26,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(217,162,26,0.30)] group">
                                Gönder
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Map */}
                <div className="overflow-hidden rounded-[22px] border border-[#e7eaef] shadow-[0_16px_32px_rgba(15,23,42,0.06)]">
                    <div className="border-b border-[#eef1f4] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] px-5 py-4">
                        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-600">Harita</div>
                        <div className="mt-1 text-[18px] font-semibold tracking-tight text-[#2d3746]">Ofis Konumu</div>
                    </div>
                    <div className="w-full h-[350px] bg-gray-200">
                    <iframe 
                        src={generalSettings.mapEmbedUrl}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ada Emlak Konum"
                    ></iframe>
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

export default Contact;

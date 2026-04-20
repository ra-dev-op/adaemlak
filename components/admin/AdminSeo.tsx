import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { SeoSettings } from '../../types';

const AdminSeo: React.FC = () => {
  const { seoSettings, updateSeoSettings } = useData();
  
  // Initialize with fallback to prevent undefined errors if context is not yet ready
  const [formData, setFormData] = useState<SeoSettings>(() => seoSettings || {
    siteTitle: '',
    titleSeparator: '|',
    siteDescription: '',
    siteKeywords: '',
    baseUrl: '',
    faviconUrl: '',
    logoUrl: '',
    contactAddress: '',
    contactPhone: '',
    socialFacebook: '',
    socialInstagram: '',
    socialTwitter: '',
    robotsTxt: '',
    sitemapUrl: ''
  });
  
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'technical' | 'local'>('general');

  useEffect(() => {
    if (seoSettings) {
        setFormData(seoSettings);
    }
  }, [seoSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeoSettings(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Safety check to prevent rendering if formData is somehow still null
  if (!formData) return <div className="p-8 text-gray-500">Ayarlar yükleniyor...</div>;

  // SERP Preview Components - Defensive checks
  const fullTitle = `${formData.siteTitle || ''} ${formData.titleSeparator || ''} Gayrimenkul Yatırım Danışmanlığı`;
  const displayTitle = fullTitle.length > 60 ? fullTitle.substring(0, 57) + '...' : fullTitle;
  const desc = formData.siteDescription || '';
  const displayDesc = desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
  const displayUrl = (formData.baseUrl || 'https://www.adaemlak.com.tr') + ' › ...';

  return (
    <div>
        <h1 className="text-2xl font-serif font-bold text-gray-800 mb-8">SEO ve Site Ayarları</h1>

        {success && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded shadow-lg z-50 font-bold animate-pulse">
                SEO Ayarları Güncellendi!
            </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column - Tabs & Form */}
            <div className="w-full lg:w-2/3">
                
                {/* Tabs */}
                <div className="flex mb-6 border-b border-gray-200 bg-white rounded-t-sm shadow-sm">
                    <button type="button" onClick={() => setActiveTab('general')} className={`flex-1 py-4 font-bold text-sm uppercase tracking-wide border-b-2 transition-colors ${activeTab === 'general' ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Genel Ayarlar</button>
                    <button type="button" onClick={() => setActiveTab('local')} className={`flex-1 py-4 font-bold text-sm uppercase tracking-wide border-b-2 transition-colors ${activeTab === 'local' ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Kurumsal / Yerel SEO</button>
                    <button type="button" onClick={() => setActiveTab('social')} className={`flex-1 py-4 font-bold text-sm uppercase tracking-wide border-b-2 transition-colors ${activeTab === 'social' ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Sosyal Medya</button>
                    <button type="button" onClick={() => setActiveTab('technical')} className={`flex-1 py-4 font-bold text-sm uppercase tracking-wide border-b-2 transition-colors ${activeTab === 'technical' ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Teknik</button>
                </div>

                <div className="bg-white p-8 rounded-sm shadow-card min-h-[500px]">
                    
                    {/* GENERAL TAB */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Site Ana Başlığı (Title)</label>
                                    <input 
                                        type="text" 
                                        name="siteTitle"
                                        value={formData.siteTitle || ''}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ayraç</label>
                                    <select 
                                        name="titleSeparator" 
                                        value={formData.titleSeparator || '|'}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none text-center font-bold"
                                    >
                                        <option value="|">|</option>
                                        <option value="-">-</option>
                                        <option value="•">•</option>
                                        <option value="–">–</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Meta Açıklaması (Description)</label>
                                    <span className={`text-xs ${(formData.siteDescription?.length || 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {formData.siteDescription?.length || 0}/160
                                    </span>
                                </div>
                                <textarea 
                                    name="siteDescription"
                                    rows={3}
                                    value={formData.siteDescription || ''}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none" 
                                ></textarea>
                                <p className="text-[10px] text-gray-400 mt-1">Google arama sonuçlarında başlığın altında çıkan kısa açıklamadır.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Anahtar Kelimeler (Keywords)</label>
                                <input 
                                    type="text" 
                                    name="siteKeywords"
                                    value={formData.siteKeywords || ''}
                                    onChange={handleChange}
                                    placeholder="emlak, konut, satılık arsa..."
                                    className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none" 
                                />
                            </div>

                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Site Adresi (Canonical URL)</label>
                                <input 
                                    type="text" 
                                    name="baseUrl"
                                    value={formData.baseUrl || ''}
                                    onChange={handleChange}
                                    placeholder="https://www.adaemlak.com.tr"
                                    className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none" 
                                />
                            </div>
                        </div>
                    )}

                    {/* LOCAL SEO TAB */}
                    {activeTab === 'local' && (
                        <div className="space-y-6">
                            <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded border border-blue-100 mb-4">
                                Bu bilgiler Google Haritalar entegrasyonu ve Schema.org (Yapısal Veri) işaretlemesi için kullanılır.
                            </p>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Firma Logosu URL</label>
                                <input 
                                    type="text" 
                                    name="logoUrl"
                                    value={formData.logoUrl || ''}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none" 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Favicon URL</label>
                                <input 
                                    type="text" 
                                    name="faviconUrl"
                                    value={formData.faviconUrl || ''}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none" 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tam İletişim Adresi</label>
                                <textarea 
                                    name="contactAddress"
                                    rows={3}
                                    value={formData.contactAddress || ''}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none" 
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">İletişim Telefonu</label>
                                <input 
                                    type="text" 
                                    name="contactPhone"
                                    value={formData.contactPhone || ''}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none" 
                                />
                            </div>
                        </div>
                    )}

                    {/* SOCIAL TAB */}
                    {activeTab === 'social' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Facebook URL</label>
                                    <input 
                                        type="text" 
                                        name="socialFacebook"
                                        value={formData.socialFacebook || ''}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-300 p-2 rounded-sm text-gray-900 focus:border-gold-500 outline-none" 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-orange-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.073-4.947-.2-4.352-2.623-6.782-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Instagram URL</label>
                                    <input 
                                        type="text" 
                                        name="socialInstagram"
                                        value={formData.socialInstagram || ''}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-300 p-2 rounded-sm text-gray-900 focus:border-gold-500 outline-none" 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shadow-sm">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">X (Twitter) URL</label>
                                    <input 
                                        type="text" 
                                        name="socialTwitter"
                                        value={formData.socialTwitter || ''}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-300 p-2 rounded-sm text-gray-900 focus:border-gold-500 outline-none" 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TECHNICAL TAB */}
                    {activeTab === 'technical' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Robots.txt İçeriği</label>
                                <textarea 
                                    name="robotsTxt"
                                    rows={5}
                                    value={formData.robotsTxt || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 text-green-400 border border-gray-700 p-4 rounded-sm outline-none font-mono text-xs" 
                                ></textarea>
                                <p className="text-[10px] text-gray-400 mt-1">Arama motoru botlarının siteyi nasıl tarayacağını belirler.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sitemap URL (XML)</label>
                                <input 
                                    type="text" 
                                    name="sitemapUrl"
                                    value={formData.sitemapUrl || ''}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none font-mono text-sm" 
                                />
                            </div>
                        </div>
                    )}

                </div>
                
                <div className="mt-6 flex justify-end">
                    <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 px-8 rounded-sm uppercase shadow-md transition-colors">
                        Ayarları Kaydet
                    </button>
                </div>
            </div>

            {/* Right Column - Live Preview */}
            <div className="w-full lg:w-1/3 space-y-6">
                
                {/* Google Preview Card */}
                <div className="bg-white p-6 rounded-sm shadow-card border-t-4 border-blue-500">
                    <h3 className="text-gray-700 font-bold mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        Google Arama Sonucu Önizleme
                    </h3>
                    
                    <div className="bg-white p-4 rounded border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                                {formData.faviconUrl ? (
                                    <img src={formData.faviconUrl} alt="Favicon" className="w-4 h-4 object-contain" />
                                ) : (
                                    <span className="text-[8px]">LOGO</span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#202124] text-sm leading-none font-sans">{formData.siteTitle || 'Site Başlığı'}</span>
                                <span className="text-[#5f6368] text-xs leading-none mt-0.5">{displayUrl}</span>
                            </div>
                        </div>
                        <h4 className="text-[#1a0dab] text-xl font-sans hover:underline cursor-pointer leading-snug truncate">
                            {displayTitle}
                        </h4>
                        <p className="text-[#4d5156] text-sm mt-1 font-sans leading-relaxed">
                            {displayDesc}
                        </p>
                    </div>

                    <div className="mt-4 text-xs text-gray-400">
                        <p className="mb-1"><strong>Başlık Uzunluğu:</strong> {fullTitle.length} karakter (Önerilen: 50-60)</p>
                        <p><strong>Açıklama Uzunluğu:</strong> {desc.length} karakter (Önerilen: 150-160)</p>
                    </div>
                </div>

                {/* Quick Check List */}
                <div className="bg-white p-6 rounded-sm shadow-card">
                    <h3 className="text-gray-700 font-bold mb-4 uppercase text-xs tracking-wider">SEO Kontrol Listesi</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${formData.siteTitle ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            Site Başlığı
                        </li>
                        <li className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${formData.siteDescription ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            Meta Açıklama
                        </li>
                        <li className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${formData.faviconUrl ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            Favicon
                        </li>
                        <li className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${formData.robotsTxt ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            Robots.txt
                        </li>
                        <li className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${formData.contactAddress ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            Yerel Adres Verisi
                        </li>
                    </ul>
                </div>

            </div>
        </form>
    </div>
  );
};

export default AdminSeo;
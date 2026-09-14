import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

const AdminGoogle: React.FC = () => {
  const { googleSettings, updateGoogleSettings } = useData();
  const [formData, setFormData] = useState(googleSettings);
  const [success, setSuccess] = useState(false);

  // Sync state if context changes (e.g. initial load)
  useEffect(() => {
    setFormData(googleSettings);
  }, [googleSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoogleSettings(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div>
        <h1 className="text-2xl font-serif font-bold text-gray-800 mb-8">Google Entegrasyonları</h1>

        {success && (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 text-sm font-bold shadow-sm flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Ayarlar başarıyla kaydedildi.
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Google Analytics Section */}
            <div className="bg-white p-8 rounded-sm shadow-card border-t-4 border-[#E37400]">
                <div className="flex items-center mb-6">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Google_Analytics_logo.svg/1200px-Google_Analytics_logo.svg.png" alt="Analytics" className="h-8 mr-3" />
                    <h2 className="text-lg font-bold text-gray-700">Google Analytics</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ölçüm / Analytics Kimliği</label>
                        <input 
                            type="text" 
                            name="analyticsId"
                            value={formData.analyticsId}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none transition-all placeholder-gray-400 font-mono text-sm" 
                            placeholder="G-XXXXXXXXXX veya UA-XXXXXXXX-X"
                        />
                        <p className="text-[11px] text-gray-400 mt-2">
                            Mevcut eski siteden alınan Universal Analytics kimliği: <span className="font-bold">UA-28215240-1</span>. Yeni GA4 için "G-" ile başlayan kimlik de girilebilir.
                        </p>
                    </div>
                </div>
            </div>

            {/* Google Tag Manager Section */}
            <div className="bg-white p-8 rounded-sm shadow-card border-t-4 border-[#246FDB]">
                <div className="flex items-center mb-6">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#246FDB] text-white font-bold rounded-full mr-3 text-sm">
                        GTM
                    </div>
                    <h2 className="text-lg font-bold text-gray-700">Google Tag Manager</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Container ID</label>
                        <input
                            type="text"
                            name="tagManagerId"
                            value={formData.tagManagerId || ''}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none transition-all placeholder-gray-400 font-mono text-sm"
                            placeholder="GTM-XXXXXXX"
                        />
                        <p className="text-[11px] text-gray-400 mt-2">
                            Mevcut canlı sitede GTM kodu görünmüyor. İleride Tag Manager container ID alınırsa bu alana girilebilir.
                        </p>
                    </div>
                </div>
            </div>

            {/* Google Search Console Section */}
            <div className="bg-white p-8 rounded-sm shadow-card border-t-4 border-[#4285F4]">
                <div className="flex items-center mb-6">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#4285F4] text-white font-bold rounded-full mr-3 text-lg">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-700">Google Search Console</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Doğrulama Kodu (HTML Meta Etiketi)</label>
                        <textarea 
                            name="searchConsoleMeta"
                            value={formData.searchConsoleMeta}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none transition-all placeholder-gray-400 font-mono text-xs" 
                            placeholder='<meta name="google-site-verification" content="..." />'
                        ></textarea>
                         <p className="text-[11px] text-gray-400 mt-2">
                            Search Console mülk doğrulama yöntemlerinden <span className="font-bold">HTML Etiketi</span> seçeneğini seçin ve verilen meta etiketini buraya yapıştırın.
                        </p>
                    </div>
                </div>
            </div>

            {/* Google Ads Section */}
            <div className="bg-white p-8 rounded-sm shadow-card border-t-4 border-[#34A853]">
                <div className="flex items-center mb-6">
                     <div className="w-8 h-8 flex items-center justify-center bg-[#34A853] text-white font-bold rounded-full mr-3 text-lg">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M21.35 11.5h-8.7v-2h8.7V7h-8.7V5h8.7V3h-10c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10v-2h-10v-7.5h10v-2z"/></svg>
                     </div>
                    <h2 className="text-lg font-bold text-gray-700">Google Ads (AdWords)</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Dönüşüm Kimliği (Conversion ID)</label>
                        <input 
                            type="text" 
                            name="adsConversionId"
                            value={formData.adsConversionId}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none transition-all placeholder-gray-400 font-mono text-sm" 
                            placeholder="AW-XXXXXXXXXX"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Dönüşüm Etiketi (Conversion Label)</label>
                        <input 
                            type="text" 
                            name="adsLabel"
                            value={formData.adsLabel}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 p-3 rounded-sm text-gray-900 focus:border-gold-500 outline-none transition-all placeholder-gray-400 font-mono text-sm" 
                            placeholder="AbC_xYz123"
                        />
                    </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-4">
                    Bu bilgiler Google Ads panelinizdeki <span className="font-bold">Araçlar {'>'} Ölçüm {'>'} Dönüşümler</span> bölümünden alınabilir.
                </p>
            </div>

            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 px-10 rounded-sm uppercase shadow-md transition-colors text-sm">
                    Ayarları Kaydet
                </button>
            </div>
        </form>
    </div>
  );
};

export default AdminGoogle;

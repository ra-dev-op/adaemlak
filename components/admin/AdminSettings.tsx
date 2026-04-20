
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { GeneralSettings } from '../../types';

const AdminSettings: React.FC = () => {
  const { generalSettings, updateGeneralSettings } = useData();
  
  // Safe initialization
  const [formData, setFormData] = useState<GeneralSettings>(() => generalSettings || {
    companyName: '',
    headerPhone: '',
    footerText: '',
    contactEmail: '',
    contactAddress: '',
    contactPhone: '',
    contactFax: '',
    mapEmbedUrl: '',
    workingHours: '',
    chamberName: '',
    chamberRegistrationNo: '',
    mersisNo: ''
  });
  
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (generalSettings) {
        setFormData(generalSettings);
    }
  }, [generalSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGeneralSettings(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!formData) return <div className="p-8">Ayarlar yükleniyor...</div>;

  const SettingInput = ({ label, name, value, onChange, placeholder }: any) => (
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
        <input 
            type="text" 
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-white border border-gray-300 rounded-md p-2.5 text-sm text-gray-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all placeholder-gray-400" 
        />
      </div>
  );

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Genel Site Ayarları</h1>
            <p className="text-gray-500 text-sm mt-1">Firma bilgileri, iletişim detayları ve temel yapılandırma.</p>
        </div>

        {success && (
            <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-bold animate-pulse flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Ayarlar Güncellendi!
            </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Site Identity & Basic Info */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200/60">
                <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Kurumsal Kimlik</h2>
                </div>
                
                <div className="space-y-6">
                    <SettingInput label="Firma Tam Unvanı" name="companyName" value={formData.companyName} onChange={handleChange} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <SettingInput label="Header Telefon" name="headerPhone" value={formData.headerPhone} onChange={handleChange} placeholder="44 44 232" />
                        <SettingInput label="Footer Metni" name="footerText" value={formData.footerText} onChange={handleChange} placeholder="COPYRIGHT 2026..." />
                    </div>

                    <SettingInput label="Çalışma Saatleri" name="workingHours" value={formData.workingHours} onChange={handleChange} />
                </div>
            </div>

            {/* Corporate Information (NEW) */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200/60">
                 <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Kurumsal Bilgiler (Yasal)</h2>
                 </div>
                 
                 <div className="space-y-6">
                    <SettingInput 
                        label="Ticaret Odası" 
                        name="chamberName" 
                        value={formData.chamberName} 
                        onChange={handleChange} 
                        placeholder="Örn: İSTANBUL TİCARET ODASI"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <SettingInput 
                            label="Sicil No" 
                            name="chamberRegistrationNo" 
                            value={formData.chamberRegistrationNo} 
                            onChange={handleChange} 
                        />
                        <SettingInput 
                            label="MERSİS No" 
                            name="mersisNo" 
                            value={formData.mersisNo} 
                            onChange={handleChange} 
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 italic">
                        * Bu bilgiler yasal zorunluluk gereği web sitesinin alt kısmında (Footer) gösterilir. Boş bırakılırsa ilgili alan gizlenir.
                    </p>
                 </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200/60">
                 <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">İletişim Bilgileri</h2>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Açık Adres</label>
                        <textarea 
                            name="contactAddress"
                            rows={3}
                            value={formData.contactAddress}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-md p-3 text-sm text-gray-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all resize-none" 
                        ></textarea>
                    </div>

                    <SettingInput label="Resmi E-Posta" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />

                    <div className="grid grid-cols-2 gap-4">
                        <SettingInput label="Sabit Telefon" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
                        <SettingInput label="Fax" name="contactFax" value={formData.contactFax} onChange={handleChange} />
                    </div>
                 </div>
            </div>

            {/* Map Configuration */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200/60">
                <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">Google Harita Entegrasyonu</h2>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Harita Embed Kodu (URL)</label>
                        <input 
                            type="text" 
                            name="mapEmbedUrl"
                            value={formData.mapEmbedUrl}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 rounded-md p-3 text-sm text-gray-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none font-mono" 
                        />
                         <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Google Maps üzerinden "Haritayı Paylaş" {'>'} "Haritayı Yerleştir" seçeneğindeki iframe src kısmını buraya yapıştırın.
                        </p>
                    </div>
                    
                    {/* Map Preview */}
                    <div className="mt-4 bg-gray-50 p-1 rounded-md border border-gray-200">
                        <div className="w-full h-48 bg-gray-200 rounded overflow-hidden">
                             {formData.mapEmbedUrl ? (
                                <iframe 
                                    src={formData.mapEmbedUrl} 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen 
                                    loading="lazy"
                                    title="Map Preview"
                                ></iframe>
                             ) : (
                                 <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                     <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                     <span className="text-sm font-medium">Harita Yüklenemedi</span>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 flex justify-end mt-4">
                <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 px-12 rounded-md uppercase shadow-sm hover:shadow-md transition-all text-sm tracking-wide">
                    Değişiklikleri Kaydet
                </button>
            </div>

        </form>
    </div>
  );
};

export default AdminSettings;

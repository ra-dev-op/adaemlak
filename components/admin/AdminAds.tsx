
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

const AdminAds: React.FC = () => {
  const { adSettings, updateAdSettings } = useData();
  const [formData, setFormData] = useState(adSettings);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(adSettings);
  }, [adSettings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validation
      if (file.type !== 'image/png') {
        setError('Sadece PNG formatında görseller yüklenebilir.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
        setError('Dosya boyutu 2MB üzerinde olamaz.');
        return;
      }

      // Convert to Base64 for demo purposes (Backend would upload to disk)
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, imageUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: null }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.isActive && !formData.imageUrl) {
        setError('Reklamı aktifleştirmek için önce bir görsel yüklemelisiniz.');
        return;
    }
    updateAdSettings(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reklam Yönetimi</h1>
            <p className="text-gray-500 text-sm mt-1">Ana sayfa sağ sütun reklam alanı yönetimi.</p>
        </div>

        {success && (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm font-bold shadow-sm flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Reklam ayarları güncellendi.
            </div>
        )}

        {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-bold shadow-sm flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
            </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200/60 max-w-3xl">
            <form onSubmit={handleSave} className="space-y-8">
                
                {/* Activation Toggle */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                    <div>
                        <h3 className="text-gray-800 font-bold">Reklam Durumu</h3>
                        <p className="text-xs text-gray-500 mt-1">Aktif edildiğinde ana sayfada görünür olacaktır.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">{formData.isActive ? 'Yayında' : 'Pasif'}</span>
                    </label>
                </div>

                {/* Image Upload Area */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Reklam Görseli (PNG)</label>
                    
                    {formData.imageUrl ? (
                        <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-gray-200 group">
                            <img src={formData.imageUrl} alt="Reklam Önizleme" className="w-full h-auto object-contain" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    type="button" 
                                    onClick={handleRemoveImage}
                                    className="bg-red-500 text-white px-4 py-2 rounded shadow text-xs font-bold hover:bg-red-600 transition-colors"
                                >
                                    Görseli Sil
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center w-full">
                            <label className="flex flex-col justify-center items-center w-full h-48 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                    <svg className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Yüklemek için tıklayın</span></p>
                                    <p className="text-xs text-gray-500">Sadece PNG (Max. 2MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/png" onChange={handleFileChange} />
                            </label>
                        </div>
                    )}
                </div>

                {/* Link Input */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Yönlendirme Linki (Opsiyonel)</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        </span>
                        <input 
                            type="text" 
                            className="w-full bg-white border border-gray-300 rounded-md py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition-all placeholder-gray-400" 
                            placeholder="https://..."
                            value={formData.linkUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 px-10 rounded-md uppercase shadow-sm hover:shadow transition-colors text-sm tracking-wide">
                        Kaydet
                    </button>
                </div>

            </form>
        </div>
    </div>
  );
};

export default AdminAds;

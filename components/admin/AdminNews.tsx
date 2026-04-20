import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { NewsItem } from '../../types';

const AdminNews: React.FC = () => {
  const { news, addNews, deleteNews } = useData();
  const [showForm, setShowForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Advanced Form State
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    imageUrl: '', // Will hold Base64 string
    metaDescription: '',
    keywords: '',
    status: 'published',
    author: 'Admin'
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Helper: Slug Generator
  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  };

  // Effect: Auto-update slug when title changes (unless manually edited)
  useEffect(() => {
    if (!slugManuallyEdited && formData.title) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.title || '') }));
    }
  }, [formData.title, slugManuallyEdited]);

  // Process image to add Banner
  const processImageWithBanner = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Canvas error');

                canvas.width = img.width;
                canvas.height = img.height;

                // 1. Draw Original Image
                ctx.drawImage(img, 0, 0);

                // --- BANNER LOGIC ---
                // Banner Height: 15% of image width (responsive standard)
                const bannerHeight = img.width * 0.15; 
                const bannerBgColor = '#FFC72C'; // Standard Gold

                // 2. Draw Banner Background
                ctx.fillStyle = bannerBgColor;
                ctx.fillRect(0, 0, img.width, bannerHeight);

                // Scale factor for elements inside banner based on banner height
                // Standard height reference ~150px
                const scale = bannerHeight / 150; 

                // 3. Draw Left Skyline Silhouette (Simplified geometric approach)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; // Semi-transparent white
                ctx.beginPath();
                ctx.moveTo(0, bannerHeight);
                // Building 1 (Left low)
                ctx.lineTo(0, bannerHeight * 0.7);
                ctx.lineTo(img.width * 0.05, bannerHeight * 0.65);
                ctx.lineTo(img.width * 0.08, bannerHeight * 0.7);
                // Building 2 (Tall)
                ctx.lineTo(img.width * 0.08, bannerHeight * 0.4);
                ctx.lineTo(img.width * 0.12, bannerHeight * 0.35); // Roof
                ctx.lineTo(img.width * 0.16, bannerHeight * 0.4);
                ctx.lineTo(img.width * 0.16, bannerHeight * 0.75);
                // Building 3 (Wide)
                ctx.lineTo(img.width * 0.20, bannerHeight * 0.5);
                ctx.lineTo(img.width * 0.35, bannerHeight * 0.55);
                ctx.lineTo(img.width * 0.35, bannerHeight);
                ctx.fill();

                // 4. Draw Right Side Logo Text "ADA EMLAK"
                // Right padding
                const rightPadding = img.width * 0.05;
                const textX = img.width - rightPadding;
                const textCenterY = bannerHeight * 0.45;

                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                
                // "ADA" Text
                ctx.fillStyle = 'white';
                ctx.font = `bold ${60 * scale}px Arial, sans-serif`;
                ctx.fillText("ADA", textX, textCenterY);

                // "EMLAK" Text (Below ADA)
                ctx.font = `normal ${24 * scale}px Arial, sans-serif`;
                ctx.fillText("EMLAK", textX, textCenterY + (45 * scale));

                // House Icon (Simplified next to text)
                const houseSize = 60 * scale;
                const houseX = textX - (ctx.measureText("ADA").width * 1.5) - (20 * scale);
                const houseY = textCenterY - (30 * scale);
                
                ctx.lineWidth = 3 * scale;
                ctx.strokeStyle = 'white';
                ctx.beginPath();
                ctx.moveTo(houseX, houseY + houseSize);
                ctx.lineTo(houseX, houseY + (houseSize * 0.4));
                ctx.lineTo(houseX + (houseSize/2), houseY);
                ctx.lineTo(houseX + houseSize, houseY + (houseSize * 0.4));
                ctx.lineTo(houseX + houseSize, houseY + houseSize);
                ctx.stroke();

                resolve(canvas.toDataURL('image/jpeg', 0.90));
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setIsProcessing(true);
        const file = e.target.files[0];
        try {
            const processedImage = await processImageWithBanner(file);
            setFormData(prev => ({ ...prev, imageUrl: processedImage }));
        } catch (error) {
            console.error("Image processing failed", error);
            alert("Resim işlenirken bir hata oluştu.");
        }
        setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert('Başlık zorunludur.');
    if (!formData.imageUrl) return alert('Lütfen bir görsel yükleyiniz.');

    const newItem: NewsItem = {
        id: Date.now().toString(),
        title: formData.title || '',
        slug: formData.slug || generateSlug(formData.title),
        summary: formData.summary || '',
        content: formData.content || '',
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        imageUrl: formData.imageUrl || '',
        metaDescription: formData.metaDescription || formData.summary?.substring(0, 160),
        keywords: formData.keywords,
        status: formData.status as 'published' | 'draft',
        author: formData.author
    };

    addNews(newItem);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ 
        title: '', 
        slug: '', 
        summary: '', 
        content: '', 
        imageUrl: '', 
        metaDescription: '', 
        keywords: '',
        status: 'published',
        author: 'Admin'
    });
    setSlugManuallyEdited(false);
  };

  // Mock Toolbar for Rich Text Editor
  const EditorToolbar = () => (
    <div className="flex gap-1 border-b border-gray-200 p-2 bg-gray-50 rounded-t-sm items-center">
        <button type="button" className="p-1 hover:bg-gray-200 rounded font-bold text-gray-600 w-8 flex justify-center">B</button>
        <button type="button" className="p-1 hover:bg-gray-200 rounded italic text-gray-600 w-8 flex justify-center">I</button>
        <button type="button" className="p-1 hover:bg-gray-200 rounded underline text-gray-600 w-8 flex justify-center">U</button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600 w-8 flex justify-center text-xs font-bold">H1</button>
        <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600 w-8 flex justify-center text-xs font-bold">H2</button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600 w-8 flex justify-center" title="Bağlantı Ekle">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
        </button>
        <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-600 w-8 flex justify-center" title="Resim Ekle">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
        </button>
    </div>
  );

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-serif font-bold text-gray-800">
                {showForm ? 'Yeni Yazı Ekle' : 'Haber & Blog Yönetimi'}
            </h1>
            <button 
                onClick={() => { setShowForm(!showForm); if(showForm) resetForm(); }} 
                className={`px-4 py-2 rounded-sm text-sm font-bold uppercase transition-colors shadow-sm flex items-center gap-2 ${showForm ? 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50' : 'bg-gold-500 hover:bg-gold-600 text-white'}`}
            >
                {showForm ? (
                    <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Listeye Dön
                    </>
                ) : (
                    <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Yeni Yazı Ekle
                    </>
                )}
            </button>
        </div>

        {showForm ? (
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
                
                {/* LEFT COLUMN: Main Content */}
                <div className="w-full lg:w-3/4 space-y-6">
                    
                    {/* Title Input */}
                    <div className="bg-white p-6 rounded-sm shadow-card">
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Yazı Başlığı</label>
                            <input 
                                type="text" 
                                className="w-full bg-white border border-gray-300 p-3 rounded-sm text-lg font-bold text-gray-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all placeholder-gray-400" 
                                placeholder="Başlık giriniz..."
                                value={formData.title} 
                                onChange={e => setFormData({...formData, title: e.target.value})} 
                            />
                        </div>
                        
                        {/* Slug Preview */}
                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
                            <span className="text-gray-400 mr-1">Permalink:</span>
                            <span className="text-gray-400">https://adaemlak.com.tr/haberler/</span>
                            <input 
                                type="text" 
                                className="bg-transparent border-b border-dashed border-gray-400 text-gray-700 font-medium outline-none ml-1 focus:border-gold-500 focus:text-gold-600 w-full"
                                value={formData.slug}
                                onChange={e => {
                                    setFormData({...formData, slug: e.target.value});
                                    setSlugManuallyEdited(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="bg-white rounded-sm shadow-card flex flex-col h-[500px]">
                         <EditorToolbar />
                         <textarea 
                            className="flex-1 w-full bg-white p-4 outline-none resize-none font-sans text-gray-900 leading-relaxed placeholder-gray-400" 
                            placeholder="İçeriğinizi buraya yazmaya başlayın..."
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                         ></textarea>
                    </div>

                    {/* Excerpt / Summary */}
                    <div className="bg-white p-6 rounded-sm shadow-card">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Özet (Excerpt)</label>
                        <p className="text-[11px] text-gray-400 mb-2">Yazı listelerinde görünecek kısa açıklama.</p>
                        <textarea 
                            className="w-full bg-white border border-gray-300 p-3 rounded-sm outline-none focus:border-gold-500 h-24 text-sm text-gray-900 placeholder-gray-400"
                            value={formData.summary}
                            onChange={e => setFormData({...formData, summary: e.target.value})}
                        ></textarea>
                    </div>
                    
                    {/* SEO Settings */}
                    <div className="bg-white p-6 rounded-sm shadow-card border-l-4 border-blue-500">
                        <h3 className="font-bold text-gray-700 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            SEO Ayarları
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meta Açıklama (Description)</label>
                                    <span className={`text-xs ${(formData.metaDescription?.length || 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {formData.metaDescription?.length || 0}/160
                                    </span>
                                </div>
                                <textarea 
                                    className="w-full bg-white border border-gray-300 p-2 rounded-sm outline-none focus:border-blue-500 text-sm h-20 text-gray-900 placeholder-gray-400"
                                    placeholder="Arama motorlarında görünecek açıklama..."
                                    value={formData.metaDescription}
                                    onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                                ></textarea>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Anahtar Kelimeler (Keywords)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-white border border-gray-300 p-2 rounded-sm outline-none focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                                    placeholder="Virgül ile ayırarak yazınız (örn: emlak, yatırım, pendik)"
                                    value={formData.keywords}
                                    onChange={e => setFormData({...formData, keywords: e.target.value})}
                                />
                            </div>

                            {/* SEO Preview */}
                            <div className="bg-gray-50 p-4 rounded border border-gray-200 mt-2">
                                <div className="text-xs text-gray-400 mb-1">Google Önizleme</div>
                                <div className="text-blue-700 text-lg leading-tight hover:underline cursor-pointer truncate font-medium">
                                    {formData.title || 'Sayfa Başlığı'}
                                </div>
                                <div className="text-green-700 text-xs my-0.5">
                                    https://adaemlak.com.tr/blog/{formData.slug || 'ornek-yazi-linki'}
                                </div>
                                <div className="text-gray-600 text-sm leading-snug line-clamp-2">
                                    {formData.metaDescription || formData.summary || 'Sayfa açıklaması burada görünecektir. Bu alan kullanıcıların arama sonuçlarında göreceği metindir.'}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Sidebar Settings */}
                <div className="w-full lg:w-1/4 space-y-6">
                    
                    {/* Publish Box */}
                    <div className="bg-white p-5 rounded-sm shadow-card border-t-2 border-gold-500">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2 text-sm uppercase">Yayımla</h3>
                        
                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Durum:</span>
                                <select 
                                    className="bg-white border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-gold-500 text-gray-900"
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                                >
                                    <option value="published">Yayında</option>
                                    <option value="draft">Taslak</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Yazar:</span>
                                <span className="font-medium text-gray-800">{formData.author}</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-2.5 rounded-sm uppercase text-sm shadow-sm transition-transform active:scale-95"
                        >
                            {formData.status === 'draft' ? 'Taslak Olarak Kaydet' : 'Yayımla / Güncelle'}
                        </button>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white p-5 rounded-sm shadow-card">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2 text-sm uppercase">Öne Çıkan Görsel</h3>
                        
                        <div className="mb-3">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Görsel Yükle (Otomatik Banner)</label>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="w-full bg-white border border-gray-300 p-2 rounded-sm text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-gold-500 file:text-white hover:file:bg-gold-600"
                                    disabled={isProcessing}
                                />
                                {isProcessing && <span className="text-xs text-gold-500 font-bold absolute right-2 top-2">İşleniyor...</span>}
                            </div>
                        </div>

                        <div className="w-full aspect-video bg-gray-100 rounded-sm overflow-hidden border border-gray-200 flex items-center justify-center relative group">
                            {formData.imageUrl ? (
                                <>
                                <img src={formData.imageUrl} alt="Önizleme" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs hidden group-hover:flex items-center justify-center">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                </>
                            ) : (
                                <span className="text-gray-400 text-xs">Görsel Yok</span>
                            )}
                        </div>
                    </div>

                    {/* Categories / Tags (Simple Mock) */}
                    <div className="bg-white p-5 rounded-sm shadow-card">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2 text-sm uppercase">Kategoriler</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {['Genel', 'Emlak Piyasası', 'Yatırım', 'Tapu İşlemleri', 'Kentsel Dönüşüm'].map((cat, idx) => (
                                <label key={idx} className="flex items-center text-sm text-gray-600 hover:text-gold-500 cursor-pointer">
                                    <input type="checkbox" className="mr-2 rounded border-gray-300 text-gold-500 focus:ring-gold-500 bg-white" />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                </div>
            </form>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map(n => (
                    <div key={n.id} className="bg-white shadow-card rounded-sm overflow-hidden group border border-gray-100 flex flex-col h-full">
                        <div className="h-48 overflow-hidden relative">
                            <img src={n.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {n.status === 'draft' && (
                                <div className="absolute top-2 right-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Taslak</div>
                            )}
                            {n.status === 'published' && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">Yayında</div>
                            )}
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                            <div className="text-xs text-gold-500 font-bold mb-2 uppercase tracking-wide">{n.date}</div>
                            <h3 className="font-bold text-gray-800 mb-3 text-lg leading-tight">{n.title}</h3>
                            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xs text-gray-400">{n.author || 'Admin'}</span>
                                <div className="flex gap-2">
                                    <button className="text-blue-500 hover:text-blue-700 text-xs font-bold uppercase">Düzenle</button>
                                    <button onClick={() => deleteNews(n.id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase">Sil</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default AdminNews;

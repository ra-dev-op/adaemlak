
import React from 'react';
import { Link } from 'react-router-dom';
import CompanyCard from './CompanyCard';
import SeoHead from './SeoHead';

const About: React.FC = () => {
  return (
    <>
    <SeoHead
      title="Hakkımızda"
      description="Ada Emlak'ın kurumsal yaklaşımını, gayrimenkul danışmanlığı anlayışını ve yatırım süreçlerine bakışını yakından inceleyin."
      keywords="ada emlak hakkında, gayrimenkul danışmanlığı, istanbul emlak şirketi, kurumsal emlak firması"
      schema={{
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'Hakkımızda',
        description:
          'Ada Emlak kurumsal yaklaşımı, hizmet anlayışı ve yatırım süreçlerine bakışını anlatan sayfa.',
      }}
    />
    <div className="container mx-auto max-w-[1320px] px-4 py-8">
       {/* Breadcrumb */}
       <div className="flex items-center text-xs text-gray-500 mb-6 font-sans uppercase tracking-wider">
          <Link to="/" className="hover:text-gold-500 transition-colors">Ana Sayfa</Link> 
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gold-500 font-bold">Hakkımızda</span>
       </div>

       <div className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT COLUMN - MAIN CONTENT */}
          <div className="w-full lg:w-[70%]">
             
             {/* Header Section */}
             <div className="mb-6 pb-2 border-b border-gray-200">
                <h1 className="text-[#2c2c2c] font-serif font-bold text-2xl md:text-3xl leading-tight mb-2">
                   Hakkımızda
                </h1>
                <div className="w-20 h-1 bg-gold-500 rounded-full mt-2"></div>
             </div>

             {/* Content */}
             <div className="bg-white p-8 shadow-card rounded-sm border border-gray-100">
                <div className="text-gray-600 font-sans leading-loose text-[15px] space-y-6 text-justify">
                    <p>
                        <strong className="text-gray-800">1990 yılında</strong> gayrimenkul aracılığı yapmak için sektöre adım attığımızda, şirketimize bir anayasa hazırladık. 25 yıldır bu anayasaya sadık kalarak hizmet veren şirketimiz, gayrimenkul alım-satımına ve kiralama operasyonlarına aracılık etmeye devam ediyor.
                    </p>
                    
                    <p>
                        Kurulduğumuz günden bu yana hiçbir zaman satış kaygısıyla hareket etmedik. Müşterilerimize gerektiğinde <span className="italic text-gray-800 font-semibold">“Bu gayrimenkulü alma”</span> ya da <span className="italic text-gray-800 font-semibold">“Bu gayrimenkulü satma”</span> demekten bir an olsun çekinmedik. Bu felsefeyle hareket etmeye de devam ediyoruz.
                    </p>

                    <div className="bg-gray-50 p-6 border-l-4 border-gold-500 my-8 italic text-gray-700 font-serif text-lg">
                        "Gayrimenkul, ihtiyaç ya da yatırım olarak değerlendirilebilecek bir kıymettir. Ömrünüzde alıcı veya satıcı olarak kaç defa gayrimenkul alır ya da satarsınız?"
                    </div>

                    <p>
                        Ya da alım-satım işleminde alacağınız yanlış bir kararın telafisi ne kadar kolay olur? Gayrimenkul alım-satımı yapmak, sonrasında alıcıyı ve/veya satıcıyı sorumlu kılacak birtakım mali sonuçları, üzüntü veya mutluluğu beraberinde getirir. Paranızı ya da malınızı, bazen de her ikisini zarara uğratma riskiyle karşı karşıya kalabilirsiniz. Bundan dolayı; nasıl iyi bir doktor, avukat, mali danışman size büyük bir fayda sağlıyorsa, iyi bir emlakçınızın olması da aynı şekilde faydalı olacaktır.
                    </p>

                    <p>
                        <span className="text-gold-500 font-bold">Ada Emlak</span> için en önemli günlerden biri, bir tapu devir-teslim işleminin ertesi günüdür. O gün yapacağınız kahvaltının mutlu ve keyifli geçmesi için işimizi büyük bir özveri ve titizlikle yerine getiriyoruz.
                    </p>

                    {/* Video Embed */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="relative w-full pb-[56.25%] h-0 rounded-sm overflow-hidden shadow-sm bg-black">
                            <iframe 
                                className="absolute top-0 left-0 w-full h-full"
                                src="https://www.youtube.com/embed/QFGPOg9FDm0" 
                                title="Ada Emlak Tanıtım Filmi" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                loading="lazy"
                                allowFullScreen
                            ></iframe>
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

export default About;

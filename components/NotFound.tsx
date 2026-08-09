import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from './SeoHead';

const NotFound: React.FC = () => (
  <>
    <SeoHead
      title="Sayfa Bulunamadı"
      description="Aradığınız sayfa bulunamadı. Ada Emlak güncel portföylerini ve iletişim bilgilerini ana sayfadan inceleyebilirsiniz."
      noIndex
    />
    <div className="container mx-auto max-w-[900px] px-4 py-16 text-center">
      <div className="rounded-[28px] border border-[#ece8dd] bg-white px-6 py-12 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
        <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-600">404</div>
        <h1 className="mt-3 text-3xl font-serif font-bold leading-tight text-[#2c2c2c] md:text-[40px]">
          Sayfa Bulunamadı
        </h1>
        <p className="mx-auto mt-4 max-w-[560px] text-[15px] leading-7 text-[#667085]">
          Bu bağlantı taşınmış veya artık kullanımda olmayabilir. Güncel Ada Emlak portföylerine ana sayfadan ulaşabilirsiniz.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex rounded-full bg-gold-500 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_26px_rgba(217,162,26,0.24)] transition hover:bg-gold-600"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  </>
);

export default NotFound;

import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import CompanyCard from './CompanyCard';
import SidebarItem from './SidebarItem';
import SeoHead from './SeoHead';

const BlogDetail: React.FC = () => {
  const { slug } = useParams();
  const { news, sidebarListings, seoSettings } = useData();

  const article = news.find((item) => item.slug === slug);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = news.filter((item) => item.id !== article.id).slice(0, 3);
  const canonicalUrl = `${seoSettings.baseUrl.replace(/\/$/, '')}/blog/${article.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription || article.summary,
    image: article.imageUrl,
    author: {
      '@type': 'Organization',
      name: article.author || seoSettings.siteTitle,
    },
    publisher: {
      '@type': 'Organization',
      name: seoSettings.siteTitle,
      logo: {
        '@type': 'ImageObject',
        url: seoSettings.logoUrl,
      },
    },
    mainEntityOfPage: canonicalUrl,
    datePublished: article.publishedDateIso,
    dateModified: article.publishedDateIso,
  };

  return (
    <>
      <SeoHead
        title={article.title}
        description={article.metaDescription || article.summary}
        keywords={article.keywords}
        image={article.imageUrl}
        type="article"
        canonicalUrl={canonicalUrl}
        schema={articleSchema}
      />

      <div className="container mx-auto max-w-[1320px] px-4 py-8">
        <div className="mb-6 flex items-center text-xs font-sans uppercase tracking-wider text-gray-500">
          <Link to="/" className="transition-colors hover:text-gold-500">Ana Sayfa</Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link to="/blog" className="transition-colors hover:text-gold-500">Haberler</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="font-bold text-gold-500">{article.title}</span>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="w-full lg:w-[66%]">
            <article className="overflow-hidden rounded-[24px] border border-[#eceef2] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              <div className="border-b border-[#eff2f5] bg-[linear-gradient(135deg,#fffdfa_0%,#f7f1e6_100%)] px-6 py-8 md:px-8">
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-600">
                  <span>{article.date}</span>
                  <span className="text-[#d4d8df]">|</span>
                  <span>{article.author || 'Ada Emlak'}</span>
                </div>
                <h1 className="mt-4 max-w-[900px] text-3xl font-serif font-bold leading-tight text-[#2c2c2c] md:text-[42px]">
                  {article.title}
                </h1>
                <p className="mt-4 max-w-[820px] text-[16px] leading-8 text-[#667085]">
                  {article.summary}
                </p>
              </div>

              <div className="px-6 py-6 md:px-8">
                <div className="overflow-hidden rounded-[22px] border border-[#edf0f4] shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
                  <img src={article.imageUrl} alt={article.title} className="h-[280px] w-full object-cover md:h-[420px]" decoding="async" />
                </div>

                <div className="mt-8 rounded-[22px] border border-[#eef1f4] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] px-6 py-7 shadow-[0_12px_26px_rgba(15,23,42,0.04)]">
                  <div
                    className="[&_h2]:mt-8 [&_h2]:text-[28px] [&_h2]:font-serif [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-[#2d3746] [&_h3]:mt-6 [&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:text-[#2d3746] [&_p]:mt-4 [&_p]:text-[16px] [&_p]:leading-8 [&_p]:text-[#5d6677] [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:text-[16px] [&_li]:leading-8 [&_li]:text-[#5d6677] [&_strong]:font-semibold [&_strong]:text-[#2d3746]"
                    dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.summary}</p>` }}
                  />
                </div>
              </div>
            </article>
          </div>

          <aside className="w-full lg:w-[34%]">
            <div className="sticky top-24 space-y-6">
              <CompanyCard />

              <div className="rounded-[16px] bg-[linear-gradient(135deg,#e5a61b_0%,#f0b52f_55%,#de9f14_100%)] px-6 py-5 text-xl font-bold uppercase tracking-[0.06em] text-white shadow-[0_14px_28px_rgba(232,175,54,0.22)]">
                Diğer Yazılar
              </div>

              <div className="rounded-[20px] border border-[#eceff3] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-5 shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
                <div className="space-y-4">
                  {relatedPosts.map((item) => (
                    <Link
                      key={item.id}
                      to={`/blog/${item.slug}`}
                      className="block rounded-[18px] border border-[#edf0f4] bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-[0_12px_22px_rgba(217,162,26,0.12)]"
                    >
                      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">{item.date}</div>
                      <div className="mt-2 text-[18px] font-semibold leading-snug tracking-tight text-[#2d3746]">{item.title}</div>
                      <div className="mt-2 text-[14px] leading-6 text-[#667085]">{item.summary}</div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-[16px] bg-[linear-gradient(135deg,#e5a61b_0%,#f0b52f_55%,#de9f14_100%)] text-white font-sans font-bold text-xl py-5 px-6 uppercase shadow-[0_14px_28px_rgba(232,175,54,0.22)] tracking-[0.06em] flex items-center justify-between">
                <span>Son Eklenenler</span>
                <span className="text-white/75 text-sm normal-case font-medium tracking-normal">Güncel</span>
              </div>

              <div className="rounded-[20px] border border-[#eceff3] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfd_100%)] p-5 shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
                {sidebarListings.slice(0, 3).map((item) => (
                  <SidebarItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;

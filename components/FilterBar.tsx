
import React, { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FilterBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get('q') ?? '');
  }, [location.search]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      navigate('/');
      return;
    }

    navigate(`/arama?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <div className="mt-4 lg:mt-6 mb-6 lg:mb-10">
      <div className="container mx-auto max-w-[1320px] px-4">
        <div className="relative overflow-hidden rounded-[26px] border border-[#d8d0c2] bg-[linear-gradient(135deg,#70675d_0%,#7a7167_55%,#6a6158_100%)] px-5 py-6 shadow-[0_14px_30px_rgba(0,0,0,0.10)] lg:px-8 lg:py-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold-500/0 via-gold-500/45 to-gold-500/0"></div>
          <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
            <div className="absolute right-[-4%] top-0 h-full w-[38%] skew-x-[-26deg] bg-gradient-to-l from-white to-transparent"></div>
            <div className="absolute bottom-0 left-[35%] h-px w-52 bg-gold-500/30"></div>
            <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_72%_48%,rgba(232,175,54,0.12),transparent_22%)]"></div>
          </div>

          <div className="relative z-10 grid items-center gap-6 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-8">
            <div className="text-center lg:text-left">
              <h2 className="flex items-center justify-center gap-3 text-white font-serif text-[21px] font-bold uppercase tracking-[0.01em] sm:whitespace-nowrap lg:justify-start lg:text-[28px]">
                <span className="hidden h-8 w-1.5 rounded-full bg-gold-500 lg:block"></span>
                Gayrimenkul Vitrini
              </h2>
            </div>

            <div className="w-full">
              <form onSubmit={handleSubmit} className="rounded-full bg-white p-2 shadow-[0_14px_32px_rgba(0,0,0,0.16)]">
                <div className="relative">
                  <label className="flex min-h-[68px] items-center rounded-full bg-white pl-6 pr-[96px] md:min-h-[76px] md:pl-8 md:pr-[118px]">
                    <input
                      type="text"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      className="w-full !border-0 !bg-transparent !shadow-none !outline-none !ring-0 !p-0 text-[17px] font-medium tracking-tight text-gray-700 placeholder:text-[#a6a8b0]"
                      placeholder="İlan no, şehir veya anahtar kelime..."
                    />
                  </label>

                  <button
                    type="submit"
                    aria-label="Ara"
                    className="group/btn absolute right-2 top-1/2 flex h-[58px] w-[58px] -translate-y-1/2 items-center justify-center rounded-full bg-gold-500 text-white shadow-[0_10px_22px_rgba(232,175,54,0.35)] transition-all duration-200 hover:scale-[1.03] hover:bg-gold-600 md:h-[68px] md:w-[68px]"
                  >
                    <svg className="h-7 w-7 transition-transform duration-200 group-hover/btn:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

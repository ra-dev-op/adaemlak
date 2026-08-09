
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
    <div className="mb-6 mt-4 lg:mb-8 lg:mt-5">
      <div className="container mx-auto max-w-[1320px] px-4">
        <div className="w-full bg-[#858487] shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
          <form onSubmit={handleSubmit} className="grid min-h-[50px] grid-cols-1 items-center gap-3 px-5 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:gap-5 md:px-6 md:py-0">
            <h2 className="whitespace-nowrap font-serif text-[19px] font-bold uppercase leading-none tracking-[-0.02em] text-white md:text-[21px]">
              Gayrimenkul Vitrini
            </h2>

            <div className="grid grid-cols-[auto_auto_minmax(132px,168px)_1px_42px] items-center gap-2 justify-self-start md:justify-self-end">
              <span className="flex h-[30px] items-center rounded-[3px] border border-white/35 bg-white/10 px-2.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-white">
                ADA
              </span>
              <span className="flex h-[30px] items-center text-[16px] font-bold leading-none text-white/90">-</span>
              <label className="block">
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-[30px] w-full !rounded-[2px] !border !border-[#d6d6d6] !bg-white !px-3 !py-0 !text-[12px] !font-semibold !uppercase !tracking-[0.01em] !text-[#6f6f72] !shadow-none !outline-none !ring-0 placeholder:!text-[#6f6f72]"
                  placeholder="İlan no ile ara"
                />
              </label>

              <div className="h-[38px] w-px bg-white/45"></div>

              <button
                type="submit"
                aria-label="Ara"
                className="group/btn flex h-[42px] w-[42px] items-center justify-center text-white transition-transform duration-200 hover:scale-105"
              >
                <svg className="h-[34px] w-[34px] drop-shadow-[2px_2px_0_rgba(232,175,54,0.95)] transition-transform duration-200 group-hover/btn:rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

import React, { FormEvent, useEffect, useState } from 'react';
import { fetchEntryLeadStatus, submitEntryLead } from '../lib/api';

const EntryGate: React.FC = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isRequired, setIsRequired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    let isMounted = true;

    const checkEntryStatus = async () => {
      try {
        const status = await fetchEntryLeadStatus();
        if (!isMounted) return;
        setIsRequired(status.required);
      } catch (statusError) {
        console.error('Entry gate status could not be checked:', statusError);
        if (!isMounted) return;
        setIsRequired(true);
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    void checkEntryStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const payload = {
      name: formData.name.trim(),
      company: formData.company.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };

    if (!payload.name || !payload.company || !payload.email || !payload.phone) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEntryLead(payload);
      setIsRequired(false);
    } catch (submitError) {
      console.error('Entry gate form could not be submitted:', submitError);
      setError(submitError instanceof Error ? submitError.message : 'Form gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isChecking && !isRequired) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#161719]/80 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[520px] overflow-hidden rounded-[28px] border border-[#eadbb4] bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_55%,#f8f4eb_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
        <div className="border-b border-[#efe7d8] px-6 py-6 sm:px-8">
          <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-600">Ada Emlak</div>
          <h2 className="mt-3 text-2xl font-serif font-bold leading-tight text-[#263041] sm:text-[32px]">
            Portföyleri Görüntülemek İçin
          </h2>
          <p className="mt-3 text-[14px] leading-6 text-[#667085]">
            Güncel portföylerimizi size en doğru şekilde sunabilmek ve taleplerinizle ilgili hızlı iletişim kurabilmek için bilgilerinizi rica ediyoruz. Formu tamamladığınızda ilanlara erişim açılacaktır.
          </p>
        </div>

        {isChecking ? (
          <div className="flex min-h-[260px] items-center justify-center px-8 py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6 sm:px-8">
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b95a7]">İsim Soyisim</span>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                className="h-12 w-full rounded-[14px] border border-[#e2e7ef] bg-white px-4 text-[15px] font-medium text-[#27303d] outline-none transition focus:border-gold-400 focus:ring-4 focus:ring-gold-100"
                placeholder="Adınız ve soyadınız"
                autoComplete="name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b95a7]">Şirket Bilgisi</span>
              <input
                type="text"
                value={formData.company}
                onChange={(event) => setFormData((prev) => ({ ...prev, company: event.target.value }))}
                className="h-12 w-full rounded-[14px] border border-[#e2e7ef] bg-white px-4 text-[15px] font-medium text-[#27303d] outline-none transition focus:border-gold-400 focus:ring-4 focus:ring-gold-100"
                placeholder="Şirket / kurum adı"
                autoComplete="organization"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b95a7]">E-Posta</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  className="h-12 w-full rounded-[14px] border border-[#e2e7ef] bg-white px-4 text-[15px] font-medium text-[#27303d] outline-none transition focus:border-gold-400 focus:ring-4 focus:ring-gold-100"
                  placeholder="ornek@mail.com"
                  autoComplete="email"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b95a7]">Telefon</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                  className="h-12 w-full rounded-[14px] border border-[#e2e7ef] bg-white px-4 text-[15px] font-medium text-[#27303d] outline-none transition focus:border-gold-400 focus:ring-4 focus:ring-gold-100"
                  placeholder="05xx xxx xx xx"
                  autoComplete="tel"
                />
              </label>
            </div>

            {error && (
              <div className="rounded-[14px] border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#e5a61b_0%,#f0b52f_55%,#de9f14_100%)] text-[12px] font-extrabold uppercase tracking-[0.22em] text-white shadow-[0_16px_30px_rgba(217,162,26,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(217,162,26,0.34)] disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? 'Kaydediliyor' : 'Siteye Giriş Yap'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EntryGate;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import SeoHead from '../SeoHead';
import {
  isAdminAuthenticated,
  setAdminToken,
} from '../../config/adminAuth';
import { loginAdmin } from '../../lib/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const { token } = await loginAdmin(username, password);
      setAdminToken(token);
      navigate('/admin/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Giriş sırasında bir hata oluştu.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <SeoHead title="Yönetim Paneli Giriş" description="Ada Emlak yönetim paneli giriş ekranı." noIndex />
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef0ed] px-4 py-10">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}textures/site-background.webp)` }}
        aria-hidden="true"
      />
      <div className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-[#eba900]/18 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-[#1f2933]/12 blur-3xl" aria-hidden="true" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/70 bg-white/88 shadow-[0_28px_80px_rgba(31,41,55,0.18)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[620px] overflow-hidden bg-[linear-gradient(145deg,#22262c_0%,#16191d_58%,#2a2418_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2b51b]/80 to-transparent" aria-hidden="true" />
          <div className="absolute -right-24 top-20 h-56 w-56 rounded-full bg-[#f2b51b]/20 blur-3xl" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(0deg,rgba(242,181,27,0.18),transparent)]" aria-hidden="true" />

          <Link to="/" className="relative inline-flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-md transition-transform duration-300 hover:scale-[1.015]">
            <img
              src={`${import.meta.env.BASE_URL}ada-emlak-logo.png`}
              alt="Ada Emlak"
              width="151"
              height="81"
              className="h-14 w-auto object-contain brightness-0 invert"
            />
            <span className="h-10 w-px bg-white/15" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#f5c451]">Yönetim Merkezi</span>
          </Link>

          <div className="relative max-w-md">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f2b51b]/25 bg-[#f2b51b]/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f5c451]">
              <ShieldCheck className="h-4 w-4" />
              Güvenli Panel Erişimi
            </span>
            <h1 className="text-[42px] font-extrabold leading-[1.05] tracking-[-0.04em]">
              Portföy yönetimi için sade, güvenli ve hızlı giriş.
            </h1>
            <p className="mt-5 text-[15px] font-medium leading-7 text-white/66">
              İlanlar, performans, mesajlar ve SEO ayarları tek panelden yönetilir. Yetkili kullanıcı bilgilerinizi girerek devam edin.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {['İlan Yönetimi', 'SEO Kontrolü', 'Mesaj Takibi'].map((label) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.13em] text-white/72">
                {label}
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-8 sm:px-10 lg:px-12 lg:py-14">
          <div className="mb-8 text-center lg:hidden">
            <Link to="/" className="inline-block">
              <img
                src={`${import.meta.env.BASE_URL}ada-emlak-logo.png`}
                alt="Ada Emlak"
                width="151"
                height="81"
                className="mx-auto h-16 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="mb-9">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2b51b] text-white shadow-[0_12px_28px_rgba(242,181,27,0.32)]">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#b98200]">Ada Panel</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] text-[#23272f]">Yönetim Paneli Girişi</h2>
            <p className="mt-3 max-w-sm text-sm font-medium leading-6 text-[#7a8290]">
              Yetkili hesabınızla giriş yaparak Ada Emlak içerik ve ilan yönetimine devam edin.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#687080]">Kullanıcı Adı</label>
              <div className="group flex items-center gap-3 rounded-2xl border border-[#e3e6ea] bg-white px-4 py-3.5 shadow-[0_10px_24px_rgba(31,41,55,0.045)] transition-all duration-200 focus-within:border-[#f2b51b] focus-within:ring-4 focus-within:ring-[#f2b51b]/15">
                <UserRound className="h-5 w-5 shrink-0 text-[#b4bac4] transition-colors group-focus-within:text-[#d89a00]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent text-[15px] font-semibold text-[#252a32] outline-none placeholder:text-[#b4bac4]"
                  placeholder="Kullanıcı adınızı girin"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#687080]">Şifre</label>
              <div className="group flex items-center gap-3 rounded-2xl border border-[#e3e6ea] bg-white px-4 py-3.5 shadow-[0_10px_24px_rgba(31,41,55,0.045)] transition-all duration-200 focus-within:border-[#f2b51b] focus-within:ring-4 focus-within:ring-[#f2b51b]/15">
                <LockKeyhole className="h-5 w-5 shrink-0 text-[#b4bac4] transition-colors group-focus-within:text-[#d89a00]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-[15px] font-semibold text-[#252a32] outline-none placeholder:text-[#b4bac4]"
                  placeholder="Şifrenizi girin"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-full p-1.5 text-[#9aa2af] transition-colors hover:bg-gray-100 hover:text-[#252a32]"
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-2 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#20252d] px-5 py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(31,41,55,0.22)] transition-all duration-200 hover:bg-[#d99b00] hover:shadow-[0_18px_38px_rgba(217,155,0,0.32)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Giriş Yapılıyor...' : 'Panele Giriş Yap'}
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-[#ece2c7] bg-[#fffaf0] px-4 py-3 text-xs font-semibold leading-5 text-[#8b6a22]">
            Güvenlik için giriş bilgilerinizi paylaşmayın. İşlem bittikten sonra panelden çıkış yapmanız önerilir.
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default Login;

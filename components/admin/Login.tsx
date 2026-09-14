import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SeoHead from '../SeoHead';
import {
  ADMIN_LOGIN_PATH,
  isAdminAuthenticated,
  setAdminToken,
} from '../../config/adminAuth';
import { loginAdmin } from '../../lib/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { token } = await loginAdmin(username, password);
      setAdminToken(token);
      navigate('/admin/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Giriş sırasında bir hata oluştu.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <SeoHead title="Yönetim Paneli Giriş" description="Ada Emlak yönetim paneli giriş ekranı." noIndex />
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
      <div className="bg-white p-8 rounded-sm shadow-card w-full max-w-md border-t-4 border-gold-500">
        <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img src={`${import.meta.env.BASE_URL}ada-emlak-logo.png`} alt="Ada Emlak" width="151" height="81" className="h-16 mx-auto mb-4 object-contain transition-transform duration-300 hover:scale-[1.02]" />
            </Link>
            <h2 className="text-2xl font-serif font-bold text-gray-700">Yönetim Paneli</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Kullanıcı Adı</label>
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-200 outline-none focus:border-gold-500 transition-colors"
                placeholder="Kullanıcı adı"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase mb-2">Şifre</label>
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 outline-none focus:border-gold-500 transition-colors"
                placeholder="Şifre"
            />
          </div>
          <button type="submit" className="w-full bg-gold-500 text-white font-bold py-3 uppercase hover:bg-gold-600 transition-colors">
            {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        <div className="mt-4 text-center text-[11px] text-gray-400">
          Gizli giriş bağlantısı: <span className="font-semibold text-gray-500">{ADMIN_LOGIN_PATH}</span>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;

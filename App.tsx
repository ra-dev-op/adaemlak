
import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScriptInjector from './components/ScriptInjector';
import { DataProvider } from './context/DataContext';
import { ADMIN_LOGIN_PATH } from './config/adminAuth';

// Lazy Loaded Components for Performance
const Home = lazy(() => import('./components/Home'));
const ListingDetail = lazy(() => import('./components/ListingDetail'));
const CategoryPage = lazy(() => import('./components/CategoryPage'));
const About = lazy(() => import('./components/About'));
const References = lazy(() => import('./components/References'));
const Contact = lazy(() => import('./components/Contact'));
const News = lazy(() => import('./components/News'));
const BlogDetail = lazy(() => import('./components/BlogDetail'));
const Login = lazy(() => import('./components/admin/Login'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AdminListings = lazy(() => import('./components/admin/AdminListings'));
const AdminPerformance = lazy(() => import('./components/admin/AdminPerformance'));
const AdminNews = lazy(() => import('./components/admin/AdminNews'));
const AdminMessages = lazy(() => import('./components/admin/AdminMessages'));
const AdminGoogle = lazy(() => import('./components/admin/AdminGoogle'));
const AdminAds = lazy(() => import('./components/admin/AdminAds'));
const AdminSeo = lazy(() => import('./components/admin/AdminSeo'));
const AdminSettings = lazy(() => import('./components/admin/AdminSettings'));

// Legal Pages
import { 
  Kvkk, 
  PrivacyPolicy, 
  CookiePolicy, 
  ExplicitConsent, 
  DataSubjectForm, 
  TermsOfUse 
} from './components/LegalPages';

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const PublicLayout = () => (
  <>
    <Header />
    <Navbar />
    <div className="min-h-[60vh] pb-24 lg:pb-0">
        <Outlet />
    </div>
    <div className="hidden lg:block">
      <Footer />
    </div>
  </>
);

function App() {
  const routerBaseName = import.meta.env.PROD ? '/adaemlak' : '/';

  return (
    <DataProvider>
      <ScriptInjector />
      <div className="min-h-screen font-sans text-gray-700 bg-[#f9f9f9]">
        <BrowserRouter basename={routerBaseName}>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/hakkimizda" element={<About />} />
                <Route path="/referanslar" element={<References />} />
                <Route path="/blog" element={<News />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/haberler" element={<Navigate to="/blog" replace />} />
                <Route path="/iletisim" element={<Contact />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/arama" element={<CategoryPage />} />
                
                {/* Specific Category Routes for Mobile/Direct Access */}
                <Route path="/:categorySlug" element={<CategoryPage />} />
                <Route path="/kategori/:group/:type" element={<CategoryPage />} />
                
                {/* Legal Routes */}
                <Route path="/kvkk" element={<Kvkk />} />
                <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
                <Route path="/cerez-politikasi" element={<CookiePolicy />} />
                <Route path="/acik-riza-metni" element={<ExplicitConsent />} />
                <Route path="/veri-sahibi-basvuru-formu" element={<DataSubjectForm />} />
                <Route path="/kullanim-kosullari" element={<TermsOfUse />} />
              </Route>

              {/* Admin Routes */}
              <Route path={ADMIN_LOGIN_PATH} element={<Login />} />
              <Route path="/admin/login" element={<Navigate to={ADMIN_LOGIN_PATH} replace />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="performance" element={<AdminPerformance />} />
                <Route path="listings" element={<AdminListings />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="google" element={<AdminGoogle />} />
                <Route path="ads" element={<AdminAds />} />
                <Route path="seo" element={<AdminSeo />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </DataProvider>
  );
}

export default App;

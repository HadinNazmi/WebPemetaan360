import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/user/HomePage.jsx';
import ProgramDetailPage from './pages/user/ProgramDetailPage.jsx';
import Tour360ViewerPage from './pages/user/Tour360ViewerPage.jsx';
import TentangKamiPage from './pages/user/TentangKamiPage.jsx';
import SistemDetailPage from './pages/user/SistemDetailPage.jsx';
import KatalogProdukPage from './pages/user/KatalogProdukPage.jsx';
import DirektoriUmkmPage from './pages/user/DirektoriUmkmPage.jsx';
import DetailKelompokUmkmPage from './pages/user/DetailKelompokUmkmPage.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Auth & Protection
import LoginPage from './pages/auth/LoginPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Admin Layout & Pages
import AdminLayout from './components/admin/AdminLayout.jsx';
import DashboardOverviewPage from './pages/admin/DashboardOverviewPage.jsx';
import HeroVisiMisiPage from './pages/admin/HeroVisiMisiPage.jsx';
import MetrikDampakPage from './pages/admin/MetrikDampakPage.jsx';
import ProgramUnggulanPage from './pages/admin/ProgramUnggulanPage.jsx';
import PenyaluranBantuanPage from './pages/admin/PenyaluranBantuanPage.jsx';
import PublikasiPage from './pages/admin/PublikasiPage.jsx';
import PenggunaAdminPage from './pages/admin/PenggunaAdminPage.jsx';
import KonfigurasiUmumPage from './pages/admin/KonfigurasiUmumPage.jsx';
import TourWilayahPage from './pages/admin/TourWilayahPage.jsx';
import TourScenesPage from './pages/admin/TourScenesPage.jsx';
import TourSceneEditorPage from './pages/admin/TourSceneEditorPage.jsx';
import Hero360SettingsPage from './pages/admin/Hero360SettingsPage.jsx';
import UmkmAdminPage from './pages/admin/UmkmAdminPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Halaman Publik */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tentang-kami" element={<TentangKamiPage />} />
          <Route path="/program/:slug" element={<ProgramDetailPage />} />
          <Route path="/sistem/:slug" element={<SistemDetailPage />} />
          <Route path="/ppid" element={<ProgramDetailPage />} />
          <Route path="/tour-360" element={<Tour360ViewerPage />} />
          <Route path="/tour-360/:slug" element={<Tour360ViewerPage />} />

          {/* Halaman UMKM Binaan */}
          <Route path="/katalog-produk" element={<KatalogProdukPage />} />
          <Route path="/produk" element={<Navigate to="/katalog-produk" replace />} />
          <Route path="/direktori-umkm" element={<DirektoriUmkmPage />} />
          <Route path="/direktori-umkm/:slug" element={<DetailKelompokUmkmPage />} />
          <Route path="/umkm" element={<Navigate to="/direktori-umkm" replace />} />
          <Route path="/umkm/:slug" element={<DetailKelompokUmkmPage />} />

        {/* Autentikasi Admin */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />

        {/* =========================================
            Dashboard Admin CMS (Terproteksi via ProtectedRoute)
            Sidebar & Topbar tetap preserved di AdminLayout,
            hanya child route yang berganti di <Outlet />
           ========================================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverviewPage />} />
          <Route path="hero-visi-misi" element={<HeroVisiMisiPage />} />
          <Route path="metrik-dampak" element={<MetrikDampakPage />} />
          <Route path="program" element={<ProgramUnggulanPage />} />
          <Route path="bantuan" element={<PenyaluranBantuanPage />} />
          <Route path="artikel" element={<PublikasiPage />} />
          <Route path="umkm" element={<UmkmAdminPage />} />
          <Route path="tour-360" element={<TourWilayahPage />} />
          <Route path="tour-360/hero-settings" element={<Hero360SettingsPage />} />
          <Route path="tour-360/:wilayahId/scenes" element={<TourScenesPage />} />
          <Route path="tour-360/:wilayahId/scenes/:sceneId/editor" element={<TourSceneEditorPage />} />
          <Route path="pengguna" element={<PenggunaAdminPage />} />
          <Route path="pengaturan" element={<KonfigurasiUmumPage />} />
        </Route>

        {/* Fallback jika route tidak dikenal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  </BrowserRouter>
  );
}

export default App;

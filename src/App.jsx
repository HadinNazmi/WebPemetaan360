import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/user/HomePage.jsx';
import ProgramDetailPage from './pages/user/ProgramDetailPage.jsx';
import Tour360ViewerPage from './pages/user/Tour360ViewerPage.jsx';
import TentangKamiPage from './pages/user/TentangKamiPage.jsx';
import SistemDetailPage from './pages/user/SistemDetailPage.jsx';
import TjslPage from './pages/user/TjslPage.jsx';
import KatalogProdukPage from './pages/user/KatalogProdukPage.jsx';
import DirektoriUmkmPage from './pages/user/DirektoriUmkmPage.jsx';
import DetailKelompokUmkmPage from './pages/user/DetailKelompokUmkmPage.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Auth & Protection
import LoginPage from './pages/auth/LoginPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute.jsx';

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
import PageHeroAdminPage from './pages/admin/PageHeroAdminPage.jsx';
import PageTransition from './components/common/PageTransition.jsx';

// Admin TJSL Layout & Pages
import TjslAdminLayout from './components/admin/tjsl/TjslAdminLayout.jsx';
import TjslDashboardOverviewPage from './pages/admin/tjsl/TjslDashboardOverviewPage.jsx';
import TjslPilarPage from './pages/admin/tjsl/TjslPilarPage.jsx';
import TjslProgramPage from './pages/admin/tjsl/TjslProgramPage.jsx';
import TjslBantuanPage from './pages/admin/tjsl/TjslBantuanPage.jsx';
import TjslLaporanPage from './pages/admin/tjsl/TjslLaporanPage.jsx';
import TjslProfilPage from './pages/admin/tjsl/TjslProfilPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Halaman Publik */}
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/tentang-kami" element={<PageTransition><TentangKamiPage /></PageTransition>} />
          <Route path="/program/:slug" element={<PageTransition><ProgramDetailPage /></PageTransition>} />
          <Route path="/sistem/:slug" element={<PageTransition><SistemDetailPage /></PageTransition>} />
          <Route path="/tjsl" element={<PageTransition><TjslPage /></PageTransition>} />
          <Route path="/bantuan/tjsl" element={<Navigate to="/tjsl" replace />} />
          <Route path="/ppid" element={<PageTransition><ProgramDetailPage /></PageTransition>} />
          <Route path="/tour-360" element={<PageTransition><Tour360ViewerPage /></PageTransition>} />
          <Route path="/tour-360/:slug" element={<PageTransition><Tour360ViewerPage /></PageTransition>} />

          {/* Halaman UMKM Binaan */}
          <Route path="/katalog-produk" element={<PageTransition><KatalogProdukPage /></PageTransition>} />
          <Route path="/produk" element={<Navigate to="/katalog-produk" replace />} />
          <Route path="/direktori-umkm" element={<PageTransition><DirektoriUmkmPage /></PageTransition>} />
          <Route path="/direktori-umkm/:slug" element={<PageTransition><DetailKelompokUmkmPage /></PageTransition>} />
          <Route path="/umkm" element={<Navigate to="/direktori-umkm" replace />} />
          <Route path="/umkm/:slug" element={<PageTransition><DetailKelompokUmkmPage /></PageTransition>} />

          {/* Autentikasi Admin */}
          <Route path="/admin/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />

          {/* =========================================
            Dashboard Admin CSR (Terproteksi Khusus Role CSR)
           ========================================= */}
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={['superadmin', 'admin']}>
                <AdminLayout />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<DashboardOverviewPage />} />
            <Route path="hero-visi-misi" element={<HeroVisiMisiPage />} />
            <Route path="metrik-dampak" element={<MetrikDampakPage />} />
            <Route path="program" element={<ProgramUnggulanPage />} />
            <Route path="bantuan" element={<PenyaluranBantuanPage />} />
            <Route path="artikel" element={<PublikasiPage />} />
            <Route path="umkm" element={<UmkmAdminPage />} />
            <Route path="page-heroes" element={<PageHeroAdminPage />} />
            <Route path="tour-360" element={<TourWilayahPage />} />
            <Route path="tour-360/hero-settings" element={<Hero360SettingsPage />} />
            <Route path="tour-360/:wilayahId/scenes" element={<TourScenesPage />} />
            <Route path="tour-360/:wilayahId/scenes/:sceneId/editor" element={<TourSceneEditorPage />} />
            <Route path="pengguna" element={<PenggunaAdminPage />} />
            <Route path="pengaturan" element={<KonfigurasiUmumPage />} />
          </Route>

          {/* =========================================
            Dashboard Khusus Admin TJSL (Terproteksi Khusus Role TJSL)
           ========================================= */}
          <Route
            path="/admin/tjsl"
            element={
              <RoleProtectedRoute allowedRoles={['admin_tjsl']}>
                <TjslAdminLayout />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<TjslDashboardOverviewPage />} />
            <Route path="pilar" element={<TjslPilarPage />} />
            <Route path="program" element={<TjslProgramPage />} />
            <Route path="bantuan" element={<TjslBantuanPage />} />
            <Route path="laporan" element={<TjslLaporanPage />} />
            <Route path="profil" element={<TjslProfilPage />} />
          </Route>

          {/* Fallback jika route tidak dikenal */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;

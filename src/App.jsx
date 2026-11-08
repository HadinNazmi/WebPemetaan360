import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/user/HomePage.jsx';
import ProgramDetailPage from './pages/user/ProgramDetailPage.jsx';
import Tour360ViewerPage from './pages/user/Tour360ViewerPage.jsx';

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Publik */}
        <Route path="/" element={<HomePage />} />
        <Route path="/program/:slug" element={<ProgramDetailPage />} />
        <Route path="/ppid" element={<ProgramDetailPage />} />
        <Route path="/tour-360" element={<Tour360ViewerPage />} />
        <Route path="/tour-360/:slug" element={<Tour360ViewerPage />} />

        {/* =========================================
            Dashboard Admin CMS (Nested Layout)
            Sidebar & Topbar tetap preserved di AdminLayout,
            hanya child route yang berganti di <Outlet />
           ========================================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="hero-visi-misi" element={<HeroVisiMisiPage />} />
          <Route path="metrik-dampak" element={<MetrikDampakPage />} />
          <Route path="program" element={<ProgramUnggulanPage />} />
          <Route path="bantuan" element={<PenyaluranBantuanPage />} />
          <Route path="artikel" element={<PublikasiPage />} />
          <Route path="tour-360" element={<TourWilayahPage />} />
          <Route path="tour-360/:wilayahId/scenes" element={<TourScenesPage />} />
          <Route path="tour-360/:wilayahId/scenes/:sceneId/editor" element={<TourSceneEditorPage />} />
          <Route path="pengguna" element={<PenggunaAdminPage />} />
          <Route path="pengaturan" element={<KonfigurasiUmumPage />} />
        </Route>

        {/* Fallback jika route tidak dikenal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

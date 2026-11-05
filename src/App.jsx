import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/user/HomePage.jsx';
import ProgramDetailPage from './pages/user/ProgramDetailPage.jsx';

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Publik */}
        <Route path="/" element={<HomePage />} />
        <Route path="/program/:slug" element={<ProgramDetailPage />} />
        <Route path="/ppid" element={<ProgramDetailPage />} />

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

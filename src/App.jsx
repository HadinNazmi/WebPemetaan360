import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/user/HomePage.jsx';
import ProgramDetailPage from './pages/user/ProgramDetailPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Beranda Utama */}
        <Route path="/" element={<HomePage />} />

        {/* Halaman Detail Program CSR (Dinamis berdasarkan slug) */}
        <Route path="/program/:slug" element={<ProgramDetailPage />} />

        {/* Alias langsung untuk PPID sesuai tautan referensi */}
        <Route path="/ppid" element={<ProgramDetailPage />} />

        {/* Fallback jika route tidak dikenal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

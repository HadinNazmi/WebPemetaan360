import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tentukan path tujuan setelah login berhasil (default ke /admin)
  const from = location.state?.from?.pathname || '/admin';

  // Jika sudah login, langsung alihkan ke dashboard
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Harap isi alamat email dan kata sandi Anda.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        email: email.trim(),
        password: password,
      });

      if (response?.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(
          response?.message || 'Login gagal. Silakan periksa kredensial Anda.'
        );
      }
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        'Gagal terhubung ke server backend. Pastikan server Laravel aktif.';
      setErrorMessage(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-bg-decor" />

      <div className="login-card-container">
        {/* Header Branding */}
        <div className="login-header">
          <img
            src="/images/Logo Pertamina Patra Niaga Horizontal.png"
            alt="Pertamina Patra Niaga"
            className="login-brand-logo"
            onError={(e) => {
              e.currentTarget.src = '/favicon.svg';
              e.currentTarget.style.height = '42px';
            }}
          />
          <h1 className="login-title">Portal Manajemen CSR</h1>
          <p className="login-subtitle">
            Masuk untuk mengelola data program, konten publikasi, dan Virtual Tour 360°
          </p>
        </div>

        {/* Notifikasi Error */}
        {errorMessage && (
          <div className="login-alert-error" role="alert">
            <span className="material-symbols-outlined">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label className="login-form-label" htmlFor="login-email">
              Alamat Email
            </label>
            <div className="login-input-wrapper">
              <span className="material-symbols-outlined login-input-icon">
                mail
              </span>
              <input
                id="login-email"
                type="email"
                className="login-input"
                placeholder="admin@csr.pertamina.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-form-label" htmlFor="login-password">
              Kata Sandi
            </label>
            <div className="login-input-wrapper">
              <span className="material-symbols-outlined login-input-icon">
                lock
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input login-input-password"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="login-btn-visibility"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                tabIndex={-1}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="login-btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined spin">
                  progress_activity
                </span>
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">login</span>
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Navigasi */}
        <div className="login-card-footer">
          <Link to="/" className="login-link-back">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_back
            </span>
            <span>Kembali ke Beranda Utama</span>
          </Link>
          <p className="login-security-tag">
            Sistem Terproteksi — Akses khusus staf & administrator TJSL PT Pertamina Patra Niaga.
          </p>
        </div>
      </div>
    </div>
  );
}


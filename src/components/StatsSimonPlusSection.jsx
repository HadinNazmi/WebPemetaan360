import React, { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import { programService } from '../services/programService';
import './Stats.css';

// Komponen angka item individu
function StatItem({ item, isVisible }) {
  const isDecimal = item.format_angka === 'decimal';
  const count = useCountUp(item.nilai_angka, isVisible, isDecimal);

  const formattedValue = isDecimal
    ? count.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : count.toLocaleString('id-ID');

  return (
    <div className="stat-col">
      <span className="stat-category">{item.kategori}</span>
      <div className="stat-value-wrap">
        <span className="stat-counter">{formattedValue}</span>
        {item.suffix && <span className="stat-suffix">{item.suffix}</span>}
      </div>
      <div className="stat-unit">
        {item.satuan}
        {item.sub_satuan && <span className="stat-unit-sub"> {item.sub_satuan}</span>}
      </div>
      <p className="stat-desc">{item.deskripsi}</p>
    </div>
  );
}

/**
 * StatsSimonPlusSection:
 * Seksi Khusus Platform Digital Simon+ (Monitoring & Evaluasi Ketercapaian CSR)
 */
export default function StatsSimonPlusSection() {
  const [sectionRef, isInView] = useInView({ threshold: 0.2 });
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    async function loadMetrics() {
      const res = await programService.getImpactMetrics();
      if (res.success && Array.isArray(res.data)) {
        // Filter HANYA data metrik milik Simon+
        const simonOnly = res.data.filter(
          (m) =>
            m.kode_sistem === 'simon_plus' ||
            m.sistem_csr_id === 2 ||
            (m.kategori && m.kategori.toLowerCase().includes('simon'))
        );
        setMetrics(simonOnly);
      }
    }
    loadMetrics();
  }, []);

  return (
    <section className="sec-digital-impact" id="capaian-simon-plus" ref={sectionRef} style={{ background: '#f8fafc' }}>
      <div className="wrap-content">
        {/* Header Grid: Judul & Deskripsi Khusus Simon+ */}
        <div className="stat-header-grid">
          <div className="stat-header-left">
            <span className="stat-badge">MONITORING &amp; EVALUASI TJSL</span>
            <h2 className="stat-main-title">
              Tata Kelola &amp; Akuntabilitas Program (Simon+)
            </h2>
          </div>
          <div className="stat-header-right">
            <p className="stat-main-desc">
              Melalui sistem monitoring terpadu <strong>Simon+</strong>, seluruh pelaksanaan program Tanggung Jawab Sosial dan Lingkungan (TJSL) dipantau secara transparan, berbasis data akurat, dan terukur sesuai standar indikator keberlanjutan.
            </p>
            <a href="/sistem/simon_plus" className="btn-stat-action">
              <span>Selengkapnya</span>
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        {/* Garis Pembatas */}
        <div className="stat-divider"></div>

        {/* Kolom Statistik Capaian Simon+ */}
        {metrics.length === 0 ? (
          <div className="w-full py-8 text-center text-slate-400 text-sm">
            Belum ada metrik capaian Simon+ di database.
          </div>
        ) : (
          <div className="stat-cards-grid">
            {metrics.map((item) => (
              <StatItem key={item.id} item={item} isVisible={isInView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

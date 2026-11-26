import React, { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import { programService } from '../services/programService';
import './Stats.css';

// Komponen angka item individu agar tiap counter menjalankan hook sendiri
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
 * StatsSiminahSection:
 * Seksi Khusus Platform Digital SiMinah (Sirkularitas Minyak Jelantah)
 */
export default function StatsSiminahSection() {
  const [sectionRef, isInView] = useInView({ threshold: 0.2 });
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    async function loadMetrics() {
      const res = await programService.getImpactMetrics();
      if (res.success && Array.isArray(res.data)) {
        // Filter HANYA data metrik milik SiMinah
        const siminahOnly = res.data.filter(
          (m) =>
            m.kode_sistem === 'siminah' ||
            m.sistem_csr_id === 1 ||
            (m.kategori && m.kategori.toLowerCase().includes('siminah'))
        );
        setMetrics(siminahOnly);
      }
    }
    loadMetrics();
  }, []);

  return (
    <section className="sec-digital-impact" id="capaian-siminah" ref={sectionRef}>
      <div className="wrap-content">
        {/* Header Grid: Judul & Deskripsi Khusus SiMinah */}
        <div className="stat-header-grid">
          <div className="stat-header-left">
            <span className="stat-badge">SIRKULARITAS MINYAK JELANTAH</span>
            <h2 className="stat-main-title">
              Dampak Digitalisasi Sirkularitas Jelantah (SiMinah)
            </h2>
          </div>
          <div className="stat-header-right">
            <p className="stat-main-desc">
              Melalui platform digital <strong>SiMinah</strong>, PT Pertamina Patra Niaga memfasilitasi gerakan sedekah jelantah berbasis masyarakat untuk diolah menjadi energi terbarukan ramah lingkungan sekaligus mencegah pencemaran perairan pesisir.
            </p>
            <a href="/sistem/siminah" className="btn-stat-action">
              <span>Selengkapnya</span>
              <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        {/* Garis Pembatas */}
        <div className="stat-divider"></div>

        {/* Kolom Statistik Capaian SiMinah */}
        {metrics.length === 0 ? (
          <div className="w-full py-8 text-center text-slate-400 text-sm">
            Belum ada metrik capaian SiMinah di database.
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

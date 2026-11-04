import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrasi GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/**
 * AnimatedSection:
 * Mengadopsi prinsip animasi transisi dari referensi nature-gsap untuk SEMUA section:
 * 1. Scrubbing 2 arah mengikuti posisi scroll (scrub: 1)
 * 2. Parallax judul / header saat masuk viewport
 * 3. Staggered card reveal (translateY 80px -> 0, opacity 0 -> 1, stagger: 0.12s - 0.15s)
 * 4. Fade-in deskripsi dan tombol pelengkap
 * 5. Outgoing parallax & subtle fade saat berpindah antar-section
 * 6. Responsif mobile & ramah prefers-reduced-motion
 * 7. Mendukung konten dinamis (MutationObserver) agar kartu yang di-load async tetap teranimasi
 */
export default function AnimatedSection({
  children,
  className = '',
  id,
  staggerTarget,
  stagger = 0.14,
  scrub = 1,
  yOffset = 70,
  parallax = true,
  isHero = false,
}) {
  const domRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Hormati preferensi prefers-reduced-motion
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      if (domRef.current) {
        gsap.set(domRef.current, { opacity: 1, y: 0 });
      }
      return;
    }

    const element = domRef.current;
    if (!element) return;

    const isMobile = window.innerWidth <= 768;
    const effectiveY = isMobile ? Math.min(yOffset, 32) : yOffset;
    const effectiveStagger = isMobile ? stagger * 0.65 : stagger;

    let ctx = null;

    const initAnimation = () => {
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        // === A. SECTION HERO (Hanya Outgoing Transition saat scroll ke bawah) ===
        if (isHero) {
          gsap.to(element, {
            scrollTrigger: {
              trigger: element,
              start: 'top top',
              end: 'bottom top',
              scrub: scrub === true ? 1 : scrub,
              invalidateOnRefresh: true,
            },
            y: isMobile ? -35 : -70,
            opacity: 0.15,
            ease: 'power2.out',
          });
          return;
        }

        // === B. INCOMING TRANSITION UNTUK SEMUA SECTION (Persis nature-gsap) ===
        const enterTl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top 92%',
            end: 'top 30%',
            scrub: scrub === true ? 1 : scrub,
            invalidateOnRefresh: true,
          },
          defaults: {
            ease: 'power2.out',
          },
        });

        // 1. Container section fade-in & translate halus
        enterTl.fromTo(
          element,
          { opacity: 0.1, y: effectiveY * 0.7 },
          { opacity: 1, y: 0, duration: 0.8 },
          0
        );

        // 2. Parallax Judul & Eyebrow Badge
        if (parallax) {
          const headers = element.querySelectorAll('h2, .eyebrow, .banner-eyebrow, .stat-badge, .csr-aid-badge, .news-top-bar');
          if (headers.length > 0) {
            enterTl.fromTo(
              headers,
              { y: effectiveY * 0.6, opacity: 0.2 },
              { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 },
              0.05
            );
          }
        }

        // 3. Staggered Cards Entrance (Persis 4 kartu WEST di nature-gsap: translateY 80px -> 0, opacity 0 -> 1)
        let cards = [];
        if (staggerTarget) {
          cards = element.querySelectorAll(staggerTarget);
        } else {
          cards = element.querySelectorAll(
            '.stat-col, .slider-card, .csr-aid-card, .news-card, .news-featured-card, .energizing-media, .energizing-content, .footer-col, .footer-center-brand'
          );
        }

        if (cards.length > 0) {
          enterTl.fromTo(
            cards,
            { y: effectiveY, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: effectiveStagger },
            0.12
          );
        }

        // 4. Paragraf Deskripsi & Tombol Aksi fade-in setelah kartu
        const subItems = element.querySelectorAll('.stat-main-desc, .banner-desc, .banner-actions, .news-category-pills, .btn-more, .slider-nav-btn');
        if (subItems.length > 0) {
          enterTl.fromTo(
            subItems,
            { y: isMobile ? 10 : 20, opacity: 0.2 },
            { opacity: 1, y: 0, duration: 0.55 },
            '>-0.12'
          );
        }

        // === C. OUTGOING TRANSITION (Transisi Halus Menuju Section Berikutnya) ===
        // Saat user scroll melewati section ini menuju section selanjutnya,
        // konten bergerak naik dengan subtle parallax & softening
        gsap.to(element, {
          scrollTrigger: {
            trigger: element,
            start: 'bottom 72%',
            end: 'bottom 15%',
            scrub: scrub === true ? 1 : scrub,
            invalidateOnRefresh: true,
          },
          y: isMobile ? -20 : -45,
          opacity: 0.35,
          ease: 'power2.out',
        });

      }, domRef);
    };

    // Jalankan build awal
    initAnimation();

    // Pantau perubahan DOM (MutationObserver) agar kartu yang di-fetch secara async
    // (misal Stats, ProgramList, CsrAid, News) langsung otomatis terdeteksi & teranimasi
    let debounceTimer = null;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        initAnimation();
        ScrollTrigger.refresh();
      }, 80);
    });

    observer.observe(element, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      clearTimeout(debounceTimer);
      if (ctx) ctx.revert();
    };
  }, [staggerTarget, stagger, scrub, yOffset, parallax, isHero]);

  return (
    <div ref={domRef} id={id} className={`scroll-section ${className}`}>
      {children}
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrasi GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/**
 * AnimatedSection:
 * Sistem transisi scroll-driven sinematik mengadopsi standar referensi nature-gsap:
 * 1. Hero Pinning dengan Parallax Lift & Darkening Fade (persis nature-gsap hero)
 * 2. Scrubbing 2 arah responsif terhadap scrollbar (scrub: 1.2)
 * 3. Staggered Card Entrance dengan Scale (0.92 -> 1), Blur Halus, dan TranslateY (100px -> 0)
 * 4. Parallax Heading & Badge yang mendahului kartu
 * 5. Outgoing Softening & Parallax saat berganti section
 * 6. Kompatibel penuh dengan prefers-reduced-motion & mobile
 * 7. MutationObserver otomatis untuk data yang di-fetch secara async
 */
export default function AnimatedSection({
  children,
  className = '',
  id,
  staggerTarget,
  stagger = 0.16,
  scrub = 1.2,
  yOffset = 95,
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
        gsap.set(domRef.current, { opacity: 1, y: 0, scale: 1, filter: 'none' });
      }
      return;
    }

    const element = domRef.current;
    if (!element) return;

    const isMobile = window.innerWidth <= 768;
    const effectiveY = isMobile ? Math.min(yOffset, 40) : yOffset;
    const effectiveStagger = isMobile ? stagger * 0.6 : stagger;
    const initialScale = isMobile ? 0.96 : 0.92;

    let ctx = null;

    const initAnimation = () => {
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        // =========================================================================
        // A. SECTION HERO (PINNING + PARALLAX LIFT DUA ARAH PERSIS NATURE-GSAP)
        // =========================================================================
        if (isHero) {
          // [UNUSED - KODE ASLI TEMAN DIPERTAHANKAN]:
          // Efek pinning, parallax scrub, dan darkening hero dinonaktifkan agar hero tampil 'plong' tanpa abu-abu
          gsap.set(element, { opacity: 1, y: 0, scale: 1, clearProps: 'all' });
          return;

          /* KODE ASLI TEMAN (DISIMPAN AGAR TIDAK HILANG):
          const heroInner = element.firstElementChild || element;
          const heroTl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: 'top top',
              end: '+=70%',
              scrub: scrub === true ? 1.2 : scrub,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
            defaults: {
              ease: 'power2.out',
            },
          });

          // Konten teks hero meluncur naik dengan parallax dan fade out
          heroTl.to(heroInner.children, {
            y: isMobile ? -50 : -110,
            opacity: 0,
            stagger: 0.08,
            duration: 1.0,
          }, 0)
          // Background hero meredup perlahan
          .to(heroInner, {
            backgroundColor: '#040810',
            duration: 1.0,
          }, 0);

          return;
          */
        }

        // =========================================================================
        // B. INCOMING TRANSITION UNTUK SETIAP SECTION (PERSIS KARTU W-E-S-T)
        // =========================================================================
        const enterTl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
            end: 'top 20%',
            scrub: scrub === true ? 1.2 : scrub,
            invalidateOnRefresh: true,
          },
          defaults: {
            ease: 'power2.out',
          },
        });

        // 1. Container section meluncur naik & memudar masuk
        enterTl.fromTo(
          element,
          { opacity: 0.15, y: effectiveY * 0.35 },
          { opacity: 1, y: 0, duration: 0.8 },
          0
        );

        // 2. Parallax Judul & Eyebrow Badge (Bergerak mendahului kartu)
        if (parallax) {
          const headers = element.querySelectorAll('h2, .eyebrow, .banner-eyebrow, .stat-badge, .csr-aid-badge, .news-top-bar, .stat-main-title');
          if (headers.length > 0) {
            enterTl.fromTo(
              headers,
              { y: effectiveY * 0.65, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.75, stagger: 0.08 },
              0.05
            );
          }
        }

        // 3. Staggered Cards Entrance (Scale + Blur + TranslateY + Stagger khas GSAP!)
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
            {
              y: effectiveY,
              opacity: 0,
              scale: initialScale,
              filter: isMobile ? 'none' : 'blur(4px)',
              transformOrigin: '50% 100%',
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1.0,
              stagger: effectiveStagger,
            },
            0.15
          );
        }

        // 4. Paragraf Deskripsi & Tombol Aksi fade-in halus setelah kartu muncul
        const subItems = element.querySelectorAll('.stat-main-desc, .banner-desc, .banner-actions, .news-category-pills, .btn-more, .slider-nav-btn, .stat-unit');
        if (subItems.length > 0) {
          enterTl.fromTo(
            subItems,
            { y: isMobile ? 12 : 24, opacity: 0 },
            { opacity: 1, y: 0, duration: 0.6 },
            '>-0.12'
          );
        }

        // =========================================================================
        // C. OUTGOING TRANSITION (PARALLAX KELUAR MENUJU SECTION SELANJUTNYA)
        // =========================================================================
        gsap.to(element, {
          scrollTrigger: {
            trigger: element,
            start: 'bottom 35%',
            end: 'bottom top',
            scrub: scrub === true ? 1.2 : scrub,
            invalidateOnRefresh: true,
          },
          y: isMobile ? -25 : -55,
          scale: isMobile ? 0.98 : 0.96,
          opacity: 0.35,
          ease: 'power2.out',
        });

      }, domRef);
    };

    // Build timeline awal
    initAnimation();

    // Pantau perubahan DOM via MutationObserver agar data kartu async (Stats, Slider, Berita)
    // otomatis terikat dengan GSAP timeline begitu di-render oleh React
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
    <div
      ref={domRef}
      id={id}
      className={`scroll-section ${isHero ? '!opacity-100 !transform-none !transition-none' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

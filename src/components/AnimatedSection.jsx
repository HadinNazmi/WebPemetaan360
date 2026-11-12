import React from 'react';

/**
 * AnimatedSection:
 * 
 * [CATATAN UNUSED - KODE ASLI TEMAN DIPERTAHANKAN PENUH]:
 * Seluruh animasi GSAP scroll-driven (pinning, scrub, stagger blur, dan outgoing fade abu-abu 0.2/0.35)
 * dinonaktifkan (unused) agar tampilan halaman beranda tidak saling bertabrakan, tidak buram,
 * dan seluruh seksi langsung tampil terang, jernih, dan plong 100%.
 * 
 * Kode asli GSAP milik rekan Anda disimpan utuh di bagian bawah file ini (JANGAN DIHAPUS).
 */
export default function AnimatedSection({
  children,
  className = '',
  id,
}) {
  return (
    <div id={id} className={`w-full relative ${className}`}>
      {children}
    </div>
  );
}

/* ==================================================================================
 * [ARSIP KODE ASLI TEMAN - JANGAN DIHAPUS]:
 * ==================================================================================
 *
 * import { useEffect, useRef } from 'react';
 * import { gsap } from 'gsap';
 * import { ScrollTrigger } from 'gsap/ScrollTrigger';
 * gsap.registerPlugin(ScrollTrigger);
 *
 * function AnimatedSectionLegacy({
 *   children,
 *   className = '',
 *   id,
 *   staggerTarget,
 *   stagger = 0.16,
 *   scrub = 1.2,
 *   yOffset = 95,
 *   parallax = true,
 *   isHero = false,
 * }) {
 *   const domRef = useRef(null);
 *
 *   useEffect(() => {
 *     if (typeof window === 'undefined') return;
 *     const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 *     if (isReduced) {
 *       if (domRef.current) {
 *         gsap.set(domRef.current, { opacity: 1, y: 0, scale: 1, filter: 'none' });
 *       }
 *       return;
 *     }
 *
 *     const element = domRef.current;
 *     if (!element) return;
 *
 *     const isMobile = window.innerWidth <= 768;
 *     const effectiveY = isMobile ? Math.min(yOffset, 40) : yOffset;
 *     const effectiveStagger = isMobile ? stagger * 0.6 : stagger;
 *     const initialScale = isMobile ? 0.96 : 0.92;
 *     let ctx = null;
 *
 *     const initAnimation = () => {
 *       if (ctx) ctx.revert();
 *       ctx = gsap.context(() => {
 *         // B. INCOMING TRANSITION
 *         const enterTl = gsap.timeline({
 *           scrollTrigger: {
 *             trigger: element,
 *             start: 'top 86%',
 *             end: 'top 20%',
 *             scrub: scrub === true ? 1.2 : scrub,
 *             invalidateOnRefresh: true,
 *           },
 *           defaults: { ease: 'power2.out' },
 *         });
 *
 *         enterTl.fromTo(
 *           element,
 *           { opacity: 0.15, y: effectiveY * 0.35 },
 *           { opacity: 1, y: 0, duration: 0.8 },
 *           0
 *         );
 *
 *         if (parallax) {
 *           const headers = element.querySelectorAll('h2, .eyebrow, .banner-eyebrow, .stat-badge, .csr-aid-badge, .news-top-bar, .stat-main-title');
 *           if (headers.length > 0) {
 *             enterTl.fromTo(
 *               headers,
 *               { y: effectiveY * 0.65, opacity: 0 },
 *               { y: 0, opacity: 1, duration: 0.75, stagger: 0.08 },
 *               0.05
 *             );
 *           }
 *         }
 *
 *         let cards = [];
 *         if (staggerTarget) {
 *           cards = element.querySelectorAll(staggerTarget);
 *         } else {
 *           cards = element.querySelectorAll(
 *             '.stat-col, .slider-card, .csr-aid-card, .news-card, .news-featured-card, .energizing-media, .energizing-content, .footer-col, .footer-center-brand'
 *           );
 *         }
 *
 *         if (cards.length > 0) {
 *           enterTl.fromTo(
 *             cards,
 *             {
 *               y: effectiveY,
 *               opacity: 0,
 *               scale: initialScale,
 *               filter: isMobile ? 'none' : 'blur(4px)',
 *               transformOrigin: '50% 100%',
 *             },
 *             {
 *               y: 0,
 *               opacity: 1,
 *               scale: 1,
 *               filter: 'blur(0px)',
 *               duration: 1.0,
 *               stagger: effectiveStagger,
 *             },
 *             0.15
 *           );
 *         }
 *
 *         const subItems = element.querySelectorAll('.stat-main-desc, .banner-desc, .banner-actions, .news-category-pills, .btn-more, .slider-nav-btn, .stat-unit');
 *         if (subItems.length > 0) {
 *           enterTl.fromTo(
 *             subItems,
 *             { y: isMobile ? 12 : 24, opacity: 0 },
 *             { opacity: 1, y: 0, duration: 0.6 },
 *             '>-0.12'
 *           );
 *         }
 *
 *         // C. OUTGOING TRANSITION
 *         gsap.to(element, {
 *           scrollTrigger: {
 *             trigger: element,
 *             start: 'bottom 35%',
 *             end: 'bottom top',
 *             scrub: scrub === true ? 1.2 : scrub,
 *             invalidateOnRefresh: true,
 *           },
 *           y: isMobile ? -25 : -55,
 *           scale: isMobile ? 0.98 : 0.96,
 *           opacity: 0.35,
 *           ease: 'power2.out',
 *         });
 *       }, domRef);
 *     };
 *
 *     initAnimation();
 *     let debounceTimer = null;
 *     const observer = new MutationObserver(() => {
 *       clearTimeout(debounceTimer);
 *       debounceTimer = setTimeout(() => {
 *         initAnimation();
 *         ScrollTrigger.refresh();
 *       }, 80);
 *     });
 *     observer.observe(element, { childList: true, subtree: true });
 *     return () => {
 *       observer.disconnect();
 *       clearTimeout(debounceTimer);
 *       if (ctx) ctx.revert();
 *     };
 *   }, [staggerTarget, stagger, scrub, yOffset, parallax, isHero]);
 *
 *   return (
 *     <div ref={domRef} id={id} className={`scroll-section ${className}`}>
 *       {children}
 *     </div>
 *   );
 * }
 */

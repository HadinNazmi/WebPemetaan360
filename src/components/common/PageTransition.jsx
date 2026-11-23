import React, { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

/**
 * PageTransition menggunakan GSAP:
 * Memberikan animasi entrance yang sangat halus (smooth ease-out)
 * pada setiap pergantian rute, dengan reset scroll instan ke atas.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // Reset scroll instan ke top tanpa animasi scroll kasar
    window.scrollTo(0, 0);

    const el = containerRef.current;
    if (!el) return;

    // Set state awal
    gsap.set(el, {
      opacity: 0,
      y: 18,
    });

    // Jalankan animasi GSAP yang sangat halus (power3.out / expo.out)
    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'transform,opacity', // Bersihkan inline style setelah selesai agar tidak bentrok dengan layout/CSS lainnya
      });
    }, el);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div ref={containerRef} className="w-full min-h-full">
      {children}
    </div>
  );
}

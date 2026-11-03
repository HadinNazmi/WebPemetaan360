import React, { useEffect, useState } from 'react';
import { programService } from '../../services/programService';

export default function ProgramList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadPrograms() {
      const res = await programService.getShowcasePrograms();
      if (res.success) {
        setItems(res.data);
      }
    }
    loadPrograms();
  }, []);

  return (
    <div className="w-full relative bg-transparent">
      <div className="relative w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:max-w-full">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target={item.target}
            rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
            title={item.judul_program}
            aria-label={item.judul_program}
            className="group relative w-full px-4 md:px-6 py-8 md:py-10 text-white h-[380px] md:h-[560px] block overflow-hidden"
          >
            {/* Background Image Container */}
            <div className="absolute w-full h-full overflow-hidden top-0 left-0 right-0 bottom-0 z-0">
              <picture>
                <source srcSet={item.banner} media="(max-width: 767px)" />
                <source srcSet={item.banner} media="(max-width: 1279px)" />
                <img
                  className="absolute w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  src={item.banner}
                  alt={item.judul_program}
                  title={item.judul_program}
                  decoding="async"
                  loading="lazy"
                  draggable="false"
                  onError={(e) => {
                    if (item.fallbackImg && e.currentTarget.src !== item.fallbackImg) {
                      e.currentTarget.src = item.fallbackImg;
                    }
                  }}
                />
              </picture>
            </div>

            {/* Gradient Overlays */}
            <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />
            <div className="absolute w-full h-full top-0 left-0 right-0 bottom-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 transition-opacity duration-300 ease-in-out pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-20 w-full h-full flex flex-col justify-end">
              <div>
                <span className="text-xs md:text-sm font-semibold uppercase tracking-wider line-clamp-1 text-white/90">
                  {item.kategori}
                </span>
                <div className="mt-2 mb-6 text-xl md:text-2xl font-semibold line-clamp-1 text-white">
                  {item.judul_program}
                </div>
              </div>

              {/* Action Button Circle with Arrow Animation */}
              <div className="w-full flex">
                <div className="relative overflow-hidden rounded-full border border-solid border-white flex items-center justify-center group-hover:border-red-600 group-hover:bg-red-600 transition-all duration-300 ease-in-out w-12 h-12">
                  <svg
                    className="w-5 h-5 absolute opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <svg
                    className="w-5 h-5 absolute opacity-100 translate-x-0 group-hover:opacity-0 group-hover:translate-x-3 transition-all duration-300 ease-in-out"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

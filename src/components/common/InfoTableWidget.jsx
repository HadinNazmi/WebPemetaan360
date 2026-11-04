import React from 'react';

/**
 * Reusable Info / Metadata Table Widget
 * Tabel informasi kontak, lokasi, dan detail metadata di bagian bawah artikel / program.
 * Sesuai format pada gambar referensi Pertamina.
 *
 * @param {Array<{label: string, value: string, href?: string, isEmail?: boolean, isPhone?: boolean}>} items
 * @param {string} [title] - Judul tabel (opsional)
 */
export default function InfoTableWidget({ items = [], title }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full mt-10 pt-8 border-t border-slate-200">
      {title && (
        <h4 className="text-base md:text-lg font-bold text-slate-900 mb-4">
          {title}
        </h4>
      )}

      <div className="border-t border-slate-200 divide-y divide-slate-200 text-sm">
        {items.map((item, index) => {
          let valueRender = item.value;

          if (item.isEmail || (typeof item.value === 'string' && item.value.includes('@') && !item.href)) {
            valueRender = (
              <a
                href={`mailto:${item.value}`}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                {item.value}
              </a>
            );
          } else if (item.isPhone) {
            valueRender = (
              <a
                href={`tel:${item.value}`}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                {item.value}
              </a>
            );
          } else if (item.href) {
            valueRender = (
              <a
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : '_self'}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors break-all"
              >
                {item.value}
              </a>
            );
          }

          return (
            <div
              key={index}
              className="py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
            >
              <div className="w-full sm:w-40 md:w-48 font-bold text-slate-900 flex-shrink-0">
                {item.label}
              </div>
              <div className="flex-1 text-slate-700 leading-relaxed whitespace-pre-line">
                {valueRender}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

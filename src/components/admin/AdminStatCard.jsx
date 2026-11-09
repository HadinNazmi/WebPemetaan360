import React from 'react';

export default function AdminStatCard({
  title,
  value,
  icon,
  badge,
  badgeColor = 'bg-slate-100 text-slate-600',
  subText,
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-medium">{title}</span>
          <span className="text-xl font-bold text-slate-900 mt-1">
            {value}
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200/60">
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
        {badge && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${badgeColor}`}
          >
            {badge}
          </span>
        )}
        {subText && <span className="text-xs text-slate-400">{subText}</span>}
      </div>
    </div>
  );
}

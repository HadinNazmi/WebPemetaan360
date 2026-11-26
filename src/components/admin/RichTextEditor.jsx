import React, { useState, useRef, useEffect } from 'react';

/**
 * RichTextEditor:
 * Komponen editor teks kaya (WYSIWYG) ramah admin bergaya Word
 * dengan dukungan:
 * - Mode Visual (Bold, Italic, Underline, Heading 2/3, Bullet List, Numbered List, Paragraph, Clear Format)
 * - Mode Kode / HTML (Bagi developer atau jika ingin paste kode HTML langsung)
 * - Otomatis menyinkronkan value HTML ke parent form
 */
export default function RichTextEditor({
  label = 'Deskripsi Lengkap',
  value = '',
  onChange,
  placeholder = 'Tuliskan deskripsi lengkap di sini...',
  required = false,
  minHeight = '240px',
}) {
  const [mode, setMode] = useState('visual'); // 'visual' | 'code'
  const editorRef = useRef(null);

  // Sinkronkan isi visual editor saat value berubah dari luar (misal saat buka modal edit)
  useEffect(() => {
    if (editorRef.current && mode === 'visual') {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, mode]);

  // Handler saat mengetik di mode visual
  const handleVisualInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html === '<p><br></p>' || html === '<br>' ? '' : html);
    }
  };

  // Eksekusi formatting dokumen (Bold, Italic, Heading, List, dll)
  const execCmd = (command, val = null) => {
    if (mode !== 'visual') return;
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleVisualInput();
  };

  // Mengubah tag blok (Heading 2, Heading 3, Paragraf)
  const formatBlock = (tag) => {
    execCmd('formatBlock', tag);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Header Bar: Label & Toggle Mode */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('visual')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition flex items-center gap-1 ${
              mode === 'visual'
                ? 'bg-white text-[#00529C] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">edit_note</span>
            <span>Tampilan Visual (Word)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('code')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition flex items-center gap-1 ${
              mode === 'code'
                ? 'bg-white text-[#00529C] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">code</span>
            <span>Kode HTML</span>
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#00529C]/40 focus-within:border-[#00529C] transition bg-white shadow-2xs">
        {/* Toolbar Format (Aktif di Mode Visual) */}
        {mode === 'visual' && (
          <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-50 border-b border-slate-200 select-none">
            {/* Group: Headings & Paragraph */}
            <button
              type="button"
              onClick={() => formatBlock('<p>')}
              className="px-2 py-1 text-xs font-semibold rounded hover:bg-slate-200 text-slate-700"
              title="Paragraf Biasa"
            >
              Paragraf
            </button>
            <button
              type="button"
              onClick={() => formatBlock('<h3>')}
              className="px-2 py-1 text-xs font-bold rounded hover:bg-slate-200 text-slate-800"
              title="Judul Bagian / Sub-heading (H3)"
            >
              H3 (Sub-judul)
            </button>
            <button
              type="button"
              onClick={() => formatBlock('<h2>')}
              className="px-2 py-1 text-xs font-extrabold rounded hover:bg-slate-200 text-slate-900"
              title="Judul Utama (H2)"
            >
              H2 (Judul Besar)
            </button>

            <span className="w-px h-5 bg-slate-300 mx-1" />

            {/* Group: Inline Formatting */}
            <button
              type="button"
              onClick={() => execCmd('bold')}
              className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 rounded hover:bg-slate-200 hover:text-slate-900 text-sm"
              title="Tebal / Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => execCmd('italic')}
              className="w-7 h-7 flex items-center justify-center italic text-slate-700 rounded hover:bg-slate-200 hover:text-slate-900 text-sm"
              title="Miring / Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => execCmd('underline')}
              className="w-7 h-7 flex items-center justify-center underline text-slate-700 rounded hover:bg-slate-200 hover:text-slate-900 text-sm"
              title="Garis Bawah / Underline (Ctrl+U)"
            >
              <u>U</u>
            </button>

            <span className="w-px h-5 bg-slate-300 mx-1" />

            {/* Group: Lists */}
            <button
              type="button"
              onClick={() => execCmd('insertUnorderedList')}
              className="w-7 h-7 flex items-center justify-center text-slate-700 rounded hover:bg-slate-200 hover:text-slate-900"
              title="Daftar Poin (Bullet List)"
            >
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            </button>
            <button
              type="button"
              onClick={() => execCmd('insertOrderedList')}
              className="w-7 h-7 flex items-center justify-center text-slate-700 rounded hover:bg-slate-200 hover:text-slate-900"
              title="Daftar Nomor (Numbered List)"
            >
              <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
            </button>

            <span className="w-px h-5 bg-slate-300 mx-1" />

            {/* Clear Formatting */}
            <button
              type="button"
              onClick={() => execCmd('removeFormat')}
              className="w-7 h-7 flex items-center justify-center text-slate-500 rounded hover:bg-slate-200 hover:text-red-600"
              title="Bersihkan Format Teks"
            >
              <span className="material-symbols-outlined text-[18px]">format_clear</span>
            </button>
          </div>
        )}

        {/* Mode 1: Visual Editor (ContentEditable) */}
        {mode === 'visual' ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleVisualInput}
            onBlur={handleVisualInput}
            className="p-4 outline-none text-slate-800 text-sm leading-relaxed overflow-y-auto prose max-w-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-3 [&_h3]:mb-1.5 [&_p]:mb-2.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1"
            style={{ minHeight }}
            data-placeholder={placeholder}
          />
        ) : (
          /* Mode 2: Code Editor (Raw HTML) */
          <div className="flex flex-col">
            <textarea
              rows={9}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Ketik atau tempel kode HTML langsung di sini..."
              className="w-full p-4 font-mono text-xs text-slate-800 outline-none resize-y bg-slate-900 text-slate-100 leading-relaxed"
              style={{ minHeight }}
            />
            <div className="px-3 py-1.5 bg-slate-800 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-700">
              <span>Mode Editor HTML Mentah (Dukungan penuh tag standar)</span>
              <span>Klik tab 'Tampilan Visual (Word)' untuk melihat pratinjaunya</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

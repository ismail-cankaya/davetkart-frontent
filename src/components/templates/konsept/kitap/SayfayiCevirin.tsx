import React from 'react';

/**
 * Bez kapağın en altındaki kaydırma ipucu: "Sayfayı çevirin" ve aşağı ok,
 * yaldız. Zarfsız hero'da kapağın altından ilk sayfa geldiğini söyler.
 * Bilgi değil yönlendirmedir; ok süstür (`aria-hidden`). Kıpırdamaz.
 */
export function SayfayiCevirin() {
  return (
    <div className="flex flex-col items-center gap-2 text-[#C9A35C]">
      <p className="text-[11px] uppercase tracking-[0.26em]">Sayfayı çevirin</p>
      <svg aria-hidden="true" viewBox="0 0 16 10" width="14" height="9" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M1 1.5 L8 8.5 L15 1.5" />
      </svg>
    </div>
  );
}

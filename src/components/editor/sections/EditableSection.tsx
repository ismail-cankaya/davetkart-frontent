import React, { Suspense, lazy } from 'react';
import { useTextEditor } from '../../../invitationText/InvitationTextContext';

/** "Ayarlar" çipi ayrı parça: misafir sayfası indirmez (paket bütçesi, K237). */
const SectionChip = lazy(() => import('./SectionChip'));

/**
 * Editör önizlemesinde bir bölümü sarar (Faz 25, K307): üzerine gelince çerçeve ve "ayarlar" çipi,
 * metin dışı bir yere tıklayınca bölümün ayar paneli açılır. Misafir sayfasında (köprü yok) hiçbir şey eklemez.
 */
export function EditableSection({ id, children }: { id: string; children: React.ReactNode }) {
  const editor = useTextEditor();
  if (!editor) return <>{children}</>;

  return (
    <div
      data-edit-section={id}
      className="group/section relative cursor-pointer outline outline-2 -outline-offset-2 outline-transparent hover:outline-[#d946ef]/40 transition-[outline-color] duration-200"
      onClick={(event) => {
        // Metne tıklama kendi düzenleyicisini açar (EditableTextMark yayılımı durdurur);
        // form öğeleri (LCV) önizlemede de çalışsın.
        const target = event.target as HTMLElement;
        if (target.closest('input, select, textarea, a, button:not([data-edit-chip])')) return;
        editor.openSection(id);
      }}
    >
      <Suspense fallback={null}>
        <SectionChip id={id} onOpen={() => editor.openSection(id)} />
      </Suspense>
      {children}
    </div>
  );
}

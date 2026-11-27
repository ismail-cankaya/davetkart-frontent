import { useCallback } from 'react';
import { useInvitationStore } from '../../../stores/useInvitationStore';
import { scrollToTarget } from '../../../hooks/useLenis';
import type { ShowcaseSlide } from './showcaseSlides';

/** Önizleme bölümünün kimliği (PreviewSection). */
const PREVIEW_SECTION_ID = 'animasyon-ve-onizleme';

/**
 * Vitrindeki telefona basınca: o şablonu önizlemede seçer ve önizlemeye kayar (TemplateGrid kartıyla aynı
 * seçim: önce kategori, sonra şablon).
 */
export function useShowcaseSelect(): (slide: ShowcaseSlide) => void {
  const updateField = useInvitationStore((s) => s.updateField);
  const selectTemplate = useInvitationStore((s) => s.selectTemplate);

  return useCallback(
    (slide: ShowcaseSlide) => {
      updateField('categoryId', slide.categoryId);
      selectTemplate(slide.presetId);
      scrollToTarget(PREVIEW_SECTION_ID);
    },
    [updateField, selectTemplate]
  );
}

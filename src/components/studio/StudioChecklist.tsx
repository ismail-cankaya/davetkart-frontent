import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, TriangleAlert } from 'lucide-react';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useStudioStore } from '../../stores/useStudioStore';
import { readinessItems, type ReadinessItem } from '../../utils/readiness';
import '../../i18nEditor';

/** Kontrol listesinin özeti: üst çubuktaki "Hazır n/m". */
export function useReadiness(): { items: ReadinessItem[]; done: number; total: number } {
  const invitation = useInvitationStore((s) => s.invitation);
  return useMemo(() => {
    const items = readinessItems(invitation);
    return { items, done: items.filter((item) => item.ok).length, total: items.length };
  }, [invitation]);
}

/** Maddeye tıklamak ilgili yeri açar: alan → Bilgiler sekmesi; LCV → bölüm ayarı (K325). */
function openTarget(item: ReadinessItem): void {
  if ('section' in item.target) {
    useEditorStore.getState().openSection(item.target.section);
    return;
  }
  useStudioStore.getState().setTab('info', true);
}

/** Sol menü → Kontrol (K325): eksikler, taşan metinler. Uyarıdır; yayını engellemez. */
export function StudioChecklist() {
  const { t } = useTranslation();
  const { items, done, total } = useReadiness();
  const overflowCount = useStudioStore((s) => s.overflowCount);

  return (
    <div className="space-y-4">
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden>
        <div className="h-full rounded-full bg-gradient-to-r from-gold to-champagne transition-[width] duration-500" style={{ width: `${(done / total) * 100}%` }} />
      </div>
      {done === total && overflowCount === 0 && <p className="text-xs text-emerald-100/80">{t('textEditor.studio.ready.allDone')}</p>}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5">
            <span className={`flex items-center gap-2 text-[12.5px] ${item.ok ? 'text-white/60' : 'text-white'}`}>
              {item.ok ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Circle size={15} className="text-gold" />}
              {t(`textEditor.studio.ready.${item.id}`)}
            </span>
            {!item.ok && (
              <button type="button" onClick={() => openTarget(item)} className="text-[11px] font-semibold text-gold hover:text-champagne cursor-pointer">
                {t('textEditor.studio.ready.fix')}
              </button>
            )}
          </li>
        ))}
      </ul>
      {overflowCount > 0 && (
        <p role="status" className="flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-[12px] text-rose-100">
          <TriangleAlert size={15} className="mt-0.5 shrink-0 text-rose-300" />
          <span>
            <strong className="block">{t('textEditor.studio.overflow.chip', { count: overflowCount })}</strong>
            {t('textEditor.studio.overflow.hint')}
          </span>
        </p>
      )}
    </div>
  );
}

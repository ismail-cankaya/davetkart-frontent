import React, { use, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EyeOff, PenLine, Redo2, RotateCcw, Type, Undo2 } from 'lucide-react';
import { TEXT_SLOTS } from '../../../contracts/textSlots';
import { useEditorStore } from '../../../stores/useEditorStore';
import { useInvitationStore } from '../../../stores/useInvitationStore';
import { defaultText, loadTextBundle } from '../../../invitationText/resolve';
import { overrideCount } from '../../../invitationText/overrides';
import { DEFAULT_INVITATION_LOCALE, isInvitationLocale } from '../../../invitationText/types';
import type { Invitation } from '../../../types';
import { confirmAction } from '../../ui/ConfirmDialog';
import { cn } from '../../../utils/cn';
import '../../../i18nEditor';

/** Grup sırası (davetiyedeki sırayla) ve grubun görünmesi için açık olması gereken bölüm. */
const GROUPS: ReadonlyArray<{ id: string; flag?: keyof Invitation }> = [
  { id: 'envelope', flag: 'showEnvelope' },
  { id: 'hero' },
  { id: 'label' },
  { id: 'design' },
  { id: 'countdown', flag: 'showTimer' },
  { id: 'timeline', flag: 'showTimeline' },
  { id: 'details' },
  { id: 'gallery', flag: 'showGallery' },
  { id: 'gift', flag: 'showGift' },
  { id: 'rsvp', flag: 'showRSVP' }
];

/**
 * "Metinler" paneli (Faz 25, K306): davetiyedeki bütün düzenlenebilir metinler bölüm bölüm. Önizlemede tıklamanın
 * klavye ve ekran okuyucu yolu; aynı yerinde düzenleyiciyi açar. Değişen ve bu tasarımda görünmeyen metinleri işaretler,
 * geri al / yinele ve "tümünü sıfırla" (onaylı, K308) buradadır.
 */
export function TextsPanel() {
  const { t } = useTranslation();
  const invitation = useInvitationStore((s) => s.invitation);
  const scope = useEditorStore((s) => s.scope);
  const seenKeys = useEditorStore((s) => s.seenKeys);
  const history = useEditorStore((s) => s.history);
  const selectText = useEditorStore((s) => s.selectText);
  const resetTexts = useEditorStore((s) => s.resetTexts);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);

  const locale = isInvitationLocale(invitation.locale) ? invitation.locale : DEFAULT_INVITATION_LOCALE;
  // Varsayılanlar tembel pakette (önizleme genelde çoktan indirmiştir); yoksa panel kısa süre bekler.
  use(loadTextBundle(locale));
  const own = invitation.textOverrides?.[locale] ?? {};
  const count = overrideCount(invitation.textOverrides, locale);

  const groups = useMemo(() => {
    const lookup = {
      locale,
      categoryId: scope?.categoryId ?? invitation.categoryId,
      scopes: scope?.scopes,
      runtimeDefaults: scope?.runtimeDefaults
    };
    return GROUPS.filter((group) => !group.flag || invitation[group.flag]).map((group) => ({
      id: group.id,
      rows: Object.entries(TEXT_SLOTS.slots)
        .filter(([, slot]) => slot.group === group.id)
        // Bu tasarımın çizdiği metinler (Faz 26: hero etiketleri tasarıma özel); tasarım henüz bildirmediyse hepsi.
        .filter(([key]) => seenKeys.length === 0 || seenKeys.includes(key) || own[key] !== undefined)
        .map(([key]) => ({ key, defaultValue: defaultText(key, lookup) }))
        .filter((row): row is { key: string; defaultValue: string } => row.defaultValue !== undefined)
    })).filter((group) => group.rows.length > 0);
  }, [invitation, locale, scope, seenKeys, own]);

  // Görünmeyen = kullanıcı değiştirmiş ama bu tasarım çizmiyor (K309). Tasarım henüz bir şey çizmediyse sayılmaz.
  const hidden = seenKeys.length === 0 ? [] : Object.keys(own).filter((key) => !seenKeys.includes(key));

  const resetAll = async () => {
    const confirmed = await confirmAction({
      title: t('textEditor.panel.resetAllTitle'),
      description: t('textEditor.panel.resetAllBody', { count }),
      confirmLabel: t('textEditor.panel.resetAllConfirm'),
      cancelLabel: t('textEditor.inline.cancel'),
      tone: 'danger'
    });
    if (confirmed) resetTexts();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-bold tracking-wider uppercase text-champagne flex items-center gap-2">
          <Type size={13} className="text-gold" />
          {t('textEditor.panel.title')}
          <span className="rounded-full border border-gold/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
            {t('textEditor.panel.elit')}
          </span>
        </h3>
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={undo}
            disabled={history.past.length === 0}
            className="rounded-full p-1.5 text-champagne/80 hover:bg-white/10 disabled:opacity-30 cursor-pointer disabled:cursor-default"
            aria-label={t('textEditor.panel.undo')}
            title={`${t('textEditor.panel.undo')} (Ctrl+Z)`}
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={history.future.length === 0}
            className="rounded-full p-1.5 text-champagne/80 hover:bg-white/10 disabled:opacity-30 cursor-pointer disabled:cursor-default"
            aria-label={t('textEditor.panel.redo')}
            title={`${t('textEditor.panel.redo')} (Ctrl+Shift+Z)`}
          >
            <Redo2 size={15} />
          </button>
        </span>
      </div>
      <p className="text-emerald-100/60 text-[11px] leading-relaxed">{t('textEditor.panel.hint')}</p>

      {hidden.length > 0 && (
        <p className="flex items-start gap-2 rounded-xl border border-gold/25 bg-gold/10 px-3 py-2 text-[11px] leading-relaxed text-champagne">
          <EyeOff size={13} className="mt-0.5 shrink-0" />
          {t('textEditor.panel.hiddenCount', { count: hidden.length })}
        </p>
      )}

      <div className="max-h-[26rem] space-y-4 overflow-y-auto pr-1" data-lenis-prevent>
        {groups.map((group) => (
          <section key={group.id} aria-label={t(`textEditor.panel.groups.${group.id}`)}>
            <h4 className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              {t(`textEditor.panel.groups.${group.id}`)}
            </h4>
            <ul className="space-y-1">
              {group.rows.map(({ key, defaultValue }) => {
                const changed = own[key] !== undefined;
                const current = own[key] ?? defaultValue;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        selectText({
                          key,
                          anchor: { top: rect.top, left: rect.left, bottom: rect.bottom, right: rect.right },
                          text: current,
                          defaultText: defaultValue
                        });
                      }}
                      className={cn(
                        'group flex w-full items-start gap-2.5 rounded-xl border px-3 py-2 text-left transition duration-200 cursor-pointer',
                        changed ? 'border-gold/40 bg-champagne/10' : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                      )}
                    >
                      <PenLine size={13} className="mt-0.5 shrink-0 text-gold/80" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] text-white/90">{current}</span>
                        {changed && (
                          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-gold/90">
                            {t('textEditor.panel.changed')}
                            {hidden.includes(key) && ` · ${t('textEditor.panel.hidden')}`}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {count > 0 && (
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-[11px] font-semibold text-white/80 hover:border-white/40 hover:text-white cursor-pointer"
        >
          <RotateCcw size={13} />
          {t('textEditor.panel.resetAll', { count })}
        </button>
      )}
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Settings2 } from 'lucide-react';
import { MODULE_FLAGS, useEditorStore, type ModuleId } from '../../../stores/useEditorStore';
import { useInvitationStore } from '../../../stores/useInvitationStore';
import { PLAN_RULES } from '../../../contracts/planRules';
import { Switch } from '../../ui/Switch';
import { toast } from '../../ui/Toast';
import { duration, ease } from '../../../utils/motion';
import { cn } from '../../../utils/cn';
import '../../../i18nEditor';

const MODULES = Object.keys(MODULE_FLAGS) as ModuleId[];

/** Ayar paneli olan modüller; zarf ve geri sayımın ayarı yok (açık/kapalı). */
export const MODULES_WITH_SETTINGS: ReadonlySet<ModuleId> = new Set(['timeline', 'gallery', 'gift', 'rsvp']);

/** Bir modülün gerektirdiği en düşük paket (sözleşmeden, K305 ile aynı kaynak). */
function moduleTier(id: ModuleId): string | undefined {
  return PLAN_RULES.moduleTiers[`show_${id === 'rsvp' ? 'rsvp' : id}`];
}

/** Bir modülü açar ve ayarı varsa ayar panelini açar (➕ akışı, K307). */
export function useAddModule(): (id: ModuleId) => void {
  const { t } = useTranslation();
  const setModule = useEditorStore((s) => s.setModule);
  const openSection = useEditorStore((s) => s.openSection);
  return (id) => {
    setModule(id, true);
    if (MODULES_WITH_SETTINGS.has(id)) openSection(id);
    else toast(t('textEditor.modules.added', { label: t(`textEditor.sections.${id}`) }));
  };
}

function TierBadge({ id }: { id: ModuleId }) {
  const { t } = useTranslation();
  const tier = moduleTier(id);
  if (!tier || tier === PLAN_RULES.tierOrder[0]) return null;
  return (
    <span className="rounded-full border border-gold/40 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
      {t('textEditor.modules.tier', { tier: tier.charAt(0).toLocaleUpperCase('tr-TR') + tier.slice(1) })}
    </span>
  );
}

/**
 * ➕ Bölüm ekle (Faz 25, K307): davetiyede olmayan bölümleri listeler; seçilen bölüm şablondaki sabit
 * yerinde açılır (sıra değişmez) ve ayarı varsa ayar paneli açılır. Paket dışı bölüm de eklenebilir:
 * kilit yayında (bugünkü kural), rozet hangi paketin gerektiğini söyler.
 */
export function AddModuleButton({ className }: { className?: string }) {
  const { t } = useTranslation();
  const invitation = useInvitationStore((s) => s.invitation);
  const addModule = useAddModule();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const missing = MODULES.filter((id) => !invitation[MODULE_FLAGS[id]]);

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand/20 hover:bg-brand-soft cursor-pointer"
      >
        <Plus size={15} strokeWidth={2.5} />
        {t('textEditor.modules.add')}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: duration.fast, ease: ease.out }}
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
            className="absolute right-0 z-40 mt-2 w-72 rounded-2xl border border-ink/10 bg-cream p-2 text-ink shadow-2xl shadow-ink/20"
          >
            <p className="px-2.5 pb-2 pt-1 text-[11px] leading-relaxed text-muted">{t('textEditor.modules.addHint')}</p>
            {missing.length === 0 && <p className="px-2.5 py-2 text-xs text-muted">{t('textEditor.modules.none')}</p>}
            {missing.map((id) => (
              <button
                key={id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  addModule(id);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left text-sm hover:bg-brand/5 cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <Plus size={13} className="text-brand" />
                  {t(`textEditor.sections.${id}`)}
                </span>
                <TierBadge id={id} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Tasarım stüdyosundaki "Bölümler" listesi: her bölüm için aç/kapa ve ayarlar. */
export function ModuleList() {
  const { t } = useTranslation();
  const invitation = useInvitationStore((s) => s.invitation);
  const setModule = useEditorStore((s) => s.setModule);
  const openSection = useEditorStore((s) => s.openSection);
  const addModule = useAddModule();

  const toggle = (id: ModuleId, on: boolean) => {
    if (on) {
      addModule(id);
      return;
    }
    setModule(id, false);
    toast(t('textEditor.modules.hidden', { label: t(`textEditor.sections.${id}`) }), 'info');
  };

  return (
    <ul className="space-y-2">
      {MODULES.map((id) => {
        const on = Boolean(invitation[MODULE_FLAGS[id]]);
        return (
          <li
            key={id}
            className={cn(
              'flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5',
              on ? 'border-gold/30 bg-white/[0.06]' : 'border-white/10 bg-white/[0.02]'
            )}
          >
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-white">
              {t(`textEditor.sections.${id}`)}
              <TierBadge id={id} />
            </span>
            <span className="flex items-center gap-2">
              {on && MODULES_WITH_SETTINGS.has(id) && (
                <button
                  type="button"
                  onClick={() => openSection(id)}
                  className="rounded-full p-1.5 text-champagne/80 hover:bg-white/10 hover:text-champagne cursor-pointer"
                  aria-label={t('textEditor.sectionSettings', { label: t(`textEditor.sections.${id}`) })}
                >
                  <Settings2 size={14} />
                </button>
              )}
              <Switch checked={on} onChange={(value) => toggle(id, value)} label={t(`textEditor.sections.${id}`)} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

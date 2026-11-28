import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'motion/react';
import { CheckSquare, LayoutList, Palette, Type, UserRound, X, type LucideIcon } from 'lucide-react';
import { useStudioStore, type StudioTab } from '../../stores/useStudioStore';
import { ModuleList, AddModuleButton } from '../editor/sections/ModuleControls';
import { TextsPanel } from '../editor/text/TextsPanel';
import { StudioInfoFields } from './StudioInfoFields';
import { StudioThemeFields } from './StudioThemeFields';
import { StudioChecklist, useReadiness } from './StudioChecklist';
import { studioPanel } from './studioStyles';
import { cn } from '../../utils/cn';
import { duration, ease } from '../../utils/motion';
import '../../i18nEditor';

const TABS: ReadonlyArray<{ id: StudioTab; icon: LucideIcon }> = [
  { id: 'info', icon: UserRound },
  { id: 'sections', icon: LayoutList },
  { id: 'texts', icon: Type },
  { id: 'theme', icon: Palette },
  { id: 'checklist', icon: CheckSquare }
];

/** Seçili sekmenin içeriği; masaüstü panelinde ve telefonun alttan panelinde aynı. */
function TabContent({ tab }: { tab: StudioTab }) {
  switch (tab) {
    case 'info':
      return <StudioInfoFields />;
    case 'sections':
      return (
        <div className="space-y-4">
          <AddModuleButton className="w-full" />
          <ModuleList />
        </div>
      );
    case 'texts':
      return (
        <Suspense fallback={null}>
          <TextsPanel />
        </Suspense>
      );
    case 'theme':
      return <StudioThemeFields />;
    case 'checklist':
      return <StudioChecklist />;
  }
}

/** Eksik madde sayısı rozeti (Kontrol sekmesi). */
function useMissingCount(): number {
  const { done, total } = useReadiness();
  const overflow = useStudioStore((s) => s.overflowCount);
  return total - done + (overflow > 0 ? 1 : 0);
}

/**
 * Sol menü (Faz 28, K319): ikon rayı + seçili sekmenin paneli. Bugünkü tasarımcı panelinin parçaları sekmelere bölünür.
 * Ayrıntı: docs/rehber/src/components/studio/StudioSidebar.md
 */
export function StudioSidebar() {
  const { t } = useTranslation();
  const tab = useStudioStore((s) => s.tab);
  const setTab = useStudioStore((s) => s.setTab);
  const missing = useMissingCount();

  return (
    <aside className={cn('hidden lg:flex h-full shrink-0 border-r border-white/10', studioPanel)} aria-label={t('textEditor.studio.title')}>
      <nav className="flex w-[72px] flex-col items-center gap-1.5 border-r border-white/10 py-4" role="tablist" aria-orientation="vertical">
        {TABS.map(({ id, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="studio-panel"
              onClick={() => setTab(id)}
              className={cn(
                'relative flex w-14 flex-col items-center gap-1 rounded-xl py-2.5 text-[10px] font-semibold transition-colors duration-200 cursor-pointer',
                active ? 'bg-white/10 text-champagne' : 'text-white/55 hover:bg-white/5 hover:text-white'
              )}
            >
              {active && <motion.span layoutId="studio-tab" className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gold" />}
              <Icon size={18} />
              {t(`textEditor.studio.tabs.${id}`)}
              {id === 'checklist' && missing > 0 && (
                <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-brand-deep">{missing}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div id="studio-panel" role="tabpanel" className="flex w-[320px] flex-col">
        <header className="border-b border-white/10 px-5 pb-3.5 pt-5">
          <h2 className="font-serif text-lg font-bold">{t(`textEditor.studio.tabs.${tab}`)}</h2>
          <p className="mt-0.5 text-[11.5px] text-emerald-100/60">{t(`textEditor.studio.tabHints.${tab}`)}</p>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5" data-lenis-prevent>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: duration.base, ease: ease.out }}>
              <TabContent tab={tab} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}

/** Telefonda: altta sekme çubuğu; sekme alttan panelde açılır, tuval tam ekran kalır (K319). */
export function StudioMobileBar() {
  const { t } = useTranslation();
  const tab = useStudioStore((s) => s.tab);
  const sheetOpen = useStudioStore((s) => s.sheetOpen);
  const setTab = useStudioStore((s) => s.setTab);
  const closeSheet = useStudioStore((s) => s.closeSheet);
  const missing = useMissingCount();

  return (
    <>
      <nav className={cn('lg:hidden flex shrink-0 items-stretch justify-around border-t border-white/10 pb-[env(safe-area-inset-bottom)]', studioPanel)} role="tablist">
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={sheetOpen && tab === id}
            onClick={() => (sheetOpen && tab === id ? closeSheet() : setTab(id, true))}
            className={cn('relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold cursor-pointer', sheetOpen && tab === id ? 'text-champagne' : 'text-white/60')}
          >
            <Icon size={18} />
            {t(`textEditor.studio.tabs.${id}`)}
            {id === 'checklist' && missing > 0 && <span className="absolute right-[22%] top-1.5 h-2 w-2 rounded-full bg-gold" />}
          </button>
        ))}
      </nav>
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div className="lg:hidden fixed inset-0 z-[60] bg-ink/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSheet} aria-hidden />
            <motion.section
              role="dialog"
              aria-label={t(`textEditor.studio.tabs.${tab}`)}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: duration.panel, ease: ease.out }}
              className={cn('lg:hidden fixed inset-x-0 bottom-0 z-[61] flex max-h-[72dvh] flex-col rounded-t-3xl shadow-2xl', studioPanel)}
            >
              <header className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <h2 className="font-serif text-lg font-bold">{t(`textEditor.studio.tabs.${tab}`)}</h2>
                <button type="button" onClick={closeSheet} aria-label={t('textEditor.studio.mobile.close')} className="rounded-full p-1.5 text-white/70 hover:bg-white/10 cursor-pointer">
                  <X size={18} />
                </button>
              </header>
              <div className="flex-1 overflow-y-auto px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]" data-lenis-prevent>
                <TabContent tab={tab} />
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

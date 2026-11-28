import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Laptop, Maximize2, Minimize2, Minus, Plus, Smartphone, Tablet, type LucideIcon } from 'lucide-react';
import { DeviceCanvas } from './canvas/DeviceCanvas';
import { DEVICE_ORDER, ZOOM_STEPS } from './canvas/deviceViewports';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useStudioStore } from '../../stores/useStudioStore';
import { useTextEditorBridge } from '../../hooks/useTextEditorBridge';
import { useCanvasPicker } from '../../hooks/useCanvasPicker';
import { useMinWidth } from '../../hooks/useMinWidth';
import type { PreviewDevice } from '../../types';
import { cn } from '../../utils/cn';
import '../../i18nEditor';

const DEVICE_ICONS: Record<PreviewDevice, LucideIcon> = { phone: Smartphone, tablet: Tablet, laptop: Laptop };

/** Tuval ve altındaki çubuk (Faz 28, K319, K320): cihaz, yakınlaştırma, tam ekranda düzenle. */
export function StudioCanvasArea() {
  const { t } = useTranslation();
  const invitation = useInvitationStore((s) => s.invitation);
  const presetId = useInvitationStore((s) => s.activePresetId);
  const device = useStudioStore((s) => s.device);
  const zoom = useStudioStore((s) => s.zoom);
  const focusMode = useStudioStore((s) => s.focusMode);
  const { setDevice, setZoom, setFocusMode, setOverflowCount } = useStudioStore.getState();
  const bridge = useTextEditorBridge();
  const picker = useCanvasPicker();
  const [scale, setScale] = useState(1);
  // Telefonda (< 640 px) telefon önizlemesi çerçevesiz ve ekran genişliğinde: misafirin göreceği gibi.
  const bare = !useMinWidth(640) && device === 'phone';
  const onOverflow = useCallback((count: number) => setOverflowCount(count), [setOverflowCount]);

  const percent = Math.round(scale * 100);
  const step = (direction: 1 | -1) => {
    const next = direction > 0 ? ZOOM_STEPS.find((z) => z > percent) : [...ZOOM_STEPS].reverse().find((z) => z < percent);
    if (next) setZoom(next);
  };

  // Tam ekranda düzenle: tarayıcının tam ekranı da açılır; Esc ile çıkılınca kip de kapanır.
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) useStudioStore.getState().setFocusMode(false);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  const toggleFocus = () => {
    const next = !focusMode;
    setFocusMode(next);
    if (next) void document.documentElement.requestFullscreen?.().catch(() => undefined);
    else if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
  };

  const control = 'grid h-9 w-9 place-items-center rounded-full text-ink/70 hover:bg-ink/5 hover:text-ink transition-colors cursor-pointer disabled:opacity-40';

  return (
    <main className="relative flex min-w-0 flex-1 flex-col bg-[#ECE8E1] [background-image:radial-gradient(rgba(20,40,30,0.08)_1px,transparent_1px)] [background-size:18px_18px]">
      <div className="min-h-0 flex-1">
        <DeviceCanvas
          device={device}
          zoom={zoom}
          textEditor={bridge}
          picker={picker}
          onOverflowChange={onOverflow}
          onScaleChange={setScale}
          title={t('textEditor.studio.canvas')}
          insetBottom={72}
          bare={bare}
        >
          {(editor) => <TemplateRenderer templateId={presetId} invitation={invitation} mode="preview" textEditor={editor} />}
        </DeviceCanvas>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-ink/10 bg-white/90 px-2 py-1.5 shadow-xl shadow-ink/10 backdrop-blur"
        >
          <div role="radiogroup" aria-label={t('textEditor.studio.device.label')} className="flex items-center gap-0.5">
            {DEVICE_ORDER.map((id) => {
              const Icon = DEVICE_ICONS[id];
              const active = device === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  title={t(`textEditor.studio.device.${id}`)}
                  onClick={() => setDevice(id)}
                  className={cn(
                    'flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors cursor-pointer',
                    active ? 'bg-brand text-white' : 'text-ink/70 hover:bg-ink/5'
                  )}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{t(`textEditor.studio.device.${id}`)}</span>
                </button>
              );
            })}
          </div>
          <span className="mx-1 h-5 w-px bg-ink/10" aria-hidden />
          <div role="group" aria-label={t('textEditor.studio.zoom.label')} className="hidden sm:flex items-center gap-0.5">
            <button type="button" className={control} onClick={() => step(-1)} aria-label={t('textEditor.studio.zoom.out')}>
              <Minus size={15} />
            </button>
            <button
              type="button"
              onClick={() => setZoom('fit')}
              className={cn('h-9 min-w-[64px] rounded-full px-2 text-xs font-semibold tabular-nums cursor-pointer', zoom === 'fit' ? 'text-brand' : 'text-ink/70 hover:bg-ink/5')}
              title={t('textEditor.studio.zoom.fit')}
            >
              {zoom === 'fit' ? t('textEditor.studio.zoom.fit') : `%${percent}`}
            </button>
            <button type="button" className={control} onClick={() => step(1)} aria-label={t('textEditor.studio.zoom.in')}>
              <Plus size={15} />
            </button>
            <span className="mx-1 h-5 w-px bg-ink/10" aria-hidden />
          </div>
          <button
            type="button"
            onClick={toggleFocus}
            aria-pressed={focusMode}
            className="flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-ink/70 hover:bg-ink/5 cursor-pointer"
          >
            {focusMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span className="hidden md:inline">{focusMode ? t('textEditor.studio.focus.exit') : t('textEditor.studio.focus.enter')}</span>
          </button>
        </motion.div>
      </div>
    </main>
  );
}

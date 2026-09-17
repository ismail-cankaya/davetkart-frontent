import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';
import { TimelineEvent } from '../../types';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { cn } from '../../utils/cn';
import { createTimelineEvent } from '../../utils/timelineEvents';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

interface TimelineEditorProps {
  inputClass: string;
}

/** Güncel adım listesi — işleyiciler render anındaki kopyaya değil store'a bakar. */
const currentEvents = (): TimelineEvent[] => useInvitationStore.getState().invitation.timelineEvents;

/**
 * Wizard editor for the invitation's program flow. Writes straight to the
 * store — every keystroke is visible in the phone preview's timeline.
 *
 * 🔴 K44: kimliği backend üretir. Yeni adım `id: null` ile doğar; React'in
 * `key` ihtiyacını ayrı bir `localKey` karşılar. Ayrıntılı açıklama:
 * docs/rehber/src/components/create/TimelineEditor.md
 *
 * Sihirbaz iki boş adımla açılır; eklenen her adım da boş doğar (örnek saat ya
 * da başlık yazılmaz). Önizleme yalnızca en az bir alanı dolu adımları çizer.
 */
export function TimelineEditor({ inputClass }: TimelineEditorProps) {
  const events = useInvitationStore((s) => s.invitation.timelineEvents);
  const updateField = useInvitationStore((s) => s.updateField);

  const commit = (next: TimelineEvent[]) => updateField('timelineEvents', next);

  // Eşleştirme localKey ile yapılır: `id` null olabilir ve birden çok yeni
  // adımda AYNI olurdu.
  //
  // 🔴 Liste store'dan taze okunur: kaydetme yanıtı araya girip adımlara
  // sunucu kimliği yazmış olabilir. Render anındaki kopyayla yazmak o
  // kimlikleri null'a geri çevirir ve bir sonraki kaydetme satırları yeniden
  // oluştururdu.
  const patchEvent = (localKey: string, patch: Partial<TimelineEvent>) =>
    commit(currentEvents().map((event) => (event.localKey === localKey ? { ...event, ...patch } : event)));

  const addEvent = () => commit([...currentEvents(), createTimelineEvent()]);

  // Son adım da silinebilir: liste boş kalınca editör yalnızca ekleme
  // düğmesini gösterir, önizleme program bölümünü gizler, kaydetme boş listeyi
  // "tüm adımları sil" olarak iletir.
  const removeEvent = (localKey: string) =>
    commit(currentEvents().filter((event) => event.localKey !== localKey));

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {events.map((event, index) => (
          <motion.div
            key={event.localKey}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE_LUXE }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold tracking-widest text-champagne/70 uppercase shrink-0 w-14">
                  {index + 1}. Adım
                </span>
                <input
                  type="time"
                  value={event.time}
                  onChange={(e) => patchEvent(event.localKey, { time: e.target.value })}
                  className={cn(inputClass, 'w-28 px-2.5 py-2 [color-scheme:dark]')}
                  aria-label={`${index + 1}. adımın saati`}
                />
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => patchEvent(event.localKey, { title: e.target.value })}
                  placeholder="Adım başlığını giriniz"
                  className={cn(inputClass, 'flex-1 min-w-0 px-2.5 py-2')}
                  aria-label={`${index + 1}. adımın başlığı`}
                />
                <button
                  type="button"
                  onClick={() => removeEvent(event.localKey)}
                  aria-label={`${index + 1}. adımı sil`}
                  className="shrink-0 w-8 h-8 rounded-lg border border-white/10 text-white/40 hover:text-rose-300 hover:border-rose-400/40 flex items-center justify-center transition-colors duration-300 cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <input
                type="text"
                value={event.description}
                onChange={(e) => patchEvent(event.localKey, { description: e.target.value })}
                placeholder="Kısa açıklama giriniz (opsiyonel)"
                className={cn(inputClass, 'px-2.5 py-2')}
                aria-label={`${index + 1}. adımın açıklaması`}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <p className="text-[11px] text-white/40 leading-relaxed" aria-live="polite">
        {events.length === 0
          ? 'Program akışında henüz adım yok. Aşağıdan yeni bir adım ekleyebilirsiniz.'
          : 'Yalnızca doldurduğunuz adımlar davetiyenizde gösterilir.'}
      </p>

      <button
        type="button"
        onClick={addEvent}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 hover:border-gold/50 text-white/60 hover:text-champagne py-2.5 text-xs font-semibold transition-colors duration-300 cursor-pointer"
      >
        <Plus size={14} />
        Program Adımı Ekle
      </button>
    </div>
  );
}

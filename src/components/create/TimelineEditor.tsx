import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';
import { TimelineEvent } from '../../types';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { cn } from '../../utils/cn';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

interface TimelineEditorProps {
  inputClass: string;
}

/**
 * Wizard editor for the invitation's program flow. Writes straight to the
 * store — every keystroke is visible in the phone preview's timeline.
 *
 * 🔴 K44: kimliği backend üretir. Yeni adım `id: null` ile doğar; React'in
 * `key` ihtiyacını ayrı bir `localKey` karşılar. Ayrıntılı açıklama:
 * docs/rehber/src/components/create/TimelineEditor.md
 */
export function TimelineEditor({ inputClass }: TimelineEditorProps) {
  const events = useInvitationStore((s) => s.invitation.timelineEvents);
  const updateField = useInvitationStore((s) => s.updateField);

  const commit = (next: TimelineEvent[]) => updateField('timelineEvents', next);

  // Eşleştirme localKey ile yapılır: `id` null olabilir ve birden çok yeni
  // adımda AYNI olurdu.
  const patchEvent = (localKey: string, patch: Partial<TimelineEvent>) =>
    commit(events.map((event) => (event.localKey === localKey ? { ...event, ...patch } : event)));

  const addEvent = () =>
    commit([
      ...events,
      {
        id: null,
        localKey: `tl-${Date.now()}-${events.length}`,
        time: '20:00',
        title: '',
        description: ''
      }
    ]);

  const removeEvent = (localKey: string) =>
    commit(events.filter((event) => event.localKey !== localKey));

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
                  aria-label="Etkinlik saati"
                />
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) => patchEvent(event.localKey, { title: e.target.value })}
                  placeholder="Başlık (örn. Nikah Töreni)"
                  className={cn(inputClass, 'flex-1 px-2.5 py-2')}
                  aria-label="Etkinlik başlığı"
                />
                <button
                  type="button"
                  onClick={() => removeEvent(event.localKey)}
                  aria-label="Bu adımı sil"
                  className="shrink-0 w-8 h-8 rounded-lg border border-white/10 text-white/40 hover:text-rose-300 hover:border-rose-400/40 flex items-center justify-center transition-colors duration-300 cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <input
                type="text"
                value={event.description}
                onChange={(e) => patchEvent(event.localKey, { description: e.target.value })}
                placeholder="Kısa açıklama (opsiyonel)"
                className={cn(inputClass, 'px-2.5 py-2')}
                aria-label="Etkinlik açıklaması"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

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

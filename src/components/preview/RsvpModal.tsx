import React from 'react';
import { motion } from 'motion/react';
import { Heart, X, ImageIcon, Play, Send } from 'lucide-react';
import { useRsvpStore } from '../../stores/useRsvpStore';
import { useUIStore } from '../../stores/useUIStore';
import { toast } from '../ui/Toast';
import { HoneypotField } from '../ui/HoneypotField';
import { toDisplayError } from '../../utils/toDisplayError';
import { RSVP_STATUSES, RSVP_STATUS_CHOICES } from '../../utils/rsvpStatus';

export function RsvpModal() {
  const draft = useRsvpStore(s => s.draft);
  const updateDraft = useRsvpStore(s => s.updateDraft);
  const attachDraftMedia = useRsvpStore(s => s.attachDraftMedia);
  const submitDraft = useRsvpStore(s => s.submitDraft);
  const setRsvpModalOpen = useUIStore(s => s.setRsvpModalOpen);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const entry = await submitDraft();
      if (!entry) return;
      setRsvpModalOpen(false);
      toast(`Teşekkürler, ${entry.guestName}! Katılım bildiriminiz kaydedildi ve canlı panele eklendi.`);
    } catch (error) {
      // Kota dolması, son tarihin geçmesi ve kopuk bağlantı farklı şeylerdir;
      // hangisi olduğunu backend'in kodu söyler.
      toast(toDisplayError(error), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMediaChange = (field: 'photo' | 'video') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        attachDraftMedia(field, file).catch((error: unknown) => {
          toast(toDisplayError(error), 'error');
        });
      }
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 150, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 150, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 p-6 flex flex-col justify-center"
    >
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-serif font-bold text-amber-200 flex items-center gap-1.5 uppercase tracking-wider">
          <Heart size={14} className="text-amber-300 fill-amber-300/20" />
          Davet Katılım Formu
        </h3>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setRsvpModalOpen(false)}
          className="p-1 text-stone-400 hover:text-white rounded-full bg-white/5 border border-white/10 transition-colors"
        >
          <X size={15} />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-4">
        <HoneypotField
          id="rsvp-website"
          value={draft.website}
          onChange={(value) => updateDraft({ website: value })}
        />

        <div>
          <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
            Misafir Adı &amp; Soyadı
          </label>
          <input
            type="text"
            required
            value={draft.guestName}
            onChange={e => updateDraft({ guestName: e.target.value })}
            placeholder="Örn. Can Doğan"
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors placeholder:text-stone-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Kişi Sayısı
            </label>
            <select
              value={draft.guestCount}
              onChange={e => updateDraft({ guestCount: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value={1}>1 Kişi</option>
              <option value={2}>2 Kişi</option>
              <option value={3}>3 Kişi</option>
              <option value={4}>4+ Kişi</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Yemek Menüsü
            </label>
            <select
              value={draft.menuPreference}
              onChange={e => updateDraft({ menuPreference: e.target.value })}
              className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Et Menü">Et Menü</option>
              <option value="Vejetaryen">Vejetaryen</option>
              <option value="Çocuk Menüsü">Çocuk Menü</option>
              <option value="Standart Menü">Standart</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
            Katılım Durumu
          </label>
          <div className="grid grid-cols-3 gap-2">
            {RSVP_STATUSES.map(st => (
              <motion.button
                key={st}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateDraft({ status: st })}
                className={`py-2 px-1 text-[10px] font-semibold rounded-lg border transition-all duration-300 ${
                  draft.status === st
                    ? 'bg-amber-400 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/20'
                    : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                }`}
              >
                {RSVP_STATUS_CHOICES[st]}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
            Çiftimize Mesajınız (İsteğe Bağlı)
          </label>
          <textarea
            rows={2}
            value={draft.message}
            onChange={e => updateDraft({ message: e.target.value })}
            placeholder="Örn. Mutluluklar dileriz..."
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors placeholder:text-stone-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Fotoğraf Ekle
            </label>
            <label className="flex items-center justify-center w-full bg-white/5 border border-white/15 border-dashed hover:border-amber-400 hover:bg-white/10 rounded-xl px-3 py-2 text-xs text-white transition-colors cursor-pointer group">
              <input type="file" accept="image/*" onChange={handleMediaChange('photo')} className="hidden" />
              <span className="flex items-center gap-1.5 group-hover:text-amber-400 text-stone-300">
                <ImageIcon size={14} /> {draft.photoUrl ? 'Değiştir' : 'Seç'}
              </span>
            </label>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Kısa Video Ekle
            </label>
            <label className="flex items-center justify-center w-full bg-white/5 border border-white/15 border-dashed hover:border-amber-400 hover:bg-white/10 rounded-xl px-3 py-2 text-xs text-white transition-colors cursor-pointer group">
              <input type="file" accept="video/*" onChange={handleMediaChange('video')} className="hidden" />
              <span className="flex items-center gap-1.5 group-hover:text-amber-400 text-stone-300">
                <Play size={14} /> {draft.videoUrl ? 'Değiştir' : 'Seç'}
              </span>
            </label>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 py-3 rounded-xl text-xs font-semibold tracking-wider shadow-lg transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
        >
          <Send size={13} />
          {submitting ? 'GÖNDERİLİYOR…' : 'YANITI GÖNDER'}
        </motion.button>
      </form>
    </motion.div>
  );
}

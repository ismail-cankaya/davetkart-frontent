import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, RefreshCw, UserCheck, Clock, X, Utensils, Trash2, ImageIcon, Play, CloudOff } from 'lucide-react';
import { useRsvpStore } from '../../stores/useRsvpStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { toast } from '../ui/Toast';
import { confirmAction } from '../ui/ConfirmDialog';
import { toDisplayError } from '../../utils/toDisplayError';
import { RSVP_STATUS_BADGE, RSVP_STATUS_LABELS } from '../../utils/rsvpStatus';
import { ease } from '../../utils/motion';

interface LiveRsvpPanelProps {
  /**
   * Panelin hangi davetiyeyi gösterdiğini anlatan başlık altı not. Yalnızca
   * kapsam belirlenmiş yüzeylerde (panel sayfası) verilir; ana sayfadaki
   * tanıtım kopyası kimliksizdir ve bu yüzden nota da ihtiyaç duymaz.
   */
  scopeSlot?: React.ReactNode;
}

export const LiveRsvpPanel = React.memo(function LiveRsvpPanel({ scopeSlot }: LiveRsvpPanelProps) {
  const rsvpList = useRsvpStore(s => s.rsvpList);
  const isLoading = useRsvpStore(s => s.isLoading);
  const remoteError = useRsvpStore(s => s.remoteError);
  const fetchRsvps = useRsvpStore(s => s.fetchRsvps);
  const startPolling = useRsvpStore(s => s.startPolling);
  const deleteRsvp = useRsvpStore(s => s.deleteRsvp);
  const invitationId = useRsvpStore(s => s.invitationId);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  // Liste ucu hem **auth'lu** hem **davetiyeye özgü**: `GET /invitations/{id}/rsvps`.
  // Kimliği olmayan yüzeyler (ana sayfadaki tanıtım paneli) yalnızca bu
  // oturumda eklenen kayıtları gösterir; onlar için istek atılmaz.
  //
  // İlk okumanın ardından panel 15 saniyede bir yenilenir. Koşullu okuma
  // sayesinde değişiklik yoksa sunucu **304** döner ve gövde hiç inmez —
  // yani canlı panel, boşta beklerken neredeyse hiçbir şeye mal olmaz.
  useEffect(() => {
    if (!isAuthenticated || !invitationId) return;

    void fetchRsvps();
    return startPolling();
  }, [isAuthenticated, invitationId, fetchRsvps, startPolling]);

  // Onay penceresi bir arayüz meselesidir; store'lar ham eylemi sunar.
  const handleDeleteRsvp = async (id: string) => {
    const approved = await confirmAction({
      title: 'Katılım kaydı silinsin mi?',
      description: 'Bu misafirin yanıtı panelden kaldırılacak ve sayımlardan düşecek.',
      confirmLabel: 'Kaydı Sil',
      tone: 'danger'
    });
    if (!approved) return;

    try {
      await deleteRsvp(id);
    } catch (error) {
      toast(toDisplayError(error), 'error');
    }
  };

  const countAttending = rsvpList.filter(r => r.status === 'attending').reduce((sum, r) => sum + r.guestCount, 0);
  const countPending = rsvpList.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.guestCount, 0);
  const countDeclines = rsvpList.filter(r => r.status === 'declined').reduce((sum, r) => sum + r.guestCount, 0);

  return (
    <section id="lcv-paneli" className="py-20 md:py-28 bg-gradient-to-b from-cream to-[#f1ede4] relative overflow-hidden scroll-mt-20">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-champagne/25 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: ease.out }}
        >
          <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Gerçek Zamanlı Takip
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-ink mb-4">
            Canlı <span className="italic text-brand font-medium">Katılım Paneli</span>
          </h2>
          <p className="text-muted text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Misafirlerinizin katılım durumlarını anlık olarak izleyin. Menü tercihlerini, kişi sayılarını ve yanıt durumlarını tek panelden yönetin.
          </p>
          {scopeSlot && <div className="mt-6">{scopeSlot}</div>}
        </motion.div>

        {/* LCV Dashboard Card */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: ease.out, delay: 0.15 }}
        >
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl shadow-ink/10 border border-ink/[0.05] relative z-10 space-y-8">

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
                  <Users className="text-brand" size={22} />
                  Misafir Takip Panosu
                </h3>
                <p className="text-xs text-muted mt-1">
                  Misafirlerinizin katılım yanıtları bu panele eşzamanlı yansır
                </p>
              </div>

              <button
                onClick={() => void fetchRsvps()}
                disabled={isLoading}
                title="Listeyi Yenile"
                className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-brand hover:border-brand/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50"
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin' : undefined} /> Yenile
              </button>
            </div>

            {/* Backend unreachable — entries already loaded stay visible */}
            {remoteError && (
              <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-xs">
                <span className="flex items-center gap-2 font-medium">
                  <CloudOff size={14} className="shrink-0" />
                  Yanıt listesi sunucudan alınamadı.
                </span>
                <button
                  onClick={() => void fetchRsvps()}
                  className="font-bold hover:text-amber-950 transition-colors cursor-pointer shrink-0"
                >
                  Tekrar Dene
                </button>
              </div>
            )}

            {/* Stats Counters */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <UserCheck size={18} />
                </div>
                <p className="text-[10px] md:text-xs font-bold text-emerald-700 uppercase tracking-wider">Katılıyor</p>
                <p className="font-serif text-2xl md:text-3xl font-bold text-emerald-800 mt-1">{countAttending}</p>
                <p className="text-[10px] text-emerald-600 font-medium">kişi</p>
              </div>
              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                  <Clock size={18} />
                </div>
                <p className="text-[10px] md:text-xs font-bold text-amber-700 uppercase tracking-wider">Belirsiz</p>
                <p className="font-serif text-2xl md:text-3xl font-bold text-amber-800 mt-1">{countPending}</p>
                <p className="text-[10px] text-amber-600 font-medium">kişi</p>
              </div>
              <div className="bg-red-50 p-5 rounded-2xl border border-red-100 text-center">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
                  <X size={18} />
                </div>
                <p className="text-[10px] md:text-xs font-bold text-red-700 uppercase tracking-wider">Katılamayacak</p>
                <p className="font-serif text-2xl md:text-3xl font-bold text-red-800 mt-1">{countDeclines}</p>
                <p className="text-[10px] text-red-600 font-medium">kişi</p>
              </div>
            </div>

            {/* Guest List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1" data-lenis-prevent>
              <AnimatePresence initial={false}>
                {rsvpList.map((rsvp) => {
                  const badgeBg = RSVP_STATUS_BADGE[rsvp.status];

                  return (
                    <motion.div
                      key={rsvp.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-2 bg-slate-50/80 hover:bg-white rounded-xl p-3 md:p-4 border border-slate-100 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand/5 text-brand border border-brand/10 flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0">
                            {rsvp.guestName ? rsvp.guestName.substring(0, 2) : 'M'}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-ink">{rsvp.guestName}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted mt-0.5">
                              <Users size={11} className="text-stone-400" />
                              <span>{rsvp.guestCount} Kişi</span>
                              <span className="text-stone-300">•</span>
                              <Utensils size={11} className="text-stone-400" />
                              <span>{rsvp.menuPreference || 'Belirtilmedi'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`${badgeBg} px-3 py-1 rounded-full text-[10px] font-bold shadow-sm`}>
                            {RSVP_STATUS_LABELS[rsvp.status]}
                          </span>
                          <button
                            onClick={() => void handleDeleteRsvp(rsvp.id)}
                            className="p-1 h-7 w-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 flex items-center justify-center border border-red-200 transition-all"
                            title="Kaydı Sil"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Extra Content (Message, Photo, Video) */}
                      {(rsvp.message || rsvp.photoUrl || rsvp.videoUrl) && (
                        <div className="mt-2 pl-13 flex flex-col gap-2">
                          {rsvp.message && (
                            <p className="text-xs text-stone-600 bg-white p-2.5 rounded-lg border border-stone-100 shadow-sm italic relative w-fit max-w-full">
                              "{rsvp.message}"
                            </p>
                          )}
                          <div className="flex gap-2">
                            {rsvp.photoUrl && (
                              <a href={rsvp.photoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-sky-50 text-sky-700 text-[10px] px-2.5 py-1.5 rounded-lg border border-sky-200 hover:bg-sky-100 transition-colors font-medium">
                                <ImageIcon size={12} /> Fotoğrafı Gör
                              </a>
                            )}
                            {rsvp.videoUrl && (
                              <a href={rsvp.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-[10px] px-2.5 py-1.5 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors font-medium">
                                <Play size={12} /> Videoyu İzle
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {rsvpList.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-8">
                  {isLoading ? 'Katılım yanıtları yükleniyor…' : 'Henüz kaydedilmiş katılım yanıtı bulunmuyor.'}
                </p>
              )}
            </div>

            {/* Footer Info */}
            <div className="bg-gradient-to-r from-brand/5 to-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
              <p className="text-xs font-semibold text-brand flex items-center justify-center gap-1.5">
                {/* Sürekli döngü CSS'te, compositor'da döner (bkz. index.css) */}
                <span className="animate-heartbeat inline-flex">
                  <UserCheck size={14} />
                </span>
                Yukarıdaki telefon önizlemesinden Katılım bildirerek bu paneli canlı test edebilirsiniz!
              </p>
            </div>

          </div>

          {/* Decorative blur blobs */}
          <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-champagne/50 rounded-full blur-3xl z-0" />
          <div className="absolute -top-6 -left-6 w-48 h-48 bg-emerald-200/40 rounded-full blur-3xl z-0" />
        </motion.div>
      </div>
    </section>
  );
});

import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  CalendarDays,
  CloudOff,
  Copy,
  Eye,
  FolderOpen,
  LayoutTemplate,
  PenLine,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2
} from 'lucide-react';
import { LiveRsvpPanel } from '../components/rsvp/LiveRsvpPanel';
import { toast } from '../components/ui/Toast';
import { useAuthStore } from '../stores/useAuthStore';
import { useInvitationStore } from '../stores/useInvitationStore';
import { useCreateWizardStore } from '../stores/useCreateWizardStore';
import { useDashboardData } from '../hooks/useDashboardData';
import { fullName } from '../utils/user';
import { EVENT_CATEGORIES, TEMPLATE_PRESETS } from '../data';
import { Invitation, InvitationRecord } from '../types';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

type TabId = 'published' | 'saved';

/** One grid card per backend invitation record. */
interface DashboardCard {
  /** React list key. */
  key: string;
  kind: TabId;
  /** Backend id — drives the view/copy links and editor resume. */
  remoteId: string;
  invitation: Invitation;
  /**
   * 🔴 Kaydin TAMAMI. Editore yalnizca `invitation` gecirmek kimligi dusururdu
   * ve duzenlemeye devam eden kullanici IKINCI bir davetiye olustururdu (K37).
   */
  record: InvitationRecord;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'published', label: 'Yayında Olanlar' },
  { id: 'saved', label: 'Kaydedilenler' }
];

const KIND_META: Record<TabId, { label: string; chip: string }> = {
  published: { label: 'Yayında', chip: 'bg-emerald-50/90 text-emerald-700 border-emerald-200' },
  saved: { label: 'Kayıtlı', chip: 'bg-amber-50/90 text-amber-700 border-amber-200' }
};

const EMPTY_TAB_TEXT: Record<TabId, string> = {
  published: 'Henüz yayınlanmış bir davetiyeniz yok. Bir tasarımı yayınladığınızda burada listelenir.',
  saved: 'Hesabınıza kaydedilmiş, yayın bekleyen bir davetiye bulunmuyor.'
};

function categoryLabel(categoryId: string): string {
  return EVENT_CATEGORIES.find((c) => c.id === categoryId)?.label ?? 'Etkinlik';
}

function presetName(imageTheme: string): string {
  return TEMPLATE_PRESETS.find((p) => p.id === imageTheme)?.name ?? 'Özel Tasarım';
}

function formatEventDate(value: string): string {
  const parsed = new Date(value);
  if (!value || Number.isNaN(parsed.getTime())) return 'Tarih belirlenmedi';
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsed);
}

interface InvitationCardProps {
  card: DashboardCard;
  onResume: (card: DashboardCard) => void;
  onCopyLink: (remoteId: string) => void;
  onDelete: (card: DashboardCard) => void;
}

/**
 * Single invitation card. The banner borrows the template preset's own
 * background/title classes so every card previews its theme's mood.
 */
function InvitationCard({ card, onResume, onCopyLink, onDelete }: InvitationCardProps) {
  const inv = card.invitation;
  const preset = TEMPLATE_PRESETS.find((p) => p.id === inv.imageTheme);
  const meta = KIND_META[card.kind];
  const bannerBg = preset?.backgroundStyle ?? 'bg-slate-900';
  const bannerText = preset?.titleColor ?? 'text-white';

  return (
    <div className="group h-full flex flex-col bg-white rounded-3xl border border-ink/[0.05] shadow-lg shadow-ink/[0.04] hover:shadow-2xl hover:shadow-ink/10 hover:-translate-y-1.5 transition-all duration-500 overflow-hidden">
      {/* Theme banner */}
      <div className={`relative h-32 p-5 flex flex-col justify-between overflow-hidden ${bannerBg}`}>
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-start justify-between gap-2">
          <span className={`text-[10px] font-semibold tracking-[0.14em] uppercase opacity-70 ${bannerText}`}>
            {categoryLabel(inv.categoryId)}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${meta.chip}`}>
            {meta.label}
          </span>
        </div>

        <p className={`relative font-serif text-xl font-bold italic truncate ${bannerText}`}>
          {inv.names || 'İsimsiz Davetiye'}
        </p>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col p-5">
        <h3 className="font-serif text-base font-bold text-ink truncate">
          {inv.names ? `${inv.names} · ${categoryLabel(inv.categoryId)}` : categoryLabel(inv.categoryId)}
        </h3>

        <div className="space-y-2 mt-3 mb-5">
          <div className="flex items-center gap-2 text-xs text-muted">
            <CalendarDays size={13} className="text-brand shrink-0" />
            {formatEventDate(inv.date)}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <LayoutTemplate size={13} className="text-brand shrink-0" />
            {presetName(inv.imageTheme)} şablonu
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-4 border-t border-stone-100 space-y-2">
          {card.kind === 'published' ? (
            <div className="grid grid-cols-3 gap-2">
              <Link
                to={`/invite/${card.remoteId}`}
                className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2 py-2.5 rounded-xl bg-stone-50 text-ink/70 border border-stone-200 hover:border-brand/40 hover:text-brand transition-all duration-300"
              >
                <Eye size={13} /> Görüntüle
              </Link>
              <button
                onClick={() => onCopyLink(card.remoteId)}
                className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2 py-2.5 rounded-xl bg-stone-50 text-ink/70 border border-stone-200 hover:border-brand/40 hover:text-brand transition-all duration-300 cursor-pointer"
              >
                <Copy size={13} /> Kopyala
              </button>
              <button
                onClick={() => onResume(card)}
                className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2 py-2.5 rounded-xl bg-brand text-white hover:bg-brand-soft shadow-sm shadow-brand/20 transition-all duration-300 cursor-pointer"
              >
                <PenLine size={13} /> Düzenle
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onResume(card)}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white px-5 py-3 rounded-xl font-semibold text-xs hover:bg-brand-soft transition-colors duration-300 shadow-md shadow-brand/15 cursor-pointer"
            >
              <PenLine size={14} />
              Düzenlemeye Devam Et
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </motion.button>
          )}

          <button
            type="button"
            onClick={() => onDelete(card)}
            aria-label="Bu davetiyeyi sil"
            className="w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2 py-2 rounded-xl text-muted/70 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all duration-300 cursor-pointer"
          >
            <Trash2 size={12} /> Sil
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Member dashboard: welcome header, the invitation library split across
 * published / saved / local-draft tabs, and the live RSVP panel below.
 */
export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const loadRecord = useInvitationStore((s) => s.loadRecord);
  const resumeEditor = useCreateWizardStore((s) => s.resumeEditor);
  const startNew = useCreateWizardStore((s) => s.startNew);
  const navigate = useNavigate();

  const { published, saved, isLoading, remoteError, refresh, remove } = useDashboardData();
  const [activeTab, setActiveTab] = useState<TabId>('published');

  const cardsByTab = useMemo<Record<TabId, DashboardCard[]>>(
    () => ({
      published: published.map((r) => ({ key: `remote-${r.id}`, kind: 'published', remoteId: r.id, invitation: r.invitation, record: r })),
      saved: saved.map((r) => ({ key: `remote-${r.id}`, kind: 'saved', remoteId: r.id, invitation: r.invitation, record: r }))
    }),
    [published, saved]
  );

  const totalCount = cardsByTab.published.length + cardsByTab.saved.length;
  const activeCards = cardsByTab[activeTab];

  /** Load the record into the editor stores and drop into /create's workspace. */
  const handleResume = (card: DashboardCard) => {
    loadRecord(card.record);
    resumeEditor(card.invitation.categoryId || 'dugun');
    navigate('/create');
  };

  /** Silme geri alinamaz gorunur; kullaniciya bir kez sorulur. */
  const handleDelete = async (card: DashboardCard) => {
    const ad = card.invitation.names || 'Bu davetiye';
    if (!window.confirm(`${ad} silinecek. Emin misiniz?`)) return;

    try {
      await remove(card.remoteId);
      toast('Davetiye silindi.');
    } catch {
      toast('Davetiye silinemedi — bağlantınızı kontrol edin.', 'info');
    }
  };

  const handleCopyLink = async (remoteId: string) => {
    const url = `${window.location.origin}/invite/${remoteId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast('Davetiye bağlantısı panoya kopyalandı.');
    } catch {
      toast('Bağlantı kopyalanamadı — tarayıcı iznini kontrol edin.', 'info');
    }
  };

  return (
    <>
      {/* Welcome header */}
      <section className="pt-14 md:pt-20 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_LUXE }}
          className="max-w-6xl mx-auto px-4 md:px-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <span className="text-brand font-semibold text-xs tracking-[0.15em] uppercase bg-brand/5 border border-brand/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
              Üye Paneli
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink">
              Hoş Geldiniz{user ? <>, <span className="italic text-brand font-medium">{fullName(user)}</span></> : null}
            </h1>
            <p className="text-muted text-sm mt-2 max-w-md leading-relaxed">
              Davetiyelerinizi yönetin, taslaklarınıza devam edin ve misafir yanıtlarını gerçek zamanlı takip edin.
            </p>
          </div>

          <Link
            to="/create"
            onClick={startNew}
            className="shrink-0 inline-flex items-center gap-2 bg-brand text-white px-6 py-3.5 rounded-full font-semibold text-xs hover:bg-brand-soft transition-all duration-300 shadow-md shadow-brand/15 hover:-translate-y-0.5"
          >
            <Plus size={15} />
            Yeni Davetiye Oluştur
          </Link>
        </motion.div>
      </section>

      {/* Invitation library */}
      <section className="py-12 md:py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          {remoteError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_LUXE }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-5 py-4 mb-8 text-xs"
            >
              <span className="flex items-center gap-2 font-medium">
                <CloudOff size={15} className="shrink-0" />
                Sunucuya ulaşılamadı — hesabınızdaki davetiyeler geçici olarak listelenemiyor.
              </span>
              <button
                onClick={refresh}
                className="inline-flex items-center gap-1.5 font-bold hover:text-amber-950 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw size={12} /> Tekrar Dene
              </button>
            </motion.div>
          )}

          {isLoading ? (
            /* Skeleton grid while both sources resolve */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl border border-ink/[0.05] overflow-hidden animate-pulse">
                  <div className="h-32 bg-stone-200/70" />
                  <div className="p-5 space-y-3">
                    <div className="h-3.5 bg-stone-200/70 rounded-full w-2/3" />
                    <div className="h-3 bg-stone-200/60 rounded-full w-1/2" />
                    <div className="h-3 bg-stone-200/60 rounded-full w-2/5" />
                    <div className="h-10 bg-stone-100 rounded-xl !mt-5" />
                  </div>
                </div>
              ))}
            </div>
          ) : totalCount === 0 ? (
            /* Global empty state — nothing anywhere, invite the first design */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_LUXE }}
              className="relative overflow-hidden text-center py-20 md:py-28 px-6 bg-white rounded-[2.5rem] border border-ink/[0.05] shadow-xl shadow-ink/[0.04]"
            >
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-champagne/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: EASE_LUXE, delay: 0.15 }}
                  className="w-20 h-20 mx-auto rounded-full bg-brand/5 border border-brand/10 flex items-center justify-center mb-6"
                >
                  <Sparkles className="text-brand" size={30} />
                </motion.div>

                <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink">
                  Henüz bir davetiyeniz yok
                </h2>
                <p className="text-muted text-sm mt-3 max-w-md mx-auto leading-relaxed">
                  İlk tasarımınızı dakikalar içinde oluşturun; şablon seçin, kişiselleştirin ve
                  sevdiklerinizle tek bağlantıyla paylaşın.
                </p>

                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} className="inline-block mt-8">
                  <Link
                    to="/create"
                    onClick={startNew}
                    className="relative overflow-hidden inline-flex items-center gap-2.5 bg-brand text-white px-9 py-4 rounded-full font-semibold text-sm hover:bg-brand-soft transition-colors duration-500 shadow-lg shadow-brand/20 hover:shadow-xl hover:shadow-brand/30"
                  >
                    <span className="absolute inset-0 animate-shimmer pointer-events-none" />
                    <Plus size={16} />
                    Hemen Yeni Bir Davetiye Oluştur
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_LUXE, delay: 0.1 }}
                className="flex justify-center sm:justify-start mb-8"
              >
                <div className="inline-flex items-center gap-1 bg-white border border-ink/[0.06] rounded-full p-1.5 shadow-sm overflow-x-auto max-w-full">
                  {TABS.map((tab) => {
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-4 md:px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-300 cursor-pointer ${
                          active ? 'text-white' : 'text-muted hover:text-ink'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="dashboard-tab-pill"
                            className="absolute inset-0 bg-brand rounded-full"
                            transition={{ duration: 0.45, ease: EASE_LUXE }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          {tab.label}
                          <span
                            className={`min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded-full text-[10px] font-bold ${
                              active ? 'bg-white/20 text-white' : 'bg-ink/5 text-muted'
                            }`}
                          >
                            {cardsByTab[tab.id].length}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Cards grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: EASE_LUXE }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {activeCards.length === 0 ? (
                    <div className="col-span-full text-center py-16 px-6 bg-white/60 border border-dashed border-ink/10 rounded-3xl">
                      <FolderOpen className="mx-auto text-muted/50" size={30} />
                      <p className="text-muted text-sm mt-4 max-w-sm mx-auto leading-relaxed">
                        {EMPTY_TAB_TEXT[activeTab]}
                      </p>
                    </div>
                  ) : (
                    activeCards.map((card, i) => (
                      /* key lives on the motion wrapper — see davetkart JSX typing note */
                      <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: EASE_LUXE, delay: i * 0.07 }}
                      >
                        <InvitationCard card={card} onResume={handleResume} onCopyLink={handleCopyLink} onDelete={handleDelete} />
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </section>

      <LiveRsvpPanel />
    </>
  );
}

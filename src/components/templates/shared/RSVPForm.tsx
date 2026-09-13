import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Invitation, RsvpStatus } from '../../../types';
import { cn } from '../../../utils/cn';
import { useRsvpStore } from '../../../stores/useRsvpStore';
import { toast } from '../../ui/Toast';
import { HoneypotField } from '../../ui/HoneypotField';
import { toDisplayError } from '../../../utils/toDisplayError';
import { RSVP_STATUS_CHOICES } from '../../../utils/rsvpStatus';
import { SectionTheme, EASE_LUXE } from './palette';
import { TemplateFlavor } from './flavor';
import { googleCalendarUrl, downloadIcsFile } from './calendar';
import { CheckIcon, SendIcon, UsersIcon, GoogleIcon, AppleIcon } from './icons';

interface RSVPFormProps {
  invitation: Invitation;
  theme: SectionTheme;
  flavor: TemplateFlavor;
}

const MENU_OPTIONS = ['Et Menü', 'Tavuk Menü', 'Vejetaryen Menü'] as const;

/**
 * Inline RSVP section — shadcn-minimal form. On submit the entry is committed
 * through the RSVP store and a confirmation with "add to calendar" shortcuts
 * takes the form's place.
 */
export function RSVPForm({ invitation, theme, flavor }: RSVPFormProps) {
  const updateDraft = useRsvpStore((s) => s.updateDraft);
  const submitDraft = useRsvpStore((s) => s.submitDraft);

  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [status, setStatus] = useState<RsvpStatus>('attending');
  const [website, setWebsite] = useState('');
  const [menuPreference, setMenuPreference] = useState<string>(MENU_OPTIONS[0]);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isDark = theme.id === 'midnight';
  const calendarUrl = googleCalendarUrl(invitation);

  const deadlineLabel = invitation.rsvpDeadline
    ? new Date(invitation.rsvpDeadline).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!guestName.trim()) {
      setError(true);
      return;
    }
    updateDraft({
      guestName: guestName.trim(),
      guestCount,
      status,
      menuPreference: invitation.askMenuPreference ? menuPreference : 'Belirtilmedi',
      message: '',
      website
    });
    setSubmitting(true);
    try {
      if (await submitDraft()) setSubmitted(true);
    } catch (error) {
      toast(toDisplayError(error), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass = cn('block text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5', theme.body);

  return (
    <section className={cn('relative px-6 py-16', theme.page)}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE_LUXE }}
        className="text-center mb-10"
      >
        <span className={cn('text-[10px] font-semibold tracking-[0.3em] uppercase', theme.accent)}>
          LCV — Katılım Bildirimi
        </span>
        <h2 className={cn('font-serif text-2xl md:text-3xl font-bold mt-2', theme.heading)}>
          {flavor.headings.rsvp}
        </h2>
        {deadlineLabel && (
          <p className={cn('text-[12px] font-light mt-3', theme.body)}>
            Lütfen katılım durumunuzu <span className={cn('font-semibold', theme.accent)}>{deadlineLabel}</span>{' '}
            tarihine kadar bildiriniz.
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.95, ease: EASE_LUXE, delay: 0.1 }}
        className={cn('max-w-md mx-auto rounded-3xl border p-6', theme.surface, theme.border)}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE_LUXE }}
              className="text-center py-4"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
                className="mx-auto w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center"
              >
                <CheckIcon size={26} strokeWidth={2.25} />
              </motion.span>
              <h3 className={cn('font-serif text-xl font-bold mt-4', theme.heading)}>
                Başarıyla katılımınız oluşturuldu
              </h3>
              <p className={cn('text-[13px] font-light mt-2 leading-relaxed', theme.body)}>
                Teşekkür ederiz! Büyük günü kaçırmamak için etkinliği takviminize ekleyebilirsiniz.
              </p>

              <div className="mt-6 space-y-2.5">
                {calendarUrl && (
                  <motion.a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-colors duration-300',
                      theme.buttonPrimary
                    )}
                  >
                    <GoogleIcon size={14} />
                    Google Takvim'e Ekle
                  </motion.a>
                )}
                <motion.button
                  type="button"
                  onClick={() => downloadIcsFile(invitation)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-colors duration-300 cursor-pointer',
                    theme.buttonGhost
                  )}
                >
                  <AppleIcon size={14} />
                  Apple Takvim'e Ekle (.ics)
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE_LUXE }}
              className="relative space-y-5"
            >
              <HoneypotField id="rsvp-inline-website" value={website} onChange={setWebsite} />

              <div>
                <label htmlFor="rsvp-name" className={labelClass}>
                  Ad Soyad
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="Adınız ve soyadınız"
                  className={cn(theme.input, error && 'border-rose-500/70 focus:border-rose-500/70 focus:ring-rose-500/15')}
                />
                {error && <p className="text-[11px] text-rose-500 mt-1.5">Lütfen adınızı yazın.</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Kişi Sayısı</label>
                  <div className={cn('flex items-center justify-between rounded-lg border px-2 py-1.5', theme.border)}>
                    <button
                      type="button"
                      aria-label="Kişi sayısını azalt"
                      onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                      className={cn('w-7 h-7 rounded-md text-base font-bold cursor-pointer transition-colors', theme.buttonGhost, 'border-0')}
                    >
                      −
                    </button>
                    <span className={cn('flex items-center gap-1.5 text-sm font-bold tabular-nums', theme.heading)}>
                      <UsersIcon size={13} className={theme.body} />
                      {guestCount}
                    </span>
                    <button
                      type="button"
                      aria-label="Kişi sayısını artır"
                      onClick={() => setGuestCount((c) => Math.min(12, c + 1))}
                      className={cn('w-7 h-7 rounded-md text-base font-bold cursor-pointer transition-colors', theme.buttonGhost, 'border-0')}
                    >
                      +
                    </button>
                  </div>
                </div>

                {invitation.askMenuPreference && (
                  <div>
                    <label htmlFor="rsvp-menu" className={labelClass}>
                      Menü Tercihi
                    </label>
                    <select
                      id="rsvp-menu"
                      value={menuPreference}
                      onChange={(e) => setMenuPreference(e.target.value)}
                      className={cn(theme.input, isDark && '[color-scheme:dark]', 'cursor-pointer')}
                    >
                      {MENU_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Katılım Durumu</label>
                <div className={cn('grid grid-cols-2 rounded-lg border p-1 gap-1', theme.border)}>
                  {/* Bu şablon iki uçlu bir seçim sunar; "Belirsiz" bilinçli
                      olarak yok — satır içi form kısa tutuluyor. */}
                  {(['attending', 'declined'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setStatus(option)}
                      className={cn(
                        'rounded-md py-2 text-xs font-bold transition-all duration-300 cursor-pointer',
                        status === option
                          ? cn(theme.accentBg, isDark ? 'text-slate-950' : 'text-stone-50', 'shadow-sm')
                          : cn(theme.body, 'hover:opacity-75')
                      )}
                    >
                      {RSVP_STATUS_CHOICES[option]}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold tracking-wide transition-colors duration-300 cursor-pointer disabled:opacity-60 disabled:pointer-events-none',
                  theme.buttonPrimary
                )}
              >
                <SendIcon size={14} />
                {submitting ? 'Gönderiliyor…' : 'Katılımımı Bildir'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

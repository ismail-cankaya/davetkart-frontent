import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { WandSparkles } from 'lucide-react';
import { Invitation } from '../../types';
import { DEFAULT_INVITE_MESSAGES } from '../../data';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { useCreateWizardStore } from '../../stores/useCreateWizardStore';
import { CoupleNameFields } from './CoupleNameFields';
import { ToggleRow } from './ToggleRow';
import { TimelineEditor } from './TimelineEditor';
import { GalleryUploader } from './GalleryUploader';
import { LocationSearchField } from './location/LocationSearchField';
import { Switch } from '../ui/Switch';
import { DateTimeInput } from '../ui/DateTimeInput';
import { scrollToTarget } from '../../hooks/useLenis';
import { cn } from '../../utils/cn';
import { formatTimeZoneLabel, timeZoneOptions } from '../../utils/timeZones';

const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

const labelClass = 'block text-xs font-bold tracking-wider uppercase text-champagne';
const inputClass =
  'w-full bg-white/5 border border-white/15 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 transition-all duration-300';

/** Invitation fields edited through the debounced text pipeline. */
type TextField = 'subtitle' | 'date' | 'venue' | 'bankName' | 'accountHolder' | 'iban' | 'rsvpDeadline';

/** Module visibility flags surfaced as Grup C toggles. */
type FlagField = 'showEnvelope' | 'showTimer' | 'showTimeline' | 'showGallery' | 'showGift' | 'showRSVP' | 'askMenuPreference';

/**
 * Bu formun yerel kopyada tuttuğu ve store'a GERİ YAZDIĞI alanlar.
 *
 * 🔴 İsimler, saat dilimi, program akışı ve galeri store'a kendi
 * bileşenlerinden doğrudan yazılır; yerel kopyadaki halleri o sırada eskimiş
 * olabilir. Tüm anahtarları karşılaştırıp yazmak, onların yeni değerini
 * eskisiyle ezerdi (ör. isim yazılıp hemen bir anahtar açılınca isim geri
 * dönerdi).
 */
const FORM_FIELDS: ReadonlyArray<TextField | FlagField | 'mapUrl'> = [
  'subtitle',
  'date',
  'venue',
  'mapUrl',
  'bankName',
  'accountHolder',
  'iban',
  'rsvpDeadline',
  'showEnvelope',
  'showTimer',
  'showTimeline',
  'showGallery',
  'showGift',
  'showRSVP',
  'askMenuPreference'
];

/** Section header shared by the three wizard groups. */
function GroupHeading({ step, title, hint }: { step: string; title: string; hint: string }) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="shrink-0 w-8 h-8 rounded-full bg-gold/15 border border-gold/30 text-champagne text-xs font-bold flex items-center justify-center">
        {step}
      </span>
      <div>
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-xs text-white/45 mt-0.5 leading-relaxed">{hint}</p>
      </div>
    </div>
  );
}

/**
 * Wizard step 2b — the full data-collection form:
 *   Grup A (temel bilgiler) → Grup B (konum) → Grup C (modül tercihleri).
 * "Davetiyeni Oluştur" hands the flow over to the generation loading screen.
 */
export function DetailsFormStep() {
  const invitation = useInvitationStore(s => s.invitation);
  const updateField = useInvitationStore(s => s.updateField);

  // Liste çalışma zamanında okunuyor ve ~400 kayıt; her render'da yeniden
  // kurulmasın.
  const timeZones = useMemo(() => timeZoneOptions(), []);
  const fieldId = useId();
  const startGeneration = useCreateWizardStore(s => s.startGeneration);

  // Local mirror keeps typing instant; the store is updated behind a debounce.
  // The ref always holds the latest mirror so timers never read a stale copy.
  const [local, setLocalState] = useState<Invitation>(invitation);
  const localRef = useRef<Invitation>(invitation);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setLocal = (next: Invitation) => {
    localRef.current = next;
    setLocalState(next);
  };

  useEffect(() => {
    // Skip the sync while an edit is pending here — it will commit shortly and
    // trigger this effect again with our own values.
    if (!debounceRef.current) {
      localRef.current = invitation;
      setLocalState(invitation);
    }
  }, [invitation]);

  /**
   * Commit every locally-diverged form field to the store immediately.
   *
   * Karşılaştırma store'un GÜNCEL haliyle yapılır, render anındaki kopyayla
   * değil; yalnızca bu formun alanları yazılır (bkz. `FORM_FIELDS`).
   */
  const flushLocal = (snapshot: Invitation = localRef.current) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = undefined;
    }
    const stored = useInvitationStore.getState().invitation;
    FORM_FIELDS.forEach((key) => {
      if (snapshot[key] !== stored[key]) updateField(key, snapshot[key]);
    });
  };

  // A pending edit must survive unmount (e.g. leaving the page while the
  // debounce is still open) — flush it instead of dropping it. `flushLocal`
  // reads only refs and the store, so the first render's closure is current.
  useEffect(() => () => {
    if (debounceRef.current) flushLocal();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as TextField;
    setLocal({ ...localRef.current, [name]: e.target.value });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // 🔴 Zamanlayıcı yalnızca son yazılan alanı değil, bekleyen TÜM alanları
    // yazar: iki alan 400 ms içinde art arda düzenlendiğinde ilkinin son
    // harfleri kaybolmasın.
    debounceRef.current = setTimeout(() => flushLocal(), 400);
  };

  /** Instant commits (toggles, map location) — flush pending text first so nothing is lost. */
  const commitNow = (patch: Partial<Invitation>) => {
    const snapshot = { ...localRef.current, ...patch };
    setLocal(snapshot);
    flushLocal(snapshot);
  };

  const setFlag = (name: FlagField, value: boolean) => {
    const patch: Partial<Invitation> = {};
    patch[name] = value;
    commitNow(patch);
  };

  const applySuggestedMessage = (message: string) => commitNow({ subtitle: message });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    flushLocal();
    startGeneration();
    scrollToTarget(0, { immediate: true });
  };

  return (
    <motion.section
      id="sihirbaz-form"
      className="py-12 md:py-20 bg-gradient-to-b from-brand-deep via-emerald-950 to-brand-deep text-white relative overflow-hidden scroll-mt-20"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.9, ease: EASE_LUXE }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-serif text-2xl md:text-4xl font-bold">
            Davetiyenizin <span className="italic text-champagne font-medium">bilgilerini</span> girin
          </h2>
          <p className="text-emerald-100/70 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            Bu bilgiler seçtiğiniz temaya işlenir; hangi bölümlerin görüneceğine siz karar
            verirsiniz. Son adımdaki stüdyoda hepsini yeniden düzenleyebilirsiniz.
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_LUXE, delay: 0.1 }}
          className="bg-white/[0.07] backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 space-y-8 shadow-2xl shadow-black/20"
        >
          {/* ————— Grup A: Temel Bilgiler ————— */}
          <div className="space-y-5">
            <GroupHeading
              step="A"
              title="Temel Bilgiler"
              hint="Etkinlik sahipleri, davet mesajınız ve büyük günün tarihi."
            />

            <CoupleNameFields labelClass={labelClass} inputClass={inputClass} />

            <div className="space-y-2">
              <label className={labelClass}>Davet Mesajı</label>
              <textarea
                name="subtitle"
                rows={3}
                value={local.subtitle}
                onChange={handleChange}
                placeholder="Misafirlerinize iletmek istediğiniz anlamlı bir davet metni yazın..."
                className={cn(inputClass, 'resize-none')}
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {DEFAULT_INVITE_MESSAGES.map((message) => (
                  <button
                    key={message}
                    type="button"
                    onClick={() => applySuggestedMessage(message)}
                    className={cn(
                      'text-[11px] rounded-full border px-3 py-1.5 text-left transition-colors duration-300 cursor-pointer',
                      local.subtitle === message
                        ? 'border-gold/60 bg-gold/15 text-champagne'
                        : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25 hover:text-white/80'
                    )}
                  >
                    {message.length > 52 ? `${message.slice(0, 52)}…` : message}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor={`${fieldId}-date`} className={labelClass}>Etkinlik Tarihi &amp; Saati</label>
              {/* Boş başlar: kullanıcı seçmeden state'te tarih yoktur ve
                  önizleme tarih göstermez. */}
              <DateTimeInput
                id={`${fieldId}-date`}
                name="date"
                value={local.date}
                onChange={handleChange}
                placeholder="Davet tarihini seçiniz"
                className={cn(inputClass, '[color-scheme:dark]')}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Etkinliğin Saat Dilimi</label>
              {/* 🔴 Yukarıdaki saat bir DUVAR SAATİDİR: "19:00" etkinliğin
                  olduğu yerin saatidir. Saat dilimi olmadan, başka bir
                  ülkedeki misafirin geri sayımı kayar. Bu yüzden alan
                  taslakta değil, formda duruyor. */}
              <select
                value={invitation.timezone || ''}
                onChange={(e) => updateField('timezone', e.target.value)}
                className={cn(inputClass, 'cursor-pointer')}
              >
                {timeZones.map((zone) => (
                  <option key={zone} value={zone}>
                    {formatTimeZoneLabel(zone)}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-white/35">
                Misafirlerinizin geri sayımı bu saat dilimine göre hesaplanır.
              </p>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* ————— Grup B: Konum ve Ulaşım ————— */}
          <div className="space-y-5">
            <GroupHeading
              step="B"
              title="Konum ve Ulaşım"
              hint="Misafirleriniz tek dokunuşla yol tarifi alabilsin."
            />

            {/* 🔴 İki alan da boş başlar; "Çırağan Sarayı, İstanbul" yalnızca
                silik placeholder'dır, state'e yazılmaz. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor={`${fieldId}-venue`} className={labelClass}>Davet Konumu</label>
                <input
                  id={`${fieldId}-venue`}
                  type="text"
                  name="venue"
                  value={local.venue}
                  onChange={handleChange}
                  placeholder="Çırağan Sarayı, İstanbul"
                  className={inputClass}
                />
              </div>

              <LocationSearchField
                label="Ulaşım Bilgileri"
                placeholder="Çırağan Sarayı, İstanbul"
                value={local.mapUrl}
                onChange={(mapUrl) => commitNow({ mapUrl })}
                labelClass={labelClass}
                inputClass={inputClass}
              />
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* ————— Grup C: Modüler Bölüm Tercihleri ————— */}
          <div className="space-y-5">
            <GroupHeading
              step="C"
              title="Davetiye Bölümleri"
              hint="Davetiyenizde hangi modüllerin yer alacağını seçin — her biri anında önizlemeye yansır."
            />

            <div className="space-y-3">
              <ToggleRow
                question="Zarf Açılış Animasyonu"
                hint="Davetiyeniz açılmadan önce ekranda şık bir zarf açılma efekti olsun mu?"
                checked={local.showEnvelope}
                onChange={(value) => setFlag('showEnvelope', value)}
              />

              <ToggleRow
                question="Geri Sayım Sayacı"
                hint="Etkinlik gününe kalan süreyi gösteren geri sayım sayacı eklensin mi?"
                checked={local.showTimer}
                onChange={(value) => setFlag('showTimer', value)}
              />

              <ToggleRow
                question="Program Akışı (Timeline)"
                hint="Nikah, yemek, eğlence gibi adımları şık bir zaman çizelgesiyle gösterin."
                checked={local.showTimeline}
                onChange={(value) => setFlag('showTimeline', value)}
              >
                <TimelineEditor inputClass={inputClass} />
              </ToggleRow>

              <ToggleRow
                question="Fotoğraf Galerisi"
                hint="Özel anlarınızın yer aldığı bir fotoğraf galerisi eklemek ister misiniz?"
                checked={local.showGallery}
                onChange={(value) => setFlag('showGallery', value)}
              >
                <GalleryUploader />
              </ToggleRow>

              <ToggleRow
                question="Hediye / İBAN Bilgileri"
                hint="Banka hesap bilgilerinizi göstermek ister misiniz?"
                checked={local.showGift}
                onChange={(value) => setFlag('showGift', value)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Banka Adı</label>
                    <input
                      type="text"
                      name="bankName"
                      value={local.bankName}
                      onChange={handleChange}
                      placeholder="Örn. Ziraat Bankası"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Hesap Sahibi</label>
                    <input
                      type="text"
                      name="accountHolder"
                      value={local.accountHolder}
                      onChange={handleChange}
                      placeholder="Ad Soyad"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>IBAN</label>
                  <input
                    type="text"
                    name="iban"
                    value={local.iban}
                    onChange={handleChange}
                    placeholder="TR__ ____ ____ ____ ____ ____ __"
                    className={cn(inputClass, 'font-mono tracking-wide')}
                  />
                </div>
              </ToggleRow>

              <ToggleRow
                question="Katılım Bildirimi (LCV / RSVP)"
                hint="Katılımcılardan katılım durumlarını bildirmelerini istiyor musunuz?"
                checked={local.showRSVP}
                onChange={(value) => setFlag('showRSVP', value)}
              >
                <div className="space-y-2">
                  <label className={labelClass}>Son Katılım Bildirme Tarihi (LCV)</label>
                  <input
                    type="date"
                    name="rsvpDeadline"
                    value={local.rsvpDeadline}
                    onChange={handleChange}
                    className={cn(inputClass, '[color-scheme:dark]')}
                  />
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Menü Tercihi Sorulsun</p>
                    <p className="text-xs text-white/45 mt-0.5">Misafirler et / tavuk / vejetaryen seçimi yapabilsin.</p>
                  </div>
                  <Switch
                    checked={local.askMenuPreference}
                    onChange={(value) => setFlag('askMenuPreference', value)}
                    label="Menü tercihi sorulsun"
                  />
                </div>
              </ToggleRow>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden w-full bg-champagne hover:bg-gold text-brand-deep font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-black/25 cursor-pointer transition-colors duration-500"
          >
            <span className="absolute inset-0 animate-shimmer pointer-events-none" />
            <WandSparkles size={17} className="group-hover:rotate-12 transition-transform duration-300" />
            Davetiyeni Oluştur
          </motion.button>
        </motion.form>
      </div>
    </motion.section>
  );
}

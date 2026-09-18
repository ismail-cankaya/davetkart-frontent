import { useCallback, useEffect, useRef, useState } from 'react';
import { Invitation } from '../types';
import { useInvitationStore } from '../stores/useInvitationStore';

/** Yazma durduktan sonra store'a yazmadan önce beklenen süre. */
const COMMIT_DELAY_MS = 400;

export interface InvitationDraft<F extends keyof Invitation> {
  /** Formun çizdiği yerel kopya — her tuşta anında güncellenir. */
  draft: Invitation;
  /** Metin alanı: yerelde hemen, store'da yazma durunca. */
  setField: <K extends F>(name: K, value: Invitation[K]) => void;
  /** Anında yazılan değişiklik (anahtar, seçim) — bekleyen metni de birlikte yazar. */
  commit: (patch: Partial<Pick<Invitation, F>>) => void;
  /** Bekleyen her şeyi hemen store'a yazar (ör. form gönderimi). */
  flush: () => void;
}

/**
 * Bir formun davetiye alanları için yerel kopya + gecikmeli store yazımı.
 *
 * Tuş başına store'a yazmak her tuşta önizlemeyi yeniden çizer; bu hook
 * yazımı biriktirir. Sihirbaz formu ve tasarım stüdyosu aynı mantığı paylaşır.
 *
 * 🔴 Burada kapatılan üç hata (hepsi sessizce veri kaybettiriyordu):
 *
 * 1. **Yalnızca son alan yazılıyordu.** Zamanlayıcı son düzenlenen alanın
 *    değerini yazıyordu; iki alan 400 ms içinde art arda düzenlenince ilkinin
 *    son harfleri kayboluyordu. Zamanlayıcı artık bekleyen TÜM alanları yazar.
 * 2. **Başka bileşenin yazdığı alan eziliyordu.** Karşılaştırma yerel kopyanın
 *    tüm anahtarları üzerinden yapılıyordu; isimler, program akışı ya da galeri
 *    gibi store'a doğrudan yazılan alanlar yerel kopyada bayatken eski
 *    değeriyle geri yazılıyordu. Yalnızca `fields` listesi yazılır ve
 *    karşılaştırma store'un GÜNCEL hâliyle yapılır.
 * 3. **Store senkronu yazılanı siliyordu.** Yazım beklerken gelen bir store
 *    değişikliği (ör. kaydetme yanıtı) yerel kopyayı eziyordu. Senkron,
 *    bekleyen yazım yokken yapılır; yazım bitince zaten yeniden tetiklenir.
 *
 * Bileşen ayrılırken bekleyen yazım atılmaz, yazılır — AMA belge değiştiyse
 * (sıfırlama, kayıt yükleme; `documentVersion`) bekleyen yazım eski belgeye
 * aittir ve ATILIR. Yoksa "Bütün Alanları Sıfırla"dan hemen önce yazılan metin
 * sıfırlanmış davetiyeye geri yazılırdı.
 *
 * @param fields Bu formun SAHİP OLDUĞU alanlar; yalnızca bunlar store'a yazılır.
 */
export function useInvitationDraft<F extends keyof Invitation>(fields: readonly F[]): InvitationDraft<F> {
  const invitation = useInvitationStore((s) => s.invitation);
  const documentVersion = useInvitationStore((s) => s.documentVersion);
  const updateField = useInvitationStore((s) => s.updateField);

  const [draft, setDraftState] = useState<Invitation>(invitation);
  const draftRef = useRef<Invitation>(invitation);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Liste ref'te tutulur: çağıran satır içi bir dizi geçse bile `flush`'ın
  // kimliği değişmez ve ayrılma efekti her render'da yeniden kurulmaz.
  const fieldsRef = useRef(fields);
  useEffect(() => {
    fieldsRef.current = fields;
  });

  const setDraft = (next: Invitation) => {
    draftRef.current = next;
    setDraftState(next);
  };

  useEffect(() => {
    if (timerRef.current) return;
    draftRef.current = invitation;
    setDraftState(invitation);
  }, [invitation]);

  // Belge değişti: bekleyen yazım eski belgeye aittir — at ve yeni belgeyi göster.
  const versionRef = useRef(documentVersion);
  useEffect(() => {
    if (versionRef.current === documentVersion) return;
    versionRef.current = documentVersion;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }

    const current = useInvitationStore.getState().invitation;
    draftRef.current = current;
    setDraftState(current);
  }, [documentVersion]);

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }

    const snapshot = draftRef.current;
    const stored = useInvitationStore.getState().invitation;

    for (const key of fieldsRef.current) {
      if (snapshot[key] !== stored[key]) updateField(key, snapshot[key]);
    }
  }, [updateField]);

  useEffect(
    () => () => {
      if (timerRef.current) flush();
    },
    [flush]
  );

  const setField = <K extends F>(name: K, value: Invitation[K]) => {
    setDraft({ ...draftRef.current, [name]: value });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, COMMIT_DELAY_MS);
  };

  const commit = (patch: Partial<Pick<Invitation, F>>) => {
    setDraft({ ...draftRef.current, ...patch });
    flush();
  };

  return { draft, setField, commit, flush };
}

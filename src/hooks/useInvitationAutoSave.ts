import { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useAuthStore } from '../stores/useAuthStore';
import { useInvitationStore } from '../stores/useInvitationStore';
import { shouldAutoSave } from '../utils/draftContent';

/** Idle window after the last edit before the design is pushed to the backend. */
const AUTO_SAVE_DELAY_MS = 1500;

/**
 * Debounced cloud auto-save for the invitation designer.
 *
 * Subscribes to invitation changes outside React's render cycle and issues at
 * most one POST per idle window instead of one per keystroke. A pending save
 * is flushed when the designer unmounts so no edit is lost on navigation.
 * Anonymous designers are skipped entirely — their draft lives in memory
 * until they sign in.
 */
export function useInvitationAutoSave(): void {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const debouncedSave = useDebouncedCallback(
    () => void useInvitationStore.getState().saveInvitation(),
    AUTO_SAVE_DELAY_MS
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    // Yalnızca kullanıcı düzenlemeleri: kaydetme yanıtı, kayıt yükleme ve
    // sıfırlama da `invitation`'ı değiştirir ama kaydetme tetiklememelidir.
    const unsubscribe = useInvitationStore.subscribe((state, prev) => {
      // K192 (FE-50): kayıt yoksa ilk POST yalnızca gerçek içerikte; kategori/tema seçimi taslak açmaz.
      if (state.editRevision !== prev.editRevision && shouldAutoSave(state)) debouncedSave();
    });

    // B-D10: React söker ÜSTTEN aşağı; formun taslak yazımı (useInvitationDraft) bu temizlikten SONRA gelir.
    // Abonelik o yazımı görsün diye kapatma ve flush bir mikro görev sonraya bırakılır.
    return () => {
      queueMicrotask(() => {
        unsubscribe();
        debouncedSave.flush();
      });
    };
  }, [isAuthenticated, debouncedSave]);
}

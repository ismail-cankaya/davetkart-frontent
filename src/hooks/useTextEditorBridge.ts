import { useEffect, useMemo } from 'react';
import { isModuleId, useEditorStore } from '../stores/useEditorStore';
import { useInvitationStore } from '../stores/useInvitationStore';
import type { TextEditorBridge } from '../invitationText/InvitationTextContext';

/**
 * Tasarım stüdyosunun önizlemeye verdiği editör köprüsü (Faz 25, K306). Şablonlar store'u bilmez; yalnızca
 * bu arayüzü görür. Belge değişince (başka davetiye açıldı / sıfırlandı) editör oturumu atılır.
 */
export function useTextEditorBridge(): TextEditorBridge {
  const activeKey = useEditorStore((s) => s.active?.key ?? null);
  const documentVersion = useInvitationStore((s) => s.documentVersion);

  useEffect(() => {
    useEditorStore.getState().resetSession();
  }, [documentVersion]);

  return useMemo<TextEditorBridge>(() => {
    const store = useEditorStore.getState();
    return {
      activeKey,
      select: (request) => store.selectText(request),
      reportScope: (scope) => useEditorStore.getState().reportScope(scope),
      markSeen: (key) => useEditorStore.getState().markSeen(key),
      openSection: (id) => {
        if (id === 'details' || isModuleId(id)) useEditorStore.getState().openSection(id);
      }
    };
  }, [activeKey]);
}

/** Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y: yazı alanında değilken editörün geri al / yinelesi (K311). */
export function useEditorShortcuts(): void {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const key = event.key.toLowerCase();
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault();
        useEditorStore.getState().undo();
      } else if ((key === 'z' && event.shiftKey) || key === 'y') {
        event.preventDefault();
        useEditorStore.getState().redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

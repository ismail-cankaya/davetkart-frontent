import { create } from 'zustand';
import type { PreviewDevice } from '../types';
import type { CanvasZoom } from '../components/studio/canvas/deviceViewports';

/** Sol menünün sekmeleri (K319). */
export type StudioTab = 'info' | 'sections' | 'texts' | 'theme' | 'checklist';

/**
 * Tasarım stüdyosunun arayüz durumu (Faz 28, K319): sekme, cihaz, yakınlaştırma, tam ekranda düzenleme, misafir gözüyle,
 * taşan metin sayısı. Davetiyenin kendisi `useInvitationStore`'da, düzenleme oturumu `useEditorStore`'da.
 */
interface StudioState {
  tab: StudioTab;
  /** Telefonda sekme içeriği alttan panelde açık mı. */
  sheetOpen: boolean;
  device: PreviewDevice;
  zoom: CanvasZoom;
  focusMode: boolean;
  guestView: boolean;
  overflowCount: number;
  setTab: (tab: StudioTab, openSheet?: boolean) => void;
  closeSheet: () => void;
  setDevice: (device: PreviewDevice) => void;
  setZoom: (zoom: CanvasZoom) => void;
  setFocusMode: (on: boolean) => void;
  setGuestView: (on: boolean) => void;
  setOverflowCount: (count: number) => void;
}

export const useStudioStore = create<StudioState>()((set) => ({
  tab: 'info',
  sheetOpen: false,
  device: 'phone',
  zoom: 'fit',
  focusMode: false,
  guestView: false,
  overflowCount: 0,
  setTab: (tab, openSheet = false) => set({ tab, sheetOpen: openSheet }),
  closeSheet: () => set({ sheetOpen: false }),
  setDevice: (device) => set({ device, zoom: 'fit' }),
  setZoom: (zoom) => set({ zoom }),
  setFocusMode: (focusMode) => set({ focusMode }),
  setGuestView: (guestView) => set({ guestView }),
  setOverflowCount: (overflowCount) => set({ overflowCount })
}));

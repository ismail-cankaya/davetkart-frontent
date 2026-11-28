import { create } from 'zustand';
import type { Invitation } from '../types';
import { useInvitationStore } from './useInvitationStore';
import { defaultText } from '../invitationText/resolve';
import {
  HISTORY_LIMIT,
  pushHistory,
  redoHistory,
  undoHistory,
  withText,
  withoutKeys,
  withoutText,
  type History
} from '../invitationText/overrides';
import { DEFAULT_INVITATION_LOCALE, isInvitationLocale, type InvitationLocale, type TextOverrides } from '../invitationText/types';
import { USER_FIELDS, userFieldValues, type UserField } from '../invitationText/userFields';

/**
 * Davetiye editörü (Faz 25, K300, K306–K311): tıkla-düzenle, bölüm ayarları, ➕ özellik ekle, geri al/yinele.
 *
 * Davetiyenin kendisi `useInvitationStore`'da kalır (tek doğruluk kaynağı, otomatik kayıt orada); bu store
 * yalnızca editörün oturum durumunu ve kullanıcı eylemlerini tutar. Ayrıntı: docs/rehber/src/stores/useEditorStore.md
 */

/** Editörün açıp kapatabildiği bölümler ve davetiyedeki bayrakları. */
export const MODULE_FLAGS = {
  envelope: 'showEnvelope',
  timer: 'showTimer',
  timeline: 'showTimeline',
  gallery: 'showGallery',
  gift: 'showGift',
  rsvp: 'showRSVP'
} as const satisfies Record<string, keyof Invitation>;

export type ModuleId = keyof typeof MODULE_FLAGS;
/** Ayar paneli açılabilen bölümler: modüller + her zaman görünen "tarih ve mekân". */
export type SectionId = ModuleId | 'details';

export function isModuleId(value: string): value is ModuleId {
  return value in MODULE_FLAGS;
}

/** Şablonun bildirdiği metin kapsamı: panel varsayılanları buradan çözer. */
export interface ReportedScope {
  categoryId: string;
  scopes: readonly string[];
  runtimeDefaults?: Readonly<Record<string, string>>;
}

/** Açık yerinde düzenleme. `anchor` metnin ekrandaki kutusu (popover konumu). */
export interface ActiveText {
  key: string;
  anchor: { top: number; left: number; bottom: number; right: number };
  text: string;
  defaultText: string | undefined;
}

/** Önizlemede tıklanan kullanıcı alanı (K321): isimler, başlık, mekân, tarih. */
export interface ActiveField {
  field: UserField;
  anchor: { top: number; left: number; bottom: number; right: number };
}

/** Geri alınabilen her şey: metinler, bölüm bayrakları ve kullanıcının kendi alanları (Faz 27.2). */
interface Snapshot {
  textOverrides: TextOverrides;
  flags: Record<ModuleId, boolean>;
  fields: Record<UserField, string>;
}

interface EditorState {
  active: ActiveText | null;
  activeField: ActiveField | null;
  section: SectionId | null;
  scope: ReportedScope | null;
  /** Bu tasarımda çizilen anahtarlar (panel "bu tasarımda görünmüyor" der). */
  seenKeys: readonly string[];
  history: History<Snapshot>;

  selectText: (active: ActiveText) => void;
  closeText: () => void;
  selectField: (active: ActiveField) => void;
  closeField: () => void;
  /** Kullanıcı alanını yazar (paket istemez); geri alınabilir. */
  saveField: (field: UserField, value: string) => void;
  saveText: (key: string, text: string, defaultValue: string | undefined) => void;
  resetText: (key: string) => void;
  resetTexts: (keys?: readonly string[]) => void;
  setModule: (id: ModuleId, on: boolean) => void;
  openSection: (id: SectionId | null) => void;
  undo: () => void;
  redo: () => void;
  reportScope: (scope: ReportedScope) => void;
  markSeen: (key: string) => void;
  /** Belge değişti (başka davetiye açıldı / sıfırlandı): oturum durumu atılır. */
  resetSession: () => void;
}

function locale(invitation: Invitation): InvitationLocale {
  return isInvitationLocale(invitation.locale) ? invitation.locale : DEFAULT_INVITATION_LOCALE;
}

function snapshot(invitation: Invitation): Snapshot {
  const flags = {} as Record<ModuleId, boolean>;
  for (const [id, flag] of Object.entries(MODULE_FLAGS) as [ModuleId, keyof Invitation][]) {
    flags[id] = Boolean(invitation[flag]);
  }
  return { textOverrides: invitation.textOverrides ?? {}, flags, fields: userFieldValues(invitation) };
}

function apply(value: Snapshot): void {
  const { updateField } = useInvitationStore.getState();
  updateField('textOverrides', value.textOverrides);
  for (const [id, flag] of Object.entries(MODULE_FLAGS) as [ModuleId, keyof Invitation][]) {
    if (Boolean(useInvitationStore.getState().invitation[flag]) !== value.flags[id]) updateField(flag, value.flags[id]);
  }
  for (const field of USER_FIELDS) {
    if ((useInvitationStore.getState().invitation[field] ?? '') !== value.fields[field]) updateField(field, value.fields[field]);
  }
}

/** Seen-key yazımları tek karede toplanır: çizim sırasında her `InvText` ayrı bir set() çağırmasın. */
let pendingSeen = new Set<string>();
let seenFrame: number | null = null;

export const useEditorStore = create<EditorState>()((set, get) => {
  /** Bir değişikliği geçmişe yazar ve uygular. */
  const commit = (change: (invitation: Invitation) => void): void => {
    const before = snapshot(useInvitationStore.getState().invitation);
    change(useInvitationStore.getState().invitation);
    const after = snapshot(useInvitationStore.getState().invitation);
    if (JSON.stringify(before) === JSON.stringify(after)) return;
    set({ history: pushHistory(get().history, before) });
  };

  const defaultFor = (key: string): string | undefined => {
    const { invitation } = useInvitationStore.getState();
    const scope = get().scope;
    return defaultText(key, {
      locale: locale(invitation),
      categoryId: scope?.categoryId ?? invitation.categoryId,
      scopes: scope?.scopes,
      runtimeDefaults: scope?.runtimeDefaults
    });
  };

  return {
    active: null,
    activeField: null,
    section: null,
    scope: null,
    seenKeys: [],
    history: { past: [], future: [] },

    selectText: (active) => set({ active, activeField: null, section: null }),
    closeText: () => set({ active: null }),
    selectField: (activeField) => set({ activeField, active: null, section: null }),
    closeField: () => set({ activeField: null }),

    saveField: (field, value) =>
      commit(() => {
        useInvitationStore.getState().updateField(field, value);
      }),

    saveText: (key, text, defaultValue) =>
      commit((invitation) => {
        const next = withText(invitation.textOverrides, locale(invitation), key, text, defaultValue ?? defaultFor(key));
        useInvitationStore.getState().updateField('textOverrides', next);
      }),

    resetText: (key) =>
      commit((invitation) => {
        useInvitationStore.getState().updateField('textOverrides', withoutText(invitation.textOverrides, locale(invitation), key));
      }),

    resetTexts: (keys) =>
      commit((invitation) => {
        const lang = locale(invitation);
        const next = keys ? withoutKeys(invitation.textOverrides, lang, keys) : { ...invitation.textOverrides, [lang]: {} };
        useInvitationStore.getState().updateField('textOverrides', next);
      }),

    setModule: (id, on) =>
      commit(() => {
        useInvitationStore.getState().updateField(MODULE_FLAGS[id], on);
      }),

    openSection: (id) => set({ section: id, active: null, activeField: null }),

    undo: () => {
      const result = undoHistory(get().history, snapshot(useInvitationStore.getState().invitation));
      if (!result) return;
      apply(result.value);
      set({ history: result.history, active: null, activeField: null });
    },

    redo: () => {
      const result = redoHistory(get().history, snapshot(useInvitationStore.getState().invitation));
      if (!result) return;
      apply(result.value);
      set({ history: result.history, active: null, activeField: null });
    },

    reportScope: (scope) => {
      const current = get().scope;
      if (
        current &&
        current.categoryId === scope.categoryId &&
        current.scopes.join() === scope.scopes.join() &&
        JSON.stringify(current.runtimeDefaults ?? {}) === JSON.stringify(scope.runtimeDefaults ?? {})
      ) {
        return;
      }
      // Şablon değişti: eski şablonun çizdiği anahtarlar artık bilgi değil.
      pendingSeen = new Set();
      set({ scope, seenKeys: [] });
    },

    markSeen: (key) => {
      if (get().seenKeys.includes(key) || pendingSeen.has(key)) return;
      pendingSeen.add(key);
      if (seenFrame !== null) return;
      const flush = () => {
        seenFrame = null;
        const added = [...pendingSeen].filter((k) => !get().seenKeys.includes(k));
        pendingSeen = new Set();
        if (added.length) set({ seenKeys: [...get().seenKeys, ...added].sort() });
      };
      seenFrame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(flush) : (setTimeout(flush, 0) as unknown as number);
    },

    resetSession: () => {
      pendingSeen = new Set();
      set({ active: null, activeField: null, section: null, scope: null, seenKeys: [], history: { past: [], future: [] } });
    }
  };
});

export { HISTORY_LIMIT };

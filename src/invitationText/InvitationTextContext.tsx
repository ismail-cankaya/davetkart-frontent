import React, { createContext, useCallback, useContext, useMemo } from 'react';
import type { TemplateFlavor } from '../components/templates/shared/flavor';
import { defaultText, fixedText, resolveText, splitPlaceholder, type TextLookup } from './resolve';
import { DEFAULT_INVITATION_LOCALE, isInvitationLocale, type InvitationLocale, type TextOverrides } from './types';

/**
 * Editör köprüsü (Faz 25). Yalnızca editör önizlemesinde verilir; misafir sayfasında yoktur,
 * o yüzden `InvText` orada düz metin çizer ve DOM değişmez.
 */
export interface TextEditorBridge {
  /** Seçili anahtar: önizlemede vurgulanır. */
  activeKey: string | null;
  /** Kullanıcı bir metne tıkladı: editör yerinde düzenlemeyi açar. */
  select: (key: string, anchor: HTMLElement) => void;
}

interface DocumentTextValue {
  locale: InvitationLocale;
  overrides: TextOverrides | null;
  editor: TextEditorBridge | null;
}

interface ScopeTextValue {
  categoryId: string;
  scopes: readonly string[];
  runtimeDefaults?: Readonly<Record<string, string>>;
}

const DocumentTextContext = createContext<DocumentTextValue>({
  locale: DEFAULT_INVITATION_LOCALE,
  overrides: null,
  editor: null
});

const ScopeTextContext = createContext<ScopeTextValue>({ categoryId: 'dugun', scopes: [] });

/** Davetiye düzeyi: dil, kullanıcının metinleri, editör köprüsü. `TemplateRenderer` verir. */
export function InvitationTextProvider({
  locale,
  overrides,
  editor = null,
  children
}: {
  locale: string | null | undefined;
  overrides: TextOverrides | null | undefined;
  editor?: TextEditorBridge | null;
  children: React.ReactNode;
}) {
  const value = useMemo<DocumentTextValue>(
    () => ({
      locale: isInvitationLocale(locale) ? locale : DEFAULT_INVITATION_LOCALE,
      overrides: overrides ?? null,
      editor
    }),
    [locale, overrides, editor]
  );
  return <DocumentTextContext.Provider value={value}>{children}</DocumentTextContext.Provider>;
}

/** Şablon düzeyi: kategori ve şablona özel kapsamlar. `InvitationComposition` flavor'dan verir. */
export function InvitationTextScope({ flavor, children }: { flavor: TemplateFlavor; children: React.ReactNode }) {
  const value = useMemo<ScopeTextValue>(
    () => ({ categoryId: flavor.categoryId, scopes: flavor.textScopes ?? [], runtimeDefaults: flavor.textDefaults }),
    [flavor.categoryId, flavor.textScopes, flavor.textDefaults]
  );
  return <ScopeTextContext.Provider value={value}>{children}</ScopeTextContext.Provider>;
}

/**
 * `flavor` verilirse kapsam ondan okunur: şablon bileşeni `InvitationComposition`'ın ÜSTÜNDE çizildiği için
 * oradaki kapsam sağlayıcısını göremez (ör. `renderEnvelope`'a metin hazırlayan şablon).
 */
function useLookup(flavor?: TemplateFlavor): TextLookup {
  const doc = useContext(DocumentTextContext);
  const context = useContext(ScopeTextContext);
  const categoryId = flavor?.categoryId ?? context.categoryId;
  const scopes = flavor ? flavor.textScopes ?? [] : context.scopes;
  const runtimeDefaults = flavor ? flavor.textDefaults : context.runtimeDefaults;
  return useMemo(
    () => ({ locale: doc.locale, overrides: doc.overrides, categoryId, scopes, runtimeDefaults }),
    [doc.locale, doc.overrides, categoryId, scopes, runtimeDefaults]
  );
}

/** Öznitelik gibi düğüm alamayan yerler için: `const t = useInvText(); aria-label={t('timeline.heading')}`. */
export function useInvText(flavor?: TemplateFlavor): (key: string) => string {
  const lookup = useLookup(flavor);
  return useCallback((key: string) => resolveText(key, lookup), [lookup]);
}

/** Varsayılan metin (kullanıcının değişikliği yok sayılır): editörün "varsayılana dön" önizlemesi. */
export function useDefaultInvText(flavor?: TemplateFlavor): (key: string) => string | undefined {
  const lookup = useLookup(flavor);
  return useCallback((key: string) => defaultText(key, lookup), [lookup]);
}

/** Düzenlenemeyen metinler (erişilebilirlik etiketleri, sabit seçenekler). */
export function useFixedText(): (key: string) => string {
  const { locale } = useContext(DocumentTextContext);
  return useCallback((key: string) => fixedText(key, locale), [locale]);
}

/** Davetiyenin dili (tarih biçimi için). */
export function useInvitationLocale(): InvitationLocale {
  return useContext(DocumentTextContext).locale;
}

/** Editör köprüsü varsa (yalnızca editör önizlemesi). */
export function useTextEditor(): TextEditorBridge | null {
  return useContext(DocumentTextContext).editor;
}

interface InvTextProps {
  /** `text-slots.json`'daki anahtar. */
  k: string;
  /** `{ad}` yer tutucularının yerine konacak düğümler (`{ date: <span>…</span> }`). */
  slots?: Record<string, React.ReactNode>;
}

/**
 * Şablon metnini çizer. Misafir sayfasında yalnızca metindir (sarmalayıcı yok); editörde tıklanabilir.
 * 🔴 Metin düz yazıdır: HTML yorumlanmaz, React kaçışlar (K304).
 */
export function InvText({ k, slots }: InvTextProps) {
  const text = useInvText()(k);
  const editor = useTextEditor();
  const content = renderSlots(text, slots);
  if (!editor) return <>{content}</>;
  return <EditableTextMark k={k} editor={editor}>{content}</EditableTextMark>;
}

function renderSlots(text: string, slots: InvTextProps['slots']): React.ReactNode {
  if (!slots) return text;
  let nodes: React.ReactNode[] = [text];
  for (const [name, node] of Object.entries(slots)) {
    nodes = nodes.flatMap((part, index): React.ReactNode[] => {
      if (typeof part !== 'string') return [part];
      const split = splitPlaceholder(part, name);
      if (!split) return [part];
      return [split[0], <React.Fragment key={`${name}-${index}`}>{node}</React.Fragment>, split[1]];
    });
  }
  return nodes;
}

function EditableTextMark({ k, editor, children }: { k: string; editor: TextEditorBridge; children: React.ReactNode }) {
  const active = editor.activeKey === k;
  return (
    <span
      data-text-slot={k}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        editor.select(k, event.currentTarget);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        editor.select(k, event.currentTarget);
      }}
      className={
        'cursor-text rounded-[3px] outline-offset-2 transition-[outline-color] duration-150 ' +
        (active
          ? 'outline outline-2 outline-[#d946ef]'
          : 'outline outline-1 outline-dashed outline-transparent hover:outline-current/60 focus-visible:outline-current')
      }
    >
      {children}
    </span>
  );
}

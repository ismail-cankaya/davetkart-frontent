import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDefaultInvText, type TextEditorBridge } from './InvitationTextContext';

/** Editörde tıklanabilir metin (Faz 25, K306). Ayrı parça: misafir sayfası indirmez. */
export default function EditableTextMark({ k, text, editor, children }: { k: string; text: string; editor: TextEditorBridge; children: React.ReactNode }) {
  const active = editor.activeKey === k;
  const defaultFor = useDefaultInvText();
  const { t } = useTranslation();
  useEffect(() => {
    editor.markSeen(k);
  }, [editor, k]);
  const open = (target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    editor.select({
      key: k,
      anchor: { top: rect.top, left: rect.left, bottom: rect.bottom, right: rect.right },
      text,
      defaultText: defaultFor(k)
    });
  };
  return (
    <span
      data-text-slot={k}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={t('textEditor.markLabel', { text })}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        open(event.currentTarget);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        open(event.currentTarget);
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

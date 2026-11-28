import { useMemo } from 'react';
import { useEditorStore } from '../stores/useEditorStore';
import { useInvitationStore } from '../stores/useInvitationStore';
import { defaultText, fixedText, resolveText } from '../invitationText/resolve';
import { DEFAULT_INVITATION_LOCALE, isInvitationLocale } from '../invitationText/types';
import { buildPickIndex, nameVariants, type TextPick } from '../components/studio/canvas/textPicking';
import type { CanvasPicker } from '../components/studio/canvas/DeviceCanvas';

/**
 * Tarihin çizilebilecek hâlleri: tam, saatsiz, yalnızca saat (şablonların `formatDateStr` biçimiyle aynı seçenekler).
 * 🔴 `templates/utils` içe aktarılmaz: stüdyo onu çekerse şablonlardan ayrı parçaya düşer ve her şablonun ön yükleme
 * listesi büyür (misafir paketi bütçesi K237, Faz 28 ölçümü).
 */
function dateVariants(date: string): string[] {
  const parsed = new Date(date);
  if (!date.trim() || Number.isNaN(parsed.getTime())) return [];
  const full = parsed.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const day = parsed.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = parsed.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  return [full, day, time];
}

/**
 * Tasarım stüdyosunun tuval seçicisi (K321): önizlemede tıklanan metni kullanıcının alanıyla (isimler, başlık, alt
 * başlık, mekân, tarih) ya da bu tasarımda dize olarak çizilen şablon metniyle eşler ve ilgili düzenleyiciyi açar.
 * Ayrıntı: docs/rehber/src/hooks/useCanvasPicker.md
 */
export function useCanvasPicker(): CanvasPicker {
  const invitation = useInvitationStore((s) => s.invitation);
  const seenKeys = useEditorStore((s) => s.seenKeys);
  const scope = useEditorStore((s) => s.scope);

  const index = useMemo(() => {
    const locale = isInvitationLocale(invitation.locale) ? invitation.locale : DEFAULT_INVITATION_LOCALE;
    const lookup = {
      locale,
      categoryId: scope?.categoryId ?? invitation.categoryId,
      scopes: scope?.scopes,
      runtimeDefaults: scope?.runtimeDefaults,
      overrides: invitation.textOverrides
    };
    const names = invitation.names?.trim() ? nameVariants(invitation.names) : [fixedText('names.placeholder', locale)];
    return buildPickIndex({
      fields: {
        names,
        title: [invitation.title ?? ''],
        subtitle: [invitation.subtitle ?? ''],
        venue: [invitation.venue ?? ''],
        date: dateVariants(invitation.date ?? '')
      },
      slots: seenKeys.map((key) => [key, resolveText(key, lookup)] as const)
    });
  }, [invitation.locale, invitation.categoryId, invitation.textOverrides, invitation.names, invitation.title, invitation.subtitle, invitation.venue, invitation.date, scope, seenKeys]);

  return useMemo<CanvasPicker>(
    () => ({
      index,
      onPick: (pick: TextPick, anchor) => {
        const editor = useEditorStore.getState();
        if (pick.kind === 'field') {
          editor.selectField({ field: pick.field, anchor });
          return;
        }
        const current = useInvitationStore.getState().invitation;
        const locale = isInvitationLocale(current.locale) ? current.locale : DEFAULT_INVITATION_LOCALE;
        const lookup = { locale, categoryId: editor.scope?.categoryId ?? current.categoryId, scopes: editor.scope?.scopes, runtimeDefaults: editor.scope?.runtimeDefaults };
        editor.selectText({
          key: pick.key,
          anchor,
          text: resolveText(pick.key, { ...lookup, overrides: current.textOverrides }),
          defaultText: defaultText(pick.key, lookup)
        });
      }
    }),
    [index]
  );
}

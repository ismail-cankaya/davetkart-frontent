import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { discardPendingChanges } from '../stores/pendingChangesActions';
import { confirmAction } from '../components/ui/ConfirmDialog';
import { toast } from '../components/ui/Toast';
import { toDisplayError } from '../utils/toDisplayError';
import '../i18nEditor';

/** "Vazgeç" (Faz 27.3, K323): onay sorar, yayınlanmamış değişiklikleri atar, editöre canlı hâli yükler. */
export function useDiscardChanges(): () => Promise<void> {
  const { t } = useTranslation();
  return useCallback(async () => {
    const confirmed = await confirmAction({
      title: t('textEditor.publish.discardTitle'),
      description: t('textEditor.publish.discardBody'),
      confirmLabel: t('textEditor.publish.discardConfirm'),
      cancelLabel: t('textEditor.inline.cancel')
    });
    if (!confirmed) return;
    try {
      await discardPendingChanges();
      toast(t('textEditor.publish.discarded'), 'info');
    } catch (error) {
      toast(toDisplayError(error), 'error');
    }
  }, [t]);
}

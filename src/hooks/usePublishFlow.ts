import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInvitationStore } from '../stores/useInvitationStore';
import { publishPendingChanges } from '../stores/pendingChangesActions';
import { paywallFromError, useSubscriptionStore } from '../stores/useSubscriptionStore';
import { apiErrorCode } from '../services/api';
import { toast } from '../components/ui/Toast';
import { toDisplayError } from '../utils/toDisplayError';
import '../i18nEditor';

/**
 * Yayınlamayı dener ve sunucunun kararına göre ilerler (tasarım stüdyosu ve paywall'ın "metinleri sıfırla ve
 * yayınla" yolu, Faz 25 K312 aynı akışı kullanır).
 *
 * 🔴 Ön kontrol YOK: tek doğruluk kaynağı sunucudur (`orders` tablosu) — deneriz, 402 gelirse paywall'ı
 * sunucunun bildirdiği planla açarız. İki 402 iki ayrı ekrandır; eşleme `paywallFromError`'da.
 */
export function usePublishFlow(): { isPublishing: boolean; attemptPublish: () => Promise<void> } {
  const publishInvitation = useInvitationStore((s) => s.publishInvitation);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isPublishing, setIsPublishing] = useState(false);
  const busy = useRef(false);

  const attemptPublish = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setIsPublishing(true);

    try {
      // Faz 27.3 (K323): yayındaki davetiyede "yayınla" taslağı canlıya uygular; sayfa değişmez.
      if (useInvitationStore.getState().recordStatus === 'published') {
        await publishPendingChanges();
        toast(t('textEditor.publish.changesDone'));
        return;
      }
      await publishInvitation();
      toast(t('textEditor.publish.done'));
      navigate('/dashboard');
    } catch (error) {
      const { invitation, recordId } = useInvitationStore.getState();
      const paywall = paywallFromError(error, invitation, recordId);
      if (paywall) {
        useSubscriptionStore.getState().openPaywall(paywall);
        return;
      }
      // Zaten yayındaysa kullanıcı hedefine ulaşmış demektir; hata gibi göstermek onu yeniden denemeye iterdi.
      if (apiErrorCode(error) === 'INVITATION_ALREADY_PUBLISHED') {
        toast(t('textEditor.publish.already'), 'info');
        navigate('/dashboard');
        return;
      }
      toast(toDisplayError(error), 'error');
    } finally {
      busy.current = false;
      setIsPublishing(false);
    }
  }, [navigate, publishInvitation, t]);

  return { isPublishing, attemptPublish };
}

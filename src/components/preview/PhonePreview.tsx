import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { useRsvpStore } from '../../stores/useRsvpStore';
import { previewLinkService } from '../../services/previewLink';
import type { Invitation } from '../../types';
import '../../i18nEditor';

/**
 * "Telefonda aç" sayfası (Faz 29.4, K328): imzalı bağlantıyla canlı + yayınlanmamış taslak, misafir sayfası gibi.
 * LCV ve misafir yüklemesi kapalı (kapsam boş: hiçbir şey gerçek davetiyeye yazılmaz). Ayrıntı: docs/rehber/src/pages/PreviewPage.md
 */
export default function PhonePreview() {
  const { t } = useTranslation();
  const { id = '' } = useParams<{ id: string }>();
  const { search } = useLocation();
  const [invitation, setInvitation] = useState<Invitation | null | 'missing'>(null);
  const setInvitationScope = useRsvpStore((s) => s.setInvitationScope);

  useEffect(() => {
    setInvitationScope(null);
    document.head.insertAdjacentHTML('beforeend', '<meta name="robots" content="noindex, nofollow" data-preview-robots>');
    return () => document.head.querySelector('[data-preview-robots]')?.remove();
  }, [setInvitationScope]);

  useEffect(() => {
    let cancelled = false;
    previewLinkService
      .open(id, search)
      .then((loaded) => !cancelled && setInvitation(loaded))
      .catch(() => !cancelled && setInvitation('missing'));
    return () => {
      cancelled = true;
    };
  }, [id, search]);

  if (invitation === null || invitation === 'missing') {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-emerald-950 px-6 text-center font-serif text-lg text-emerald-50">
        {invitation === 'missing' ? t('textEditor.phone.missing') : t('textEditor.phone.loading')}
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full">
      <TemplateRenderer templateId={invitation.imageTheme} invitation={invitation} mode="live" />
      <p className="pointer-events-none fixed inset-x-0 top-2 z-50 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur">
        <Eye size={12} />
        {t('textEditor.phone.banner')}
      </p>
    </div>
  );
}

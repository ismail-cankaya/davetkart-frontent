import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { TemplateRenderer } from '../components/templates/TemplateRenderer';
import { RsvpModal } from '../components/preview/RsvpModal';
import { useUIStore } from '../stores/useUIStore';
import { publicInvitationService } from '../services/publicInvitation';
import { apiErrorCode } from '../services/api';
import { toDisplayError } from '../utils/toDisplayError';
import { TEMPLATE_PRESETS } from '../data';
import { Invitation } from '../types';

/**
 * Misafirin paylaşılan `/invite/:id` linkinden açtığı public davetiye sayfası.
 * Chrome'suz (header/footer yok) ve tam ekran çizilir.
 *
 * Faz 4: sayfa artık yerel store'u değil, `GET /api/public/invitations/:id`
 * ucundan gelen GERÇEK kaydı çiziyor.
 * Ayrıntılı açıklama: docs/rehber/src/pages/InvitePage.md
 */

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; invitation: Invitation }
  | { status: 'missing' }
  // Sebep taşınır: kopuk bağlantı ile sunucu hatası aynı cümleyi hak etmez.
  | { status: 'error'; detail: string };

/** Şablon anahtarı katalogda yoksa ilk hazır şablona düşülür. */
function resolvePresetId(imageTheme: string): string {
  return TEMPLATE_PRESETS.some((preset) => preset.id === imageTheme)
    ? imageTheme
    : TEMPLATE_PRESETS[0].id;
}

function FullScreen({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center gap-3 bg-emerald-950 px-6 text-center">
      <p className="font-serif text-xl text-emerald-50">{title}</p>
      {detail && <p className="text-sm text-emerald-200/70">{detail}</p>}
    </div>
  );
}

export default function InvitePage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  const isRsvpModalOpen = useUIStore((s) => s.isRsvpModalOpen);
  const setRsvpModalOpen = useUIStore((s) => s.setRsvpModalOpen);

  useEffect(() => {
    if (!id) {
      setState({ status: 'missing' });
      return;
    }

    // Yarış koruması: id değişirse veya bileşen sökülürse geç gelen yanıt
    // artık geçerli olmayan bir durumu yazmasın.
    let cancelled = false;
    setState({ status: 'loading' });

    publicInvitationService
      .get(id)
      .then((view) => {
        if (!cancelled) {
          setState({ status: 'ready', invitation: view.invitation });
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        // 🔴 Yayınlanmamış, silinmiş ve hiç var olmayan davetiye AYNI kodu
        // döner. Ayrım yapmıyoruz — yapamayız da, backend bilerek vermiyor.
        setState(
          apiErrorCode(error) === 'RESOURCE_NOT_FOUND'
            ? { status: 'missing' }
            : { status: 'error', detail: toDisplayError(error) },
        );
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === 'loading') {
    return <FullScreen title="Davetiye yükleniyor…" />;
  }

  if (state.status === 'missing') {
    return (
      <FullScreen
        title="Bu davetiye bulunamadı."
        detail="Bağlantı hatalı olabilir ya da davetiye yayından kaldırılmış olabilir."
      />
    );
  }

  if (state.status === 'error') {
    return (
      <FullScreen
        title="Davetiye şu an açılamıyor."
        detail={state.detail}
      />
    );
  }

  return (
    <div className="h-dvh w-full relative overflow-hidden bg-emerald-950">
      <TemplateRenderer
        templateId={resolvePresetId(state.invitation.imageTheme)}
        invitation={state.invitation}
        onRsvpClick={() => setRsvpModalOpen(true)}
        mode="live"
      />

      <AnimatePresence>{isRsvpModalOpen && <RsvpModal />}</AnimatePresence>
    </div>
  );
}

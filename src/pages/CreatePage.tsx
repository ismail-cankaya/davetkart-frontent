import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryStep } from '../components/create/CategoryStep';
import { ThemeStep } from '../components/create/ThemeStep';
import { DetailsFormStep } from '../components/create/DetailsFormStep';
import { GenerationLoader } from '../components/create/GenerationLoader';
import { EditorWorkspace } from '../components/create/EditorWorkspace';
import { PaywallModal } from '../components/payment/PaywallModal';
import { useCreateWizardStore } from '../stores/useCreateWizardStore';
import { useSubscriptionStore } from '../stores/useSubscriptionStore';
import { useInvitationAutoSave } from '../hooks/useInvitationAutoSave';
import { useInvitationStore } from '../stores/useInvitationStore';
import { invitationService } from '../services/invitations';
import { toast } from '../components/ui/Toast';
import { toDisplayError } from '../utils/toDisplayError';
import { duration, ease } from '../utils/motion';

/**
 * The invitation-creation wizard, staged as:
 *   1. category pick → 2. theme pick + details form (revealed progressively
 *   on the same scrollable page) → 3. staged "generation" loading screen →
 *   4. editor workspace (designer panel + phone preview + publish actions).
 *
 * Stage state lives in useCreateWizardStore, so an auth round-trip
 * (publish → /login → back) lands the user exactly where they left off.
 */
export default function CreatePage() {
  const stage = useCreateWizardStore(s => s.stage);
  const categoryId = useCreateWizardStore(s => s.categoryId);
  const themeChosen = useCreateWizardStore(s => s.themeChosen);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recordId = useInvitationStore(s => s.recordId);

  // Debounced cloud auto-save covers every wizard stage — details form edits
  // and the editor workspace both mutate useInvitationStore.
  useInvitationAutoSave();

  // 🔴 Plan duvarı bu sayfaya aittir (Faz 10). Sayfadan ayrılırken bekleyen
  // kaydetme boşaltılır ve 402'si sayfa kapandıktan SONRA gelebilir; duvar o
  // zaman görünmeden "açık" kalır ve kullanıcı başka bir davetiyeyi açtığında
  // eskisinin planıyla belirirdi. Girişte ve çıkışta kapatılır.
  useEffect(() => {
    useSubscriptionStore.getState().closePaywall();
    return () => useSubscriptionStore.getState().closePaywall();
  }, []);

  // K192 (FE-50, D2): kayıt açılınca kimlik adrese yazılır; yenileme, geri tuşu ve bağlantı aynı taslağa döner.
  useEffect(() => {
    if (!id && recordId) navigate(`/create/${recordId}`, { replace: true });
  }, [id, recordId, navigate]);

  // `/create/:id` editörde başka bir belge varken (ya da yenilemeden sonra) kaydı sunucudan yükler.
  // Sahiplik sunucuda: başkasının kimliği 404 alır (H7) → panel + mesaj.
  useEffect(() => {
    if (!id || useInvitationStore.getState().recordId === id) return;
    let cancelled = false;

    invitationService
      .get(id)
      .then(record => {
        if (cancelled) return;
        useInvitationStore.getState().loadRecord(record);
        useCreateWizardStore.getState().resumeEditor(record.invitation.categoryId || 'dugun');
      })
      .catch(error => {
        if (cancelled) return;
        toast(toDisplayError(error), 'error');
        navigate('/dashboard', { replace: true });
      });

    return () => {
      cancelled = true;
    };
  }, [id, recordId, navigate]);

  if (id && recordId !== id) {
    return (
      <div className="flex-grow flex items-center justify-center py-32">
        <Loader2 size={28} className="text-brand animate-spin" aria-hidden />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {stage === 'build' && (
          <motion.div key="build" exit={{ opacity: 0, y: -12 }} transition={{ duration: duration.base, ease: ease.in }}>
            <CategoryStep />
            <AnimatePresence>{categoryId !== null && <ThemeStep key="theme" />}</AnimatePresence>
            <AnimatePresence>{categoryId !== null && themeChosen && <DetailsFormStep key="form" />}</AnimatePresence>
          </motion.div>
        )}

        {stage === 'generating' && <GenerationLoader key="generating" />}

        {stage === 'editor' && <EditorWorkspace key="editor" />}
      </AnimatePresence>

      {/* 🔴 Plan duvarı sayfa seviyesinde, TEK kopya (Faz 10). Otomatik kaydetme
          her aşamayı kapsadığı gibi 402 de her aşamadan gelebilir: modül
          anahtarları "Tasarımını Düzenle"deki formda duruyor, yayınlama düğmesi
          stüdyoda. Duvar yalnızca stüdyoda yaşasaydı formdaki 402 hiçbir ekran
          açmazdı. */}
      <PaywallModal />
    </>
  );
}

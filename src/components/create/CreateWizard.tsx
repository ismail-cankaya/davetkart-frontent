import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryStep } from './CategoryStep';
import { ThemeStep } from './ThemeStep';
import { DetailsFormStep } from './DetailsFormStep';
import { GenerationLoader } from './GenerationLoader';
import { PaywallModal } from '../payment/PaywallModal';
import { useCreateWizardStore } from '../../stores/useCreateWizardStore';
import { useSubscriptionStore } from '../../stores/useSubscriptionStore';
import { useInvitationAutoSave } from '../../hooks/useInvitationAutoSave';
import { useInvitationStore } from '../../stores/useInvitationStore';
import { duration, ease } from '../../utils/motion';

/**
 * The invitation-creation wizard, staged as:
 *   1. category pick → 2. theme pick + details form (revealed progressively
 *   on the same scrollable page) → 3. staged "generation" loading screen →
 *   4. the Design Studio (`/studio`, Faz 28 K322).
 *
 * Stage state lives in useCreateWizardStore, so an auth round-trip
 * (publish → /login → back) lands the user exactly where they left off.
 */
export default function CreateWizard() {
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

  // Faz 28 (K322): tek editör. Kayıtlı davetiye ve sihirbazın sonu Tasarım Stüdyosu'nda açılır; sihirbaz forma
  // döner ki stüdyodan geri gelen kullanıcı bilgilerini (silinmeden) bulsun.
  useEffect(() => {
    if (id) {
      navigate(`/studio/${id}`, { replace: true });
      return;
    }
    if (stage !== 'editor') return;
    navigate(recordId ? `/studio/${recordId}` : '/studio', { replace: true });
    useCreateWizardStore.getState().backToBuild();
  }, [id, stage, recordId, navigate]);

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

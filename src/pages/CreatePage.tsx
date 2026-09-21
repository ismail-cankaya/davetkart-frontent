import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryStep } from '../components/create/CategoryStep';
import { ThemeStep } from '../components/create/ThemeStep';
import { DetailsFormStep } from '../components/create/DetailsFormStep';
import { GenerationLoader } from '../components/create/GenerationLoader';
import { EditorWorkspace } from '../components/create/EditorWorkspace';
import { useCreateWizardStore } from '../stores/useCreateWizardStore';
import { useInvitationAutoSave } from '../hooks/useInvitationAutoSave';
import { ease } from '../utils/motion';

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

  // Debounced cloud auto-save covers every wizard stage — details form edits
  // and the editor workspace both mutate useInvitationStore.
  useInvitationAutoSave();

  return (
    <AnimatePresence mode="wait">
      {stage === 'build' && (
        <motion.div key="build" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: ease.out }}>
          <CategoryStep />
          <AnimatePresence>{categoryId !== null && <ThemeStep key="theme" />}</AnimatePresence>
          <AnimatePresence>{categoryId !== null && themeChosen && <DetailsFormStep key="form" />}</AnimatePresence>
        </motion.div>
      )}

      {stage === 'generating' && <GenerationLoader key="generating" />}

      {stage === 'editor' && <EditorWorkspace key="editor" />}
    </AnimatePresence>
  );
}

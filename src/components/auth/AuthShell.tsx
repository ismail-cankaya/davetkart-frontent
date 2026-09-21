import React from 'react';
import { motion } from 'motion/react';
import { BrandMark } from '../ui/BrandMark';
import { ease } from '../../utils/motion';

/** Shared input styling for the auth forms (mirrors the designer panel). */
export const authInputClass =
  'w-full bg-white/5 border border-white/15 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 transition-all duration-300';

interface AuthShellProps {
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  /** Cross-link under the card (e.g. “Hesabınız yok mu? Kayıt olun”). */
  footer: React.ReactNode;
}

/**
 * Premium full-height stage for the authentication pages: deep emerald
 * gradient, ambient glows and a glassmorphism card with a motion entrance.
 */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <section className="flex-grow min-h-[calc(100dvh-72px)] flex items-center justify-center bg-gradient-to-b from-brand-deep via-emerald-950 to-brand-deep relative overflow-hidden py-16 px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: ease.out }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/[0.07] backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-black/25 space-y-7">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-gold/25 text-gold mx-auto">
              <BrandMark size={24} />
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">{title}</h1>
            <p className="text-emerald-100/60 text-xs leading-relaxed max-w-xs mx-auto">{subtitle}</p>
          </div>

          {children}
        </div>

        <p className="text-center text-emerald-100/60 text-xs mt-6">{footer}</p>
      </motion.div>
    </section>
  );
}

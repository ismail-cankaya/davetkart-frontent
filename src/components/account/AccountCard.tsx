import React from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { duration, ease } from '../../utils/motion';

interface AccountCardProps {
  icon: LucideIcon;
  title: string;
  description?: React.ReactNode;
  /** `danger`: geri alınamaz işlemler (hesabı sil). */
  tone?: 'default' | 'danger';
  /** Başlığın sağındaki eylem (ör. "Tümünü kapat"). */
  action?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Hesap ayarlarının tek kart dili (Faz 14). Her bölüm aynı başlık + ikon
 * düzenini kullanır; bölüm sayfaları yalnızca içeriği bilir.
 */
export function AccountCard({ icon: Icon, title, description, tone = 'default', action, children }: AccountCardProps) {
  const danger = tone === 'danger';

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.panel, ease: ease.out }}
      className={cn(
        'rounded-[1.5rem] bg-white border shadow-sm p-6 md:p-8 space-y-5',
        danger ? 'border-rose-200/70' : 'border-ink/[0.06]',
      )}
    >
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center',
              danger ? 'bg-rose-50 text-rose-700 border-rose-200/70' : 'bg-brand/5 text-brand border-brand/10',
            )}
          >
            <Icon size={18} aria-hidden />
          </span>
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-ink">{title}</h2>
            {description && <div className="text-sm text-muted leading-relaxed">{description}</div>}
          </div>
        </div>
        {action && <div className="shrink-0 pl-[3.25rem] sm:pl-0">{action}</div>}
      </header>
      {children}
    </motion.section>
  );
}

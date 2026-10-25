import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { KeyRound, LayoutGrid, ReceiptText, ShieldCheck, Ticket } from 'lucide-react';
import { cn } from '../../utils/cn';
import { duration, ease } from '../../utils/motion';

/** Hesap ayarlarının bölümleri. Yollar paylaşılabilir: `/hesap/planlarim`. */
export const ACCOUNT_SECTIONS = [
  { to: '/hesap', label: 'Genel Bakış', icon: LayoutGrid, end: true },
  { to: '/hesap/planlarim', label: 'Planlarım', icon: Ticket, end: false },
  { to: '/hesap/siparisler', label: 'Siparişlerim', icon: ReceiptText, end: false },
  { to: '/hesap/guvenlik', label: 'Giriş ve Güvenlik', icon: KeyRound, end: false },
  { to: '/hesap/gizlilik', label: 'Gizlilik ve Hesap', icon: ShieldCheck, end: false },
] as const;

/**
 * Masaüstünde sol menü, mobilde yatay kaydırılan sekme şeridi (Faz 14).
 * Aktif göstergesi `layoutId` ile bölümler arasında kayar.
 */
export function AccountNav() {
  return (
    <nav aria-label="Hesap ayarları" className="-mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto lg:overflow-visible">
      <ul className="flex lg:flex-col gap-1.5 min-w-max lg:min-w-0">
        {ACCOUNT_SECTIONS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-2.5 px-4 py-2.5 rounded-full lg:rounded-xl text-sm font-semibold transition-colors duration-300 whitespace-nowrap',
                  isActive ? 'text-brand' : 'text-muted hover:text-ink',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="account-nav-active"
                      transition={{ duration: duration.base, ease: ease.inOut }}
                      className="absolute inset-0 rounded-full lg:rounded-xl bg-white border border-brand/15 shadow-sm"
                      aria-hidden
                    />
                  )}
                  <Icon size={16} className="relative" aria-hidden />
                  <span className="relative">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

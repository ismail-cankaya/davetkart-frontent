import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { BrandMark } from '../ui/BrandMark';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useAuthStore } from '../../stores/useAuthStore';
import { signOut } from '../../stores/sessionActions';
import { fullName } from '../../utils/user';

const NAV_LINKS = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/create', labelKey: 'nav.create' },
  { to: '/dashboard', labelKey: 'nav.dashboard' }
];

const menuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto' as const,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.05, delayChildren: 0.1 }
  },
  exit: { opacity: 0, height: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } }
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0 }
};

export const Header = React.memo(function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerRef = useRef<HTMLElement>(null);

  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  /**
   * 🔴 "Kaydırıldı" görünümü React state DEĞİL, header'ın `data-scrolled`
   * özniteliğidir; stili Tailwind `data-scrolled:` varyantları verir.
   *
   * State olduğunda ilk kaydırmanın en kalabalık ilk karelerinde Header (ve
   * içindeki Motion bileşenleri) iki kez yeniden render oluyordu. Görünüm
   * yalnızca CSS'i ilgilendirir; öznitelik eşik geçildiğinde bir kez yazılır.
   */
  const syncScrolled = (y: number) => {
    const header = headerRef.current;
    if (!header) return;
    const scrolled = y > 12;
    if ('scrolled' in header.dataset === scrolled) return;
    if (scrolled) header.dataset.scrolled = '';
    else delete header.dataset.scrolled;
  };
  useMotionValueEvent(scrollY, 'change', syncScrolled);
  // Sayfa kaydırılmış hâlde açılırsa (geri gelme, yenileme) ilk karede doğru görünsün.
  useEffect(() => syncScrolled(scrollY.get()), [scrollY]);

  return (
    <motion.header
      ref={headerRef}
      data-menu-open={mobileMenuOpen ? '' : undefined}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      // `transition-all` DEĞİL: header'ın girişini Motion her karede
      // `transform` yazarak yapar ve `all` bu yazımların her birini yeni bir
      // CSS geçişine çevirirdi. İlk kaydırmada yalnızca zemin, kenarlık ve
      // gölge değişir; backdrop-blur neredeyse düz krem zemin üzerinde anında
      // açılır ve GPU'da 500 ms boyunca her karede yeniden bulanıklaştırılmaz.
      className={[
        'sticky top-0 z-50 border-b bg-transparent border-transparent',
        'transition-[background-color,border-color,box-shadow] duration-500',
        'data-scrolled:bg-white/85 data-scrolled:backdrop-blur-xl data-scrolled:border-ink/5 data-scrolled:shadow-[0_1px_20px_rgba(20,32,27,0.06)]',
        'data-menu-open:bg-white/85 data-menu-open:backdrop-blur-xl data-menu-open:border-ink/5 data-menu-open:shadow-[0_1px_20px_rgba(20,32,27,0.06)]'
      ].join(' ')}
    >
      <div className="flex justify-between items-center w-full px-4 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Brand */}
        <Link className="flex items-center gap-2.5 group" to="/">
          <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-brand text-champagne shadow-md shadow-brand/20 group-hover:shadow-lg group-hover:shadow-brand/30 group-hover:-translate-y-0.5 transition-all duration-500">
            <BrandMark size={19} />
          </span>
          <span className="font-serif text-lg md:text-xl font-bold text-brand tracking-tight">
            Davet<span className="italic font-medium text-gold">Kart</span>
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative transition-colors duration-300 font-medium text-sm group py-1 ${
                  isActive ? 'text-brand' : 'text-muted hover:text-brand'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {t(link.labelKey)}
                  <span
                    className={`absolute start-0 -bottom-0.5 w-full h-px bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? 'scale-x-100'
                        : 'origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile keeps the top bar minimal: the switcher lives inside the hamburger menu. */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          {isAuthenticated ? (
            <>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 text-muted hover:text-brand font-semibold text-sm transition-colors duration-300 py-2 px-4 cursor-pointer"
              >
                <LogOut size={14} />
                {t('auth.logout')}
              </button>
              <Link
                to="/dashboard"
                className="relative overflow-hidden bg-brand text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-soft transition-all duration-500 shadow-md shadow-brand/15 hover:shadow-lg hover:shadow-brand/25 hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <span className="absolute inset-0 animate-shimmer pointer-events-none" />
                <LayoutDashboard size={14} />
                <span className="max-w-28 truncate">{(user && fullName(user)) || t('auth.myPanel')}</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:block text-muted hover:text-brand font-semibold text-sm transition-colors duration-300 py-2 px-4"
              >
                {t('auth.login')}
              </Link>
              <Link
                to="/register"
                className="relative overflow-hidden bg-brand text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-soft transition-all duration-500 shadow-md shadow-brand/15 hover:shadow-lg hover:shadow-brand/25 hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 animate-shimmer pointer-events-none" />
                {t('auth.register')}
              </Link>
            </>
          )}
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden text-brand p-1 h-9 w-9 rounded-full hover:bg-brand/5 flex items-center justify-center transition-colors"
            aria-label="Menü"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileMenuOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                className="flex"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden border-t border-ink/5 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-1">
              {NAV_LINKS.map(link => (
                <motion.span key={link.to} variants={menuItemVariants} className="contents">
                  <NavLink
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `font-medium text-base py-3 px-3 rounded-xl border-b border-ink/5 last:border-b-0 transition-colors ${
                        isActive ? 'text-brand bg-brand/[0.04]' : 'text-muted hover:text-brand hover:bg-brand/[0.03]'
                      }`
                    }
                    to={link.to}
                  >
                    {t(link.labelKey)}
                  </NavLink>
                </motion.span>
              ))}

              <motion.div variants={menuItemVariants} className="flex gap-3 mt-4">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-ink/5 text-center text-ink py-3 rounded-full font-semibold text-sm hover:bg-ink/10 transition-colors cursor-pointer"
                    >
                      {t('auth.logout')}
                    </button>
                    <Link
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 bg-brand text-white text-center py-3 rounded-full font-semibold text-sm shadow-md shadow-brand/20"
                      to="/dashboard"
                    >
                      {t('auth.myPanel')}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 bg-ink/5 text-center text-ink py-3 rounded-full font-semibold text-sm hover:bg-ink/10 transition-colors"
                      to="/login"
                    >
                      {t('auth.login')}
                    </Link>
                    <Link
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 bg-brand text-white text-center py-3 rounded-full font-semibold text-sm shadow-md shadow-brand/20"
                      to="/register"
                    >
                      {t('auth.register')}
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Language picker — chip grid, since the menu's overflow-hidden
                  would clip the floating dropdown variant. */}
              <motion.div variants={menuItemVariants} className="mt-5 pt-5 border-t border-ink/5">
                <LanguageSwitcher variant="inline" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
});

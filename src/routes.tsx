import React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RouteError } from './components/errors/RouteError';
import HomePage from './pages/HomePage';

// Pages beyond the landing load as separate chunks (FCP optimization).
const CreatePage = React.lazy(() => import('./pages/CreatePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const AccountPage = React.lazy(() => import('./pages/AccountPage'));
const AccountOverviewSection = React.lazy(() => import('./pages/account/AccountOverviewSection'));
const AccountPlansSection = React.lazy(() => import('./pages/account/AccountPlansSection'));
const AccountOrdersSection = React.lazy(() => import('./pages/account/AccountOrdersSection'));
const AccountSecuritySection = React.lazy(() => import('./pages/account/AccountSecuritySection'));
const AccountPrivacySection = React.lazy(() => import('./pages/account/AccountPrivacySection'));
const EmailChangeConfirmPage = React.lazy(() => import('./pages/EmailChangeConfirmPage'));
const EmailVerificationPage = React.lazy(() => import('./pages/EmailVerificationPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const InvitePage = React.lazy(() => import('./pages/InvitePage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const PaymentReturnPage = React.lazy(() => import('./pages/PaymentReturnPage'));

// Kurumsal sayfalar
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const PricingPage = React.lazy(() => import('./pages/PricingPage'));
const SustainabilityPage = React.lazy(() => import('./pages/SustainabilityPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));

// Yasal sayfalar
const TermsPage = React.lazy(() => import('./pages/legal/TermsPage'));
const PrivacyPage = React.lazy(() => import('./pages/legal/PrivacyPage'));
const CookiesPage = React.lazy(() => import('./pages/legal/CookiesPage'));

// Pages rendered inside the shared chrome (header, footer, assistant).
const appPages: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  {
    // Editör kendi sınırını taşır: kaydetme durumunu söyler (D3).
    path: '/create',
    element: <CreatePage />,
    errorElement: <RouteError scope="editor" />
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  // Şifre sıfırlama (Faz 10, FE 10.16). `/sifre-sifirla` maildeki
  // bağlantının hedefi: backend config/davetkart.php →
  // frontend.password_reset_path. Yol değişirse iki taraf birlikte değişir.
  { path: '/sifremi-unuttum', element: <ForgotPasswordPage /> },
  { path: '/sifre-sifirla', element: <ResetPasswordPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/pricing', element: <PricingPage /> },
  { path: '/sustainability', element: <SustainabilityPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/cookies', element: <CookiesPage /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  // Faz 14: e-posta değişikliği onayı. Oturum İSTEMEZ (bağlantı başka
  // cihazda açılabilir). Yol backend config/davetkart.php →
  // frontend.email_change_path ile aynı; biri değişirse ikisi birlikte.
  { path: '/eposta-onay', element: <EmailChangeConfirmPage /> },
  { path: '/eposta-dogrula', element: <EmailVerificationPage /> },
  {
    // Hesap ayarları (Faz 10'da tek sayfa, Faz 14'te bölümlü).
    path: '/hesap',
    element: (
      <ProtectedRoute>
        <AccountPage />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AccountOverviewSection /> },
      { path: 'planlarim', element: <AccountPlansSection /> },
      { path: 'siparisler', element: <AccountOrdersSection /> },
      { path: 'guvenlik', element: <AccountSecuritySection /> },
      { path: 'gizlilik', element: <AccountPrivacySection /> },
      { path: '*', element: <Navigate to="/hesap" replace /> }
    ]
  },
  {
    // Plan duvarının "Ödemeye Geç"i buraya gelir (utils/checkoutRoute.ts).
    // Sipariş uçları oturum ister; girişten sonra aynı adrese dönülür.
    path: '/odeme',
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    )
  },
  {
    // Sağlayıcının dönüş adresleri (backend config/payment.php → return_urls).
    // Faz 10 (10.27) öncesinde yoktu: `*` kullanıcıyı ana sayfaya atıyordu.
    path: '/odeme/basarili',
    element: (
      <ProtectedRoute>
        <PaymentReturnPage kind="success" />
      </ProtectedRoute>
    )
  },
  {
    path: '/odeme/hata',
    element: (
      <ProtectedRoute>
        <PaymentReturnPage kind="failure" />
      </ProtectedRoute>
    )
  }
];

// Error boundaries (FE-02, K222): a page error keeps the chrome (inner
// pathless route), a layout error replaces it; editor and guest page carry
// their own. Details: docs/rehber/src/routes.md
export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [{ errorElement: <RouteError />, children: appPages }]
  },
  {
    // Guest-facing invitation: rendered chrome-free outside the AppLayout.
    path: '/invite/:id',
    errorElement: <RouteError scope="guest" />,
    element: (
      <React.Suspense fallback={<div className="h-dvh w-full bg-emerald-950" />}>
        <InvitePage />
      </React.Suspense>
    )
  },
  { path: '*', element: <Navigate to="/" replace /> }
];

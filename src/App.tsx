import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { AppLayout } from './components/layout/AppLayout';
import { useDocumentDirection } from './hooks/useDocumentDirection';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';

// Pages beyond the landing load as separate chunks (FCP optimization).
const CreatePage = React.lazy(() => import('./pages/CreatePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const AccountPage = React.lazy(() => import('./pages/AccountPage'));
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

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/create', element: <CreatePage /> },
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
      {
        // Hesap bilgisi ve hesabı silme (Faz 10, FE 10.17).
        path: '/hesap',
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        )
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
    ]
  },
  {
    // Guest-facing invitation: rendered chrome-free outside the AppLayout.
    path: '/invite/:id',
    element: (
      <React.Suspense fallback={<div className="h-dvh w-full bg-emerald-950" />}>
        <InvitePage />
      </React.Suspense>
    )
  },
  { path: '*', element: <Navigate to="/" replace /> }
]);

function App() {
  // Flips <html dir> to rtl for Arabic and keeps <html lang> current.
  useDocumentDirection();
  return (
    // "Hareketi azalt" tercihi açıksa Motion transform/layout animasyonlarını
    // atlar, opaklık geçişlerini korur. `transform` dizesiyle yazılmış girişler
    // bunu kendi bileşenlerinde `useReducedMotion` ile ayrıca yapar.
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  );
}

export default App;

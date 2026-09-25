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
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const InvitePage = React.lazy(() => import('./pages/InvitePage'));
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
      // Ödeme sağlayıcısının dönüş adresleri — backend `PAYMENT_SUCCESS_URL` /
      // `PAYMENT_FAILURE_URL` ile birebir aynı olmalı. Eşleşmezse catch-all
      // kullanıcıyı `?order=` kaybolmuş hâlde ana sayfaya atar (F8 · B1).
      {
        path: '/odeme/basarili',
        element: (
          <ProtectedRoute>
            <PaymentReturnPage outcome="success" />
          </ProtectedRoute>
        )
      },
      {
        path: '/odeme/hata',
        element: (
          <ProtectedRoute>
            <PaymentReturnPage outcome="failure" />
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

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { AuthRedirectState } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * Gate for private routes: unauthenticated visitors are sent to /login and,
 * once signed in, come straight back to the page they originally wanted.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Sorgu da korunur: ödeme dönüşünde siparişi taşıyan `?order=` odur.
    const state: AuthRedirectState = { from: location.pathname + location.search };
    return <Navigate to="/login" replace state={state} />;
  }

  return children;
}

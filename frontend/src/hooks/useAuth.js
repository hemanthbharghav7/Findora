/**
 * hooks/useAuth.js
 * -----------------
 * Convenience hook for consuming AuthContext.
 * Throws early if used outside an <AuthProvider> so misuse fails loudly.
 *
 * Usage:
 *   const { user, login, logout, register } = useAuth();
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }

  return context;
}

export default useAuth;

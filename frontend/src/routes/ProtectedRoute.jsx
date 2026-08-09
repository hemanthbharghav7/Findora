/**
 * ProtectedRoute.jsx
 * ------------------
 * Route guard component for Findora.
 * Wraps authenticated pages; redirects unauthenticated users to /login.
 */

import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('findora_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

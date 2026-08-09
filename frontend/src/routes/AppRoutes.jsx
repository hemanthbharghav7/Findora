/**
 * AppRoutes.jsx
 * -------------
 * Central routing configuration for Findora.
 */

import { Routes, Route } from 'react-router-dom';

import Home        from '../pages/Home';
import Login       from '../pages/Login';
import Register    from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard   from '../pages/Dashboard';
import ReportItem  from '../pages/ReportItem';
import BrowseItems from '../pages/BrowseItems';
import ItemDetails from '../pages/ItemDetails';
import Profile     from '../pages/Profile';
import NotFound    from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import SidebarLayout  from '../components/layout/SidebarLayout';

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes ──────────────────────────────────── */}
      <Route path="/"         element={<Home />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ── App Layout Routes (With Sidebar) ────────────────── */}
      <Route element={<SidebarLayout />}>
        <Route path="/browse"   element={<BrowseItems />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/report"    element={<ProtectedRoute><ReportItem /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>

      {/* ── 404 Catch-all ──────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;

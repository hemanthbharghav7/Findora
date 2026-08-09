/**
 * SidebarLayout.jsx
 * ----------------
 * Layout wrapper component for Findora.
 * Renders the persistent sidebar and handles content area padding offset.
 */

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function SidebarLayout() {
  return (
    <div className="app-layout-wrapper">
      <Sidebar />
      <div className="app-layout-content">
        <Outlet />
      </div>
    </div>
  );
}

export default SidebarLayout;

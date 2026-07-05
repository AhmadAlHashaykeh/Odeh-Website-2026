import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminBreadcrumbProvider, useAdminBreadcrumbContext } from '../context/AdminBreadcrumbContext';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import '../ui/styles/admin-ui.css';
import styles from './AdminLayout.module.css';

function AdminLayoutInner() {
  const { breadcrumbs } = useAdminBreadcrumbContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const adminScroll = document.querySelector('[data-admin-scroll]');
    if (!adminScroll) return undefined;

    if (mobileOpen) {
      adminScroll.style.overflow = 'hidden';
    } else {
      adminScroll.style.overflow = '';
    }

    return () => {
      adminScroll.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div
      className={`${styles.layout} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
      data-admin-layout
    >
      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div
        className={styles.main}
        data-admin-scroll
        data-lenis-prevent
      >
        <AdminTopBar
          breadcrumbs={breadcrumbs}
          onMenuToggle={() => setMobileOpen((prev) => !prev)}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={() => setSidebarCollapsed((prev) => !prev)}
        />

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminBreadcrumbProvider>
      <AdminLayoutInner />
    </AdminBreadcrumbProvider>
  );
}

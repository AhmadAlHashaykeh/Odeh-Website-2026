import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import AdminIcon from '../components/AdminIcons';
import { resolvePermissionModule } from '../hooks/useModulePermissions';
import {
  adminDashboardItem,
  adminNavigationGroups,
  findNavGroupIdForPath,
  getInitialExpandedGroups,
  isNavItemActive,
} from '../config/adminNavigation';
import styles from './AdminSidebar.module.css';

const CMS_VERSION = '1.0.0';
const CMS_ENVIRONMENT = import.meta.env.PROD ? 'Production' : 'Development';

function NavItem({ item, collapsed, nested = false, onNavigate, tooltip }) {
  const linkClassName = ({ isActive }) =>
    [
      styles.navLink,
      nested ? styles.navLinkNested : '',
      isActive ? styles.active : '',
    ]
      .filter(Boolean)
      .join(' ');

  const tooltipText = collapsed ? (tooltip ?? item.label) : undefined;

  if (item.enabled) {
    return (
      <NavLink
        to={item.path}
        end={item.id === 'dashboard'}
        className={linkClassName}
        onClick={onNavigate}
        title={tooltipText}
        data-tooltip={tooltipText}
      >
        <span className={styles.navIcon}>
          <AdminIcon name={item.icon} size={nested ? 15 : 17} />
        </span>
        {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
      </NavLink>
    );
  }

  return (
    <span
      className={`${styles.navLink} ${nested ? styles.navLinkNested : ''} ${styles.disabled}`}
      title={tooltipText ?? (collapsed ? item.label : 'Coming soon')}
      data-tooltip={tooltipText}
      aria-disabled="true"
    >
      <span className={styles.navIcon}>
        <AdminIcon name={item.icon} size={nested ? 15 : 17} />
      </span>
      {!collapsed && (
        <>
          <span className={styles.navLabel}>{item.label}</span>
          <span className={styles.comingSoon}>Coming Soon</span>
        </>
      )}
    </span>
  );
}

function NavGroup({
  group,
  collapsed,
  expanded,
  onToggle,
  onNavigate,
  pathname,
  showDivider,
}) {
  const hasActiveChild = group.items.some((item) => isNavItemActive(item, pathname));
  const itemCount = group.items.length;

  if (collapsed) {
    return (
      <>
        {showDivider && (
          <li className={styles.collapsedGroupDivider} aria-hidden="true">
            <span className={styles.collapsedGroupDividerLine} />
          </li>
        )}
        {group.items.map((item) => (
          <li key={item.id} className={styles.navItem}>
            <NavItem
              item={item}
              collapsed={collapsed}
              onNavigate={onNavigate}
              tooltip={`${group.title} · ${item.label}`}
            />
          </li>
        ))}
      </>
    );
  }

  return (
    <li
      className={[
        styles.navGroup,
        hasActiveChild ? styles.navGroupActive : '',
        expanded ? styles.navGroupExpanded : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className={styles.groupToggle}
        aria-expanded={expanded}
        onClick={() => onToggle(group.id)}
      >
        <span className={styles.groupToggleMain}>
          <span className={styles.groupIcon} aria-hidden="true">
            <AdminIcon name={group.icon} size={14} />
          </span>
          <span className={styles.groupLabel}>{group.title}</span>
          <span className={styles.groupCount} aria-label={`${itemCount} items`}>
            {itemCount}
          </span>
        </span>
        <span
          className={[styles.groupChevron, expanded ? styles.groupChevronExpanded : '']
            .filter(Boolean)
            .join(' ')}
          aria-hidden="true"
        >
          <AdminIcon name="chevronDown" size={13} />
        </span>
      </button>

      <div
        className={[styles.groupContent, expanded ? styles.groupContentExpanded : '']
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!expanded}
      >
        <div className={styles.groupContentInner}>
          <ul className={styles.groupItems}>
            {group.items.map((item) => (
              <li key={item.id}>
                <NavItem item={item} collapsed={collapsed} nested onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

function useGroupedNavigation(collapsed, mobileOpen) {
  const [isTablet, setIsTablet] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (isTablet && mobileOpen) || (!isTablet && !collapsed);
}

function SidebarFooter({ compact, roleName }) {
  if (compact) {
    return (
      <div className={styles.footerCollapsed} aria-label="System information">
        <span
          className={styles.footerEnvDot}
          data-env={CMS_ENVIRONMENT.toLowerCase()}
          title={`${CMS_ENVIRONMENT} · v${CMS_VERSION}`}
        />
      </div>
    );
  }

  return (
    <div className={styles.footer}>
      <div className={styles.footerMeta}>
        <div className={styles.footerRow}>
          <span className={styles.footerKey}>CMS</span>
          <span className={styles.footerValue}>v{CMS_VERSION}</span>
        </div>
        <div className={styles.footerRow}>
          <span className={styles.footerKey}>Environment</span>
          <span className={styles.footerValue} data-env={CMS_ENVIRONMENT.toLowerCase()}>
            {CMS_ENVIRONMENT}
          </span>
        </div>
        <div className={styles.footerRow}>
          <span className={styles.footerKey}>Role</span>
          <span className={styles.footerValue}>{roleName}</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({ collapsed, mobileOpen, onClose }) {
  const { role, permissions } = useAuth();
  const { pathname } = useLocation();
  const roleName = role?.name ?? 'Administrator';
  const isSuperAdmin = role?.slug === 'super-admin';
  const showGroupedNav = useGroupedNavigation(collapsed, mobileOpen);
  const [expandedGroups, setExpandedGroups] = useState(() => getInitialExpandedGroups(pathname));

  const canViewModule = useMemo(() => {
    return (moduleId) => {
      if (isSuperAdmin) return true;
      const key = resolvePermissionModule(moduleId);
      return permissions?.[key]?.view === true;
    };
  }, [isSuperAdmin, permissions]);

  const visibleDashboardItem = useMemo(
    () => (canViewModule(adminDashboardItem.id) ? adminDashboardItem : null),
    [canViewModule],
  );

  const visibleNavigationGroups = useMemo(
    () =>
      adminNavigationGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => canViewModule(item.id)),
        }))
        .filter((group) => group.items.length > 0),
    [canViewModule],
  );

  useEffect(() => {
    const activeGroupId = findNavGroupIdForPath(pathname);
    if (!activeGroupId) return;

    setExpandedGroups((prev) => {
      if (prev[activeGroupId]) return prev;
      return { ...prev, [activeGroupId]: true };
    });
  }, [pathname]);

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${mobileOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}
        aria-label="Admin navigation"
      >
        <div className={styles.header}>
          <NavLink to="/admin/dashboard" className={styles.logo} onClick={onClose}>
            <img src="/odeh-logo2.png" alt="ODEH" className={styles.logoImg} />
            {!collapsed && (
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>ODEH</span>
                <span className={styles.logoSubtitle}>Admin CMS</span>
              </div>
            )}
          </NavLink>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navLevelPrimary}>
              {visibleDashboardItem && (
                <NavItem item={visibleDashboardItem} collapsed={collapsed} onNavigate={onClose} />
              )}
            </li>

            {visibleNavigationGroups.length > 0 && (
              <li className={styles.navLevelDivider} aria-hidden="true">
                <span className={styles.navLevelDividerLine} />
              </li>
            )}

            {showGroupedNav ? (
              <li className={styles.navLevelGroups}>
                <ul className={styles.navGroupsList}>
                  {visibleNavigationGroups.map((group, index) => (
                    <NavGroup
                      key={group.id}
                      group={group}
                      collapsed={collapsed}
                      expanded={expandedGroups[group.id]}
                      onToggle={toggleGroup}
                      onNavigate={onClose}
                      pathname={pathname}
                      showDivider={index > 0}
                    />
                  ))}
                </ul>
              </li>
            ) : (
              visibleNavigationGroups.flatMap((group, index) => [
                index > 0 ? (
                  <li
                    key={`divider-${group.id}`}
                    className={styles.collapsedGroupDivider}
                    aria-hidden="true"
                  >
                    <span className={styles.collapsedGroupDividerLine} />
                  </li>
                ) : null,
                ...group.items.map((item) => (
                  <li key={item.id} className={styles.navItem}>
                    <NavItem
                      item={item}
                      collapsed={collapsed}
                      onNavigate={onClose}
                      tooltip={`${group.title} · ${item.label}`}
                    />
                  </li>
                )),
              ])
            )}
          </ul>
        </nav>

        <SidebarFooter compact={!showGroupedNav} roleName={roleName} />
      </aside>
    </>
  );
}

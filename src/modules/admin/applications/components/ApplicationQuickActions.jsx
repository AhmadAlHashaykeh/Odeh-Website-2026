import { useEffect, useRef, useState } from 'react';
import AdminIcon from '../../components/AdminIcons';
import { applicationStatusLabels } from '../mock/applicationsData';
import styles from './ApplicationQuickActions.module.css';

function buildActions(application) {
  const statusActions = [
    { id: 'status-reviewed', label: 'Mark as Reviewed', icon: 'eye' },
    { id: 'status-shortlisted', label: 'Shortlist', icon: 'star' },
    { id: 'status-hired', label: 'Hire', icon: 'check' },
    { id: 'status-rejected', label: 'Reject', icon: 'close' },
    { id: 'status-new', label: 'Reset to New', icon: 'refresh' },
  ].filter((action) => {
    const target = action.id.replace('status-', '');
    return target !== application.status;
  });

  return [
    { id: 'view', label: 'View', icon: 'eye' },
    { id: 'change-status', label: 'Change Status', icon: 'filter', submenu: statusActions },
    { id: 'download-cv', label: 'Download CV', icon: 'export' },
    { id: 'open-linkedin', label: 'Open LinkedIn', icon: 'external' },
    { id: 'add-note', label: 'Add Note', icon: 'edit' },
    { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
  ];
}

export default function ApplicationQuickActions({ application, onView, onAction }) {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const wrapRef = useRef(null);
  const actions = buildActions(application);

  useEffect(() => {
    if (!open) return undefined;

    const handleClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) {
        setOpen(false);
        setSubmenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleAction = (actionId, submenuItem) => {
    if (actionId === 'change-status' && !submenuItem) {
      setSubmenuOpen((prev) => !prev);
      return;
    }

    setOpen(false);
    setSubmenuOpen(false);

    if (actionId === 'view') {
      onView?.(application.id);
      return;
    }

    if (submenuItem) {
      onAction?.(submenuItem.id, application);
      return;
    }

    onAction?.(actionId, application);
  };

  const statusSubmenu = actions.find((a) => a.id === 'change-status')?.submenu || [];

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Actions for ${application.applicantName}`}
        aria-expanded={open}
      >
        <AdminIcon name="more" size={16} />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          {actions.map((action) => (
            <div key={action.id} className={styles.menuGroup}>
              <button
                type="button"
                role="menuitem"
                className={`${styles.menuItem} ${action.danger ? styles.danger : ''} ${action.submenu ? styles.hasSubmenu : ''}`}
                onClick={() => handleAction(action.id)}
                aria-expanded={action.submenu ? submenuOpen : undefined}
              >
                <AdminIcon name={action.icon} size={15} />
                {action.label}
                {action.submenu && (
                  <AdminIcon name="chevronDown" size={12} className={styles.submenuChevron} />
                )}
              </button>

              {action.submenu && submenuOpen && (
                <div className={styles.submenu} role="menu">
                  {statusSubmenu.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      role="menuitem"
                      className={styles.submenuItem}
                      onClick={() => handleAction(action.id, sub)}
                    >
                      <AdminIcon name={sub.icon} size={14} />
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ApplicationStatusBadge({ status }) {
  const label = applicationStatusLabels[status] || status;
  const config = {
    new: styles.new,
    reviewed: styles.reviewed,
    shortlisted: styles.shortlisted,
    rejected: styles.rejected,
    hired: styles.hired,
  }[status] || styles.reviewed;

  return <span className={`${styles.statusBadge} ${config}`}>{label}</span>;
}
